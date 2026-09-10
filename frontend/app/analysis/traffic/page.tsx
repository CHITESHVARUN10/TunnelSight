"use client";

import Link from "next/link";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { TRAFFIC_MIX } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";

type WindowInfo = {
  id: string;
  range: string;
  conf: string;
  sec: string;
  rate: string;
  pkts: string;
  meanSize: string;
  jitter: string;
};

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

const SHAP = [
  {
    icon: "download",
    title: "High Sustained Downstream Asymmetry",
    weight: "+38% Weight",
    width: "38%",
    desc: "94.8% egress bytes at 18.4:1 ratio matching multi-megabyte media segment delivery.",
  },
  {
    icon: "view_stream",
    title: "Near-MTU Sized Packet Clustering",
    weight: "+29% Weight",
    width: "29%",
    desc: "89.2% packets between 1,360–1,420 bytes indicating path MTU-saturating media chunks.",
  },
  {
    icon: "pace",
    title: "Low-Jitter Paced Burst Intervals",
    weight: "+19% Weight",
    width: "19%",
    desc: "200–250ms burst cadence correlating with automated ABR buffer replenishment.",
  },
  {
    icon: "sync_alt",
    title: "TCP/ESP ACK Framing Absence of Loss",
    weight: "+8% Weight",
    width: "8%",
    desc: "Consistent 52–64 byte reverse-path cluster confirming regular ACK cadence without retransmits.",
  },
];

export default function TrafficIntelligencePage() {
  const toast = useToast();
  const [selectedWindow, setSelectedWindow] = useState("W-08");
  function selectWindow(id: string) {
    setSelectedWindow(id);
  }
  const active = WINDOWS.find((w) => w.id === selectedWindow) ?? WINDOWS[WINDOWS.length - 1];
  const activeNum = selectedWindow.split("-")[1];

  return (
    <div className="traffic-scope bg-background font-sans text-sm text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* Scoped CSS — traffic page only. No globals / theme touched. */}
      <style>{`
        .traffic-scope .traffic-mix > div { transition: opacity .18s ease, filter .18s ease; }
        .traffic-scope .traffic-mix > div:hover { opacity: .92; filter: brightness(1.08); }
        .traffic-scope .traffic-row { transition: background-color .15s ease; }
        .traffic-scope .traffic-row.is-selected { background-color: var(--color-surface-container); }
        .traffic-scope .traffic-card { transition: background-color .15s ease, transform .15s ease; }
        .traffic-scope .traffic-card:hover { transform: translateY(-1px); }
        .traffic-scope .traffic-bar > div { transition: width .5s ease; }
        .traffic-scope .traffic-table-wrap { scrollbar-width: thin; scrollbar-color: rgba(127,135,130,.35) transparent; }
        @media (prefers-reduced-motion: reduce) {
          .traffic-scope .traffic-mix > div, .traffic-scope .traffic-bar > div { transition: none !important; }
        }
      `}</style>

      <AppShell active="/analysis/traffic">
        {/* Sub-Header / Breadcrumb & Telemetry Context Bar */}
        <div className="flex flex-col gap-space-md bg-surface-container-lowest px-space-xl py-space-md select-none border-b border-hairline">
          <div className="flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <Link href="/history" className="text-outline hover:text-on-surface transition-colors">
                Captures
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-medium">weak-vpn-07.pcap</span>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold tracking-tight">
                Encrypted Traffic Intelligence &amp; Flow ML
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded">
                <span className="material-symbols-outlined text-outline text-[16px]">schedule</span>
                <span className="font-mono text-[12px] text-on-surface-variant">Capture:</span>
                <span className="font-mono text-[12px] text-on-surface font-medium">00:00:00 - 00:04:12</span>
              </div>
              <button
                className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-mono text-[12px]"
                type="button"
                onClick={() =>
                  toast({ title: "SPI 0xC3E8019A", body: "ESP flow · 24 SAs tracked · DPDK RX online.", kind: "info" })
                }
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>SPI: 0xC3E8019A</span>
              </button>
              <button
                className="flex items-center gap-1.5 bg-primary-container px-3 py-1.5 rounded text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors font-mono text-[12px] font-medium"
                type="button"
                onClick={() => {
                  downloadFile(
                    "traffic-intelligence.json",
                    JSON.stringify(
                      { capture: "weak-vpn-07.pcap", spi: "0xC3E8019A", mix: TRAFFIC_MIX, window: selectedWindow },
                      null,
                      2
                    )
                  );
                  toast({ title: "Traffic intel exported", body: "traffic-intelligence.json downloaded.", kind: "ok" });
                }}
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[12px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                FLOWS: <span className="font-semibold text-primary ml-1">24 CONCURRENT</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant">
                WINDOW: <span className="text-on-surface font-medium ml-1">5.0s</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant">
                MODEL: <span className="text-on-surface font-medium ml-1">RF+GB Ensemble v2.4</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant text-[11px]">
              <span className="material-symbols-outlined text-outline text-[14px]">lock</span>
              <span className="uppercase tracking-wider font-mono text-[10px] font-semibold">[ZERO PAYLOAD DECRYPTION]</span>
            </div>
          </div>
        </div>

        {/* Content Workspace */}
        <div className="flex flex-col gap-space-md p-space-base bg-surface-dim">
          {/* LEVEL 1: OVERALL CLASSIFICATION & SUMMARY */}
          <section className="flex flex-col gap-space-md bg-surface-container-low p-space-lg rounded border border-hairline">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase text-outline tracking-wider">
                    Level 1 • Global Behavioral Mixture
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-mono text-[12px] text-primary">
                    SPI: 0xC3E8019A (ESP)
                  </span>
                </div>
                <h1 className="font-headline-md text-on-surface mt-1 text-[16px] font-semibold tracking-tight">
                  Macro Behavioral Profile &amp; Traffic Mixture
                </h1>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="block font-mono text-[10px] text-outline uppercase">Anomaly Score</span>
                  <span className="font-mono text-[13px] text-tertiary font-semibold tabular-nums">0.12 (NOMINAL)</span>
                </div>
                <div className="h-6 w-px bg-surface-container-highest" />
                <div>
                  <span className="block font-mono text-[10px] text-outline uppercase">Mean Rate</span>
                  <span className="font-mono text-[13px] text-on-surface font-semibold tabular-nums">4.52 MB/s</span>
                </div>
                <div className="h-6 w-px bg-surface-container-highest" />
                <div>
                  <span className="block font-mono text-[10px] text-outline uppercase">Tunnel Volume</span>
                  <span className="font-mono text-[13px] text-on-surface font-semibold tabular-nums">
                    1.42 GB <span className="text-on-surface-variant font-normal">/ 842k pkts</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Multi-segment Mixture Bar */}
              <div className="traffic-mix h-2.5 w-full rounded bg-surface-container-lowest flex overflow-hidden">
                <div className="h-full bg-primary cursor-pointer" style={{ width: "83%" }} title="Video: 83%" />
                <div className="h-full bg-secondary cursor-pointer" style={{ width: "10%" }} title="Web: 10%" />
                <div className="h-full bg-tertiary-container cursor-pointer" style={{ width: "4%" }} title="VoIP: 4%" />
                <div className="h-full bg-surface-variant cursor-pointer" style={{ width: "3%" }} title="Control: 3%" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="flex items-center justify-between bg-surface-container px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-primary" />
                    <span className="font-headline-sm text-on-surface font-medium text-[13px]">Video Stream</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[12px]">
                    <span className="text-primary font-semibold">83%</span>
                    <span className="text-outline">| 94.2% conf</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-surface-container px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-secondary" />
                    <span className="font-headline-sm text-on-surface font-medium text-[13px]">Web / TLS</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[12px]">
                    <span className="text-secondary font-semibold">10%</span>
                    <span className="text-outline">| 88.5% conf</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-surface-container px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-tertiary-container" />
                    <span className="font-headline-sm text-on-surface font-medium text-[13px]">VoIP / Audio</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[12px]">
                    <span className="text-tertiary font-semibold">4%</span>
                    <span className="text-outline">| 91.0% conf</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-surface-container px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-surface-variant" />
                    <span className="font-headline-sm text-on-surface font-medium text-[13px]">Other / Control</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[12px]">
                    <span className="text-outline font-semibold">3%</span>
                    <span className="text-outline">| 96.1% conf</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LEVEL 2: 5-SECOND INFERENCE WINDOW TIMELINE */}
          <section className="flex flex-col bg-surface-container-low rounded border border-hairline overflow-hidden">
            <div className="flex flex-wrap items-center justify-between px-space-base py-space-sm bg-surface-container gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase text-outline tracking-wider">Level 2 • Temporal Sequence</span>
                <span className="h-4 w-px bg-surface-container-highest" />
                <span className="text-[13px] font-semibold text-on-surface">5.0-Second Observation Windows</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase text-outline">Active Window:</span>
                <span className="font-mono text-[12px] text-primary font-semibold">
                  {selectedWindow} [{active.range}]
                </span>
              </div>
            </div>

            <div className="traffic-table-wrap w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high font-mono text-[11px] text-outline uppercase tracking-wider select-none">
                    <th className="py-2 px-4 font-semibold">Window</th>
                    <th className="py-2 px-4 font-semibold">Time Offset</th>
                    <th className="py-2 px-4 font-semibold">Primary Inferred Behavior</th>
                    <th className="py-2 px-4 font-semibold text-right">Throughput</th>
                    <th className="py-2 px-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[12px]">
                  {WINDOWS.map((win) => {
                    const isSelected = selectedWindow === win.id;
                    const isVideo = win.id !== "W-03";
                    return (
                      <tr
                        key={win.id}
                        onClick={() => selectWindow(win.id)}
                        className={`traffic-row cursor-pointer hover:bg-surface-container ${
                          isSelected ? "is-selected select-none" : ""
                        }`}
                      >
                        <td
                          className={`py-2 px-4 ${
                            isSelected ? "text-primary font-semibold" : "text-on-surface font-medium"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {isSelected && <span className="w-1 h-3 bg-primary rounded-sm inline-block" />}
                            {win.id}
                          </span>
                        </td>
                        <td className={`py-2 px-4 ${isSelected ? "text-on-surface font-medium" : "text-outline"}`}>
                          {win.range}
                        </td>
                        <td className="py-2 px-4">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary text-on-primary font-semibold">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              {isVideo ? `VIDEO (${win.conf})` : `WEB / TLS (${win.conf})`}
                            </span>
                          ) : isVideo ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 text-primary">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              VIDEO ({win.conf})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                              WEB / TLS ({win.conf})
                            </span>
                          )}
                        </td>
                        <td
                          className={`py-2 px-4 text-right tabular-nums ${
                            isSelected ? "text-primary font-semibold" : "text-on-surface"
                          }`}
                        >
                          {win.rate}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold text-[12px]">
                              Selected
                            </span>
                          ) : (
                            <button
                              className="px-2 py-0.5 rounded text-outline hover:text-on-surface text-[12px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                selectWindow(win.id);
                              }}
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

          {/* LEVEL 3: DUAL-PANE DRILLDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
            {/* PANE A: STATISTICAL FEATURE VECTOR */}
            <section className="lg:col-span-5 flex flex-col bg-surface-container-low rounded border border-hairline p-space-md">
              <div className="flex items-center justify-between pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">query_stats</span>
                  <div>
                    <span className="block font-mono text-[10px] text-outline uppercase tracking-wider">
                      Level 3 • Monitored Feature Vector
                    </span>
                    <h2 className="text-[13px] font-semibold text-on-surface">L3/L4 ESP Timing &amp; Size Vector</h2>
                  </div>
                </div>
                <span className="font-mono text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                  Window {activeNum} • 5.000s
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded bg-surface-container-lowest font-mono text-[12px] text-outline mb-3">
                <span className="material-symbols-outlined text-outline text-[14px]">info</span>
                <span>Attributes extracted strictly from encrypted frame lengths &amp; microsecond arrival deltas.</span>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[12px]">
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Packet Count</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">
                    {active.pkts} pkts
                  </span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Window Ingress/Egress</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">33.48 MB</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Mean Packet Size</span>
                  <span className="text-primary font-semibold text-[13px] mt-0.5 tabular-nums">
                    {active.id === "W-08" ? "1,384.2 Bytes" : `${active.meanSize}`}
                  </span>
                  <span className="text-outline text-[10px]">MTU Saturation: 97.4%</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Packet-Size Variance (σ²)</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">24,120</span>
                  <span className="text-outline text-[10px]">Bimodal Distribution</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Packets / Second</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">4,838 pkts/sec</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Throughput Rate</span>
                  <span className="text-primary font-semibold text-[13px] mt-0.5 tabular-nums">
                    {active.id === "W-08" ? "6.70 MB/sec" : active.rate.replace("MB/s", "MB/sec")}
                  </span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Mean IAT (Δt)</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">0.207 ms</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">IAT Jitter (StdDev)</span>
                  <span className="text-tertiary font-semibold text-[13px] mt-0.5 tabular-nums">{active.jitter}</span>
                  <span className="text-outline text-[10px]">Highly Periodic</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Burstiness Index</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">0.34</span>
                  <span className="text-outline text-[10px]">Paced Packet Trains</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Upload / Download Ratio</span>
                  <span className="text-primary font-semibold text-[13px] mt-0.5 tabular-nums">1 : 18.4</span>
                  <span className="text-outline text-[10px]">Strong Downstream Bias</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded col-span-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <span className="text-outline text-[10px] uppercase">Shannon Byte Entropy</span>
                      <span className="text-on-surface font-semibold block text-[13px] mt-0.5 tabular-nums">
                        7.994 bits/byte
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high font-mono text-[10px] font-semibold text-tertiary">
                        HIGH CIPHERTEXT RANDOMNESS
                      </span>
                      <span className="block font-mono text-[12px] text-outline mt-0.5">Theoretical Max: 8.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PANE B: EXPLAINABILITY */}
            <section className="lg:col-span-7 flex flex-col bg-surface-container-low rounded border border-hairline p-space-md">
              <div className="flex items-center justify-between pb-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase text-outline tracking-wider">
                      Level 3 • Feature Attribution
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[12px] font-semibold">
                      ML EXPLAINABILITY
                    </span>
                  </div>
                  <h2 className="text-[13px] font-semibold text-on-surface mt-1">Evidence-Grounded ML Rationale</h2>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="font-mono text-[10px] text-outline uppercase">Confidence Margin</span>
                  <span className="font-mono text-[13px] text-primary font-semibold tabular-nums">Δ +78.3%</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {SHAP.map((s) => (
                  <div
                    key={s.title}
                    className="traffic-card p-3 rounded bg-surface-container hover:bg-surface-container-high"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-on-surface font-semibold flex items-center gap-2 text-[13px]">
                        <span className="material-symbols-outlined text-primary text-[18px]">{s.icon}</span>
                        {s.title}
                      </span>
                      <span className="font-mono text-[12px] px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                        {s.weight}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-on-surface-variant mt-1 truncate">{s.desc}</p>
                    <div className="traffic-bar mt-2 w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                      <div className="bg-primary h-full rounded" style={{ width: s.width }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 px-3 py-2 rounded bg-surface-container-lowest flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px] shrink-0">verified_user</span>
                <p className="font-sans text-[12px] text-outline truncate">
                  <span className="text-on-surface font-medium">Forensic Guarantee:</span> Statistical inference from
                  frame lengths and IAT timing. IPsec payload remains fully encrypted.
                </p>
              </div>
            </section>
          </div>

          {/* PIPELINE STATUS & TELEMETRY FOOTER */}
          <footer className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-lowest p-3 rounded border border-hairline font-mono text-[12px] text-on-surface-variant select-none">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="text-on-surface font-medium">PIPELINE DPDK RX:</span>
                <span className="text-tertiary font-semibold">ONLINE (0.02ms jitter)</span>
              </div>
              <span className="text-outline-variant">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface font-medium">FLOW EXTRACTION:</span>
                <span className="text-on-surface">ACTIVE (24/24 SAs tracked)</span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span>
                INSPECTION LATENCY: <span className="text-on-surface font-semibold">1.4ms</span>
              </span>
              <span className="text-outline-variant">|</span>
              <span>
                ENGINE CLOCK: <span className="text-outline">DPDK TSC SYNC</span>
              </span>
            </div>
          </footer>
        </div>
      </AppShell>
    </div>
  );
}
