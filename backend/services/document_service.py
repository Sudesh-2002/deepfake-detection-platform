import random
import io


def check_pdf_metadata(contents: bytes) -> dict:
    """Basic PDF header and metadata checks without external libraries."""
    signals = []
    metadata_flags = {}

    # Check PDF header
    if not contents.startswith(b'%PDF'):
        signals.append("File does not start with valid PDF header (%PDF)")
        metadata_flags["invalid_header"] = True

    # Check for suspicious keywords in raw bytes
    raw = contents[:8192]  # Check first 8KB
    suspicious = [b"/JavaScript", b"/JS", b"/Launch", b"/EmbeddedFile", b"/XObject"]
    found = [s.decode() for s in suspicious if s in raw]
    if found:
        signals.append(f"Suspicious PDF actions found: {', '.join(found)}")
        metadata_flags["suspicious_actions"] = found

    # Check for metadata block
    if b"/CreationDate" in raw:
        metadata_flags["has_creation_date"] = True
    else:
        signals.append("Missing CreationDate metadata — may have been stripped")

    if b"/Producer" not in raw and b"/Creator" not in raw:
        signals.append("No Producer or Creator tool metadata — common in forged documents")
        metadata_flags["missing_producer"] = True

    # Check for multiple font references (inconsistency indicator)
    font_refs = raw.count(b"/Font")
    if font_refs > 10:
        signals.append(f"High number of font references ({font_refs}) — possible copy-paste from multiple sources")
        metadata_flags["font_count"] = font_refs

    return {"signals": signals, "metadata_flags": metadata_flags}


async def analyze_document(contents: bytes, filename: str, content_type: str) -> dict:
    """
    Document forgery detection service.
    Performs basic metadata analysis + mock scoring.
    Replace scoring with real model in Step 5.
    """
    file_size_kb = len(contents) / 1024

    signals = []
    metadata_flags = {}

    if content_type == "application/pdf":
        analysis = check_pdf_metadata(contents)
        signals.extend(analysis["signals"])
        metadata_flags.update(analysis["metadata_flags"])
    else:
        # Word documents — basic check
        signals.append("Word document structural analysis (full OCR check available in Step 5)")

    # Mock score, influenced by number of real signals found
    base_score = min(0.15 * len(signals) + random.uniform(0.05, 0.35), 0.95)

    if not signals:
        signals.append("No obvious metadata anomalies found in document structure")
        signals.append("File header and creator metadata appear consistent")
        base_score = random.uniform(0.05, 0.3)

    return {
        "type": "document",
        "filename": filename,
        "file_size_kb": round(file_size_kb, 2),
        "file_type": content_type,
        "fake_probability": round(base_score, 4),
        "signals": signals,
        "metadata_flags": metadata_flags,
        "model": "Metadata Analyzer v1.0 (Step 5 will add OCR + layout model)",
    }