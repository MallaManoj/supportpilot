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