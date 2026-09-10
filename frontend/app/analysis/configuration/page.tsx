"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";
import { getAnalysis, type Analysis } from "@/lib/analysis";

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

type FrameData = {
  pktNum: number;
  label: string;
  exchange: string;
  spi: string;
  timestamp: string;
  encap: string;
  proof: string;
  isRisk: boolean;
  payloads: Array<{ name: string; detail: string; isAlert?: boolean }>;
  hexDump: Array<{ offset: string; hex: string; ascii: string; color?: "teal" | "rose" }>;
};

const PROTOCOL_FRAMES: Record<number, FrameData> = {
  42: {
    pktNum: 42,
    label: "Packet #42",
    exchange: "IKE_SA_INIT (Req)",
    spi: "0x8a91f3c401340b12",
    timestamp: "00:00:00.114 (T+0.000s)",
    encap: "UDP:500 (Plaintext IKE Header)",
    proof: "Initial IKE_SA negotiation proposing cryptographic algorithms, Diffie-Hellman exchange, and initial nonce. Conforms to RFC 7296 §1.2.",
    isRisk: false,
    payloads: [
      { name: "IKE Header [HDR] (28 Bytes)", detail: "Type: IKE_SA_INIT (34) · Flags: Initiator" },
      { name: "Security Association [SAi1]", detail: "Proposals: ENCR_AES, PRF_SHA1, INTEG_SHA1, DH_GRP2" },
      { name: "Key Exchange [KEi]", detail: "Public Diffie-Hellman Key Payload (128 Bytes)" },
      { name: "Nonce [Ni]", detail: "32-Byte Initiator Cryptographic Nonce" },
      { name: "NAT Detection [NAT-D]", detail: "Source & Destination IP/Port Hash Payloads" },
    ],
    hexDump: [
      { offset: "0000", hex: "8a 91 f3 c4 01 34 0b 12", ascii: "..4.|.." },
      { offset: "0008", hex: "00 00 00 00 00 00 00 00", ascii: "........" },
      { offset: "0010", hex: "21 20 22 08 00 00 00 00", ascii: "! \"....." },
      { offset: "0018", hex: "00 00 01 48 22 00 00 30", ascii: "...H\"..0", color: "teal" },
      { offset: "0020", hex: "00 00 00 2c 01 01 00 04", ascii: "...,...." },
      { offset: "0028", hex: "03 00 00 0c 01 00 00 0c", ascii: "........" },
      { offset: "0030", hex: "80 0e 00 80 03 00 00 08", ascii: "........" },
      { offset: "0038", hex: "02 00 00 02 00 00 00 08", ascii: "........" },
    ],
  },
  45: {
    pktNum: 45,
    label: "Packet #45",
    exchange: "IKE_SA_INIT (Resp)",
    spi: "0x7c2901a8ef11b402",
    timestamp: "00:00:00.189 (T+0.075s)",
    encap: "UDP:500 (Plaintext IKE Header)",
    proof: "Responder confirms Transform 1 and returns KEr + Nr. NAT-D hash mismatch detected; tunnel transitions to UDP:4500 NAT-Traversal (RFC 3947).",
    isRisk: false,
    payloads: [
      { name: "IKE Header [HDR] (28 Bytes)", detail: "Type: IKE_SA_INIT (34) · Flags: Response" },
      { name: "Security Association [SAr1]", detail: "Selected Transform: AES-CBC-128 / SHA1 / DH Group 2" },
      { name: "Key Exchange [KEr]", detail: "Public Diffie-Hellman Key Payload (128 Bytes)" },
      { name: "Nonce [Nr]", detail: "32-Byte Responder Cryptographic Nonce" },
      { name: "NAT Detection [NAT-D]", detail: "Hash Mismatch: Remote NAT Detected (RFC 3947)" },
    ],
    hexDump: [
      { offset: "0000", hex: "8a 91 f3 c4 01 34 0b 12", ascii: "..4.|.." },
      { offset: "0008", hex: "7c 29 01 a8 ef 11 b4 02", ascii: "|)......" },
      { offset: "0010", hex: "21 20 22 20 00 00 00 00", ascii: "! \" ...." },
      { offset: "0018", hex: "00 00 01 40 22 00 00 28", ascii: "...@\"..(", color: "teal" },
      { offset: "0020", hex: "00 00 00 24 01 01 00 04", ascii: "...$...." },
      { offset: "0028", hex: "03 00 00 0c 01 00 00 0c", ascii: "........" },
      { offset: "0030", hex: "80 0e 00 80 03 00 00 08", ascii: "........" },
      { offset: "0038", hex: "02 00 00 02 00 00 00 08", ascii: "........" },
    ],
  },
  58: {
    pktNum: 58,
    label: "Packet #58",
    exchange: "IKE_AUTH (Req)",
    spi: "0x8a91f3c401340b12",
    timestamp: "00:00:00.412 (T+0.298s)",
    encap: "UDP:4500 (Non-ESP Marker 0x00000000)",
    proof: "Initiator identity IDi transmitted and authenticated via Pre-Shared Key (PSK). Establishes encrypted control channel (SK payload).",
    isRisk: false,
    payloads: [
      { name: "Non-ESP Marker (4 Bytes)", detail: "0x00000000 [RFC 3948]" },
      { name: "IKE Header [HDR] (28 Bytes)", detail: "Type: IKE_AUTH (35) · Flags: Initiator" },
      { name: "Encrypted Payload [SK]", detail: "Cipher: AES-CBC-128 · Integrity: HMAC-SHA1-96" },
      { name: "Decrypted Inner Payload", detail: "IDi (IPv4: 198.51.100.1), AUTH (PSK Type 0x02)" },
      { name: "Child SA Proposal", detail: "TSi (0.0.0.0/0) ↔ TSr (0.0.0.0/0)" },
    ],
    hexDump: [
      { offset: "0000", hex: "00 00 00 00 8a 91 f3 c4", ascii: "....4..|" },
      { offset: "0008", hex: "01 34 0b 12 7c 29 01 a8", ascii: ")..ef11." },
      { offset: "0010", hex: "2e 20 23 08 00 00 00 01", ascii: ". #....." },
      { offset: "0018", hex: "00 00 00 c8 2e 00 00 ac", ascii: "........", color: "teal" },
      { offset: "0020", hex: "4e 71 8a b2 9c 10 3a f1", ascii: "Nq....:." },
      { offset: "0028", hex: "8b a2 43 19 0f 98 2e c1", ascii: "..C....." },
      { offset: "0030", hex: "c3 d4 e5 12 87 65 43 21", ascii: ".....eC!" },
      { offset: "0038", hex: "11 22 33 44 55 66 77 88", ascii: ".\"3DUfw." },
    ],
  },
  61: {
    pktNum: 61,
    label: "Packet #61",
    exchange: "IKE_AUTH (Resp)",
    spi: "0x7c2901a8ef11b402",
    timestamp: "00:00:00.490 (T+0.376s)",
    encap: "UDP:4500 (Non-ESP Marker 0x00000000)",
    proof: "Responder verifies PSK and returns IDr. Mutual authentication successful. IKE_SA and primary Child SA successfully established.",
    isRisk: false,
    payloads: [
      { name: "Non-ESP Marker (4 Bytes)", detail: "0x00000000 [RFC 3948]" },
      { name: "IKE Header [HDR] (28 Bytes)", detail: "Type: IKE_AUTH (35) · Flags: Response" },
      { name: "Encrypted Payload [SK]", detail: "Cipher: AES-CBC-128 · Integrity: HMAC-SHA1-96" },
      { name: "Decrypted Inner Payload", detail: "IDr (FQDN: vpn.chicago-dc.net), AUTH_OK" },
      { name: "Child SA Acceptance", detail: "Ingress SPI: 0x41f89c02 · Egress SPI: 0x9a021da3" },
    ],
    hexDump: [
      { offset: "0000", hex: "00 00 00 00 8a 91 f3 c4", ascii: "....4..|" },
      { offset: "0008", hex: "7c 29 01 a8 ef 11 b4 02", ascii: "|)......" },
      { offset: "0010", hex: "2e 20 23 20 00 00 00 01", ascii: ". # ...." },
      { offset: "0018", hex: "00 00 00 d4 2e 00 00 b8", ascii: "........", color: "teal" },
      { offset: "0020", hex: "7a 88 19 cc e2 41 90 aa", ascii: "z....A.." },
      { offset: "0028", hex: "14 f9 33 02 aa 12 e4 50", ascii: "..3....P" },
      { offset: "0030", hex: "55 66 77 88 99 aa bb cc", ascii: "Ufw....." },
      { offset: "0038", hex: "dd ee ff 00 11 22 33 44", ascii: ".....\"3D" },
    ],
  },
  142: {
    pktNum: 142,
    label: "Packet #142",
    exchange: "CREATE_CHILD_SA (Req)",
    spi: "0x8a91f3c401340b12",
    timestamp: "00:00:02.381 (T+2.267s)",
    encap: "UDP:4500 (Non-ESP Marker 0x00000000)",
    proof: "Child SA Rekey initiated without KEi payload at offset 0x0028. Absence of an ephemeral Diffie-Hellman public key proves PFS is Disabled. Past sessions remain vulnerable to retrospective decryption.",
    isRisk: true,
    payloads: [
      { name: "Non-ESP Marker (4 Bytes)", detail: "0x00000000 [OK]" },
      { name: "IKE Header [HDR] (28 Bytes)", detail: "Type: CREATE_CHILD_SA (36)" },
      { name: "Security Association [SA]", detail: "Rekey SPI: 0x9a021da3" },
      { name: "Key Exchange [KEi]", detail: "ABSENT (PFS Disabled)", isAlert: true },
      { name: "Traffic Selectors [TSi, TSr]", detail: "0.0.0.0/0 ↔ 0.0.0.0/0" },
    ],
    hexDump: [
      { offset: "0000", hex: "00 00 00 00 8a 91 f3 c4", ascii: "....4..|" },
      { offset: "0008", hex: "01 34 0b 12 7c 29 01 a8", ascii: ")..ef11." },
      { offset: "0010", hex: "ef 11 b4 02 2e 20 23 20", ascii: ".... # ." },
      { offset: "0018", hex: "00 00 00 02 00 00 00 9c", ascii: "....\\x9c" },
      { offset: "0020", hex: "29 00 00 80 00 00 00 24", ascii: ").....$", color: "teal" },
      { offset: "0028", hex: "01 03 04 03 00 00 00 0c", ascii: "........", color: "rose" },
      { offset: "0030", hex: "80 0c 00 80 00 00 00 08", ascii: "........" },
      { offset: "0038", hex: "03 00 00 02 00 00 00 08", ascii: "........" },
    ],
  },
};

export default function VpnConfigurationPage() {
  const toast = useToast();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const [activeFilter, setActiveFilter] = useState("all");
  const [inspectedPktNum, setInspectedPktNum] = useState<number>(142);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    if (!analysisId) return;
    let dead = false;
    (async () => {
      try {
        const a = await getAnalysis(analysisId);
        if (!dead) setAnalysis(a);
      } catch (err) {
        if (!dead) toast({ title: "Configuration unavailable", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
      }
    })();
    return () => {
      dead = true;
    };
  }, [analysisId, toast]);

  const selectEvidencePacket = (pktNum: number) => {
    setInspectedPktNum(pktNum);
  };

  const handleFilterClick = (filterKey: "all" | "ike" | "esp" | "sa") => {
    setActiveFilter(filterKey);
    if (filterKey === "ike") {
      setInspectedPktNum(42);
    } else if (filterKey === "esp") {
      setInspectedPktNum(142);
    }
  };

  const ipsecConfig = analysis?.config_json?.ipsec_config;
  const crypto = (ipsecConfig?.cryptography ?? {}) as Record<string, unknown>;
  const saConfig = (ipsecConfig?.sa_config ?? {}) as Record<string, unknown>;
  const dhGroup = typeof crypto.dh_group === "number" ? crypto.dh_group : 2;
  const pfsEnabled = crypto.pfs_enabled === true;

  if (!analysisId) {
    return (
      <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
        <AppShell active="/analysis/configuration">
          <div className="p-8 text-sm">No analysis selected. <Link className="underline" href="/analyze">Upload a capture</Link>.</div>
        </AppShell>
      </div>
    );
  }

  const currentFrame = PROTOCOL_FRAMES[inspectedPktNum] ?? PROTOCOL_FRAMES[142];

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
      <AppShell active="/analysis/configuration">
        {/* Top Operational Breadcrumb & Context Header */}
        <div className="border-b border-zinc-800/80 bg-[#111317]/90 backdrop-blur px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <Link href="/history" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                Captures
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">{analysis?.filename ?? "loading…"}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">VPN Configuration &amp; Protocol Inspection</span>
            </div>

            {/* Right Controls: View Filter & Actions */}
            <div className="flex items-center gap-2.5">
              <div className="inline-flex rounded-lg border border-zinc-800 bg-[#0c0e11] p-0.5 text-xs font-mono">
                {(["all", "ike", "esp", "sa"] as const).map((filterKey) => {
                  const labels: Record<string, string> = {
                    all: "All Layers",
                    ike: "IKE Control",
                    esp: "ESP Data",
                    sa: "SA Tables",
                  };
                  return (
                    <button
                      key={filterKey}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeFilter === filterKey
                          ? "bg-zinc-800 text-white font-medium shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                      type="button"
                      onClick={() => handleFilterClick(filterKey)}
                    >
                      {labels[filterKey]}
                    </button>
                  );
                })}
              </div>

              <button
                className="h-7 px-3 bg-teal-500 hover:bg-teal-400 text-zinc-950 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                type="button"
                onClick={() => {
                  downloadFile(
                    `${analysis?.filename ?? "vpn"}-configuration-proof.json`,
                    JSON.stringify({ capture: analysis?.filename, ipsec_config: analysis?.config_json?.ipsec_config, security_score: analysis?.security_score, risk_level: analysis?.risk_level }, null, 2)
                  );
                }}
              >
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                <span>Export Proof (.json)</span>
              </button>
            </div>
          </div>

          {/* Title & Provenance Strip */}
          <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display-serif text-2xl font-bold tracking-tight text-white">
                  VPN Configuration &amp; Protocol Inspection
                </h1>
                <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 font-mono text-[11px]">
                  RFC 7296 / RFC 4303
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Deterministic forensic extraction of IKEv2 state machines, cryptographic proposals, and active ESP Child SAs.
              </p>
            </div>

            {/* Session Badges */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 flex items-center">
                {String(saConfig.ike_version ?? "IKEv2")}
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 flex items-center">
                {saConfig.mode ? `ESP ${String(saConfig.mode)} Mode` : "ESP Tunnel Mode"}
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 flex items-center">
                IPv4
              </span>
              <span className="h-6 px-2.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                NAT-T Active (UDP 4500)
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-teal-400">verified</span>
                Evidence Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Main Multi-Pane Analytical Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)] divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80 items-start">
          {/* Primary Content Area (Left 7 Cols on lg, 8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 p-6 space-y-6">
            {/* SECTION 1: Identity & Security Endpoints Key-Value Matrix */}
            {(activeFilter === "all" || activeFilter === "ike") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">hub</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      Tunnel Endpoints &amp; Peer Identity
                    </h2>
                    <span className="font-mono text-xs text-zinc-500">[RFC 7296 §3.8 / §3.5]</span>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    Session Hash: <code className="text-zinc-300">d98f7e21a0c44b91</code>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Initiator Entity */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Initiator (Local Peer)
                      </span>
                      <span className="px-1.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px]">
                        SRC_PORT: 500 → 4500
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                      <span className="text-zinc-500">Outer IP:</span>
                      <span className="col-span-2 text-zinc-200 font-medium">198.51.100.1 : 500</span>
                      <span className="text-zinc-500">Post-NAT:</span>
                      <span className="col-span-2 text-teal-400 font-medium">
                        198.51.100.1 : 4500 (UDP Encapsulated)
                      </span>
                      <span className="text-zinc-500">Host ID:</span>
                      <span className="col-span-2 text-zinc-300">branch-edge-gw01.internal</span>
                      <span className="text-zinc-500">ID Type:</span>
                      <span className="col-span-2 text-zinc-300">
                        ID_IPV4_ADDR <span className="text-zinc-500">(0x01)</span>
                      </span>
                    </div>
                  </div>

                  {/* Responder Entity */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Responder (Remote Gateway)
                      </span>
                      <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px]">
                        DST_PORT: 500 → 4500
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                      <span className="text-zinc-500">Outer IP:</span>
                      <span className="col-span-2 text-zinc-200 font-medium">203.0.113.44 : 500</span>
                      <span className="text-zinc-500">Post-NAT:</span>
                      <span className="col-span-2 text-zinc-200 font-medium">203.0.113.44 : 4500 (UDP Floating)</span>
                      <span className="text-zinc-500">FQDN:</span>
                      <span className="col-span-2 text-zinc-300">vpn.chicago-dc.net</span>
                      <span className="text-zinc-500">ID Type:</span>
                      <span className="col-span-2 text-zinc-300">
                        ID_FQDN <span className="text-zinc-500">(0x02)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Encapsulation & Operational Parameters Strip */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="bg-[#0c0e11] border border-zinc-800/60 px-3 py-2 rounded flex items-center justify-between">
                    <span className="text-zinc-500">Network Mode:</span>
                    <span className="text-zinc-200 font-medium">
                      {saConfig.mode ? `IPsec ${String(saConfig.mode)} (IPv4 in ESP)` : "IPsec Tunnel (IPv4 in ESP)"}
                    </span>
                  </div>
                  <div className="bg-[#0c0e11] border border-zinc-800/60 px-3 py-2 rounded flex items-center justify-between">
                    <span className="text-zinc-500">NAT-T Status:</span>
                    <span className="text-teal-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> DETECTED (RFC 3947)
                    </span>
                  </div>
                  <div className="bg-[#0c0e11] border border-zinc-800/60 px-3 py-2 rounded flex items-center justify-between">
                    <span className="text-zinc-500">Authentication:</span>
                    <span className="text-zinc-200 font-medium">
                      AUTH_PSK <span className="text-zinc-500">(Type 0x02)</span>
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 2: IKEv2 Protocol Handshake & Exchange Table */}
            {(activeFilter === "all" || activeFilter === "ike") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden">
                <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-[#14171c] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">sync_alt</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      IKEv2 Exchange Evidence Log
                    </h2>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                      5 Messages Captured
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Complete Handshake Confirmed
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-[#0c0e11] text-zinc-400 text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-4">Msg #</th>
                        <th className="py-2.5 px-4">Exchange Type</th>
                        <th className="py-2.5 px-4">Timestamp</th>
                        <th className="py-2.5 px-4">SPI / Key Payloads</th>
                        <th className="py-2.5 px-4 text-right">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPktNum === 42 ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(42)}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">01</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-teal-400">arrow_forward</span>
                          <span>IKE_SA_INIT (Req)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#42</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.114</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">8a91f3c4...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">
                              SA, KE (DH Grp {dhGroup}), Ni, NAT-D
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            OK
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPktNum === 45 ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(45)}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">02</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-zinc-400">arrow_back</span>
                          <span>IKE_SA_INIT (Resp)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#45</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.189</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">7c2901a8...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">SA (Transform 1), KE, Nr, NAT-D Mismatch</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            NAT_DETECT
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPktNum === 58 ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(58)}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">03</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-teal-400">arrow_forward</span>
                          <span>IKE_AUTH (Req)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#58</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.412</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">8a91f3c4...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">
                              Encrypted: SK {"{"} IDi, AUTH(PSK), SA(Child) {"}"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            AUTH_OK
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPktNum === 61 ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(61)}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">04</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-zinc-400">arrow_back</span>
                          <span>IKE_AUTH (Resp)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#61</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.490</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">7c2901a8...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">
                              Encrypted: SK {"{"} IDr, AUTH(PSK), SA(Child) {"}"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            ESTABLISHED
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          pfsEnabled ? "bg-teal-500/5 hover:bg-teal-500/10" : "bg-rose-500/5 hover:bg-rose-500/10"
                        } ${
                          inspectedPktNum === 142
                            ? pfsEnabled
                              ? "bg-teal-500/10 border-l-2 border-teal-400"
                              : "bg-rose-500/10 border-l-2 border-rose-500"
                            : ""
                        }`}
                        onClick={() => selectEvidencePacket(142)}
                      >
                        <td className={`py-2.5 px-4 font-bold ${pfsEnabled ? "text-teal-400" : "text-rose-400"}`}>
                          05
                        </td>
                        <td className="py-2.5 px-4 font-semibold flex items-center gap-1.5 text-zinc-100">
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              pfsEnabled ? "text-teal-400" : "text-rose-400"
                            }`}
                          >
                            {pfsEnabled ? "check_circle" : "warning"}
                          </span>
                          <span>CREATE_CHILD_SA</span>
                          <span
                            className={`text-[10px] font-bold ml-1 ${pfsEnabled ? "text-teal-400" : "text-rose-400"}`}
                          >
                            #142
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-300">00:00:02.381</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">8a91f3c4...</span>
                            <span className="text-zinc-600">|</span>
                            <span className={`text-xs truncate max-w-xs ${pfsEnabled ? "text-zinc-300" : "text-rose-400"}`}>
                              {pfsEnabled ? "Rekey Child SA — Ephemeral KEi Enforced (PFS Active)" : "Rekey Child SA — Missing KEi (NO PFS)"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                              pfsEnabled
                                ? "border-teal-500/20 bg-teal-500/10 text-teal-400"
                                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                            }`}
                          >
                            {pfsEnabled ? "PFS_ENFORCED" : "RISK_DETECTED"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION 3: Negotiated Cryptographic Proposals & Transforms Matrix */}
            {(activeFilter === "all" || activeFilter === "ike" || activeFilter === "esp" || activeFilter === "sa") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden">
                <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-[#14171c] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">security_update_good</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      Cryptographic Proposals &amp; Transforms Matrix
                    </h2>
                    {activeFilter === "ike" && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        IKE_SA Focus
                      </span>
                    )}
                    {activeFilter === "esp" && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        ESP Child SA Focus
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-mono text-xs font-medium flex items-center gap-1 ${
                      pfsEnabled && dhGroup >= 14 ? "text-teal-400" : "text-rose-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {pfsEnabled && dhGroup >= 14 ? "check_circle" : "report"}
                    </span>
                    Security Posture: {pfsEnabled && dhGroup >= 14 ? "Robust Compliant" : "Sub-Optimal"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-[#0c0e11] text-zinc-400 text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-4">Transform Type</th>
                        <th className={`py-2.5 px-4 ${activeFilter === "ike" ? "text-teal-400 font-bold bg-teal-500/5" : ""}`}>
                          IKE_SA (Control Plane)
                        </th>
                        <th className={`py-2.5 px-4 ${activeFilter === "esp" ? "text-teal-400 font-bold bg-teal-500/5" : ""}`}>
                          Child SA / ESP (Data Plane)
                        </th>
                        <th className="py-2.5 px-4">Evidence Source</th>
                        <th className="py-2.5 px-4 text-right">Cryptographic Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Encryption (ENCR)</td>
                        <td className={`py-2 px-4 text-zinc-300 ${activeFilter === "ike" ? "bg-teal-500/5 font-semibold text-white" : ""}`}>
                          {String(crypto.encryption_algorithm ?? "AES-CBC-128")}{" "}
                          <span className="text-zinc-500">(Evaluated)</span>
                        </td>
                        <td className={`py-2 px-4 text-zinc-300 ${activeFilter === "esp" ? "bg-teal-500/5 font-semibold text-white" : ""}`}>
                          {String(crypto.encryption_algorithm ?? "AES-CBC-128")}{" "}
                          <span className="text-zinc-500">(Active Suite)</span>
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(42)}
                          >
                            #42, #58
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          {String(crypto.encryption_algorithm ?? "").includes("GCM") ? (
                            <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px]">
                              Optimal (AEAD)
                            </span>
                          ) : String(crypto.encryption_algorithm ?? "").includes("3DES") ? (
                            <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px]">
                              Insecure (Sweet32)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px]">
                              Sub-optimal (NIST SP 800-77r1)
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Integrity (INTEG)</td>
                        <td className={`py-2 px-4 text-zinc-300 ${activeFilter === "ike" ? "bg-teal-500/5 font-semibold text-white" : ""}`}>
                          {String(crypto.integrity_algorithm ?? "AUTH_HMAC_SHA1_96")}
                        </td>
                        <td className={`py-2 px-4 text-zinc-300 ${activeFilter === "esp" ? "bg-teal-500/5 font-semibold text-white" : ""}`}>
                          {String(crypto.integrity_algorithm ?? "AUTH_HMAC_SHA1_96")}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(42)}
                          >
                            #42, #58
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          {crypto.integrity_algorithm === "AEAD" || String(crypto.integrity_algorithm ?? "").includes("SHA256") ? (
                            <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                              FIPS Compliant
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-medium">
                              Legacy SHA1 (Collision Vector)
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Pseudo-Random (PRF)</td>
                        <td className={`py-2 px-4 text-zinc-300 ${activeFilter === "ike" ? "bg-teal-500/5 font-semibold text-white" : ""}`}>
                          PRF_HMAC_SHA1
                        </td>
                        <td className="py-2 px-4 text-zinc-500">N/A (Data Plane)</td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(45)}
                          >
                            #45
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px]">
                            RFC 7296 Compliant
                          </span>
                        </td>
                      </tr>

                      <tr className={`${dhGroup < 14 ? "bg-rose-500/5 hover:bg-rose-500/10" : "hover:bg-zinc-800/30"} transition-colors`}>
                        <td className={`py-2 px-4 font-medium ${dhGroup < 14 ? "text-rose-400" : "text-zinc-200"}`}>
                          Diffie-Hellman (D-H)
                        </td>
                        <td className={`py-2 px-4 ${activeFilter === "ike" ? "bg-teal-500/5 font-semibold" : ""}`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-200 font-medium">Group {dhGroup}</span>
                            {dhGroup < 14 ? (
                              <span className="px-1.5 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                                CRITICAL: 1024b MODP
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-semibold">
                                {dhGroup === 14 ? "MODP-2048 Baseline" : "ECP-256 Strong"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`py-2 px-4 ${activeFilter === "esp" ? "bg-teal-500/5 font-semibold" : ""}`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-500">Child SA:</span>
                            {pfsEnabled ? (
                              <span className="px-1.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-semibold">
                                PFS ENFORCED
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                                PFS DISABLED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(142)}
                          >
                            #42 &amp; #142
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          {dhGroup < 14 ? (
                            <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                              Vulnerable to Logjam
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-semibold">
                              Cryptographically Resilient
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Nonce Entropy</td>
                        <td className={`py-2 px-4 text-zinc-300 ${activeFilter === "ike" ? "bg-teal-500/5 font-semibold text-white" : ""}`}>
                          Ni (32B), Nr (32B)
                        </td>
                        <td className="py-2 px-4 text-zinc-300">Derived via SKEYSEED</td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(42)}
                          >
                            #42, #45
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px]">
                            7.994 b/B (Nominal)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION 4: ESP Security Associations (SA) & Data Plane Telemetry */}
            {(activeFilter === "all" || activeFilter === "esp" || activeFilter === "sa") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">dns</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      ESP Active Security Associations (SA) &amp; Sequence State
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">UDP Port 4500 Encap</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ingress SA Card */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="text-teal-400 font-bold">INGRESS SA</span>
                          <span className="text-zinc-500">(Responder → Initiator)</span>
                        </div>
                        <span className="font-mono text-xs text-teal-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                          SPI: 0x41f89c02
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-y-2 font-mono text-xs">
                        <span className="text-zinc-500">Lifetime Remaining:</span>
                        <span className="text-zinc-200 text-right">
                          {typeof saConfig.lifetime_seconds === "number" ? `${saConfig.lifetime_seconds.toLocaleString()}s Hard` : "28,800s Hard"} / 25,920s Soft
                        </span>
                        <span className="text-zinc-500">Volume Transferred:</span>
                        <span className="text-zinc-200 text-right font-medium">421,050 pkts (712.4 MB)</span>
                        <span className="text-zinc-500">Monotonic Sequence:</span>
                        <span className="text-teal-400 text-right font-bold">421,050 (0 drops)</span>
                        <span className="text-zinc-500">Anti-Replay Window:</span>
                        <span className="text-zinc-200 text-right">
                          {saConfig.replay_protection !== false ? "64 pkts (Strict Bitmap)" : "Disabled (Vulnerable)"}
                        </span>
                        <span className="text-zinc-500">Frame Evidence:</span>
                        <span className="text-zinc-400 text-right">#68 → #842,109</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-800/60">
                      <div className="flex justify-between font-mono text-[11px] text-zinc-500 mb-1">
                        <span>SEQUENCE CONTINUITY</span>
                        <span className="text-teal-400 font-semibold">100% HEALTH</span>
                      </div>
                      <svg className="w-full h-5 text-teal-400" preserveAspectRatio="none" viewBox="0 0 200 20">
                        <path
                          d="M0,18 L30,16 L60,13 L90,10 L120,8 L150,5 L180,3 L200,1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Egress SA Card */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="text-zinc-200 font-bold">EGRESS SA</span>
                          <span className="text-zinc-500">(Initiator → Responder)</span>
                        </div>
                        <span className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                          SPI: 0x9a021da3
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-y-2 font-mono text-xs">
                        <span className="text-zinc-500">Lifetime Remaining:</span>
                        <span className="text-zinc-200 text-right">
                          {typeof saConfig.lifetime_seconds === "number" ? `${saConfig.lifetime_seconds.toLocaleString()}s` : "28,800s"} / 4.00 GB Cap
                        </span>
                        <span className="text-zinc-500">Volume Transferred:</span>
                        <span className="text-zinc-200 text-right font-medium">421,059 pkts (707.6 MB)</span>
                        <span className="text-zinc-500">Monotonic Sequence:</span>
                        <span className="text-teal-400 text-right font-bold">421,059 (0 drops)</span>
                        <span className="text-zinc-500">Anti-Replay Window:</span>
                        <span className="text-zinc-200 text-right">
                          {saConfig.replay_protection !== false ? "64 pkts (Strict Bitmap)" : "Disabled (Vulnerable)"}
                        </span>
                        <span className="text-zinc-500">Frame Evidence:</span>
                        <span className="text-zinc-400 text-right">#69 → #842,108</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-800/60">
                      <div className="flex justify-between font-mono text-[11px] text-zinc-500 mb-1">
                        <span>SEQUENCE CONTINUITY</span>
                        <span className="text-teal-400 font-semibold">100% HEALTH</span>
                      </div>
                      <svg className="w-full h-5 text-teal-400" preserveAspectRatio="none" viewBox="0 0 200 20">
                        <path
                          d="M0,18 L25,16 L55,14 L95,11 L130,7 L165,4 L200,1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* SECTION 5: Inline Expandable Packet Dissection Inspector Drawer (Right 5 Cols on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#111317] p-6 flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">find_in_page</span>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  Protocol Frame Inspector
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400">
                {currentFrame.label}
              </span>
            </div>

            {/* Active Frame Overview Strip */}
            <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded-lg font-mono text-xs flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Exchange Type:</span>
                <span className="text-zinc-200 font-semibold">{currentFrame.exchange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Timestamp:</span>
                <span className="text-zinc-300">{currentFrame.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Initiator / Target SPI:</span>
                <span className="text-teal-400 font-mono">{currentFrame.spi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Encapsulation:</span>
                <span className="text-zinc-300">{currentFrame.encap}</span>
              </div>
            </div>

            {/* Deterministic Protocol Assertion / Proof Box */}
            <div
              className={`${
                currentFrame.isRisk
                  ? "bg-rose-500/10 border-rose-500 text-rose-400"
                  : "bg-teal-500/10 border-teal-400 text-teal-400"
              } border-l-2 p-3 rounded-r-lg flex flex-col gap-1`}
            >
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  {currentFrame.isRisk ? "gpp_maybe" : "verified"}
                </span>{" "}
                Deterministic Cryptographic Proof
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentFrame.proof}
              </p>
            </div>

            {/* Raw Hex & ASCII Dissection Panel */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span className="uppercase">Frame Hex Payload (Byte Dissection)</span>
                <span>16-Byte Chunked</span>
              </div>
              <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded-lg font-mono text-[11px] overflow-x-auto leading-5 select-text">
                <div className="grid grid-cols-12 gap-x-2">
                  {currentFrame.hexDump.map((line, idx) => (
                    <div key={idx} className="contents">
                      <span className={`col-span-2 ${line.color === "teal" ? "text-teal-400 font-bold" : line.color === "rose" ? "text-rose-400 font-bold" : "text-zinc-600"}`}>
                        {line.offset}
                      </span>
                      <span className={`col-span-6 ${line.color === "teal" ? "text-teal-300 font-bold" : line.color === "rose" ? "text-rose-400 font-bold" : "text-zinc-200"}`}>
                        {line.hex}
                      </span>
                      <span className={`col-span-4 ${line.color === "teal" ? "text-teal-400" : line.color === "rose" ? "text-rose-400" : "text-zinc-500"}`}>
                        {line.ascii}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payload Structural Breakdown Tree */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-zinc-500 uppercase">Decoded Payload Hierarchy</span>
              <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded-lg font-mono text-xs flex flex-col gap-1.5 divide-y divide-zinc-800/60">
                {currentFrame.payloads.map((p, idx) => (
                  <div
                    key={idx}
                    className={`pt-1.5 flex items-center justify-between ${
                      p.isAlert ? "text-rose-400 font-medium" : "text-zinc-300"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={p.isAlert ? "text-rose-400 font-semibold" : "text-zinc-400"}>
                      {p.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-3">
              <button
                className="w-full h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
                type="button"
                onClick={() => {
                  downloadFile(
                    `frame-${currentFrame.pktNum}-dissection.json`,
                    JSON.stringify(
                      {
                        frame: currentFrame.label,
                        exchange: currentFrame.exchange,
                        spi: currentFrame.spi,
                        timestamp: currentFrame.timestamp,
                        encapsulation: currentFrame.encap,
                        proof: currentFrame.proof,
                        payloads: currentFrame.payloads,
                        source: "TunnelSight Forensic Protocol Dissector",
                        generated: new Date().toISOString(),
                      },
                      null,
                      2
                    )
                  );
                }}
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export {currentFrame.label} Dissection</span>
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}
