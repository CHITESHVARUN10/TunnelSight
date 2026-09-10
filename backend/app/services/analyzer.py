import hashlib
import os
import random
import statistics
from collections import Counter
from datetime import datetime, timezone
from typing import Any, Dict, List

import joblib
import pandas as pd

from app.security_engine.engine import SecurityRuleEngine
from app.security_engine.schema import IPsecConfig

try:
    import sys

    _REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../"))
    if _REPO_ROOT not in sys.path:
        sys.path.insert(0, _REPO_ROOT)
    from parser.pcap_parser import extract_packets, parse_pcap_to_json

    _PARSER_AVAILABLE = True
except Exception:
    _PARSER_AVAILABLE = False

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

MOCK_NOTE = "mock-seeded evidence (capture could not be parsed); deterministic per filename"
PARSER_NOTE = "ipsec_config and window ML features derived from capture bytes via parser/pcap_parser.py"

# Windows are cut so short lab captures still yield more than one ML sample.
MIN_PACKETS_PER_WINDOW = 5
MAX_WINDOWS = 8

# Bounded raw-byte preview persisted for the config page's packet inspector.
PACKET_PREVIEW_MAX = 25


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

    def _mock_config(self, rng: random.Random, filename: str) -> Dict[str, Any]:
        return {
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

    def _real_config(self, pcap_path: str, filename: str) -> Dict[str, Any]:
        raw = parse_pcap_to_json(pcap_path)
        crypto = raw.get("cryptography", {}) or {}
        sa = raw.get("sa_config", {}) or {}
        dh = crypto.get("dh_group")
        return {
            "capture_name": filename,
            "cryptography": {
                "encryption_algorithm": str(crypto.get("encryption_algorithm") or "UNKNOWN"),
                "integrity_algorithm": str(crypto.get("integrity_algorithm") or "UNKNOWN"),
                "dh_group": dh if isinstance(dh, int) else None,
                "pfs_enabled": bool(crypto.get("pfs_enabled", False)),
            },
            "sa_config": {
                "ike_version": str(sa.get("ike_version") or "UNKNOWN"),
                "mode": str(sa.get("mode") or "UNKNOWN"),
                "replay_protection": bool(sa.get("replay_protection", True)),
                "lifetime_seconds": sa.get("lifetime_seconds") if isinstance(sa.get("lifetime_seconds"), int) else 3600,
            },
        }

    def _mock_capture(self, rng: random.Random, window_count: int) -> Dict[str, Any]:
        total_packets = rng.randint(500, 50000)
        return {
            "packet_count": total_packets,
            "total_bytes": total_packets * rng.randint(120, 1400),
            "flow_duration": float(window_count * 10),
            "file_bytes": None,
            "started_at": None,
            "packets_preview": [],
        }

    def parse_pcap_mock(self, filename: str) -> List[Dict[str, Any]]:
        rng = self._seeded_rng(filename)
        config = self._mock_config(rng, filename)
        return self._build_windows(rng, filename, config)

    def _build_windows(self, rng: random.Random, filename: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        _ = filename
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

    def _window_features(
        self, chunk: List[Dict[str, Any]], initiator: str | None, origin_ts: float
    ) -> Dict[str, Any]:
        sizes = [p["length"] for p in chunk]
        stamps = [p["ts"] for p in chunk]
        count = len(chunk)
        total_bytes = sum(sizes)
        duration = max(stamps[-1] - stamps[0], 1e-3)

        gaps = [b - a for a, b in zip(stamps, stamps[1:])]
        mean_iat = statistics.fmean(gaps) if gaps else 0.0
        std_iat = statistics.pstdev(gaps, mu=mean_iat) if len(gaps) > 1 else 0.0
        burstiness = std_iat / mean_iat if mean_iat > 0 else 0.0

        burst_gaps = [g for g in gaps if mean_iat > 0 and g > 2 * mean_iat]
        upload_bytes = float(sum(p["length"] for p in chunk if p["src"] == initiator))
        download_bytes = float(total_bytes - upload_bytes)
        ul_dl_ratio = upload_bytes / download_bytes if download_bytes > 0 else float(upload_bytes)

        return {
            "window_start": round(stamps[0] - origin_ts, 3),
            "window_end": round(stamps[-1] - origin_ts, 3),
            "packet_count": count,
            "features": {
                "mean_packet_size": statistics.fmean(sizes),
                "median_packet_size": float(statistics.median(sizes)),
                "std_packet_size": statistics.pstdev(sizes) if count > 1 else 0.0,
                "min_packet_size": float(min(sizes)),
                "max_packet_size": float(max(sizes)),
                "packets_per_second": count / duration,
                "bytes_per_second": total_bytes / duration,
                "mean_iat": mean_iat,
                "std_iat": std_iat,
                "burstiness": burstiness,
                "burst_count": float(len(burst_gaps)),
                "burst_duration": float(sum(burst_gaps)),
                "upload_bytes": upload_bytes,
                "download_bytes": download_bytes,
                "ul_dl_ratio": ul_dl_ratio,
                "flow_duration": duration,
                "total_packets": count,
                "total_bytes": total_bytes,
            },
        }

    def _windows_from_packets(self, packets: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        count = len(packets)
        n_windows = max(1, min(MAX_WINDOWS, count // MIN_PACKETS_PER_WINDOW))
        initiator = packets[0].get("src")
        origin_ts = packets[0]["ts"]

        windows = []
        for i in range(n_windows):
            start = round(i * count / n_windows)
            end = round((i + 1) * count / n_windows)
            chunk = packets[start:end]
            if not chunk:
                continue
            measured = self._window_features(chunk, initiator, origin_ts)
            measured["window_id"] = len(windows)
            windows.append(measured)
        return windows

    def _capture_stats(self, packets: List[Dict[str, Any]], pcap_path: str) -> Dict[str, Any]:
        stamps = [p["ts"] for p in packets]
        origin_ts = stamps[0] if stamps else 0.0
        try:
            file_bytes = os.path.getsize(pcap_path)
        except OSError:
            file_bytes = None

        preview = []
        for index, p in enumerate(packets[:PACKET_PREVIEW_MAX]):
            preview.append(
                {
                    "index": index,
                    "offset": round(p["ts"] - origin_ts, 6),
                    "length": p["length"],
                    "src": p.get("src"),
                    "dst": p.get("dst"),
                    "proto": p["proto"],
                    "hex": p.get("hex", ""),
                    "hex_truncated": p.get("hex_truncated", False),
                }
            )

        return {
            "packet_count": len(packets),
            "total_bytes": sum(p["length"] for p in packets),
            "flow_duration": round(max(stamps) - min(stamps), 6) if stamps else 0.0,
            "file_bytes": file_bytes,
            "started_at": datetime.fromtimestamp(min(stamps), tz=timezone.utc).isoformat() if stamps else None,
            "packets_preview": preview,
        }

    def analyze(self, filename: str, pcap_path: str | None = None) -> Dict[str, Any]:
        rng = self._seeded_rng(filename)
        config = None
        windows = None
        capture = None

        if pcap_path and _PARSER_AVAILABLE:
            try:
                config = self._real_config(pcap_path, filename)
                IPsecConfig(**config)
                packets = extract_packets(pcap_path)
                if not packets:
                    raise ValueError("capture contains no packets")
                windows = self._windows_from_packets(packets)
                capture = self._capture_stats(packets, pcap_path)
            except Exception:
                config = None
                windows = None
                capture = None

        if config is None or windows is None:
            config = self._mock_config(rng, filename)
            windows = self._build_windows(rng, filename, config)
            capture = self._mock_capture(rng, len(windows))
            note = MOCK_NOTE
            evidence_source = "mock"
        else:
            note = PARSER_NOTE
            evidence_source = "parser"

        rule_result = self.rule_engine.evaluate(IPsecConfig(**config))
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
            "ipsec_config": config,
            "windows": window_results,
            "capture": capture,
            "security_score": rule_result.total_score,
            "risk_level": rule_result.risk_level,
            "findings": findings,
            "traffic_label": str(top_label),
            "traffic_confidence": float(sum(winning_confs) / len(winning_confs)),
            "anomaly_score": float(min(scores)),
            "note": note,
            "evidence_source": evidence_source,
        }


analyzer = AnalyzerService()
