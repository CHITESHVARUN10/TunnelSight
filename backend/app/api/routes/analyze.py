"""Analyze upload: seeded-mock parser -> rule engine + ML .pkl inference."""

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.analysis_window import AnalysisWindow
from app.models.user import User
from app.schemas.analysis import AnalysisOut
from app.services.analyzer import MOCK_NOTE, analyzer

router = APIRouter()

ALLOWED_EXTENSIONS = {".pcap", ".pcapng", ".cap", ".erf"}
MAX_BYTES = 256 * 1024 * 1024


@router.post("", response_model=AnalysisOut, status_code=201)
def analyze(
    response: Response,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    filename = file.filename or "upload.pcap"
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"unsupported file type: {ext or '(none)'}")
    if file.size is not None and file.size > MAX_BYTES:
        raise HTTPException(status_code=413, detail="file too large")

    row = Analysis(user_id=user.id, filename=filename, status="processing")
    db.add(row)
    db.commit()
    db.refresh(row)

    try:
        results = analyzer.analyze(filename)
    except Exception as exc:
        row.status = "failed"
        row.config_json = {"error": str(exc), "note": MOCK_NOTE}
        db.commit()
        db.refresh(row)
        response.headers["Location"] = f"/api/history/{row.id}"
        return row

    row.status = "completed"
    row.config_json = {
        "ipsec_config": results["ipsec_config"],
        "windows_count": len(results["windows"]),
        "note": MOCK_NOTE,
    }
    row.anomaly_score = results["anomaly_score"]
    row.traffic_label = results["traffic_label"]
    row.traffic_confidence = results["traffic_confidence"]
    row.security_score = results["security_score"]
    row.risk_level = results["risk_level"]
    row.findings_json = results["findings"]
    for w in results["windows"]:
        db.add(
            AnalysisWindow(
                analysis_id=row.id,
                window_id=w["window_id"],
                window_start=w["window_start"],
                window_end=w["window_end"],
                packet_count=w["packet_count"],
                traffic_label=w["traffic_label"],
                traffic_confidence=w["traffic_confidence"],
                anomaly_score=w["anomaly_score"],
                is_anomaly=w["is_anomaly"],
            )
        )
    db.commit()
    db.refresh(row)
    response.headers["Location"] = f"/api/history/{row.id}"
    return row
