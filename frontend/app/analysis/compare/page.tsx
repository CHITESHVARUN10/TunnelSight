"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";

const REMEDIATION_STANZA = `connections {
    edge-interconnect {
        version = 2
        proposals = aes256gcm16-prfsha384-ecp384,aes256gcm16-prfsha256-ecp256
        rekey_time = 3600s
        auth = pubkey
        certs = vpn-edge01-cert.pem
        children {
            ipsec-traffic {
                esp_proposals = aes256gcm16-ecp384,aes256gcm16-ecp256
                rekey_time = 3600s
                life_bytes = 1073741824
                start_action = start
                replay_window = 128
                esn = yes
            }
        }
    }
}`;

interface DeltaRow {
  parameter: string;
  alpha: string;
  alphaTone: "error" | "warn" | "neutral";
  beta: string;
  betaTone: "teal" | "neutral";
  impact: string;
  impactType: "upgrade" | "critical" | "warning";
  evidenceNote: string;
}

const DELTA_ROWS: DeltaRow[] = [
  {
    parameter: "Symmetric Cipher (Data Plane)",
    alpha: "AES-128-CBC",
    alphaTone: "error",
    beta: "AES-256-GCM (AEAD)",
    betaTone: "teal",
    impact: "Upgrade to AEAD",
    impactType: "upgrade",
    evidenceNote: "AES-128-CBC (Alpha) vulnerable to bit-flipping and padding oracle attacks. Replaced by AES-256-GCM authenticated cipher.",
  },
  {
    parameter: "Integrity Algorithm",
    alpha: "HMAC-SHA1-96 (Weak)",
    alphaTone: "error",
    beta: "Integrated GMAC",
    betaTone: "teal",
    impact: "Critical Defect",
    impactType: "critical",
    evidenceNote: "HMAC-SHA1-96 truncated output provides under 80 bits effective collision resistance. Replaced by 128-bit GMAC authentication tag.",
  },
  {
    parameter: "Diffie-Hellman Key Exchange",
    alpha: "Group 2 (MODP-1024)",
    alphaTone: "error",
    beta: "Group 19 (ECP-256)",
    betaTone: "teal",
    impact: "Broken DH Prime",
    impactType: "critical",
    evidenceNote: "Group 2 uses fixed 1024-bit primes susceptible to nation-state precomputation (Logjam attack). Group 19 provides 128-bit quantum security floor.",
  },
  {
    parameter: "Perfect Forward Secrecy (PFS)",
    alpha: "Disabled (Child SA)",
    alphaTone: "error",
    beta: "Enforced (Every Rekey)",
    betaTone: "teal",
    impact: "SNDL Exposure",
    impactType: "critical",
    evidenceNote: "Child SAs reuse IKE SA master secret. Compromise of initial key exposes all historical child traffic. Enforcing PFS forces ephemeral key generation.",
  },
  {
    parameter: "SA Rekey Lifecycle Bounds",
    alpha: "28,800s (8h) / 4.0 GB",
    alphaTone: "warn",
    beta: "3,600s (1h) / 1.0 GB",
    betaTone: "teal",
    impact: "87.5% Shrunk",
    impactType: "upgrade",
    evidenceNote: "Long rekey lifetimes increase window of exposure for cryptographic nonce collisions under high packet throughput.",
  },
  {
    parameter: "Authentication Credential",
    alpha: "Static PSK (Shared Secret)",
    alphaTone: "error",
    beta: "Mutual X.509 PKI",
    betaTone: "teal",
    impact: "Assurance Pass",
    impactType: "upgrade",
    evidenceNote: "Static pre-shared keys lack forward revocation mechanisms and are vulnerable to dictionary attacks when captured during Aggressive Mode.",
  },
];

export default function VpnComparePage() {
  const [diffsOnly, setDiffsOnly] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  const handleCopyStanza = () => {
    navigator.clipboard.writeText(REMEDIATION_STANZA).then(() => {
      setCopied(true);
      setCopyFailed(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    }).catch(() => {
      setCopyFailed(true);
    });
  };

  const handleSwap = () => {
    setSwapped((prev) => !prev);
    toast({
      title: "Comparison Swapped",
      body: swapped ? "Restored Alpha as baseline, Beta as target." : "Inverted: Beta is now baseline, Alpha is target.",
      kind: "info",
    });
  };

  function exportDifferential() {
    downloadFile(
      "vpn-differential.json",
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          alpha: swapped ? "cloud-transit-gw04" : "corp-edge-vpn01",
          beta: swapped ? "corp-edge-vpn01" : "cloud-transit-gw04",
          standard: "NIST SP 800-77r1 / CNSA 1.0",
          deltas: DELTA_ROWS.map((r) => ({
            parameter: r.parameter,
            left: swapped ? r.beta : r.alpha,
            right: swapped ? r.alpha : r.beta,
            impact: r.impact,
          })),
        },
        null,
        2
      )
    );
    toast({ title: "Differential Exported", body: "vpn-differential.json downloaded successfully.", kind: "ok" });
  }

  function inspectDelta(label: string, detail: string) {
    toast({ title: label, body: detail, kind: "info" });
  }

  const alphaDeployment = swapped
    ? {
        id: "cloud-transit-gw04",
        label: "Deployment Alpha",
        badge: "CNSA COMPLIANT",
        badgeTone: "teal",
        score: "94",
        scoreTone: "text-teal-400",
        pcap: "hardened-edge-02.pcap",
        sha: "3d12…90ae",
        lifetime: "128+ bits",
        lifetimeSub: "Quantum-Resistant",
        rfcStatus: "COMPLIANT",
        cnsaStatus: "VERIFIED PASS",
      }
    : {
        id: "corp-edge-vpn01",
        label: "Deployment Alpha",
        badge: "LEGACY AUDIT",
        badgeTone: "red",
        score: "61",
        scoreTone: "text-rose-400",
        pcap: "weak-vpn-07.pcap",
        sha: "7f89…c42b",
        lifetime: "<80 bits",
        lifetimeSub: "NFS Pre-computation",
        rfcStatus: "NON-COMPLIANT",
        cnsaStatus: "FAIL",
      };

  const betaDeployment = swapped
    ? {
        id: "corp-edge-vpn01",
        label: "Deployment Beta",
        badge: "LEGACY AUDIT",
        badgeTone: "red",
        score: "61",
        scoreTone: "text-rose-400",
        pcap: "weak-vpn-07.pcap",
        sha: "7f89…c42b",
        lifetime: "<80 bits",
        lifetimeSub: "NFS Pre-computation",
        rfcStatus: "NON-COMPLIANT",
        cnsaStatus: "FAIL",
      }
    : {
        id: "cloud-transit-gw04",
        label: "Deployment Beta",
        badge: "CNSA COMPLIANT",
        badgeTone: "teal",
        score: "94",
        scoreTone: "text-teal-400",
        pcap: "hardened-edge-02.pcap",
        sha: "3d12…90ae",
        lifetime: "128+ bits",
        lifetimeSub: "Quantum-Resistant",
        rfcStatus: "COMPLIANT",
        cnsaStatus: "VERIFIED PASS",
      };

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
      <AppShell active="analysis">
        {/* Context & Analytical Header */}
        <div className="border-b border-zinc-800/80 bg-[#111317]/90 backdrop-blur px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500 uppercase tracking-wider">Audit Hierarchy</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-400">Deployments</span>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">Differential Matrix Analysis</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-300 text-xs font-mono">
                <span className="material-symbols-outlined text-[14px] text-teal-400">verified_user</span>
                <span>NIST SP 800-77r1 Benchmark Mode</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              </div>
              <button
                aria-pressed={diffsOnly}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono border transition-colors ${
                  diffsOnly
                    ? "border-teal-500/30 bg-teal-500/10 text-teal-300"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                }`}
                type="button"
                onClick={() => setDiffsOnly((v) => !v)}
              >
                <span className="material-symbols-outlined text-[14px]">{diffsOnly ? "filter_list" : "table_rows"}</span>
                <span>Filter: Differences Only</span>
                <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider uppercase bg-zinc-800 text-zinc-300">
                  {diffsOnly ? "Active" : "All"}
                </span>
              </button>
              <button
                aria-label="Swap Target Profile Alpha and Beta"
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors text-xs font-mono"
                type="button"
                onClick={handleSwap}
              >
                <span className="material-symbols-outlined text-[14px] text-zinc-400">swap_horiz</span>
                <span>Swap Targets</span>
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-teal-500 hover:bg-teal-400 text-zinc-950 text-xs font-mono font-semibold transition-colors"
                type="button"
                onClick={exportDifferential}
              >
                <span className="material-symbols-outlined text-[14px]">file_download</span>
                <span>Export Differential</span>
              </button>
            </div>
          </div>

          {/* Title & Selectors Bar */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-end pt-1">
            <div className="xl:col-span-4">
              <div className="flex items-center gap-2.5">
                <h1 className="font-display-serif text-2xl font-bold tracking-tight text-white">
                  VPN Configuration Differential
                </h1>
                <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 font-mono text-[11px]">
                  IKEv2 / IPsec
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Forensic parameter delta analysis across cryptographic primitives, negotiation policies, and SA lifetime budgets.
              </p>
            </div>

            {/* Left Target Input */}
            <div className="xl:col-span-4 bg-[#14171c] border border-zinc-800/80 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  {alphaDeployment.label}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                    alphaDeployment.badgeTone === "red"
                      ? "border border-rose-500/20 bg-rose-500/10 text-rose-400"
                      : "border border-teal-500/20 bg-teal-500/10 text-teal-400"
                  }`}
                >
                  {alphaDeployment.badge}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[16px] text-zinc-400">router</span>
                <span className="font-mono text-xs font-semibold text-white truncate">{alphaDeployment.id}</span>
                <span className="text-zinc-600 font-mono text-xs">·</span>
                <span className="font-mono text-xs text-zinc-400 truncate">{alphaDeployment.pcap}</span>
              </div>
            </div>

            {/* Right Target Input */}
            <div className="xl:col-span-4 bg-[#14171c] border border-zinc-800/80 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  {betaDeployment.label}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                    betaDeployment.badgeTone === "teal"
                      ? "border border-teal-500/20 bg-teal-500/10 text-teal-400"
                      : "border border-rose-500/20 bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {betaDeployment.badge}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[16px] text-teal-400">cloud_done</span>
                <span className="font-mono text-xs font-semibold text-white truncate">{betaDeployment.id}</span>
                <span className="text-zinc-600 font-mono text-xs">·</span>
                <span className="font-mono text-xs text-zinc-400 truncate">{betaDeployment.pcap}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Hero Posture Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Deployment Alpha */}
            <div className="lg:col-span-5 bg-[#111317] border border-zinc-800/80 p-5 rounded-lg flex flex-col justify-between relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1 h-full ${
                  alphaDeployment.badgeTone === "red" ? "bg-rose-500" : "bg-teal-500"
                }`}
              />
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        alphaDeployment.badgeTone === "red" ? "text-rose-400" : "text-teal-400"
                      }`}
                    >
                      {alphaDeployment.badgeTone === "red" ? "warning" : "verified"}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                        {alphaDeployment.label}
                      </span>
                      <span className="font-mono text-sm font-semibold text-white">{alphaDeployment.id}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      alphaDeployment.badgeTone === "red"
                        ? "border border-rose-500/20 bg-rose-500/10 text-rose-400"
                        : "border border-teal-500/20 bg-teal-500/10 text-teal-400"
                    }`}
                  >
                    {alphaDeployment.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Posture Score</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`font-display-serif text-3xl font-bold ${alphaDeployment.scoreTone}`}>
                        {alphaDeployment.score}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">/ 100</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] block mt-1 ${
                        alphaDeployment.badgeTone === "red" ? "text-rose-400" : "text-teal-400"
                      }`}
                    >
                      {alphaDeployment.badgeTone === "red" ? "Critical Defects" : "CNSA 1.0 Pass"}
                    </span>
                  </div>
                  <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Crypto Lifetime</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-mono text-lg font-semibold text-zinc-200">{alphaDeployment.lifetime}</span>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400 block mt-1">
                      {alphaDeployment.lifetimeSub}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="px-3 py-2 rounded bg-[#14171c] border border-zinc-800/50 flex items-center justify-between">
                    <span className="text-zinc-400">RFC 8247 (IKEv2)</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                        alphaDeployment.rfcStatus === "COMPLIANT"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px]">
                        {alphaDeployment.rfcStatus === "COMPLIANT" ? "check" : "close"}
                      </span>
                      {alphaDeployment.rfcStatus}
                    </span>
                  </div>
                  <div className="px-3 py-2 rounded bg-[#14171c] border border-zinc-800/50 flex items-center justify-between">
                    <span className="text-zinc-400">CNSA 1.0 (Quantum-Safe)</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                        alphaDeployment.cnsaStatus === "FAIL"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px]">
                        {alphaDeployment.cnsaStatus === "FAIL" ? "close" : "verified"}
                      </span>
                      {alphaDeployment.cnsaStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-zinc-500 text-[11px] font-mono">
                <span className="truncate">Source: {alphaDeployment.pcap}</span>
                <span className="text-zinc-400">SHA: {alphaDeployment.sha}</span>
              </div>
            </div>

            {/* Differential Delta Banner */}
            <div className="lg:col-span-2 bg-[#111317] border border-teal-500/20 p-5 rounded-lg flex flex-col justify-center items-center text-center relative">
              <div className="w-10 h-10 rounded-full border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-400 mb-2">
                <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Differential Delta</span>
              <div className="font-display-serif text-3xl font-bold text-teal-400 mt-1">
                {swapped ? "-33 pts" : "+33 pts"}
              </div>
              <span className="text-xs font-mono text-zinc-300 mt-1">
                {swapped ? "Advantage: Alpha" : "Advantage: Beta"}
              </span>

              <div className="mt-4 w-full space-y-1.5 text-xs font-mono">
                <div className="bg-[#0c0e11] border border-zinc-800/60 py-1.5 px-2.5 rounded flex items-center justify-between">
                  <span className="text-zinc-500">Risk Migration</span>
                  <span className="text-teal-400 font-semibold">{swapped ? "Low → High" : "High → Low"}</span>
                </div>
                <div className="bg-[#0c0e11] border border-zinc-800/60 py-1.5 px-2.5 rounded flex items-center justify-between">
                  <span className="text-zinc-500">Divergences</span>
                  <span className="text-zinc-200 font-semibold">6 Primitives</span>
                </div>
              </div>
            </div>

            {/* Deployment Beta */}
            <div className="lg:col-span-5 bg-[#111317] border border-zinc-800/80 p-5 rounded-lg flex flex-col justify-between relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1 h-full ${
                  betaDeployment.badgeTone === "teal" ? "bg-teal-500" : "bg-rose-500"
                }`}
              />
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        betaDeployment.badgeTone === "teal" ? "text-teal-400" : "text-rose-400"
                      }`}
                    >
                      {betaDeployment.badgeTone === "teal" ? "verified" : "warning"}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                        {betaDeployment.label}
                      </span>
                      <span className="font-mono text-sm font-semibold text-white">{betaDeployment.id}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      betaDeployment.badgeTone === "teal"
                        ? "border border-teal-500/20 bg-teal-500/10 text-teal-400"
                        : "border border-rose-500/20 bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {betaDeployment.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Posture Score</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`font-display-serif text-3xl font-bold ${betaDeployment.scoreTone}`}>
                        {betaDeployment.score}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">/ 100</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] block mt-1 ${
                        betaDeployment.badgeTone === "teal" ? "text-teal-400" : "text-rose-400"
                      }`}
                    >
                      {betaDeployment.badgeTone === "teal" ? "CNSA 1.0 Pass" : "Critical Defects"}
                    </span>
                  </div>
                  <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Crypto Lifetime</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-mono text-lg font-semibold text-zinc-200">{betaDeployment.lifetime}</span>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400 block mt-1">
                      {betaDeployment.lifetimeSub}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="px-3 py-2 rounded bg-[#14171c] border border-zinc-800/50 flex items-center justify-between">
                    <span className="text-zinc-400">RFC 8247 (IKEv2)</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                        betaDeployment.rfcStatus === "COMPLIANT"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px]">
                        {betaDeployment.rfcStatus === "COMPLIANT" ? "check" : "close"}
                      </span>
                      {betaDeployment.rfcStatus}
                    </span>
                  </div>
                  <div className="px-3 py-2 rounded bg-[#14171c] border border-zinc-800/50 flex items-center justify-between">
                    <span className="text-zinc-400">CNSA 1.0 (Quantum-Safe)</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                        betaDeployment.cnsaStatus === "FAIL"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px]">
                        {betaDeployment.cnsaStatus === "FAIL" ? "close" : "verified"}
                      </span>
                      {betaDeployment.cnsaStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-zinc-500 text-[11px] font-mono">
                <span className="truncate">Source: {betaDeployment.pcap}</span>
                <span className="text-zinc-400">SHA: {betaDeployment.sha}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic & Operational Matrix */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-[#14171c] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">table_rows</span>
                <h2 className="font-mono text-sm font-semibold text-white">
                  Cryptographic &amp; Operational Posture Matrix
                </h2>
                <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-[11px]">
                  6 Divergent Parameters
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-500">Click any row to inspect forensic evidence</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs" style={{ minWidth: "820px" }}>
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#0c0e11] text-zinc-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 w-3/12" scope="col">Parameter</th>
                    <th className="py-3 px-4 w-3/12" scope="col">{alphaDeployment.id} (A)</th>
                    <th className="py-3 px-4 w-3/12" scope="col">{betaDeployment.id} (B)</th>
                    <th className="py-3 px-4 w-2/12" scope="col">Impact / Delta</th>
                    <th className="py-3 px-4 w-1/12 text-right" scope="col">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {DELTA_ROWS.map((row, idx) => {
                    const leftVal = swapped ? row.beta : row.alpha;
                    const rightVal = swapped ? row.alpha : row.beta;
                    const isDiff = leftVal !== rightVal;
                    if (diffsOnly && !isDiff) return null;

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                        onClick={() => inspectDelta(row.parameter, row.evidenceNote)}
                      >
                        <td className="py-3 px-4 text-zinc-200 font-medium">{row.parameter}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-xs ${
                              row.alphaTone === "error"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                            }`}
                          >
                            {leftVal}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-xs ${
                              row.betaTone === "teal"
                                ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                            }`}
                          >
                            {rightVal}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                              row.impactType === "critical"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {row.impactType === "critical" ? "error" : "arrow_upward"}
                            </span>
                            {row.impact}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-zinc-400 hover:text-teal-400">
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Score Differential Breakdown & Compliance Gap Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 bg-[#111317] border border-zinc-800/80 p-5 rounded-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">policy</span>
                  <h3 className="font-mono text-sm font-semibold text-white">Score Differential Rationale</h3>
                </div>
                <span className="font-mono text-xs text-teal-400 font-semibold">+33 Cumulative Delta Points</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#14171c] border border-zinc-800/60 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-mono text-xs flex items-center justify-center font-bold mt-0.5">
                      1
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-zinc-100">
                        Elimination of Pre-Computation Exposure (Logjam)
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Replaces weak 1024-bit primes with ECP-256 elliptic curve cryptography, boosting security margin &gt;128 bits.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-mono text-xs font-semibold whitespace-nowrap">
                    +16 pts
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#14171c] border border-zinc-800/60 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-mono text-xs flex items-center justify-center font-bold mt-0.5">
                      2
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-zinc-100">
                        Closed Store-Now, Decrypt-Later (SNDL) Window
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Mandatory PFS forces ephemeral key generation per child SA, preventing retroactive decryption of archived traffic.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-mono text-xs font-semibold whitespace-nowrap">
                    +11 pts
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#14171c] border border-zinc-800/60 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-mono text-xs flex items-center justify-center font-bold mt-0.5">
                      3
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-zinc-100">
                        AEAD Modernization &amp; CBC Padding Oracle Mitigation
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        AES-256-GCM eliminates CBC padding oracle vulnerabilities and combines encryption with integrity validation in a single pass.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-mono text-xs font-semibold whitespace-nowrap">
                    +6 pts
                  </span>
                </div>
              </div>
            </div>

            {/* Compliance Gap Summary */}
            <div className="lg:col-span-4 bg-[#111317] border border-zinc-800/80 p-5 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-400 font-mono text-sm font-semibold mb-1">
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                  <span>Compliance Gap Summary</span>
                </div>
                <p className="text-xs text-zinc-400 mb-4">Audit alignment across federal and NIST transit standards.</p>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded bg-[#14171c] border border-zinc-800/50 flex items-center justify-between">
                    <span className="text-zinc-300">CNSA 1.0 (Quantum-Safe)</span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">check</span>B PASS
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#14171c] border border-zinc-800/50 flex items-center justify-between">
                    <span className="text-zinc-300">NIST SP 800-77r1 (IPsec)</span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">check</span>B PASS
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#14171c] border border-zinc-800/50 flex items-center justify-between">
                    <span className="text-zinc-300">RFC 8247 (IKEv2 Baseline)</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">close</span>A FAILS
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/60 bg-[#0c0e11] p-3 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Remediation Effort</span>
                  <span className="text-teal-400 font-mono text-xs font-semibold">Config-Only (Low)</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No hardware or kernel modifications required. Apply the swanctl configuration patch directly.
                </p>
              </div>
            </div>
          </div>

          {/* Remediation Blueprint Card */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-[#14171c] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">terminal</span>
                <h3 className="font-mono text-sm font-semibold text-white">
                  Remediation Blueprint: strongSwan (swanctl.conf) Patch
                </h3>
                <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-mono text-[11px]">
                  Ready to Apply
                </span>
              </div>
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  copied
                    ? "bg-teal-500 text-zinc-950 font-semibold"
                    : "border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                type="button"
                onClick={handleCopyStanza}
              >
                <span className="material-symbols-outlined text-[14px]">{copied ? "done" : "content_copy"}</span>
                <span>{copied ? "Copied to Clipboard" : copyFailed ? "Stanza Selected" : "Copy Remediation Stanza"}</span>
              </button>
            </div>

            <div className="p-4 bg-[#0c0e11] font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
              <pre className="select-text">
                <span className="text-zinc-500"># Remediation patch: elevate corp-edge-vpn01 to cloud-transit-gw04 baseline</span>
                {"\n"}connections {"{"}
                {"\n"}    edge-interconnect {"{"}
                {"\n"}        version = 2
                {"\n"}
                <span className="text-rose-400 bg-rose-500/10 block px-2 py-0.5 rounded my-0.5">
                  <strong className="font-bold mr-2 select-none">[-]</strong>proposals = aes128-sha1-modp1024
                </span>
                <span className="text-teal-300 bg-teal-500/10 block px-2 py-0.5 rounded my-0.5">
                  <strong className="font-bold mr-2 select-none">[+]</strong>proposals = aes256gcm16-prfsha384-ecp384,aes256gcm16-prfsha256-ecp256
                </span>
                {"        "}rekey_time = 3600s
                {"\n"}        auth = pubkey
                {"\n"}        children {"{"}
                {"\n"}            ipsec-traffic {"{"}
                {"\n"}
                <span className="text-rose-400 bg-rose-500/10 block px-2 py-0.5 rounded my-0.5">
                  <strong className="font-bold mr-2 select-none">[-]</strong>esp_proposals = aes128-sha1
                </span>
                <span className="text-teal-300 bg-teal-500/10 block px-2 py-0.5 rounded my-0.5">
                  <strong className="font-bold mr-2 select-none">[+]</strong>esp_proposals = aes256gcm16-ecp384,aes256gcm16-ecp256
                </span>
                {"                "}rekey_time = 3600s
                {"\n"}                life_bytes = 1073741824
                {"\n"}            {"}"}
                {"\n"}        {"}"}
                {"\n"}    {"}"}
                {"\n"}{"}"}
              </pre>
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}
