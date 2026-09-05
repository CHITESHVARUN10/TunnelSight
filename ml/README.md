# ML — Isolation Forest only (Phase 0)

No RandomForest / classifier here per decision. This folder owns anomaly detection.

- `features.py` — canonical feature order (roadmap S13)
- `train.py` — fit `IsolationForest` on synthetic normal flows
- `infer.py` — output `NORMAL / ANOMALOUS + anomaly_score 0..1`
- `baseline.py` — interpretable heuristic from S14 for sanity checks
- `models/` — trained `if_model.joblib` goes here (gitignored)

Train/test split + metrics (precision/recall/FPR/ROC-AUC) come in later phases (roadmap S17).
