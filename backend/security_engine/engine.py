from .schema import IPsecConfig, SecurityFinding, SecurityAssessmentResult

class SecurityRuleEngine:
    def __init__(self):
        # Maximum possible score is 100
        pass

    def evaluate(self, config: IPsecConfig) -> SecurityAssessmentResult:
        score = 100
        findings = []

        # --- 1. Encryption (Max Penalty: 25) ---
        enc = config.cryptography.encryption_algorithm.upper()
        if "GCM" in enc:
            # Modern, strong, provides its own integrity
            pass 
        elif "AES" in enc:
            # Acceptable, but CBC might have weaknesses if not padded right
            if "CBC" in enc:
                findings.append(SecurityFinding(severity="MEDIUM", category="Cryptography", description=f"AES-CBC is acceptable but older. Prefer AES-GCM."))
                score -= 5
            else:
                pass
        elif enc in ["3DES", "DES", "UNKNOWN"]:
            findings.append(SecurityFinding(severity="CRITICAL", category="Cryptography", description=f"Weak or unknown encryption: {enc}"))
            score -= 25

        # --- 2. Key Exchange / DH Group (Max Penalty: 20) ---
        dh = config.cryptography.dh_group
        if dh is None:
            findings.append(SecurityFinding(severity="HIGH", category="Key Exchange", description="DH Group unknown or not provided."))
            score -= 20
        elif dh < 14:
            findings.append(SecurityFinding(severity="CRITICAL", category="Key Exchange", description=f"Extremely weak DH Group ({dh}). Use Group 14 or higher."))
            score -= 20
        elif dh == 14:
            findings.append(SecurityFinding(severity="MEDIUM", category="Key Exchange", description="DH Group 14 (2048-bit) is the absolute minimum. Consider upgrading."))
            score -= 5

        # --- 3. Perfect Forward Secrecy (PFS) (Max Penalty: 15) ---
        if not config.cryptography.pfs_enabled:
            findings.append(SecurityFinding(severity="HIGH", category="Key Exchange", description="Perfect Forward Secrecy (PFS) is DISABLED. Past traffic can be decrypted if long-term keys are compromised."))
            score -= 15

        # --- 4. Replay Protection (Max Penalty: 10) ---
        if not config.sa_config.replay_protection:
            findings.append(SecurityFinding(severity="CRITICAL", category="Configuration", description="Replay Protection is DISABLED. Vulnerable to replay attacks."))
            score -= 10

        # --- 5. IKE Version (Max Penalty: 5) ---
        ike = config.sa_config.ike_version.upper()
        if "IKEV1" in ike:
            findings.append(SecurityFinding(severity="HIGH", category="Configuration", description="IKEv1 is obsolete and has known vulnerabilities. Upgrade to IKEv2."))
            score -= 5

        # Calculate Risk Level
        if score >= 90:
            risk = "LOW"
        elif score >= 70:
            risk = "MEDIUM"
        elif score >= 50:
            risk = "HIGH"
        else:
            risk = "CRITICAL"

        return SecurityAssessmentResult(
            total_score=score,
            risk_level=risk,
            findings=findings
        )
