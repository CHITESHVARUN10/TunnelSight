import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.user import User
from app.schemas.analysis import AnalysisOut
from app.schemas.results import DeltaOut

router = APIRouter()


@router.get("", response_model=dict)
def compare(
    alpha: uuid.UUID,
    beta: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Analysis)
        .filter(Analysis.id.in_([alpha, beta]), Analysis.user_id == user.id)
        .all()
    )
    by_id = {r.id: r for r in rows}
    if alpha not in by_id or beta not in by_id:
        raise HTTPException(status_code=404, detail="not found")
    a, b = by_id[alpha], by_id[beta]
    fields = [
        "status",
        "traffic_label",
        "traffic_confidence",
        "anomaly_score",
        "security_score",
        "risk_level",
    ]
    deltas = [
        DeltaOut(field=f, alpha=getattr(a, f), beta=getattr(b, f))
        for f in fields
        if getattr(a, f) != getattr(b, f)
    ]
    a_cfg = (a.config_json or {}).get("ipsec_config", {})
    b_cfg = (b.config_json or {}).get("ipsec_config", {})
    for section in ("cryptography", "sa_config"):
        for key in (a_cfg.get(section) or {}).keys() | (b_cfg.get(section) or {}).keys():
            va = (a_cfg.get(section) or {}).get(key)
            vb = (b_cfg.get(section) or {}).get(key)
            if va != vb:
                deltas.append(DeltaOut(field=f"{section}.{key}", alpha=va, beta=vb))
    return {
        "alpha": AnalysisOut.model_validate(a).model_dump(),
        "beta": AnalysisOut.model_validate(b).model_dump(),
        "deltas": [d.model_dump() for d in deltas],
    }
