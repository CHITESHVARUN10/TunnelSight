# SIH26160 — AI-Powered IPsec VPN Protocol Analyzer and Security Assessment Framework
## Final Consolidated Project Roadmap

---

## 0. Official Problem Statement

**Background**

Virtual Private Networks (VPNs) are fundamental to secure communication over untrusted networks. Among available VPN technologies, IPsec is widely adopted across enterprise, government, military, and cloud infrastructures because of its ability to provide confidentiality, integrity, and authentication.

However, the security of an IPsec deployment depends on multiple factors — chosen cryptographic algorithms, authentication mechanisms, key exchange protocols, and operational mode (Tunnel or Transport). Misconfigurations, outdated cipher suites, improper key management, or protocol implementation flaws can significantly weaken the overall security posture.

Traditional protocol analysis tools provide packet-level visibility but often require expert interpretation. There is a growing need for intelligent systems capable of automatically analyzing IPsec deployments, identifying protocol characteristics, assessing security risks, and generating actionable recommendations.

**Description**

Design and develop an AI-driven protocol analysis platform capable of automatically analysing IPsec VPN deployments established under different security configurations. The platform should inspect captured traffic or live network streams, identify protocol characteristics, infer VPN operating modes, evaluate cryptographic configurations, and generate an automated security assessment report — assisting analysts in understanding the security posture of IPsec deployments without requiring manual packet inspection.

**Required Capabilities**

**a) VPN Testbed Generation** — a laboratory environment capable of establishing IPsec VPNs across multiple configurations: Tunnel Mode, Transport Mode, AES-128, AES-256, AES-GCM, AES-CBC+HMAC, different DH groups, PFS enabled/disabled, IPv4 and IPv6, and varied traffic types (VoIP, WhatsApp-like, email, web browsing, ICMP, video streaming, etc.).

**b) Traffic Capture** — network traces acquired via Wireshark, tcpdump, or custom capture utilities, covering IKE negotiation, ESP packets, AH packets (optional), and normal communication.

**c) AI-Based Protocol Identification** — an engine that automatically identifies the IPsec protocol, IKE version, Tunnel/Transport mode, encryption algorithm, authentication algorithm, key exchange method, Security Association characteristics, and predicts the traffic type inside ESP.

**d) Security Assessment** — automatic evaluation of cryptographic strength, configuration compliance, SA parameters, key lifetime, replay protection, forward-secrecy configuration, cipher-suite strength, and metadata exposure.

**e) Output** — a comprehensive security score, traffic analysis, and metadata inference, with automatically generated Executive and Technical Reports, a Risk Score, a Threat Matrix, and an AI Confidence Score.

**Expected Deliverables**
- Working software prototype
- AI classification engine
- Interactive dashboard
- Security assessment report
- Demonstration video
- Technical documentation
- Dataset used for training/testing

---

## 1. Project Goal & Mental Model

Build a cybersecurity platform that automatically analyzes an IPsec VPN deployment from captured (and eventually live) network traffic, and answers four questions:

1. What IPsec configuration is being used?
2. How secure is that configuration?
3. What kind of traffic appears to be flowing through the encrypted VPN?
4. What should the security analyst do about the findings?

The system combines conventional protocol analysis, deterministic security rules, machine learning, and AI-generated explanations — it is **not** primarily an IPsec-implementation project. Existing technologies (strongSwan, Zeek/Spicy, tcpdump, tshark, Scapy, ike-scan) should be used as foundations wherever possible.

**Core concepts**

- **IPsec** — framework for securing IP traffic
- **IKE** — negotiates security parameters and establishes security relationships
- **Security Association (SA)** — the negotiated security context/rules for protecting traffic
- **ESP** — protects the actual IP traffic
- **ML** — classifies traffic patterns and detects anomalies
- **LLM/AI** — explains findings and generates human-readable reports

**High-level pipeline**

```text
VPN Testbed
    ↓
Traffic Generation
    ↓
PCAP / Live Capture
    ↓
Packet Parsing (Zeek / Spicy / tshark / Scapy)
    ↓
Configuration Analysis  +  Flow / Feature Analysis
    ↓
Deterministic Security Assessment      ML Traffic Classification & Anomaly Detection
    ↓                                          ↓
Risk Score / Confidence   ←───────────────────┘
    ↓
AI Explanation Layer
    ↓
Dashboard  +  Reports (Executive & Technical)
```

**Guiding principle:** Protocol parser → facts. Security engine → authoritative findings/score. ML → predictions/anomaly signals. LLM → explanation and communication. The analyzer should never invent an answer when evidence is missing — every output is labeled **CONFIRMED**, **INFERRED**, or **UNKNOWN** (see §13).

---

## 2. Final System Architecture

```text
                         ┌────────────────────┐
                         │   IPsec Testbed    │
                         │    strongSwan      │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ Traffic Generator  │
                         │ VoIP / Video / Web │
                         │ Email / ICMP / etc │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ PCAP / Live Capture│
                         │ tcpdump / tshark   │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ IPsec Protocol     │
                         │ Analyzer           │
                         │ Zeek + Spicy       │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ IPsec Normalizer   │
                         │ Common JSON Schema │
                         └─────────┬──────────┘
                                   │
                  ┌────────────────┼─────────────────┐
                  │                │                 │
                  ▼                ▼                 ▼
          Protocol Engine   Security Engine      ML Engine
                  │                │                 │
                  │                ▼                 ├── Traffic Classification
                  │           Risk Score             └── Anomaly Detection
                  │           Findings
                  │
                  └────────────────┬────────────────┐
                                   │                │
                                   ▼                ▼
                            AI Explanation     Traffic Insights
                                   │                │
                                   └───────┬────────┘
                                           ▼
                                  ┌──────────────────┐
                                  │ Report Generator │
                                  └────────┬─────────┘
                                           │
                               ┌───────────┴───────────┐
                               ▼                       ▼
                         Technical Report       Executive Report

                                           +

                                  Interactive Dashboard
```

A clean service-oriented backend view of the same architecture:

```text
                         FastAPI
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   Protocol Service   Security Service    ML Service
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                     Analysis Store
                            │
                            ▼
                       AI Service
                            │
                            ▼
                     Report Service
```

---

## 3. Phase 0 — Learn the Fundamentals (No Coding Yet)

Before building anything, the team should be comfortable with:

**Networking fundamentals** — IP packets, TCP vs UDP, ports, routing, NAT, packet headers, network interfaces, flows/connections.

**VPN fundamentals** — what a VPN is, client vs. server/gateway, remote-access vs. site-to-site VPNs, tunnels, confidentiality/authentication/integrity.

**IPsec**
```text
IPsec
├── IKE
├── ESP
├── AH
├── Security Associations
├── Tunnel Mode
└── Transport Mode
```

**Cryptography (only what's relevant)** — symmetric encryption, AES-CBC, AES-GCM, HMAC/hashing, asymmetric crypto, Diffie-Hellman, Perfect Forward Secrecy.

**Packet-level understanding**
```text
Ethernet → IP → UDP 500 → IKE          IP → ESP → Encrypted data
```

**Deliverable:** the team can explain how an IPsec connection is established, how keys are negotiated, how packets are protected, and what remains observable to an analyzer.

---

## 4. IPsec Testbed

**Purpose:** create controlled IPsec VPN environments with known configurations so the system has ground-truth captures for testing, validation, and ML training. Use **strongSwan** rather than implementing IPsec from scratch, on two Linux machines/VMs (containers or network namespaces for more advanced setups):

```text
┌─────────────────┐          ┌─────────────────┐
│ Linux Machine A │  IPsec   │ Linux Machine B │
│ VPN Client      │◄────────►│ VPN Gateway     │
└─────────────────┘          └─────────────────┘
```

### Reference Configurations

| ID | IKE | Mode | Cipher | Integrity | DH Group | PFS | IP Version |
|---|---|---|---|---|---|---|---|
| A — Modern/strong | IKEv2 | Tunnel | AES-256-GCM | AEAD | Strong/ECDH | Yes | IPv4 |
| B — Older but usable | IKEv2 | Tunnel | AES-128-CBC | HMAC-SHA256 | Group 14 | Yes | IPv4 |
| C — IPv6 | IKEv2 | Tunnel or Transport | AES-256-GCM | AEAD | Strong/ECDH | Yes | IPv6 |
| D — Deliberately weak | IKEv1 | — | AES-128-CBC | Legacy hash/auth | Weak group | No | — |

Expand into a fuller matrix as time allows, e.g.:

| ID | Mode | Cipher | Integrity | DH | PFS |
|---|---|---|---|---|---|
| C01 | Tunnel | AES-128-CBC | HMAC | Group 14 | No |
| C02 | Tunnel | AES-256-CBC | HMAC | Group 14 | Yes |
| C03 | Tunnel | AES-256-GCM | AEAD | Group 14 | Yes |
| C04 | Transport | AES-128-CBC | HMAC | Group 14 | No |
| C05 | Transport | AES-256-GCM | AEAD | Group 14 | Yes |

**Goal:** ~10–20 controlled configurations/captures for the prototype, each with fully known ground truth (verify with ping, TCP traffic, HTTP/HTTPS-like traffic, and sustained traffic).

---

## 5. Traffic Generation

Generate representative traffic through each VPN configuration — exact recreation of commercial apps is not required, only measurable, representative patterns:

- **ICMP** — ping or similar controlled traffic
- **Web** — controlled HTTP/HTTPS browsing or scripted requests
- **Video** — controlled streaming/download workloads representative of video traffic
- **VoIP** — controlled UDP traffic with VoIP-like characteristics
- **Email** — controlled email-like workloads
- **Messaging / file transfer** — additional representative categories

Naming convention example: `C03_web_001.pcap`, `C03_video_001.pcap`.

---

## 6. Packet Capture Layer

**Tools:** tcpdump, tshark, Wireshark (validation/visual inspection).

```text
IPsec Test Configuration → Generate Traffic → Capture Packets → PCAP
```

Capture IKE negotiation, ESP traffic, relevant IP traffic, timestamps, packet sizes, direction, and other useful metadata. **PCAP is the primary input to the analyzer** — live capture is added later, once the PCAP pipeline is stable.

---

## 7. Dataset Generation & Documentation

For every capture, store the raw PCAP **and** a metadata/label file describing the configuration and traffic:

```text
capture_001.pcap
capture_001.json
```

```json
{
  "capture_id": "001",
  "ike_version": "IKEv2",
  "ipsec_protocol": "ESP",
  "mode": "tunnel",
  "cipher": "AES-256-GCM",
  "dh_group": 19,
  "pfs": true,
  "replay_protection": true,
  "ip_version": "IPv4",
  "traffic_type": "video"
}
```

**Suggested dataset folder structure:**

```text
dataset/
├── tunnel/
│   ├── aes128/
│   │   ├── web/
│   │   ├── video/
│   │   └── voip/
│   └── aes256/
│       ├── web/
│       ├── video/
│       └── voip/
└── transport/
    ├── aes128/
    └── aes256/
```

Maintain a CSV/database of metadata (`capture_id, mode, encryption, integrity, dh_group, pfs, ip_version, traffic_type, duration`), e.g.:

```text
C001,Tunnel,AES-256-GCM,AEAD,14,true,IPv4,Video
C002,Tunnel,AES-256-GCM,AEAD,14,true,IPv4,Web
C003,Transport,AES-128-CBC,HMAC,14,false,IPv4,VoIP
```

**Dataset documentation should record:** number of captures/packets, VPN configurations covered, traffic types, IPv4/IPv6 split, train/test split, collection methodology, label definitions, feature definitions, and exactly how each label/ground truth was established.

---

## 8. IPsec Protocol Analysis Layer (Packet Parser)

**Recommended tools:** Zeek + Spicy IPsec analyzer, tshark, Scapy for custom packet-level processing, ike-scan for IKE fingerprinting/transform information where useful.

```text
PCAP
 ↓
Zeek / Spicy / tshark
 ↓
Raw analysis logs
 ↓
Custom normalizer
 ↓
Common IPsec JSON schema
```

Do **not** make the rest of the application depend directly on a tool-specific output format — always go through the normalizer. Extract:

- General packet info: timestamp, source, destination, protocol, size
- IKE info: version, message type, proposals, transforms, DH info, SA info
- ESP info: SPI, sequence number, packet length, timestamp, direction

Use established libraries/tools rather than hand-rolling packet parsing wherever possible.

---

## 9. Common IPsec Data Schema

A normalized representation used by every downstream component — the central contract between protocol parsing, security assessment, and ML:

```json
{
  "session": { "src": "10.0.0.1", "dst": "10.0.0.2" },
  "protocol": {
    "ipsec": true,
    "ike_version": "IKEv2",
    "esp": true,
    "ah": false,
    "mode": "tunnel"
  },
  "cryptography": {
    "encryption": "AES-256-GCM",
    "integrity": "AEAD",
    "dh_group": 19,
    "pfs": true
  },
  "security_association": {
    "spi": "0x12345678",
    "lifetime": 3600,
    "replay_protection": true
  },
  "network": { "ip_version": "IPv4", "nat_t": true }
}
```

---

## 10. Protocol Detection Engine

Automatically identify: presence of IPsec, ESP/AH usage, IKE version, tunnel vs. transport mode, IPv4/IPv6, NAT-T, IKE exchange characteristics, transform/proposal info, SA info, and SPI values where observable.

```text
IPsec:              YES
IKE Version:        IKEv2
ESP:                YES
AH:                 NO
Mode:               Tunnel
IP Version:         IPv4
NAT-T:              YES
```

---

## 11. Deterministic Analysis & the Confirmed / Inferred / Unknown Framework

This is the first real analysis engine, and it must never invent an answer when evidence is missing. Every claim the system makes falls into one of three buckets:

- **CONFIRMED** — directly supported by packet evidence (e.g. `ESP detected: YES`)
- **INFERRED** — estimated from available evidence (e.g. `Traffic appears to be video-like`)
- **UNKNOWN** — cannot be established from the supplied capture (e.g. `Encryption algorithm: UNKNOWN — Reason: No sufficient negotiation/configuration information is available`)

Example output:

```text
IPsec detected: YES
IKE version: IKEv2
ESP detected: YES

Encryption: AES-256-GCM
Integrity: AEAD
DH: Group 14
PFS: Enabled
Mode: Tunnel
```

---

## 12. Flow & Window Segmentation (Handling Mixed Traffic)

A user may perform Web → Video → Web → VoIP within the same VPN connection, so the system must **not** classify an entire long PCAP as a single traffic type. Traffic must be analyzed as flows, sessions, or time windows:

```text
PCAP → Flow/Window Identification → Flow 1, Flow 2, Flow 3, ...
```

or

```text
0–10 sec → Window 1
10–20 sec → Window 2
20–30 sec → Window 3
```

This lets the system detect traffic transitions instead of forcing one label onto an entire session — and is a strong demonstration point (see §22, Phase 14 testing).

---

## 13. Feature Extraction

Convert observable encrypted-traffic characteristics into numerical features (no payload decryption required):

```text
Packet stats:     packet_count, total_bytes, mean/median/std packet size, min/max packet size
Rate features:    packets_per_second, bytes_per_second
Timing features:  mean/std inter-arrival time, burstiness, burst_count, burst_duration
Directional:      upload_bytes, download_bytes, upload/download ratio
Flow features:     flow_duration
```

```text
ESP packets → Flow/session grouping → Feature extraction → Feature vector → ML classifier → Predicted traffic type + confidence
```

---

## 14. Baseline Classifier

Before training a full ML model, build a simple interpretable baseline to sanity-check the features and to give the real model something to beat:

```text
Small + regular packets           → potentially VoIP
High sustained throughput         → potentially video
Bursty traffic + idle periods     → potentially web
```

If the ML model can't beat this baseline, investigate the features and dataset before adding complexity.

---

## 15. ML Model 1 — Encrypted Traffic Classification

**Objective:** predict the likely traffic type flowing inside encrypted ESP traffic, without decrypting payload.

**Initial algorithms (start simple, don't jump to deep learning):**
- Random Forest — a strong first candidate: works well with tabular features, models nonlinearity, relatively interpretable, doesn't need huge datasets
- XGBoost
- SVM
- (Neural network only if the dataset/results justify it)

**Example output (always present as probabilistic, never as certain identification):**

```text
Video       83%
Web         10%
VoIP         4%
Other        3%
```

---

## 16. ML Model 2 — Anomaly Detection

**Objective:** identify traffic behavior that differs significantly from a learned normal baseline.

```text
Normal:                          Observed:
~800 packets/sec                 ~6,000 packets/sec
~950 byte average packet size    large burst pattern
stable traffic pattern           unusual directionality

Output: ANOMALOUS TRAFFIC — Anomaly Score: 0.91
```

**Candidate algorithms:** Isolation Forest (good, explainable starting point), One-Class SVM, Autoencoder (advanced version).

---

## 17. ML Dataset, Evaluation & Mixed-Traffic Testing

Split data into training/validation/testing (e.g. 70/15/15) and **avoid evaluating only on captures seen during training** — always also test on unseen captures/configurations to demonstrate generalization.

**Classification metrics:** accuracy, precision, recall, F1, confusion matrix, e.g.:

```text
              Predicted
             Web Video VoIP
Actual Web     87    8    5
      Video     6   90    4
      VoIP      7    3   90
```

**Anomaly metrics (where suitable):** precision, recall, false-positive rate, ROC-AUC.

**Mixed-traffic test:** generate a continuous Web → Video → Web → VoIP session, capture it, then segment and verify the system detects the transitions:

```text
Continuous Capture → Segmentation →
Window 1 → Web | Window 2 → Web | Window 3 → Video | Window 4 → Video | Window 5 → VoIP
```

Document training/test datasets, splits, features used, model used, metrics, and limitations, so the team can defend a statement like: *"The classifier achieved X% accuracy on the held-out test dataset."*

---

## 18. Security Assessment Engine

Initially **rule-based and deterministic — not LLM-based.**

| Category | Positive finding | Negative finding |
|---|---|---|
| Cryptography | Strong modern AEAD cipher | Weak/legacy encryption or integrity |
| IKE version | Modern IKE (v2) | Legacy IKE (v1) |
| DH / key exchange | Strong group | Weak DH group → high risk |
| PFS | Enabled | Disabled → warning/risk |
| Replay protection | Enabled | Disabled/absent → high risk |
| SA lifetime | Reasonable | Unusual/excessive lifetime |

Example finding object:

```json
{
  "severity": "HIGH",
  "title": "Weak Diffie-Hellman group",
  "description": "The observed key-exchange configuration uses a weaker group.",
  "recommendation": "Use a stronger modern DH/ECDH group appropriate for the environment."
}
```

---

## 19. Security Scoring & Risk Classification

A transparent, documented scoring system — never an LLM-invented number.

**Example conceptual weighting:**

```text
Encryption / cryptography       25
Key exchange                    20
Authentication / integrity      15
PFS                              15
Replay protection                10
IKE version                       5
SA configuration                 10
-----------------------------------
Total                            100
```

(Alternative simpler weighting used in the second draft: Cryptography 35%, Key Exchange 25%, Session Security 20%, Configuration 20% — reconcile into one documented methodology before final judging, referencing applicable standards/guidance.)

**Risk thresholds (project-defined, document them):**

```text
90–100 → LOW
70–89  → MODERATE
40–69  → HIGH
0–39   → CRITICAL
```

Example: `AES-256-GCM +25, Strong DH +20, PFS +15, Replay +10, IKEv2 +5, SA config +10 → Security Score = 85/100 → Risk = LOW`.

---

## 20. Confidence System

Confidence is tracked **separately** from the security score, using the CONFIRMED/INFERRED/UNKNOWN framework from §11:

```text
ESP detection       → 99%
IKE version         → 95%
Encryption          → 98%
Traffic type        → 76%
PFS                 → 91%
```

When evidence is insufficient:

```text
PFS: UNKNOWN
Reason: Insufficient negotiation data.
```

---

## 21. AI / LLM Explanation Layer

The LLM is **not** responsible for raw packet parsing or the primary security score. It receives structured evidence and produces explanation only:

```json
{
  "ike_version": "IKEv2",
  "mode": "tunnel",
  "encryption": "AES-256-GCM",
  "dh_group": 19,
  "pfs": true,
  "replay_protection": true,
  "security_score": 92,
  "risk": "LOW",
  "traffic_prediction": { "video": 0.83, "web": 0.10, "other": 0.07 }
}
```

The LLM then produces: human-readable explanations, security-finding explanations, remediation suggestions, executive summaries, and technical narrative generation. Recommended: a **local model** served through a local inference runtime, using the structured analysis JSON as context (no cloud dependency, better for a controlled demo and for privacy of authorized-test traffic).

### Explainable AI

Don't just show a number — show *why*:

```text
Prediction: VIDEO
Confidence: 81%

Main contributing characteristics:
• High sustained throughput
• Large downstream volume
• Low idle frequency
• Repeated packet-size patterns
```

### Recommendation format

Every finding should explain evidence, impact, and action:

```text
Finding: PFS disabled
Impact: The configuration may provide weaker protection against certain
        retrospective key-compromise scenarios.
Recommendation: Enable PFS where supported and appropriate.
```

---

## 22. Metadata Exposure Analysis

Even when payloads are encrypted, traffic characteristics can reveal information. Analyze visible endpoints, packet sizes, timing, frequency, directionality, flow duration, bandwidth, and burst patterns:

```text
Metadata Exposure: MEDIUM

Observed:
- Persistent communication between fixed endpoints
- Distinct periodic packet pattern
- High-volume encrypted flow
```

Present this strictly as traffic-analysis/metadata inference, never as content decryption.

---

## 23. Threat Matrix

| Finding | Severity | Evidence | Recommendation |
|---|---|---|---|
| Weak DH | High | Group X | Upgrade |
| PFS disabled | Medium | Child SA configuration | Enable |
| Legacy cipher | High | IKE proposal | Replace |
| Replay protection | Good | SA parameters | No action |
| Metadata exposure | Medium | Flow statistics | Review |

Or as a severity tree:

```text
HIGH
├── Weak DH group
├── Legacy cryptographic configuration
MEDIUM
├── PFS disabled
├── Metadata exposure
LOW
└── Minor configuration issue
```

Recommendations must always be tied directly to observed evidence.

---

## 24. Report Generation

**Executive Report** (management / judges / non-specialists):

```text
Overall Risk: HIGH
Security Score: 42/100

Top Issues:
1. Weak key exchange configuration
2. PFS disabled
3. Legacy cryptographic option

Recommended Actions: ...
```

**Technical Report** (security/network engineers) — includes packets analyzed, IKE details, ESP statistics, full cryptographic configuration, traffic classification, ML metrics, findings, evidence, recommendations, and confidence values.

---

## 25. Dashboard

```text
╔════════════════════════════════════════════╗
║       AI IPSEC SECURITY ANALYZER            ║
╠════════════════════════════════════════════╣
║ SECURITY SCORE             87 / 100         ║
║ RISK LEVEL                 MODERATE         ║
╠════════════════════════════════════════════╣
║ VPN CONFIGURATION                           ║
║ IPsec ✓  IKEv2 ✓  Tunnel ✓                  ║
║ AES-256-GCM ✓  DH Group 14 ✓  PFS ✓         ║
╠════════════════════════════════════════════╣
║ TRAFFIC ANALYSIS                            ║
║ Video 81%  Web 12%  VoIP 4%  Other 3%       ║
╠════════════════════════════════════════════╣
║ FINDINGS                                    ║
║ ✓ Strong encryption   ✓ PFS enabled         ║
║ ⚠ DH configuration review recommended       ║
╠════════════════════════════════════════════╣
║ [AI Explanation] [Technical Report]         ║
║ [Executive Report]                          ║
╚════════════════════════════════════════════╝
```

**Sections to include:** PCAP upload, analysis status, VPN configuration summary, score, findings, threat matrix, traffic prediction (with confidence), anomaly score, AI explanation, and report-generation buttons.

---

## 26. Backend Architecture & Technology Stack

```text
backend/
├── capture/
├── protocol_analyzer/
├── normalizer/
├── ipsec_schema/
├── security_engine/
├── scoring/
├── ml/
│   ├── traffic_classifier/
│   └── anomaly_detector/
├── ai/
├── reporting/
├── storage/
└── api/
```

| Layer | Recommended stack |
|---|---|
| Frontend | React or Next.js |
| Backend | Python + FastAPI |
| IPsec testbed | strongSwan; Linux network namespaces/VMs |
| Capture | tcpdump, tshark, Wireshark (validation) |
| Protocol analysis | Zeek, Spicy IPsec analyzer, Scapy, ike-scan where useful |
| ML | scikit-learn, XGBoost, pandas, NumPy |
| AI/LLM | Local model via local inference runtime, fed structured JSON context |
| Storage | SQLite (early prototype) → PostgreSQL (larger/multi-user) |
| Reports | HTML/PDF generation; optional DOCX |

---

## 27. Live Traffic Analysis (Post-MVP)

Only after PCAP analysis is stable:

```text
Network Interface → tcpdump/live capture → Flow tracking → IPsec analysis → ML → Dashboard
```

Add a `START LIVE ANALYSIS` control so results update over time — a stretch feature, not a starting point.

---

## 28. IPv6 Support (Post-MVP)

After IPv4 support is fully stable, extend the packet parser and flow analyzer to handle IPv6 IPsec the same way as IPv4.

---

## 29. Robustness Testing

The analyzer must degrade gracefully rather than inventing results. Test:

1. A single ESP packet (expect: `IPsec: YES`, everything else `UNKNOWN`)
2. ESP without IKE
3. IKE without ESP
4. Partial capture
5. Mixed traffic
6. IPv6 traffic
7. Unknown/unsupported configuration
8. Corrupted or incomplete PCAP

---

## 30. Configuration Comparison (Standout Feature)

Compare two VPN deployments side-by-side and explain *why* one scores better:

```text
                  VPN A             VPN B
------------------------------------------------
Mode              Tunnel            Transport
Encryption        AES-128-CBC       AES-256-GCM
PFS               Disabled          Enabled
DH                Group 14          Group 20
------------------------------------------------
Security Score       61                 94
Risk                 HIGH               LOW
```

Other potential standout features (time permitting): mixed-traffic detection, live packet analysis, IPv6, explainable AI, confidence-aware results, unknown/insufficient-evidence handling, an interactive threat matrix, and historical trend/multi-PCAP comparison dashboards.

---

## 31. Security & Ethical Boundaries

Position the system explicitly as:

> A defensive protocol-analysis and security-assessment platform intended for **authorized traffic and controlled test environments** only.

The project must analyze only traffic the team is authorized to capture. It must not decrypt unauthorized VPN traffic, steal cryptographic keys, bypass VPN security, or intercept unauthorized communications.

---

## 32. MVP Definition

```text
✓ strongSwan IPsec testbed
✓ 10+ known VPN configurations
✓ Labeled PCAP dataset
✓ IKEv1/IKEv2 identification where supported
✓ ESP/AH identification
✓ Tunnel/Transport analysis
✓ Encryption/transform extraction
✓ DH group extraction
✓ PFS assessment
✓ Replay protection assessment
✓ Security score
✓ Security findings
✓ ML traffic classification
✓ ML anomaly detection
✓ Local LLM explanations
✓ Interactive dashboard
✓ Technical report
✓ Executive report
```

**After MVP:** IPv6 expansion, live analysis, more traffic categories, better anomaly detection, deeper metadata-exposure analysis, multi-PCAP comparison, historical trend dashboard, advanced visualization.

---

## 33. What NOT to Build

Do not waste prototype time on:

- Implementing your own IPsec stack
- Replacing strongSwan
- Replacing Wireshark/Zeek unnecessarily
- Using an LLM to interpret raw packet bytes
- Letting an LLM arbitrarily determine the security score
- Building deep learning before establishing a useful dataset
- Starting with live traffic before PCAP analysis works

---

## 34. Division Between Conventional Software, ML, and AI

| Component | Main technology | Purpose |
|---|---|---|
| Packet capture | tcpdump / tshark | Capture traffic |
| IPsec parsing | Zeek / Spicy | Extract protocol facts |
| Normalization | Python | Common internal schema |
| Security assessment | Rule engine | Detect weaknesses |
| Risk score | Deterministic scoring | Quantify security posture |
| Traffic classification | ML | Predict traffic type |
| Anomaly detection | ML | Detect unusual behavior |
| Explanation | Local LLM | Explain findings |
| Reports | Python + LLM | Create analyst reports |
| Dashboard | React | Visualize results |

This separation keeps the system technically defensible and easy to test.

---

## 35. Combined Development Roadmap (Master Sequence)

**Milestone 1 — Understanding.** Learn VPN → IPsec → IKE → SA → ESP → Tunnel/Transport → Encryption/DH/PFS. No coding.

**Milestone 2 — One working VPN.** Client ↔ IPsec ↔ Server, one configuration, verified traffic passthrough.

**Milestone 3 — Packet capture.** Capture IKE, ESP, and normal traffic; inspect in Wireshark.

**Milestone 4 — First analyzer.** PCAP → IPsec detection → IKE detection → ESP detection → basic extraction. No AI yet.

**Milestone 5 — Multiple configurations.** Add AES-128/256, GCM/CBC, PFS on/off, Tunnel/Transport; capture each.

**Milestone 6 — Traffic dataset.** Generate and label Web, Video, VoIP, ICMP, Email traffic (~10–20 configs × traffic types).

**Milestone 7 — Protocol extraction pipeline.** Reliable PCAP → Zeek/Spicy/tshark → normalized IPsec JSON.

**Milestone 8 — Security rule engine.** Cryptography, DH/key exchange, IKE version, PFS, replay protection, SA parameters, configuration compliance → findings + score on a known capture.

**Milestone 9 — ML traffic classification.** Feature extraction → baseline classifier → trained classifier (Random Forest/XGBoost/SVM) → measured F1/accuracy/confusion matrix.

**Milestone 10 — ML anomaly detection.** Flow features → baseline/training → Isolation Forest (or similar) → anomaly score; normal vs. anomalous demonstration.

**Milestone 11 — Mixed-traffic testing.** Continuous multi-activity capture → segmentation → transition detection.

**Milestone 12 — AI explanation layer.** Feed structured findings + ML results into a local LLM → explanations, recommendations, summaries.

**Milestone 13 — Report generation.** One-click Executive Report + Technical Report.

**Milestone 14 — Dashboard.** Combine configuration analysis, traffic analysis, ML predictions, security assessment, confidence, and findings into one analyst-facing UI.

**Milestone 15 — Polish & robustness.** Threat matrix, confidence-aware/UNKNOWN handling, robustness edge cases, explainable AI, configuration comparison, IPv6, and (only once everything above is stable) live capture.

---

## 36. Final Implementation Order (Do Not Reverse)

```text
1. Learn IPsec
2. Build strongSwan testbed
3. Generate labeled PCAP dataset
4. Extract IPsec facts with Zeek/Spicy/tshark
5. Normalize into the common schema
6. Build deterministic security engine
7. Build security scoring
8. Build ML traffic classifier
9. Build ML anomaly detector
10. Add local LLM explanation
11. Generate technical + executive reports
12. Build dashboard
13. Add live analysis
```

The biggest technical risk is trying to build the AI/ML layer before there is reliable IPsec evidence and a labeled dataset — resist that temptation.

---

## 37. Recommended Final Demo Sequence

1. **Show the testbed** — Gateway A ↔ IPsec tunnel ↔ Gateway B
2. **Generate traffic** — video-like, web-like, VoIP-like flows
3. **Upload a PCAP** — e.g. `weak_vpn.pcap`
4. **Analyze** — display IPsec ✓, IKEv2 ✓, Tunnel ✓, ESP ✓, AES-128-CBC ⚠, Weak DH ⚠, PFS ✗, Replay ✓
5. **Security score** — e.g. `47/100 — HIGH RISK`
6. **ML traffic analysis** — e.g. Video 78%, Web 17%, Other 5%; Anomaly score 0.12 (NORMAL)
7. **AI explanation** — concise analyst-readable summary of key findings
8. **Generate reports** — `Executive_Report.pdf`, `Technical_Report.pdf`
9. **Re-run on a modern configuration** — show the score improve, for a clear before/after comparison

---

## 38. Core Project Philosophy

```text
                  RAW NETWORK EVIDENCE
                           │
                           ▼
                    Protocol Analysis
                           │
                           ▼
                   Structured Evidence
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
            Rules          ML           AI
              │            │            │
          Security      Prediction   Explanation
          Assessment    / Anomaly
              │            │            │
              └────────────┼────────────┘
                           ▼
                      Analyst Report
```

**In one sentence:** Build a cybersecurity evidence pipeline that converts IPsec network traffic into an automated, explainable security assessment, while using ML to classify encrypted traffic and detect anomalies.

**Reframed as a design principle:** don't think of this as "build an AI that understands VPN packets." Instead: *build a system that collects observable evidence from IPsec traffic, determines what can be established directly from protocol information, uses statistical and machine-learning methods where inference is necessary, and produces a defensible security assessment.*

```text
Evidence first → Analysis second → Inference where necessary → Security assessment → Human-readable result
```

The analyzer should never pretend to know information the evidence can't support:

```text
CONFIRMED   ESP detected                          99% confidence
INFERRED    Video-like traffic                     81% confidence
UNKNOWN     Encryption algorithm — insufficient negotiation data
```

This evidence-based approach should guide the architecture, ML design, security scoring, and final presentation of the project end-to-end.

---

## 39. Useful Open-Source References

- Corelight Zeek/Spicy IPsec analyzer — https://github.com/corelight/zeek-spicy-ipsec
- strongSwan — https://github.com/strongswan/strongswan
- strongSwan testing environment docs — https://docs.strongswan.org/docs/latest/devs/testingEnvironment.html
- ike-scan — https://github.com/royhills/ike-scan
- yIKEs — https://github.com/aatlasis/yIKEs

These are foundations/references, not things to copy blindly into the final system.
