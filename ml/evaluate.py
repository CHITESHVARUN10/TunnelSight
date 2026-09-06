"""Evaluate a trained Isolation Forest on the held-out test split (roadmap S17).

Metrics: precision, recall, F1, false-positive rate, ROC-AUC + counts.
Anomaly = positive class. Train split must contain normals only.

Usage:
  python ml/evaluate.py --model ml/models/if_model.joblib \\
      --test data/output/test.csv --out ml/models/eval.json
"""

import argparse
import json

import joblib
import pandas as pd
from sklearn.metrics import (confusion_matrix, f1_score, precision_score,
                             recall_score, roc_auc_score)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--test", required=True)
    ap.add_argument("--out", default="ml/models/eval.json")
    args = ap.parse_args()

    bundle = joblib.load(args.model)
    model, features = bundle["model"], bundle["features"]
    df = pd.read_csv(args.test)
    X = df[features].fillna(0)
    y_true = (df["label"] == "anomaly").astype(int).to_numpy()

    pred = model.predict(X)  # 1 normal, -1 anomaly
    y_pred = (pred == -1).astype(int)
    scores = -model.decision_function(X)  # higher = more anomalous

    tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()
    out = {
        "n_test": int(len(df)),
        "n_anomaly": int(y_true.sum()),
        "true_positives": int(tp),
        "false_positives": int(fp),
        "true_negatives": int(tn),
        "false_negatives": int(fn),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "f1": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "false_positive_rate": round(float(fp / (fp + tn)) if (fp + tn) else 0.0, 4),
        "roc_auc": round(float(roc_auc_score(y_true, scores)) if y_true.sum() and (1 - y_true).sum() else 0.0, 4),
    }
    with open(args.out, "w") as f:
        json.dump(out, f, indent=2)
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
