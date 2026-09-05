import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.user import User
from app.schemas.analysis import AnalysisOut

router = APIRouter()


@router.get("", response_model=list[AnalysisOut])
def list_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Analysis).filter(Analysis.user_id == user.id).order_by(Analysis.created_at.desc()).limit(100).all()
    return rows


@router.get("/{analysis_id}", response_model=AnalysisOut)
def get_history_item(analysis_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from fastapi import HTTPException

    row = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return row
