"""AI explanation layer backed by Groq (OpenAI-compatible chat completions).

Design constraints:
- The model only ever sees deterministic, derived evidence (SA parameters, rule-engine
  findings, window aggregates). Raw packet payloads and the API key never leave here.
- Any failure (missing key, upstream error, invalid JSON) raises `ExplainerUnavailable`
  so the route can answer 503 and the deterministic findings stay usable.
"""

import json
from datetime import datetime, timezone
from typing import Any

import httpx
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.explanation import ExplanationOut

SYSTEM_PROMPT = (
    "You are a network security analyst explaining the output of a deterministic IPsec "
    "analysis pipeline to an engineer.\n\n"
    "Rules you must follow:\n"
    "1. Use ONLY the evidence supplied in the user message. It is the complete ground truth.\n"
    "2. Never invent CVE identifiers, packet numbers, timestamps, byte counts, model names, "
    "or any metric that is not present in the evidence.\n"
    "3. If the evidence is insufficient to justify a claim, say so plainly instead of guessing.\n"
    "4. Produce exactly one entry in `per_finding` for each finding in the evidence, in the "
    "same order, echoing its `severity` and `category` verbatim.\n"
    "5. Keep `summary` to 2-4 sentences.\n\n"
    "Respond with strict JSON matching this shape:\n"
    '{"summary": string, "per_finding": [{"severity": string, "category": string, '
    '"why": string, "remediation": string}]}'
)


class ExplainerUnavailable(RuntimeError):
    """Raised when the AI layer cannot produce a result."""


def available() -> bool:
    return bool(settings.GROQ_API_KEY)


def build_evidence(row, windows: list) -> dict:
    """Assemble the deterministic evidence handed to the model. No raw payloads."""
    config = row.config_json or {}
    ipsec = config.get("ipsec_config") or {}
    capture = config.get("capture") or {}

    labels: dict[str, int] = {}
    for w in windows:
        if w.traffic_label:
            labels[w.traffic_label] = labels.get(w.traffic_label, 0) + 1

    scores = [w.anomaly_score for w in windows if w.anomaly_score is not None]

    return {
        "capture": {
            "filename": row.filename,
            "status": row.status,
            "evidence_source": config.get("evidence_source"),
            "packet_count": capture.get("packet_count"),
            "total_bytes": capture.get("total_bytes"),
            "flow_duration_seconds": capture.get("flow_duration"),
        },
        "ipsec_config": ipsec,
        "assessment": {
            "security_score": row.security_score,
            "risk_level": row.risk_level,
        },
        "findings": [
            {
                "severity": f.get("severity"),
                "category": f.get("category"),
                "description": f.get("description"),
            }
            for f in (row.findings_json or [])
        ],
        "windows": {
            "count": len(windows),
            "traffic_label_counts": labels,
            "anomalous_windows": sum(1 for w in windows if w.is_anomaly),
            "anomaly_score_min": min(scores) if scores else None,
            "anomaly_score_max": max(scores) if scores else None,
        },
    }


def _extract_json(text: str) -> Any:
    """Parse model output, tolerating prose around the JSON object."""
    try:
        return json.loads(text)
    except (TypeError, ValueError):
        pass
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])
    raise ValueError("no JSON object found")


def _post_chat(payload: dict, headers: dict) -> httpx.Response:
    try:
        with httpx.Client(timeout=settings.GROQ_TIMEOUT_SECONDS) as client:
            return client.post(
                f"{settings.GROQ_BASE_URL.rstrip('/')}/chat/completions",
                json=payload,
                headers=headers,
            )
    except httpx.HTTPError as exc:
        raise ExplainerUnavailable(f"Groq request failed: {exc}") from exc


def generate(evidence: dict) -> dict:
    """Call Groq and return a validated explanation payload."""
    if not available():
        raise ExplainerUnavailable(
            "GROQ_API_KEY is not configured; the AI explanation layer is disabled."
        )

    payload = {
        "model": settings.GROQ_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": "Evidence (deterministic analysis output):\n"
                + json.dumps(evidence, indent=2, default=str),
            },
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": settings.GROQ_MAX_TOKENS,
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    response = _post_chat(payload, headers)
    if response.status_code == 400:
        # Some models reject response_format; retry without it and extract
        # the JSON object from the raw text instead.
        payload = {k: v for k, v in payload.items() if k != "response_format"}
        response = _post_chat(payload, headers)

    if response.status_code >= 400:
        detail = response.text[:300].replace("\n", " ")
        raise ExplainerUnavailable(
            f"Groq returned {response.status_code} for model "
            f"'{settings.GROQ_MODEL}': {detail}"
        )

    try:
        body = response.json()
        content = body["choices"][0]["message"]["content"]
    except (ValueError, KeyError, IndexError, TypeError) as exc:
        raise ExplainerUnavailable("Groq returned an unexpected response shape.") from exc

    if isinstance(content, list):
        content = "".join(part.get("text", "") for part in content if isinstance(part, dict))

    try:
        parsed = _extract_json(content)
    except (TypeError, ValueError) as exc:
        raise ExplainerUnavailable("The model did not return valid JSON.") from exc
    if not isinstance(parsed, dict):
        raise ExplainerUnavailable("The model returned JSON that was not an object.")

    try:
        result = ExplanationOut(**parsed)
    except ValidationError as exc:
        raise ExplainerUnavailable(f"The model response failed validation: {exc}") from exc

    return {
        "summary": result.summary,
        "per_finding": [item.model_dump() for item in result.per_finding],
        "model": settings.GROQ_MODEL,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
