// Mock capture + findings dataset. Ground truth mirrors
// testing/json/weak-vpn-07.json. Later: served by FastAPI + real PCAP parse.

export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type Capture = {
  id: string;
  file: string;
  protocol: string;
  mode: string;
  score: number;
  risk: RiskLevel;
  date: string;
  cipher: string;
  integrity: string;
  dh: string;
  pfs: boolean;
  ike: string;
  spiInit: string;
  spiResp: string;
  endpoints: string;
  packets: string;
};

export const CAPTURES: Capture[] = [
  {
    id: "weak-vpn-07", file: "weak-vpn-07.pcap", protocol: "IKEv1", mode: "Tunnel",
    score: 47, risk: "HIGH", date: "Oct 22, 2025 · 14:02:19 UTC",
    cipher: "3DES-CBC", integrity: "HMAC-MD5", dh: "MODP-1024 (Group 2)",
    pfs: false, ike: "IKEv1", spiInit: "0x41f89c02", spiResp: "0x9a4f21e8",
    endpoints: "198.51.100.1 ↔ 203.0.113.44", packets: "842,109 pkts",
  },
  {
    id: "branch-emea-gw04", file: "branch-emea-gw04.pcap", protocol: "IKEv2", mode: "Tunnel",
    score: 61, risk: "HIGH", date: "Oct 22, 2025 · 11:42:08 UTC",
    cipher: "AES-128-CBC", integrity: "HMAC-SHA1-96", dh: "MODP-2048 (Group 14)",
    pfs: false, ike: "IKEv2", spiInit: "0x2f90ab12", spiResp: "0x7c4199aa",
    endpoints: "198.51.100.99 ↔ 203.0.113.12", packets: "38,104 pkts",
  },
  {
    id: "core-dc-chicago-gw1", file: "core-dc-chicago-gw1.pcap", protocol: "IKEv1", mode: "Tunnel",
    score: 38, risk: "CRITICAL", date: "Oct 21, 2025 · 09:14:55 UTC",
    cipher: "3DES-CBC", integrity: "HMAC-MD5", dh: "MODP-1024 (Group 2)",
    pfs: false, ike: "IKEv1", spiInit: "0x51aa09c4", spiResp: "0xb3d77e01",
    endpoints: "198.51.100.1 ↔ 203.0.113.44", packets: "842,109 pkts",
  },
  {
    id: "site2site-failover", file: "site2site-failover.pcapng", protocol: "IKEv2", mode: "Transport",
    score: 94, risk: "LOW", date: "Oct 20, 2025 · 17:40:02 UTC",
    cipher: "AES-256-GCM", integrity: "AEAD", dh: "ECP-256 (Group 19)",
    pfs: true, ike: "IKEv2", spiInit: "0x77c1de08", spiResp: "0x02f4a9c3",
    endpoints: "192.0.2.14 ↔ 198.51.100.1", packets: "1,482,091 pkts",
  },
  {
    id: "edge-gw04-us-east", file: "edge-gw04-us-east.pcap", protocol: "IKEv2", mode: "Tunnel",
    score: 52, risk: "HIGH", date: "Oct 19, 2025 · 08:02:41 UTC",
    cipher: "AES-128-CBC", integrity: "HMAC-SHA256", dh: "MODP-2048 (Group 14)",
    pfs: true, ike: "IKEv2", spiInit: "0x9d02bc41", spiResp: "0x44e1f0a7",
    endpoints: "192.0.2.14 ↔ 203.0.113.8", packets: "210,440 pkts",
  },
];

export type Finding = {
  id: string;
  severity: RiskLevel;
  title: string;
  layer: string;
  scope: string;
  evidence: "CONFIRMED" | "INFERRED" | "UNKNOWN";
  mechanism: string;
  impact: string;
  recommendation: string;
};

export const FINDINGS: Finding[] = [
  {
    id: "FND-2024-01", severity: "CRITICAL", title: "Weak Diffie-Hellman Group 2 (MODP-1024)",
    layer: "Cryptography · Key Exchange", scope: "IKEv2 Control Plane · Frames #42, #45",
    evidence: "CONFIRMED", mechanism: "Deterministic",
    impact: "1024-bit MODP enables passive retrospective decryption if traffic was captured.",
    recommendation: "Migrate to ECP-256 (Group 19) or stronger; reject Group 2 in proposals.",
  },
  {
    id: "FND-2024-02", severity: "HIGH", title: "PFS Disabled on Rekey",
    layer: "Key Management · Ephemeral KE", scope: "ESP Data SA · Frame #142",
    evidence: "CONFIRMED", mechanism: "Deterministic",
    impact: "Child SA rekeys without ephemeral exchange; one key compromises the session.",
    recommendation: "Enable PFS on all Child SA rekeys.",
  },
  {
    id: "FND-2024-03", severity: "HIGH", title: "Legacy AES-CBC + SHA-1 Suite",
    layer: "Cryptography · Cipher Mode", scope: "ESP & IKE_SA Suite · Frames #42, #58",
    evidence: "CONFIRMED", mechanism: "Deterministic",
    impact: "CBC padding-oracle surface plus collision-weak SHA-1 integrity.",
    recommendation: "Prefer AES-256-GCM (AEAD); deprecate CBC+HMAC-SHA1.",
  },
  {
    id: "FND-2024-04", severity: "CRITICAL", title: "High-Velocity Upstream Egress",
    layer: "Behavioral Anomaly · Flow Burst", scope: "Tunnel 0x0c3e8019a · Window W-28",
    evidence: "INFERRED", mechanism: "ML Isolation",
    impact: "4.8x burst anomaly vs learned baseline in window W-28.",
    recommendation: "Inspect window W-28 flows; confirm against change records.",
  },
  {
    id: "FND-2024-05", severity: "MEDIUM", title: "PSK Auth with Weak ID Proofing",
    layer: "Authentication · IKE_AUTH", scope: "Control Plane · Frames #58, #61",
    evidence: "CONFIRMED", mechanism: "Deterministic",
    impact: "Pre-shared-key auth without strong peer identity checks.",
    recommendation: "Move to certificate auth with strict ID validation.",
  },
  {
    id: "FND-2024-06", severity: "MEDIUM", title: "NAT-T Periodic Burst Fingerprint",
    layer: "Network · Cadence Anomaly", scope: "UDP:4500 NAT-T · Frame #45",
    evidence: "CONFIRMED", mechanism: "Heuristic",
    impact: "Regular NAT-T keepalive bursts fingerprint the tunnel cadence.",
    recommendation: "Randomize keepalive intervals where the gateway allows it.",
  },
];

export function getCapture(id: string): Capture {
  return CAPTURES.find((c) => c.id === id) ?? CAPTURES[0];
}

export function riskBadge(risk: RiskLevel): string {
  return risk;
}
