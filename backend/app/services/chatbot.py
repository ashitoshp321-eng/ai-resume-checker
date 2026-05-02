import httpx
import json
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

async def get_chatbot_response(message: str, context: str) -> str:
    """
    Get a response from the configured LLM (OpenAI or Ollama).
    Falls back to a template response if neither is configured.
    """
    system_prompt = f"""You are an expert HR assistant helping a recruiter screen resumes.
You have access to the following top candidates and the job description:
---
{context}
---
Answer the user's questions based ONLY on the provided context. If the answer is not in the context, say so.
Keep your answers concise, professional, and helpful. Focus on the candidates' skills, experience, and fitness for the role."""

    # 1. Try OpenAI if key is present
    if settings.OPENAI_API_KEY:
        try:
            logger.info("Calling OpenAI API for chatbot response")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": message}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 500
                    },
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            # Fall through to fallback

    # 2. Try Ollama if base URL is present
    elif settings.OLLAMA_BASE_URL:
        try:
            logger.info(f"Calling Ollama API at {settings.OLLAMA_BASE_URL}")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": "llama3",
                        "system": system_prompt,
                        "prompt": message,
                        "stream": False
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return data["response"]
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            # Fall through to fallback

    # 3. Fallback Template Response
    logger.warning("No LLM configured or API call failed. Using fallback response.")
    return (
        "I am running in **Offline Fallback Mode** because no OpenAI API Key or Ollama URL is configured. "
        "Here is the context I received:\n\n" + context[:500] + "...\n\n"
        "(Configure an LLM in the `.env` file to chat with this data!)"
    )
