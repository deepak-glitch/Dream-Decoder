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
SYSTEM_PROMPT = "You are a helpful dream interpreter. Provide concise, insight-filled interpretations."

def interpret_dream(dream_text: str) -> dict:
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": f"What does this dream mean: {dream_text}"}
        ]
    }

    print("→ Calling Sonar:", SONAR_URL)
    print("→ Payload:", payload)

    try:
        resp = requests.post(SONAR_URL, json=payload, headers=HEADERS, timeout=10)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("‼️ Sonar API request failed:", str(e))
        return {"error": "Exception when calling Sonar API", "details": str(e)}

    data = resp.json()
    print("← Sonar response:", data)

    try:
        choice = data["choices"][0]
        content = choice.get("message", {}).get("content") or choice.get("text")
        return {"interpretation": content.strip()}
    except Exception as e:
        print("‼️ Failed to parse Sonar response:", str(e))
        return {"error": "Invalid response structure from Sonar", "details": data}
