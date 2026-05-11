from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.text_service import analyze_text

router = APIRouter()


class TextInput(BaseModel):
    text: str


@router.post("/text")
async def detect_text(body: TextInput):
    """
    Accepts plain text and returns AI-generated content detection results.
    Checks: perplexity, sentence structure repetition, stylometric patterns.
    """
    if len(body.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Text is too short. Please provide at least 20 characters.")

    if len(body.text) > 50000:
        raise HTTPException(status_code=400, detail="Text too long. Maximum 50,000 characters.")

    result = await analyze_text(body.text)
    return result