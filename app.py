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
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ────────────────────────────────────────────────────────────────────────────────

class DreamRequest(BaseModel):
    dream_text: str

@app.get("/")
async def root():
    return {
        "status": "Dream Decoder API is up!",
        "available_endpoints": ["/interpret", "/poem", "/visualize"]
    }

@app.post("/interpret", response_model=str)
async def interpret(dream: DreamRequest):
    result = interpret_dream(dream.dream_text)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["interpretation"]

@app.post("/poem", response_model=str)
async def poem(dream: DreamRequest):
    return generate_poem(dream.dream_text)

@app.post("/visualize")
async def visualize(dream: DreamRequest):
    print("▶️  /visualize called with:", dream.dream_text)
    result = generate_dream_image(dream.dream_text)
    print("▶️  /visualize result:", result)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
