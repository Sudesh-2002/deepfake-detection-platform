from fastapi import APIRouter, UploadFile, File, HTTPException
from services.multimodal_service import analyze_multimodal

router = APIRouter()


@router.post("/multimodal")
async def detect_multimodal(file: UploadFile = File(...)):
    """
    Accepts a video file and cross-checks video + audio together.
    Checks: lip-sync alignment, semantic consistency, cross-modal coherence.
    """
    allowed = ["video/mp4", "video/avi", "video/quicktime", "video/x-matroska", "video/webm"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Upload a video file for multi-modal analysis.")

    contents = await file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = await analyze_multimodal(contents, file.filename)
    return result