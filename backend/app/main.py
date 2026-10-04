from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.db import (
    create_conversation,
    get_conversations,
    get_messages,
    save_message,
)
app = FastAPI(title="SupportPilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: int

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest):
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
def create_new_conversation(request: ConversationRequest = ConversationRequest()):
    conversation_id = create_conversation(
        user_id=request.user_id,
        title=request.title,
    )

    return {
        "conversation_id": conversation_id,
    }


@app.get("/conversations/{conversation_id}/messages")
def get_conversation_messages(conversation_id: int):
    rows = get_messages(conversation_id)

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
def list_conversations():
    rows = get_conversations(user_id=1)

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