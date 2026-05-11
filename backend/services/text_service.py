import re
import random
import math
from collections import Counter


def compute_basic_stats(text: str) -> dict:
    """Real heuristic analysis — no ML model needed for these."""
    sentences = re.split(r'[.!?]+', text.strip())
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]

    words = re.findall(r'\b\w+\b', text.lower())
    word_count = len(words)

    # Sentence length variance (AI tends to be uniform)
    sent_lengths = [len(s.split()) for s in sentences]
    avg_len = sum(sent_lengths) / len(sent_lengths) if sent_lengths else 0
    variance = sum((l - avg_len) ** 2 for l in sent_lengths) / len(sent_lengths) if sent_lengths else 0
    std_dev = math.sqrt(variance)

    # Vocabulary richness (type-token ratio)
    unique_words = len(set(words))
    ttr = unique_words / word_count if word_count > 0 else 0

    # Repeated phrases (AI often repeats transition words)
    bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words) - 1)]
    bigram_counts = Counter(bigrams)
    repeated_bigrams = [b for b, c in bigram_counts.items() if c > 2]

    # Common AI filler phrases
    ai_phrases = [
        "it is important to", "it is worth noting", "in conclusion",
        "furthermore", "moreover", "it should be noted",
        "in today's world", "delve into", "as an ai",
        "certainly", "absolutely", "of course"
    ]
    found_ai_phrases = [p for p in ai_phrases if p in text.lower()]

    return {
        "word_count": word_count,
        "sentence_count": len(sentences),
        "avg_sentence_length": round(avg_len, 1),
        "sentence_length_std_dev": round(std_dev, 2),
        "vocabulary_richness": round(ttr, 3),
        "repeated_bigrams": repeated_bigrams[:5],
        "ai_phrase_hits": found_ai_phrases,
    }


async def analyze_text(text: str) -> dict:
    """
    AI-generated text detection service.
    Uses real heuristic analysis + mock ML score.
    Replace ML score with real model in Step 5 (RoBERTa classifier).
    """
    stats = compute_basic_stats(text)

    # Build signals from real heuristics
    signals = []
    heuristic_score = 0.0

    if stats["sentence_length_std_dev"] < 3.0 and stats["sentence_count"] > 3:
        signals.append(f"Low sentence length variation (std dev: {stats['sentence_length_std_dev']}) — AI writes uniformly")
        heuristic_score += 0.2

    if stats["vocabulary_richness"] > 0.85:
        signals.append(f"Very high vocabulary richness ({stats['vocabulary_richness']}) — unusual for natural writing")
        heuristic_score += 0.15

    if stats["ai_phrase_hits"]:
        signals.append(f"Common AI transition phrases detected: {', '.join(stats['ai_phrase_hits'][:3])}")
        heuristic_score += 0.15 * len(stats["ai_phrase_hits"])

    if stats["repeated_bigrams"]:
        signals.append(f"Repeated phrase patterns found: '{stats['repeated_bigrams'][0]}'")
        heuristic_score += 0.1

    if stats["avg_sentence_length"] > 22:
        signals.append(f"Sentences are unusually long on average ({stats['avg_sentence_length']} words)")
        heuristic_score += 0.1

    if not signals:
        signals.append("No strong AI-generation patterns detected in this text")
        signals.append(f"Natural writing variance detected (std dev: {stats['sentence_length_std_dev']})")

    # Cap heuristic score and blend with mock ML score
    heuristic_score = min(heuristic_score, 0.95)
    mock_ml_score = random.uniform(max(0.0, heuristic_score - 0.2), min(1.0, heuristic_score + 0.3))
    final_score = round((heuristic_score * 0.4 + mock_ml_score * 0.6), 4)

    return {
        "type": "text",
        "fake_probability": final_score,
        "signals": signals,
        "stats": stats,
        "model": "Heuristic Analyzer v1.0 (Step 5 will use RoBERTa AI-text classifier)",
    }