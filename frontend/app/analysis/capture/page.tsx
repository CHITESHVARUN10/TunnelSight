"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";

const CAPTURE_SHA256 = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

export default function CaptureDrawerPage() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const closeDrawer = () => setDrawerOpen(false);
  const router = useRouter();
  const toast = useToast();
  const openFullAnalysis = () => router.push("/analysis/results");
  const generateReport = () => {
    downloadFile("branch-emea-gw04-report.json", executiveReportJSON(), "application/json");
    toast({ title: "Report generated", body: "branch-emea-gw04-report.json downloaded.", kind: "ok" });
  };
  const compareCaptures = () => toast({ title: "Compare staged", body: "Capture comparison queued (mock).", kind: "info" });
  const showHashModal = () => {
    navigator.clipboard?.writeText(CAPTURE_SHA256);
    toast({ title: "SHA-256 copied", body: CAPTURE_SHA256, kind: "ok" });
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="" innerClassName="flex flex-col w-full relative overflow-hidden" innerStyle={{minHeight: 'calc(100vh - 2.75rem)'}}>

        {/* Background Workspace (Audit History / Captures Log) */}
        <div className="w-full px-8 py-6 flex flex-col gap-6 select-none opacity-40 pointer-events-none transition-opacity duration-300">
          {/* Breadcrumb & Workspace Title */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                <span>Ingress Tunnels</span>
                <span>/</span>
                <span className="text-zinc-400">EMEA Operational Edge</span>
                <span>/</span>
                <span className="text-teal-400">Captures</span>
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">PCAP Analysis Pipeline</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded text-zinc-400 font-mono text-xs">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                <span>Filtered: Status = All (48 Captures)</span>
              </div>
              <div className="bg-teal-500 text-black px-3.5 py-1.5 rounded font-semibold text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>Ingest PCAP</span>
              </div>
            </div>
          </div>

          {/* Telemetry Cards Row (Backdrop content) */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/80 flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase text-zinc-500">Captures Processed (24h)</span>
              <span className="font-display-serif text-2xl font-bold text-white tabular-nums">1,402</span>
              <span className="font-mono text-xs text-teal-400">↑ 14.2% vs previous run</span>
            </div>
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/80 flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase text-zinc-500">High Risk Violations</span>
              <span className="font-display-serif text-2xl font-bold text-rose-400 tabular-nums">38</span>
              <span className="font-mono text-xs text-rose-400/90">Critical cipher suite drift</span>
            </div>
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/80 flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase text-zinc-500">PFS Compliance Rate</span>
              <span className="font-display-serif text-2xl font-bold text-white tabular-nums">91.4%</span>
              <span className="font-mono text-xs text-zinc-500">Target threshold: 99.0%</span>
            </div>
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/80 flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase text-zinc-500">Aggregate Throughput</span>
              <span className="font-display-serif text-2xl font-bold text-teal-400 tabular-nums">84.2 GB</span>
              <span className="font-mono text-xs text-zinc-400">Across 162 active child SAs</span>
            </div>
          </div>

          {/* Table Shell for realism behind the drawer */}
          <div className="bg-[#111317] rounded-lg border border-zinc-800/80 overflow-hidden flex flex-col">
            <div className="bg-zinc-900/80 px-4 py-2.5 flex items-center justify-between font-mono text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              <div className="w-1/4">Capture Artifact</div>
              <div className="w-1/6">Protocol Suite</div>
              <div className="w-1/6">Posture Index</div>
              <div className="w-1/6">Payload Volume</div>
              <div className="w-1/6 text-right">Analyzed</div>
            </div>
            <div className="divide-y divide-zinc-800/60 font-mono text-xs">
              <div className="px-4 py-3 flex items-center justify-between bg-zinc-800/40 text-zinc-200">
                <div className="w-1/4 flex items-center gap-2 text-teal-400 font-medium">
                  <span className="material-symbols-outlined text-[16px]">folder_zip</span>
                  <span>branch-emea-gw04.pcap</span>
                </div>
                <div className="w-1/6 text-zinc-400">IKEv2 / ESP (AES-CBC)</div>
                <div className="w-1/6 text-rose-400 font-medium">61/100 · High Risk</div>
                <div className="w-1/6 text-zinc-400">4.82 GB</div>
                <div className="w-1/6 text-right text-zinc-500">11:42:08 UTC</div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between text-zinc-400">
                <div className="w-1/4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">folder_zip</span>
                  <span>core-transit-chi01.pcap</span>
                </div>
                <div className="w-1/6">IKEv2 / ESP (GCM-256)</div>
                <div className="w-1/6 text-teal-400">98/100 · Optimal</div>
                <div className="w-1/6">22.4 GB</div>
                <div className="w-1/6 text-right text-zinc-500">10:15:32 UTC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dimmed Ambient Backdrop Scrim */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-200 z-40 ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          id="backdrop-scrim"
          onClick={closeDrawer}
        ></div>

        {/* SLIDE-OUT CAPTURE DETAIL DRAWER */}
        <aside
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[500px] bg-[#111317] border-l border-zinc-800/90 z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          id="capture-drawer"
        >
          {/* Scrollable Drawer Interior */}
          <div className="flex-1 overflow-y-auto flex flex-col p-6 gap-6">

            {/* 1. HEADER SECTION */}
            <div className="flex flex-col gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-teal-400 text-[20px] shrink-0">draft</span>
                  <span className="font-mono text-sm text-white font-semibold truncate tracking-tight">branch-emea-gw04.pcap</span>
                  <span className="bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 uppercase">PCAP</span>
                </div>
                <button
                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                  title="Close drawer (Esc)"
                  type="button"
                  onClick={closeDrawer}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Ingestion / Timestamp Metadata */}
              <div className="font-mono text-xs text-zinc-500 flex items-center gap-2 flex-wrap">
                <span>Oct 24, 2025</span>
                <span>·</span>
                <span className="text-zinc-300 font-medium">11:42:08 UTC</span>
                <span>·</span>
                <span>Ingested via <span className="text-zinc-300">edge-collector-04</span></span>
              </div>

              {/* Prominent Score & Risk Badge Card */}
              <div className="mt-1 p-4 rounded-lg bg-[#0c0e11] border border-zinc-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs uppercase text-zinc-500">Security Score:</span>
                    <span className="font-display-serif text-2xl font-bold text-rose-400 tabular-nums">61</span>
                    <span className="font-mono text-xs text-zinc-500">/ 100</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span className="tracking-wide">HIGH RISK</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                  Negotiated legacy cipher transform and ephemeral key exchange omitted during CHILD_SA rekey.
                </p>
              </div>
            </div>

            {/* 2. SUMMARY SECTION */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-zinc-500 px-1">
                <span>Session Parameters</span>
                <span className="text-teal-400">Cryptographic Profile</span>
              </div>
              <div className="bg-[#0c0e11] rounded-lg border border-zinc-800/80 p-4 grid grid-cols-2 gap-y-4 gap-x-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase text-zinc-500">Protocol</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white font-medium">IKEv2</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">RFC 7296</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase text-zinc-500">Encapsulation</span>
                  <span className="font-mono text-xs text-white font-medium">Tunnel Mode (ESP)</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase text-zinc-500">Cipher Suite</span>
                  <span className="font-mono text-xs text-rose-400 font-medium">AES-128-CBC</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase text-zinc-500">Forward Secrecy</span>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded self-start bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[12px]">gpp_bad</span>
                    <span>PFS Disabled</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase text-zinc-500">Anti-Replay</span>
                  <span className="font-mono text-xs text-teal-400 font-medium">Replay Enabled (64 pkt)</span>
                </div>

                <div className="flex flex-col gap-1 col-span-2 pt-1 border-t border-zinc-800/60">
                  <span className="font-mono text-[10px] uppercase text-zinc-500">Tunnel Endpoints</span>
                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-200 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
                    <span className="material-symbols-outlined text-zinc-500 text-[14px]">router</span>
                    <span className="text-teal-400 font-medium">198.51.100.24</span>
                    <span className="text-zinc-600">⇄</span>
                    <span className="text-zinc-200 font-medium">203.0.113.88</span>
                    <span className="ml-auto font-mono text-[10px] text-zinc-500">UDP 4500 (NAT-T)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. PRIORITY FINDINGS SECTION */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-white">Top Findings</span>
                  <span className="font-mono text-xs text-zinc-500">(2)</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Highest Severity</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Item 1 */}
                <div className="bg-[#0c0e11] p-3.5 rounded-lg border border-zinc-800/80 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold">P1 HIGH</span>
                      <span className="text-xs font-medium text-white truncate">Perfect Forward Secrecy Disabled</span>
                    </div>
                    <span className="material-symbols-outlined text-rose-400 text-[16px]">report_problem</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    CHILD_SA rekeying negotiated without Diffie-Hellman group exchange in IKE_AUTH / CREATE_CHILD_SA.
                  </p>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 pt-1">
                    <span className="text-rose-400 font-medium">RFC 8247 §2.3 Violation</span>
                    <span>·</span>
                    <span>Passive decryption vulnerability</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="bg-[#0c0e11] p-3.5 rounded-lg border border-zinc-800/80 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-semibold">P2 MEDIUM</span>
                      <span className="text-xs font-medium text-white truncate">CBC-Mode Cipher Deployed</span>
                    </div>
                    <span className="material-symbols-outlined text-amber-400 text-[16px]">shield</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    CBC cipher suites vulnerable to padding oracle attacks in untrusted transit networks. RFC 8247 recommends AEAD (AES-GCM).
                  </p>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 pt-1">
                    <span className="text-teal-400">Recommended: AES-256-GCM (Transform ID 20)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. TRAFFIC SUMMARY SECTION */}
            <div className="flex flex-col gap-2 pb-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-white">Traffic Distribution</span>
                <span className="font-mono text-[10px] text-zinc-500">Flow Classifier</span>
              </div>
              <div className="bg-[#0c0e11] p-3.5 rounded-lg border border-zinc-800/80 flex flex-col gap-3">
                <div className="w-full h-2.5 bg-zinc-950 rounded flex overflow-hidden border border-zinc-800">
                  <div className="h-full bg-teal-500" style={{width: '72%'}} title="Video: 72%"></div>
                  <div className="h-full bg-sky-500" style={{width: '19%'}} title="Web: 19%"></div>
                  <div className="h-full bg-zinc-700" style={{width: '9%'}} title="Other: 9%"></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                      <span className="text-zinc-300 text-xs">Video</span>
                    </div>
                    <span className="font-display-serif text-sm text-teal-400 font-bold tabular-nums">72%</span>
                    <span className="font-mono text-[10px] text-zinc-500">3.47 GB</span>
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <span className="text-zinc-300 text-xs">Web</span>
                    </div>
                    <span className="font-display-serif text-sm text-sky-400 font-bold tabular-nums">19%</span>
                    <span className="font-mono text-[10px] text-zinc-500">915 MB</span>
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                      <span className="text-zinc-300 text-xs">Other</span>
                    </div>
                    <span className="font-display-serif text-sm text-zinc-400 font-bold tabular-nums">9%</span>
                    <span className="font-mono text-[10px] text-zinc-500">435 MB</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-800/60 font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-teal-400">analytics</span>
                  <span>4.82 GB observed across 18 ESP security associations</span>
                </div>
              </div>
            </div>

          </div>

          {/* 5. ACTIONS SECTION (Pinned at Drawer Bottom) */}
          <div className="p-4 bg-[#0c0e11] border-t border-zinc-800 flex flex-col gap-2.5 select-none">
            <button
              className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors shadow-md"
              type="button"
              onClick={openFullAnalysis}
            >
              <span>Open Full Analysis</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors font-mono"
                type="button"
                onClick={generateReport}
              >
                <span className="material-symbols-outlined text-[14px] text-zinc-400">description</span>
                <span>Generate Report</span>
              </button>
              <button
                className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors font-mono"
                type="button"
                onClick={compareCaptures}
              >
                <span className="material-symbols-outlined text-[14px] text-zinc-400">compare_arrows</span>
                <span>Compare...</span>
              </button>
            </div>
            <div className="flex items-center justify-center pt-1">
              <button
                className="font-mono text-[11px] text-zinc-500 hover:text-teal-400 transition-colors flex items-center gap-1"
                type="button"
                onClick={showHashModal}
              >
                <span className="material-symbols-outlined text-[12px]">tag</span>
                <span>Copy raw capture hash (SHA-256)</span>
              </button>
            </div>
          </div>
        </aside>
      </AppShell>
    </div>
  );
}

