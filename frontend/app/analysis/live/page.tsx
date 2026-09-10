"use client";

import { useEffect, useMemo, useState } from "react";
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
  rightText: string;
  accent: "amber" | "primary" | "tertiary";
  detail: string;
}

const INITIAL_LOGS: PacketLog[] = [
  {
    id: "ev-01",
    time: "14:28:44",
    cat: "anomaly",
    badge: "PFS VIOLATION",
    badgeClass: "bg-amber-500/20 text-amber-300",
    title: "CREATE_CHILD_SA rekeyed without KEi payload (PFS disabled)",
    spi: "0x7c1189ab",
    rightText: "SPI: 0x7c1189ab",
    accent: "amber",
    detail:
      "IKE payload analyzer confirmed that renegotiated SPI 0x7c1189ab lacked KEi (Diffie-Hellman) payload, reusing initial session secret.",
  },
  {
    id: "ev-02",
    time: "14:28:35",
    cat: "anomaly",
    badge: "ANOMALY TRIGGER",
    badgeClass: "bg-error-container/30 text-error",
    title: "Egress packet dispersion jump (+180% stochastic variance)",
    spi: "0x9a021da3",
    rightText: "Score: 0.48",
    accent: "amber",
    detail: "Statistical drift in inter-arrival times exceeded 2-sigma baseline threshold.",
  },
  {
    id: "ev-03",
    time: "14:28:22",
    cat: "flow",
    badge: "ML INFERENCE",
    badgeClass: "bg-primary-container/20 text-primary",
    title: "Video Streaming (ABR H.264 chunk cadence, 78% ratio)",
    spi: "0x9a021da3",
    rightText: "SPI: 0x9a021da3",
    accent: "primary",
    detail: "Traffic flow classified with 96.4% confidence by entropy pipeline.",
  },
  {
    id: "ev-04",
    time: "14:28:19",
    cat: "flow",
    badge: "FLOW NEW",
    badgeClass: "bg-tertiary-container/20 text-tertiary",
    title: "Ingress ESP Child SA initialized (In: 0x9a021da3, Out: 0x4fbc0018)",
    spi: "0x9a021da3",
    rightText: "Window: 64 pkts",
    accent: "tertiary",
    detail: "ESP tunnel established via NAT-T port 4500. Window: 64 pkts monotonic.",
  },
  {
    id: "ev-05",
    time: "14:28:19",
    cat: "sa",
    badge: "SA ESTABLISHED",
    badgeClass: "bg-primary-container/20 text-primary",
    title: "IKEv2 SA negotiated with Deprecated DH Group 2 (MODP-1024)",
    spi: "0x7c1189ab",
    rightText: "DH Grp 2",
    accent: "primary",
    detail: "Weak cryptographic parameter detected. Group 2 is deprecated per NIST SP 800-77r1.",
  },
  {
    id: "ev-06",
    time: "14:29:15",
    cat: "flow",
    badge: "INTEGRITY",
    badgeClass: "bg-tertiary-container/20 text-tertiary",
    title: "Anti-Replay Window Verification Passed (0 window drops)",
    spi: "0x4fbc0018",
    rightText: "Seq: 14.2M",
    accent: "tertiary",
    detail: "Sequence 14.2M verified within 64-packet bitmap boundary.",
  },
];

type SAId = "sa-inbound" | "sa-outbound";

const SA_META: Record<SAId, { label: string; spi: string; cipher: string; packets: string }> = {
  "sa-inbound": { label: "Inbound SA", spi: "0x9a021da3", cipher: "AES-128-CBC", packets: "71.4M" },
  "sa-outbound": { label: "Outbound SA", spi: "0x4fbc0018", cipher: "AES-128-CBC", packets: "70.5M" },
};

function formatClock(totalSeconds: number, cs: number) {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}.${String(cs).padStart(2, "0")}`;
}

export default function LiveAnalysisPage() {
  const toast = useToast();
  const [isPaused, setIsPaused] = useState(false);
  const [streamFilter, setStreamFilter] = useState("");
  const [eventFilter, setEventFilter] = useState<"all" | "sa" | "flow" | "anomaly">("all");
  const [selectedLog, setSelectedLog] = useState<PacketLog | null>(null);
  const [selectedSA, setSelectedSA] = useState<SAId | null>(null);
  const [autoScrollOn, setAutoScrollOn] = useState(true);
  const [streamCleared, setStreamCleared] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(9678);
  const [centis, setCentis] = useState(92);
  const [liveConfirmModal, setLiveConfirmModal] = useState<{ open: boolean; mode: "start" | "stop" }>({
    open: false,
    mode: "stop",
  });

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
      setCentis(10 + Math.floor(Math.random() * 90));
    }, 1000);
    return () => clearInterval(t);
  }, [isPaused]);

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

  function selectLog(log: PacketLog) {
    setSelectedLog(log);
    setSelectedSA(null);
  }

  function selectSA(id: SAId) {
    setSelectedSA(id);
    setSelectedLog(null);
  }

  const filteredLogs = useMemo(() => {
    if (streamCleared) return [];
    return INITIAL_LOGS.filter((l) => {
      const matchCat = eventFilter === "all" ? true : l.cat === eventFilter;
      const q = streamFilter.toLowerCase();
      const matchQuery =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.spi.toLowerCase().includes(q) ||
        l.badge.toLowerCase().includes(q) ||
        l.rightText.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [eventFilter, streamFilter, streamCleared]);

  const inspectorBadge = selectedSA
    ? SA_META[selectedSA].spi
    : selectedLog
      ? selectedLog.badge
      : "SELECT ITEM";
  const inspectorTitle = selectedSA
    ? `${SA_META[selectedSA].label}: ${SA_META[selectedSA].spi}`
    : selectedLog
      ? "Forensic Details Drawer"
      : "Forensic Details Drawer";

  return (
    <div className="live-scope bg-background font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* Scoped CSS — live page only. No global / shared styles touched. */}
      <style>{`
        .live-scope .live-timer { font-variant-numeric: tabular-nums; }
        .live-scope .live-dot { position: relative; }
        .live-scope .live-dot::after {
          content: ""; position: absolute; inset: -4px; border-radius: 9999px;
          border: 1px solid rgba(78,222,163,.45); opacity: 0;
          animation: live-dot-ping 2.2s ease-out infinite;
        }
        @keyframes live-dot-ping {
          0% { transform: scale(.5); opacity: .9; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        .live-scope .live-event { animation: live-stream-in .28s ease both; }
        .live-scope .live-event:nth-child(2) { animation-delay: .03s; }
        .live-scope .live-event:nth-child(3) { animation-delay: .06s; }
        .live-scope .live-event:nth-child(4) { animation-delay: .09s; }
        .live-scope .live-event:nth-child(5) { animation-delay: .12s; }
        .live-scope .live-event:nth-child(6) { animation-delay: .15s; }
        @keyframes live-stream-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: none; }
        }
        .live-scope .live-stream { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.16) transparent; }
        .live-scope .live-stream::-webkit-scrollbar { display: block; width: 6px; }
        .live-scope .live-stream::-webkit-scrollbar-thumb { background: rgba(255,255,255,.14); border-radius: 9999px; }
        .live-scope .live-stream::-webkit-scrollbar-track { background: transparent; }
        .live-scope .live-sa { transition: border-color .18s ease, transform .18s ease, background-color .18s ease; }
        .live-scope .live-sa:hover { transform: translateY(-1px); }
        .live-scope .live-sa.is-selected { border-color: rgba(89,219,199,.65) !important; }
        .live-scope .live-bar { position: relative; overflow: hidden; }
        .live-scope .live-bar > div { transition: width .6s ease; }
        @media (prefers-reduced-motion: reduce) {
          .live-scope .live-event, .live-scope .live-dot::after { animation: none !important; }
        }
      `}</style>

      <AppShell active="/analysis/live">
        {/* 1. INTERFACE STATUS STRIP — schema 07 */}
        <div className="w-full bg-surface-container-lowest border-b border-hairline px-space-base py-space-sm flex flex-col gap-space-sm select-none">
          <div className="flex flex-wrap items-center justify-between gap-space-base">
            <div className="flex items-center gap-space-md flex-wrap">
              <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-outline">
                <span className="hover:text-on-surface cursor-pointer">Live Monitoring</span>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold">dpdk0</span>
                <span className="text-outline-variant font-normal text-[11px]">(10GbE SFP+)</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary-container/20 text-tertiary font-mono text-[11px] font-semibold">
                <span className="live-dot w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span className="tracking-wide">{isPaused ? "PAUSED" : "RUNNING"}</span>
              </div>

              <div className="hidden md:flex items-center gap-2 font-mono text-[12px] text-outline">
                <span>Drop Rate:</span>
                <span className="text-tertiary font-medium">0% Drops</span>
                <span className="text-outline-variant mx-1">|</span>
                <span>Throughput:</span>
                <span className="text-on-surface font-medium">14,820 pkts/s</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-surface-container-low px-2.5 h-8 rounded gap-1.5 border border-hairline">
                <span className="material-symbols-outlined text-[15px] text-outline">filter_alt</span>
                <input
                  aria-label="Filter logs"
                  id="stream-filter"
                  className="bg-transparent border-0 p-0 text-on-surface font-mono text-[12px] focus:outline-none w-44 placeholder:text-outline-variant"
                  placeholder="Filter proto:esp, violations..."
                  type="text"
                  value={streamFilter}
                  onChange={(e) => {
                    setStreamFilter(e.target.value);
                    setStreamCleared(false);
                  }}
                />
                <button
                  className="text-outline hover:text-on-surface font-mono text-[10px] uppercase"
                  type="button"
                  onClick={() => setStreamFilter("")}
                >
                  Clear
                </button>
              </div>

              <button
                className="h-8 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center gap-1.5 font-mono text-[12px]"
                id="btn-pause"
                type="button"
                onClick={() => setIsPaused(!isPaused)}
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  {isPaused ? "play_arrow" : "pause"}
                </span>
                <span>{isPaused ? "Resume Stream" : "Pause Stream"}</span>
              </button>

              <button
                className="h-8 px-3 rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors flex items-center gap-1 font-mono text-[12px] border border-hairline"
                type="button"
                onClick={() => triggerExport("pcap")}
              >
                <span className="material-symbols-outlined text-[16px]">sim_card_download</span>
                <span>Export Trace</span>
              </button>
            </div>
          </div>

          {/* Posture / clock strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-1 border-t border-hairline text-on-surface-variant font-mono text-[12px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                <span>Posture Status:</span>
                <span className="text-tertiary font-semibold">IKEv2 Tunnel Active</span>
              </span>
              <button
                type="button"
                onClick={() => selectLog(INITIAL_LOGS[0])}
                className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded hover:bg-amber-500/20 transition-colors"
                title="Inspect weak DH event"
              >
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span>1 Weak DH / PFS Disabled Alert</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-outline">
                Clock:{" "}
                <span id="live-timer" className="live-timer text-on-surface font-medium">
                  {formatClock(secondsElapsed, centis)}
                </span>
              </span>
              <span className="text-outline">
                Anti-Replay Window: <span className="text-tertiary font-medium">64-Pkt Monotonic OK</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. MAIN COCKPIT */}
        <div className="p-space-base grid grid-cols-1 lg:grid-cols-12 gap-space-base bg-surface-dim">
          {/* Left 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-space-base">
            {/* Active SAs */}
            <div className="bg-surface-container-low rounded p-space-base border border-hairline flex flex-col gap-space-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">vpn_key</span>
                  <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                    Active In-Flight Security Associations (SAs)
                  </span>
                </div>
                <span className="text-outline font-mono text-[11px]">2 Active Paired SPIs · Click to Inspect</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {/* Inbound */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => selectSA("sa-inbound")}
                  onKeyDown={(e) => e.key === "Enter" && selectSA("sa-inbound")}
                  className={`live-sa cursor-pointer bg-surface-container p-3 rounded border flex flex-col justify-between gap-1.5 ${
                    selectedSA === "sa-inbound" ? "is-selected" : "border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-tertiary">arrow_downward</span>
                      <span className="font-mono text-[12px] font-semibold text-on-surface">INBOUND SA</span>
                    </div>
                    <span className="text-primary font-mono text-[12px] font-medium">0x9a021da3</span>
                  </div>
                  <div className="flex items-baseline justify-between font-mono text-on-surface-variant text-[12px] mt-0.5">
                    <span>
                      Cipher: <strong className="text-on-surface font-medium">AES-128-CBC</strong>
                    </span>
                    <span className="text-outline">
                      Packets: <span className="text-on-surface">71.4M</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-outline mt-1">
                    <span>Rekey timer</span>
                    <span className="text-amber-300">in 760s</span>
                  </div>
                  <div className="live-bar w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-primary h-full w-[78%]" />
                  </div>
                </div>

                {/* Outbound */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => selectSA("sa-outbound")}
                  onKeyDown={(e) => e.key === "Enter" && selectSA("sa-outbound")}
                  className={`live-sa cursor-pointer bg-surface-container p-3 rounded border flex flex-col justify-between gap-1.5 ${
                    selectedSA === "sa-outbound" ? "is-selected" : "border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-primary">arrow_upward</span>
                      <span className="font-mono text-[12px] font-semibold text-on-surface">OUTBOUND SA</span>
                    </div>
                    <span className="text-primary font-mono text-[12px] font-medium">0x4fbc0018</span>
                  </div>
                  <div className="flex items-baseline justify-between font-mono text-on-surface-variant text-[12px] mt-0.5">
                    <span>
                      Cipher: <strong className="text-on-surface font-medium">AES-128-CBC</strong>
                    </span>
                    <span className="text-outline">
                      Packets: <span className="text-on-surface">70.5M</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-outline mt-1">
                    <span>Rekey timer</span>
                    <span className="text-amber-300">in 760s</span>
                  </div>
                  <div className="live-bar w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-primary h-full w-[78%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Forensic Event Stream */}
            <div className="bg-surface-container-low rounded border border-hairline flex flex-col overflow-hidden">
              <div className="bg-surface-container px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-headline-sm text-on-surface text-[13px] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[17px]">terminal</span>
                    Forensic Event Stream
                  </span>
                  <div className="flex items-center bg-surface-container-lowest p-0.5 rounded gap-0.5" id="event-filters">
                    {(
                      [
                        { id: "all", label: "ALL" },
                        { id: "sa", label: "SA" },
                        { id: "flow", label: "FLOW" },
                        { id: "anomaly", label: "VIOLATIONS" },
                      ] as const
                    ).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setEventFilter(c.id);
                          setStreamCleared(false);
                        }}
                        className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold tracking-wider transition-colors ${
                          eventFilter === c.id
                            ? "bg-primary-container text-on-primary-container"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    id="autoscroll-toggle"
                    onClick={() => setAutoScrollOn(!autoScrollOn)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] ${
                      autoScrollOn ? "bg-surface-container-lowest text-tertiary" : "bg-surface-container-lowest text-outline"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${autoScrollOn ? "bg-tertiary" : "bg-outline"}`}
                    />
                    <span id="scroll-state-label">AUTOSCROLL: {autoScrollOn ? "ON" : "OFF"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStreamCleared(true)}
                    title="Clear visual view"
                    className="p-1 rounded text-outline hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">clear_all</span>
                  </button>
                </div>
              </div>

              <div
                id="event-stream-container"
                className="live-stream flex flex-col p-2.5 gap-1.5 overflow-y-auto max-h-[580px] font-mono text-[12px]"
              >
                {streamCleared ? (
                  <div className="p-4 text-center text-outline font-mono text-[12px] flex flex-col gap-2 items-center">
                    <span>Visual stream cleared. Ingress monitoring active.</span>
                    <button
                      type="button"
                      onClick={() => setStreamCleared(false)}
                      className="px-2.5 py-1 rounded bg-surface-container-highest text-primary text-[11px] hover:text-on-surface"
                    >
                      Restore stream
                    </button>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="p-4 text-center text-outline font-mono text-[12px]">
                    No events match filter.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => selectLog(log)}
                      className={`live-event cursor-pointer flex items-center justify-between p-2.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors border-l-2 gap-2 ${
                        log.accent === "amber"
                          ? "border-amber-400"
                          : log.accent === "primary"
                            ? "border-primary"
                            : "border-tertiary"
                      } ${selectedLog?.id === log.id ? "outline outline-1 outline-primary/60" : ""}`}
                    >
                      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                        <span className="text-outline text-[12px] shrink-0">{log.time}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold uppercase shrink-0 ${log.badgeClass}`}
                        >
                          {log.badge}
                        </span>
                        <span
                          className={`truncate font-medium ${
                            log.id === "ev-02" ? "text-amber-200" : "text-on-surface"
                          }`}
                        >
                          {log.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[11px] hidden sm:inline ${
                            log.rightText.startsWith("DH")
                              ? "text-amber-300"
                              : log.rightText.startsWith("Seq")
                                ? "text-tertiary"
                                : "text-outline"
                          }`}
                        >
                          {log.rightText}
                        </span>
                        <button
                          type="button"
                          className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary hover:text-on-surface text-[11px] flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectLog(log);
                          }}
                        >
                          <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          <span>Inspect</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-surface-container px-4 py-1 flex items-center justify-between text-outline font-mono text-[11px]">
                <span>DPDK Ring Buffer Worker 2 active · Zero-loss kernel pipeline</span>
                <span>Buffer limit: 5,000</span>
              </div>
            </div>
          </div>

          {/* Right 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-space-base">
            {/* Anomaly & Drift Radar */}
            <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">speed</span>
                  <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                    Anomaly &amp; Drift Radar
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-mono text-[11px] font-semibold">
                  [NOMINAL]
                </span>
              </div>

              <div className="flex items-center gap-4 bg-surface-container p-3 rounded">
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
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
                  <span className="absolute font-mono text-[14px] text-on-surface font-semibold">0.12</span>
                </div>
                <div className="flex flex-col gap-0.5 font-mono text-[12px]">
                  <div className="text-on-surface font-semibold">Anomaly Index: 0.12</div>
                  <div className="text-outline">
                    Threshold: <span className="text-amber-300">0.65</span>
                  </div>
                  <div className="text-tertiary text-[11px]">Within 1-Sigma normal band</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 font-mono text-center">
                <div className="bg-surface-container p-1.5 rounded">
                  <div className="text-outline text-[10px] uppercase">Jitter</div>
                  <div className="text-tertiary font-semibold mt-1 text-[13px]">0.012ms</div>
                </div>
                <div className="bg-surface-container p-1.5 rounded">
                  <div className="text-outline text-[10px] uppercase">Wire RTT</div>
                  <div className="text-on-surface font-semibold mt-1 text-[13px]">0.18ms</div>
                </div>
                <div className="bg-surface-container p-1.5 rounded">
                  <div className="text-outline text-[10px] uppercase">Loss</div>
                  <div className="text-tertiary font-semibold mt-1 text-[13px]">0.00%</div>
                </div>
              </div>
            </div>

            {/* Packet Distribution */}
            <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
                  <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                    Packet Distribution
                  </span>
                </div>
                <span className="text-outline font-mono text-[11px]">DPI ML</span>
              </div>
              <div className="flex flex-col gap-3 font-mono text-[12px]">
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-1">
                    <span>1300 - 1420B (Clamped MSS Jumbo)</span>
                    <span className="text-primary font-semibold">84%</span>
                  </div>
                  <div className="live-bar w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-primary h-full w-[84%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-1">
                    <span>512 - 1024B (Interactive Sessions)</span>
                    <span className="text-on-surface">12%</span>
                  </div>
                  <div className="live-bar w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-primary-container h-full w-[12%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-on-surface-variant mb-1">
                    <span>64 - 128B (Control / TCP ACKs)</span>
                    <span className="text-on-surface">4%</span>
                  </div>
                  <div className="live-bar w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div className="bg-secondary h-full w-[4%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Forensic Details Drawer */}
            <div
              id="forensic-inspector-panel"
              className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-2"
            >
              <div className="flex items-center justify-between border-b border-hairline pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[17px]">troubleshoot</span>
                  <span
                    id="inspector-title"
                    className="font-headline-sm text-on-surface font-semibold text-[13px]"
                  >
                    {inspectorTitle}
                  </span>
                </div>
                <span
                  id="inspector-badge"
                  className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container font-mono text-outline"
                >
                  {inspectorBadge}
                </span>
              </div>

              <div id="inspector-content" className="flex flex-col gap-1.5 font-mono text-[12px] text-on-surface-variant">
                {!selectedSA && !selectedLog ? (
                  <div className="text-outline text-center py-3 leading-relaxed">
                    Click any SA or log row on the left to reveal raw hex offsets, replay masks, and cipher keys.
                  </div>
                ) : selectedSA ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-hairline">
                      <span className="text-outline">SPI:</span>
                      <span className="text-primary font-semibold">{SA_META[selectedSA].spi}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-hairline">
                      <span className="text-outline">Cipher:</span>
                      <span className="text-on-surface">{SA_META[selectedSA].cipher}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-hairline">
                      <span className="text-outline">Packets:</span>
                      <span className="text-on-surface">{SA_META[selectedSA].packets}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-hairline">
                      <span className="text-outline">Rekey:</span>
                      <span className="text-amber-300">in 760s</span>
                    </div>
                    <div className="mt-1">
                      <div className="text-outline text-[10px] mb-1 uppercase">ESP Header Offset:</div>
                      <div className="bg-surface-container p-2 rounded font-mono text-[10px] text-primary select-all">
                        00 00 11 94 {SA_META[selectedSA].spi.slice(2, 4)} {SA_META[selectedSA].spi.slice(4, 6)}{" "}
                        {SA_META[selectedSA].spi.slice(6, 8)} {SA_META[selectedSA].spi.slice(8, 10)} 00 d8 ce a2
                      </div>
                    </div>
                    <div className="mt-1">
                      <div className="text-outline text-[10px] mb-1 uppercase">Replay Mask (64-pkt):</div>
                      <div className="bg-surface-container p-2 rounded font-mono text-[10px] text-tertiary select-all">
                        ff ff ff ff ff ff ff ff · 0 drops
                      </div>
                    </div>
                  </>
                ) : (
                  selectedLog && (
                    <>
                      <div className="flex justify-between py-1 border-b border-hairline">
                        <span className="text-outline">SPI:</span>
                        <span className="text-primary font-semibold">{selectedLog.spi}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-hairline">
                        <span className="text-outline">Timestamp:</span>
                        <span className="text-on-surface">{selectedLog.time}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-hairline">
                        <span className="text-outline">Signal:</span>
                        <span className="text-on-surface">{selectedLog.rightText}</span>
                      </div>
                      <p className="text-[11px] text-on-surface leading-relaxed mt-1">{selectedLog.detail}</p>
                      <div className="mt-1">
                        <div className="text-outline text-[10px] mb-1 uppercase">ESP Header Offset:</div>
                        <div className="bg-surface-container p-2 rounded font-mono text-[10px] text-primary select-all">
                          00 00 11 94 {selectedLog.spi.slice(2, 4)} {selectedLog.spi.slice(4, 6)}{" "}
                          {selectedLog.spi.slice(6, 8)} {selectedLog.spi.slice(8, 10)} 00 d8 ce a2
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
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
