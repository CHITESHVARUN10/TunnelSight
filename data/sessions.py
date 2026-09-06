"""Mixed-traffic sessions for transition testing (roadmap S12).

Builds continuous multi-activity captures, e.g. Web(10s) -> Video(15s) ->
Web(10s) -> VoIP(10s), then windows them into fixed 5s flows labeled by
majority traffic. Proves the system detects transitions instead of forcing
one label per capture.

Usage:
  python data/sessions.py --n 20 --seed 7 --out data/output/sessions.csv
"""

import argparse
import csv
import random
from collections import Counter

from simulate import _packets, featurize

PLAN = [("web", 10), ("video", 15), ("web", 10), ("voip", 10)]
WINDOW = 5.0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=20)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--out", default="data/output/sessions.csv")
    args = ap.parse_args()

    rng = random.Random(args.seed)
    rows = []
    for s in range(args.n):
        # stitch archetype segments with per-packet provenance
        segs = []
        t = 0.0
        for kind, dur in PLAN:
            pkts = [(t + pt, sz, d) for pt, sz, d in _packets(rng, kind, dur)]
            segs.append((kind, pkts))
            t += dur
        total = t
        w = 0
        start = 0.0
        while start < total:
            end = start + WINDOW
            win = [(pt, sz, d, kind) for kind, pkts in segs for pt, sz, d in pkts if start <= pt < end]
            if win:
                maj = Counter(k for _, _, _, k in win).most_common(1)[0][0]
                f = featurize([(pt, sz, d) for pt, sz, d, _ in win])
                f.update({
                    "traffic_type": maj,
                    "anomaly_type": "",
                    "label": "normal",
                    "capture_id": f"SES-{s:03d}-W{w:02d}",
                    "session_id": f"SES-{s:03d}",
                    "window_start": round(start, 2),
                })
                rows.append(f)
                w += 1
            start = end

    with open(args.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {len(rows)} windows from {args.n} sessions -> {args.out}")


if __name__ == "__main__":
    main()
