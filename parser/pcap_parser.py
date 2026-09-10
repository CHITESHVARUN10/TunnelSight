"""PCAP -> normalized IPsec configuration + per-packet records.

`parse_pcap_to_json(path)` keeps the original contract (an IPsecConfig-shaped
dict for backend/app/security_engine/schema.py). `extract_packets(path)` exposes
the raw per-packet measurements used to build analysis windows from real bytes.
"""

import os
from typing import Any, Dict, List

from scapy.all import ESP, IP, IPv6, TCP, UDP, rdpcap

try:
    from scapy.contrib.ikev2 import IKEv2_SA
except Exception:  # pragma: no cover - scapy without ikev2 contrib
    IKEv2_SA = None

# --- Mapping dictionaries for IKE transforms ---
# https://www.iana.org/assignments/ikev2-parameters/ikev2-parameters.xhtml

ENCRYPTION_MAP = {
    3: "3DES",
    12: "AES-CBC",
    18: "AES-CTR",
    19: "AES-CCM",
    20: "AES-GCM",
    28: "CHACHA20-POLY1305",
}

INTEGRITY_MAP = {
    1: "HMAC-MD5",
    2: "HMAC-SHA1",
    5: "HMAC-SHA2-256",
    12: "HMAC-SHA2-256",
    13: "HMAC-SHA2-384",
    14: "HMAC-SHA2-512",
}

DH_GROUP_MAP = {
    1: "Group 1 (768-bit MODP)",
    2: "Group 2 (1024-bit MODP)",
    5: "Group 5 (1536-bit MODP)",
    14: "Group 14 (2048-bit MODP)",
    19: "Group 19 (256-bit ECP)",
    20: "Group 20 (384-bit ECP)",
    21: "Group 21 (521-bit ECP)",
    31: "Curve25519",
}

# Ordered most-specific-first so "AES-256-GCM" wins over "AES-256-CBC" style prefixes.
_ENCRYPTION_TEXT = [
    ("CHACHA20-POLY1305", "CHACHA20-POLY1305"),
    ("CHACHA20", "CHACHA20-POLY1305"),
    ("AES-256-GCM", "AES-256-GCM"),
    ("AES-128-GCM", "AES-128-GCM"),
    ("AES-192-GCM", "AES-192-GCM"),
    ("AES-256-CBC", "AES-256-CBC"),
    ("AES-192-CBC", "AES-192-CBC"),
    ("AES-128-CBC", "AES-128-CBC"),
    ("AES-256-CTR", "AES-256-CTR"),
    ("AES-128-CTR", "AES-128-CTR"),
    ("3DES", "3DES"),
    ("DES", "DES"),
]

_INTEGRITY_TEXT = [
    ("HMAC-SHA2-512", "HMAC-SHA2-512"),
    ("HMAC-SHA512", "HMAC-SHA2-512"),
    ("HMAC-SHA2-384", "HMAC-SHA2-384"),
    ("HMAC-SHA2-256", "HMAC-SHA2-256"),
    ("HMAC-SHA256", "HMAC-SHA2-256"),
    ("HMAC-SHA1", "HMAC-SHA1"),
    ("HMAC-MD5", "HMAC-MD5"),
]

_DH_TEXT = [
    ("CURVE25519", 31),
    ("ECP-521", 21),
    ("ECP-384", 20),
    ("ECP-256", 19),
    ("MODP-4096", 16),
    ("MODP-3072", 15),
    ("MODP-2048", 14),
    ("MODP-1536", 5),
    ("MODP-1024", 2),
    ("MODP-768", 1),
]


def _empty_config(pcap_path: str) -> Dict[str, Any]:
    return {
        "capture_name": os.path.basename(pcap_path),
        "cryptography": {
            "encryption_algorithm": "UNKNOWN",
            "integrity_algorithm": "UNKNOWN",
            "dh_group": None,
            "pfs_enabled": False,
        },
        "sa_config": {
            "ike_version": "UNKNOWN",
            "mode": "Tunnel",
            "replay_protection": True,
            "lifetime_seconds": 3600,
        },
    }


def _apply_text_hints(config: Dict[str, Any], text: str) -> None:
    """Recover SA parameters from captures that embed a human-readable suite."""
    up = text.upper()
    crypto = config["cryptography"]
    if crypto["encryption_algorithm"] == "UNKNOWN":
        for needle, alg in _ENCRYPTION_TEXT:
            if needle in up:
                crypto["encryption_algorithm"] = alg
                break
    if crypto["integrity_algorithm"] == "UNKNOWN":
        for needle, alg in _INTEGRITY_TEXT:
            if needle in up:
                crypto["integrity_algorithm"] = alg
                break
    if crypto["dh_group"] is None:
        for needle, group in _DH_TEXT:
            if needle in up:
                crypto["dh_group"] = group
                break


def _iter_transforms(sa_payload: Any):
    """Walk the IKEv2 proposal -> transform chain emitted by scapy.

    scapy hangs the first transform off the proposal's ``trans`` attribute and
    chains the rest through ``payload``.
    """
    node = getattr(sa_payload, "prop", None)
    depth = 0
    while node is not None and depth < 64:
        if hasattr(node, "transform_type") and hasattr(node, "transform_id"):
            yield int(node.transform_type), int(node.transform_id)
            nxt = getattr(node, "payload", None)
        else:
            nxt = getattr(node, "trans", None) or getattr(node, "payload", None)
        if nxt is None or type(nxt).__name__ == "NoPayload":
            break
        node = nxt
        depth += 1


def extract_packets(
    pcap_path: str, *, hex_bytes: int = 64, hex_max: int = 25
) -> List[Dict[str, Any]]:
    """Per-packet measurements (timestamp, length, endpoints, protocol class).

    The first ``hex_max`` packets also carry a bounded raw ``hex`` preview so the
    UI can show real bytes instead of a fabricated dump.
    """
    if not os.path.exists(pcap_path):
        raise FileNotFoundError(f"PCAP file not found: {pcap_path}")

    packets = []
    for index, pkt in enumerate(rdpcap(pcap_path)):
        if pkt.haslayer(IP):
            src, dst = pkt[IP].src, pkt[IP].dst
        elif pkt.haslayer(IPv6):
            src, dst = pkt[IPv6].src, pkt[IPv6].dst
        else:
            src = dst = None

        if pkt.haslayer(ESP):
            proto = "esp"
        elif pkt.haslayer(UDP) and (pkt[UDP].sport in (500, 4500) or pkt[UDP].dport in (500, 4500)):
            proto = "ike"
        elif pkt.haslayer(TCP):
            proto = "tcp"
        elif pkt.haslayer(UDP):
            proto = "udp"
        else:
            proto = "other"

        record: Dict[str, Any] = {
            "ts": float(pkt.time),
            "length": int(len(pkt)),
            "src": src,
            "dst": dst,
            "proto": proto,
        }
        if index < hex_max:
            raw = bytes(pkt)[:hex_bytes]
            record["hex"] = " ".join(f"{b:02x}" for b in raw)
            record["hex_truncated"] = len(pkt) > len(raw)
        packets.append(record)
    return packets


def parse_pcap_to_json(pcap_path: str) -> Dict[str, Any]:
    """Parse a capture into the standardized IPsecConfig-shaped JSON schema."""
    if not os.path.exists(pcap_path):
        raise FileNotFoundError(f"PCAP file not found: {pcap_path}")

    print(f"[->] Parsing PCAP: {pcap_path}")
    packets = rdpcap(pcap_path)
    config = _empty_config(pcap_path)
    crypto = config["cryptography"]
    sa_cfg = config["sa_config"]
    text_hints = []
    child_sa_ke = False

    for pkt in packets:
        if pkt.haslayer(UDP) and (pkt[UDP].sport in (500, 4500) or pkt[UDP].dport in (500, 4500)):
            payload = bytes(pkt[UDP].payload)
            text_hints.append(payload.decode("latin-1", errors="ignore"))

            ike_layer = pkt.getlayer("ISAKMP")
            if ike_layer is not None and getattr(ike_layer, "version", None) is not None:
                version = ike_layer.version
                sa_cfg["ike_version"] = "IKEv2" if version >= 0x20 else "IKEv1"
            elif pkt.haslayer("IKEv2"):
                sa_cfg["ike_version"] = "IKEv2"

            # IKEv2 CREATE_CHILD_SA (36) carrying a KE payload is direct PFS evidence.
            ikev2_layer = pkt.getlayer("IKEv2")
            if ikev2_layer is not None and getattr(ikev2_layer, "exch_type", None) == 36:
                if pkt.haslayer("IKEv2_KE"):
                    child_sa_ke = True

            if IKEv2_SA is not None and pkt.haslayer(IKEv2_SA):
                for t_type, t_id in _iter_transforms(pkt[IKEv2_SA]):
                    if t_type == 1:
                        crypto["encryption_algorithm"] = ENCRYPTION_MAP.get(
                            t_id, f"ENCR_TYPE_{t_id}"
                        )
                    elif t_type == 3:
                        crypto["integrity_algorithm"] = INTEGRITY_MAP.get(
                            t_id, f"INTEG_TYPE_{t_id}"
                        )
                    elif t_type == 4:
                        crypto["dh_group"] = t_id

        if crypto["encryption_algorithm"] != "UNKNOWN" and crypto["dh_group"] is not None:
            break

    _apply_text_hints(config, "\n".join(text_hints))

    has_esp = any(p.haslayer(ESP) for p in packets)
    sa_cfg["mode"] = "Tunnel" if has_esp else sa_cfg["mode"]

    enc = crypto["encryption_algorithm"]
    if any(tag in enc for tag in ("GCM", "CCM", "CHACHA20")):
        if crypto["integrity_algorithm"] == "UNKNOWN":
            crypto["integrity_algorithm"] = "AEAD (Built-in)"

    # A phase-1 proposal group is not proof of PFS: IKEv2 rekeys child SAs with a
    # fresh KE by default, IKEv1 needs an observed Quick Mode KE exchange.
    crypto["pfs_enabled"] = bool(
        (sa_cfg["ike_version"] == "IKEv2" and crypto["dh_group"] is not None) or child_sa_ke
    )

    return config
