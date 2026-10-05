from app.chunking import chunk_text

def test_chunk_text_returns_chunks():
    text = " ".join(["word"] * 120)
    chunks = chunk_text(
        text,
        chunk_size=50,
        overlap=10,
    )
    assert len(chunks) >= 3
    assert all(chunks)
