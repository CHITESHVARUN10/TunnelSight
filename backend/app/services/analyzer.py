import os
import joblib
import pandas as pd
import random
from typing import Dict, Any

from security_engine.engine import SecurityRuleEngine
from security_engine.schema import IPsecConfig

class AnalyzerService:
    def __init__(self):
        # Resolve paths to the ML models relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        ml_dir = os.path.abspath(os.path.join(current_dir, "../../../ml"))
        
        # Load Traffic Classifier (Random Forest)
        clf_path = os.path.join(ml_dir, "traffic_classifier", "rf_model.pkl")
        clf_scaler_path = os.path.join(ml_dir, "traffic_classifier", "scaler.pkl")
        
        # Load Anomaly Detector (Isolation Forest)
        if_path = os.path.join(ml_dir, "anomaly_detector", "if_model.pkl")
        if_scaler_path = os.path.join(ml_dir, "anomaly_detector", "if_scaler.pkl")

        # Load into memory
        self.rf_model = joblib.load(clf_path) if os.path.exists(clf_path) else None
        self.rf_scaler = joblib.load(clf_scaler_path) if os.path.exists(clf_scaler_path) else None
        self.if_model = joblib.load(if_path) if os.path.exists(if_path) else None
        self.if_scaler = joblib.load(if_scaler_path) if os.path.exists(if_scaler_path) else None
        
        # Load Rule Engine
        self.rule_engine = SecurityRuleEngine()

    def parse_pcap_mock(self, filename: str) -> Dict[str, Any]:
        """
        Mock PCAP parser for Phase 1. 
        In Phase 2, this will call Zeek/Spicy to extract real data.
        """
        # 1. Generate fake IPsec config for the rule engine
        config_json = {
            "capture_name": filename,
            "cryptography": {
                "encryption_algorithm": random.choice(["AES-256-GCM", "AES-128-CBC", "3DES"]),
                "integrity_algorithm": random.choice(["AEAD", "HMAC-SHA256"]),
                "dh_group": random.choice([19, 14, 2]),
                "pfs_enabled": random.choice([True, False])
            },
            "sa_config": {
                "ike_version": random.choice(["IKEv2", "IKEv1"]),
                "mode": random.choice(["Tunnel", "Transport"]),
                "replay_protection": random.choice([True, False]),
                "lifetime_seconds": 3600
            }
        }
        
        # 2. Generate fake ML features (matching the 18 columns)
        ml_features = {
            "mean_packet_size": random.uniform(50, 1500),
            "median_packet_size": random.uniform(50, 1500),
            "std_packet_size": random.uniform(0, 500),
            "min_packet_size": random.uniform(40, 100),
            "max_packet_size": random.uniform(100, 1500),
            "packets_per_second": random.uniform(10, 5000),
            "bytes_per_second": random.uniform(1000, 1000000),
            "mean_iat": random.uniform(0.001, 1.0),
            "std_iat": random.uniform(0, 0.5),
            "burstiness": random.uniform(0, 1.0),
            "burst_count": random.randint(0, 20),
            "burst_duration": random.uniform(0, 5.0),
            "upload_bytes": random.uniform(1000, 500000),
            "download_bytes": random.uniform(1000, 500000),
            "ul_dl_ratio": random.uniform(0.1, 10.0),
            "flow_duration": 10.0,
            "total_packets": random.randint(100, 50000),
            "total_bytes": random.randint(10000, 10000000)
        }
        
        return {"config": config_json, "features": ml_features}

    def analyze(self, filename: str) -> Dict[str, Any]:
        """
        Runs the full analysis pipeline: Parser -> Rule Engine & ML Models
        """
        # 1. Parse PCAP (Mock)
        parsed_data = self.parse_pcap_mock(filename)
        ipsec_config_dict = parsed_data["config"]
        ml_features_dict = parsed_data["features"]
        
        # 2. Run Deterministic Security Rule Engine
        ipsec_config = IPsecConfig(**ipsec_config_dict)
        rule_result = self.rule_engine.evaluate(ipsec_config)
        
        # Format rule findings into serializable dicts
        findings = [{"severity": f.severity, "category": f.category, "description": f.description} for f in rule_result.findings]
        
        # 3. Run ML Traffic Classifier & Anomaly Detector
        traffic_prediction = "Unknown"
        anomaly_score = 0.0
        
        if self.rf_model and self.if_model:
            df_features = pd.DataFrame([ml_features_dict])
            
            # Classifier
            X_rf_scaled = self.rf_scaler.transform(df_features)
            traffic_prediction = self.rf_model.predict(X_rf_scaled)[0]
            
            # Anomaly Detector
            X_if_scaled = self.if_scaler.transform(df_features)
            anomaly_score = float(self.if_model.decision_function(X_if_scaled)[0])
            
        # 4. Bundle all results for the database / frontend
        # We store everything inside the `config_json` column for the frontend to consume
        final_result = {
            "ipsec_config": ipsec_config_dict,
            "security_score": rule_result.total_score,
            "risk_level": rule_result.risk_level,
            "security_findings": findings,
            "traffic_prediction": traffic_prediction,
            "anomaly_score": anomaly_score, # We also extract this to return it separately for the dedicated DB column
        }
        
        return final_result

# Instantiate a global instance so models are only loaded once when FastAPI starts
analyzer = AnalyzerService()
