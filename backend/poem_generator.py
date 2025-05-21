import os
import requests
from dotenv import load_dotenv

load_dotenv()

SONAR_API_KEY = os.getenv("SONAR_API_KEY")
HEADERS = {
    "Authorization": f"Bearer {SONAR_API_KEY}",
    "Content-Type": "application/json"
}

SONAR_URL = "https://api.perplexity.ai/chat/completions"
SYSTEM_PROMPT = "You are a creative poet. Write a short, evocative poem based on the user’s dream."

def generate_poem(dream_text: str) -> str:
    """
    Always returns a string. Logs any errors internally.
    """
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": f"Write a short poem about this dream: {dream_text}"}
        ]
    }

    try:
        resp = requests.post(SONAR_URL, json=payload, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        # safely dig into the response
        choices = data.get("choices", [])
        if not choices:
            return "No poem found."
        choice = choices[0]
        # some versions return .message.content, others .text
        content = choice.get("message", {}).get("content") or choice.get("text")
        return content.strip() if content else "No poem found."
    except Exception as e:
        print("‼️ generate_poem error:", e)
        return "Could not generate poem at this time."
