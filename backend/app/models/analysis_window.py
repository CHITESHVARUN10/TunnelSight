import uuid

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AnalysisWindow(Base):
    """Per-window ML output for one analysis. Mock generates 3-8 seeded windows; real parser later."""

    __tablename__ = "analysis_windows"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    window_id: Mapped[int] = mapped_column(Integer, nullable=False)
    window_start: Mapped[float | None] = mapped_column(Float, nullable=True)
    window_end: Mapped[float | None] = mapped_column(Float, nullable=True)
    packet_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    traffic_label: Mapped[str | None] = mapped_column(String(32), nullable=True)
    traffic_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    anomaly_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    is_anomaly: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
