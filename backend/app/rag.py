from app.ai import create_embedding
from app.db import search_similar_chunks

def retrieve_context(
    question: str,
    limit: int = 5,
) -> list[dict]:
    embedding = create_embedding(question)
    results = search_similar_chunks(
        embedding,
        limit=limit,
    )
    return [
        {
            "chunk_id": row[0],
            "document_id": row[1],
            "title": row[2],
            "content": row[3],
            "distance": row[4],
        }
        for row in results
    ]
