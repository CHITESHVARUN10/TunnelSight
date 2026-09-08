"use client";
import Link from "next/link";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { TRAFFIC_MIX } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";
type WindowInfo = { id: string; range: string; conf: string; sec: string; rate: string; pkts: string; meanSize: string; jitter: string };
const WINDOWS: WindowInfo[] = [
  { id: "W-01", range: "00:00 - 00:05", conf: "91.8%", sec: "WEB (6.2%)", rate: "1.12 MB/s", pkts: "4,210", meanSize: "1,328 B", jitter: "0.120 ms" },
  { id: "W-02", range: "00:05 - 00:10", conf: "78.4%", sec: "VOIP (14.2%)", rate: "2.40 MB/s", pkts: "8,904", meanSize: "1,348 B", jitter: "0.082 ms" },
  { id: "W-03", range: "00:10 - 00:15", conf: "64.1%", sec: "VIDEO (32.0%)", rate: "0.78 MB/s", pkts: "2,980", meanSize: "680 B", jitter: "0.245 ms" },
  { id: "W-04", range: "00:15 - 00:20", conf: "84.0%", sec: "WEB (11.0%)", rate: "3.90 MB/s", pkts: "14,200", meanSize: "1,372 B", jitter: "0.065 ms" },
  { id: "W-05", range: "00:20 - 00:25", conf: "89.5%", sec: "WEB (8.1%)", rate: "5.10 MB/s", pkts: "18,440", meanSize: "1,380 B", jitter: "0.052 ms" },
  { id: "W-06", range: "00:25 - 00:30", conf: "86.1%", sec: "VOIP (7.2%)", rate: "4.78 MB/s", pkts: "17,100", meanSize: "1,376 B", jitter: "0.058 ms" },
  { id: "W-07", range: "00:30 - 00:35", conf: "88.3%", sec: "WEB (7.9%)", rate: "5.40 MB/s", pkts: "19,300", meanSize: "1,382 B", jitter: "0.048 ms" },
  { id: "W-08", range: "00:35 - 00:40", conf: "87.4%", sec: "WEB (9.1%)", rate: "6.84 MB/s", pkts: "24,190", meanSize: "1,384 B", jitter: "0.041 ms" },
];

export default function TrafficIntelligencePage() {
  const toast = useToast();
  const [selectedWindow, setSelectedWindow] = useState("W-08");
  function selectWindow(id: string) {
    setSelectedWindow(id);
  }
  const activeRange = WINDOWS.find((w) => w.id === selectedWindow)?.range ?? "00:35 - 00:40";
  const activeNum = selectedWindow.split("-")[1];
  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/analysis/traffic">

        {/* Sub-Header / Breadcrumb & Telemetry Context Bar */}
        <div className="flex flex-col gap-3 bg-[#111317] px-6 py-3.5 border-b border-zinc-800/80 select-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <Link href="/history" className="text-zinc-500 hover:text-zinc-300 transition-colors">Captures</Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">weak-vpn-07.pcap</span>
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
                onClick={() => { downloadFile("traffic-intelligence.json", JSON.stringify({ capture: "weak-vpn-07.pcap", spi: "0xC3E8019A", mix: TRAFFIC_MIX, window: selectedWindow }, null, 2)); toast({ title: "Traffic intel exported", body: "traffic-intelligence.json downloaded.", kind: "ok" }); }}
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
                <div className="h-full bg-teal-500 relative cursor-pointer transition-opacity hover:opacity-90" style={{width: '83%'}} title="Video: 83%"></div>
                <div className="h-full bg-sky-500 relative cursor-pointer transition-opacity hover:opacity-90" style={{width: '10%'}} title="Web: 10%"></div>
                <div className="h-full bg-amber-500 relative cursor-pointer transition-opacity hover:opacity-90" style={{width: '4%'}} title="VoIP: 4%"></div>
                <div className="h-full bg-zinc-700 relative cursor-pointer transition-opacity hover:opacity-90" style={{width: '3%'}} title="Control: 3%"></div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center justify-between bg-[#0c0e11] px-4 py-2.5 rounded border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    <span className="font-medium text-white text-xs">Video Stream</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-teal-300 font-semibold">83%</span>
                    <span className="text-zinc-500">| 94.2% conf</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#0c0e11] px-4 py-2.5 rounded border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span className="font-medium text-white text-xs">Web / TLS</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-sky-300 font-semibold">10%</span>
                    <span className="text-zinc-500">| 88.5% conf</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#0c0e11] px-4 py-2.5 rounded border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="font-medium text-white text-xs">VoIP / Audio</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-amber-300 font-semibold">4%</span>
                    <span className="text-zinc-500">| 91.0% conf</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#0c0e11] px-4 py-2.5 rounded border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                    <span className="font-medium text-white text-xs">Other / Control</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-zinc-400 font-semibold">3%</span>
                    <span className="text-zinc-500">| 96.1% conf</span>
                  </div>
                </div>
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
                <span className="font-mono text-xs text-teal-400 font-semibold">{selectedWindow} [{activeRange}]</span>
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
                  {WINDOWS.map((win) => {
                    const isSelected = selectedWindow === win.id;
                    const isVideo = win.sec.includes("VIDEO") || win.id !== "W-03";
                    return (
                      <tr
                        key={win.id}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                        onClick={() => selectWindow(win.id)}
                      >
                        <td className={`py-2.5 px-4 font-semibold ${isSelected ? "text-teal-300" : "text-zinc-200"}`}>
                          {win.id}
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">{win.range}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${isVideo ? "bg-teal-500/10 text-teal-300 border border-teal-500/20" : "bg-sky-500/10 text-sky-300 border border-sky-500/20"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isVideo ? "bg-teal-400" : "bg-sky-400"}`}></span>
                            {isVideo ? `VIDEO (${win.conf})` : `WEB / TLS (${win.conf})`}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-zinc-200 tabular-nums">{win.rate}</td>
                        <td className="py-2.5 px-4 text-center">
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold text-[11px]">Selected</span>
                          ) : (
                            <button
                              className="px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 text-[11px] hover:bg-zinc-800"
                              onClick={(e) => { e.stopPropagation(); selectWindow(win.id); }}
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
                  Window {activeNum} · 5.000s
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

