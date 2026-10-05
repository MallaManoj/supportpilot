import pytest
from pydantic import ValidationError
from app.schemas import RegisterRequest

def test_register_request_accepts_valid_password():
    request = RegisterRequest(
        name="Test User",
        email="test@example.com",
        password="password123",
    )
    assert request.email == "test@example.com"

def test_register_request_rejects_short_password():
    with pytest.raises(ValidationError):
        RegisterRequest(
            name="Test User",
            email="test@example.com",
            password="123",
        )
