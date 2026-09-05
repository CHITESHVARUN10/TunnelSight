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
    created_at: datetime
