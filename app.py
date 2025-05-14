from fastapi import FastAPI
from pydantic import BaseModel
from sonar_handler import interpret_dream
from poem_generator import generate_poem
from image_generator import generate_dream_image

app = FastAPI()

class DreamRequest(BaseModel):
    dream_text: str

@app.post("/interpret")
async def interpret(dream: DreamRequest):
    return interpret_dream(dream.dream_text)

@app.post("/poem")
async def poem(dream: DreamRequest):
    return {"poem": generate_poem(dream.dream_text)}

@app.post("/analyze")
async def full_analysis(dream: DreamRequest):
    interpretation = interpret_dream(dream.dream_text)
    poem = generate_poem(dream.dream_text)
    image = generate_dream_image(dream.dream_text)
    return {
        "interpretation": interpretation,
        "poem": poem,
        "image": image
    }
