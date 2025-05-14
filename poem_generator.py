import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_poem(dream_text: str) -> str:
    prompt = (
        f"Write a short poetic interpretation of this dream:\n\n"
        f"{dream_text}\n\nPoem:"
    )
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8
    )
    return response.choices[0].message.content.strip()
