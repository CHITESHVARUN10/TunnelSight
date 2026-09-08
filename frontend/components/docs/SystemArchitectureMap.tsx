"use client";

import Link from "next/link";
import { useState } from "react";

interface SystemNode {
  id: string;
  route: string;
  title: string;
  phase: "Intake" | "Engine" | "Triage" | "Deep Forensics" | "Action";
  phaseColor: string;
  inputs: string[];
  outputs: string[];
  keyTelemetry: string;
  decisionalImpact: string;
}

const NODES: SystemNode[] = [
  {
    id: "analyze",
    route: "/analyze",
    title: "Forensic Ingestion Conduit",
    phase: "Intake",
    phaseColor: "bg-[#d49a4f]/15 text-[#e4b373] border-[#d49a4f]/30",
    inputs: ["Raw PCAP / PCAPNG (.pcap, .pcapng up to 5GB)"],
    outputs: ["Verified SHA-256 Digest", "DPDK Ring Buffer Descriptor"],
    keyTelemetry: "Client-side SHA-256 hash, Snaplen integrity, profile validation",
    decisionalImpact: "Guarantees forensic non-repudiation before wire frames enter processing memory.",
  },
  {
    id: "progress",
    route: "/analysis/progress",
    title: "11-Stage Verification Pipeline",
    phase: "Engine",
    phaseColor: "bg-[#d97757]/15 text-[#f09c82] border-[#d97757]/30",
    inputs: ["Raw Ring Packets", "Enterprise Edge Audit Profile"],
    outputs: ["Extracted SA Proposals", "Decapsulated SPI Ledger", "ML Feature Vectors"],
    keyTelemetry: "1.2M pkts/sec decapsulation rate across 4 DPDK worker cores",
    decisionalImpact: "Isolates handshake phases and parses transform payloads down to bit offsets.",
  },
  {
    id: "overview",
    route: "/overview",
    title: "Security Operations Overview",
    phase: "Triage",
    phaseColor: "bg-[#788c5d]/15 text-[#b4cca0] border-[#788c5d]/30",
    inputs: ["Fleet Telemetry Streams", "Historical Audit Scores"],
    outputs: ["Triage Drawer Triggers", "Global Posture Rating (0-100)"],
    keyTelemetry: "Fleet Posture Score, Active SA tally, 0.02ms DPDK queue latency",
    decisionalImpact: "Enables SOC directors to spot fleet-wide cryptographic regressions in seconds.",
  },
  {
    id: "results",
    route: "/analysis/results",
    title: "Forensic Assessment Results",
    phase: "Triage",
    phaseColor: "bg-[#788c5d]/15 text-[#b4cca0] border-[#788c5d]/30",
    inputs: ["Pipeline Output Artifacts", "RFC 8247 Ruleset"],
    outputs: ["Remediation Drawers", "Cryptographic Health Radar"],
    keyTelemetry: "P0/P1/P2/P3 violation counts, RFC non-conformance tags, CVSS radar",
    decisionalImpact: "Provides conclusive technical evidence for emergency network change approval.",
  },
  {
    id: "configuration",
    route: "/analysis/configuration",
    title: "VPN Configurations & SAs",
    phase: "Deep Forensics",
    phaseColor: "bg-white/[0.06] text-[#f7f4ee] border-white/20",
    inputs: ["Decapsulated IKE_SA Headers", "CHILD_SA State"],
    outputs: ["Hex Dump Inspections", "Rekey Desynchronization Flags"],
    keyTelemetry: "Inbound/Outbound SPI pairs (0x7a89f31c), Cipher Suites, SA Lifetime",
    decisionalImpact: "Permits network architects to debug asymmetric routes and rekey negotiation failures.",
  },
  {
    id: "traffic",
    route: "/analysis/traffic",
    title: "Encrypted Traffic Intelligence",
    phase: "Deep Forensics",
    phaseColor: "bg-white/[0.06] text-[#f7f4ee] border-white/20",
    inputs: ["Raw ESP Payload Packets"],
    outputs: ["Entropy Histograms", "Burstiness Time-Series"],
    keyTelemetry: "Shannon Entropy (7.98 / 8.00), Packet Length Bins, Mbps Throughput",
    decisionalImpact: "Detects covert channels, data exfiltration, or plaintext leakage in encapsulated packets.",
  },
  {
    id: "anomalies",
    route: "/analysis/anomalies",
    title: "ML Anomaly Detection (SHAP)",
    phase: "Deep Forensics",
    phaseColor: "bg-white/[0.06] text-[#f7f4ee] border-white/20",
    inputs: ["Burst Interval Vectors", "Entropy Distributions"],
    outputs: ["Isolation Forest Outliers", "Local SHAP Explanations"],
    keyTelemetry: "Outlier Score (-0.42 to +0.85), % Feature Contribution, Anomaly Threshold",
    decisionalImpact: "Catches anomalous tunnel behavior and keep-alive storms invisible to static rules.",
  },
  {
    id: "findings",
    route: "/analysis/findings",
    title: "Security Threat Matrix",
    phase: "Action",
    phaseColor: "bg-[#c75450]/15 text-[#f08a85] border-[#c75450]/30",
    inputs: ["Aggregated Vulnerability Detections"],
    outputs: ["Prioritized Threat Table", "Executive Executive Summary PDF"],
    keyTelemetry: "CVE-2016-2183 (Sweet32), CVE-2015-4000 (Logjam), Precomputation risk",
    decisionalImpact: "Directs engineering teams on immediate patch priorities.",
  },
  {
    id: "reports",
    route: "/reports",
    title: "Compliance & Executive Reports",
    phase: "Action",
    phaseColor: "bg-[#c75450]/15 text-[#f08a85] border-[#c75450]/30",
    inputs: ["Full Forensic Session Dossier"],
    outputs: ["NIST SP 800-77 Rev. 1 Attestation", "BSI TR-02102 Export"],
    keyTelemetry: "Audit hash signature, Executive posture letter, Pass/Fail attestation",
    decisionalImpact: "Provides external auditors and compliance officers with certified reports.",
  },
  {
    id: "live-monitor",
    route: "/live-monitor",
    title: "Real-Time Gateway Monitor",
    phase: "Deep Forensics",
    phaseColor: "bg-white/[0.06] text-[#f7f4ee] border-white/20",
    inputs: ["Live DPDK Ingestion Stream"],
    outputs: ["Real-time Throughput Graph", "DPD Failure Alerts"],
    keyTelemetry: "Active Tunnels (12), Wire Bandwidth, Dead Peer Detection (DPD) Heartbeat",
    decisionalImpact: "Immediate operational insight during maintenance or failover maneuvers.",
  },
  {
    id: "gateway-config",
    route: "/gateway-config",
    title: "Synthesized Remediation Generator",
    phase: "Action",
    phaseColor: "bg-[#c75450]/15 text-[#f08a85] border-[#c75450]/30",
    inputs: ["Discovered Policy Flaws", "Target Daemon Profile"],
    outputs: ["Hardened swanctl.conf", "Legacy ipsec.conf", "Diff View"],
    keyTelemetry: "Before/After Diff, Automated Syntax Verification, Zero Downtime Reload",
    decisionalImpact: "Replaces vulnerable configurations with NIST-certified cryptographic blueprints.",
  },
  {
    id: "history",
    route: "/history",
    title: "Cryptographic Audit Ledger",
    phase: "Intake",
    phaseColor: "bg-[#d49a4f]/15 text-[#e4b373] border-[#d49a4f]/30",
    inputs: ["Historical PCAP Audit Sessions"],
    outputs: ["Audit Comparison Tool", "Posture Drift Tracking"],
    keyTelemetry: "Audit Timeline, Baseline vs Current Score, Configuration Drift",
    decisionalImpact: "Tracks enterprise security posture over multi-quarter compliance horizons.",
  },
];

export function SystemArchitectureMap() {
  const [selectedNodeId, setSelectedNodeId] = useState("overview");
  const node = NODES.find((n) => n.id === selectedNodeId) || NODES[0];

  return (
    <div className="w-full bg-[#0c0d10] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl font-sans">
      {/* Header */}
      <div className="p-4 bg-[#101216] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#d97757]" />
            <span>Interactive Systems Blueprint</span>
            <span>·</span>
            <span className="text-[#f7f4ee]">12-Portal Data Flow</span>
          </div>
          <h4 className="text-[#f7f4ee] font-display-serif text-lg font-bold">
            TunnelSight Ecosystem Interconnect Circuit
          </h4>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded bg-[#07080a] border border-white/[0.08] text-[#d8d4c7]">
          Selected Node: <strong className="text-[#f7f4ee]">{node.route}</strong>
        </span>
      </div>

      {/* Main Architecture Circuit Layout */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Node Grid by Phase */}
        <div className="lg:col-span-7 space-y-4">
          <span className="font-mono text-[10px] text-[#8c8a82] uppercase tracking-wider block">
            Click any portal to inspect its telemetry and data feeds:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {NODES.map((n) => {
              const isSelected = n.id === selectedNodeId;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelectedNodeId(n.id)}
                  className={`p-3 rounded-lg border text-left transition-all relative ${
                    isSelected
                      ? "bg-white/[0.08] border-white/40 ring-1 ring-white/15"
                      : "bg-[#07080a] border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.02]"
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-[#f7f4ee] font-bold">{n.route}</span>
                    <span className={`text-[8px] font-mono px-1 rounded uppercase ${n.phaseColor}`}>
                      {n.phase}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#f7f4ee] truncate">{n.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-lg bg-[#07080a] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${node.phaseColor}`}>
                PHASE: {node.phase.toUpperCase()}
              </span>
              <Link
                href={node.route}
                className="text-xs font-mono text-[#f7f4ee] hover:text-[#d97757] flex items-center gap-1 group transition-colors"
              >
                <span>Visit Page</span>
                <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </Link>
            </div>

            <h5 className="text-lg font-bold text-[#f7f4ee] tracking-tight font-display-serif">
              {node.title} (<code className="text-[#d97757] font-mono text-sm">{node.route}</code>)
            </h5>

            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded bg-[#0c0d10] border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-[#8c8a82] uppercase">Input Telemetry Ingested:</div>
                <div className="text-[#d8d4c7] text-[11px]">{node.inputs.join(", ")}</div>
              </div>

              <div className="p-2.5 rounded bg-[#0c0d10] border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-[#8c8a82] uppercase">Output Artifacts Produced:</div>
                <div className="text-[#b4cca0] text-[11px]">{node.outputs.join(", ")}</div>
              </div>
            </div>

            <div className="pt-1 space-y-1 font-sans text-xs">
              <span className="font-mono text-[10px] text-[#8c8a82] uppercase tracking-wider block font-semibold">
                Decisional Impact:
              </span>
              <p className="text-[#d8d4c7] leading-relaxed">
                {node.decisionalImpact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemArchitectureMap;
