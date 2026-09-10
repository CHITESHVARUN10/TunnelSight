"use client";

import { useEffect, useState } from "react";

import {
  DOC_ACTIVE,
  DOC_IDLE,
  DocChip,
  DocLabel,
  DocPanel,
  DocWell,
} from "@/components/docs/DocChrome";

interface PipelineStage {
  passNumber: number;
  title: string;
  workerCore: string;
  byteOffset: string;
  action: string;
  securityVerdict: "CONFORMANT" | "AUDITED" | "SYNTHESIZED" | "EXTRACTED";
  hexSample: string;
  explanation: string;
  inspectedFields: { label: string; value: string; highlight?: boolean }[];
}

const STAGES: PipelineStage[] = [
  {
    passNumber: 1,
    title: "PCAP Magic Framing & Timestamps",
    workerCore: "DPDK Core #0",
    byteOffset: "0x0000 - 0x0018",
    action: "Verifying pcap/pcapng header magic bytes (0xa1b2c3d4 / 0x0a0d0d0a), nanosecond timestamp precision, and snapshot length.",
    securityVerdict: "AUDITED",
    hexSample: "a1 b2 c3 d4 00 02 00 04 00 00 00 00 00 00 00 00 00 04 00 00 00 00 00 01",
    explanation: "Ensures capture file integrity and establishes microsecond clock synchronization across bidirectional tap interfaces.",
    inspectedFields: [
      { label: "Magic Bytes", value: "0xa1b2c3d4 (Native PCAP)", highlight: true },
      { label: "Snaplen", value: "262,144 bytes" },
      { label: "Link Type", value: "LINKTYPE_ETHERNET (1)" },
    ],
  },
  {
    passNumber: 2,
    title: "Ethernet & IP Protocol Discriminator",
    workerCore: "DPDK Core #0",
    byteOffset: "0x0000 - 0x0022",
    action: "Stripping IEEE 802.3 MAC addresses (14B), checking EtherType 0x0800 (IPv4), and validating IPv4 header checksum.",
    securityVerdict: "AUDITED",
    hexSample: "52 54 00 12 34 56 52 54 00 78 9a bc 08 00 45 00 01 f4 a9 4b 40 00 40 11",
    explanation: "Confirms IP encapsulation layer and filters out unrelated multicast or ARP network traffic.",
    inspectedFields: [
      { label: "EtherType", value: "0x0800 (IPv4)" },
      { label: "IP Protocol", value: "17 (UDP)", highlight: true },
      { label: "TTL / Checksum", value: "64 / 0x4f12 (Valid)" },
    ],
  },
  {
    passNumber: 3,
    title: "UDP Transport & NAT-Traversal Framing",
    workerCore: "DPDK Core #1",
    byteOffset: "0x0022 - 0x002e",
    action: "Checking UDP ports 500 (standard IKE) or 4500 (NAT-Traversal encapsulation with Non-ESP marker).",
    securityVerdict: "EXTRACTED",
    hexSample: "01 f4 01 f4 01 e0 00 00 00 00 00 00 4f 9a 21 8b c9 3a e2 10 00 00 00 00",
    explanation: "Detects whether an intermediate NAT appliance modified outer port addressing and verifies 4-byte Non-ESP zero marker.",
    inspectedFields: [
      { label: "Source Port", value: "500 (IKE)", highlight: true },
      { label: "Dest Port", value: "500 (IKE)", highlight: true },
      { label: "NAT-T Marker", value: "0x00000000 (Non-ESP Marker)" },
    ],
  },
  {
    passNumber: 4,
    title: "IKEv1 / IKEv2 Protocol Discrimination",
    workerCore: "DPDK Core #1",
    byteOffset: "0x002a - 0x0046",
    action: "Extracting Initiator SPI, Responder SPI, Major/Minor Version nibbles, and Exchange Type from the 28-byte IKE header.",
    securityVerdict: "EXTRACTED",
    hexSample: "4f 9a 21 8b c9 3a e2 10 00 00 00 00 00 00 00 00 21 20 22 08 00 00 00 00",
    explanation: "Discriminates between legacy IKEv1 (Major 1) and modern IKEv2 (Major 2). Identifies exchange as IKE_SA_INIT (Type 34).",
    inspectedFields: [
      { label: "Initiator SPI", value: "0x4f9a218bc93ae210", highlight: true },
      { label: "Version Nibble", value: "0x20 (IKEv2.0)", highlight: true },
      { label: "Exchange Type", value: "34 (IKE_SA_INIT)" },
    ],
  },
  {
    passNumber: 5,
    title: "Security Association (SA) Payload Parse",
    workerCore: "DPDK Core #2",
    byteOffset: "0x0046 - 0x0078",
    action: "Iterating through proposal substructures: Encryption algorithms, PRFs, Integrity checksums, and Diffie-Hellman groups.",
    securityVerdict: "AUDITED",
    hexSample: "22 00 00 34 01 00 00 2c 01 01 00 04 03 00 00 0c 01 00 00 14 80 0e 01 00",
    explanation: "Extracts cipher suites offered by the initiator. Flags deprecated transforms (e.g. 3DES, MD5, or DH Group 2).",
    inspectedFields: [
      { label: "Transform ENCR", value: "AES-GCM-256 (ID: 20, 256-bit)" },
      { label: "Transform PRF", value: "HMAC-SHA384 (ID: 6)" },
      { label: "Transform DH", value: "Group 19 (ECP-256)", highlight: true },
    ],
  },
  {
    passNumber: 6,
    title: "Diffie-Hellman Key Exchange (KE) Verification",
    workerCore: "DPDK Core #2",
    byteOffset: "0x0078 - 0x00c8",
    action: "Parsing KE payload length, DH Group ID, and extracting public key bytes for curve validation.",
    securityVerdict: "CONFORMANT",
    hexSample: "28 00 00 48 00 13 00 00 7a 88 19 b2 cc 45 fe 10 99 a3 00 11 22 33 44 55",
    explanation: "Verifies public coordinate fits NIST P-256 prime modulus and satisfies curve equation y^2 = x^3 - 3x + b.",
    inspectedFields: [
      { label: "DH Group", value: "Group 19 (NIST P-256)", highlight: true },
      { label: "Key Coordinate", value: "64 Bytes (ECP Point)" },
      { label: "Validation", value: "Subgroup Attack Immune" },
    ],
  },
  {
    passNumber: 7,
    title: "Nonce (Ni / Nr) Cryptographic Entropy Check",
    workerCore: "DPDK Core #3",
    byteOffset: "0x00c8 - 0x00f0",
    action: "Extracting 32-byte pseudo-random initiator nonce and running Shannon entropy analysis.",
    securityVerdict: "CONFORMANT",
    hexSample: "29 00 00 24 3d 91 aa f2 88 41 bc e7 10 94 65 d3 fa 08 23 71 c8 e4 9b 11",
    explanation: "Guarantees nonce freshness and prevents replay attacks or predictability in SKEYSEED secret generation.",
    inspectedFields: [
      { label: "Nonce Size", value: "32 Bytes (256-bit)" },
      { label: "Entropy Rating", value: "7.989 / 8.000 (Sufficient)", highlight: true },
      { label: "Replay Status", value: "Zero Prior Collision" },
    ],
  },
  {
    passNumber: 8,
    title: "Identity & Certificate Authentication (IKE_AUTH)",
    workerCore: "DPDK Core #3",
    byteOffset: "0x00f0 - 0x0160",
    action: "Inspecting encrypted payload (SK): IDi, IDr, X.509 cert chains, and AUTH signature verification.",
    securityVerdict: "CONFORMANT",
    hexSample: "24 00 00 84 01 00 00 00 30 82 03 41 30 82 02 29 a0 03 02 01 02 02 10 7a",
    explanation: "Validates gateway identity using RSA-PSS or ECDSA certificates against configured trust anchors.",
    inspectedFields: [
      { label: "Auth Method", value: "ECDSA with SHA-384" },
      { label: "Identity IDi", value: "fqdn:gw01.corp.internal", highlight: true },
      { label: "Cert Expiry", value: "Valid (312 Days Remaining)" },
    ],
  },
  {
    passNumber: 9,
    title: "ESP Child SA Negotiation & Traffic Selectors",
    workerCore: "DPDK Core #3",
    byteOffset: "0x0160 - 0x01b0",
    action: "Parsing TSi and TSr (Traffic Selectors) for tunnel routing boundaries and negotiation of inbound/outbound SPIs.",
    securityVerdict: "EXTRACTED",
    hexSample: "2c 00 00 38 01 00 00 00 01 00 00 10 07 00 00 00 0a 64 00 00 0a 64 ff ff",
    explanation: "Calculates IPsec Security Policy Database (SPD) rules: routing 10.100.0.0/16 to 10.200.0.0/16 across ESP.",
    inspectedFields: [
      { label: "Local TS", value: "10.100.0.0/16" },
      { label: "Remote TS", value: "10.200.0.0/16" },
      { label: "ESP Proposal", value: "AES-256-GCM + PFS", highlight: true },
    ],
  },
  {
    passNumber: 10,
    title: "RFC 8247 & NIST SP 800-77 Cryptographic Audit",
    workerCore: "Security Policy Engine",
    byteOffset: "Full Session State",
    action: "Comparing negotiated parameters against NIST SP 800-77 Rev. 1, RFC 8247, and BSI TR-02102 requirements.",
    securityVerdict: "CONFORMANT",
    hexSample: "52 46 43 2d 38 32 34 37 2d 43 4f 4e 46 4f 52 4d 41 4e 43 45 2d 50 41 53",
    explanation: "Flags any algorithms marked MUST NOT (e.g. 3DES, MD5) and verifies that PFS is explicitly enforced on Child SAs.",
    inspectedFields: [
      { label: "RFC 8247 Rating", value: "RECOMMENDED (Pass)", highlight: true },
      { label: "NIST Alignment", value: "SP 800-77 Rev. 1 Valid" },
      { label: "CNSA 1.0 Posture", value: "Compliant (Suite B)" },
    ],
  },
  {
    passNumber: 11,
    title: "Synthesis of Gateway Remediation Patches",
    workerCore: "Engine Synthesis",
    byteOffset: "Configuration Output",
    action: "Compiling verified parameters into drop-in configuration patches for strongSwan (swanctl.conf and ipsec.conf).",
    securityVerdict: "SYNTHESIZED",
    hexSample: "63 6f 6e 6e 65 63 74 69 6f 6e 73 20 7b 20 63 6f 72 70 2d 65 64 67 65 20",
    explanation: "Produces hardened configuration files with broken algorithms removed and correct elliptic curve parameters generated.",
    inspectedFields: [
      { label: "Target Daemons", value: "strongSwan 5.9+, Libreswan" },
      { label: "Output Patches", value: "swanctl.conf / ipsec.conf", highlight: true },
      { label: "Digital Signature", value: "Ed25519 Signed" },
    ],
  },
];

export function DecapsulationPipelineDiagram() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const stage = STAGES[currentStep];

  return (
    <DocPanel className="w-full overflow-hidden font-sans">
      {/* Top Diagram Bar: Controls & Step Track */}
      <div className="p-4 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#d97757]" />
              <span>Illustrative Simulator</span>
              <span>·</span>
              <span className="text-[#f7f4ee]">Packet Anatomy (Not Live Parsing)</span>
            </div>
          <h4 className="text-[#f7f4ee] font-display-serif text-lg font-bold">
            Analysis Pipeline: Upload → Seeded Evidence → ML → Score
          </h4>

          <p className="pt-2 font-mono text-[11px] text-[#8c8a82] leading-relaxed max-w-2xl">
            Illustrative walkthrough — the current backend runs a seeded mock (not DPDK/zero-copy).
            Real stages today: extension + size check → seeded IPsecConfig + 3–8 windows of 18 features →
            RandomForest label + IsolationForest score per window → rule-engine total → typed columns +
            analysis_windows rows.
          </p>
        </div>

        {/* Play / Next / Prev Controls */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              isPlaying
                ? `border ${DOC_ACTIVE}`
                : "bg-white/[0.06] hover:bg-white/[0.12] text-[#f7f4ee] border border-white/[0.15]"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
            <span>{isPlaying ? "Pause Stream" : "Auto Play"}</span>
          </button>

          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#b0aea5] hover:text-[#f7f4ee] border border-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous Stage"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          </button>

          <span className="font-mono text-xs text-[#b0aea5] px-1">
            Pass <strong className="text-[#f7f4ee]">{stage.passNumber}</strong> of {STAGES.length}
          </span>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(STAGES.length - 1, prev + 1))}
            disabled={currentStep === STAGES.length - 1}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#b0aea5] hover:text-[#f7f4ee] border border-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Next Stage"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 11-Pass Scrubber Rail */}
      <div className="grid grid-cols-11 border-b border-white/[0.06] overflow-x-auto">
        {STAGES.map((s, idx) => {
          const isActive = idx === currentStep;
          const isPassed = idx < currentStep;
          return (
            <button
              key={s.passNumber}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className={`p-2.5 text-center transition-all border-r border-white/[0.04] last:border-r-0 relative group min-w-[55px] ${
                isActive
                  ? "bg-white/[0.08] text-[#f7f4ee] font-bold"
                  : isPassed
                  ? "bg-white/[0.01] text-[#b0aea5] hover:text-[#f7f4ee]"
                  : "text-[#6b6963] hover:text-[#b0aea5]"
              }`}
              type="button"
            >
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d97757]" />
              )}
              <div className="font-mono text-[10px] font-bold">
                {String(s.passNumber).padStart(2, "0")}
              </div>
              <div className="text-[9px] truncate max-w-full font-sans opacity-70">
                {s.title.split(" ")[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Body */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stage Details & Inspected Fields */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <DocChip verdict={stage.securityVerdict} />
              <span className="font-mono text-xs text-[#8c8a82]">{stage.workerCore}</span>
              <span className="text-zinc-700">·</span>
              <span className="font-mono text-xs text-[#8c8a82]">{stage.byteOffset}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#f7f4ee] tracking-tight font-display-serif">
            {stage.passNumber}. {stage.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#d8d4c7] leading-relaxed font-sans">
            {stage.action}
          </p>

          <DocWell className="p-3.5 space-y-2">
            <DocLabel className="block font-semibold">
              Engine Decisional Impact
            </DocLabel>
            <p className="text-xs text-[#b0aea5] leading-relaxed font-sans">
              {stage.explanation}
            </p>
          </DocWell>

          {/* Inspected Fields Chips */}
          <div className="space-y-1.5 pt-1">
            <DocLabel className="block">
              Extracted Protocol Attributes:
            </DocLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
              {stage.inspectedFields.map((f, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border ${
                    f.highlight ? DOC_ACTIVE : DOC_IDLE
                  }`}
                >
                  <div className="text-[10px] text-[#8c8a82] uppercase font-sans">{f.label}</div>
                  <div className="text-xs font-semibold truncate mt-0.5">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hex Dump & Packet Anatomy */}
        <div className="lg:col-span-5 space-y-4">
          <DocWell className="p-4 space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8c8a82] uppercase">
              <span>DPDK Zero-Copy Wire Bytes</span>
              <span className="text-[#d8d4c7]">OFFSET {stage.byteOffset}</span>
            </div>

            <pre className="p-3 font-mono text-[11px] text-[#d8d4c7] leading-relaxed overflow-x-auto tracking-wider">
              <code>{stage.hexSample}</code>
            </pre>

            <div className="text-[10px] text-[#8c8a82] font-mono flex items-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#788c5d]" />
              <span>Parsed in 0.002ms via DPDK Ring Buffers</span>
            </div>
          </DocWell>

          {/* Packet Anatomy Stack */}
          <div className="space-y-1.5">
            <DocLabel className="block">
              Packet Decapsulation Anatomy:
            </DocLabel>
            <div className="flex flex-col gap-1 text-[11px] font-mono">
              <div
                className={`px-3 py-1.5 rounded border transition-all ${
                  stage.passNumber <= 2
                    ? "bg-white/[0.08] border-white/30 text-[#f7f4ee] font-semibold"
                    : "bg-white/[0.02] border-white/[0.05] text-[#8c8a82]"
                }`}
              >
                Layer 2/3: Ethernet (14B) + IPv4 (20B)
              </div>
              <div
                className={`px-3 py-1.5 rounded border transition-all ${
                  stage.passNumber === 3
                    ? `${DOC_ACTIVE} font-semibold`
                    : stage.passNumber > 3
                    ? "bg-white/[0.02] border-white/[0.05] text-[#8c8a82]"
                    : "opacity-40 border-white/[0.03] text-[#6b6963]"
                }`}
              >
                Layer 4: UDP Ports 500 / 4500 (8B)
              </div>
              <div
                className={`px-3 py-1.5 rounded border transition-all ${
                  stage.passNumber >= 4 && stage.passNumber <= 6
                    ? `${DOC_ACTIVE} font-semibold`
                    : stage.passNumber > 6
                    ? "bg-white/[0.02] border-white/[0.05] text-[#8c8a82]"
                    : "opacity-40 border-white/[0.03] text-[#6b6963]"
                }`}
              >
                IKE Payload: SPIs + Proposals + DH Keys
              </div>
              <div
                className={`px-3 py-1.5 rounded border transition-all ${
                  stage.passNumber >= 7
                    ? `${DOC_ACTIVE} font-semibold`
                    : "opacity-40 border-white/[0.03] text-[#6b6963]"
                }`}
              >
                Encrypted ESP: SPI 0x7a89f31c + Seq + Payload
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocPanel>
  );
}

export default DecapsulationPipelineDiagram;
