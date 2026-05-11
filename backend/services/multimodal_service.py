import random


async def analyze_multimodal(contents: bytes, filename: str) -> dict:
    """
    Multi-modal deepfake detection — cross-checks video + audio together.
    Currently uses mock analysis — replace with real model in Step 5.
    Real approach: extract audio track, run both video + audio models,
    then check lip-sync alignment with SyncNet or Wav2Lip detector.
    """

    file_size_mb = len(contents) / (1024 * 1024)

    # Simulate independent video and audio scores
    video_score = random.uniform(0.1, 0.95)
    audio_score = random.uniform(0.1, 0.95)

    # Lip-sync misalignment between video and audio
    sync_mismatch = abs(video_score - audio_score)
    sync_score = round(min(sync_mismatch * 1.5, 1.0), 4)

    # Final combined score
    final_score = round((video_score * 0.4 + audio_score * 0.4 + sync_score * 0.2), 4)
    final_score = min(final_score, 0.99)

    signals = []

    if video_score > 0.6:
        signals.append(f"Video track: face manipulation artifacts detected (score: {round(video_score, 2)})")
    else:
        signals.append(f"Video track: no significant visual artifacts (score: {round(video_score, 2)})")

    if audio_score > 0.6:
        signals.append(f"Audio track: voice clone patterns detected (score: {round(audio_score, 2)})")
    else:
        signals.append(f"Audio track: voice appears natural (score: {round(audio_score, 2)})")

    if sync_mismatch > 0.3:
        signals.append(f"Lip-sync misalignment detected — audio/video offset: {round(sync_mismatch * 100, 1)}ms deviation")
    else:
        signals.append("Lip-sync alignment is within normal range")

    if final_score > 0.75:
        signals.append("Cross-modal semantic consistency check: FAILED — audio and visual cues conflict")
    else:
        signals.append("Cross-modal semantic consistency check: PASSED")

    return {
        "type": "multimodal",
        "filename": filename,
        "file_size_mb": round(file_size_mb, 2),
        "fake_probability": final_score,
        "breakdown": {
            "video_score": round(video_score, 4),
            "audio_score": round(audio_score, 4),
            "sync_mismatch_score": sync_score,
        },
        "signals": signals,
        "model": "Mock Multi-Modal Analyzer v1.0 (Step 5 will use SyncNet + XceptionNet + RawNet2)",
    }