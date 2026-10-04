import os

import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not configured")

    return psycopg.connect(DATABASE_URL)


def save_conversation(user_message: str, assistant_message: str):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO conversations (user_message, assistant_message)
                VALUES (%s, %s)
                """,
                (user_message, assistant_message),
            )

        connection.commit()
    finally:
        connection.close()


def create_conversation(user_id: int, title: str | None = None) -> int:
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO conversations (user_id, title)
                VALUES (%s, %s)
                RETURNING id
                """,
                (user_id, title),
            )

            conversation_id = cursor.fetchone()[0]

        connection.commit()
        return conversation_id
    finally:
        connection.close()

def save_message(
    conversation_id: int,
    role: str,
    content: str,
) -> int:
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO messages (
                    conversation_id,
                    role,
                    content
                )
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (conversation_id, role, content),
            )

            message_id = cursor.fetchone()[0]

        connection.commit()
        return message_id
    finally:
        connection.close()


def get_messages(conversation_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    role,
                    content,
                    created_at
                FROM messages
                WHERE conversation_id = %s
                ORDER BY created_at
                """,
                (conversation_id,),
            )

            rows = cursor.fetchall()

        return rows
    finally:
        connection.close()


def get_conversations(user_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    title,
                    created_at
                FROM conversations
                WHERE user_id = %s
                ORDER BY created_at DESC
                """,
                (user_id,),
            )

            rows = cursor.fetchall()

        return rows
    finally:
        connection.close()


def get_user_by_email(email: str):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    email,
                    password_hash
                FROM users
                WHERE email = %s
                """,
                (email,),
            )

            row = cursor.fetchone()

        return row
    finally:
        connection.close()

def create_user(
    name: str,
    email: str,
    password_hash: str,
) -> int:
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (
                    name,
                    email,
                    password_hash
                )
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (name, email, password_hash),
            )

            user_id = cursor.fetchone()[0]

        connection.commit()
        return user_id
    finally:
        connection.close()


def get_messages_for_user(
    conversation_id: int,
    user_id: int,
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    messages.id,
                    messages.role,
                    messages.content,
                    messages.created_at
                FROM messages
                JOIN conversations
                    ON messages.conversation_id = conversations.id
                WHERE messages.conversation_id = %s
                  AND conversations.user_id = %s
                ORDER BY messages.created_at
                """,
                (conversation_id, user_id),
            )

            rows = cursor.fetchall()

        return rows
    finally:
        connection.close()

def conversation_belongs_to_user(
    conversation_id: int,
    user_id: int,
) -> bool:
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT 1
                FROM conversations
                WHERE id = %s
                  AND user_id = %s
                """,
                (conversation_id, user_id),
            )

            row = cursor.fetchone()

        return row is not None
    finally:
        connection.close()