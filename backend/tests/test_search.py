"""Dynamic global search over the caller's own analyses."""

import uuid

from fastapi.testclient import TestClient

from app.main import app


def _client() -> TestClient:
    c = TestClient(app)
    email = f"search+{uuid.uuid4().hex[:8]}@tunnelsight-test.com"
    assert c.post("/api/auth/register", json={"email": email, "password": "secret123"}).status_code == 200
    assert c.post("/api/auth/login", json={"email": email, "password": "secret123"}).status_code == 200
    return c


def _seed(c: TestClient) -> None:
    r = c.post("/api/analyze", files={"file": ("branch-emea.pcap", b"fake-pcap-bytes")})
    assert r.status_code == 201, r.text
    r = c.post(
        "/api/simulate",
        json={"encryption": "3des", "integrity": "hmac-md5", "dh_group": "1"},
    )
    assert r.status_code == 201, r.text


def test_search_requires_auth():
    anon = TestClient(app)
    assert anon.get("/api/search").status_code == 401


def test_search_rejects_unknown_scope():
    c = _client()
    assert c.get("/api/search", params={"scope": "bogus"}).status_code == 400


def test_search_finds_own_captures_and_reports():
    c = _client()
    _seed(c)
    body = c.get("/api/search", params={"q": "branch"}).json()
    assert body["counts"]["captures"] == 1
    cap = body["groups"]["captures"][0]
    assert cap["filename"] == "branch-emea.pcap"
    assert cap["suite"] and cap["id"]
    assert body["counts"]["reports"] >= 1

    # Other users' data must not leak.
    other = _client()
    assert other.get("/api/search", params={"q": "branch"}).json()["total"] == 0


def test_search_matches_findings_and_vpns():
    c = _client()
    _seed(c)
    body = c.get("/api/search", params={"q": "3des"}).json()
    assert body["counts"]["findings"] >= 1
    assert all("analysis_id" in f for f in body["groups"]["findings"])
    assert body["counts"]["vpns"] >= 1
    assert all(v["captures"] >= 1 for v in body["groups"]["vpns"])


def test_search_scope_filters_groups_but_keeps_counts():
    c = _client()
    _seed(c)
    body = c.get("/api/search", params={"q": "", "scope": "captures"}).json()
    assert body["groups"]["captures"], "empty q returns recent captures"
    assert body["groups"]["findings"] == []
    assert body["groups"]["docs"] == []
    assert body["counts"]["findings"] > 0, "counts still computed for chips"
    assert body["counts"]["docs"] > 0


def test_search_docs_index_filters_by_query():
    c = _client()
    body = c.get("/api/search", params={"q": "rfc compliance"}).json()
    titles = [d["title"] for d in body["groups"]["docs"]]
    assert any("RFC" in t for t in titles)
    assert c.get("/api/search", params={"q": "zzz-no-such-thing"}).json()["groups"]["docs"] == []
