import os
import replicate
from dotenv import load_dotenv, find_dotenv

# Load .env from project root
load_dotenv(find_dotenv())

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
print("🔑 Replicate token loaded:", bool(REPLICATE_API_TOKEN))

def generate_dream_image(prompt: str) -> dict:
    """
    Uses the luma/photon-flash model to generate an image and
    returns a JSON‐serializable dict with the resulting URL.
    """
    if not REPLICATE_API_TOKEN:
        return {"error": "Replicate API token not configured"}

    print("🖼️ Generating image with prompt:", prompt)
    try:
        outputs = replicate.run(
            "luma/photon-flash",
            input={
                "prompt": prompt,
                "aspect_ratio": "16:9",
                "image_reference_weight": 0.85,
                "style_reference_weight": 0.85
            }
        )
        print("✅ replicate.run returned:", outputs)

        # outputs may be a list or single FileOutput
        first = outputs[0] if isinstance(outputs, (list, tuple)) else outputs
        # Extract URL if FileOutput, else stringify
        url = getattr(first, "url", None) or str(first)

        return {"image_url": url}

    except Exception as e:
        print("❌ generate_dream_image exception:", repr(e))
        return {"error": "Image generation failed", "details": str(e)}
