from fastapi import APIRouter, UploadFile, File, HTTPException
from services.audio_service import analyze_audio

router = APIRouter()


@router.post("/audio")
async def detect_audio(file: UploadFile = File(...)):
    """
    Accepts an audio file and returns voice clone / spoof detection results.
    Checks: pitch patterns, spectrogram artifacts, breath detection.
    """
    allowed = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg", "audio/flac", "audio/mp4"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Upload an audio file.")

    contents = await file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = await analyze_audio(contents, file.filename)
    return result