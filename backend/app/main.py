from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.db import create_conversation, save_message

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


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest):
    conversation_id = create_conversation(
        user_id=1,
        title="Support conversation",
    )

    save_message(
        conversation_id=conversation_id,
        role="user",
        content=request.message,
    )

    reply = f"SupportPilot received: {request.message}"

    save_message(
        conversation_id=conversation_id,
        role="assistant",
        content=reply,
    )

    return {
        "reply": reply,
        "conversation_id": conversation_id,
    }