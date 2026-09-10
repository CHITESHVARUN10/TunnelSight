"""Minimal stubs for pages with no dedicated backend yet. No new tables."""

import csv
import io
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.analysis_window import AnalysisWindow
from app.models.user import User

router = APIRouter()


def _owned(db: Session, user: User, analysis_id: uuid.UUID) -> Analysis:
    from fastapi import HTTPException

    row = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return row


@router.post("/history/{analysis_id}/reports", status_code=202)
def create_report(
    analysis_id: uuid.UUID,
    payload: dict | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = _owned(db, user, analysis_id)
    report_type = (payload or {}).get("type", "executive")
    report_id = uuid.uuid4()
    return {
        "report_id": str(report_id),
        "analysis_id": str(row.id),
        "type": report_type,
        "size_estimate": "12KB",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/history/{analysis_id}/reports")
def list_reports(analysis_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _owned(db, user, analysis_id)
    return {"items": []}


@router.get("/reports/{report_id}/download")
def download_report_placeholder(report_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Legacy report id route — an analysis id is required to build a real PDF."""
    row = db.query(Analysis).filter(Analysis.id == report_id, Analysis.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="not found")

    from app.services import pdf_report

    windows = (
        db.query(AnalysisWindow)
        .filter(AnalysisWindow.analysis_id == row.id)
        .order_by(AnalysisWindow.window_id)
        .all()
    )
    pdf = pdf_report.build_report(row, windows, row.explanation_json)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{row.id}-report.pdf"'},
    )


@router.get("/history/{analysis_id}/export")
def export_analysis(
    analysis_id: uuid.UUID,
    format: str = "json",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from fastapi import HTTPException

    row = _owned(db, user, analysis_id)
    windows = (
        db.query(AnalysisWindow)
        .filter(AnalysisWindow.analysis_id == analysis_id)
        .order_by(AnalysisWindow.window_id)
        .all()
    )
    if format == "csv":
        buf = io.StringIO()
        w = csv.writer(buf)
        w.writerow(["window_id", "traffic_label", "traffic_confidence", "anomaly_score", "is_anomaly"])
        for x in windows:
            w.writerow([x.window_id, x.traffic_label, x.traffic_confidence, x.anomaly_score, x.is_anomaly])
        return Response(content=buf.getvalue(), media_type="text/csv")
    if format != "json":
        raise HTTPException(status_code=400, detail="format must be json or csv")
    import json

    body = {
        "capture": row.filename,
        "risk": row.risk_level,
        "security_score": row.security_score,
        "traffic": {"label": row.traffic_label, "confidence": row.traffic_confidence},
        "anomaly": {"score": row.anomaly_score},
        "findings": row.findings_json or [],
        "windows": [
            {
                "window_id": x.window_id,
                "traffic_label": x.traffic_label,
                "anomaly_score": x.anomaly_score,
                "is_anomaly": x.is_anomaly,
            }
            for x in windows
        ],
    }
    return Response(content=json.dumps(body, indent=2), media_type="application/json")


SCOPES = ("all", "captures", "findings", "spis", "reports", "vpns", "docs")

# Static docs index (curated anchors into /docs); filtered by the query.
DOCS_INDEX = [
    {"title": "End-to-End Operational Workflow", "desc": "PCAP Ingestion → Pre-flight → SA Extraction → Remediation", "href": "/docs#workflow", "tags": "workflow ingestion pipeline sa extraction remediation guide"},
    {"title": "RFC Compliance & Regulatory Standards Matrix", "desc": "NIST SP 800-77 Rev. 1 · CNSA 1.0 · FIPS 140-3 mandates", "href": "/docs#standards", "tags": "rfc 7296 8247 nist cnsa fips compliance standards regulatory gavel"},
    {"title": "Operational Page Catalog & Metric Telemetry", "desc": "Indicator breakdown across every operational view", "href": "/docs#pages", "tags": "pages catalog telemetry metrics views guide"},
    {"title": "Cryptographic Foundations & Protocol Theory", "desc": "IKEv1 vs IKEv2 · DH group deprecation · anti-replay · Sweet32", "href": "/docs#concepts", "tags": "cryptography theory ike diffie-hellman dh deprecation replay sweet32 des 3des md5 sha concepts"},
    {"title": "IKE Handshake Sequence", "desc": "SA_INIT / AUTH exchange walkthrough with cookie defense", "href": "/docs#chapter-2", "tags": "ike handshake sa_init auth cookie sequence diagram"},
    {"title": "Decapsulation Pipeline", "desc": "ESP decapsulation stages from wire to plaintext", "href": "/docs#chapter-1", "tags": "decapsulation esp pipeline diagram"},
    {"title": "Diffie-Hellman Lattice", "desc": "Group strength comparison across MODP and ECP groups", "href": "/docs#chapter-2", "tags": "diffie-hellman lattice groups modp ecp pfs"},
    {"title": "AI Explanation Layer", "desc": "Groq-backed finding explanations, evidence grounding, 503 fallback", "href": "/docs#chapter-3", "tags": "ai explanation groq model findings evidence"},
]

SEARCH_LIMIT = 8  # per-group cap


def _suite_of(row: Analysis) -> str:
    crypto = ((row.config_json or {}).get("ipsec_config") or {}).get("cryptography") or {}
    enc = crypto.get("encryption_algorithm") or "UNKNOWN"
    integ = crypto.get("integrity_algorithm") or ""
    dh = crypto.get("dh_group")
    suite = str(enc)
    if integ and integ != "AEAD (Built-in)":
        suite += f"/{integ}"
    if dh is not None:
        suite += f"/DH{dh}"
    return suite


def _norm_hex(s: str) -> str:
    return "".join(c for c in s.lower() if c in "0123456789abcdef")


@router.get("/search")
def search(
    q: str = "",
    scope: str = "all",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Dynamic global search over the caller's own analyses.

    Scopes: all | captures | findings | spis | reports | vpns | docs.
    Empty `q` returns the most recent items per group.
    """
    scope = (scope or "all").lower()
    if scope not in SCOPES:
        raise HTTPException(status_code=400, detail=f"unknown scope: {scope}. Use one of {', '.join(SCOPES)}.")
    needle = q.strip().lower()

    rows = (
        db.query(Analysis)
        .filter(Analysis.user_id == user.id)
        .order_by(Analysis.created_at.desc())
        .limit(100)
        .all()
    )

    # ── Captures ──
    captures = [
        {
            "id": str(r.id),
            "filename": r.filename,
            "score": r.security_score,
            "risk": r.risk_level,
            "suite": _suite_of(r),
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
        if not needle or needle in r.filename.lower()
    ]

    # ── Findings (match category / severity / description) ──
    findings = []
    for r in rows:
        for f in r.findings_json or []:
            hay = f"{f.get('category', '')} {f.get('severity', '')} {f.get('description', '')}".lower()
            if needle and needle not in hay:
                continue
            findings.append(
                {
                    "severity": f.get("severity"),
                    "category": f.get("category"),
                    "description": f.get("description"),
                    "capture": r.filename,
                    "analysis_id": str(r.id),
                }
            )

    # ── SPIs: hex-substring matches inside stored packet previews ──
    spis = []
    hex_needle = _norm_hex(needle)
    if len(hex_needle) >= 4:
        for r in rows:
            preview = ((r.config_json or {}).get("capture") or {}).get("packets_preview") or []
            for p in preview:
                if hex_needle in _norm_hex(p.get("hex", "")):
                    spis.append(
                        {
                            "match": f"0x{hex_needle[:8]}…",
                            "capture": r.filename,
                            "analysis_id": str(r.id),
                            "packet_index": p.get("index"),
                            "peer": f"{p.get('src')} ↔ {p.get('dst')}",
                        }
                    )
                    break

    # ── Reports: completed analyses with a downloadable PDF ──
    reports = [
        {
            "id": str(r.id),
            "filename": r.filename,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
        if r.status == "completed" and (not needle or needle in r.filename.lower())
    ]

    # ── VPNs: distinct negotiated suites across the caller's captures ──
    suites: dict[str, dict] = {}
    for r in rows:
        suite = _suite_of(r)
        if needle and needle not in suite.lower() and needle not in r.filename.lower():
            continue
        entry = suites.setdefault(suite, {"suite": suite, "captures": 0, "analysis_id": str(r.id)})
        entry["captures"] += 1
    vpns = sorted(suites.values(), key=lambda e: -e["captures"])

    # ── Docs: curated index filtered by the query ──
    docs = [
        d
        for d in DOCS_INDEX
        if not needle or any(t in f"{d['title']} {d['desc']} {d['tags']}".lower() for t in needle.split())
    ]

    groups = {
        "captures": captures[:SEARCH_LIMIT],
        "findings": findings[:SEARCH_LIMIT],
        "spis": spis[:SEARCH_LIMIT],
        "reports": reports[:SEARCH_LIMIT],
        "vpns": vpns[:SEARCH_LIMIT],
        "docs": docs[:SEARCH_LIMIT],
    }
    counts = {
        "captures": len(captures),
        "findings": len(findings),
        "spis": len(spis),
        "reports": len(reports),
        "vpns": len(vpns),
        "docs": len(docs),
    }
    if scope != "all":
        groups = {k: (v if k == scope else []) for k, v in groups.items()}
    return {"q": q, "total": sum(counts.values()), "counts": counts, "groups": groups}


@router.get("/datasets/summary")
def datasets_summary(user: User = Depends(get_current_user)):
    import os

    import pandas as pd

    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/dataset.csv"))
    if not os.path.exists(csv_path):
        return {"total": 0, "labels": {}, "note": "dataset.csv not present"}
    df = pd.read_csv(csv_path, usecols=["label"])
    return {"total": int(len(df)), "labels": {k: int(v) for k, v in df["label"].value_counts().items()}}


@router.get("/engine/health")
def engine_health(user: User = Depends(get_current_user)):
    return {"engines": [{"name": "rf+if v1", "status": "online"}], "active": "2/2"}


@router.post("/live/status")
def live_status(user: User = Depends(get_current_user)):
    return {"supported": False, "reason": "live capture post-MVP"}
