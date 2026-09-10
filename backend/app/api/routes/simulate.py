"""Interactive Simulation: generate a synthetic PCAP on-the-fly from user-chosen
IPsec parameters, run the full analysis pipeline, persist, and return results."""

import os
import random
import tempfile
import time

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.analysis_window import AnalysisWindow
from app.models.user import User
from app.schemas.analysis import AnalysisOut
from app.services.analyzer import analyzer

router = APIRouter()

# ── IKEv2 Transform ID mappings (IANA registry) ──
# https://www.iana.org/assignments/ikev2-parameters/ikev2-parameters.xhtml

ENCRYPTION_OPTIONS = {
    "3des":             {"id": 3,  "label": "3DES"},
    "aes-128-cbc":      {"id": 12, "label": "AES-128-CBC"},
    "aes-256-cbc":      {"id": 13, "label": "AES-256-CBC"},
    "aes-128-gcm":      {"id": 20, "label": "AES-128-GCM"},
    "aes-256-gcm":      {"id": 20, "label": "AES-256-GCM"},
    "chacha20-poly1305": {"id": 28, "label": "CHACHA20-POLY1305"},
}

INTEGRITY_OPTIONS = {
    "hmac-md5":      {"id": 1,  "label": "HMAC-MD5"},
    "hmac-sha1":     {"id": 2,  "label": "HMAC-SHA1"},
    "hmac-sha2-256": {"id": 12, "label": "HMAC-SHA2-256"},
    "hmac-sha2-384": {"id": 13, "label": "HMAC-SHA2-384"},
    "hmac-sha2-512": {"id": 14, "label": "HMAC-SHA2-512"},
    "aead":          {"id": 0,  "label": "AEAD (Built-in)"},
}

DH_GROUP_OPTIONS = {
    "1":  {"id": 1,  "label": "Group 1 (768-bit MODP)"},
    "2":  {"id": 2,  "label": "Group 2 (1024-bit MODP)"},
    "5":  {"id": 5,  "label": "Group 5 (1536-bit MODP)"},
    "14": {"id": 14, "label": "Group 14 (2048-bit MODP)"},
    "19": {"id": 19, "label": "Group 19 (256-bit ECP)"},
    "20": {"id": 20, "label": "Group 20 (384-bit ECP)"},
    "21": {"id": 21, "label": "Group 21 (521-bit ECP)"},
}

# Packets after the handshake so windowing/ML see a real multi-window capture.
ESP_BURST_COUNT = 240
ESP_BURST_GAP_SECONDS = 0.05


class SimulateRequest(BaseModel):
    """User-selected IPsec configuration to simulate."""
    encryption: str = Field("aes-256-gcm", description="Encryption algorithm key")
    integrity: str = Field("hmac-sha2-256", description="Integrity algorithm key")
    dh_group: str = Field("19", description="Diffie-Hellman group number")


def _build_synthetic_pcap(enc_id: int, integ_id: int, dh_id: int) -> str:
    """Build a synthetic IKEv2 handshake + ESP burst PCAP.

    Returns the path of a temp file the caller must delete. The first packet
    carries the user's chosen SA proposal so the real parser recovers the
    requested encryption/integrity/DH group; the ESP burst gives the
    windowing/ML stages a meaningful multi-window capture.
    """
    import os as _os

    from scapy.all import ESP, Ether, IP, Raw, UDP, wrpcap
    try:
        from scapy.contrib.ikev2 import (
            IKEv2, IKEv2_payload_Proposal, IKEv2_payload_SA, IKEv2_payload_Transform,
        )
    except ImportError:
        from scapy.contrib.ikev2 import (
            IKEv2, IKEv2_Proposal as IKEv2_payload_Proposal,
            IKEv2_SA as IKEv2_payload_SA,
            IKEv2_Transform as IKEv2_payload_Transform,
        )

    # Type codes: 1=Encryption, 2=PRF, 3=Integrity, 4=DH
    transforms = [
        IKEv2_payload_Transform(transform_type=1, transform_id=enc_id, length=8),
        IKEv2_payload_Transform(transform_type=2, transform_id=2, length=8),  # PRF-HMAC-SHA1
    ]
    if integ_id > 0:  # AEAD ciphers have no separate integrity transform
        transforms.append(
            IKEv2_payload_Transform(transform_type=3, transform_id=integ_id, length=8)
        )
    transforms.append(
        IKEv2_payload_Transform(transform_type=4, transform_id=dh_id, length=8)
    )

    proposal = IKEv2_payload_Proposal(
        proposal=1, proto="IKE", SPIsize=0,
        trans_nb=len(transforms), trans=transforms,
    )
    sa = IKEv2_payload_SA(prop=proposal)

    gw_a, gw_b = "10.0.0.10", "10.0.0.20"
    mac_a, mac_b = "00:11:22:33:44:55", "55:44:33:22:11:00"
    init_spi = b"\x01\x02\x03\x04\x05\x06\x07\x08"
    resp_spi = b"\x08\x07\x06\x05\x04\x03\x02\x01"

    request = (
        Ether(src=mac_a, dst=mac_b)
        / IP(src=gw_a, dst=gw_b)
        / UDP(sport=500, dport=500)
        / IKEv2(
            init_SPI=init_spi,
            next_payload="SA",
            exch_type="IKE_SA_INIT",
        )
        / sa
    )
    reply = (
        Ether(src=mac_b, dst=mac_a)
        / IP(src=gw_b, dst=gw_a)
        / UDP(sport=500, dport=500)
        / IKEv2(
            init_SPI=init_spi,
            resp_SPI=resp_spi,
            next_payload="SA",
            exch_type="IKE_SA_INIT",
        )
        / sa
    )

    rng = random.Random((enc_id << 16) | (integ_id << 8) | dh_id)
    base = time.time()
    packets = [request, reply]
    for i in range(ESP_BURST_COUNT):
        src, dst = (gw_a, gw_b) if i % 2 == 0 else (gw_b, gw_a)
        pkt = (
            Ether(src=mac_a if src == gw_a else mac_b, dst=mac_b if src == gw_a else mac_a)
            / IP(src=src, dst=dst)
            / ESP(spi=0xC0FFEE, seq=i + 1)
            / Raw(load=_os.urandom(rng.randint(64, 1200)))
        )
        pkt.time = base + (i + 2) * ESP_BURST_GAP_SECONDS
        packets.append(pkt)
    request.time = base
    reply.time = base + ESP_BURST_GAP_SECONDS

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pcap")
    tmp.close()
    wrpcap(tmp.name, packets)
    return tmp.name


@router.get("/options")
def list_options(user: User = Depends(get_current_user)):
    """Return the available IPsec configuration options for the simulation UI."""
    return {
        "encryption": {k: v["label"] for k, v in ENCRYPTION_OPTIONS.items()},
        "integrity": {k: v["label"] for k, v in INTEGRITY_OPTIONS.items()},
        "dh_group": {k: v["label"] for k, v in DH_GROUP_OPTIONS.items()},
    }


@router.post("", response_model=AnalysisOut, status_code=201)
def simulate(
    body: SimulateRequest,
    response: Response,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a synthetic PCAP from the chosen config and run the full pipeline."""

    enc = ENCRYPTION_OPTIONS.get(body.encryption.lower())
    integ = INTEGRITY_OPTIONS.get(body.integrity.lower())
    dh = DH_GROUP_OPTIONS.get(str(body.dh_group))

    if not enc:
        raise HTTPException(400, f"Unknown encryption: {body.encryption}. Use GET /api/simulate/options for valid keys.")
    if not integ:
        raise HTTPException(400, f"Unknown integrity: {body.integrity}. Use GET /api/simulate/options for valid keys.")
    if not dh:
        raise HTTPException(400, f"Unknown DH group: {body.dh_group}. Use GET /api/simulate/options for valid keys.")

    filename = f"sim_{enc['label']}_{integ['label']}_DH{dh['id']}.pcap"

    # 1. Create a DB row
    row = Analysis(user_id=user.id, filename=filename, status="processing")
    db.add(row)
    db.commit()
    db.refresh(row)

    # 2. Build synthetic PCAP and run full analysis
    pcap_path = None
    try:
        pcap_path = _build_synthetic_pcap(enc["id"], integ["id"], dh["id"])
        results = analyzer.analyze(filename, pcap_path=pcap_path)
    except Exception as exc:
        row.status = "failed"
        row.config_json = {"error": str(exc)}
        db.commit()
        db.refresh(row)
        response.headers["Location"] = f"/api/history/{row.id}"
        return row
    finally:
        if pcap_path:
            try:
                os.unlink(pcap_path)
            except OSError:
                pass

    # 3. Persist results (identical to the analyze route)
    row.status = "completed"
    row.config_json = {
        "ipsec_config": results["ipsec_config"],
        "windows_count": len(results["windows"]),
        "capture": results.get("capture"),
        "note": results.get("note", ""),
        "evidence_source": results.get("evidence_source", "simulated"),
        "simulation": {
            "requested_encryption": body.encryption,
            "requested_integrity": body.integrity,
            "requested_dh_group": body.dh_group,
        },
    }
    row.anomaly_score = results["anomaly_score"]
    row.traffic_label = results["traffic_label"]
    row.traffic_confidence = results["traffic_confidence"]
    row.security_score = results["security_score"]
    row.risk_level = results["risk_level"]
    row.findings_json = results["findings"]
    for w in results["windows"]:
        db.add(
            AnalysisWindow(
                analysis_id=row.id,
                window_id=w["window_id"],
                window_start=w["window_start"],
                window_end=w["window_end"],
                packet_count=w["packet_count"],
                traffic_label=w["traffic_label"],
                traffic_confidence=w["traffic_confidence"],
                anomaly_score=w["anomaly_score"],
                is_anomaly=w["is_anomaly"],
            )
        )
    db.commit()
    db.refresh(row)
    response.headers["Location"] = f"/api/history/{row.id}"
    return row
