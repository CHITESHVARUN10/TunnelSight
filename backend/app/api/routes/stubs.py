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


@router.get("/search")
def search(q: str = "", scope: str = "all", user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Analysis).filter(Analysis.user_id == user.id)
    if q:
        rows = rows.filter(Analysis.filename.ilike(f"%{q}%"))
    rows = rows.order_by(Analysis.created_at.desc()).limit(20).all()
    captures = [
        {"id": str(r.id), "filename": r.filename, "score": r.security_score, "risk": r.risk_level}
        for r in rows
    ]
    findings = []
    for r in rows:
        for f in r.findings_json or []:
            if not q or q.lower() in f.get("description", "").lower():
                findings.append({"title": f.get("category"), "severity": f.get("severity"), "capture": r.filename})
    return {"total": len(captures) + len(findings), "groups": {"captures": captures, "findings": findings, "spis": [], "reports": []}}


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
