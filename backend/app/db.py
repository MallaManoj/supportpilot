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