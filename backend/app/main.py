from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analyze, auth, health, history
from app.core.config import settings

app = FastAPI(title="TunnelSight API", version="0.0.0-phase0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])


@app.get("/")
def root():
    return {"service": "tunnelsight", "phase": 0}
