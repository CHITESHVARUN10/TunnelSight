"""Generate SYNTHETIC training flows (no real VPN/testbed needed in Phase 0).

Produces flow-level feature CSV compatible with ml/features.py + a metadata CSV
using roadmap S7 label fields (capture_id, mode, encryption, dh_group, pfs,
ip_version, traffic_type, duration).

Traffic archetypes are statistical only: web (bursty), video (high throughput),
voip (small regular packets), icmp/email (control baselines).
"""

import argparse
import csv
import random

ARCHETYPES = ["web", "video", "voip", "icmp", "email"]


def gen_row(rng: random.Random, traffic: str, i: int) -> dict:
    if traffic == "voip":
        packet_count = rng.randint(200, 600)
        mean_size = rng.uniform(120, 280)
        pps = rng.uniform(20, 60)
        burstiness = rng.uniform(0.0, 0.3)
        bps = pps * mean_size * 8
    elif traffic == "video":
        packet_count = rng.randint(2000, 8000)
        mean_size = rng.uniform(900, 1400)
        pps = rng.uniform(300, 900)
        burstiness = rng.uniform(0.0, 0.3)
        bps = pps * mean_size * 8
    elif traffic == "web":
        packet_count = rng.randint(100, 800)
        mean_size = rng.uniform(500, 1100)
        pps = rng.uniform(10, 120)
        burstiness = rng.uniform(0.6, 1.0)
        bps = pps * mean_size * 8
    else:  # icmp / email baselines
        packet_count = rng.randint(20, 200)
        mean_size = rng.uniform(64, 600)
        pps = rng.uniform(1, 20)
        burstiness = rng.uniform(0.2, 0.7)
        bps = pps * mean_size * 8

    duration = packet_count / max(pps, 1e-6)
    total_bytes = int(packet_count * mean_size)
    up = int(total_bytes * rng.uniform(0.1, 0.5))
    down = total_bytes - up
    return {
        "packet_count": packet_count,
        "total_bytes": total_bytes,
        "mean_size": round(mean_size, 2),
        "median_size": round(mean_size * rng.uniform(0.9, 1.1), 2),
        "std_size": round(mean_size * rng.uniform(0.05, 0.3), 2),
        "min_size": int(mean_size * 0.5),
        "max_size": int(mean_size * 1.5),
        "packets_per_second": round(pps, 2),
        "bytes_per_second": round(bps, 2),
        "mean_iat": round(1 / max(pps, 1e-6), 5),
        "std_iat": round(rng.uniform(0.0005, 0.05), 5),
        "burstiness": round(burstiness, 3),
        "burst_count": rng.randint(1, 12),
        "burst_duration": round(duration * rng.uniform(0.2, 0.8), 3),
        "upload_bytes": up,
        "download_bytes": down,
        "up_down_ratio": round(up / max(down, 1), 4),
        "flow_duration": round(duration, 3),
        "traffic_type": traffic,
        "capture_id": f"SYN-{i:04d}",
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=500)
    ap.add_argument("--out", default="data/output/synthetic_flows.csv")
    ap.add_argument("--meta", default="data/output/metadata.csv")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    rng = random.Random(args.seed)
    rows = [gen_row(rng, ARCHETYPES[i % len(ARCHETYPES)], i) for i in range(args.n)]

    with open(args.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=[k for k in rows[0].keys()])
        w.writeheader()
        w.writerows(rows)

    with open(args.meta, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["capture_id", "mode", "encryption", "integrity", "dh_group", "pfs", "ip_version", "traffic_type", "duration"])
        for r in rows:
            w.writerow([r["capture_id"], "tunnel", "AES-256-GCM", "AEAD", 19, True, "IPv4", r["traffic_type"], r["flow_duration"]])

    print(f"wrote {len(rows)} rows -> {args.out}, {args.meta}")


if __name__ == "__main__":
    main()
