from pydantic import BaseModel, Field
from typing import Optional, List

class IPsecCryptography(BaseModel):
    encryption_algorithm: Optional[str] = Field("UNKNOWN", description="e.g. AES-256-GCM, AES-128-CBC, 3DES")
    integrity_algorithm: Optional[str] = Field("UNKNOWN", description="e.g. HMAC-SHA256, AEAD")
    dh_group: Optional[int] = Field(None, description="Diffie-Hellman Group number (e.g. 14, 19, 2)")
    pfs_enabled: Optional[bool] = Field(False, description="Is Perfect Forward Secrecy enabled?")

class IPsecSAConfig(BaseModel):
    ike_version: Optional[str] = Field("UNKNOWN", description="e.g. IKEv1, IKEv2")
    mode: Optional[str] = Field("UNKNOWN", description="e.g. Tunnel, Transport")
    replay_protection: Optional[bool] = Field(True, description="Is Replay Protection enabled?")
    lifetime_seconds: Optional[int] = Field(None, description="SA lifetime in seconds")

class IPsecConfig(BaseModel):
    """
    This is the Common JSON Schema contract.
    The PCAP parser must output data matching this structure.
    """
    capture_name: str
    cryptography: IPsecCryptography
    sa_config: IPsecSAConfig

class SecurityFinding(BaseModel):
    severity: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"
    category: str  # "Cryptography", "Key Exchange", "Configuration"
    description: str

class SecurityAssessmentResult(BaseModel):
    total_score: int
    risk_level: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    findings: List[SecurityFinding]
