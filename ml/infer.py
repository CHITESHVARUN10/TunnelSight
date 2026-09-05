"""Inference: anomaly score per flow. Score near 1 = anomalous, near 0 = normal."""

import argparse

import joblib
import pandas as pd


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--input", required=True, help="CSV with FEATURES columns")
    args = ap.parse_args()

    bundle = joblib.load(args.model)
    model, features = bundle["model"], bundle["features"]
    df = pd.read_csv(args.input)
    X = df[features].fillna(0)

    # IsolationForest decision_function: higher = more normal. Invert to 0..1 anomaly score.
    normal_score = model.decision_function(X)
    pred = model.predict(X)  # 1 normal, -1 anomaly
    # min-max normalize inverted score for readability
    inv = -normal_score
    lo, hi = inv.min(), inv.max()
    anomaly = (inv - lo) / (hi - lo) if hi > lo else 0.5

    for i, (p, s) in enumerate(zip(pred, anomaly)):
        label = "ANOMALOUS" if p == -1 else "NORMAL"
        print(f"row {i}: {label} anomaly_score={float(s):.3f}")


if __name__ == "__main__":
    main()
