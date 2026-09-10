from fastapi.testclient import TestClient

from app.main import app

_run = __import__("uuid").uuid4().hex[:8]


def _client() -> TestClient:
    c = TestClient(app)
    email = f"stubs+{_run}{__import__('uuid').uuid4().hex[:4]}@tunnelsight-test.com"
    assert c.post("/api/auth/register", json={"email": email, "password": "secret123"}).status_code == 200
    assert c.post("/api/auth/login", json={"email": email, "password": "secret123"}).status_code == 200
    return c


def _upload(c: TestClient) -> dict:
    r = c.post("/api/analyze", files={"file": ("stub-check.pcap", b"fake-bytes")})
    assert r.status_code == 201, r.text
    return r.json()


def test_stubs_require_auth():
    c = TestClient(app)
    assert c.get("/api/search?q=x").status_code == 401
    assert c.get("/api/datasets/summary").status_code == 401
    assert c.get("/api/engine/health").status_code == 401


def test_export_json_roundtrip():
    c = _client()
    row = _upload(c)
    r = c.get(f"/api/history/{row['id']}/export?format=json")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["capture"] == row["filename"]
    assert len(body["findings"]) == len(row["findings_json"] or [])
    assert len(body["windows"]) >= 3


def test_export_csv_and_bad_format():
    c = _client()
    row = _upload(c)
    r = c.get(f"/api/history/{row['id']}/export?format=csv")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/csv")
    r = c.get(f"/api/history/{row['id']}/export?format=pdf")
    assert r.status_code == 400


def test_search_reports_engine_live():
    c = _client()
    row = _upload(c)
    r = c.get(f"/api/search?q={row['filename'][:8]}")
    assert r.status_code == 200
    assert r.json()["total"] >= 1
    r = c.post(f"/api/history/{row['id']}/reports", json={"type": "executive"})
    assert r.status_code == 202
    assert r.json()["type"] == "executive"
    r = c.get("/api/datasets/summary")
    assert r.status_code == 200
    assert r.json()["total"] > 0
    r = c.get("/api/engine/health")
    assert r.json()["active"] == "2/2"
    r = c.post("/api/live/status")
    assert r.json()["supported"] is False
