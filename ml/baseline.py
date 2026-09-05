"""Interpretable baseline from roadmap S14 to sanity-check features.

Small regular packets -> VoIP-like, high sustained throughput -> video-like,
bursty + idle -> web-like. Used only to validate synthetic data, not as ML.
"""


def baseline_guess(row: dict) -> str:
    pps = row.get("packets_per_second", 0)
    bps = row.get("bytes_per_second", 0)
    mean_size = row.get("mean_size", 0)
    burstiness = row.get("burstiness", 0)
    if mean_size < 300 and pps > 20:
        return "voip-like"
    if bps > 1_000_000:
        return "video-like"
    if burstiness > 0.6:
        return "web-like"
    return "unknown"
