import os
import replicate
from dotenv import load_dotenv

load_dotenv()

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
client = replicate.Client(api_token=REPLICATE_API_TOKEN)

def generate_dream_image(prompt: str) -> dict:
    """
    Generating a dream visualization using the Flux Schnell model.
    """
    try:
        output = client.run(
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
        # replicate.run returns a list of URLs
        return {"image_url": output[0]}
    except Exception as e:
        return {"error": str(e)}
