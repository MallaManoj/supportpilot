from app.ai import create_embedding
from app.chunking import chunk_text
from app.db import create_document_chunk, save_chunk_embedding

def process_document(document_id: int, content: str) -> None:
    chunks = chunk_text(content)
    for index, chunk in enumerate(chunks):
        chunk_id = create_document_chunk(
            document_id=document_id,
            chunk_index=index,
            content=chunk,
        )
        embedding = create_embedding(chunk)
        save_chunk_embedding(
            chunk_id=chunk_id,
            embedding=embedding,
        )
