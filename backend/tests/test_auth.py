from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_rejects_invalid_email():
    response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "not-an-email",
            "password": "password123",
        },
    )
    assert response.status_code == 422

def test_register_rejects_short_password():
    response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "123",
        },
    )
    assert response.status_code == 422

def test_me_requires_authentication():
    response = client.get("/auth/me")
    assert response.status_code == 401
