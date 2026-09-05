"""Train Isolation Forest on synthetic NORMAL flows. Phase 0 only."""

import argparse

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest

from features import FEATURES


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="synthetic_flows.csv from data/generate.py")
    ap.add_argument("--out", default="models/if_model.joblib")
    ap.add_argument("--contamination", type=float, default=0.05)
    args = ap.parse_args()

    df = pd.read_csv(args.input)
    missing = [c for c in FEATURES if c not in df.columns]
    if missing:
        raise SystemExit(f"missing feature columns: {missing}")

    X = df[FEATURES].fillna(0)
    model = IsolationForest(n_estimators=200, contamination=args.contamination, random_state=42)
    model.fit(X)
    joblib.dump({"model": model, "features": FEATURES}, args.out)
    print(f"trained on {len(X)} rows -> {args.out}")


if __name__ == "__main__":
    main()
