from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "ok"

def test_logout_endpoint_requires_no_authentication():
    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Logout successful"

def test_invalid_login_returns_401():
    response = client.post(
        "/auth/login",
        json={
            "email": "does-not-exist@example.com",
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 401
