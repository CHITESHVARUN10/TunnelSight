import uuid

from pydantic import BaseModel, ConfigDict


class WindowOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    window_id: int
    window_start: float | None = None
    window_end: float | None = None
    packet_count: int | None = None
    traffic_label: str | None = None
    traffic_confidence: float | None = None
    anomaly_score: float | None = None
    is_anomaly: bool | None = None


class FindingOut(BaseModel):
    severity: str
    category: str
    description: str


class FindingsOut(BaseModel):
    security_score: int | None = None
    risk_level: str | None = None
    findings: list[FindingOut] = []


class TrafficMixOut(BaseModel):
    mix: dict[str, float] = {}
    windows_count: int = 0


class AnomaliesOut(BaseModel):
    engine: str = "if v1"
    threshold: float | None = None
    windows: list[WindowOut] = []


class DeltaOut(BaseModel):
    field: str
    alpha: object | None = None
    beta: object | None = None
