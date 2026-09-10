"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DocPanel,
  DocWell,
  DocChip,
  DOC_ACTIVE,
  DOC_IDLE,
} from "@/components/docs/DocChrome";

interface SystemNode {
  id: string;
  route: string;
  title: string;
  phase: "Intake" | "Engine" | "Triage" | "Deep Forensics" | "Action";
  inputs: string[];
  outputs: string[];
  keyTelemetry: string;
  decisionalImpact: string;
}

const NODES: SystemNode[] = [
  {
    id: "analyze",
    route: "/analyze",
    title: "Capture Upload (POST /api/analyze)",
    phase: "Intake",
    inputs: ["Capture file (.pcap/.pcapng/.cap/.erf, 256 MB cap, session cookie)"],
    outputs: ["201 + Location: /api/history/{id}", "Analysis row (processing → completed/failed)"],
    keyTelemetry: "Extension check (400), oversize (413), seeded-mock evidence note",
    decisionalImpact: "Entry point of the pipeline; same filename always yields the same seeded result.",
  },
  {
    id: "progress",
    route: "/analysis/progress",
    title: "Progress Polling (?analysis_id=)",
    phase: "Engine",
    inputs: ["analysis_id", "GET /api/history/{id} every 2 s (60 s cap)"],
    outputs: ["completed/failed status", "Redirect to results"],
    keyTelemetry: "Sync mock returns completed immediately; polling survives the future async worker",
    decisionalImpact: "Keeps the UI correct both now (sync) and later (background jobs).",
  },
  {
    id: "overview",
    route: "/overview",
    title: "Security Operations Overview",
    phase: "Triage",
    inputs: ["GET /api/history aggregate (client-side until fleet endpoint lands)"],
    outputs: ["Score/risk distribution", "Triage links with ?analysis_id="],
    keyTelemetry: "security_score 0–100, risk LOW/MEDIUM/HIGH/CRITICAL",
    decisionalImpact: "Triage surface; fleet-wide summary endpoint is still future work.",
  },
  {
    id: "results",
    route: "/analysis/results",
    title: "Forensic Assessment Results",
    phase: "Triage",
    inputs: ["GET /api/history/{id} + /findings + /traffic + /anomalies"],
    outputs: ["Score gauge, stack, mix, finding cards", "JSON report export"],
    keyTelemetry: "traffic_label/confidence, anomaly_score, config_json.ipsec_config",
    decisionalImpact: "Primary verdict view; exports are client-rendered JSON (no PDF yet).",
  },
  {
    id: "configuration",
    route: "/analysis/configuration",
    title: "VPN Configuration Detail",
    phase: "Deep Forensics",
    inputs: ["config_json.ipsec_config (cryptography + sa_config)"],
    outputs: ["Cipher/DH/PFS/IKE badges", "Proof JSON export"],
    keyTelemetry: "encryption_algorithm, dh_group, pfs_enabled, ike_version, mode, replay",
    decisionalImpact: "Shows exactly what the rule engine scored — no invented fields.",
  },
  {
    id: "traffic",
    route: "/analysis/traffic",
    title: "Encrypted Traffic Intelligence",
    phase: "Deep Forensics",
    inputs: ["GET /api/history/{id}/traffic + /windows"],
    outputs: ["Label mix ratios", "W-01.. window table with confidence"],
    keyTelemetry: "RandomForest (100 trees) per 10 s window; parent label = mode",
    decisionalImpact: "Labels: video/web/voip/icmp/email — probabilistic, never certain.",
  },
  {
    id: "anomalies",
    route: "/analysis/anomalies",
    title: "Anomaly Detection (IsolationForest)",
    phase: "Deep Forensics",
    inputs: ["GET /api/history/{id}/anomalies (?threshold=)"],
    outputs: ["Per-window decision scores", "is_anomaly flags, vectors export"],
    keyTelemetry: "Raw decision_function (lower = more anomalous); threshold applied at read",
    decisionalImpact: "Flags unusual windows; mock features mean flags are illustrative.",
  },
  {
    id: "findings",
    route: "/analysis/findings",
    title: "Security Threat Matrix",
    phase: "Action",
    inputs: ["GET /api/history/{id}/findings (?severity=, ?q=)"],
    outputs: ["{severity, category, description} rows", "CSV + remediation-plan JSON"],
    keyTelemetry: "Deterministic rule findings; all CONFIRMED-mechanism, mock-seeded evidence",
    decisionalImpact: "Directs remediation; categories map to Cryptography/Key Exchange/Configuration.",
  },
  {
    id: "reports",
    route: "/analysis/reports",
    title: "Reports (JSON Stub)",
    phase: "Action",
    inputs: ["POST /api/history/{id}/reports {type, …}", "GET .../export?format=json|csv"],
    outputs: ["On-the-fly JSON/CSV from analyses+windows"],
    keyTelemetry: "202 {report_id, type}; no PDF, no report table yet",
    decisionalImpact: "Unblocks exports honestly; signed PDF attestation is future work.",
  },
  {
    id: "live-monitor",
    route: "/analysis/live",
    title: "Live Monitor (Stubbed)",
    phase: "Deep Forensics",
    inputs: ["POST /api/live/status"],
    outputs: ["{supported:false, reason:'live capture post-MVP'}"],
    keyTelemetry: "No WS/SSE; page shows honest empty state instead of fake logs",
    decisionalImpact: "Prevents demo fiction; live tap lands only after PCAP pipeline is real.",
  },
  {
    id: "gateway-config",
    route: "/analysis/compare",
    title: "Configuration Comparison",
    phase: "Action",
    inputs: ["GET /api/compare?alpha=&beta= (two owned analysis UUIDs)"],
    outputs: ["{alpha, beta, deltas[]} over typed columns + ipsec_config"],
    keyTelemetry: "Deterministic diff; stable because the mock is filename-seeded",
    decisionalImpact: "Shows why one deployment scores better, field by field.",
  },
  {
    id: "history",
    route: "/history",
    title: "Analysis History Ledger",
    phase: "Intake",
    inputs: ["GET /api/history (?q=, ?risk=, ?page=, ?limit=)"],
    outputs: ["{items, total, page, limit}", "DELETE /api/history/{id} (cascade)"],
    keyTelemetry: "Ownership-scoped; risk filter is case-sensitive uppercase",
    decisionalImpact: "Source of truth for every analysis_id the app threads.",
  },
];

export function SystemArchitectureMap() {
  const [selectedNodeId, setSelectedNodeId] = useState("overview");
  const node = NODES.find((n) => n.id === selectedNodeId) || NODES[0];

  return (
    <DocPanel className="w-full overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#d97757]" />
            <span>Interactive Systems Blueprint</span>
            <span>·</span>
            <span className="text-[#f7f4ee]">Live Routes &amp; Contracts</span>
          </div>
          <h4 className="text-[#f7f4ee] font-display-serif text-lg font-bold">
            TunnelSight Ecosystem Interconnect Circuit
          </h4>
        </div>

        <DocWell className="px-3 py-1.5 text-xs font-mono text-[#d8d4c7]">
          Selected Node: <strong className="text-[#f7f4ee]">{node.route}</strong>
        </DocWell>
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
                      ? `${DOC_ACTIVE} ring-1 ring-white/15`
                      : `${DOC_IDLE} hover:border-white/[0.12] hover:text-[#f7f4ee]`
                  }`}
                  type="button"
                >
                  <div className="flex flex-col items-start gap-1.5 mb-1.5 min-w-0">
                    <span className="font-mono text-[10px] text-[#f7f4ee] font-bold truncate w-full">{n.route}</span>
                    <DocChip verdict={n.phase} className="uppercase shrink-0" />
                  </div>
                  <div className="text-xs font-semibold text-[#f7f4ee] truncate">{n.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <DocWell className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <DocChip verdict={`PHASE: ${node.phase.toUpperCase()}`} />
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
              <div className="p-2.5 rounded border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-[#8c8a82] uppercase">Input Telemetry Ingested:</div>
                <div className="text-[#d8d4c7] text-[11px]">{node.inputs.join(", ")}</div>
              </div>

              <div className="p-2.5 rounded border border-white/[0.04] space-y-1">
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
          </DocWell>
        </div>
      </div>
    </DocPanel>
  );
}

export default SystemArchitectureMap;
