"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { downloadFile } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";
import Stat from "@/components/motion/Stat";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";

export type SecurityFinding = {
  severity: string;
  category: string;
  description: string;
};

export type IPsecConfigData = {
  capture_name?: string;
  cryptography?: {
    encryption_algorithm?: string;
    integrity_algorithm?: string;
    dh_group?: number | null;
    pfs_enabled?: boolean;
  };
  sa_config?: {
    ike_version?: string;
    mode?: string;
    replay_protection?: boolean;
    lifetime_seconds?: number | null;
  };
};

export type AnalysisRecord = {
  id: string;
  filename: string;
  status: string;
  security_score?: number | null;
  risk_level?: string | null;
  anomaly_score?: number | null;
  traffic_label?: string | null;
  traffic_confidence?: number | null;
  config_json?: {
    capture_name?: string;
    ipsec_config?: IPsecConfigData;
    features?: {
      total_packets?: number;
      total_bytes?: number;
      packets_per_second?: number;
      flow_duration?: number;
    };
  } | null;
  findings_json?: SecurityFinding[] | null;
  created_at: string;
};

export type DetailedFinding = {
  rowId: string;
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  title: string;
  layer: string;
  targetScope: string;
  targetSub: string;
  evidence: "CONFIRMED" | "INFERRED";
  evidenceType: "Deterministic" | "ML Isolation" | "Heuristic" | "Dropped Burst";
  likelihood: number;
  impact: number;
  matrixCell: string;
  shortTag: string;
  protocolStage: string;
  packetRef: string;
  initiatorSpi: string;
  selectedTransform: string;
  hexOffset: string;
  hexRows: {
    offset: string;
    hex: string;
    ascii: string;
    highlight?: boolean;
  }[];
  hexExplanation: string;
  violationStandard: string;
  violationDetails: string;
  remediationSnippet: string;
  remediationCode: string;
};

const FORENSIC_FINDINGS_REGISTRY: DetailedFinding[] = [
  {
    rowId: "row-fnd-01",
    id: "FND-2024-01",
    severity: "CRITICAL",
    category: "Key Exchange",
    title: "Weak DH Group 2 (MODP-1024)",
    layer: "Cryptography · Key Exchange",
    targetScope: "IKEv2 Control Plane",
    targetSub: "Frames #42, #45",
    evidence: "CONFIRMED",
    evidenceType: "Deterministic",
    likelihood: 4,
    impact: 5,
    matrixCell: "L4/I5",
    shortTag: "F-01 DH Grp 2",
    protocolStage: "IKE_SA_INIT (Exchange 34)",
    packetRef: "Frame #42 (T+0.114s)",
    initiatorSpi: "0x8a91f3c401340b12",
    selectedTransform: "Transform Type 4: ID 0x0002",
    hexOffset: "Offset 0x0040 - 0x0050",
    hexRows: [
      { offset: "0040", hex: "03 00 00 0c 01 00 00 0c 00 00 00 08 04 00 00 02", ascii: "........ .......", highlight: true },
      { offset: "0050", hex: "00 00 00 08 02 00 00 02 00 00 00 08 03 00 00 02", ascii: "........ ........" },
    ],
    hexExplanation: "Byte [0x0048-0x004F] specifies Proposal Transform 4: DH Group 2 (MODP-1024)",
    violationStandard: "NIST SP 800-77r1 & RFC 8247 §2.4 Violation",
    violationDetails: "Group 2 yields <80 bits of cryptographic strength. Modern Number Field Sieve (NFS) enables passive factoring of 1024-bit primes. Adversaries passively capturing traffic can deduce SKEYSEED and decrypt child ESP payloads retroactively.",
    remediationSnippet: "ike = aes256gcm16-prfsha384-ecp256,aes256-sha256-modp2048!",
    remediationCode: `# Enforce Group 14 or Group 19 (Curve25519)
conn enterprise-production-edge
  ike = aes256gcm16-prfsha384-ecp256,aes256-sha256-modp2048!
  esp = aes256gcm16-ecp256!
# Forbids fallback to DH Group 2`,
  },
  {
    rowId: "row-fnd-02",
    id: "FND-2024-02",
    severity: "HIGH",
    category: "Key Exchange",
    title: "PFS Disabled on Rekey",
    layer: "Key Management · Ephemeral KE",
    targetScope: "ESP Data SA (0x9a02)",
    targetSub: "Frame #142",
    evidence: "CONFIRMED",
    evidenceType: "Deterministic",
    likelihood: 4,
    impact: 4,
    matrixCell: "L4/I4",
    shortTag: "F-02 No PFS",
    protocolStage: "CREATE_CHILD_SA (Exchange 36)",
    packetRef: "Frame #142 (T+2.267s)",
    initiatorSpi: "0x9a021da3",
    selectedTransform: "KEi Payload Omitted (PFS Disabled)",
    hexOffset: "Offset 0x0020 - 0x0030",
    hexRows: [
      { offset: "0020", hex: "29 00 00 80 00 00 00 24 01 03 04 03 00 00 00 0c", ascii: ").....$........", highlight: true },
      { offset: "0030", hex: "80 0c 00 80 00 00 00 08 03 00 00 02 00 00 00 08", ascii: "................" },
    ],
    hexExplanation: "Byte [0x0028] confirms SA Proposal without subsequent Key Exchange (KEi) payload.",
    violationStandard: "RFC 7296 §1.3.3 & NIST SP 800-77r1 Requirement",
    violationDetails: "Child SAs rekeyed without ephemeral Diffie-Hellman payloads derive keys directly from original SKEYSEED. Compromise of initial IKE SA compromise cascades into retroactive decryption of all child SA flows.",
    remediationSnippet: "esp = aes256gcm16-ecp256!",
    remediationCode: `# Enforce Ephemeral DH on Child SA Rekey
conn enterprise-production-edge
  esp = aes256gcm16-ecp256!
  rekeymargin = 540s`,
  },
  {
    rowId: "row-fnd-04",
    id: "FND-2024-04",
    severity: "CRITICAL",
    category: "Behavioral Anomaly",
    title: "High-Velocity Upstream Egress",
    layer: "Behavioral Anomaly · Flow Burst",
    targetScope: "Tunnel 0x0c3e8019a",
    targetSub: "Window W-28",
    evidence: "INFERRED",
    evidenceType: "ML Isolation",
    likelihood: 5,
    impact: 4,
    matrixCell: "L5/I4",
    shortTag: "F-04 Flow Blast",
    protocolStage: "ESP Tunnel Mode Data Plane",
    packetRef: "Window W-28 (T+12.4s)",
    initiatorSpi: "0x0c3e8019a",
    selectedTransform: "Isolation Forest Score: -0.18 (Anomaly)",
    hexOffset: "Offset 0x0010 - 0x0020",
    hexRows: [
      { offset: "0010", hex: "45 00 05 dc a1 f2 40 00 40 32 88 f1 c0 a8 01 64", ascii: "E.....@.@2.....d", highlight: true },
      { offset: "0020", hex: "0a 00 02 0f 0c 3e 80 19 00 00 02 a4 aa 12 b4 80", ascii: ".....>.........." },
    ],
    hexExplanation: "Isolation Forest decision score -0.18 detected 4.8x statistical deviation in egress packet velocity.",
    violationStandard: "Isolation Forest Anomaly (Contamination Threshold 0.05)",
    violationDetails: "ML feature extraction observed 4.8x surge in upload-to-download ratio (ul_dl_ratio > 9.2) during window W-28. Potential unauthorized data exfiltration or compromised internal host tunneling unauthorized traffic.",
    remediationSnippet: "iptables -A FORWARD -m limit --limit 500/sec -j ACCEPT",
    remediationCode: `# Network Edge Rate Limiting & Egress Policing
iptables -A FORWARD -o ipsec0 -m limit --limit 500/s --limit-burst 1000 -j ACCEPT
tc qdisc add dev ipsec0 root tbf rate 50mbit burst 32kbit latency 400ms`,
  },
  {
    rowId: "row-fnd-03",
    id: "FND-2024-03",
    severity: "HIGH",
    category: "Cryptography",
    title: "Legacy AES-CBC + SHA-1 Suite",
    layer: "Cryptography · Cipher Mode",
    targetScope: "ESP & IKE_SA Suite",
    targetSub: "Frames #42, #58",
    evidence: "CONFIRMED",
    evidenceType: "Deterministic",
    likelihood: 3,
    impact: 3,
    matrixCell: "L3/I3",
    shortTag: "F-03 3DES/SHA1",
    protocolStage: "IKE_AUTH (Exchange 35)",
    packetRef: "Frames #42, #58 (T+0.342s)",
    initiatorSpi: "0x8a91f3c401340b12",
    selectedTransform: "Transform Type 1: AES-CBC (128) + HMAC-SHA1",
    hexOffset: "Offset 0x0030 - 0x0040",
    hexRows: [
      { offset: "0030", hex: "03 00 00 08 01 00 00 07 03 00 00 08 02 00 00 01", ascii: "................", highlight: true },
      { offset: "0040", hex: "00 00 00 08 03 00 00 01 00 00 00 08 04 00 00 0e", ascii: "................" },
    ],
    hexExplanation: "Byte [0x0038-0x003F] negotiated Transform 2 ID 1: HMAC-SHA1 integrity verification.",
    violationStandard: "RFC 8247 §3.1.1 & NIST SP 800-77r1 §3.1",
    violationDetails: "HMAC-SHA1 and AES-CBC are vulnerable to collision attacks and padding-oracle timing attacks. Modern IPsec gateways MUST enforce AEAD ciphers (AES-GCM or ChaCha20-Poly1305).",
    remediationSnippet: "ike = aes256gcm16-prfsha384-ecp256!",
    remediationCode: `# Migrate to Authenticated Encryption (AEAD)
conn enterprise-production-edge
  ike = aes256gcm16-prfsha384-ecp256!
  esp = aes256gcm16!`,
  },
  {
    rowId: "row-fnd-05",
    id: "FND-2024-05",
    severity: "MEDIUM",
    category: "Authentication",
    title: "PSK Auth with Weak ID Proofing",
    layer: "Authentication · IKE_AUTH",
    targetScope: "Control Plane",
    targetSub: "Frames #58, #61",
    evidence: "CONFIRMED",
    evidenceType: "Deterministic",
    likelihood: 4,
    impact: 3,
    matrixCell: "L4/I3",
    shortTag: "F-05 PSK Auth",
    protocolStage: "IKE_AUTH (Exchange 35)",
    packetRef: "Frames #58, #61 (T+0.412s)",
    initiatorSpi: "0x8a91f3c401340b12",
    selectedTransform: "ID_KEY_ID (Pre-Shared Key Authentication)",
    hexOffset: "Offset 0x0060 - 0x0070",
    hexRows: [
      { offset: "0060", hex: "23 00 00 1c 0b 00 00 00 67 61 74 65 77 61 79 2d", ascii: "#.......gateway-", highlight: true },
      { offset: "0070", hex: "65 64 67 65 2d 70 72 6f 64 2e 6e 65 74 00 00 00", ascii: "edge-prod.net..." },
    ],
    hexExplanation: "Byte [0x0060] confirms IKE_AUTH payload using PSK authentication rather than RSA/ECDSA certificates.",
    violationStandard: "NIST SP 800-77r1 §3.2 (Authentication Requirements)",
    violationDetails: "Pre-Shared Keys lack automated identity attestation and forward secrecy across key compromise. High risk of dictionary attacks against low-entropy pre-shared secrets.",
    remediationSnippet: "authby = rsa-sha256",
    remediationCode: `# Upgrade to X.509 PKI / Digital Signature Authentication
conn enterprise-production-edge
  leftauth = pubkey
  leftcert = edge-gateway-cert.pem
  rightauth = pubkey`,
  },
  {
    rowId: "row-fnd-06",
    id: "FND-2024-06",
    severity: "MEDIUM",
    category: "Network",
    title: "NAT-T Periodic Burst Fingerprint",
    layer: "Network · Cadence Anomaly",
    targetScope: "UDP:4500 NAT-T",
    targetSub: "Frame #45",
    evidence: "CONFIRMED",
    evidenceType: "Heuristic",
    likelihood: 4,
    impact: 2,
    matrixCell: "L4/I2",
    shortTag: "F-06 NAT-T",
    protocolStage: "IKE_SA_INIT (Exchange 34)",
    packetRef: "Frame #45 (T+0.128s)",
    initiatorSpi: "0x9c3d1045",
    selectedTransform: "NAT-D (Port Float 4500 Non-ESP)",
    hexOffset: "Offset 0x0070 - 0x0080",
    hexRows: [
      { offset: "0070", hex: "00 00 00 00 8a 91 f3 c4 01 34 0b 12 7c 29 01 a8", ascii: "....4..|).......", highlight: true },
      { offset: "0080", hex: "2b 00 00 18 c0 a8 01 64 04 a4 00 00 00 00 00 00", ascii: "+......d........" },
    ],
    hexExplanation: "Non-ESP Marker (0x00000000) confirms floating from UDP:500 to UDP:4500 with un-jittered keepalive intervals.",
    violationStandard: "RFC 3948 §2.1 & RFC 3947 NAT-Traversal Cadence",
    violationDetails: "Strict static keepalive heartbeat intervals allow upstream packet sniffers to fingerprint active VPN tunnels despite encryption payload hiding.",
    remediationSnippet: "dpddelay = 30s, dpdaction = restart",
    remediationCode: `# Configure DPD Jitter to prevent Traffic Analysis Fingerprinting
conn enterprise-production-edge
  dpddelay = 30s
  dpdtimeout = 120s
  dpdaction = restart`,
  },
  {
    rowId: "row-fnd-07",
    id: "FND-2024-07",
    severity: "LOW",
    category: "Integrity",
    title: "ESP Sequence Counter Jump (+4)",
    layer: "Integrity · Replay Window",
    targetScope: "SPI: 0x9a021da3",
    targetSub: "Frames #890-#891",
    evidence: "CONFIRMED",
    evidenceType: "Dropped Burst",
    likelihood: 2,
    impact: 2,
    matrixCell: "L2/I2",
    shortTag: "F-07 Replay Gap",
    protocolStage: "ESP Child SA Stream",
    packetRef: "Frames #890-#891 (T+18.94s)",
    initiatorSpi: "0x9a021da3",
    selectedTransform: "Sequence Delta: +4 within 64-pkt window",
    hexOffset: "Offset 0x0000 - 0x0010",
    hexRows: [
      { offset: "0000", hex: "9a 02 1d a3 00 00 03 7b 4f a2 b1 00 12 e4 a0 f1", ascii: "...{O..........", highlight: true },
      { offset: "0010", hex: "88 91 c4 20 11 00 00 04 a2 11 bb 44 99 00 11 22", ascii: "... .......D...\"" },
    ],
    hexExplanation: "ESP Sequence number monotonically incremented from 887 to 891 with 4 unacknowledged frames.",
    violationStandard: "RFC 4303 §3.4.3 Anti-Replay Mechanism",
    violationDetails: "Non-consecutive sequence counters indicate intermediate network packet loss or transient replay injection attempt discarded by ingress bitmap.",
    remediationSnippet: "replay_window = 128",
    remediationCode: `# Expand Anti-Replay Bitmap Window Size
conn enterprise-production-edge
  replay_window = 128`,
  },
];

const DEFAULT_ANALYSIS: AnalysisRecord = {
  id: "8a91f3c4-0134-4b12-9a02-1da37c2901a8",
  filename: "weak-vpn-07.pcap",
  status: "completed",
  security_score: 47,
  risk_level: "HIGH",
  anomaly_score: -0.18,
  traffic_label: "Video",
  traffic_confidence: 0.94,
  config_json: {
    capture_name: "weak-vpn-07.pcap",
    ipsec_config: {
      capture_name: "weak-vpn-07.pcap",
      cryptography: {
        encryption_algorithm: "AES-128-CBC",
        integrity_algorithm: "HMAC-SHA1",
        dh_group: 2,
        pfs_enabled: false,
      },
      sa_config: {
        ike_version: "IKEv2",
        mode: "Tunnel",
        replay_protection: true,
        lifetime_seconds: 28800,
      },
    },
    features: {
      total_packets: 421050,
      total_bytes: 712400000,
      packets_per_second: 1850,
      flow_duration: 227.6,
    },
  },
  findings_json: [
    { severity: "CRITICAL", category: "Key Exchange", description: "Extremely weak DH Group (2). Use Group 14 or higher." },
    { severity: "HIGH", category: "Key Exchange", description: "Perfect Forward Secrecy (PFS) is DISABLED. Past traffic can be decrypted if long-term keys are compromised." },
    { severity: "CRITICAL", category: "Behavioral Anomaly", description: "Isolation Forest anomaly detected: 4.8x burst anomaly in window W-28." },
    { severity: "HIGH", category: "Cryptography", description: "AES-CBC + SHA-1 is legacy and vulnerable to collision and timing attacks." },
    { severity: "MEDIUM", category: "Authentication", description: "PSK authentication configured without digital signature proofing." },
    { severity: "MEDIUM", category: "Network", description: "NAT-T encapsulation without keepalive interval jitter." },
    { severity: "LOW", category: "Integrity", description: "ESP Sequence Counter Jump (+4) observed within anti-replay bitmap." },
  ],
  created_at: new Date().toISOString(),
};

export default function FindingsPage() {
  const [selectedRow, setSelectedRow] = useState<string>("row-fnd-01");
  const [severity, setSeverity] = useState("all");
  const [evidence, setEvidence] = useState("all");
  const [query, setQuery] = useState("");
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisRecord>(DEFAULT_ANALYSIS);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Ingest real analysis from PostgreSQL backend or active session
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = typeof window !== "undefined" ? sessionStorage.getItem("ts_demo_file") : null;
        const targetName = stored ? JSON.parse(stored).name : null;

        const history = await api("/api/history");
        if (Array.isArray(history) && history.length > 0) {
          const match = targetName ? history.find((h: AnalysisRecord) => h.filename === targetName) : history[0];
          if (match) {
            setAnalysis(match);
          }
        }
      } catch {
        // Standalone offline fallback
      }
    };
    loadData();
  }, []);

  const crypto = analysis.config_json?.ipsec_config?.cryptography;
  const dhGroup = crypto?.dh_group ?? 2;
  const pfsEnabled = crypto?.pfs_enabled ?? false;
  const anomalyScore = analysis.anomaly_score ?? -0.18;

  // Filter findings dynamically according to selected filters
  const filteredFindings = useMemo(() => {
    return FORENSIC_FINDINGS_REGISTRY.filter((f) => {
      // Severity filter
      if (severity !== "all" && f.severity.toLowerCase() !== severity.toLowerCase()) {
        return false;
      }
      // Evidence filter
      if (evidence !== "all" && f.evidence.toLowerCase() !== evidence.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (query.trim() !== "") {
        const q = query.toLowerCase();
        const matches =
          f.id.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.layer.toLowerCase().includes(q) ||
          f.targetScope.toLowerCase().includes(q) ||
          f.violationStandard.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [severity, evidence, query]);

  // Active finding shown in the right drawer
  const activeFinding = useMemo(() => {
    return FORENSIC_FINDINGS_REGISTRY.find((f) => f.rowId === selectedRow) ?? FORENSIC_FINDINGS_REGISTRY[0];
  }, [selectedRow]);

  const selectRow = (id: string) => {
    setSelectedRow(id);
    setInspectorOpen(true);
  };

  const handleCopySnippet = () => {
    if (activeFinding?.remediationSnippet) {
      navigator.clipboard.writeText(activeFinding.remediationSnippet);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  // Dynamic counts
  const criticalCount = FORENSIC_FINDINGS_REGISTRY.filter((f) => f.severity === "CRITICAL").length;
  const highCount = FORENSIC_FINDINGS_REGISTRY.filter((f) => f.severity === "HIGH").length;
  const mediumCount = FORENSIC_FINDINGS_REGISTRY.filter((f) => f.severity === "MEDIUM").length;
  const lowCount = FORENSIC_FINDINGS_REGISTRY.filter((f) => f.severity === "LOW").length;
  const confirmedCount = FORENSIC_FINDINGS_REGISTRY.filter((f) => f.evidence === "CONFIRMED").length;
  const inferredCount = FORENSIC_FINDINGS_REGISTRY.filter((f) => f.evidence === "INFERRED").length;

  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/analysis/findings" innerClassName="flex flex-col w-full text-zinc-200">
        {/* 1. SUB-HEADER / CONTEXT BAR */}
        <section className="bg-[#111317] border-b border-zinc-800/80 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
              <Link href="/history" className="hover:text-zinc-300 transition-colors">
                Captures
              </Link>
              <span>/</span>
              <span className="text-teal-400 font-medium">{analysis.filename}</span>
              <span>/</span>
              <span className="text-zinc-200 font-medium">Security Findings &amp; Threat Matrix</span>
            </div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-zinc-400">
              <span className="flex items-center gap-2 text-zinc-100 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                <span className="font-display-serif font-bold text-base text-white tabular-nums">
                  <Stat to={FORENSIC_FINDINGS_REGISTRY.length} />
                </span>{" "}
                Security Findings Identified
              </span>
              <span className="text-zinc-700">|</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-semibold">
                {criticalCount} Critical
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold">
                {highCount} High
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                {mediumCount} Medium
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 font-mono">
                {lowCount} Low
              </span>
              <span className="text-zinc-700">|</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                Framework: NIST SP 800-77r1 &amp; RFC 8247
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800/80 transition-colors rounded text-xs font-mono font-medium"
              type="button"
              onClick={() => {
                const csvRows = [
                  "ID,Severity,Category,Finding,Layer,TargetScope,Evidence",
                  ...FORENSIC_FINDINGS_REGISTRY.map(
                    (f) => `"${f.id}","${f.severity}","${f.category}","${f.title}","${f.layer}","${f.targetScope}","${f.evidence}"`
                  ),
                ].join("\n");
                downloadFile("findings.csv", csvRows, "text/csv");
              }}
            >
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>Export CSV</span>
            </button>
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-colors rounded text-xs font-medium font-mono"
              type="button"
              onClick={() => {
                downloadFile("executive-remediation-plan.json", executiveReportJSON());
              }}
            >
              <span className="material-symbols-outlined text-[15px] text-teal-400">verified_user</span>
              <span>Remediation Plan</span>
            </button>
          </div>
        </section>

        {/* 2. TOP ANALYTICAL SUMMARY & THREAT MATRIX */}
        <section className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 bg-[#111317] p-5 rounded-lg border border-zinc-800/90 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">Exploitability vs. Impact Matrix</h3>
                  <p className="font-mono text-xs text-zinc-400">
                    NIST CVE-CVSS Calibration · {FORENSIC_FINDINGS_REGISTRY.length} Discovered Vulnerabilities Plotted
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-sm bg-zinc-700"></span>Low
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2 h-2 rounded-sm bg-sky-500/40"></span>Medium
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-sm bg-amber-500/40"></span>High
                </span>
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>Critical
                </span>
              </div>
            </div>

            {/* 5x5 Matrix Grid */}
            <div className="relative grid grid-cols-5 grid-rows-5 gap-1.5 font-mono text-xs select-none h-60">
              {/* Row 5 (Likelihood 5) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L5/I1</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L5/I2</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L5/I3</span>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                  selectedRow === "row-fnd-04"
                    ? "bg-rose-950/50 border-rose-500 ring-1 ring-rose-500"
                    : "bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/40"
                }`}
                onClick={() => selectRow("row-fnd-04")}
              >
                <span className="text-rose-400 text-[10px] font-semibold">L5/I4</span>
                <div
                  className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight truncate"
                  title="FND-2024-04: High-Velocity Upstream Egress Anomaly"
                >
                  F-04 Flow Blast
                </div>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L5/I5</span>
              </div>

              {/* Row 4 (Likelihood 4) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L4/I1</span>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                  selectedRow === "row-fnd-06"
                    ? "bg-sky-950/50 border-sky-500 ring-1 ring-sky-500"
                    : "bg-sky-950/20 border-sky-500/30 hover:bg-sky-950/40"
                }`}
                onClick={() => selectRow("row-fnd-06")}
              >
                <span className="text-zinc-500 text-[10px]">L4/I2</span>
                <div
                  className="bg-sky-900/60 text-sky-200 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate"
                  title="FND-2024-06: NAT-T Periodic Burst Fingerprint"
                >
                  F-06 NAT-T
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                  selectedRow === "row-fnd-05"
                    ? "bg-sky-950/50 border-sky-500 ring-1 ring-sky-500"
                    : "bg-sky-950/20 border-sky-500/30 hover:bg-sky-950/40"
                }`}
                onClick={() => selectRow("row-fnd-05")}
              >
                <span className="text-zinc-500 text-[10px]">L4/I3</span>
                <div
                  className="bg-sky-900/60 text-sky-200 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate"
                  title="FND-2024-05: PSK Authentication with Weak Proofing"
                >
                  F-05 PSK Auth
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                  selectedRow === "row-fnd-02"
                    ? "bg-amber-950/50 border-amber-500 ring-1 ring-amber-500"
                    : "bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/40"
                }`}
                onClick={() => selectRow("row-fnd-02")}
              >
                <span className="text-amber-400 text-[10px] font-semibold">L4/I4</span>
                <div
                  className="bg-amber-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight truncate"
                  title="FND-2024-02: PFS Disabled on Rekey"
                >
                  F-02 No PFS
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                  selectedRow === "row-fnd-01"
                    ? "bg-rose-950/70 border-rose-400 ring-1 ring-teal-400"
                    : "bg-rose-950/30 border-rose-500/50 hover:bg-rose-950/50"
                }`}
                onClick={() => selectRow("row-fnd-01")}
              >
                <span className="text-rose-400 text-[10px] font-bold">L4/I5</span>
                <div
                  className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-md truncate"
                  title="FND-2024-01: Weak Diffie-Hellman Group 2"
                >
                  F-01 DH Grp 2
                </div>
              </div>

              {/* Row 3 (Likelihood 3) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L3/I1</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L3/I2</span>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                  selectedRow === "row-fnd-03"
                    ? "bg-amber-950/50 border-amber-500 ring-1 ring-amber-500"
                    : "bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/40"
                }`}
                onClick={() => selectRow("row-fnd-03")}
              >
                <span className="text-zinc-500 text-[10px]">L3/I3</span>
                <div
                  className="bg-amber-900/60 text-amber-200 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate"
                  title="FND-2024-03: Legacy AES-CBC + SHA-1 Suite"
                >
                  F-03 3DES/SHA1
                </div>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L3/I4</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L3/I5</span>
              </div>

              {/* Row 2 (Likelihood 2) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L2/I1</span>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${
                  selectedRow === "row-fnd-07"
                    ? "bg-zinc-800 border-zinc-500 ring-1 ring-zinc-400"
                    : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/60"
                }`}
                onClick={() => selectRow("row-fnd-07")}
              >
                <span className="text-zinc-500 text-[10px]">L2/I2</span>
                <div className="bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate">
                  F-07 Replay Gap
                </div>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L2/I3</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L2/I4</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L2/I5</span>
              </div>

              {/* Row 1 (Likelihood 1) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L1/I1</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L1/I2</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L1/I3</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L1/I4</span>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between">
                <span className="text-zinc-600 text-[10px]">L1/I5</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase pt-2.5 border-t border-zinc-800/80">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-teal-400">arrow_forward</span>
                Impact: Negligible (I1) → Catastrophic (I5)
              </span>
              <span className="text-right">Likelihood: Rare (L1) → Active (L5)</span>
            </div>
          </div>

          {/* Side Summary Cards */}
          <div className="xl:col-span-4 flex flex-col gap-3 justify-between">
            {/* 1. Cryptographic Margin Card */}
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Cryptographic Margin</span>
                <span
                  className={`text-base font-semibold flex items-center gap-1.5 ${
                    dhGroup < 14 ? "text-rose-400" : dhGroup === 14 ? "text-amber-400" : "text-teal-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {dhGroup < 14 ? "warning" : dhGroup === 14 ? "info" : "verified"}
                  </span>
                  {dhGroup < 14 ? "Compromised" : dhGroup === 14 ? "Deprecated Min" : "Compliant"}
                </span>
                <span className="text-xs text-zinc-400">
                  {dhGroup < 14
                    ? `Legacy ${dhGroup === 2 ? "1024-bit" : "weak"} primes detected`
                    : dhGroup === 14
                    ? "2048-bit MODP threshold"
                    : "ECDH Curve25519 (Suite B)"}
                </span>
              </div>
              <div
                className={`w-14 h-14 rounded-lg flex items-center justify-center font-display-serif font-bold text-lg ${
                  dhGroup < 14
                    ? "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    : dhGroup === 14
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    : "bg-teal-500/10 border border-teal-500/20 text-teal-400"
                }`}
              >
                {dhGroup < 14 ? "<80b" : dhGroup === 14 ? "112b" : "128b+"}
              </div>
            </div>

            {/* 2. Forward Secrecy Card */}
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Forward Secrecy (PFS)</span>
                <span
                  className={`text-base font-semibold flex items-center gap-1.5 ${
                    !pfsEnabled ? "text-rose-400" : "text-teal-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {!pfsEnabled ? "lock_open" : "lock"}
                  </span>
                  {!pfsEnabled ? "Disabled" : "Enforced"}
                </span>
                <span className="text-xs text-zinc-400">
                  {!pfsEnabled ? "Subject to retroactive decryption" : "Ephemeral DH per Child SA rekey"}
                </span>
              </div>
              <div
                className={`w-14 h-14 rounded-lg flex items-center justify-center font-display-serif font-bold text-lg ${
                  !pfsEnabled
                    ? "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    : "bg-teal-500/10 border border-teal-500/20 text-teal-400"
                }`}
              >
                {!pfsEnabled ? "0%" : "100%"}
              </div>
            </div>

            {/* 3. Tunnel Behavioral Drift Card (ML Isolation Forest) */}
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Tunnel Behavioral Drift
                </span>
                <span
                  className={`text-base font-semibold flex items-center gap-1.5 ${
                    anomalyScore < 0 ? "text-amber-400" : "text-teal-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {anomalyScore < 0 ? "crisis_alert" : "monitoring"}
                  </span>
                  {anomalyScore < 0 ? "Severe Egress Spike" : "Nominal Traffic"}
                </span>
                <span className="text-xs text-zinc-400">
                  {anomalyScore < 0 ? "4.8x burst anomaly in W-28" : "Zero statistical deviation"}
                </span>
              </div>
              <div
                className={`w-14 h-14 rounded-lg flex items-center justify-center font-display-serif font-bold text-lg tabular-nums ${
                  anomalyScore < 0
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    : "bg-teal-500/10 border border-teal-500/20 text-teal-400"
                }`}
              >
                {anomalyScore < 0 ? "0.91" : "0.04"}
              </div>
            </div>

            {/* 4. Remediation Effort Card */}
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Remediation Effort</span>
                <span className="text-base text-teal-400 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">build_circle</span>Low Effort
                </span>
                <span className="text-xs text-zinc-400">3 config stanza replacements</span>
              </div>
              <div className="w-14 h-14 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-display-serif font-bold text-sm text-teal-400">
                3 LOC
              </div>
            </div>
          </div>
        </section>

        {/* 3. MULTI-DIMENSIONAL FILTER TOOLBAR */}
        <section className="px-6 pb-4">
          <div className="bg-[#111317] p-2 rounded-lg border border-zinc-800/90 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-2.5">
              <div className="flex items-center bg-zinc-900 border border-zinc-800/80 rounded-md p-0.5">
                <span className="font-mono text-[10px] uppercase text-zinc-500 px-2">Severity</span>
                <button
                  className={
                    severity === "all"
                      ? "px-2.5 py-1 text-xs font-mono bg-zinc-800 text-white rounded font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                  }
                  type="button"
                  onClick={() => setSeverity("all")}
                >
                  All ({FORENSIC_FINDINGS_REGISTRY.length})
                </button>
                <button
                  className={
                    severity === "critical"
                      ? "px-2.5 py-1 text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
                  }
                  type="button"
                  onClick={() => setSeverity("critical")}
                >
                  Critical ({criticalCount})
                </button>
                <button
                  className={
                    severity === "high"
                      ? "px-2.5 py-1 text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
                  }
                  type="button"
                  onClick={() => setSeverity("high")}
                >
                  High ({highCount})
                </button>
                <button
                  className={
                    severity === "medium"
                      ? "px-2.5 py-1 text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
                  }
                  type="button"
                  onClick={() => setSeverity("medium")}
                >
                  Medium ({mediumCount})
                </button>
                <button
                  className={
                    severity === "low"
                      ? "px-2.5 py-1 text-xs font-mono bg-zinc-800 text-zinc-200 rounded font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-zinc-500 hover:text-zinc-400 transition-colors"
                  }
                  type="button"
                  onClick={() => setSeverity("low")}
                >
                  Low ({lowCount})
                </button>
              </div>

              <div className="flex items-center bg-zinc-900 border border-zinc-800/80 rounded-md p-0.5">
                <span className="font-mono text-[10px] uppercase text-zinc-500 px-2">Evidence</span>
                <button
                  className={
                    evidence === "all"
                      ? "px-2.5 py-1 text-xs font-mono bg-zinc-800 text-white rounded font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                  }
                  type="button"
                  onClick={() => setEvidence("all")}
                >
                  All
                </button>
                <button
                  className={
                    evidence === "confirmed"
                      ? "px-2.5 py-1 text-xs font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded flex items-center gap-1.5 font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                  }
                  type="button"
                  onClick={() => setEvidence("confirmed")}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>Confirmed ({confirmedCount})
                </button>
                <button
                  className={
                    evidence === "inferred"
                      ? "px-2.5 py-1 text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded flex items-center gap-1.5 font-medium"
                      : "px-2.5 py-1 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  }
                  type="button"
                  onClick={() => setEvidence("inferred")}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Inferred ({inferredCount})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 w-full sm:w-80">
              <span className="material-symbols-outlined text-[16px] text-zinc-500">search</span>
              <input
                className="bg-transparent border-0 p-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none w-full font-mono"
                placeholder="Filter by CVE, transform, RFC..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
                >
                  ✕
                </button>
              ) : (
                <kbd className="font-mono text-[10px] text-zinc-500 bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700">
                  ESC
                </kbd>
              )}
            </div>
          </div>
        </section>

        {/* 4. WORKBENCH SPLIT: PRIORITIZED FINDINGS TABLE + INSPECTOR DRAWER */}
        <section className="px-6 pb-12 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-7 bg-[#111317] rounded-lg border border-zinc-800/90 flex flex-col overflow-hidden">
            <div className="bg-zinc-900/80 px-4 py-2.5 grid grid-cols-12 gap-3 text-zinc-400 font-mono text-[11px] uppercase tracking-wider select-none border-b border-zinc-800">
              <div className="col-span-3">Severity &amp; ID</div>
              <div className="col-span-4">Finding &amp; Layer</div>
              <div className="col-span-3">Target Scope</div>
              <div className="col-span-2 text-right">Evidence</div>
            </div>

            <div className="divide-y divide-zinc-800/50 flex flex-col text-xs">
              {filteredFindings.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  No findings matching selected criteria.
                </div>
              ) : (
                filteredFindings.map((finding) => (
                  <div
                    key={finding.rowId}
                    id={finding.rowId}
                    className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${
                      selectedRow === finding.rowId
                        ? "bg-zinc-800/70 border-l-2 border-teal-400"
                        : "hover:bg-zinc-800/30"
                    }`}
                    onClick={() => selectRow(finding.rowId)}
                  >
                    <div className="col-span-3 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          finding.severity === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : finding.severity === "HIGH"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : finding.severity === "MEDIUM"
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700/60"
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <span
                        className={`font-mono ${
                          selectedRow === finding.rowId ? "text-teal-400 font-semibold" : "text-zinc-400"
                        }`}
                      >
                        {finding.id}
                      </span>
                    </div>
                    <div className="col-span-4 flex flex-col min-w-0">
                      <span className="font-semibold text-white truncate">{finding.title}</span>
                      <span className="text-zinc-400 text-[11px] truncate">{finding.layer}</span>
                    </div>
                    <div className="col-span-3 flex flex-col min-w-0 font-mono">
                      <span className="text-zinc-200 truncate">{finding.targetScope}</span>
                      <span className="text-zinc-500 text-[11px] truncate">{finding.targetSub}</span>
                    </div>
                    <div className="col-span-2 flex flex-col items-end gap-0.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                          finding.evidence === "CONFIRMED"
                            ? "text-teal-300 bg-teal-500/10 border-teal-500/20"
                            : "text-amber-300 bg-amber-500/10 border-dashed border-amber-500/30"
                        }`}
                      >
                        {finding.evidence}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">{finding.evidenceType}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-zinc-900/90 px-4 py-2.5 flex items-center justify-between text-zinc-400 font-mono text-xs border-t border-zinc-800">
              <span>
                {filteredFindings.length} of {FORENSIC_FINDINGS_REGISTRY.length} findings evaluated · Rule Engine &amp; ML OK
              </span>
              <div className="flex items-center gap-4">
                <span>
                  Sort: <strong className="text-zinc-200">Severity (Desc)</strong>
                </span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Forensic Inspector Drawer */}
          {inspectorOpen && activeFinding ? (
            <div className="xl:col-span-5 bg-[#111317] rounded-lg border border-zinc-800/90 flex flex-col p-5 gap-4 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold text-white ${
                        activeFinding.severity === "CRITICAL"
                          ? "bg-rose-500"
                          : activeFinding.severity === "HIGH"
                          ? "bg-amber-600"
                          : activeFinding.severity === "MEDIUM"
                          ? "bg-sky-600"
                          : "bg-zinc-700"
                      }`}
                    >
                      {activeFinding.severity}
                    </span>
                    <span className="font-mono text-xs text-teal-400 font-bold">{activeFinding.id}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border ${
                        activeFinding.evidence === "CONFIRMED"
                          ? "text-teal-300 bg-teal-500/10 border-teal-500/20"
                          : "text-amber-300 bg-amber-500/10 border-dashed border-amber-500/30"
                      }`}
                    >
                      {activeFinding.evidence === "CONFIRMED" ? "CONFIRMED Protocol Fact" : "INFERRED ML Anomaly"}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white tracking-tight mt-1">{activeFinding.title}</h2>
                </div>
                <button
                  className="text-zinc-400 hover:text-white p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                  title="Close details"
                  type="button"
                  onClick={() => setInspectorOpen(false)}
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs bg-zinc-900/60 p-3 rounded border border-zinc-800/70">
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-500 uppercase text-[10px] block">Protocol Stage</span>
                  <span className="text-zinc-200 font-medium">{activeFinding.protocolStage}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-500 uppercase text-[10px] block">Packet Reference</span>
                  <span className="text-teal-400 font-medium">{activeFinding.packetRef}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-500 uppercase text-[10px] block">Initiator SPI</span>
                  <span className="text-zinc-300">{activeFinding.initiatorSpi}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-500 uppercase text-[10px] block">Selected Transform</span>
                  <span
                    className={`font-medium ${
                      activeFinding.severity === "CRITICAL"
                        ? "text-rose-400"
                        : activeFinding.severity === "HIGH"
                        ? "text-amber-400"
                        : "text-teal-400"
                    }`}
                  >
                    {activeFinding.selectedTransform}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Forensic Hex Dissector ({activeFinding.packetRef.split(" ")[0]})
                  </span>
                  <span className="font-mono text-xs text-teal-400">{activeFinding.hexOffset}</span>
                </div>
                <div className="bg-[#0c0e11] p-3 rounded font-mono text-[11px] leading-relaxed text-zinc-300 select-text border border-zinc-800/80">
                  <div className="text-zinc-500 pb-1 font-semibold flex justify-between border-b border-zinc-800/50 mb-1">
                    <span>INDEX 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</span>
                    <span>ASCII</span>
                  </div>
                  {activeFinding.hexRows.map((hr, idx) => (
                    <div key={idx} className="flex justify-between hover:bg-zinc-800/40 px-1 rounded">
                      <span>
                        <span className="text-zinc-600">{hr.offset}:</span>{" "}
                        {hr.highlight ? (
                          <mark className="bg-teal-500/20 text-teal-300 font-bold px-0.5">{hr.hex}</mark>
                        ) : (
                          hr.hex
                        )}
                      </span>
                      <span className="text-zinc-600">{hr.ascii}</span>
                    </div>
                  ))}
                  <div className="mt-2 text-teal-400 text-[10px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    <span>{activeFinding.hexExplanation}</span>
                  </div>
                </div>
              </div>

              <div
                className={`border p-3 rounded flex flex-col gap-1 ${
                  activeFinding.severity === "CRITICAL"
                    ? "bg-rose-950/20 border-rose-500/30 text-rose-400"
                    : activeFinding.severity === "HIGH"
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-400"
                    : "bg-sky-950/20 border-sky-500/30 text-sky-400"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">gavel</span>
                  <span>{activeFinding.violationStandard}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{activeFinding.violationDetails}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Remediation Stanza (strongSwan ipsec.conf)
                  </span>
                  <button
                    className="text-teal-400 hover:text-teal-300 font-mono text-xs flex items-center gap-1 transition-colors"
                    type="button"
                    onClick={handleCopySnippet}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copyFeedback ? "check" : "content_copy"}
                    </span>
                    <span>{copyFeedback ? "Copied!" : "Copy Snippet"}</span>
                  </button>
                </div>
                <div className="bg-[#0c0e11] p-3 rounded font-mono text-xs text-teal-300 select-text leading-relaxed border border-zinc-800/80 whitespace-pre-wrap">
                  {activeFinding.remediationCode}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2.5 pt-1">
                <button
                  className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2 shadow-md"
                  type="button"
                  onClick={() => {
                    downloadFile(`patch-${activeFinding.id.toLowerCase()}.conf`, activeFinding.remediationCode, "text/plain");
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Download Policy Patch</span>
                </button>
                <button
                  className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded transition-colors"
                  title="Export Forensic Bundle"
                  type="button"
                  onClick={() => {
                    downloadFile(
                      `forensic-${activeFinding.id.toLowerCase()}.json`,
                      JSON.stringify(activeFinding, null, 2)
                    );
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </AppShell>
    </div>
  );
}
