"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast, downloadFile } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";
import Stat from "@/components/motion/Stat";
import { AppShell } from "@/components/layout/AppShell";
import { ArchiveDeleteModal } from "@/components/modals/ArchiveDeleteModal";

const ROW_RISK: Record<string, string> = {
  "branch-emea-gw04.pcap": "HIGH",
  "site2site-prod.pcapng": "LOW",
  "dc-west-vpn.pcap": "MEDIUM",
  "weak-vpn-07.pcap": "HIGH",
  "aws-transit-gw01.pcapng": "LOW",
  "legacy-radius-ipsec.pcap": "CRITICAL",
  "edge-gw-04-us-east.pcap": "HIGH",
};

const RISK_OPTIONS = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

const ROW_SEARCH_TEXT: Record<string, string> = {
  "branch-emea-gw04.pcap":
    "branch-emea-gw04.pcap pcap ikev2 tunnel 61 high 2 hours ago oct 24 14:12 j.chen 192.0.2.14 description",
  "site2site-prod.pcapng":
    "site2site-prod.pcapng pcapng ikev2 tunnel 94 low 5 hours ago oct 24 11:38 m.vasquez description",
  "dc-west-vpn.pcap":
    "dc-west-vpn.pcap pcap ikev1 tunnel 67 medium yesterday oct 23 18:04 s.patel description",
  "weak-vpn-07.pcap":
    "weak-vpn-07.pcap pcap ikev2 tunnel 47 high oct 22 14:02 j.chen flag",
  "aws-transit-gw01.pcapng":
    "aws-transit-gw01.pcapng pcapng ikev2 transport 88 low oct 21 09:15 automations description",
  "legacy-radius-ipsec.pcap":
    "legacy-radius-ipsec.pcap pcap ikev1 tunnel 38 critical oct 19 22:40 r.kumar warning",
  "edge-gw-04-us-east.pcap":
    "edge-gw-04-us-east.pcap pcap ikev2 tunnel 52 high oct 18 16:55 j.chen description",
};

export default function HistoryPage() {
  const [filter, setFilter] = useState("");
  const [selectedCapture, setSelectedCapture] = useState("weak-vpn-07.pcap");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [risk, setRisk] = useState("All");
  const [density, setDensity] = useState<"spacious" | "compact">("spacious");
  const [archiveDeleteModal, setArchiveDeleteModal] = useState<{ open: boolean; capture: string; mode: "archive" | "delete" }>({
    open: false,
    capture: "branch-emea-gw04.pcap",
    mode: "archive",
  });
  const router = useRouter();
  const toast = useToast();

  function matchesFilter(capture: string) {
    const q = filter.toLowerCase().trim();
    if (q) {
      const hay = ROW_SEARCH_TEXT[capture] ?? capture.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (risk !== "All" && ROW_RISK[capture] !== risk) return false;
    return true;
  }

  function cycleRisk() {
    const next = RISK_OPTIONS[(RISK_OPTIONS.indexOf(risk) + 1) % RISK_OPTIONS.length];
    setRisk(next);
    toast({ title: `Risk filter: ${next}`, body: next === "All" ? "Showing all captures." : `Showing ${next} captures only.`, kind: "info" });
  }

  function handleRowClick(capture: string) {
    setSelectedCapture(capture);
    setDrawerOpen(true);
  }

  function handleReset() {
    setFilter("");
    setRisk("All");
    setDrawerOpen(true);
    toast({ title: "Filters reset", body: "Reset search query and risk filter.", kind: "info" });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("filter-input")?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/history">
        <div className="relative w-full px-6 py-6 space-y-6 max-w-[1920px] mx-auto">
          {/* Header Section */}
          <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-1 border-b border-zinc-800/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-wider">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>Forensic Records</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-200">Execution Logbook</span>
              </div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-display-serif text-2xl md:text-3xl text-zinc-100 tracking-tight">
                  Analysis History
                </h1>
                <span className="font-mono text-xs text-zinc-500 hidden sm:inline-block">session-scoped ledger</span>
              </div>
              <p className="text-xs text-zinc-400 max-w-2xl">
                Review historical captures, posture scores, negotiated cryptographic suites, and compliance differential records.
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center font-mono">
              <div className="flex items-center gap-2.5 bg-[#111317] border border-zinc-800 px-3 py-2 rounded">
                <span className="material-symbols-outlined text-base text-teal-400">analytics</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider leading-none">Total Runs</span>
                  <span className="text-xs text-zinc-200 font-semibold leading-tight mt-0.5">
                    <Stat to={1428} />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-[#111317] border border-zinc-800 px-3 py-2 rounded">
                <span className="material-symbols-outlined text-base text-cyan-400">hub</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider leading-none">Assessed Tunnels</span>
                  <span className="text-xs text-zinc-200 font-semibold leading-tight mt-0.5">
                    <Stat to={24} suffix=" Active" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-[#111317] border border-zinc-800 px-3 py-2 rounded">
                <span className="material-symbols-outlined text-base text-zinc-400">schedule</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider leading-none">Last Replay</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-teal-400 font-medium leading-tight">14m ago</span>
                    <span className="text-[10px] text-zinc-600">by</span>
                    <span className="text-[11px] text-zinc-400">j.chen</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Controls / Compact Toolbar */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3 shadow-sm">
            {/* Search and Dropdown Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              {/* Search bar */}
              <div className="relative min-w-[260px] sm:min-w-[320px] flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-base">
                  search
                </span>
                <input
                  className="w-full h-8 pl-8 pr-12 bg-[#0c0e11] border border-zinc-800 text-zinc-200 font-mono text-xs placeholder:text-zinc-600 rounded focus:outline-none focus:border-teal-500/60 transition-colors"
                  id="filter-input"
                  placeholder="Filter by capture name, tunnel ID, tag..."
                  type="text"
                  value={filter}
                  onInput={(e) => setFilter(e.currentTarget.value)}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded pointer-events-none">
                  ⌘K
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Risk Filter */}
                <button
                  onClick={cycleRisk}
                  className="h-8 px-2.5 bg-[#0c0e11] border border-zinc-800 text-zinc-300 hover:border-zinc-700 rounded flex items-center gap-1.5 font-mono text-xs transition-colors"
                  type="button"
                >
                  <span className="text-zinc-500">Risk:</span>
                  <span className="text-teal-400 font-medium">{risk === "All" ? "All Levels" : risk}</span>
                  <span className="material-symbols-outlined text-xs text-zinc-500">expand_more</span>
                </button>

                {/* Protocol Filter */}
                <button
                  onClick={() => toast({ title: "Protocol filter", body: "Showing all protocols.", kind: "info" })}
                  className="h-8 px-2.5 bg-[#0c0e11] border border-zinc-800 text-zinc-400 hover:border-zinc-700 rounded flex items-center gap-1.5 font-mono text-xs transition-colors"
                  type="button"
                >
                  <span className="text-zinc-500">Proto:</span>
                  <span className="text-zinc-300">All</span>
                  <span className="material-symbols-outlined text-xs text-zinc-500">expand_more</span>
                </button>

                {/* Mode Filter */}
                <button
                  onClick={() => toast({ title: "Mode filter", body: "Single demo snapshot — dimension fixed.", kind: "info" })}
                  className="h-8 px-2.5 bg-[#0c0e11] border border-zinc-800 text-zinc-400 hover:border-zinc-700 rounded flex items-center gap-1.5 font-mono text-xs transition-colors"
                  type="button"
                >
                  <span className="text-zinc-500">Mode:</span>
                  <span className="text-zinc-300">All</span>
                  <span className="material-symbols-outlined text-xs text-zinc-500">expand_more</span>
                </button>
              </div>
            </div>

            {/* Action Toggles */}
            <div className="flex items-center gap-2 self-end xl:self-auto shrink-0 font-mono text-xs">
              <button
                className="h-8 px-2.5 text-zinc-400 hover:text-teal-400 transition-colors flex items-center gap-1"
                id="reset-filter-btn"
                type="button"
                onClick={handleReset}
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset</span>
              </button>
              <div className="flex items-center bg-[#0c0e11] border border-zinc-800 p-0.5 rounded">
                <button
                  className={`px-2 py-1 rounded text-[11px] transition-colors ${
                    density === "spacious"
                      ? "bg-zinc-800 text-teal-400 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  onClick={() => {
                    setDensity("spacious");
                    toast({ title: "Density: spacious", kind: "info" });
                  }}
                  type="button"
                >
                  Spacious
                </button>
                <button
                  className={`px-2 py-1 rounded text-[11px] transition-colors ${
                    density === "compact"
                      ? "bg-zinc-800 text-teal-400 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  onClick={() => {
                    setDensity("compact");
                    toast({ title: "Density: compact", kind: "info" });
                  }}
                  type="button"
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Main Workspace Split-Pane: Responsive Layout containing Data Table & Docked Detail Drawer */}
          <div className="relative flex items-start gap-6 w-full">
            {/* Data Table Card Container */}
            <div className="flex-1 min-w-0 bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden flex flex-col shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-mono text-xs" id="history-table">
                  <thead>
                    <tr className="bg-[#0f1115] border-b border-zinc-800/80 text-zinc-400 uppercase tracking-wider text-[11px]">
                      <th className="w-10 px-3 py-3 font-semibold text-center">Status</th>
                      <th className="px-3 py-3 font-semibold">Capture File</th>
                      <th className="px-3 py-3 font-semibold">Protocol</th>
                      <th className="px-3 py-3 font-semibold">Mode</th>
                      <th className="px-3 py-3 font-semibold">Posture Score</th>
                      <th className="px-3 py-3 font-semibold">Risk Classification</th>
                      <th className="px-3 py-3 font-semibold">Analyzed</th>
                      <th className="px-4 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50 text-zinc-300" id="table-body">
                    {/* Row 1 */}
                    <tr
                      className={`${density === "compact" ? "h-10" : "h-12"} transition-colors cursor-pointer ${
                        selectedCapture === "branch-emea-gw04.pcap"
                          ? "bg-teal-500/[0.06] border-l-2 border-l-teal-400"
                          : "hover:bg-zinc-800/40"
                      }`}
                      data-capture="branch-emea-gw04.pcap"
                      onClick={() => handleRowClick("branch-emea-gw04.pcap")}
                      style={{ display: matchesFilter("branch-emea-gw04.pcap") ? undefined : "none" }}
                    >
                      <td className="px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" title="Completed Audit"></span>
                      </td>
                      <td className="px-3 font-semibold text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-zinc-500">description</span>
                          <span className="truncate">branch-emea-gw04.pcap</span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">pcap</span>
                        </div>
                      </td>
                      <td className="px-3 text-zinc-400">IKEv2</td>
                      <td className="px-3 text-zinc-500">Tunnel</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded overflow-hidden">
                            <div className="bg-rose-500 h-full w-[61%]"></div>
                          </div>
                          <span className="font-semibold text-rose-400">61/100</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          HIGH
                        </span>
                      </td>
                      <td className="px-3 text-zinc-400">
                        <div className="flex flex-col leading-tight">
                          <span className="text-zinc-200">2 hours ago</span>
                          <span className="text-[10px] text-zinc-500">Oct 24, 14:12 · j.chen</span>
                        </div>
                      </td>
                      <td className="px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded text-teal-400 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr
                      className={`${density === "compact" ? "h-10" : "h-12"} transition-colors cursor-pointer ${
                        selectedCapture === "site2site-prod.pcapng"
                          ? "bg-teal-500/[0.06] border-l-2 border-l-teal-400"
                          : "hover:bg-zinc-800/40"
                      }`}
                      data-capture="site2site-prod.pcapng"
                      onClick={() => handleRowClick("site2site-prod.pcapng")}
                      style={{ display: matchesFilter("site2site-prod.pcapng") ? undefined : "none" }}
                    >
                      <td className="px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" title="Completed Audit"></span>
                      </td>
                      <td className="px-3 font-semibold text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-zinc-500">description</span>
                          <span className="truncate">site2site-prod.pcapng</span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">pcapng</span>
                        </div>
                      </td>
                      <td className="px-3 text-zinc-400">IKEv2</td>
                      <td className="px-3 text-zinc-500">Tunnel</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded overflow-hidden">
                            <div className="bg-teal-400 h-full w-[94%]"></div>
                          </div>
                          <span className="font-semibold text-teal-400">94/100</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                          LOW
                        </span>
                      </td>
                      <td className="px-3 text-zinc-400">
                        <div className="flex flex-col leading-tight">
                          <span className="text-zinc-200">5 hours ago</span>
                          <span className="text-[10px] text-zinc-500">Oct 24, 11:38 · m.vasquez</span>
                        </div>
                      </td>
                      <td className="px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded text-teal-400 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr
                      className={`${density === "compact" ? "h-10" : "h-12"} transition-colors cursor-pointer ${
                        selectedCapture === "dc-west-vpn.pcap"
                          ? "bg-teal-500/[0.06] border-l-2 border-l-teal-400"
                          : "hover:bg-zinc-800/40"
                      }`}
                      data-capture="dc-west-vpn.pcap"
                      onClick={() => handleRowClick("dc-west-vpn.pcap")}
                      style={{ display: matchesFilter("dc-west-vpn.pcap") ? undefined : "none" }}
                    >
                      <td className="px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" title="Completed Audit"></span>
                      </td>
                      <td className="px-3 font-semibold text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-zinc-500">description</span>
                          <span className="truncate">dc-west-vpn.pcap</span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">pcap</span>
                        </div>
                      </td>
                      <td className="px-3 text-zinc-400">IKEv1</td>
                      <td className="px-3 text-zinc-500">Tunnel</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded overflow-hidden">
                            <div className="bg-amber-500 h-full w-[67%]"></div>
                          </div>
                          <span className="font-semibold text-amber-400">67/100</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          MEDIUM
                        </span>
                      </td>
                      <td className="px-3 text-zinc-400">
                        <div className="flex flex-col leading-tight">
                          <span className="text-zinc-200">Yesterday</span>
                          <span className="text-[10px] text-zinc-500">Oct 23, 18:04 · s.patel</span>
                        </div>
                      </td>
                      <td className="px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded text-teal-400 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 4: weak-vpn-07.pcap (Active Focus) */}
                    <tr
                      className={`${density === "compact" ? "h-10" : "h-12"} transition-colors cursor-pointer ${
                        selectedCapture === "weak-vpn-07.pcap"
                          ? "bg-teal-500/[0.08] border-l-2 border-l-teal-400"
                          : "hover:bg-zinc-800/40"
                      }`}
                      data-capture="weak-vpn-07.pcap"
                      onClick={() => handleRowClick("weak-vpn-07.pcap")}
                      style={{ display: matchesFilter("weak-vpn-07.pcap") ? undefined : "none" }}
                    >
                      <td className="px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse inline-block" title="Active Focus"></span>
                      </td>
                      <td className="px-3 font-semibold text-teal-300">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-teal-400">flag</span>
                          <span className="truncate">weak-vpn-07.pcap</span>
                          <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1 py-0.5 rounded">
                            pcap
                          </span>
                        </div>
                      </td>
                      <td className="px-3 text-zinc-300 font-medium">IKEv2</td>
                      <td className="px-3 text-zinc-500">Tunnel</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded overflow-hidden">
                            <div className="bg-rose-500 h-full w-[47%]"></div>
                          </div>
                          <span className="font-semibold text-rose-400">47/100</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          HIGH
                        </span>
                      </td>
                      <td className="px-3 text-zinc-400">
                        <div className="flex flex-col leading-tight">
                          <span className="text-zinc-200">Oct 22</span>
                          <span className="text-[10px] text-zinc-500">Oct 22, 14:02 · j.chen</span>
                        </div>
                      </td>
                      <td className="px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded text-zinc-950 bg-teal-500 font-semibold transition-colors inline-flex items-center gap-1 shadow-sm text-[11px]"
                        >
                          <span>Active</span>
                          <span className="material-symbols-outlined text-xs">read_more</span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 5 */}
                    <tr
                      className={`${density === "compact" ? "h-10" : "h-12"} transition-colors cursor-pointer ${
                        selectedCapture === "aws-transit-gw01.pcapng"
                          ? "bg-teal-500/[0.06] border-l-2 border-l-teal-400"
                          : "hover:bg-zinc-800/40"
                      }`}
                      data-capture="aws-transit-gw01.pcapng"
                      onClick={() => handleRowClick("aws-transit-gw01.pcapng")}
                      style={{ display: matchesFilter("aws-transit-gw01.pcapng") ? undefined : "none" }}
                    >
                      <td className="px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" title="Completed Audit"></span>
                      </td>
                      <td className="px-3 font-semibold text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-zinc-500">description</span>
                          <span className="truncate">aws-transit-gw01.pcapng</span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">pcapng</span>
                        </div>
                      </td>
                      <td className="px-3 text-zinc-400">IKEv2</td>
                      <td className="px-3 text-zinc-500">Transport</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded overflow-hidden">
                            <div className="bg-teal-400 h-full w-[88%]"></div>
                          </div>
                          <span className="font-semibold text-teal-400">88/100</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                          LOW
                        </span>
                      </td>
                      <td className="px-3 text-zinc-400">
                        <div className="flex flex-col leading-tight">
                          <span className="text-zinc-200">Oct 21</span>
                          <span className="text-[10px] text-zinc-500">Oct 21, 09:15 · automations</span>
                        </div>
                      </td>
                      <td className="px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded text-teal-400 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 6 */}
                    <tr
                      className={`${density === "compact" ? "h-10" : "h-12"} transition-colors cursor-pointer ${
                        selectedCapture === "legacy-radius-ipsec.pcap"
                          ? "bg-teal-500/[0.06] border-l-2 border-l-teal-400"
                          : "hover:bg-zinc-800/40"
                      }`}
                      data-capture="legacy-radius-ipsec.pcap"
                      onClick={() => handleRowClick("legacy-radius-ipsec.pcap")}
                      style={{ display: matchesFilter("legacy-radius-ipsec.pcap") ? undefined : "none" }}
                    >
                      <td className="px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" title="Critical Policy Violation"></span>
                      </td>
                      <td className="px-3 font-semibold text-rose-300">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-rose-400">warning</span>
                          <span className="truncate">legacy-radius-ipsec.pcap</span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">pcap</span>
                        </div>
                      </td>
                      <td className="px-3 text-zinc-400">IKEv1</td>
                      <td className="px-3 text-zinc-500">Tunnel</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded overflow-hidden">
                            <div className="bg-rose-600 h-full w-[38%]"></div>
                          </div>
                          <span className="font-semibold text-rose-400">38/100</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/25 text-rose-300 border border-rose-500/40 animate-pulse">
                          CRITICAL
                        </span>
                      </td>
                      <td className="px-3 text-zinc-400">
                        <div className="flex flex-col leading-tight">
                          <span className="text-zinc-200">Oct 19</span>
                          <span className="text-[10px] text-zinc-500">Oct 19, 22:40 · r.kumar</span>
                        </div>
                      </td>
                      <td className="px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded text-teal-400 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 7 */}
                    <tr
                      className={`${density === "compact" ? "h-10" : "h-12"} transition-colors cursor-pointer ${
                        selectedCapture === "edge-gw-04-us-east.pcap"
                          ? "bg-teal-500/[0.06] border-l-2 border-l-teal-400"
                          : "hover:bg-zinc-800/40"
                      }`}
                      data-capture="edge-gw-04-us-east.pcap"
                      onClick={() => handleRowClick("edge-gw-04-us-east.pcap")}
                      style={{ display: matchesFilter("edge-gw-04-us-east.pcap") ? undefined : "none" }}
                    >
                      <td className="px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" title="Completed Audit"></span>
                      </td>
                      <td className="px-3 font-semibold text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-zinc-500">description</span>
                          <span className="truncate">edge-gw-04-us-east.pcap</span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">pcap</span>
                        </div>
                      </td>
                      <td className="px-3 text-zinc-400">IKEv2</td>
                      <td className="px-3 text-zinc-500">Tunnel</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded overflow-hidden">
                            <div className="bg-rose-500 h-full w-[52%]"></div>
                          </div>
                          <span className="font-semibold text-rose-400">52/100</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          HIGH
                        </span>
                      </td>
                      <td className="px-3 text-zinc-400">
                        <div className="flex flex-col leading-tight">
                          <span className="text-zinc-200">Oct 18</span>
                          <span className="text-[10px] text-zinc-500">Oct 18, 16:55 · j.chen</span>
                        </div>
                      </td>
                      <td className="px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded text-teal-400 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-[#0f1115] border-t border-zinc-800/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-3">
                  <span>
                    Showing <strong className="text-zinc-200 font-semibold">1–7</strong> of{" "}
                    <strong className="text-zinc-200 font-semibold">1,428</strong> captures
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-teal-400">Sorted by Date (Newest First)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast({ title: "Pagination", body: "Prototype single-page dataset.", kind: "info" })}
                    type="button"
                    className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  >
                    Prev
                  </button>
                  <span className="text-zinc-300">Page 1 of 58</span>
                  <button
                    onClick={() => toast({ title: "Pagination", body: "Prototype single-page dataset.", kind: "info" })}
                    type="button"
                    className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Right-Side Capture Detail Drawer */}
            {drawerOpen && (
              <aside
                className="w-full xl:w-96 bg-[#111317] border border-zinc-800/80 rounded-lg shadow-xl flex flex-col shrink-0 overflow-hidden self-start sticky top-6"
                id="detail-drawer"
              >
                {/* Drawer Top Bar */}
                <div className="bg-[#0f1115] border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-teal-400 text-base">verified_user</span>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-zinc-200 font-semibold truncate" id="drawer-capture-name">
                          {selectedCapture}
                        </span>
                        <span className="font-mono text-[9px] bg-teal-500/15 text-teal-300 px-1 py-0.5 rounded border border-teal-500/30 uppercase">
                          Selected
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">Oct 22, 2025 · 14:02:19 UTC</span>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                    id="drawer-close-btn"
                    title="Close Drawer"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDrawerOpen(false);
                    }}
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                {/* Drawer Content Body */}
                <div className="p-4 flex flex-col space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
                  {/* Score & Risk Banner */}
                  <div className="bg-[#0c0e11] border border-zinc-800 rounded p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display-serif text-3xl font-semibold text-rose-400 tracking-tight">47</span>
                        <span className="font-mono text-xs text-zinc-500">/ 100</span>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase ml-1">Posture Score</span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                        HIGH RISK
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Non-compliant cryptographic suite &amp; weak ephemeral key exchange detected. RFC 8247 minimum security thresholds failed.
                    </p>
                  </div>

                  {/* Security Context Grid */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                      <span>Negotiated Context</span>
                      <span className="text-teal-400">CONFIRMED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div className="bg-[#0c0e11] border border-zinc-800/80 p-2 rounded">
                        <span className="text-zinc-500 text-[10px] uppercase block">Protocol / Mode</span>
                        <span className="text-zinc-200 font-medium mt-0.5 block">IKEv2 · Tunnel</span>
                      </div>
                      <div className="bg-[#0c0e11] border border-zinc-800/80 p-2 rounded">
                        <span className="text-zinc-500 text-[10px] uppercase block">Anti-Replay Window</span>
                        <span className="text-zinc-200 font-medium mt-0.5 block">64 Pkts (On)</span>
                      </div>
                      <div className="bg-[#0c0e11] border border-zinc-800/80 p-2 rounded">
                        <span className="text-zinc-500 text-[10px] uppercase block">Initiator</span>
                        <span className="text-zinc-300 font-medium mt-0.5 block">192.0.2.14</span>
                      </div>
                      <div className="bg-[#0c0e11] border border-zinc-800/80 p-2 rounded">
                        <span className="text-zinc-500 text-[10px] uppercase block">Responder</span>
                        <span className="text-zinc-300 font-medium mt-0.5 block">198.51.100.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Cryptographic Findings */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                      <span>Cryptographic Findings</span>
                      <span className="text-rose-400 font-medium">3 Detected</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2.5 rounded bg-[#0c0e11] border border-zinc-800/80 flex items-start gap-2">
                        <span className="font-mono text-[10px] font-semibold text-rose-400 bg-rose-500/20 px-1 py-0.5 rounded border border-rose-500/30 shrink-0">
                          P0
                        </span>
                        <div className="space-y-0.5 leading-tight">
                          <span className="text-xs text-zinc-200 font-medium block">Weak DH Group 2 (MODP-1024)</span>
                          <span className="font-mono text-[10px] text-zinc-500 block">RFC 8247 deprecates bit length &lt; 2048.</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-[#0c0e11] border border-zinc-800/80 flex items-start gap-2">
                        <span className="font-mono text-[10px] font-semibold text-amber-400 bg-amber-500/20 px-1 py-0.5 rounded border border-amber-500/30 shrink-0">
                          P1
                        </span>
                        <div className="space-y-0.5 leading-tight">
                          <span className="text-xs text-zinc-200 font-medium block">PFS Disabled on CHILD_SA</span>
                          <span className="font-mono text-[10px] text-zinc-500 block">Perfect Forward Secrecy omitted during phase 2.</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-[#0c0e11] border border-zinc-800/80 flex items-start gap-2">
                        <span className="font-mono text-[10px] font-semibold text-amber-400 bg-amber-500/20 px-1 py-0.5 rounded border border-amber-500/30 shrink-0">
                          P2
                        </span>
                        <div className="space-y-0.5 leading-tight">
                          <span className="text-xs text-zinc-200 font-medium block">3DES-CBC Cipher Offered</span>
                          <span className="font-mono text-[10px] text-zinc-500 block">Sweet32 vulnerable transform proposed in SA payload.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Capture Ingestion Telemetry */}
                  <div className="bg-[#0c0e11] border border-zinc-800/80 rounded p-3 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase tracking-wider">
                      <span>Ingestion Telemetry</span>
                      <span className="material-symbols-outlined text-xs text-teal-400">memory</span>
                    </div>
                    <div className="space-y-1 text-zinc-400">
                      <div className="flex justify-between">
                        <span>Packet Volume:</span>
                        <span className="text-zinc-200 font-medium">1,482,091 pkts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wire Rate:</span>
                        <span className="text-zinc-200 font-medium">1.48 Gbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-zinc-200 font-medium">18.4s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingestion Pipeline:</span>
                        <span className="text-teal-400 font-medium">DPDK Ring 0</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800 font-mono text-xs">
                    <button
                      onClick={() => router.push("/analysis/results")}
                      className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      type="button"
                    >
                      <span>Open Full Analysis</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          downloadFile("weak-vpn-07-executive-report.json", executiveReportJSON());
                          toast({ title: "Report generated", body: "weak-vpn-07-executive-report.json downloaded.", kind: "ok" });
                        }}
                        className="py-1.5 bg-[#0c0e11] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded flex items-center justify-center gap-1 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs text-zinc-500">picture_as_pdf</span>
                        <span>Report</span>
                      </button>
                      <button
                        onClick={() => router.push("/analysis/compare")}
                        className="py-1.5 bg-[#0c0e11] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded flex items-center justify-center gap-1 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs text-zinc-500">compare_arrows</span>
                        <span>Compare</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60">
                      <button
                        onClick={() => setArchiveDeleteModal({ open: true, capture: selectedCapture, mode: "archive" })}
                        className="py-1.5 bg-[#0c0e11] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-teal-400 rounded flex items-center justify-center gap-1 transition-colors text-xs font-mono"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs">inventory_2</span>
                        <span>Archive</span>
                      </button>
                      <button
                        onClick={() => setArchiveDeleteModal({ open: true, capture: selectedCapture, mode: "delete" })}
                        className="py-1.5 bg-[#0c0e11] hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-800/50 text-zinc-400 hover:text-rose-400 rounded flex items-center justify-center gap-1 transition-colors text-xs font-mono"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs">delete_forever</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
        <ArchiveDeleteModal
          isOpen={archiveDeleteModal.open}
          onClose={() => setArchiveDeleteModal((s) => ({ ...s, open: false }))}
          captureName={archiveDeleteModal.capture}
          initialMode={archiveDeleteModal.mode}
        />
      </AppShell>
    </div>
  );
}
