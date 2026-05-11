from fastapi import APIRouter, UploadFile, File, HTTPException
from services.document_service import analyze_document

router = APIRouter()


@router.post("/document")
async def detect_document(file: UploadFile = File(...)):
    """
    Accepts a PDF or Word document and checks for forgery / tampering.
    Checks: metadata anomalies, font inconsistencies, layout manipulation.
    """
    allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Upload a PDF or Word document.")

    contents = await file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = await analyze_document(contents, file.filename, file.content_type)
    return result