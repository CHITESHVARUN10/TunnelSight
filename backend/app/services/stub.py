"""Phase 0 stub. Returns UNKNOWN for everything per roadmap CONFIRMED/INFERRED/UNKNOWN."""


def stub_analysis(filename: str) -> dict:
    return {
        "filename": filename,
        "status": "pending",
        "verdict": "UNKNOWN",
        "reason": "Phase 0 stub — analyzer not implemented yet",
    }
