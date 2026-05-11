import random


async def analyze_audio(contents: bytes, filename: str) -> dict:
    """
    Audio voice clone / spoof detection service.
    Currently uses mock analysis — replace with real model in Step 5.
    Real model options: RawNet2, AASIST, wav2vec2-based classifiers.
    """

    # --- Mock analysis (replace in Step 5) ---
    file_size_mb = len(contents) / (1024 * 1024)

    base_score = random.uniform(0.1, 0.95)

    signals = []

    if base_score > 0.6:
        signals.append("Unnatural pitch stability — human voices vary ±2–5 Hz naturally")
        signals.append("Missing micro-pauses and breath sounds between sentences")
    if base_score > 0.75:
        signals.append("Spectrogram shows repetitive waveform pattern (AI generation artifact)")
        signals.append("Emotional flatness detected — monotonic prosody across 8 sentences")
    if base_score > 0.85:
        signals.append("Vocooder artifact detected at 4.2kHz frequency band")
        signals.append("Speaker embeddings do not match known voice profile")
    if base_score < 0.4:
        signals.append("Natural pitch variation and breathing patterns detected")
        signals.append("Spectrogram shows organic, non-repetitive waveform structure")

    return {
        "type": "audio",
        "filename": filename,
        "file_size_mb": round(file_size_mb, 2),
        "fake_probability": round(base_score, 4),
        "signals": signals,
        "model": "Mock Analyzer v1.0 (Step 5 will use RawNet2 / AASIST)",
        "duration_seconds": round(random.uniform(2.0, 60.0), 1),
    }