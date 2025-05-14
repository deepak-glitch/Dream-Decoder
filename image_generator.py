import os
import replicate
from dotenv import load_dotenv

load_dotenv()
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
client = replicate.Client(api_token=REPLICATE_API_TOKEN)

def generate_dream_image(prompt: str) -> dict:
    try:
        output = client.run(
            "stability-ai/sdxl:db21e45b524db1b4046c34e9a9bb6e51d1f4dcd3a30e4fdc597f3969da66f004",
            input={
                "prompt": prompt,
                "width": 512,
                "height": 512,
                "num_inference_steps": 25,
                "guidance_scale": 7.5
            }
        )
        return {"image_url": output[0]}
    except Exception as e:
        return {"error": str(e)}
