import os
import requests
from dotenv import load_dotenv

load_dotenv()

SONAR_API_KEY = os.getenv("SONAR_API_KEY")
HEADERS = {
    "Authorization": f"Bearer {SONAR_API_KEY}",
    "Content-Type": "application/json"
}

def generate_poem(dream_text: str) -> str:
    """
    Uses Sonar API to fetch a short poem about the given dream.
    """
    payload = {"query": f"Write a short poem about this dream: {dream_text}"}
    resp = requests.post(
        "https://api.perplexity.ai/sonar/search",
        json=payload,
        headers=HEADERS
    )
    if not resp.ok:
        return "Could not generate poem at this time."

    data = resp.json()
    answers = data.get("answers", [])
    if not answers:
        return "No poem found."

    return answers[0].get("text", "").strip()
