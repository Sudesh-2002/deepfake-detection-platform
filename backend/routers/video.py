from fastapi import APIRouter, UploadFile, File, HTTPException
from services.video_service import analyze_video

router = APIRouter()


@router.post("/video")
async def detect_video(file: UploadFile = File(...)):
    """
    Accepts a video file and returns deepfake detection results.
    Checks: face swap, lip-sync mismatch, frame inconsistencies.
    """
    allowed = ["video/mp4", "video/avi", "video/quicktime", "video/x-matroska", "video/webm"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Upload a video file.")

    contents = await file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = await analyze_video(contents, file.filename)
    return result