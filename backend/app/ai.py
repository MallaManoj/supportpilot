import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not configured")

client = OpenAI(api_key=OPENAI_API_KEY)

def create_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding


def generate_answer(
    question: str,
    context: list[dict],
) -> str:
    context_strings = [doc["content"] for doc in context]
    joined_context = "\n\n---\n\n".join(context_strings)
    response = client.responses.create(
        model="gpt-5-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "You are SupportPilot, a customer support assistant. "
                    "Answer using only the supplied support documentation. "
                    "If the documentation does not contain the answer, "
                    "say that you do not have enough information."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Support documentation:\n\n"
                    f"{joined_context}\n\n"
                    f"Customer question:\n{question}"
                ),
            },
        ],
    )
    return response.output_text
