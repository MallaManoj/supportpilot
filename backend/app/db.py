import os

import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not configured")

    return psycopg.connect(
        DATABASE_URL,
        connect_timeout=5,
    )


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
                    created_at,
                    updated_at
                FROM conversations
                WHERE user_id = %s
                ORDER BY updated_at DESC
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
                    password_hash,
                    role
                FROM users
                WHERE email = %s
                """,
                (email,),
            )

            row = cursor.fetchone()

        return row
    finally:
        connection.close()


def get_user_by_id(user_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    email,
                    password_hash,
                    role
                FROM users
                WHERE id = %s
                """,
                (user_id,),
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


def get_user_by_id(user_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    email
                FROM users
                WHERE id = %s
                """,
                (user_id,),
            )

            row = cursor.fetchone()

        return row

    finally:
        connection.close()


def update_conversation_timestamp(
    conversation_id: int,
) -> None:
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE conversations
                SET updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (conversation_id,),
            )
        connection.commit()
    finally:
        connection.close()


def update_conversation_title(
    conversation_id: int,
    title: str,
) -> None:
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE conversations
                SET title = %s
                WHERE id = %s
                """,
                (title, conversation_id),
            )
        connection.commit()
    finally:
        connection.close()


def create_document(title: str, source: str | None, content: str) -> int:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO documents (title, source, content)
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (title, source, content),
            )
            document_id = cursor.fetchone()[0]
        connection.commit()
        return document_id
    finally:
        connection.close()


def create_document_chunk(
    document_id: int,
    chunk_index: int,
    content: str,
) -> int:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO document_chunks
                    (document_id, chunk_index, content)
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (document_id, chunk_index, content),
            )
            chunk_id = cursor.fetchone()[0]
        connection.commit()
        return chunk_id
    finally:
        connection.close()


def save_chunk_embedding(
    chunk_id: int,
    embedding: list[float],
) -> None:
    connection = get_connection()
    try:
        embedding_string = "[" + ",".join(map(str, embedding)) + "]"
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE document_chunks
                SET embedding = %s
                WHERE id = %s
                """,
                (embedding_string, chunk_id),
            )
        connection.commit()
    finally:
        connection.close()


def search_similar_chunks(
    embedding: list[float],
    limit: int = 5,
):
    connection = get_connection()
    try:
        embedding_string = "[" + ",".join(map(str, embedding)) + "]"
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    document_chunks.id,
                    document_chunks.document_id,
                    documents.title,
                    document_chunks.content,
                    document_chunks.embedding <=> %s::vector AS distance
                FROM document_chunks
                JOIN documents ON documents.id = document_chunks.document_id
                WHERE document_chunks.embedding IS NOT NULL
                ORDER BY document_chunks.embedding <=> %s::vector
                LIMIT %s
                """,
                (
                    embedding_string,
                    embedding_string,
                    limit,
                ),
            )
            return cursor.fetchall()
    finally:
        connection.close()


def create_ticket(user_id: int, conversation_id: int, subject: str, description: str) -> int:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO tickets (user_id, conversation_id, subject, description)
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (user_id, conversation_id, subject, description),
            )
            ticket_id = cursor.fetchone()[0]
        connection.commit()
        return ticket_id
    finally:
        connection.close()


def get_tickets_for_user(user_id: int):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, conversation_id, subject, status, created_at
                FROM tickets
                WHERE user_id = %s
                ORDER BY created_at DESC
                """,
                (user_id,),
            )
            return cursor.fetchall()
    finally:
        connection.close()


def get_ticket_for_user(ticket_id: int, user_id: int):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, conversation_id, subject, description, status, created_at
                FROM tickets
                WHERE id = %s AND user_id = %s
                """,
                (ticket_id, user_id),
            )
            return cursor.fetchone()
    finally:
        connection.close()


def get_dashboard_stats():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM tickets WHERE status = 'open'")
            open_tickets = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM tickets WHERE status = 'resolved'")
            resolved_tickets = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM conversations")
            total_conversations = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM users")
            total_users = cursor.fetchone()[0]
            
        return {
            "open_tickets": open_tickets,
            "resolved_tickets": resolved_tickets,
            "total_conversations": total_conversations,
            "total_users": total_users,
        }
    finally:
        connection.close()


def get_all_tickets():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT t.id, t.conversation_id, t.subject, t.status, t.created_at, u.name as customer_name
                FROM tickets t
                JOIN users u ON t.user_id = u.id
                ORDER BY t.created_at DESC
                """
            )
            return cursor.fetchall()
    finally:
        connection.close()


def get_ticket_details(ticket_id: int):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT t.id, t.conversation_id, t.subject, t.description, t.status, t.created_at, u.name as customer_name
                FROM tickets t
                JOIN users u ON t.user_id = u.id
                WHERE t.id = %s
                """,
                (ticket_id,)
            )
            return cursor.fetchone()
    finally:
        connection.close()