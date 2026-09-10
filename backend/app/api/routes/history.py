import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.analysis_window import AnalysisWindow
from app.models.user import User
from app.schemas.analysis import AnalysisOut
from app.schemas.results import (AnomaliesOut, FindingOut, FindingsOut, TrafficMixOut, WindowOut)

router = APIRouter()


def _get_owned(db: Session, user: User, analysis_id: uuid.UUID) -> Analysis:
    row = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return row


@router.get("", response_model=dict)
def list_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    q: str | None = None,
    risk: str | None = None,
    page: int = 1,
    limit: int = 20,
):
    query = db.query(Analysis).filter(Analysis.user_id == user.id)
    if q:
        query = query.filter(Analysis.filename.ilike(f"%{q}%"))
    if risk:
        query = query.filter(Analysis.risk_level == risk)
    total = query.count()
    rows = query.order_by(Analysis.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return {"items": [AnalysisOut.model_validate(r).model_dump() for r in rows], "total": total, "page": page, "limit": limit}


@router.get("/{analysis_id}", response_model=AnalysisOut)
def get_history_item(analysis_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _get_owned(db, user, analysis_id)


@router.delete("/{analysis_id}")
def delete_history_item(analysis_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = _get_owned(db, user, analysis_id)
    db.delete(row)
    db.commit()
    return {"purged": True}


@router.get("/{analysis_id}/windows", response_model=list[WindowOut])
def list_windows(
    analysis_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    label: str | None = None,
    anomaly_only: bool = False,
):
    _get_owned(db, user, analysis_id)
    query = db.query(AnalysisWindow).filter(AnalysisWindow.analysis_id == analysis_id)
    if label:
        query = query.filter(AnalysisWindow.traffic_label == label)
    if anomaly_only:
        query = query.filter(AnalysisWindow.is_anomaly.is_(True))
    return query.order_by(AnalysisWindow.window_id).all()


@router.get("/{analysis_id}/findings", response_model=FindingsOut)
def list_findings(
    analysis_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    severity: str | None = None,
    q: str | None = None,
):
    row = _get_owned(db, user, analysis_id)
    findings = [FindingOut(**f) for f in (row.findings_json or [])]
    if severity:
        findings = [f for f in findings if f.severity == severity]
    if q:
        findings = [f for f in findings if q.lower() in f.description.lower()]
    return FindingsOut(security_score=row.security_score, risk_level=row.risk_level, findings=findings)


@router.get("/{analysis_id}/traffic", response_model=TrafficMixOut)
def get_traffic(analysis_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _get_owned(db, user, analysis_id)
    windows = db.query(AnalysisWindow).filter(AnalysisWindow.analysis_id == analysis_id).all()
    mix: dict[str, int] = {}
    for w in windows:
        if w.traffic_label:
            mix[w.traffic_label] = mix.get(w.traffic_label, 0) + 1
    total = sum(mix.values()) or 1
    return TrafficMixOut(mix={k: v / total for k, v in mix.items()}, windows_count=len(windows))


@router.get("/{analysis_id}/anomalies", response_model=AnomaliesOut)
def list_anomalies(
    analysis_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    threshold: float | None = None,
):
    _get_owned(db, user, analysis_id)
    windows = (
        db.query(AnalysisWindow)
        .filter(AnalysisWindow.analysis_id == analysis_id)
        .order_by(AnalysisWindow.window_id)
        .all()
    )
    if threshold is not None:
        windows = [w for w in windows if (w.anomaly_score or 0) <= threshold]
    return AnomaliesOut(threshold=threshold, windows=[WindowOut.model_validate(w) for w in windows])
