from fastapi import APIRouter, UploadFile, File, HTTPException
from services.image_service import analyze_image

router = APIRouter()


@router.post("/image")
async def detect_image(file: UploadFile = File(...)):
    """
    Accepts an image file and returns GAN / deepfake detection results.
    Checks: face symmetry, texture anomalies, frequency artifacts.
    """
    allowed = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Upload an image file.")

    contents = await file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = await analyze_image(contents, file.filename)
    return result