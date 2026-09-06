"""Generate a small demo pcap (stdlib only, no scapy) + label JSON.

Writes testing/pcaps/weak-vpn-07.pcap: ~40 packets capturing an IKEv1-style
exchange over UDP 500 (IKE_SA_INIT / IKE_AUTH with weak proposals: 3DES,
HMAC-MD5, MODP-1024) followed by ESP blobs (SPI 0x41f89c02) carrying
video-like large frames and VoIP-like small frames. Opens in Wireshark/
tshark as UDP + best-effort IKE dissection; payload bytes are synthetic.

Also writes testing/json/weak-vpn-07.json ground-truth label (roadmap S7).

Usage: python testing/make_demo_pcap.py [--out testing/pcaps/weak-vpn-07.pcap]
"""

import argparse
import json
import os
import random
import struct

LINKTYPE_RAW = 101  # raw IP (avoids fake Ethernet)


def ip_packet(src: bytes, dst: bytes, proto: int, payload: bytes) -> bytes:
    ver_ihl, tos = 0x45, 0
    total = 20 + len(payload)
    ident, flags_frag = 0x1234, 0x4000
    ttl, checksum = 64, 0
    hdr = struct.pack(">BBHHHBBH4s4s", ver_ihl, tos, total, ident,
                      flags_frag, ttl, proto, checksum, src, dst)
    return hdr + payload


def udp_packet(sport: int, dport: int, payload: bytes) -> bytes:
    length = 8 + len(payload)
    return struct.pack(">HHHH", sport, dport, length, 0) + payload


def ike_header(spi_i: bytes, spi_r: bytes, msg_id: int, exchange: int) -> bytes:
    # IKEv1 header: SPIi(8) SPIr(8) next(1)=0 ver(1)=0x10 exch(1) flags(1) msgid(4) len(4)
    body = struct.pack(">BB", 0, 0x10) + bytes([exchange, 0]) + struct.pack(">I", msg_id)
    return spi_i + spi_r + body + struct.pack(">I", 36 + 24)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="testing/pcaps/weak-vpn-07.pcap")
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()

    rng = random.Random(args.seed)
    client = bytes([198, 51, 100, 1])
    gw = bytes([203, 0, 113, 44])
    spi_i = bytes.fromhex("41f89c02") + bytes.fromhex("00000001")
    spi_r = bytes.fromhex("9a4f21e8") + bytes.fromhex("00000001")

    pkts = []  # (ts, raw_ip_bytes)
    ts = 1_700_000_000.0

    def push(dt, raw):
        nonlocal ts
        ts += dt
        pkts.append((ts, raw))

    # IKE_SA_INIT (exchange 1) + IKE_AUTH (exchange 4) with weak proposal blob
    weak_proposal = b"3DES-CBC/HMAC-MD5/MODP-1024" + bytes(rng.randrange(256) for _ in range(48))
    for exch, n in ((1, 2), (4, 4)):
        for k in range(n):
            a, b = (client, gw) if k % 2 == 0 else (gw, client)
            ike = ike_header(spi_i, spi_r, k, exch) + weak_proposal
            push(0.05 + rng.random() * 0.2, ip_packet(a, b, 17, udp_packet(500, 500, ike)))

    # ESP traffic: SPI 0x41f89c02, video-like large + voip-like small frames
    spi = struct.pack(">I", 0x41F89C02)
    seq = 1
    for _ in range(16):  # video-ish large frames c->gw / acks back
        size = rng.randint(1000, 1400)
        esp = spi + struct.pack(">I", seq) + bytes(rng.randrange(256) for _ in range(size))
        seq += 1
        push(rng.uniform(0.002, 0.008), ip_packet(client, gw, 50, esp))
        if rng.random() < 0.4:
            ack = spi + struct.pack(">I", seq) + bytes(rng.randrange(256) for _ in range(80))
            seq += 1
            push(0.001, ip_packet(gw, client, 50, ack))
    for _ in range(12):  # voip-ish small periodic both ways
        esp = spi + struct.pack(">I", seq) + bytes(rng.randrange(256) for _ in range(rng.randint(120, 220)))
        seq += 1
        push(0.02, ip_packet(client if seq % 2 else gw, gw if seq % 2 else client, 50, esp))

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "wb") as f:
        f.write(struct.pack("<IHHIIII", 0xA1B2C3D4, 2, 4, 0, 0, 65535, LINKTYPE_RAW))
        for ts_, raw in pkts:
            sec, usec = int(ts_), int((ts_ - int(ts_)) * 1_000_000)
            f.write(struct.pack("<IIII", sec, usec, len(raw), len(raw)) + raw)

    label = {
        "capture_id": "weak-vpn-07",
        "ike_version": "IKEv1",
        "ipsec_protocol": "ESP",
        "mode": "tunnel",
        "cipher": "3DES-CBC",
        "integrity": "HMAC-MD5",
        "dh_group": 2,
        "pfs": False,
        "replay_protection": True,
        "ip_version": "IPv4",
        "traffic_type": "video",
        "packets": len(pkts),
    }
    with open("testing/json/weak-vpn-07.json", "w") as f:
        json.dump(label, f, indent=2)
    print(f"wrote {len(pkts)} packets -> {args.out} + testing/json/weak-vpn-07.json")


if __name__ == "__main__":
    main()
