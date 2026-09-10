from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analyze, assessment, auth, compare, health, history, profile, reports, stubs
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
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])
app.include_router(assessment.router, prefix="/api/assess", tags=["assess"])
app.include_router(compare.router, prefix="/api/compare", tags=["compare"])
app.include_router(reports.router, prefix="/api", tags=["reports"])
app.include_router(stubs.router, prefix="/api", tags=["stubs"])


@app.get("/")
def root():
    return {"service": "tunnelsight", "phase": 0}
