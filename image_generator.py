import os
import replicate
from dotenv import load_dotenv, find_dotenv

# Load .env from project root
load_dotenv(find_dotenv())

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
print("🔑 Replicate token loaded:", bool(REPLICATE_API_TOKEN))

def generate_dream_image(prompt: str) -> dict:
    """
    Uses the Flux Schnell model to generate an image
    and returns a JSON‐serializable dict with a URL string.
    """
    if not REPLICATE_API_TOKEN:
        msg = "Replicate API token not configured"
        print("❌", msg)
        return {"error": msg}

    print("🖼️ Generating image with prompt:", prompt)
    try:
        # replicate.run returns a list of FileOutput objects
        outputs = replicate.run(
            "black-forest-labs/flux-schnell",
            input={
                "prompt": prompt,
                "go_fast": True,
                "megapixels": "1",
                "num_outputs": 1,
                "aspect_ratio": "1:1",
                "output_format": "webp",
                "output_quality": 80,
                "num_inference_steps": 4
            }
        )
        print("✅ Replicate.run returned:", outputs)

        if not outputs:
            return {"error": "No output returned by replicate"}

        first = outputs[0]
        # FileOutput has a .url attribute
        url = getattr(first, "url", None)
        if not url:
            # fallback to str()
            url = str(first)

        return {"image_url": url}

    except Exception as e:
        print("❌ replicate.run exception:", repr(e))
        return {"error": "Image generation failed", "details": str(e)}
