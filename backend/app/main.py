import logging
import time
from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Response,
    Request,
    Cookie
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.db import (
    create_user,
    get_user_by_email,
    create_conversation,
    get_conversations,
    save_message,
    get_messages_for_user,
    conversation_belongs_to_user,
    get_user_by_id,
    update_conversation_timestamp,
    update_conversation_title,
    get_connection,
    create_document,
    create_ticket,
    get_tickets_for_user,
    get_ticket_for_user,
    get_dashboard_stats,
    get_all_tickets,
    get_ticket_details,
    get_user_by_id,
)
from app.schemas import LoginRequest, RegisterRequest
from app.security import (
    create_access_token,
    verify_password,
    decode_access_token,
    hash_password,
)
from app.ingestion import process_document
from app.ai import generate_answer
from app.rag import retrieve_context

logging.basicConfig(
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

app = FastAPI(title="SupportPilot API")

@app.exception_handler(Exception)
async def handle_unexpected_error(request, exc):
    logger.exception(
        "Unhandled server error: %s %s",
        request.method,
        request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
        },
    )

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start_time
    logger.info(
        "%s %s -> %s (%.3fs)",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+):3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_current_user(
    access_token: str | None = Cookie(default=None),
) -> int:
    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )
    try:
        return decode_access_token(access_token)
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token",
        )


class ChatRequest(BaseModel):
    message: str
    conversation_id: int


@app.get("/health")
def health():
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        return {
            "status": "ok",
            "database": "ok",
        }
    except Exception:
        logger.exception("Health check failed")
        raise HTTPException(
            status_code=503,
            detail="Service unavailable",
        )
    finally:
        if connection:
            connection.close()


@app.post("/chat")
def chat(
    request: ChatRequest,
    current_user_id: int = Depends(get_current_user),
):
    if not conversation_belongs_to_user(
        conversation_id=request.conversation_id,
        user_id=current_user_id,
    ):
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    logger.info(
        "Chat request: user_id=%s conversation_id=%s",
        current_user_id,
        request.conversation_id,
    )

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    save_message(
        conversation_id=request.conversation_id,
        role="user",
        content=request.message,
    )

    conversation_title = request.message.strip()
    if len(conversation_title) > 50:
        conversation_title = conversation_title[:50] + "..."

    update_conversation_title(
        request.conversation_id,
        conversation_title,
    )

    context = retrieve_context(request.message)
    assistant_message = generate_answer(
        question=request.message,
        context=context,
    )

    save_message(
        request.conversation_id,
        "assistant",
        assistant_message,
    )

    update_conversation_timestamp(
        request.conversation_id
    )

    citations = [
        {
            "document_id": doc["document_id"],
            "title": doc["title"],
            "chunk_id": doc["chunk_id"]
        }
        for doc in context
    ]

    return {
        "message": assistant_message,
        "citations": citations,
    }


class ConversationRequest(BaseModel):
    user_id: int = 1
    title: str = "Support conversation"


@app.post("/conversations")
def create_new_conversation(
    current_user_id: int = Depends(get_current_user),
):
    conversation_id = create_conversation(
        user_id=current_user_id,
        title="New conversation",
    )

    return {
        "conversation_id": conversation_id
    }


@app.get("/conversations/{conversation_id}/messages")
def get_conversation_messages(
    conversation_id: int,
    current_user_id: int = Depends(get_current_user),
):
    if not conversation_belongs_to_user(
        conversation_id=conversation_id,
        user_id=current_user_id,
    ):
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    rows = get_messages_for_user(
        conversation_id=conversation_id,
        user_id=current_user_id,
    )

    return {
        "conversation_id": conversation_id,
        "messages": [
            {
                "id": row[0],
                "role": row[1],
                "content": row[2],
                "created_at": row[3],
            }
            for row in rows
        ],
    }


@app.get("/conversations")
def list_conversations(
    current_user_id: int = Depends(get_current_user),
):
    rows = get_conversations(
        user_id=current_user_id
    )

    return {
        "conversations": [
            {
                "id": row[0],
                "title": row[1],
                "created_at": row[2],
                "updated_at": row[3],
            }
            for row in rows
        ]
    }


@app.post("/auth/register")
def register(request: RegisterRequest):
    existing_user = get_user_by_email(request.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered",
        )

    password_hash = hash_password(request.password)

    user_id = create_user(
        name=request.name,
        email=request.email,
        password_hash=password_hash,
    )

    logger.info(
        "User registered: user_id=%s",
        user_id,
    )

    return {
        "message": "User registered successfully",
        "user_id": user_id,
        "name": request.name,
        "email": request.email,
    }


@app.post("/auth/login")
def login(
    request: LoginRequest,
    response: Response,
):
    user = get_user_by_email(request.email)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    user_id = user[0]
    password_hash = user[3]

    if not password_hash:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        request.password,
        password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(user_id)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
        path="/",
    )

    logger.info(
        "User logged in: user_id=%s",
        user_id,
    )

    return {
        "message": "Login successful",
    }

@app.get("/auth/me")
def get_me(
    current_user_id: int = Depends(get_current_user),
):
    user_row = get_user_by_id(current_user_id)
    if not user_row:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
        
    return {
        "id": user_row[0],
        "name": user_row[1],
        "email": user_row[2],
    }

@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token"
    )

    logger.info("User logged out")

    return {
        "message": "Logout successful"
    }


@app.post("/documents")
def upload_document(
    title: str,
    content: str,
    current_user=Depends(get_current_user),
):
    document_id = create_document(
        title=title,
        source=None,
        content=content,
    )
    process_document(
        document_id=document_id,
        content=content,
    )
    return {
        "document_id": document_id,
        "message": "Document created",
    }


class TicketRequest(BaseModel):
    conversation_id: int
    subject: str
    description: str


@app.post("/tickets")
def create_new_ticket(
    request: TicketRequest,
    current_user_id: int = Depends(get_current_user),
):
    if not conversation_belongs_to_user(request.conversation_id, current_user_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    ticket_id = create_ticket(
        user_id=current_user_id,
        conversation_id=request.conversation_id,
        subject=request.subject,
        description=request.description,
    )
    return {"ticket_id": ticket_id, "message": "Ticket created"}


@app.get("/tickets")
def get_tickets(current_user_id: int = Depends(get_current_user)):
    rows = get_tickets_for_user(current_user_id)
    return {
        "tickets": [
            {
                "id": row[0],
                "conversation_id": row[1],
                "subject": row[2],
                "status": row[3],
                "created_at": row[4],
            }
            for row in rows
        ]
    }


@app.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: int, current_user_id: int = Depends(get_current_user)):
    row = get_ticket_for_user(ticket_id, current_user_id)
    if not row:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {
        "id": row[0],
        "conversation_id": row[1],
        "subject": row[2],
        "description": row[3],
        "status": row[4],
        "created_at": row[5],
    }


def get_current_agent(current_user_id: int = Depends(get_current_user)):
    user = get_user_by_id(current_user_id)
    if not user or user[4] not in ("agent", "admin"):
        raise HTTPException(status_code=403, detail="Forbidden")
    return current_user_id


@app.get("/admin/dashboard")
def get_dashboard(current_agent_id: int = Depends(get_current_agent)):
    return get_dashboard_stats()


@app.get("/admin/tickets")
def admin_get_tickets(current_agent_id: int = Depends(get_current_agent)):
    rows = get_all_tickets()
    return {
        "tickets": [
            {
                "id": row[0],
                "conversation_id": row[1],
                "subject": row[2],
                "status": row[3],
                "created_at": row[4],
                "customer_name": row[5],
            }
            for row in rows
        ]
    }


@app.get("/admin/tickets/{ticket_id}")
def admin_get_ticket(ticket_id: int, current_agent_id: int = Depends(get_current_agent)):
    row = get_ticket_details(ticket_id)
    if not row:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {
        "id": row[0],
        "conversation_id": row[1],
        "subject": row[2],
        "description": row[3],
        "status": row[4],
        "created_at": row[5],
        "customer_name": row[6],
    }