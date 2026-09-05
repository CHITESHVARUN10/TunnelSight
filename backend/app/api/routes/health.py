from fastapi import APIRouter
from sqlalchemy import text

from app.db.base import SessionLocal

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "phase": 0}


@router.get("/ready")
def ready():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready", "db": "up"}
    except Exception as e:
        return {"status": "not-ready", "db": f"down: {e}"}
    finally:
        db.close()
