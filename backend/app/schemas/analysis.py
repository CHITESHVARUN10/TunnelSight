import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AnalysisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    filename: str
    status: str
    config_json: dict | None = None
    anomaly_score: float | None = None
    traffic_label: str | None = None
    traffic_confidence: float | None = None
    security_score: int | None = None
    risk_level: str | None = None
    findings_json: list | None = None
    created_at: datetime
