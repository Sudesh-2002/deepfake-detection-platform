from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import video, audio, image, text, document, multimodal

app = FastAPI(
    title="DeepGuard API",
    description="Deepfake Detection API — supports video, audio, image, text, document, and multi-modal analysis.",
    version="1.0.0"
)

# Allow frontend (localhost:5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all detection routers
app.include_router(video.router,      prefix="/detect", tags=["Video"])
app.include_router(audio.router,      prefix="/detect", tags=["Audio"])
app.include_router(image.router,      prefix="/detect", tags=["Image"])
app.include_router(text.router,       prefix="/detect", tags=["Text"])
app.include_router(document.router,   prefix="/detect", tags=["Document"])
app.include_router(multimodal.router, prefix="/detect", tags=["Multimodal"])


@app.get("/")
def root():
    return {
        "status": "DeepGuard API is running",
        "endpoints": [
            "/detect/video",
            "/detect/audio",
            "/detect/image",
            "/detect/text",
            "/detect/document",
            "/detect/multimodal",
        ]
    }


@app.get("/health")
def health():
    return {"status": "ok"}