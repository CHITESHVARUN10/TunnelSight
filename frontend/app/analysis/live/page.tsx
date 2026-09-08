"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";
import { LiveConfirmModal } from "@/components/modals/LiveConfirmModal";

interface PacketLog {
  id: string;
  time: string;
  cat: "sa" | "flow" | "anomaly";
  badge: string;
  badgeClass: string;
  title: string;
  spi: string;
  detail: string;
}

const INITIAL_LOGS: PacketLog[] = [
  {
    id: "ev-01",
    time: "14:28:44.120",
    cat: "anomaly",
    badge: "PFS VIOLATION",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    title: "CREATE_CHILD_SA rekeyed without KEi payload (PFS disabled)",
    spi: "0x7c1189ab",
    detail: "IKE payload analyzer confirmed that renegotiated SPI 0x7c1189ab lacked KEi (Diffie-Hellman) payload, reusing initial session secret.",
  },
  {
    id: "ev-02",
    time: "14:28:35.892",
    cat: "anomaly",
    badge: "ANOMALY TRIGGER",
    badgeClass: "bg-error/20 text-error border-error/30",
    title: "Egress packet dispersion jump (+180% stochastic variance)",
    spi: "0x9a021da3",
    detail: "Statistical drift in inter-arrival times exceeded 2-sigma baseline threshold.",
  },
  {
    id: "ev-03",
    time: "14:28:22.404",
    cat: "flow",
    badge: "ML INFERENCE",
    badgeClass: "bg-primary-container/20 text-primary border-primary/30",
    title: "Video Streaming (ABR H.264 chunk cadence, 78% ratio)",
    spi: "0x9a021da3",
    detail: "Traffic flow classified with 96.4% confidence by entropy pipeline.",
  },
  {
    id: "ev-04",
    time: "14:28:19.991",
    cat: "flow",
    badge: "FLOW NEW",
    badgeClass: "bg-tertiary-container/20 text-tertiary border-tertiary/30",
    title: "Ingress ESP Child SA initialized (In: 0x9a021da3, Out: 0x4fbc0018)",
    spi: "0x9a021da3",
    detail: "ESP tunnel established via NAT-T port 4500. Window: 64 pkts monotonic.",
  },
  {
    id: "ev-05",
    time: "14:28:19.412",
    cat: "sa",
    badge: "SA ESTABLISHED",
    badgeClass: "bg-primary-container/20 text-primary border-primary/30",
    title: "IKEv2 SA negotiated with Deprecated DH Group 2 (MODP-1024)",
    spi: "0x7c1189ab",
    detail: "Weak cryptographic parameter detected. Group 2 is deprecated per NIST SP 800-77r1.",
  },
  {
    id: "ev-06",
    time: "14:28:15.018",
    cat: "flow",
    badge: "INTEGRITY",
    badgeClass: "bg-tertiary-container/20 text-tertiary border-tertiary/30",
    title: "Anti-Replay Window Verification Passed (0 window drops)",
    spi: "0x4fbc0018",
    detail: "Sequence 14.2M verified within 64-packet bitmap boundary.",
  },
];

export default function LiveAnalysisPage() {
  const toast = useToast();
  const [isPaused, setIsPaused] = useState(false);
  const [streamFilter, setStreamFilter] = useState("");
  const [eventFilter, setEventFilter] = useState<"all" | "sa" | "flow" | "anomaly">("all");
  const [selectedLog, setSelectedLog] = useState<PacketLog | null>(INITIAL_LOGS[0]);
  const [autoScrollOn, setAutoScrollOn] = useState(true);
  const [activeAlertDismissed, setActiveAlertDismissed] = useState(false);
  const [liveConfirmModal, setLiveConfirmModal] = useState<{ open: boolean; mode: "start" | "stop" }>({
    open: false,
    mode: "stop",
  });

  function triggerExport(fmt: string) {
    downloadFile(
      `live-trace-${Date.now()}.${fmt}`,
      JSON.stringify(
        {
          capture: "live-tap-dpdk0",
          format: fmt,
          exported: new Date().toISOString(),
          logs: INITIAL_LOGS,
        },
        null,
        2
      ),
      "application/json"
    );
    toast({ title: "Trace Exported", body: `live-trace.${fmt} downloaded.`, kind: "ok" });
  }

  const filteredLogs = useMemo(() => {
    return INITIAL_LOGS.filter((l) => {
      const matchCat = eventFilter === "all" ? true : l.cat === eventFilter;
      const matchQuery =
        l.title.toLowerCase().includes(streamFilter.toLowerCase()) ||
        l.spi.toLowerCase().includes(streamFilter.toLowerCase()) ||
        l.badge.toLowerCase().includes(streamFilter.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [eventFilter, streamFilter]);

  return (
    <div className="bg-background font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <AppShell active="/analysis/live">

        {/* 1. INTERFACE STATUS STRIP */}
        <div className="w-full bg-surface-container-lowest border-b border-hairline px-space-base py-3 flex flex-col gap-2.5 select-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-outline">
                <span className="text-on-surface font-semibold">Live Ingest</span>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-bold">dpdk0</span>
                <span className="text-outline font-normal text-[11px]">(10GbE SFP+ Ring)</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-mono text-[11px] font-semibold border border-tertiary/30">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span>IN-ORDER CAPTURE</span>
              </div>

              <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-outline">
                <span>Throughput: <strong className="text-on-surface">14,820 pkts/s</strong></span>
                <span className="text-hairline">|</span>
                <span>Loss: <strong className="text-tertiary font-medium">0% Drops</strong></span>
                <span className="text-hairline">|</span>
                <span>Replay Window: <strong className="text-tertiary font-medium">64-Pkt Monotonic OK</strong></span>
              </div>
            </div>

            {/* Stream Action Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-surface-container px-2.5 h-7 rounded gap-1.5 border border-hairline">
                <span className="material-symbols-outlined text-[14px] text-outline">search</span>
                <input
                  aria-label="Filter logs"
                  className="bg-transparent border-0 p-0 text-on-surface font-mono text-[11px] focus:outline-none w-40 placeholder:text-outline"
                  placeholder="Filter SPI, alert, cipher..."
                  type="text"
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                />
                {streamFilter && (
                  <button
                    className="text-outline hover:text-on-surface font-mono text-[9px] uppercase"
                    onClick={() => setStreamFilter("")}
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                className={`h-7 px-3 rounded font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                  isPaused
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-hairline"
                }`}
                id="btn-pause"
                type="button"
                onClick={() => setIsPaused(!isPaused)}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isPaused ? "play_arrow" : "pause"}
                </span>
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>

              <button
                className="h-7 px-3 rounded bg-amber-950/30 hover:bg-amber-950/50 text-amber-300 border border-amber-800/40 transition-colors flex items-center gap-1 font-mono text-[11px]"
                type="button"
                onClick={() => setLiveConfirmModal({ open: true, mode: isPaused ? "start" : "stop" })}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isPaused ? "play_circle" : "stop_circle"}
                </span>
                <span>{isPaused ? "Start Ingest" : "Stop Capture"}</span>
              </button>

              <button
                className="h-7 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center gap-1 font-mono text-[11px] border border-hairline"
                type="button"
                onClick={() => triggerExport("pcap")}
              >
                <span className="material-symbols-outlined text-[15px]">sim_card_download</span>
                <span>Export Buffer</span>
              </button>
            </div>
          </div>

          {/* 2. EVENT-DRIVEN THRESHOLD ALERT STRIP (Surfaces Above Stream) */}
          {!activeAlertDismissed && (
            <div className="flex items-center justify-between p-2 rounded bg-amber-500/10 border border-amber-500/30 font-mono text-[11px] text-amber-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-400">warning</span>
                <span className="font-semibold text-amber-300">THRESHOLD ALERT:</span>
                <span>Child SA rekey without KEi payload detected on SPI 0x7c1189ab. Perfect Forward Secrecy omitted.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-semibold"
                  type="button"
                  onClick={() => setSelectedLog(INITIAL_LOGS[0])}
                >
                  Inspect Event
                </button>
                <button
                  className="text-outline hover:text-on-surface text-[10px]"
                  type="button"
                  onClick={() => setActiveAlertDismissed(true)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. MAIN COCKPIT: TERMINAL STREAM (LEFT 8 COLS) + DOCKED RADAR (RIGHT 4 COLS) */}
        <div className="p-space-base grid grid-cols-1 lg:grid-cols-12 gap-5 bg-surface-dim">

          {/* Terminal Stream */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* In-Flight Active SAs Header */}
            <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">vpn_key</span>
                  <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                    Active In-Flight Security Associations (SAs)
                  </span>
                </div>
                <span className="text-outline font-mono text-[11px]">2 Paired ESP SPIs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[12px]">
                {/* Inbound SA */}
                <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-tertiary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                      INBOUND SA
                    </span>
                    <span className="text-primary font-bold">0x9a021da3</span>
                  </div>
                  <div className="flex justify-between text-outline text-[11px]">
                    <span>Cipher: <strong className="text-on-surface font-medium">AES-128-CBC</strong></span>
                    <span>Packets: <strong className="text-on-surface">71.4M</strong></span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden mt-1">
                    <div className="bg-primary h-full w-[78%]" />
                  </div>
                </div>

                {/* Outbound SA */}
                <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                      OUTBOUND SA
                    </span>
                    <span className="text-primary font-bold">0x4fbc0018</span>
                  </div>
                  <div className="flex justify-between text-outline text-[11px]">
                    <span>Cipher: <strong className="text-on-surface font-medium">AES-128-CBC</strong></span>
                    <span>Packets: <strong className="text-on-surface">70.5M</strong></span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden mt-1">
                    <div className="bg-primary h-full w-[78%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Forensic Packet Rail */}
            <div className="bg-surface-container-low rounded border border-hairline flex flex-col overflow-hidden">
              <div className="bg-surface-container px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline">
                <div className="flex items-center gap-3">
                  <span className="font-headline-sm text-on-surface text-[13px] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">terminal</span>
                    Streaming Rail
                  </span>

                  {/* Filter tabs */}
                  <div className="flex items-center bg-surface-container-lowest p-0.5 rounded font-mono text-[10px]">
                    {(["all", "sa", "flow", "anomaly"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`px-2 py-0.5 rounded uppercase transition-colors ${
                          eventFilter === cat
                            ? "bg-primary-container text-on-primary-container font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                        onClick={() => setEventFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-scroll */}
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                      autoScrollOn ? "bg-surface-container-lowest text-tertiary" : "bg-surface-container-lowest text-outline"
                    }`}
                    onClick={() => setAutoScrollOn(!autoScrollOn)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    <span>AUTOSCROLL: {autoScrollOn ? "ON" : "OFF"}</span>
                  </button>
                </div>
              </div>

              {/* Monospace Event Stream Items */}
              <div className="flex flex-col p-2.5 gap-1.5 overflow-y-auto max-h-[480px] font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border-l-2 flex items-center justify-between gap-3 ${
                      selectedLog?.id === log.id ? "border-primary bg-surface-container-high" : "border-hairline"
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-outline text-[10px] shrink-0">{log.time}</span>
                      <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase shrink-0 ${log.badgeClass}`}>
                        {log.badge}
                      </span>
                      <span className="text-on-surface truncate">{log.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-outline text-[10px] hidden sm:inline">{log.spi}</span>
                      <button
                        type="button"
                        className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary hover:text-on-surface text-[10px] inline-flex items-center gap-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                      >
                        <span>Inspect</span>
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-container px-4 py-1.5 flex items-center justify-between text-outline font-mono text-[10px] border-t border-hairline">
                <span>DPDK Ring Tap Core 0-3 · Zero-copy memory buffer</span>
                <span>Buffer utilization: 1.6%</span>
              </div>
            </div>
          </div>

          {/* Docked Session Radar & Inspector (Right 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Anomaly & Drift Gauge */}
            <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">speed</span>
                  <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                    Drift &amp; Anomaly Index
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-mono text-[10px] font-semibold">
                  NOMINAL
                </span>
              </div>

              <div className="flex items-center gap-4 bg-surface-container p-3 rounded">
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-highest"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-primary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="12, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <span className="absolute font-mono text-[13px] text-on-surface font-bold">0.12</span>
                </div>
                <div className="flex flex-col font-mono text-[11px]">
                  <div className="text-on-surface font-semibold">Anomaly Score: 0.12</div>
                  <div className="text-outline">Threshold: <span className="text-amber-300">0.65</span></div>
                  <div className="text-tertiary text-[10px]">Within 1-Sigma normal band</div>
                </div>
              </div>

              {/* RTT & Jitter */}
              <div className="grid grid-cols-3 gap-2 font-mono text-center text-[10px]">
                <div className="bg-surface-container p-2 rounded">
                  <div className="text-outline uppercase">Jitter</div>
                  <div className="text-tertiary font-bold mt-0.5">0.012ms</div>
                </div>
                <div className="bg-surface-container p-2 rounded">
                  <div className="text-outline uppercase">Wire RTT</div>
                  <div className="text-on-surface font-bold mt-0.5">0.18ms</div>
                </div>
                <div className="bg-surface-container p-2 rounded">
                  <div className="text-outline uppercase">Loss</div>
                  <div className="text-tertiary font-bold mt-0.5">0.00%</div>
                </div>
              </div>
            </div>

            {/* Inspector Panel */}
            <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">troubleshoot</span>
                  <span className="font-headline-sm text-on-surface font-semibold text-[12px]">
                    Event Inspector
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-container text-outline">
                  {selectedLog ? selectedLog.badge : "IDLE"}
                </span>
              </div>

              {selectedLog ? (
                <div className="flex flex-col gap-2 font-mono text-[11px] text-on-surface-variant">
                  <div className="flex justify-between py-1 border-b border-hairline">
                    <span className="text-outline">SPI:</span>
                    <span className="text-primary font-semibold">{selectedLog.spi}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-hairline">
                    <span className="text-outline">Timestamp:</span>
                    <span className="text-on-surface">{selectedLog.time}</span>
                  </div>
                  <p className="text-[11px] text-on-surface leading-relaxed mt-1">{selectedLog.detail}</p>

                  <div className="mt-1">
                    <div className="text-outline text-[10px] mb-1 uppercase">ESP Header Offset:</div>
                    <div className="bg-surface-container p-2 rounded font-mono text-[10px] text-primary select-all">
                      00 00 11 94 {selectedLog.spi.slice(2, 4)} {selectedLog.spi.slice(4, 6)} {selectedLog.spi.slice(6, 8)} {selectedLog.spi.slice(8, 10)} 00 d8 ce a2
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-outline text-center py-4 font-mono text-[11px]">
                  Click any stream row to inspect raw offsets.
                </div>
              )}
            </div>

          </div>
        </div>

        <LiveConfirmModal
          isOpen={liveConfirmModal.open}
          onClose={() => setLiveConfirmModal((s) => ({ ...s, open: false }))}
          mode={liveConfirmModal.mode}
          onConfirm={(m) => {
            if (m === "stop") setIsPaused(true);
            else setIsPaused(false);
          }}
        />
      </AppShell>
    </div>
  );
}
