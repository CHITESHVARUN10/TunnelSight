"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBehavior } from "@/components/upload/ProgressBehavior";
import { AppShell } from "@/components/layout/AppShell";

export default function AnalysisProgressPage() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [terminalCleared, setTerminalCleared] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<"details" | "tty">("details");
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  function togglePause() {
    setIsPaused((p) => !p);
  }

  function cancelAnalysis() {
    if (window.confirm("Are you sure you want to terminate the active forensic pipeline? Intermediate memory states will be discarded.")) {
      setCancelled(true);
      router.push("/analyze");
    }
  }

  function clearTerminal() {
    setTerminalCleared(true);
  }

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <ProgressBehavior pausedRef={pausedRef} />
      <AppShell active="">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Subheader Operational Control Strip & File Identity */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <div className="flex items-center gap-2 bg-[#111317] border border-zinc-800 px-3 py-1.5 rounded">
                <span className="material-symbols-outlined text-teal-400 text-base">folder_zip</span>
                <span className="font-mono text-xs text-zinc-200 font-semibold tracking-tight">core-dc-chicago-gw1.pcap</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span>VOL: <strong className="text-zinc-200 font-normal">1.42 GB</strong></span>
                <span className="text-zinc-700">/</span>
                <span>INGEST: <strong className="text-zinc-200 font-normal">14:18:22 UTC</strong></span>
                <span className="text-zinc-700">/</span>
                <span>SESSION: <strong className="text-zinc-200 font-normal">#8820-A</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/25 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-teal-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                PIPELINE ACTIVE
              </div>
            </div>

            {/* Primary Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                  isPaused
                    ? "bg-teal-500/15 border-teal-500/40 text-teal-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                }`}
                id="pauseBtn"
                onClick={togglePause}
                type="button"
              >
                <span className="material-symbols-outlined text-base" id="pauseIcon">
                  {isPaused ? "play_arrow" : "pause"}
                </span>
                <span id="pauseLabel">{isPaused ? "Resume" : "Pause"}</span>
              </button>
              <button
                className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded text-rose-400 transition-colors text-xs font-mono"
                onClick={cancelAnalysis}
                type="button"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
                <span>Cancel</span>
              </button>
              <div className="h-4 w-px bg-zinc-800 mx-1"></div>
              <button
                className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 px-3.5 py-1.5 rounded text-xs font-mono font-semibold transition-colors shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-base">stream</span>
                <span>Inspect Partial Results</span>
              </button>
            </div>
          </div>

          {/* Overall Aggregate Forensic Progress Card */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <h1 className="font-display-serif text-xl md:text-2xl text-zinc-100 tracking-tight">
                    Forensic Decapsulation &amp; Verification
                  </h1>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      cancelled ? "text-rose-400" : "text-teal-400"
                    }`}
                    id="globalPercentText"
                  >
                    {cancelled ? "PIPELINE ABORTED" : "69% COMPLETE"}
                  </span>
                </div>
                <p className="font-mono text-xs text-zinc-500">
                  ETA:{" "}
                  <span className="text-zinc-300 font-medium" id="etaTimer">
                    {cancelled ? "Analysis cancelled by operator" : "~13s remaining"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Throughput</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-teal-400 font-semibold text-sm" id="rxRate">48,010</span>
                    <span className="text-zinc-500 text-[11px]">pkts/sec</span>
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Ingested Total</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-zinc-200 font-semibold text-sm">842,109</span>
                    <span className="text-zinc-500 text-[11px]">pkts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden flex border border-zinc-800/60">
              <div
                className={`${
                  cancelled ? "bg-rose-500" : "bg-teal-500"
                } h-full transition-all duration-500 ease-out`}
                id="globalProgressBar"
                style={{ width: "69%" }}
              ></div>
              <div className="bg-teal-400/30 h-full w-4 animate-pulse"></div>
            </div>
          </div>

          {/* Multi-Pane Execution & Progressive Telemetry Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
            {/* Left Column: Streamlined 11 Pipeline Stages (7 cols) */}
            <div className="xl:col-span-7 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Pipeline Topology</span>
                  <span className="text-zinc-700 font-mono text-xs">/</span>
                  <span className="font-mono text-xs text-zinc-400">11 Verification Passes</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> 6 Complete
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> 2 Running
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> 1 Warning
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span> 2 Pending
                  </span>
                </div>
              </div>

              {/* Stages List */}
              <div className="space-y-1.5">
                {/* Stage 01 */}
                <div className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-500 font-semibold w-5">01</span>
                    <span className="text-xs text-zinc-200 font-medium truncate">PCAP Ingestion &amp; Magic Header Verification</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                    <span className="text-zinc-600 hidden sm:inline">112ms</span>
                    <span className="bg-teal-500/10 text-teal-400 text-[10px] px-2 py-0.5 rounded border border-teal-500/20 font-semibold uppercase tracking-wider">
                      COMPLETE
                    </span>
                  </div>
                </div>

                {/* Stage 02 */}
                <div className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-500 font-semibold w-5">02</span>
                    <span className="text-xs text-zinc-200 font-medium truncate">DPDK Packet Parsing &amp; Framing</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                    <span className="text-zinc-600 hidden sm:inline">480ms</span>
                    <span className="bg-teal-500/10 text-teal-400 text-[10px] px-2 py-0.5 rounded border border-teal-500/20 font-semibold uppercase tracking-wider">
                      COMPLETE
                    </span>
                  </div>
                </div>

                {/* Stage 03 */}
                <div className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-500 font-semibold w-5">03</span>
                    <span className="text-xs text-zinc-200 font-medium truncate">IKE Detection &amp; SA Handshake Extraction</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                    <span className="text-zinc-600 hidden sm:inline">210ms</span>
                    <span className="bg-teal-500/10 text-teal-400 text-[10px] px-2 py-0.5 rounded border border-teal-500/20 font-semibold uppercase tracking-wider">
                      COMPLETE
                    </span>
                  </div>
                </div>

                {/* Stage 04 */}
                <div className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-500 font-semibold w-5">04</span>
                    <span className="text-xs text-zinc-200 font-medium truncate">ESP/AH Decapsulation &amp; Integrity Inspection</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                    <span className="text-zinc-600 hidden sm:inline">1.84s</span>
                    <span className="bg-teal-500/10 text-teal-400 text-[10px] px-2 py-0.5 rounded border border-teal-500/20 font-semibold uppercase tracking-wider">
                      COMPLETE
                    </span>
                  </div>
                </div>

                {/* Stage 05 */}
                <div className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-500 font-semibold w-5">05</span>
                    <span className="text-xs text-zinc-200 font-medium truncate">IPsec Protocol Normalization</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                    <span className="text-zinc-600 hidden sm:inline">340ms</span>
                    <span className="bg-teal-500/10 text-teal-400 text-[10px] px-2 py-0.5 rounded border border-teal-500/20 font-semibold uppercase tracking-wider">
                      COMPLETE
                    </span>
                  </div>
                </div>

                {/* Stage 06: WARNING */}
                <div className="bg-[#181315] border border-rose-500/40 rounded px-4 py-2.5 flex flex-col gap-1.5 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-rose-400 font-semibold w-5">06</span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-xs text-zinc-100 font-medium truncate">Deterministic Security Assessment</span>
                        <span className="material-symbols-outlined text-rose-400 text-sm">warning</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                      <span className="text-zinc-600 hidden sm:inline">590ms</span>
                      <span className="bg-rose-500/15 text-rose-300 text-[10px] px-2 py-0.5 rounded border border-rose-500/30 font-semibold uppercase tracking-wider">
                        WARNING
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono pl-8 text-rose-400/90">
                    <span className="truncate">Weak MODP-1024 / DH Group 2 flagged in 3 proposals</span>
                    <Link href="/analysis/findings" className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[11px] flex-shrink-0">
                      View Evidence <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                {/* Stage 07 */}
                <div className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-500 font-semibold w-5">07</span>
                    <span className="text-xs text-zinc-200 font-medium truncate">Encrypted Flow Segmentation &amp; Windowing</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                    <span className="text-zinc-600 hidden sm:inline">620ms</span>
                    <span className="bg-teal-500/10 text-teal-400 text-[10px] px-2 py-0.5 rounded border border-teal-500/20 font-semibold uppercase tracking-wider">
                      COMPLETE
                    </span>
                  </div>
                </div>

                {/* Stage 08: ACTIVE / INSPECTED */}
                <div className="bg-[#14171c] border border-teal-500/60 rounded px-4 py-2.5 flex flex-col gap-2 shadow-[0_0_15px_rgba(20,184,166,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-teal-400 font-bold w-5">08</span>
                      <span className="text-xs text-zinc-100 font-semibold truncate">ML Encrypted Traffic Classification</span>
                      <span className="bg-teal-500/15 text-teal-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-teal-500/30 uppercase tracking-wider hidden sm:inline">
                        INSPECTING
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                      <span className="text-teal-400 font-semibold">71%</span>
                      <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 rounded border border-teal-500/30 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> RUNNING
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded overflow-hidden">
                    <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: "71%" }}></div>
                  </div>
                </div>

                {/* Stage 09: RUNNING */}
                <div className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex flex-col gap-2 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-zinc-500 font-bold w-5">09</span>
                      <span className="text-xs text-zinc-200 font-medium truncate">Anomaly &amp; Tunnel Sequence Detection</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                      <span className="text-cyan-400 font-semibold">42%</span>
                      <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded border border-cyan-500/30 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> RUNNING
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded overflow-hidden">
                    <div className="bg-cyan-500/80 h-full transition-all duration-300" style={{ width: "42%" }}></div>
                  </div>
                </div>

                {/* Stage 10: PENDING */}
                <div className="bg-[#0f1115] border border-zinc-800/40 rounded px-4 py-2.5 flex items-center justify-between gap-3 opacity-60">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-600 w-5">10</span>
                    <span className="text-xs text-zinc-400 truncate">Evidence-Grounded AI Explanation</span>
                  </div>
                  <span className="bg-zinc-800/80 text-zinc-500 font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    PENDING
                  </span>
                </div>

                {/* Stage 11: PENDING */}
                <div className="bg-[#0f1115] border border-zinc-800/40 rounded px-4 py-2.5 flex items-center justify-between gap-3 opacity-60">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-zinc-600 w-5">11</span>
                    <span className="text-xs text-zinc-400 truncate">RFC Forensic Audit &amp; Report Generation</span>
                  </div>
                  <span className="bg-zinc-800/80 text-zinc-500 font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    PENDING
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Focused Telemetry & Progressive Detail Inspection (5 cols) */}
            <div className="xl:col-span-5 flex flex-col space-y-4">
              {/* Macro Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Packets Processed</span>
                  <div className="font-display-serif text-2xl text-zinc-100">842,109</div>
                  <span className="text-[11px] font-mono text-teal-400 block">96.4% ESP Payload</span>
                </div>
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Encrypted Flows</span>
                  <div className="font-display-serif text-2xl text-teal-400">24</div>
                  <span className="text-[11px] font-mono text-zinc-500 block">5.0s Window Size</span>
                </div>
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Anomaly Flags</span>
                  <div className="font-display-serif text-2xl text-rose-400">3</div>
                  <span className="text-[11px] font-mono text-rose-400/80 block">1 High, 2 Moderate</span>
                </div>
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">RX Throughput</span>
                  <div className="font-display-serif text-2xl text-zinc-100">48.0k</div>
                  <span className="text-[11px] font-mono text-teal-400 block">0 Drops Logged</span>
                </div>
              </div>

              {/* Stage 08 Inspection Pane */}
              <div className="p-4 rounded-lg bg-[#111317] border border-zinc-800/80 space-y-4 flex-1">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-base">insights</span>
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
                      Stage 08: ML Classification
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <button
                      type="button"
                      className={`px-2.5 py-1 rounded transition-colors ${
                        inspectorTab === "details"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      onClick={() => setInspectorTab("details")}
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      className={`px-2.5 py-1 rounded transition-colors ${
                        inspectorTab === "tty"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      onClick={() => setInspectorTab("tty")}
                    >
                      TTY
                    </button>
                  </div>
                </div>

                {/* Stage 08 Telemetry & Feature Progress */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Feature Vectors</span>
                    <div className="text-zinc-200 font-semibold">184 / 256</div>
                    <span className="text-teal-400 text-[11px] block">71.8% Converged</span>
                  </div>
                  <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Inferred Overlay</span>
                    <div className="text-zinc-200 font-semibold">WireGuard/ESP</div>
                    <span className="text-teal-400 text-[11px] block">98.2% Confidence</span>
                  </div>
                </div>

                {/* Shannon Byte Entropy Quick Glance */}
                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 uppercase text-[10px]">Entropy Variance (ESP Windows)</span>
                    <span className="text-teal-400">7.994 bits/byte</span>
                  </div>
                  <div className="h-4 w-full flex items-end gap-1 pt-1">
                    <div className="flex-1 bg-teal-500/50 rounded-t h-full"></div>
                    <div className="flex-1 bg-teal-500/60 rounded-t h-full"></div>
                    <div className="flex-1 bg-teal-500/70 rounded-t h-full"></div>
                    <div className="flex-1 bg-teal-500/80 rounded-t h-full"></div>
                    <div className="flex-1 bg-rose-500/80 rounded-t h-2/3" title="Entropy Dip in Flow #08"></div>
                    <div className="flex-1 bg-teal-500/90 rounded-t h-full"></div>
                    <div className="flex-1 bg-teal-500 h-full rounded-t"></div>
                    <div className="flex-1 bg-teal-500 h-full rounded-t"></div>
                  </div>
                </div>

                {/* Worker Stream TTY Log */}
                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800 flex flex-col min-h-[190px] space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/80 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-zinc-500 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-xs">terminal</span>
                      <span>Worker Stream (4 Cores)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                      <span className="text-teal-400 font-semibold">LIVE</span>
                      <button
                        className="text-zinc-600 hover:text-zinc-300 ml-2 uppercase text-[10px]"
                        onClick={clearTerminal}
                        type="button"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div
                    className="flex-1 font-mono text-[11px] overflow-y-auto space-y-1 text-zinc-400 select-text pr-1"
                    id="terminalStream"
                  >
                    {!terminalCleared && (
                      <>
                        <div className="text-zinc-600">14:18:22.004 [system] Initiated DPDK ring buffer bind on core [0,1,2,3]</div>
                        <div className="text-zinc-300">14:18:22.380 [worker-01] IKE_SA_INIT detected: SPIi=0x8fa10c0291, SPIr=0x0000000000</div>
                        <div className="text-rose-400">14:18:22.990 [worker-02] WARN: Fallback SA proposal contains MODP-1024 (Group 2)</div>
                        <div className="text-zinc-300">14:18:23.511 [worker-03] ESP SPI 0x41f89c02: sequence counter 1042 verified</div>
                        <div className="text-teal-400">14:18:24.015 [ml-worker-1] Feature vector compiled: flow #08, entropy=7.998</div>
                        <div className="text-teal-300">14:18:24.320 [ml-worker-2] Traffic category: IPsec/WireGuard overlay (98.2%)</div>
                      </>
                    )}
                    <div className="text-teal-400 animate-pulse" id="terminalLiveLine">
                      14:18:24.712 [worker-02] Sequence counter initialized. Window check running...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

