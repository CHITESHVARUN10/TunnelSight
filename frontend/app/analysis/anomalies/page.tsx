"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";
import { getAnalysis, getAnomalies, type Analysis, type Window } from "@/lib/analysis";

export default function AnomaliesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const toast = useToast();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [engine, setEngine] = useState("if v1");
  const [threshold, setThreshold] = useState<number | null>(null);
  const anomalous = windows.filter((w) => w.is_anomaly);

  useEffect(() => {
    if (!analysisId) return;
    let dead = false;
    (async () => {
      try {
        const [a, an] = await Promise.all([getAnalysis(analysisId), getAnomalies(analysisId)]);
        if (!dead) {
          setAnalysis(a);
          setWindows(an.windows);
          setEngine(an.engine);
          setThreshold(an.threshold);
        }
      } catch (err) {
        if (!dead) toast({ title: "Anomalies unavailable", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
      }
    })();
    return () => {
      dead = true;
    };
  }, [analysisId, toast]);

  const adjustThreshold = () => toast({ title: "Threshold", body: "Use ?threshold= on the API to filter raw IF scores (lower = more anomalous).", kind: "info" });
  const exportVectors = () => {
    downloadFile(
      `${analysis?.filename ?? "anomaly"}-vectors.json`,
      JSON.stringify({ capture: analysis?.filename, engine, threshold, windows }, null, 2),
      "application/json"
    );
    toast({ title: "Vectors exported", body: "anomaly vectors downloaded.", kind: "ok" });
  };
  const filterWindow = () => toast({ title: "Window filter staged", body: "Focus locked to 02:10–02:40 (mock).", kind: "info" });
  const correlateRekey = () => toast({ title: "Correlation started", body: "IKE rekey events joined to W-28 (mock).", kind: "info" });
  const openVectorDrawer = () => toast({ title: "Feature vectors", body: "Full vector drawer is mocked in this prototype.", kind: "info" });
  if (!analysisId) {
    return (
      <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased">
        <AppShell active="">
          <div className="p-8 text-sm">No analysis selected. <Link className="underline" href="/analyze">Upload a capture</Link>.</div>
        </AppShell>
      </div>
    );
  }
  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="">

        {/* Top Forensic Breadcrumb & Filter Bar */}
        <div className="px-6 py-3.5 bg-[#111317] flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <Link href="/history" className="text-zinc-500 hover:text-zinc-300 transition-colors">Captures</Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                {analysis?.filename ?? "—"}
              </span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-200 font-medium">Anomaly Detection &amp; Baseline Drift</span>
            </nav>
            <span className="hidden sm:inline-block w-px h-3 bg-zinc-800"></span>
            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 font-mono text-[10px] uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              INFERRED — ML ANOMALY DETECTOR
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
              <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded">
                <span className="text-zinc-500">Engine:</span>
                <span className="text-zinc-200 font-medium">{engine}</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-500">Anomalous windows:</span>
                <span className="text-rose-400 font-medium">{anomalous.length}/{windows.length}</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">lower score = more anomalous</span>
              </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-colors font-mono flex items-center gap-1.5 text-xs"
                type="button"
                onClick={adjustThreshold}
              >
                <span className="material-symbols-outlined text-[14px] text-teal-400">tune</span>
                Threshold
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="px-6 bg-[#111317]/60 flex items-center justify-between border-b border-zinc-800/60">
          <div className="flex gap-1 overflow-x-auto py-2" id="subtab-container">
            <button
              className={activeTab === "all" ? "px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 text-teal-300 font-semibold flex items-center gap-1.5 border border-teal-500/30" : "px-3 py-1.5 text-xs font-mono rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors flex items-center gap-1.5"}
              data-tab="all"
              onClick={() => setActiveTab("all")}
            >
              <span className="material-symbols-outlined text-[15px]">multiline_chart</span>
              All Signals
            </button>
            <button
              className={activeTab === "timing" ? "px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 text-teal-300 font-semibold flex items-center gap-1.5 border border-teal-500/30" : "px-3 py-1.5 text-xs font-mono rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors flex items-center gap-1.5"}
              data-tab="timing"
              onClick={() => setActiveTab("timing")}
            >
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              Timing &amp; Volumetrics
            </button>
            <button
              className={activeTab === "direction" ? "px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 text-teal-300 font-semibold flex items-center gap-1.5 border border-teal-500/30" : "px-3 py-1.5 text-xs font-mono rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors flex items-center gap-1.5"}
              data-tab="direction"
              onClick={() => setActiveTab("direction")}
            >
              <span className="material-symbols-outlined text-[15px]">swap_vert</span>
              Directional Shift
            </button>
            <button
              className={activeTab === "size" ? "px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 text-teal-300 font-semibold flex items-center gap-1.5 border border-teal-500/30" : "px-3 py-1.5 text-xs font-mono rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors flex items-center gap-1.5"}
              data-tab="size"
              onClick={() => setActiveTab("size")}
            >
              <span className="material-symbols-outlined text-[15px]">bar_chart</span>
              Size Distribution
            </button>
            <button
              className={activeTab === "provenance" ? "px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 text-teal-300 font-semibold flex items-center gap-1.5 border border-teal-500/30" : "px-3 py-1.5 text-xs font-mono rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors flex items-center gap-1.5"}
              data-tab="provenance"
              onClick={() => setActiveTab("provenance")}
            >
              <span className="material-symbols-outlined text-[15px]">model_training</span>
              Model Provenance
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2 py-2 font-mono text-xs text-zinc-500">
            <span>Focus: Window W-28</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-300 font-medium">T+02:15:00 → T+02:20:00</span>
          </div>
        </div>

        {/* Primary Workspace Content */}
        <div className="p-6 flex flex-col gap-6">

          {/* LEVEL 1: Primary Posture Alert Banner */}
          <div className="relative overflow-hidden rounded-lg bg-[#111317] p-5 border border-zinc-800/90 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 shadow-xl">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-rose-500"></div>
            <div className="flex items-center gap-4 pl-2">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-rose-400 text-[22px]" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] uppercase tracking-wider font-bold">
                    ANOMALY DETECTED
                  </span>
                  <span className="font-mono text-xs text-rose-400 font-medium">Severity Level 4 (Critical)</span>
                  <span className="text-zinc-700">·</span>
                  <span className="font-mono text-xs text-zinc-400">Window Focus <strong className="text-teal-400 font-mono">W-28</strong> (T+02:15)</span>
                </div>
                <p className="text-zinc-300 max-w-2xl text-xs leading-relaxed">
                  Encrypted traffic demonstrates severe baseline deviation with acute volume surge and cadence desynchronization relative to the learned profile.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 bg-[#0c0e11] px-5 py-3 rounded-lg border border-zinc-800">
              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Anomaly Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display-serif text-3xl leading-tight font-bold text-rose-400 tabular-nums">0.91</span>
                  <span className="font-mono text-xs text-zinc-500">/ 1.00</span>
                </div>
                <span className="font-mono text-[11px] text-rose-400/90 font-medium">Threshold τ = 0.72 (+0.19)</span>
              </div>
              <div className="h-10 w-px bg-zinc-800"></div>
              <div className="flex flex-col gap-1.5">
                <button
                  className="px-3 py-1.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 font-mono text-xs font-semibold transition-colors flex items-center gap-1.5"
                  type="button"
                  onClick={exportVectors}
                >
                  <span className="material-symbols-outlined text-[15px] text-teal-400">file_download</span>
                  Export Vectors (.json)
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] transition-colors flex items-center gap-1"
                    type="button"
                    onClick={filterWindow}
                  >
                    <span className="material-symbols-outlined text-[13px] text-zinc-400">zoom_in</span>
                    Focus W-28
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] transition-colors flex items-center gap-1"
                    type="button"
                    onClick={correlateRekey}
                  >
                    <span className="material-symbols-outlined text-[13px] text-zinc-400">vpn_key_alert</span>
                    Correlate Rekey
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: Time-Series Anomaly Timeline */}
          <div className="flex flex-col bg-[#111317] rounded-lg p-5 border border-zinc-800/90">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">timeline</span>
                  Sliding Window Anomaly Score
                </span>
                <span className="font-mono text-xs text-zinc-500">Capture Span: 00:00 → 04:12 (Δ 252s)</span>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-teal-400 inline-block"></span>
                  <span className="text-zinc-400">Baseline Range (0.05-0.22)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t border-dashed border-rose-400 inline-block"></span>
                  <span className="text-rose-400 font-medium">Trigger Threshold (τ = 0.72)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                  <span className="text-zinc-200">Spike Peak: 0.91</span>
                </div>
              </div>
            </div>

            {/* Time Series Interactive Graph Container */}
            <div className="relative w-full h-44 bg-[#0c0e11] rounded border border-zinc-800/80 flex flex-col justify-between p-3 overflow-hidden select-none">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                <div className="border-b border-zinc-700 w-full"></div>
                <div className="border-b border-zinc-700 w-full"></div>
                <div className="border-b border-zinc-700 w-full"></div>
                <div className="border-b border-zinc-700 w-full"></div>
              </div>

              {/* Axis Labels */}
              <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between font-mono text-[10px] text-zinc-500 pointer-events-none">
                <span>1.0</span>
                <span className="text-rose-400">0.72</span>
                <span>0.5</span>
                <span className="text-teal-400">0.1</span>
                <span>0.0</span>
              </div>

              {/* Threshold Reference Line (0.72) */}
              <div className="absolute left-8 right-3 top-[28%] border-t border-dashed border-rose-500/70 flex items-center justify-end pointer-events-none">
                <span className="font-mono text-[10px] text-rose-400 bg-[#0c0e11] px-1.5 -mt-2 border border-rose-500/30 rounded">Threshold τ=0.72</span>
              </div>

              {/* Nominal Band Underlay (0.05 - 0.22) */}
              <div className="absolute left-8 right-3 bottom-[8%] h-[18%] bg-teal-500/5 pointer-events-none border-t border-b border-teal-500/10"></div>

              {/* Sparkline SVG */}
              <div className="relative w-full h-full pl-8">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 900 120">
                  <defs>
                    <linearGradient id="anomalyGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25"></stop>
                      <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.05"></stop>
                      <stop offset="100%" stopColor="#0c0e11" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  {/* Gradient Area */}
                  <path
                    d="M 0 105 L 40 104 L 80 106 L 120 102 L 160 104 L 200 103 L 240 102 L 280 104 L 320 101 L 360 98 L 400 95 L 430 75 L 460 22 L 490 12 L 520 28 L 550 50 L 580 60 L 610 58 L 650 62 L 690 68 L 730 85 L 770 94 L 810 98 L 850 101 L 900 102 L 900 120 L 0 120 Z"
                    fill="url(#anomalyGradient)"
                  ></path>
                  {/* Trajectory Line */}
                  <path
                    d="M 0 105 L 40 104 L 80 106 L 120 102 L 160 104 L 200 103 L 240 102 L 280 104 L 320 101 L 360 98 L 400 95 L 430 75 L 460 22 L 490 12 L 520 28 L 550 50 L 580 60 L 610 58 L 650 62 L 690 68 L 730 85 L 770 94 L 810 98 L 850 101 L 900 102"
                    fill="none"
                    stroke="#14b8a6"
                    strokeLinecap="round"
                    strokeWidth="1.75"
                  ></path>
                  {/* Critical Spike Segment Over Threshold */}
                  <path
                    d="M 438 65 L 460 22 L 490 12 L 520 28 L 542 45"
                    fill="none"
                    stroke="#f43f5e"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  ></path>
                  {/* Highlight Peak Dot at W-28 */}
                  <circle className="animate-pulse" cx="490" cy="12" fill="#f43f5e" r="4.5"></circle>
                  <circle cx="490" cy="12" fill="none" opacity="0.6" r="8" stroke="#f43f5e" strokeWidth="1"></circle>
                  {/* Secondary Points */}
                  <circle cx="580" cy="60" fill="#38bdf8" r="2.5"></circle>
                  <circle cx="610" cy="58" fill="#38bdf8" r="2.5"></circle>
                </svg>

                {/* Active Focus Indicator (Window W-28) */}
                <div className="absolute left-[51%] top-0 bottom-0 w-20 -ml-10 bg-teal-500/10 border-x border-teal-500/40 pointer-events-none flex flex-col justify-start items-center">
                  <div className="bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded shadow text-center -mt-2">
                    <span className="font-mono text-[10px] text-teal-400 font-bold block whitespace-nowrap">W-28 (02:15 - 02:20)</span>
                    <span className="font-mono text-[9px] text-rose-400 font-semibold">PEAK 0.91</span>
                  </div>
                </div>
              </div>

              {/* Timeline Bottom Ticks */}
              <div className="flex justify-between items-center text-zinc-500 font-mono text-[10px] pl-8 pt-2 border-t border-zinc-800">
                <span>00:00 (W-01)</span>
                <span>00:45 (W-09)</span>
                <span>01:30 (W-18)</span>
                <span className="text-teal-400 font-semibold">02:15 [Window W-28]</span>
                <span>03:00 (W-36)</span>
                <span>03:45 (W-45)</span>
                <span>04:12 (END)</span>
              </div>
            </div>

            {/* Phase Description Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-zinc-900 border-l-2 border-teal-400 border border-zinc-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Windows W-01 → W-25</span>
                  <span className="text-zinc-200 font-medium">Nominal Baseline Envelope</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-semibold">0.08 - 0.14</span>
              </div>
              <div className="p-2.5 rounded bg-rose-950/20 border-l-2 border-rose-500 border border-rose-500/30 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-rose-400 text-[10px] uppercase tracking-wider font-bold">Windows W-26 → W-31</span>
                  <span className="text-zinc-200 font-medium">Acute Inverted Burst Spike</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold">PEAK 0.91 [CRITICAL]</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border-l-2 border-sky-400 border border-zinc-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Windows W-32 → W-42</span>
                  <span className="text-zinc-200 font-medium">Post-Spike Residual Elevation</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 text-[10px] font-semibold">0.44 - 0.58</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Observed vs. Baseline Telemetry Matrix (Level 2) */}
          <div className="flex flex-col bg-[#111317] rounded-lg border border-zinc-800/90 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">table_rows</span>
                  Observed vs. Learned Baseline Telemetry
                </span>
                <span className="text-zinc-700 font-mono">|</span>
                <span className="font-mono text-xs text-zinc-400">
                  Active Comparison: <strong className="text-teal-400 font-mono">W-28</strong> (T+02:15:00 → T+02:20:00)
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-zinc-500">Statistical Mode:</span>
                <span className="text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">Student-t / 3σ Bound</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800 h-9 select-none">
                    <th className="px-4 py-2 font-semibold font-sans">Metric Dimension</th>
                    <th className="px-4 py-2 font-semibold">Learned Baseline</th>
                    <th className="px-4 py-2 font-semibold">Observed (W-28)</th>
                    <th className="px-4 py-2 font-semibold">Delta / Deviation</th>
                    <th className="px-4 py-2 font-semibold text-right">Risk State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans text-white font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Packet Size Variance
                    </td>
                    <td className="px-4 py-3 text-zinc-400">840B ± 120B</td>
                    <td className="px-4 py-3 text-rose-400 font-bold bg-rose-950/10">1,420B Fixed</td>
                    <td className="px-4 py-3 text-rose-400 font-semibold">+69% MSS Saturation</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] uppercase font-bold">CRITICAL</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans text-white font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Inter-Arrival Jitter
                    </td>
                    <td className="px-4 py-3 text-zinc-400">12.4 ms</td>
                    <td className="px-4 py-3 text-rose-400 font-bold bg-rose-950/10">0.002 ms</td>
                    <td className="px-4 py-3 text-rose-400 font-semibold">Continuous Burst Lock</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] uppercase font-bold">ANOMALOUS</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans text-white font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Egress Throughput
                    </td>
                    <td className="px-4 py-3 text-zinc-400">1.2 MB/s</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">8.4 MB/s</td>
                    <td className="px-4 py-3 text-amber-400 font-semibold">+600% Spike</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] uppercase font-bold">HIGH</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans text-white font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>Entropy Distribution
                    </td>
                    <td className="px-4 py-3 text-zinc-400">7.92 bits</td>
                    <td className="px-4 py-3 text-teal-400 font-medium">7.98 bits</td>
                    <td className="px-4 py-3 text-teal-300">Nominal ESP Ciphertext</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono text-[10px] uppercase font-bold">NORMAL</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans text-white font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>SA Rekey Dispersion
                    </td>
                    <td className="px-4 py-3 text-zinc-400">3,600s cadence</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">Rekey Suppressed</td>
                    <td className="px-4 py-3 text-amber-400 font-semibold">IKEv2 Timer Exceeded</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] uppercase font-bold">VIOLATION</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: Evidence-Grounded Explainability & SHAP Attribution (Level 3) */}
          <div className="flex flex-col bg-[#111317] rounded-lg p-5 border border-zinc-800/90">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">psychology</span>
                  Detection Explainability &amp; SHAP Vector Attribution
                </span>
                <p className="text-xs text-zinc-400 mt-1">
                  Mathematical breakdown of individual feature influence contributing to the combined 0.91 outlier score.
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-zinc-500">Algorithm:</span>
                  <span className="text-teal-400">TreeSHAP (150 trees)</span>
                </div>
                <button
                  className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-teal-400 font-mono flex items-center gap-1.5 transition-colors"
                  type="button"
                  onClick={openVectorDrawer}
                >
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  Feature Vector Drawer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0c0e11] p-4 rounded-lg border border-zinc-800/80 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-400 text-[16px]">lock_clock</span>
                    <span className="font-medium text-white text-xs">Continuous Flow Lock</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold">+28% SHAP</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded overflow-hidden">
                  <div className="bg-rose-500 h-full rounded" style={{width: '28%'}}></div>
                </div>
                <p className="text-xs text-zinc-400 truncate">Uninterrupted packet stream with &lt;0.005ms jitter breaks standard client cadence.</p>
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>Variance: ±3.82σ</span>
                  <span className="text-rose-400 font-medium">Primary Cadence Driver</span>
                </div>
              </div>

              <div className="bg-[#0c0e11] p-4 rounded-lg border border-zinc-800/80 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-[16px]">speed</span>
                    <span className="font-medium text-white text-xs">Egress Velocity Surge</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold">+24% SHAP</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded overflow-hidden">
                  <div className="bg-amber-400 h-full rounded" style={{width: '24%'}}></div>
                </div>
                <p className="text-xs text-zinc-400 truncate">Egress throughput accelerated to 8.4 MB/s (600% delta above 1.2 MB/s expected mean).</p>
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>Delta: +7.2 MB/s</span>
                  <span className="text-amber-400 font-medium">Volume Outlier</span>
                </div>
              </div>

              <div className="bg-[#0c0e11] p-4 rounded-lg border border-zinc-800/80 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[16px]">compress</span>
                    <span className="font-medium text-white text-xs">Packet-Size Clustering</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono text-xs font-bold">+19% SHAP</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded overflow-hidden">
                  <div className="bg-teal-400 h-full rounded" style={{width: '19%'}}></div>
                </div>
                <p className="text-xs text-zinc-400 truncate">MSS rigidification collapsed packets into static 1,420B units without bimodal dispersion.</p>
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>Size: 1,420B Fixed</span>
                  <span className="text-teal-400 font-medium">Size Rigidification</span>
                </div>
              </div>

              <div className="bg-[#0c0e11] p-4 rounded-lg border border-zinc-800/80 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-zinc-400 text-[16px]">update_disabled</span>
                    <span className="font-medium text-white text-xs">Rekey Timing Deviation</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs font-bold">+11% SHAP</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded overflow-hidden">
                  <div className="bg-zinc-600 h-full rounded" style={{width: '11%'}}></div>
                </div>
                <p className="text-xs text-zinc-400 truncate">IKE Security Association rekey negotiation bypassed despite high cumulative byte counter.</p>
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span>State: Expired Interval</span>
                  <span className="text-zinc-300 font-medium">Protocol Drift</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Metadata Footer */}
          <details className="group bg-[#111317] rounded-lg border border-zinc-800/90 font-mono text-xs overflow-hidden">
            <summary className="cursor-pointer select-none p-3.5 bg-zinc-900/60 hover:bg-zinc-800/40 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-300">
                <span className="material-symbols-outlined text-[16px] text-teal-400">verified</span>
                <span className="text-zinc-500">Model &amp; Pipeline:</span>
                <span className="text-zinc-200 font-medium">Isolation Forest (150 trees)</span>
                <span className="text-zinc-700">·</span>
                <span className="text-teal-400">Edge-48h Profile</span>
                <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-semibold border border-teal-500/20">dpdk-lcore-02</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                <span>Hyperparameters &amp; Provenance</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-open:rotate-180">expand_more</span>
              </div>
            </summary>
            <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 text-zinc-400 bg-[#0c0e11]">
              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <span>Samples: <code className="text-zinc-200 font-mono">512 (sub=0.8)</code></span>
                <span className="text-zinc-700">|</span>
                <span>Metric: <code className="text-zinc-200 font-mono">Mahalanobis + Tree Depth Norm</code></span>
                <span className="text-zinc-700">|</span>
                <span>Contamination: <code className="text-zinc-200 font-mono">0.015</code></span>
                <span className="text-zinc-700">|</span>
                <span>Baseline Volume: <code className="text-teal-400 font-mono">14.8M packets</code></span>
              </div>
              <div className="text-[11px] text-teal-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>Ring Buffer Drops: 0
              </div>
            </div>
          </details>
        </div>
      </AppShell>
    </div>
  );
}
