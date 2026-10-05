from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_conversations_requires_authentication():
    response = client.get("/conversations")
    assert response.status_code == 401

def test_create_conversation_requires_authentication():
    response = client.post(
        "/conversations",
        json={},
    )
    assert response.status_code == 401

def test_chat_requires_authentication():
    response = client.post(
        "/chat",
        json={
            "message": "Hello",
            "conversation_id": 1,
        },
    )
    assert response.status_code == 401

def test_message_history_requires_authentication():
    response = client.get(
        "/conversations/1/messages"
    )
    assert response.status_code == 401
