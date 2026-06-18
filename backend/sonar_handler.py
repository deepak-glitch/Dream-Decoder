# sonar_handler.py

import requests
from typing import Dict
from requests.adapters import HTTPAdapter, Retry
from requests.exceptions import ReadTimeout, HTTPError, RequestException

SONAR_URL = "https://api.perplexity.ai/chat/completions"

# bump read timeout to 60s, keep connect timeout at 5s
TIMEOUT = (5, 160)

# ← your Sonar API key directly in the code:
API_KEY = "pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# session with retry logic for 5xx/429 errors
_session = requests.Session()
_retries = Retry(
    total=3,
    backoff_factor=0.5,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["POST"]
)
_session.mount("https://", HTTPAdapter(max_retries=_retries))


def interpret_dream(text: str) -> Dict[str, str]:
    payload = {
        "model": "sonar",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a helpful dream interpreter. "
                    "Provide concise, insight-filled interpretations."
                ),
            },
            {"role": "user", "content": f"What does this dream mean: {text}"},
        ],
    }

    try:
        resp = _session.post(
            SONAR_URL,
            json=payload,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        resp.raise_for_status()
    except ReadTimeout:
        return {"error": "Sonar API timed out while interpreting your dream."}
    except HTTPError as e:
        return {"error": f"Sonar API request failed: {e}"}
    except RequestException as e:
        return {"error": f"Sonar API request failed: {e}"}

    data = resp.json()
    try:
        content = data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError):
        return {"error": "Unexpected response format from Sonar API."}

    return {"interpretation": content}
