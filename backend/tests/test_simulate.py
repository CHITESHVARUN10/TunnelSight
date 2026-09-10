"""Interactive simulation endpoints."""

import uuid

from fastapi.testclient import TestClient

from app.main import app


def _client() -> TestClient:
    c = TestClient(app)
    email = f"simulate+{uuid.uuid4().hex[:8]}@tunnelsight-test.com"
    assert c.post("/api/auth/register", json={"email": email, "password": "secret123"}).status_code == 200
    assert c.post("/api/auth/login", json={"email": email, "password": "secret123"}).status_code == 200
    return c


def test_options_require_auth():
    anon = TestClient(app)
    assert anon.get("/api/simulate/options").status_code == 401


def test_options_shape():
    c = _client()
    r = c.get("/api/simulate/options")
    assert r.status_code == 200, r.text
    body = r.json()
    assert set(body) == {"encryption", "integrity", "dh_group"}
    assert body["encryption"]["aes-256-gcm"] == "AES-256-GCM"
    assert body["integrity"]["aead"] == "AEAD (Built-in)"
    assert body["dh_group"]["19"] == "Group 19 (256-bit ECP)"


def test_simulate_strong_suite_completes():
    c = _client()
    r = c.post(
        "/api/simulate",
        json={"encryption": "aes-256-gcm", "integrity": "aead", "dh_group": "19"},
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "completed"
    assert body["filename"] == "sim_AES-256-GCM_AEAD (Built-in)_DH19.pcap"
    assert f"/api/history/{body['id']}" in r.headers["location"]
    cfg = body["config_json"]
    assert cfg["evidence_source"] == "parser"
    assert cfg["simulation"]["requested_dh_group"] == "19"
    assert cfg["ipsec_config"]["cryptography"]["encryption_algorithm"] == "AES-GCM"
    assert cfg["ipsec_config"]["cryptography"]["dh_group"] == 19
    assert cfg["windows_count"] > 1
    assert cfg["capture"]["packet_count"] >= 240


def test_simulate_weak_suite_raises_findings():
    c = _client()
    r = c.post(
        "/api/simulate",
        json={"encryption": "3des", "integrity": "hmac-md5", "dh_group": "1"},
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "completed"
    assert len(body["findings_json"]) > 0


def test_simulate_rejects_unknown_options():
    c = _client()
    assert c.post("/api/simulate", json={"encryption": "rot13"}).status_code == 400
    assert c.post("/api/simulate", json={"integrity": "none"}).status_code == 400
    assert c.post("/api/simulate", json={"dh_group": "99"}).status_code == 400
