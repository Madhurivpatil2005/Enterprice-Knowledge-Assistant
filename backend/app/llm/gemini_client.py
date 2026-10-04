# from google import genai
# from fastapi import HTTPException

# from app.core.config import GOOGLE_API_KEY


# client = genai.Client(api_key=GOOGLE_API_KEY)


# def ask_gemini(prompt: str) -> str:
#     try:
#         response = client.models.generate_content(
#             model="gemini-3.6-flash",
#             contents=prompt,
#         )

#         if not response.text:
#             raise HTTPException(
#                 status_code=503,
#                 detail="AI service returned an empty response."
#             )

#         return response.text

#     except HTTPException:
#         raise

#     except Exception as e:
#         print("Gemini Error:", e)

#         raise HTTPException(
#             status_code=503,
#             detail="AI service is temporarily unavailable. Please try again."
#         )

from fastapi import HTTPException
import requests


OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen3:1.7b"


def ask_ollama(prompt: str) -> str:
    """
    Generate an answer using the locally running Ollama model.
    """

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "think": False,
                "options": {
                    "temperature": 0.2,
                    "num_predict": 500,
                },
            },
            timeout=120,
        )

        response.raise_for_status()

        data = response.json()

        answer = data.get("response", "").strip()

        if not answer:
            raise HTTPException(
                status_code=503,
                detail="Ollama returned an empty response."
            )

        # Remove Qwen thinking section if it appears.
        if "</think>" in answer:
            answer = answer.split("</think>", 1)[1].strip()

        # Remove an opening thinking tag if it remains.
        if answer.startswith("<think>"):
            answer = answer.replace("<think>", "", 1).strip()

        if not answer:
            raise HTTPException(
                status_code=503,
                detail="Ollama returned no final answer."
            )

        return answer

    except requests.exceptions.ConnectionError:
        print("Ollama Error: Cannot connect to Ollama.")

        raise HTTPException(
            status_code=503,
            detail="Ollama is not running. Please start Ollama."
        )

    except requests.exceptions.Timeout:
        print("Ollama Error: Request timed out.")

        raise HTTPException(
            status_code=504,
            detail="Ollama took too long to generate a response."
        )

    except requests.exceptions.HTTPError as e:
        print("Ollama HTTP Error:", e)

        raise HTTPException(
            status_code=503,
            detail="Ollama returned an HTTP error."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Ollama Error:", e)

        raise HTTPException(
            status_code=503,
            detail="Local AI service is temporarily unavailable."
        )