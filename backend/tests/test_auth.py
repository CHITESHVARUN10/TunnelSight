from fastapi.testclient import TestClient

from app.main import app

_run = __import__("uuid").uuid4().hex[:8]


def _register_login(c: TestClient, email="analyst@tunnelsight-test.com"):
    email = email.replace("@", f"+{_run}@")
    r = c.post("/api/auth/register", json={"email": email, "password": "secret123"})
    assert r.status_code == 200, r.text
    r = c.post("/api/auth/login", json={"email": email, "password": "secret123"})
    assert r.status_code == 200, r.text
    return email


def test_health():
    c = TestClient(app)
    r = c.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_auth_profile_cycle():
    c = TestClient(app)
    _register_login(c)
    r = c.get("/api/auth/me")
    assert r.status_code == 200

    r = c.get("/api/profile")
    assert r.status_code == 200
    assert r.json()["display_name"] is None

    r = c.patch("/api/profile", json={"display_name": "A. Analyst", "timezone": "UTC"})
    assert r.status_code == 200, r.text
    assert r.json()["display_name"] == "A. Analyst"

    r = c.post("/api/auth/change-password", json={"old_password": "secret123", "new_password": "newsecret456"})
    assert r.status_code == 200, r.text

    r = c.post("/api/auth/logout")
    assert r.status_code == 200
    assert c.get("/api/auth/me").status_code == 401


def test_password_reset_flow():
    c = TestClient(app)
    email = _register_login(c, email="reset@tunnelsight-test.com")
    r = c.post("/api/auth/forgot-password", json={"email": email})
    assert r.status_code == 200
    token = r.json().get("dev_token")
    assert token

    r = c.post("/api/auth/reset-password", json={"token": token, "new_password": "brandnew789"})
    assert r.status_code == 200, r.text
    # sessions invalidated
    assert c.get("/api/auth/me").status_code == 401
    # token single-use
    r = c.post("/api/auth/reset-password", json={"token": token, "new_password": "another000"})
    assert r.status_code == 400
    # new password works
    r = c.post("/api/auth/login", json={"email": email, "password": "brandnew789"})
    assert r.status_code == 200
