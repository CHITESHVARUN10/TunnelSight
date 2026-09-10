"""
Generate multiple synthetic IKEv2 PCAP files with different security configurations.
Each file represents a different IPsec VPN setup ranging from CRITICAL to SECURE.
"""

import os
import sys

try:
    from scapy.all import wrpcap, Ether, IP, UDP
    from scapy.contrib.ikev2 import IKEv2, IKEv2_payload_SA, IKEv2_payload_Proposal, IKEv2_payload_Transform
except ImportError:
    from scapy.all import wrpcap, Ether, IP, UDP
    from scapy.contrib.ikev2 import IKEv2, IKEv2_SA, IKEv2_Proposal, IKEv2_Transform
    IKEv2_payload_SA = IKEv2_SA
    IKEv2_payload_Proposal = IKEv2_Proposal
    IKEv2_payload_Transform = IKEv2_Transform


# ── IKEv2 Transform Type IDs ──
ENCR = 1   # Encryption
PRF  = 2   # Pseudo-Random Function
INTEG = 3  # Integrity
DH   = 4   # Diffie-Hellman Group

# ── Transform ID Reference ──
# Encryption:  3 = 3DES,  12 = AES-CBC-128,  13 = AES-CBC-256,  18 = AES-GCM-16 (256-bit)
# Integrity:   2 = HMAC-SHA1-96,  12 = HMAC-SHA2-256-128,  14 = HMAC-SHA2-512-256
# PRF:         2 = PRF-HMAC-SHA1, 5 = PRF-HMAC-SHA2-256,   7 = PRF-AES128-CMAC
# DH Group:    2 = 1024-bit MODP, 14 = 2048-bit MODP,  19 = 256-bit ECP,  21 = 521-bit ECP

CONFIGS = [
    {
        "name": "ipsec_legacy.pcap",
        "label": "CRITICAL – 3DES + SHA1 + DH Group 2",
        "encr_id": 3,    # 3DES
        "integ_id": 2,   # HMAC-SHA1-96
        "prf_id": 2,     # PRF-HMAC-SHA1
        "dh_id": 2,      # 1024-bit MODP (Group 2)
    },
    {
        "name": "ipsec_weak_aes128.pcap",
        "label": "HIGH – AES-128-CBC + SHA1 + DH Group 2",
        "encr_id": 12,   # AES-CBC-128
        "integ_id": 2,   # HMAC-SHA1-96
        "prf_id": 2,     # PRF-HMAC-SHA1
        "dh_id": 2,      # 1024-bit MODP (Group 2)
    },
    {
        "name": "ipsec_medium.pcap",
        "label": "MEDIUM – AES-128-CBC + SHA256 + DH Group 14",
        "encr_id": 12,   # AES-CBC-128
        "integ_id": 12,  # HMAC-SHA2-256-128
        "prf_id": 5,     # PRF-HMAC-SHA2-256
        "dh_id": 14,     # 2048-bit MODP (Group 14)
    },
    {
        "name": "ipsec_strong.pcap",
        "label": "LOW – AES-256-CBC + SHA256 + DH Group 19",
        "encr_id": 13,   # AES-CBC-256
        "integ_id": 12,  # HMAC-SHA2-256-128
        "prf_id": 5,     # PRF-HMAC-SHA2-256
        "dh_id": 19,     # 256-bit ECP (Group 19)
    },
    {
        "name": "ipsec_modern.pcap",
        "label": "SECURE – AES-256-GCM + SHA512 + DH Group 21",
        "encr_id": 18,   # AES-GCM-16 (256-bit)
        "integ_id": 14,  # HMAC-SHA2-512-256
        "prf_id": 5,     # PRF-HMAC-SHA2-256
        "dh_id": 21,     # 521-bit ECP (Group 21)
    },
]


def build_pcap(cfg: dict, out_dir: str) -> str:
    """Build a single synthetic IKEv2 SA_INIT pcap from a config dict."""

    transforms = [
        IKEv2_payload_Transform(transform_type=ENCR,  transform_id=cfg["encr_id"],  length=8),
        IKEv2_payload_Transform(transform_type=PRF,   transform_id=cfg["prf_id"],   length=8),
        IKEv2_payload_Transform(transform_type=INTEG, transform_id=cfg["integ_id"], length=8),
        IKEv2_payload_Transform(transform_type=DH,    transform_id=cfg["dh_id"],    length=8),
    ]

    proposal = IKEv2_payload_Proposal(
        proposal=1,
        proto="IKE",
        SPIsize=0,
        trans_nb=len(transforms),
        trans=transforms,
    )

    sa = IKEv2_payload_SA(prop=proposal)

    pkt = (
        Ether(src="00:11:22:33:44:55", dst="55:44:33:22:11:00")
        / IP(src="10.0.0.10", dst="10.0.0.20")
        / UDP(sport=500, dport=500)
        / IKEv2(
            init_SPI=b"\x01\x02\x03\x04\x05\x06\x07\x08",
            next_payload="SA",
            exch_type="IKE_SA_INIT",
        )
        / sa
    )

    path = os.path.join(out_dir, cfg["name"])
    wrpcap(path, [pkt])
    return path


def main():
    out_dir = os.path.join("testbed", "pcaps")
    os.makedirs(out_dir, exist_ok=True)

    print("=" * 60)
    print("  TunnelSight – Synthetic PCAP Generator")
    print("=" * 60)

    for cfg in CONFIGS:
        path = build_pcap(cfg, out_dir)
        print(f"  [+] {cfg['label']}")
        print(f"      -> {path}")

    print("=" * 60)
    print(f"  Generated {len(CONFIGS)} PCAP files in {out_dir}/")
    print("=" * 60)


if __name__ == "__main__":
    main()
