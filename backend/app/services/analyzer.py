import hashlib
import os
import random
from collections import Counter
from typing import Any, Dict, List

import joblib
import pandas as pd

from app.security_engine.engine import SecurityRuleEngine
from app.security_engine.schema import IPsecConfig

FEATURES = [
    "mean_packet_size",
    "median_packet_size",
    "std_packet_size",
    "min_packet_size",
    "max_packet_size",
    "packets_per_second",
    "bytes_per_second",
    "mean_iat",
    "std_iat",
    "burstiness",
    "burst_count",
    "burst_duration",
    "upload_bytes",
    "download_bytes",
    "ul_dl_ratio",
    "flow_duration",
    "total_packets",
    "total_bytes",
]

MOCK_NOTE = "mock-seeded evidence (not packet-derived); real parser implements the same ParsedWindow interface"


class AnalyzerService:
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        ml_dir = os.path.abspath(os.path.join(current_dir, "../../../ml"))

        clf_path = os.path.join(ml_dir, "traffic_classifier", "rf_model.pkl")
        clf_scaler_path = os.path.join(ml_dir, "traffic_classifier", "scaler.pkl")
        if_path = os.path.join(ml_dir, "anomaly_detector", "if_model.pkl")
        if_scaler_path = os.path.join(ml_dir, "anomaly_detector", "if_scaler.pkl")

        self.rf_model = joblib.load(clf_path) if os.path.exists(clf_path) else None
        self.rf_scaler = joblib.load(clf_scaler_path) if os.path.exists(clf_scaler_path) else None
        self.if_model = joblib.load(if_path) if os.path.exists(if_path) else None
        self.if_scaler = joblib.load(if_scaler_path) if os.path.exists(if_scaler_path) else None

        self.rule_engine = SecurityRuleEngine()

    def _seeded_rng(self, filename: str) -> random.Random:
        return random.Random(hashlib.sha256(filename.encode()).digest())

    def parse_pcap_mock(self, filename: str) -> List[Dict[str, Any]]:
        rng = self._seeded_rng(filename)
        config = {
            "capture_name": filename,
            "cryptography": {
                "encryption_algorithm": rng.choice(["AES-256-GCM", "AES-128-CBC", "3DES"]),
                "integrity_algorithm": rng.choice(["AEAD", "HMAC-SHA256"]),
                "dh_group": rng.choice([19, 14, 2]),
                "pfs_enabled": rng.choice([True, False]),
            },
            "sa_config": {
                "ike_version": rng.choice(["IKEv2", "IKEv1"]),
                "mode": rng.choice(["Tunnel", "Transport"]),
                "replay_protection": rng.choice([True, False]),
                "lifetime_seconds": 3600,
            },
        }
        n_windows = rng.randint(3, 8)
        windows = []
        for i in range(n_windows):
            mean_size = rng.uniform(50, 1500)
            total_packets = rng.randint(100, 50000)
            duration = 10.0
            windows.append(
                {
                    "window_id": i,
                    "window_start": float(i * 10),
                    "window_end": float((i + 1) * 10),
                    "packet_count": total_packets,
                    "ipsec_config": config,
                    "features": {
                        "mean_packet_size": mean_size,
                        "median_packet_size": mean_size * rng.uniform(0.9, 1.1),
                        "std_packet_size": rng.uniform(0, 500),
                        "min_packet_size": rng.uniform(40, 100),
                        "max_packet_size": rng.uniform(100, 1500),
                        "packets_per_second": total_packets / duration,
                        "bytes_per_second": rng.uniform(1000, 1000000),
                        "mean_iat": rng.uniform(0.001, 1.0),
                        "std_iat": rng.uniform(0, 0.5),
                        "burstiness": rng.uniform(0, 1.0),
                        "burst_count": rng.randint(0, 20),
                        "burst_duration": rng.uniform(0, 5.0),
                        "upload_bytes": rng.uniform(1000, 500000),
                        "download_bytes": rng.uniform(1000, 500000),
                        "ul_dl_ratio": rng.uniform(0.1, 10.0),
                        "flow_duration": duration,
                        "total_packets": total_packets,
                        "total_bytes": rng.randint(10000, 10000000),
                    },
                }
            )
        return windows

    def analyze(self, filename: str) -> Dict[str, Any]:
        windows = self.parse_pcap_mock(filename)
        config = IPsecConfig(**windows[0]["ipsec_config"])
        rule_result = self.rule_engine.evaluate(config)
        findings = [
            {"severity": f.severity, "category": f.category, "description": f.description}
            for f in rule_result.findings
        ]

        if self.rf_model is None or self.if_model is None:
            raise RuntimeError("ML models not loaded")

        df = pd.DataFrame([w["features"] for w in windows], columns=FEATURES)
        labels = list(self.rf_model.predict(self.rf_scaler.transform(df)))
        confidences = list(self.rf_model.predict_proba(self.rf_scaler.transform(df)).max(axis=1))
        scores = list(self.if_model.decision_function(self.if_scaler.transform(df)))
        preds = list(self.if_model.predict(self.if_scaler.transform(df)))

        window_results = []
        for w, label, conf, score, pred in zip(windows, labels, confidences, scores, preds):
            window_results.append(
                {
                    "window_id": w["window_id"],
                    "window_start": w["window_start"],
                    "window_end": w["window_end"],
                    "packet_count": w["packet_count"],
                    "traffic_label": str(label),
                    "traffic_confidence": float(conf),
                    "anomaly_score": float(score),
                    "is_anomaly": bool(pred == -1),
                }
            )

        top_label = Counter(labels).most_common(1)[0][0]
        winning_confs = [c for l, c in zip(labels, confidences) if l == top_label]

        return {
            "ipsec_config": windows[0]["ipsec_config"],
            "windows": window_results,
            "security_score": rule_result.total_score,
            "risk_level": rule_result.risk_level,
            "findings": findings,
            "traffic_label": str(top_label),
            "traffic_confidence": float(sum(winning_confs) / len(winning_confs)),
            "anomaly_score": float(min(scores)),
        }


analyzer = AnalyzerService()
