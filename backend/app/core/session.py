"""Server-side session helpers backed by Postgres sessions table."""

import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.session import Session as SessionModel


def _expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(days=settings.SESSION_EXPIRE_DAYS)


def create_session(db: Session, user_id) -> SessionModel:
    token = secrets.token_urlsafe(32)
    row = SessionModel(id=token, user_id=user_id, expires_at=_expiry())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def destroy_session(db: Session, token: str) -> None:
    row = db.get(SessionModel, token)
    if row:
        db.delete(row)
        db.commit()


def get_session(db: Session, token: str | None) -> SessionModel | None:
    if not token:
        return None
    row = db.get(SessionModel, token)
    if not row:
        return None
    expires = row.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < datetime.now(timezone.utc):
        db.delete(row)
        db.commit()
        return None
    return row


def cookie_kwargs() -> dict:
    # Secure=False for local http dev; set True behind https in prod.
    return {"httponly": True, "samesite": "lax", "secure": False, "path": "/"}
