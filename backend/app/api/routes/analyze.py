"""Phase 0 stub: accept upload, store pending history row, return UNKNOWN."""

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.user import User
from app.schemas.analysis import AnalysisOut
from app.services.analyzer import analyzer

router = APIRouter()

@router.post("", response_model=AnalysisOut)
def analyze(file: UploadFile, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    filename = file.filename or "upload.pcap"
    
    # Run the full pipeline (Mock Parser -> Rule Engine & ML Models)
    results = analyzer.analyze(filename)
    
    # Save to the database
    row = Analysis(
        user_id=user.id, 
        filename=filename, 
        status="completed", 
        config_json=results,  # Store the entire bundled result (Security Score, ML Class, Findings)
        anomaly_score=results["anomaly_score"]
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    
    return row
