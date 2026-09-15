from google import genai

from app.core.config import GOOGLE_API_KEY

client = genai.Client(api_key=GOOGLE_API_KEY)


def ask_gemini(prompt: str) -> str:

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text
