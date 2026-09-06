// Mock analysis content: pipeline stages, traffic mix, anomaly series, reports.

export type Stage = { id: string; label: string; detail: string };

export const PIPELINE_STAGES: Stage[] = [
  { id: "ingest", label: "PCAP Ingestion & Magic Header Verification", detail: "37 packets · 24,060 bytes" },
  { id: "parse", label: "DPDK Packet Parsing & Framing", detail: "IPv4 / UDP-500 / ESP" },
  { id: "ike", label: "IKE Detection & SA Extraction", detail: "IKEv1 · 2 exchanges" },
  { id: "esp", label: "ESP/AH Decapsulation & Integrity Inspection", detail: "SPI 0x41f89c02" },
  { id: "norm", label: "IPsec Normalization", detail: "Common JSON schema" },
  { id: "assess", label: "Deterministic Security Assessment", detail: "6 findings" },
  { id: "ml", label: "ML Encrypted Traffic Classification", detail: "Isolation Forest" },
  { id: "anomaly", label: "Anomaly & Tunnel Sequence Detection", detail: "1 anomalous window" },
  { id: "report", label: "RFC Forensic Audit & Report Generation", detail: "Executive + Technical" },
];

export const TRAFFIC_MIX = [
  { label: "Video", pct: 78, note: "H.264/RTP" },
  { label: "Web", pct: 17, note: "TLS over IPsec" },
  { label: "Other", pct: 5, note: "DNS/Signaling" },
];

export const ANOMALY_SCORE = 0.12;
export const ANOMALY_VERDICT = "NORMAL" as const;

export function executiveReportJSON(): string {
  return JSON.stringify(
    {
      capture: "weak-vpn-07.pcap",
      risk: "HIGH",
      security_score: 47,
      top_issues: [
        "Weak Diffie-Hellman Group 2 (MODP-1024)",
        "PFS disabled on Child SA rekey",
        "Legacy AES-CBC + SHA-1 suite",
      ],
      recommended_actions: [
        "Migrate to ECP-256 (Group 19) or stronger",
        "Enable PFS on all Child SA rekeys",
        "Prefer AES-256-GCM (AEAD)",
      ],
      traffic: { video: 0.78, web: 0.17, other: 0.05 },
      anomaly: { score: ANOMALY_SCORE, verdict: ANOMALY_VERDICT },
      generated: new Date().toISOString(),
      source: "TunnelSight prototype mock",
    },
    null,
    2
  );
}

export function findingsCSV(): string {
  const rows = [
    ["id", "severity", "title", "evidence", "scope"],
    ["FND-2024-01", "CRITICAL", "Weak Diffie-Hellman Group 2 (MODP-1024)", "CONFIRMED", "IKEv2 Control Plane"],
    ["FND-2024-02", "HIGH", "PFS Disabled on Rekey", "CONFIRMED", "ESP Data SA"],
    ["FND-2024-03", "HIGH", "Legacy AES-CBC + SHA-1 Suite", "CONFIRMED", "ESP & IKE_SA Suite"],
    ["FND-2024-04", "CRITICAL", "High-Velocity Upstream Egress", "INFERRED", "Tunnel 0x0c3e8019a"],
    ["FND-2024-05", "MEDIUM", "PSK Auth with Weak ID Proofing", "CONFIRMED", "Control Plane"],
  ];
  return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}
