"""Packet-level synthetic flow simulator for Isolation Forest training.

Unlike data/generate.py (direct row sampling), this simulates individual
packets (timestamp, size, direction) per archetype process and DERIVES the
18 ml/features.py features from the packet list. Derived features are
internally consistent by construction (mean_iat <-> pps, sizes <-> bytes).

Normal archetypes (label=normal): web, video, voip, icmp, email, file_transfer
Anomaly archetypes (label=anomaly, eval only): flood, exfil, beacon, scan

Sizes include ~30-60B simulated ESP overhead. All randomness from one seed.

Usage:
  python data/simulate.py --n-normal 4200 --n-anomaly 800 --seed 42 \\
      --out data/output/flows.csv --meta data/output/metadata.csv
"""

import argparse
import csv
import random
import statistics

ESP_OVERHEAD = (30, 60)

NORMAL = ["web", "video", "voip", "icmp", "email", "file_transfer"]
ANOMALY = ["flood", "exfil", "beacon", "scan"]


def _size(rng: random.Random, lo: int, hi: int) -> int:
    return rng.randint(lo, hi) + rng.randint(*ESP_OVERHEAD)


def _packets(rng: random.Random, kind: str, duration: float):
    """Return list of (t, size, dir_up: bool)."""
    pkts = []
    t = 0.0

    def emit(t, lo, hi, up_p):
        pkts.append((t, _size(rng, lo, hi), rng.random() < up_p))

    if kind == "web":  # bursty ON/OFF
        while t < duration:
            if rng.random() < 0.45:  # burst
                burst_len = rng.uniform(0.2, 2.0)
                end = t + burst_len
                while t < end:
                    emit(t, 64, 1400, 0.3)
                    t += rng.uniform(0.002, 0.015)
            else:
                t += rng.uniform(0.3, 2.5)  # idle gap
    elif kind == "video":  # sustained high-bps, down-heavy
        rate = rng.uniform(1.2e6, 4.0e6)  # bits/s
        while t < duration:
            emit(t, 1000, 1400, 0.08)
            t += (1200 * 8 / rate) * rng.uniform(0.7, 1.3)
    elif kind == "voip":  # small periodic both dirs
        step = rng.uniform(0.018, 0.022)
        while t < duration:
            emit(t, 120, 220, rng.random() < 0.5)
            t += step * rng.uniform(0.9, 1.1)
    elif kind == "icmp":  # 1pps echo pairs
        while t < duration:
            emit(t, 84 - 40, 84 - 40, True)
            emit(t + 0.005, 84 - 40, 84 - 40, False)
            t += rng.uniform(0.9, 1.1)
    elif kind == "email":  # few large chunks
        while t < duration:
            if rng.random() < 0.3:
                for _ in range(rng.randint(20, 120)):
                    emit(t, 500, 1400, 0.4)
                    t += rng.uniform(0.005, 0.03)
            else:
                t += rng.uniform(1.0, 4.0)
    elif kind == "file_transfer":  # sustained bulk down
        while t < duration:
            emit(t, 1300, 1400, 0.05)
            t += rng.uniform(0.0008, 0.002)
    elif kind == "flood":  # volumetric: 6000+ pps small packets (short window)
        while t < duration:
            emit(t, 64, 200, 0.5)
            t += 1 / rng.uniform(6000, 12000)
    elif kind == "exfil":  # huge asymmetric upload
        while t < duration:
            emit(t, 1200, 1400, 0.95)
            t += rng.uniform(0.0008, 0.003)
    elif kind == "beacon":  # rigid periodicity, near-zero jitter
        step = rng.uniform(0.5, 5.0)
        while t < duration:
            emit(t, 100, 200, True)
            emit(t + 0.01, 100, 200, False)
            t += step
    elif kind == "scan":  # regular tiny probes, one direction
        while t < duration:
            emit(t, 64, 100, True)
            t += rng.uniform(0.01, 0.02)
    else:
        raise ValueError(kind)
    return [(round(t_, 6), s, d) for t_, s, d in pkts if t_ <= duration]


def featurize(pkts) -> dict:
    n = len(pkts)
    if n == 0:
        return {k: 0 for k in (
            "packet_count", "total_bytes", "mean_size", "median_size",
            "std_size", "min_size", "max_size", "packets_per_second",
            "bytes_per_second", "mean_iat", "std_iat", "burstiness",
            "burst_count", "burst_duration", "upload_bytes",
            "download_bytes", "up_down_ratio", "flow_duration")}
    sizes = [s for _, s, _ in pkts]
    ups = [s for _, s, d in pkts if d]
    downs = [s for _, s, d in pkts if not d]
    up, down = sum(ups), sum(downs)
    total = up + down
    dur = (pkts[-1][0] - pkts[0][0]) if n > 1 else 0.0
    iats = [pkts[i + 1][0] - pkts[i][0] for i in range(n - 1)]
    mean_iat = statistics.fmean(iats) if iats else 0.0
    std_iat = statistics.pstdev(iats) if len(iats) > 1 else 0.0
    burstiness = (std_iat - mean_iat) / (std_iat + mean_iat) if (std_iat + mean_iat) > 0 else 0.0
    # bursts: gaps larger than 5x median IAT split the flow
    med = statistics.median(iats) if iats else 0.0
    thresh = 5 * med if med > 0 else float("inf")
    burst_count = 1 + sum(1 for g in iats if g > thresh) if n else 0
    in_burst = dur - sum(g for g in iats if g > thresh)
    return {
        "packet_count": n,
        "total_bytes": total,
        "mean_size": round(statistics.fmean(sizes), 2),
        "median_size": round(statistics.median(sizes), 2),
        "std_size": round(statistics.pstdev(sizes), 2) if n > 1 else 0.0,
        "min_size": min(sizes),
        "max_size": max(sizes),
        "packets_per_second": round(n / dur, 2) if dur > 0 else 0.0,
        "bytes_per_second": round(total / dur, 2) if dur > 0 else 0.0,
        "mean_iat": round(mean_iat, 6),
        "std_iat": round(std_iat, 6),
        "burstiness": round(burstiness, 4),
        "burst_count": burst_count,
        "burst_duration": round(max(in_burst, 0.0), 3),
        "upload_bytes": up,
        "download_bytes": down,
        "up_down_ratio": round(up / down, 4) if down else round(float(n), 4),
        "flow_duration": round(dur, 3),
    }


def gen_flow(rng: random.Random, kind: str, i: int, prefix: str) -> dict:
    for _ in range(10):  # retry on degenerate (empty) draws, e.g. all-idle email
        duration = rng.uniform(1.5, 4.0) if kind == "flood" else rng.uniform(5, 60)
        pkts = _packets(rng, kind, duration)
        if pkts:
            break
    row = featurize(pkts)
    row.update(
        {
            "traffic_type": kind if kind in NORMAL else "anomaly",
            "anomaly_type": "" if kind in NORMAL else kind,
            "label": "normal" if kind in NORMAL else "anomaly",
            "capture_id": f"{prefix}-{i:05d}",
        }
    )
    return row


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-normal", type=int, default=4200)
    ap.add_argument("--n-anomaly", type=int, default=800)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--out", default="data/output/flows.csv")
    ap.add_argument("--meta", default="data/output/metadata.csv")
    args = ap.parse_args()

    rng = random.Random(args.seed)
    rows = []
    for i in range(args.n_normal):
        rows.append(gen_flow(rng, NORMAL[i % len(NORMAL)], i, "SYN"))
    for j in range(args.n_anomaly):
        rows.append(gen_flow(rng, ANOMALY[j % len(ANOMALY)], j, "SYN-A"))

    with open(args.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    with open(args.meta, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["capture_id", "mode", "encryption", "integrity", "dh_group",
                    "pfs", "ip_version", "traffic_type", "anomaly_type", "label", "duration"])
        for r in rows:
            w.writerow([r["capture_id"], "tunnel", "AES-256-GCM", "AEAD", 19,
                        True, "IPv4", r["traffic_type"], r["anomaly_type"], r["label"], r["flow_duration"]])

    n_an = sum(1 for r in rows if r["label"] == "anomaly")
    print(f"wrote {len(rows)} flows ({n_an} anomaly) -> {args.out}, {args.meta}")


if __name__ == "__main__":
    main()
