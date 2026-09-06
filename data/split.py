"""Deterministic stratified train/val/test split (70/15/15) by (label, traffic_type).

Usage:
  python data/split.py --input data/output/flows.csv --meta data/output/metadata.csv \\
      --seed 42 --outdir data/output
Writes train.csv / val.csv / test.csv + metadata_split.csv (adds split column).
"""

import argparse
import csv
import os
import random
from collections import defaultdict

TRAIN, VAL, TEST = 0.70, 0.15, 0.15


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default="data/output/flows.csv")
    ap.add_argument("--meta", default="data/output/metadata.csv")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--outdir", default="data/output")
    args = ap.parse_args()

    with open(args.input, newline="") as f:
        rows = list(csv.DictReader(f))
    with open(args.meta, newline="") as f:
        meta = {r["capture_id"]: r for r in csv.DictReader(f)}

    groups = defaultdict(list)
    for r in rows:
        groups[(r["label"], r["traffic_type"])].append(r)

    rng = random.Random(args.seed)
    splits = {"train": [], "val": [], "test": []}
    for key, rs in groups.items():
        rng.shuffle(rs)
        n = len(rs)
        n_train, n_val = int(n * TRAIN), int(n * VAL)
        splits["train"].extend(rs[:n_train])
        splits["val"].extend(rs[n_train:n_train + n_val])
        splits["test"].extend(rs[n_train + n_val:])

    for name, rs in splits.items():
        rng.shuffle(rs)
        with open(os.path.join(args.outdir, f"{name}.csv"), "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rs)

    with open(os.path.join(args.outdir, "metadata_split.csv"), "w", newline="") as f:
        fields = list(next(iter(meta.values())).keys()) + ["split"]
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for name, rs in splits.items():
            for r in rs:
                m = dict(meta[r["capture_id"]])
                m["split"] = name
                w.writerow(m)

    counts = {k: len(v) for k, v in splits.items()}
    n_an_test = sum(1 for r in splits["test"] if r["label"] == "anomaly")
    print(f"splits: {counts} (test anomalies: {n_an_test})")


if __name__ == "__main__":
    main()
