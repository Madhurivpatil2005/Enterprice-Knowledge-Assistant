# from app.llm.gemini_client import ask_gemini
from app.llm.gemini_client import ask_ollama

def generate_title(question: str) -> str:

    prompt = f"""
Generate a short conversation title.

Rules:
- Maximum 5 words.
- Do not use quotes.
- Keep it professional.

Question:

{question}

Title:
"""

    title = ask_ollama(prompt)

    return title.strip()