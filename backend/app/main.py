from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Response,
    Request
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.db import (
    create_user,
    get_user_by_email,
    create_conversation,
    get_conversations,
    save_message,
    get_messages_for_user,
    conversation_belongs_to_user,
)
from app.schemas import LoginRequest, RegisterRequest
from app.security import (
    create_access_token,
    verify_password,
    decode_access_token,
    hash_password,
)

app = FastAPI(title="SupportPilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
def health_check():
    return {"status": "ok"}


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

    save_message(
        conversation_id=request.conversation_id,
        role="user",
        content=request.message,
    )

    reply = f"SupportPilot received: {request.message}"

    save_message(
        conversation_id=request.conversation_id,
        role="assistant",
        content=reply,
    )

    return {
        "reply": reply,
        "conversation_id": request.conversation_id,
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
    )

    return {
        "message": "Login successful",
    }

@app.get("/auth/me")
def get_me(
    current_user_id: int = Depends(get_current_user),
):
    return {
        "user_id": current_user_id,
    }