"""Phase 0 stub: accept upload, store pending history row, return UNKNOWN."""

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.user import User
from app.schemas.analysis import AnalysisOut
from app.services.stub import stub_analysis

router = APIRouter()


@router.post("", response_model=AnalysisOut)
def analyze(file: UploadFile, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stub_analysis(file.filename or "upload")
    row = Analysis(user_id=user.id, filename=file.filename or "upload", status="pending", config_json=None, anomaly_score=None)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
