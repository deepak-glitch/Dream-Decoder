import os
import requests
from dotenv import load_dotenv

load_dotenv()

SONAR_API_KEY = os.getenv("SONAR_API_KEY")
HEADERS = {
    "Authorization": f"Bearer {SONAR_API_KEY}",
    "Content-Type": "application/json"
}

def interpret_dream(dream_text: str):
    payload = {"query": f"What does this dream mean: {dream_text}"}
    response = requests.post(
        "https://api.perplexity.ai/sonar/search",
        json=payload,
        headers=HEADERS
    )
    if response.ok:
        return response.json()
    return {"error": "Failed to interpret dream"}
