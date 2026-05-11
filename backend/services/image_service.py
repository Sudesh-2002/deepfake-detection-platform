import random
import io

try:
    from PIL import Image
    import numpy as np
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


async def analyze_image(contents: bytes, filename: str) -> dict:
    """
    Image deepfake / GAN detection service.
    Currently uses basic PIL analysis + mock scoring.
    Replace scoring with real model in Step 5 (XceptionNet / EfficientNet).
    """

    file_size_kb = len(contents) / 1024
    width, height = None, None
    color_variance = None

    # Basic real image analysis using PIL
    if PIL_AVAILABLE:
        try:
            img = Image.open(io.BytesIO(contents)).convert("RGB")
            width, height = img.size
            arr = np.array(img, dtype=np.float32)
            color_variance = float(np.std(arr))
        except Exception:
            pass

    # --- Mock scoring (replace with real model in Step 5) ---
    base_score = random.uniform(0.1, 0.95)

    signals = []

    if base_score > 0.6:
        signals.append("Facial symmetry anomaly detected — left/right mismatch exceeds threshold")
        signals.append("Skin texture shows non-organic smoothness (GAN over-rendering)")
    if base_score > 0.75:
        signals.append("Eye reflections are inconsistent between left and right pupils")
        signals.append("Frequency domain analysis (FFT) shows GAN grid artifacts")
    if base_score > 0.85:
        signals.append("Hair boundary shows unrealistic blending with background")
        signals.append("Teeth geometry distortion detected in lower jaw region")
    if base_score < 0.4:
        signals.append("No GAN fingerprint artifacts detected in frequency domain")
        signals.append("Natural noise distribution consistent with real camera sensor")

    result = {
        "type": "image",
        "filename": filename,
        "file_size_kb": round(file_size_kb, 2),
        "fake_probability": round(base_score, 4),
        "signals": signals,
        "model": "Mock Analyzer v1.0 (Step 5 will use XceptionNet / EfficientNet)",
    }

    if width and height:
        result["resolution"] = f"{width}x{height}"
    if color_variance is not None:
        result["color_variance"] = round(color_variance, 2)

    return result