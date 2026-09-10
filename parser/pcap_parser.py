import os
from scapy.all import rdpcap, UDP
import scapy.contrib.ikev2 as ikev2

# --- Mapping Dictionaries for IKEv2 Transforms ---
# https://www.iana.org/assignments/ikev2-parameters/ikev2-parameters.xhtml

ENCRYPTION_MAP = {
    3: "3DES",
    12: "AES-CBC",
    18: "AES-CTR",
    19: "AES-CCM",
    20: "AES-GCM",
    28: "CHACHA20-POLY1305"
}

INTEGRITY_MAP = {
    1: "HMAC-MD5",
    2: "HMAC-SHA1",
    5: "HMAC-SHA2-256",
    12: "HMAC-SHA2-256", # Sometimes used interchangeably in older drafts
    13: "HMAC-SHA2-384",
    14: "HMAC-SHA2-512"
}

DH_GROUP_MAP = {
    1: "Group 1 (768-bit MODP)",
    2: "Group 2 (1024-bit MODP)",
    5: "Group 5 (1536-bit MODP)",
    14: "Group 14 (2048-bit MODP)",
    19: "Group 19 (256-bit ECP)",
    20: "Group 20 (384-bit ECP)",
    21: "Group 21 (521-bit ECP)",
    31: "Curve25519"
}

def parse_pcap_to_json(pcap_path: str) -> dict:
    """
    Parses a PCAP file containing IPsec traffic and extracts the IKEv2 
    Security Association (SA) parameters into the standardized JSON schema.
    """
    if not os.path.exists(pcap_path):
        raise FileNotFoundError(f"PCAP file not found: {pcap_path}")

    print(f"[->] Parsing PCAP: {pcap_path}")
    packets = rdpcap(pcap_path)

    # Initialize default structure matching backend/security_engine/schema.py
    ipsec_config = {
        "capture_name": os.path.basename(pcap_path),
        "cryptography": {
            "encryption_algorithm": "UNKNOWN",
            "integrity_algorithm": "UNKNOWN",
            "dh_group": None,
            "pfs_enabled": False
        },
        "sa_config": {
            "ike_version": "UNKNOWN",
            "mode": "Tunnel", # Defaulting to Tunnel
            "replay_protection": True,
            "lifetime_seconds": 3600
        }
    }

    ike_version = None
    enc_alg = "UNKNOWN"
    int_alg = "UNKNOWN"
    dh_group = None

    for pkt in packets:
        # Check if it's UDP and Port 500/4500 (IKE)
        if pkt.haslayer(UDP) and (pkt[UDP].sport in [500, 4500] or pkt[UDP].dport in [500, 4500]):
            
            # Ensure it is parsed as IKEv2 if possible
            if pkt.haslayer(ikev2.IKEv2):
                ike_layer = pkt[ikev2.IKEv2]
                ike_version = "IKEv2"
                ipsec_config["sa_config"]["ike_version"] = ike_version

                # Inspect Security Association Payload for Transforms
                if pkt.haslayer(ikev2.IKEv2_SA):
                    sa_payload = pkt[ikev2.IKEv2_SA]
                    
                    # Scapy IKEv2 dissection parses proposals and transforms
                    if hasattr(sa_payload, 'prop'):
                        # Iterate through proposals
                        current_prop = sa_payload.prop
                        while current_prop:
                            if hasattr(current_prop, 'trans'):
                                current_trans = current_prop.trans
                                while current_trans:
                                    t_type = current_trans.transform_type
                                    t_id = current_trans.transform_id
                                    
                                    # Transform Type 1: Encryption Algorithm (ENCR)
                                    if t_type == 1:
                                        enc_alg = ENCRYPTION_MAP.get(t_id, f"ENCR_TYPE_{t_id}")
                                        
                                    # Transform Type 3: Integrity Algorithm (INTEG)
                                    elif t_type == 3:
                                        int_alg = INTEGRITY_MAP.get(t_id, f"INTEG_TYPE_{t_id}")
                                        
                                    # Transform Type 4: Diffie-Hellman Group (D-H)
                                    elif t_type == 4:
                                        dh_group = t_id
                                        
                                    # Move to next transform
                                    if hasattr(current_trans, 'next_transform') and current_trans.next_transform:
                                         current_trans = current_trans.next_transform
                                    else:
                                        # Scapy uses payload chaining for some IKEv2 layers
                                        if hasattr(current_trans, 'payload') and isinstance(current_trans.payload, ikev2.IKEv2_Transform):
                                            current_trans = current_trans.payload
                                        else:
                                            break
                                            
                            if hasattr(current_prop, 'payload') and isinstance(current_prop.payload, ikev2.IKEv2_Proposal):
                                current_prop = current_prop.payload
                            else:
                                break

            # If we found parameters, no need to keep parsing every packet
            if enc_alg != "UNKNOWN":
                break

    # If AES-GCM is used (AEAD), integrity is built-in, so INTEG might be absent or NULL
    if "GCM" in enc_alg or "CCM" in enc_alg or "CHACHA20" in enc_alg:
        int_alg = "AEAD (Built-in)"

    # Populate Config
    ipsec_config["cryptography"]["encryption_algorithm"] = enc_alg
    ipsec_config["cryptography"]["integrity_algorithm"] = int_alg
    ipsec_config["cryptography"]["dh_group"] = dh_group
    
    # Simple heuristic: If DH group is present, PFS is likely enabled in Phase 2
    if dh_group is not None and dh_group > 0:
        ipsec_config["cryptography"]["pfs_enabled"] = True

    return ipsec_config
