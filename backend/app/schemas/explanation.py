"""Schemas for the OpenRouter-backed AI explanation layer.

The LLM response is validated against `ExplanationOut` before it is persisted, so a
malformed or non-grounded reply never reaches the database or the UI.
"""

from pydantic import BaseModel, Field, field_validator


class ExplanationFinding(BaseModel):
    severity: str = Field(description="Echo of the deterministic finding severity")
    category: str = Field(description="Echo of the deterministic finding category")
    why: str = Field(description="Why this finding matters, grounded in the supplied evidence")
    remediation: str = Field(description="Concrete remediation step")

    @field_validator("severity", "category", "why", "remediation", mode="before")
    @classmethod
    def _coerce_str(cls, value):
        return "" if value is None else str(value).strip()


class ExplanationOut(BaseModel):
    summary: str = ""
    per_finding: list[ExplanationFinding] = []
    model: str | None = None
    generated_at: str | None = None

    @field_validator("summary", mode="before")
    @classmethod
    def _coerce_summary(cls, value):
        return "" if value is None else str(value).strip()

    @field_validator("per_finding", mode="before")
    @classmethod
    def _coerce_list(cls, value):
        return value or []
