"""PDF report + AI explanation layer."""

import uuid

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import explainer

_run = uuid.uuid4().hex[:8]


def _client() -> TestClient:
    c = TestClient(app)
    email = f"reports+{_run}{uuid.uuid4().hex[:4]}@tunnelsight-test.com"
    assert c.post("/api/auth/register", json={"email": email, "password": "secret123"}).status_code == 200
    assert c.post("/api/auth/login", json={"email": email, "password": "secret123"}).status_code == 200
    return c


def _upload(c: TestClient) -> dict:
    r = c.post("/api/analyze", files={"file": ("report-check.pcap", b"fake-pcap-bytes")})
    assert r.status_code == 201, r.text
    return r.json()


# --- PDF ------------------------------------------------------------------


def test_pdf_report_is_a_real_pdf():
    c = _client()
    row = _upload(c)

    r = c.get(f"/api/history/{row['id']}/report.pdf")
    assert r.status_code == 200, r.text
    assert r.headers["content-type"] == "application/pdf"
    assert r.content.startswith(b"%PDF-")
    assert len(r.content) > 1500
    assert "attachment" in r.headers["content-disposition"]
    assert r.headers["content-disposition"].endswith('-report.pdf"')


def test_pdf_report_requires_ownership():
    owner = _client()
    row = _upload(owner)

    other = _client()
    assert other.get(f"/api/history/{row['id']}/report.pdf").status_code == 404
    assert other.get(f"/api/history/{uuid.uuid4()}/report.pdf").status_code == 404


def test_pdf_report_requires_auth():
    c = _client()
    row = _upload(c)
    anon = TestClient(app)
    assert anon.get(f"/api/history/{row['id']}/report.pdf").status_code == 401


# --- AI explanation -------------------------------------------------------


@pytest.fixture()
def fake_model(monkeypatch):
    """Pretend OPENROUTER_API_KEY is set and stub the upstream call."""
    monkeypatch.setattr(explainer.settings, "OPENROUTER_API_KEY", "test-key")

    calls = {"count": 0}

    def _fake_generate(evidence):
        calls["count"] += 1
        return {
            "summary": f"Grounded summary for {evidence['capture']['filename']}.",
            "per_finding": [
                {
                    "severity": f["severity"],
                    "category": f["category"],
                    "why": "Derived from the deterministic finding.",
                    "remediation": "Apply the hardened proposal.",
                }
                for f in evidence["findings"]
            ],
            "model": explainer.settings.OPENROUTER_MODEL,
            "generated_at": "2026-09-10T00:00:00+00:00",
        }

    monkeypatch.setattr(explainer, "generate", _fake_generate)
    return calls


def test_explanation_is_generated_then_served_from_cache(fake_model):
    c = _client()
    row = _upload(c)

    assert c.get(f"/api/history/{row['id']}/explanation").status_code == 404

    first = c.post(f"/api/history/{row['id']}/explanation")
    assert first.status_code == 200, first.text
    body = first.json()
    assert body["summary"]
    assert body["model"]
    assert len(body["per_finding"]) == len(row["findings_json"])
    assert fake_model["count"] == 1

    cached = c.get(f"/api/history/{row['id']}/explanation")
    assert cached.status_code == 200
    assert cached.json() == body
    assert fake_model["count"] == 1, "GET must not call the model again"

    # POST without regenerate also serves the cache.
    assert c.post(f"/api/history/{row['id']}/explanation").json() == body
    assert fake_model["count"] == 1

    # regenerate forces a fresh call.
    assert c.post(f"/api/history/{row['id']}/explanation?regenerate=true").status_code == 200
    assert fake_model["count"] == 2


def test_explanation_scoped_to_owner(fake_model):
    owner = _client()
    row = _upload(owner)
    other = _client()
    assert other.get(f"/api/history/{row['id']}/explanation").status_code == 404
    assert other.post(f"/api/history/{row['id']}/explanation").status_code == 404


def test_explanation_returns_503_without_api_key(monkeypatch):
    monkeypatch.setattr(explainer.settings, "OPENROUTER_API_KEY", "")
    c = _client()
    row = _upload(c)

    r = c.post(f"/api/history/{row['id']}/explanation")
    assert r.status_code == 503
    assert "OPENROUTER_API_KEY" in r.json()["detail"]

    # The deterministic findings stay available when the AI layer is off.
    assert c.get(f"/api/history/{row['id']}/findings").status_code == 200
    assert c.get(f"/api/history/{row['id']}/report.pdf").status_code == 200


def test_evidence_excludes_raw_packets():
    c = _client()
    row = _upload(c)
    from app.models.analysis import Analysis
    from app.db.base import SessionLocal
    from app.models.analysis_window import AnalysisWindow

    with SessionLocal() as db:
        orm = db.query(Analysis).filter(Analysis.id == uuid.UUID(row["id"])).first()
        windows = (
            db.query(AnalysisWindow)
            .filter(AnalysisWindow.analysis_id == orm.id)
            .order_by(AnalysisWindow.window_id)
            .all()
        )
        evidence = explainer.build_evidence(orm, windows)

    assert set(evidence) == {"capture", "ipsec_config", "assessment", "findings", "windows"}
    assert "hex" not in str(evidence)
    assert "packets_preview" not in str(evidence)
