from typing import Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sonar_handler import interpret_dream
from poem_generator import generate_poem
from image_generator import generate_dream_image

app = FastAPI()

# ─── CORS Middleware ───────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ────────────────────────────────────────────────────────────────────────────────

class DreamRequest(BaseModel):
    dream_text: str

class ImageResponse(BaseModel):
    image_url: str

@app.get("/")
async def root() -> Dict[str, object]:
    return {
        "status": "Dream Decoder API is up!",
        "available_endpoints": ["/interpret", "/poem", "/visualize"]
    }

@app.post("/interpret", response_model=str)
async def interpret(dream: DreamRequest) -> str:
    result = interpret_dream(dream.dream_text)

    # Log and map upstream errors to proper HTTP statuses
    if "error" in result:
        err = result["error"]
        print("❌ interpret_dream error:", err)  # <-- added logging
        if "timed out" in err.lower():
            # Sonar read timeout → 504 Gateway Timeout
            raise HTTPException(status_code=504, detail=err)
        else:
            # Other request errors → 502 Bad Gateway
            raise HTTPException(status_code=502, detail=err)

    return result["interpretation"]

@app.post("/poem", response_model=str)
async def poem(dream: DreamRequest) -> str:
    try:
        return generate_poem(dream.dream_text)
    except Exception as e:
        print("❌ generate_poem error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/visualize", response_model=ImageResponse)
async def visualize(dream: DreamRequest) -> ImageResponse:
    try:
        result = generate_dream_image(dream.dream_text)
    except Exception as e:
        print("❌ generate_dream_image exception:", e)
        raise HTTPException(status_code=500, detail="Image generation failed")

    if not isinstance(result, dict) or "image_url" not in result:
        print("❌ visualize invalid response:", result)
        raise HTTPException(status_code=500, detail="Invalid image response")

    return ImageResponse(image_url=result["image_url"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
