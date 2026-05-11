import random


async def analyze_video(contents: bytes, filename: str) -> dict:
    """
    Video deepfake detection service.
    Currently uses mock analysis — replace with real model in Step 5.
    Real model options: FaceForensics++, DeepFaceLab detector, XceptionNet on frames.
    """

    # --- Mock analysis (replace in Step 5) ---
    file_size_mb = len(contents) / (1024 * 1024)

    # Simulate processing variation based on file size
    base_score = random.uniform(0.1, 0.95)

    signals = []

    if base_score > 0.6:
        signals.append("Facial boundary inconsistency detected around jaw region")
        signals.append("Unnatural eye blinking frequency (avg 0.3s vs normal 0.15–0.4s)")
    if base_score > 0.75:
        signals.append("Lip-sync mismatch detected in frames 42–67")
        signals.append("Lighting direction inconsistency on left cheek")
    if base_score > 0.85:
        signals.append("GAN compression artifacts found in skin texture regions")
        signals.append("Temporal flickering detected between consecutive frames")
    if base_score < 0.4:
        signals.append("No significant facial manipulation artifacts detected")
        signals.append("Temporal consistency across frames is normal")

    return {
        "type": "video",
        "filename": filename,
        "file_size_mb": round(file_size_mb, 2),
        "fake_probability": round(base_score, 4),
        "signals": signals,
        "model": "Mock Analyzer v1.0 (Step 5 will use XceptionNet + LSTM)",
        "frames_analyzed": random.randint(24, 120),
    }