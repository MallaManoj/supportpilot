from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

def test_password_hash_and_verify():
    password = "password123"
    password_hash = hash_password(password)

    assert password_hash != password
    assert verify_password(password, password_hash)
    assert not verify_password("wrongpassword", password_hash)

def test_access_token_round_trip():
    user_id = 123
    token = create_access_token(user_id)

    assert token
    assert decode_access_token(token) == user_id
