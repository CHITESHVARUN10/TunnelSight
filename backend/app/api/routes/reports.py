"""Report + AI explanation endpoints for a stored analysis."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.analysis_window import AnalysisWindow
from app.models.user import User
from app.services import explainer, pdf_report

router = APIRouter()


def _owned(db: Session, user: User, analysis_id: uuid.UUID) -> Analysis:
    row = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return row


def _windows(db: Session, analysis_id: uuid.UUID) -> list:
    return (
        db.query(AnalysisWindow)
        .filter(AnalysisWindow.analysis_id == analysis_id)
        .order_by(AnalysisWindow.window_id)
        .all()
    )


def _pdf_filename(filename: str) -> str:
    stem = (filename or "capture").rsplit("/", 1)[-1]
    for suffix in (".pcapng", ".pcap", ".cap", ".erf"):
        if stem.lower().endswith(suffix):
            stem = stem[: -len(suffix)]
            break
    return f"{stem}-report.pdf"


@router.get("/history/{analysis_id}/report.pdf")
def download_report_pdf(
    analysis_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = _owned(db, user, analysis_id)
    pdf = pdf_report.build_report(row, _windows(db, analysis_id), row.explanation_json)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{_pdf_filename(row.filename)}"'},
    )


@router.get("/history/{analysis_id}/explanation")
def get_explanation(
    analysis_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = _owned(db, user, analysis_id)
    if not row.explanation_json:
        raise HTTPException(status_code=404, detail="explanation not generated yet")
    return row.explanation_json


@router.post("/history/{analysis_id}/explanation")
def create_explanation(
    analysis_id: uuid.UUID,
    regenerate: bool = False,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = _owned(db, user, analysis_id)
    if row.explanation_json and not regenerate:
        return row.explanation_json

    evidence = explainer.build_evidence(row, _windows(db, analysis_id))
    try:
        result = explainer.generate(evidence)
    except explainer.ExplainerUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    row.explanation_json = result
    db.commit()
    db.refresh(row)
    return result
