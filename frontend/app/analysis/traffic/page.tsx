"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";
import { getAnalysis, getTraffic, getWindows, type Analysis, type Window } from "@/lib/analysis";

function winLabel(id: number) {
  return `W-${String(id + 1).padStart(2, "0")}`;
}

export default function TrafficIntelligencePage() {
  const toast = useToast();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [mix, setMix] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!analysisId) return;
    let dead = false;
    (async () => {
      try {
        const [a, t, w] = await Promise.all([getAnalysis(analysisId), getTraffic(analysisId), getWindows(analysisId)]);
        if (!dead) {
          setAnalysis(a);
          setMix(t.mix);
          setWindows(w);
        }
      } catch (err) {
        if (!dead) toast({ title: "Traffic unavailable", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
      }
    })();
    return () => {
      dead = true;
    };
  }, [analysisId, toast]);

  const active = windows.find((w) => w.window_id === selected) ?? windows[0];
  const mixEntries = Object.entries(mix).sort((a, b) => b[1] - a[1]);
  const colors = ["bg-teal-500", "bg-sky-500", "bg-amber-500", "bg-zinc-600", "bg-violet-500"];
  const activeId = winLabel(active?.window_id ?? selected);
  if (!analysisId) {
    return (
      <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased">
        <AppShell active="/analysis/traffic">
          <div className="p-8 text-sm">No analysis selected. <Link className="underline" href="/analyze">Upload a capture</Link>.</div>
        </AppShell>
      </div>
    );
  }
  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/analysis/traffic">

        {/* Sub-Header / Breadcrumb & Telemetry Context Bar */}
        <div className="flex flex-col gap-3 bg-[#111317] px-6 py-3.5 border-b border-zinc-800/80 select-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <Link href="/history" className="text-zinc-500 hover:text-zinc-300 transition-colors">Captures</Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">{analysis?.filename ?? "—"}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-200 font-medium">Encrypted Traffic Intelligence &amp; Flow ML</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
                <span className="material-symbols-outlined text-zinc-500 text-[14px]">schedule</span>
                <span className="font-mono text-xs text-zinc-400">Capture:</span>
                <span className="font-mono text-xs text-zinc-200 font-medium">00:00:00 - 00:04:12</span>
              </div>
              <button
                className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-xs font-mono"
                type="button"
                onClick={() => toast({ title: "SPI 0xC3E8019A", body: "ESP flow · 24 SAs tracked · DPDK RX online.", kind: "info" })}
              >
                <span className="material-symbols-outlined text-[14px] text-teal-400">tune</span>
                <span>SPI: 0xC3E8019A</span>
              </button>
              <button
                className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded text-teal-300 hover:bg-teal-500/20 transition-colors text-xs font-mono font-medium"
                type="button"
                onClick={() => { downloadFile(`${analysis?.filename ?? "traffic"}-intelligence.json`, JSON.stringify({ capture: analysis?.filename, mix, windows }, null, 2)); toast({ title: "Traffic intel exported", body: "traffic-intelligence.json downloaded.", kind: "ok" }); }}
              >
                <span className="material-symbols-outlined text-[14px]">file_download</span>
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs text-zinc-400">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>FLOWS: <span className="font-semibold text-teal-300 ml-1">24 CONCURRENT</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                WINDOW: <span className="text-zinc-200 font-medium ml-1">5.0s</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                MODEL: <span className="text-zinc-200 font-medium ml-1">RF+GB Ensemble v2.4</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-[11px]">
              <span className="material-symbols-outlined text-zinc-500 text-[14px]">lock</span>
              <span className="uppercase tracking-wider">[ZERO PAYLOAD DECRYPTION]</span>
            </div>
          </div>
        </div>

        {/* Content Workspace */}
        <div className="flex flex-col gap-6 p-6">

          {/* LEVEL 1: OVERALL CLASSIFICATION & SUMMARY */}
          <section className="flex flex-col gap-5 bg-[#111317] p-5 rounded-lg border border-zinc-800/90">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">Level 1 • Global Behavioral Mixture</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs text-teal-400">SPI: 0xC3E8019A (ESP)</span>
                </div>
                <h1 className="text-xl font-semibold text-white tracking-tight mt-1">Macro Behavioral Profile &amp; Traffic Mixture</h1>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="block font-mono text-[10px] text-zinc-500 uppercase">Anomaly Score</span>
                  <span className="font-display-serif text-lg text-teal-400 font-bold tabular-nums">0.12 (NOMINAL)</span>
                </div>
                <div className="h-8 w-px bg-zinc-800"></div>
                <div>
                  <span className="block font-mono text-[10px] text-zinc-500 uppercase">Mean Rate</span>
                  <span className="font-display-serif text-lg text-white font-bold tabular-nums">4.52 MB/s</span>
                </div>
                <div className="h-8 w-px bg-zinc-800"></div>
                <div>
                  <span className="block font-mono text-[10px] text-zinc-500 uppercase">Tunnel Volume</span>
                  <span className="font-display-serif text-lg text-white font-bold tabular-nums">1.42 GB <span className="text-zinc-500 text-xs font-normal">/ 842k pkts</span></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Multi-segment Mixture Bar */}
              <div className="h-3 w-full rounded-md bg-zinc-950 flex overflow-hidden border border-zinc-800/80">
                {mixEntries.map(([label, ratio], i) => (
                  <div key={label} className={`h-full ${colors[i % colors.length]} relative cursor-pointer transition-opacity hover:opacity-90`} style={{ width: `${Math.round(ratio * 100)}%` }} title={`${label}: ${Math.round(ratio * 100)}%`}></div>
                ))}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {mixEntries.map(([label, ratio], i) => (
                  <div key={label} className="flex items-center justify-between bg-[#0c0e11] px-4 py-2.5 rounded border border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`}></span>
                      <span className="font-medium text-white text-xs capitalize">{label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-teal-300 font-semibold">{Math.round(ratio * 100)}%</span>
                    </div>
                  </div>
                ))}
                {mixEntries.length === 0 && <span className="text-xs font-mono text-zinc-500">No windows yet.</span>}
              </div>
            </div>
          </section>

          {/* LEVEL 2: 5-SECOND INFERENCE WINDOW TIMELINE */}
          <section className="flex flex-col bg-[#111317] rounded-lg border border-zinc-800/90 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-zinc-900/80 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase text-zinc-500 tracking-wider">Level 2 • Temporal Sequence</span>
                <span className="h-3 w-px bg-zinc-800"></span>
                <span className="text-sm font-semibold text-white">5.0-Second Observation Windows</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-500">Active Window:</span>
                <span className="font-mono text-xs text-teal-400 font-semibold">{activeId}</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 font-mono text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 select-none">
                    <th className="py-2.5 px-4 font-semibold">Window</th>
                    <th className="py-2.5 px-4 font-semibold">Time Offset</th>
                    <th className="py-2.5 px-4 font-semibold">Primary Inferred Behavior</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Throughput</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {windows.map((win) => {
                    const id = winLabel(win.window_id);
                    const isSelected = win.window_id === (active?.window_id ?? selected);
                    const conf = win.traffic_confidence !== null && win.traffic_confidence !== undefined ? `${Math.round(win.traffic_confidence * 100)}%` : "—";
                    return (
                      <tr
                        key={win.window_id}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                        onClick={() => setSelected(win.window_id)}
                      >
                        <td className={`py-2.5 px-4 font-semibold ${isSelected ? "text-teal-300" : "text-zinc-200"}`}>
                          {id}
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">{win.window_start ?? "—"}s – {win.window_end ?? "—"}s</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                            {(win.traffic_label ?? "unknown").toUpperCase()} ({conf})
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-zinc-200 tabular-nums">{win.packet_count?.toLocaleString() ?? "—"} pkts</td>
                        <td className="py-2.5 px-4 text-center">
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold text-[11px]">Selected</span>
                          ) : (
                            <button
                              className="px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 text-[11px] hover:bg-zinc-800"
                              onClick={(e) => { e.stopPropagation(); setSelected(win.window_id); }}
                            >
                              Inspect →
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* LEVEL 3: DUAL-PANE DRILLDOWN (STATISTICAL FEATURE VECTOR + SHAP EXPLAINABILITY) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* PANE A: STATISTICAL FEATURE VECTOR */}
            <section className="lg:col-span-5 flex flex-col bg-[#111317] rounded-lg border border-zinc-800/90 p-5">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">query_stats</span>
                  <div>
                    <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Level 3 • Monitored Feature Vector</span>
                    <h2 className="text-sm font-semibold text-white">L3/L4 ESP Timing &amp; Size Vector</h2>
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Window {activeId} · 10.000s
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0c0e11] border border-zinc-800/80 font-mono text-xs text-zinc-400 mb-3">
                <span className="material-symbols-outlined text-zinc-500 text-[14px]">info</span>
                <span>Attributes extracted strictly from encrypted frame lengths &amp; microsecond arrival deltas.</span>
              </div>

              {/* 2-Column Monospace Technical Matrix */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Packet Count</span>
                  <span className="text-white font-semibold text-sm mt-1 tabular-nums">24,190 pkts</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Window Ingress/Egress</span>
                  <span className="text-white font-semibold text-sm mt-1 tabular-nums">33.48 MB</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Mean Packet Size</span>
                  <span className="text-teal-400 font-semibold text-sm mt-1 tabular-nums">1,384.2 Bytes</span>
                  <span className="text-zinc-500 text-[10px]">MTU Saturation: 97.4%</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Packet-Size Variance (σ²)</span>
                  <span className="text-white font-semibold text-sm mt-1 tabular-nums">24,120</span>
                  <span className="text-zinc-500 text-[10px]">Bimodal Distribution</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Packets / Second</span>
                  <span className="text-white font-semibold text-sm mt-1 tabular-nums">4,838 pkts/sec</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Throughput Rate</span>
                  <span className="text-teal-400 font-semibold text-sm mt-1 tabular-nums">6.70 MB/sec</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Mean IAT (Δt)</span>
                  <span className="text-white font-semibold text-sm mt-1 tabular-nums">0.207 ms</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">IAT Jitter (StdDev)</span>
                  <span className="text-sky-400 font-semibold text-sm mt-1 tabular-nums">0.041 ms</span>
                  <span className="text-zinc-500 text-[10px]">Highly Periodic</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Burstiness Index</span>
                  <span className="text-white font-semibold text-sm mt-1 tabular-nums">0.34</span>
                  <span className="text-zinc-500 text-[10px]">Paced Packet Trains</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase">Upload / Download Ratio</span>
                  <span className="text-teal-400 font-semibold text-sm mt-1 tabular-nums">1 : 18.4</span>
                  <span className="text-zinc-500 text-[10px]">Strong Downstream Bias</span>
                </div>
                <div className="flex flex-col p-2.5 bg-[#0c0e11] rounded border border-zinc-800/80 col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase">Shannon Byte Entropy</span>
                      <span className="text-white font-semibold block text-sm mt-1 tabular-nums">7.994 bits/byte</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px]">HIGH RANDOMNESS</span>
                      <span className="block font-mono text-[10px] text-zinc-500 mt-1">Theoretical Max: 8.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PANE B: "WHY THIS PREDICTION?" EXPLAINABILITY */}
            <section className="lg:col-span-7 flex flex-col bg-[#111317] rounded-lg border border-zinc-800/90 p-5">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">Level 3 • Feature Attribution</span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono text-xs font-semibold border border-teal-500/20">ML EXPLAINABILITY</span>
                  </div>
                  <h2 className="text-sm font-semibold text-white mt-1">Evidence-Grounded ML Rationale</h2>
                </div>
                <div className="hidden sm:flex flex-col items-end font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase">Confidence Margin</span>
                  <span className="text-sm text-teal-400 font-semibold tabular-nums">Δ +78.3%</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800/80 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-400 text-[16px]">download</span>
                      High Sustained Downstream Asymmetry
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">+38% Weight</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">94.8% egress bytes at 18.4:1 ratio matching multi-megabyte media segment delivery.</p>
                  <div className="mt-2 w-full bg-zinc-800 h-1 rounded overflow-hidden">
                    <div className="bg-teal-400 h-full rounded" style={{width: '38%'}}></div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800/80 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-400 text-[16px]">view_stream</span>
                      Near-MTU Sized Packet Clustering
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">+29% Weight</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">89.2% packets between 1,360–1,420 bytes indicating path MTU-saturating media chunks.</p>
                  <div className="mt-2 w-full bg-zinc-800 h-1 rounded overflow-hidden">
                    <div className="bg-teal-400 h-full rounded" style={{width: '29%'}}></div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800/80 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-400 text-[16px]">pace</span>
                      Low-Jitter Paced Burst Intervals
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">+19% Weight</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">200–250ms burst cadence correlating with automated ABR buffer replenishment.</p>
                  <div className="mt-2 w-full bg-zinc-800 h-1 rounded overflow-hidden">
                    <div className="bg-teal-400 h-full rounded" style={{width: '19%'}}></div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800/80 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-400 text-[16px]">sync_alt</span>
                      TCP/ESP ACK Framing Absence of Loss
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">+8% Weight</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">Consistent 52–64 byte reverse-path cluster confirming regular ACK cadence without retransmits.</p>
                  <div className="mt-2 w-full bg-zinc-800 h-1 rounded overflow-hidden">
                    <div className="bg-teal-400 h-full rounded" style={{width: '8%'}}></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 px-3 py-2 rounded bg-[#0c0e11] border border-zinc-800/80 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[16px] shrink-0">verified_user</span>
                <p className="text-xs text-zinc-400 truncate">
                  <span className="text-zinc-200 font-medium">Forensic Guarantee:</span> Statistical inference from frame lengths and IAT timing. IPsec payload remains fully encrypted.
                </p>
              </div>
            </section>
          </div>

          {/* PIPELINE STATUS & TELEMETRY FOOTER */}
          <footer className="flex flex-wrap items-center justify-between gap-4 bg-[#111317] p-3 rounded-lg border border-zinc-800/90 font-mono text-xs text-zinc-400 select-none">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span className="text-zinc-200 font-medium">PIPELINE DPDK RX:</span>
                <span className="text-teal-300 font-semibold">ONLINE (0.02ms jitter)</span>
              </div>
              <span className="text-zinc-700">|</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-200 font-medium">FLOW EXTRACTION:</span>
                <span className="text-zinc-300">ACTIVE (24/24 SAs tracked)</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>INSPECTION LATENCY: <span className="text-white font-semibold">1.4ms</span></span>
              <span className="text-zinc-700">|</span>
              <span>ENGINE CLOCK: <span className="text-zinc-500">DPDK TSC SYNC</span></span>
            </div>
          </footer>
        </div>
      </AppShell>
    </div>
  );
}

