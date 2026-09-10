import os

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.analyzer import analyzer

try:
    from parser.pcap_parser import extract_packets, parse_pcap_to_json
except ImportError:  # pragma: no cover - parser package not on path
    extract_packets = parse_pcap_to_json = None

_run = __import__("uuid").uuid4().hex[:8]


def _client() -> TestClient:
    c = TestClient(app)
    email = f"analyze+{_run}{__import__('uuid').uuid4().hex[:4]}@tunnelsight-test.com"
    assert c.post("/api/auth/register", json={"email": email, "password": "secret123"}).status_code == 200
    assert c.post("/api/auth/login", json={"email": email, "password": "secret123"}).status_code == 200
    return c


def _upload(c: TestClient, filename: str = "weak-vpn-07.pcap") -> dict:
    r = c.post("/api/analyze", files={"file": (filename, b"fake-pcap-bytes")})
    assert r.status_code == 201, r.text
    return r.json()


def test_analyze_deterministic_and_populated():
    c = _client()
    first = _upload(c)
    assert first["status"] == "completed"
    assert first["traffic_label"] in ("video", "web", "voip", "icmp", "email")
    assert 0 <= first["traffic_confidence"] <= 1
    assert 0 <= first["security_score"] <= 100
    assert first["risk_level"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    assert isinstance(first["findings_json"], list)
    assert first["config_json"]["note"].startswith("mock-seeded")

    second = _upload(c)
    for key in ("traffic_label", "traffic_confidence", "anomaly_score", "security_score", "risk_level"):
        assert second[key] == first[key]

    r = c.get(f"/api/history/{first['id']}/windows")
    assert r.status_code == 200
    assert 3 <= len(r.json()) <= 8


def test_analyze_rejects_bad_extension():
    c = _client()
    r = c.post("/api/analyze", files={"file": ("notes.txt", b"nope")})
    assert r.status_code == 400


def test_assess_config_strong_vs_weak():
    c = _client()
    strong = {
        "capture_name": "strong.pcap",
        "cryptography": {
            "encryption_algorithm": "AES-256-GCM",
            "integrity_algorithm": "AEAD",
            "dh_group": 19,
            "pfs_enabled": True,
        },
        "sa_config": {"ike_version": "IKEv2", "mode": "Tunnel", "replay_protection": True},
    }
    weak = {
        "capture_name": "weak.pcap",
        "cryptography": {
            "encryption_algorithm": "3DES",
            "integrity_algorithm": "HMAC-MD5",
            "dh_group": 2,
            "pfs_enabled": False,
        },
        "sa_config": {"ike_version": "IKEv1", "mode": "Transport", "replay_protection": False},
    }
    rs = c.post("/api/assess/config", json=strong).json()
    rw = c.post("/api/assess/config", json=weak).json()
    assert rs["total_score"] >= 90 and rs["risk_level"] == "LOW"
    assert rw["total_score"] < 50 and rw["risk_level"] == "CRITICAL"


def test_compare_two_analyses():
    c = _client()
    a = _upload(c, "a-compare.pcap")
    b = _upload(c, "b-compare.pcap")
    r = c.get(f"/api/compare?alpha={a['id']}&beta={b['id']}")
    assert r.status_code == 200
    body = r.json()
    assert body["alpha"]["id"] == a["id"]
    assert body["beta"]["id"] == b["id"]
    assert isinstance(body["deltas"], list)


def test_history_envelope_and_delete():
    c = _client()
    row = _upload(c, "history-check.pcap")
    r = c.get("/api/history?q=history-check&limit=5")
    assert r.status_code == 200
    assert r.json()["total"] >= 1
    r = c.delete(f"/api/history/{row['id']}")
    assert r.status_code == 200
    assert c.get(f"/api/history/{row['id']}").status_code == 404


def test_analyzer_seeded():
    first = analyzer.analyze("seed-check.pcap")
    second = analyzer.analyze("seed-check.pcap")
    assert first["traffic_label"] == second["traffic_label"]
    assert first["security_score"] == second["security_score"]
    assert len(first["windows"]) == len(second["windows"])


# --- Real capture fixtures (skipped when the repo samples are absent) ---

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.."))
_WEAK_CAPTURE = os.path.join(_REPO_ROOT, "frontend/public/demo/weak-vpn-07.pcap")
_MODERN_CAPTURE = os.path.join(_REPO_ROOT, "testbed/pcaps/ipsec_modern.pcap")


@pytest.mark.skipif(not os.path.exists(_WEAK_CAPTURE), reason="demo capture not present")
def test_parser_recovers_weak_ikev1_suite():
    config = parse_pcap_to_json(_WEAK_CAPTURE)
    assert config["sa_config"]["ike_version"] == "IKEv1"
    assert config["cryptography"]["encryption_algorithm"] == "3DES"
    assert config["cryptography"]["integrity_algorithm"] == "HMAC-MD5"
    assert config["cryptography"]["dh_group"] == 2
    assert config["cryptography"]["pfs_enabled"] is False


@pytest.mark.skipif(not os.path.exists(_MODERN_CAPTURE), reason="testbed capture not present")
def test_parser_recovers_modern_ikev2_suite():
    config = parse_pcap_to_json(_MODERN_CAPTURE)
    assert config["sa_config"]["ike_version"] == "IKEv2"
    assert config["cryptography"]["encryption_algorithm"] == "AES-GCM"
    assert config["cryptography"]["dh_group"] == 19
    assert config["cryptography"]["pfs_enabled"] is True


@pytest.mark.skipif(not os.path.exists(_WEAK_CAPTURE), reason="demo capture not present")
def test_windows_are_derived_from_packets():
    packets = extract_packets(_WEAK_CAPTURE)
    result = analyzer.analyze("uploaded-weak.pcap", pcap_path=_WEAK_CAPTURE)

    assert result["evidence_source"] == "parser"
    assert result["capture"]["packet_count"] == len(packets)
    assert result["capture"]["total_bytes"] == sum(p["length"] for p in packets)
    assert result["capture"]["file_bytes"] == os.path.getsize(_WEAK_CAPTURE)

    assert 1 <= len(result["windows"]) <= 8
    assert sum(w["packet_count"] for w in result["windows"]) == len(packets)

    starts = [w["window_start"] for w in result["windows"]]
    assert starts == sorted(starts)
    assert starts[0] == 0.0

    labels = {w["traffic_label"] for w in result["windows"]}
    assert labels <= {"video", "web", "voip", "icmp", "email"}


@pytest.mark.skipif(not os.path.exists(_WEAK_CAPTURE), reason="demo capture not present")
def test_real_upload_flows_through_api():
    c = _client()
    with open(_WEAK_CAPTURE, "rb") as fh:
        r = c.post("/api/analyze", files={"file": ("weak-vpn-07.pcap", fh.read())})
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "completed"
    assert body["config_json"]["evidence_source"] == "parser"
    assert body["config_json"]["ipsec_config"]["cryptography"]["encryption_algorithm"] == "3DES"
    assert body["config_json"]["capture"]["packet_count"] > 0

    windows = c.get(f"/api/history/{body['id']}/windows").json()
    assert len(windows) == body["config_json"]["windows_count"]
