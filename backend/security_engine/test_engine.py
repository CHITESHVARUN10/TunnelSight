import json
from schema import IPsecConfig
from engine import SecurityRuleEngine

def test_engine():
    engine = SecurityRuleEngine()

    print("[->] Running Deterministic Security Rule Engine Tests...\n")

    # 1. Test a Strong/Modern Configuration
    strong_json = {
        "capture_name": "capture_001_modern.pcap",
        "cryptography": {
            "encryption_algorithm": "AES-256-GCM",
            "integrity_algorithm": "AEAD",
            "dh_group": 19,
            "pfs_enabled": True
        },
        "sa_config": {
            "ike_version": "IKEv2",
            "mode": "Tunnel",
            "replay_protection": True,
            "lifetime_seconds": 3600
        }
    }
    
    print("--- 1. Testing Strong Config (Expected: High Score) ---")
    # Pydantic parses and validates the dict
    strong_config = IPsecConfig(**strong_json) 
    result = engine.evaluate(strong_config)
    print(f"Score: {result.total_score}/100")
    print(f"Risk Level: {result.risk_level}")
    for f in result.findings:
        print(f"  - [{f.severity}] {f.description}")
    print()


    # 2. Test a Weak/Legacy Configuration
    weak_json = {
        "capture_name": "capture_002_legacy.pcap",
        "cryptography": {
            "encryption_algorithm": "3DES",
            "integrity_algorithm": "HMAC-MD5",
            "dh_group": 2,
            "pfs_enabled": False
        },
        "sa_config": {
            "ike_version": "IKEv1",
            "mode": "Transport",
            "replay_protection": False,
            "lifetime_seconds": 86400
        }
    }

    print("--- 2. Testing Weak Config (Expected: Low Score) ---")
    weak_config = IPsecConfig(**weak_json)
    result = engine.evaluate(weak_config)
    print(f"Score: {result.total_score}/100")
    print(f"Risk Level: {result.risk_level}")
    for f in result.findings:
        print(f"  - [{f.severity}] {f.description}")
    print()

if __name__ == "__main__":
    test_engine()
