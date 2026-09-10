"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";
import { useResolvedAnalysis } from "@/components/analysis/useResolvedAnalysis";
import { downloadReportPdf, getTraffic, getWindows, type Window } from "@/lib/analysis";
import { capturePackets, captureVolume, formatBytes, formatDuration } from "@/lib/format";

function winLabel(id: number) {
  return `W-${String(id + 1).padStart(2, "0")}`;
}

function winRange(w: Window) {
  const s = w.window_start ?? 0;
  const e = w.window_end ?? 0;
  return `${s.toFixed(2)}s – ${e.toFixed(2)}s`;
}

function winSpan(w: Window) {
  const span = (w.window_end ?? 0) - (w.window_start ?? 0);
  return span > 0 ? span : null;
}

function winPps(w: Window) {
  const span = winSpan(w);
  if (!span || !w.packet_count) return null;
  return w.packet_count / span;
}

export default function TrafficIntelligencePage() {
  const toast = useToast();
  const params = useSearchParams();
  const { analysis, analysisId, loading, error, empty } = useResolvedAnalysis(params.get("analysis_id"));
  const [windows, setWindows] = useState<Window[]>([]);
  const [mix, setMix] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!analysisId) return;
    let dead = false;
    (async () => {
      try {
        const [t, w] = await Promise.all([getTraffic(analysisId), getWindows(analysisId)]);
        if (!dead) {
          setMix(t.mix);
          setWindows(w);
          if (w.length > 0) setSelected(w[w.length - 1].window_id);
        }
      } catch (err) {
        if (!dead) toast({ title: "Traffic unavailable", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
      }
    })();
    return () => {
      dead = true;
    };
  }, [analysisId, toast]);

  const selectWindow = (id: number) => setSelected(id);
  const active = windows.find((w) => w.window_id === selected) ?? windows[windows.length - 1];
  const activeId = active ? winLabel(active.window_id) : "—";
  const mixEntries = Object.entries(mix).sort((a, b) => b[1] - a[1]);
  const colors = ["bg-primary", "bg-secondary", "bg-tertiary-container", "bg-surface-variant", "bg-tertiary"];
  const capture = analysis?.config_json?.capture;
  const meanRate =
    capture?.total_bytes && capture?.flow_duration ? capture.total_bytes / capture.flow_duration : null;
  const avgWindowSpan = windows.length
    ? windows.reduce((acc, w) => acc + (winSpan(w) ?? 0), 0) / windows.length
    : null;
  const maxPps = Math.max(0, ...windows.map((w) => winPps(w) ?? 0));
  const captureStart = windows.length ? Math.min(...windows.map((w) => w.window_start ?? 0)) : null;
  const captureEnd = windows.length ? Math.max(...windows.map((w) => w.window_end ?? 0)) : null;

  const exportPdf = async () => {
    if (!analysis) return;
    try {
      await downloadReportPdf(analysis.id, analysis.filename);
      toast({ title: "PDF report downloaded", body: `${analysis.filename} report saved.`, kind: "ok" });
    } catch (err) {
      toast({ title: "PDF export failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };

  if (!analysisId && !loading && (empty || error)) {
    return (
      <div className="traffic-scope bg-background font-sans text-sm text-on-surface antialiased min-h-screen">
        <AppShell active="/analysis/traffic">
          <div className="p-8 text-sm">
            {error ? `Traffic unavailable: ${error}` : "No captures yet."}{" "}
            <Link className="underline text-primary" href="/analyze">
              Upload a capture
            </Link>
            .
          </div>
        </AppShell>
      </div>
    );
  }

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
              <span className="text-primary font-medium">{analysis?.filename ?? "—"}</span>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold tracking-tight">
                Encrypted Traffic Intelligence &amp; Flow ML
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded">
                <span className="material-symbols-outlined text-outline text-[16px]">schedule</span>
                <span className="font-mono text-[12px] text-on-surface-variant">Capture span:</span>
                <span className="font-mono text-[12px] text-on-surface font-medium">
                  {captureStart !== null && captureEnd !== null
                    ? `${captureStart.toFixed(2)}s – ${captureEnd.toFixed(2)}s`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded">
                <span className="material-symbols-outlined text-outline text-[16px]">dataset</span>
                <span className="font-mono text-[12px] text-on-surface-variant">Record:</span>
                <span className="font-mono text-[12px] text-on-surface font-medium">
                  {analysisId?.slice(0, 8).toUpperCase() ?? "—"}
                </span>
              </div>
              <button
                className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high transition-colors font-mono text-[12px] disabled:opacity-50"
                type="button"
                disabled={!analysis}
                onClick={exportPdf}
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>Export PDF</span>
              </button>
              <button
                className="flex items-center gap-1.5 bg-primary-container px-3 py-1.5 rounded text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors font-mono text-[12px] font-medium"
                type="button"
                onClick={() => {
                  downloadFile(
                    `${analysis?.filename ?? "traffic"}-intelligence.json`,
                    JSON.stringify(
                      { capture: analysis?.filename, mix, window: activeId, windows },
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
                WINDOWS: <span className="font-semibold text-primary ml-1">{windows.length}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant">
                AVG WINDOW: <span className="text-on-surface font-medium ml-1">{formatDuration(avgWindowSpan)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant">
                MODEL: <span className="text-on-surface font-medium ml-1">RandomForest traffic_classifier</span>
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
                    {analysis?.config_json?.ipsec_config?.sa_config?.ike_version as string ?? "UNKNOWN"} ·{" "}
                    {analysis?.config_json?.evidence_source ?? "unknown"} evidence
                  </span>
                </div>
                <h1 className="font-headline-md text-on-surface mt-1 text-[16px] font-semibold tracking-tight">
                  Macro Behavioral Profile &amp; Traffic Mixture
                </h1>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="block font-mono text-[10px] text-outline uppercase">Anomaly Score</span>
                  <span className="font-mono text-[13px] text-tertiary font-semibold tabular-nums">
                    {analysis?.anomaly_score != null ? analysis.anomaly_score.toFixed(3) : "—"}
                  </span>
                </div>
                <div className="h-6 w-px bg-surface-container-highest" />
                <div>
                  <span className="block font-mono text-[10px] text-outline uppercase">Mean Rate</span>
                  <span className="font-mono text-[13px] text-on-surface font-semibold tabular-nums">
                    {meanRate !== null ? `${formatBytes(meanRate)}/s` : "—"}
                  </span>
                </div>
                <div className="h-6 w-px bg-surface-container-highest" />
                <div>
                  <span className="block font-mono text-[10px] text-outline uppercase">Tunnel Volume</span>
                  <span className="font-mono text-[13px] text-on-surface font-semibold tabular-nums">
                    {captureVolume(analysis)}{" "}
                    <span className="text-on-surface-variant font-normal">/ {capturePackets(analysis)} pkts</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Multi-segment Mixture Bar */}
              <div className="traffic-mix h-2.5 w-full rounded bg-surface-container-lowest flex overflow-hidden">
                {mixEntries.map(([label, ratio], i) => (
                  <div key={label} className={`h-full ${colors[i % colors.length]} cursor-pointer`} style={{ width: `${Math.round(ratio * 100)}%` }} title={`${label}: ${Math.round(ratio * 100)}%`} />
                ))}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {mixEntries.map(([label, ratio], i) => (
                  <div key={label} className="flex items-center justify-between bg-surface-container px-4 py-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded ${colors[i % colors.length]}`} />
                      <span className="font-headline-sm text-on-surface font-medium text-[13px] capitalize">{label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[12px]">
                      <span className="text-primary font-semibold">{Math.round(ratio * 100)}%</span>
                    </div>
                  </div>
                ))}
                {mixEntries.length === 0 && <span className="font-mono text-[12px] text-outline">No windows yet.</span>}
              </div>
            </div>
          </section>

          {/* LEVEL 2: 5-SECOND INFERENCE WINDOW TIMELINE */}
          <section className="flex flex-col bg-surface-container-low rounded border border-hairline overflow-hidden">
            <div className="flex flex-wrap items-center justify-between px-space-base py-space-sm bg-surface-container gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase text-outline tracking-wider">Level 2 • Temporal Sequence</span>
                <span className="h-4 w-px bg-surface-container-highest" />
                <span className="text-[13px] font-semibold text-on-surface">
                  {windows.length} Observation Window{windows.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase text-outline">Active Window:</span>
                <span className="font-mono text-[12px] text-primary font-semibold">
                  {activeId}{active ? ` [${winRange(active)}]` : ""}
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
                    <th className="py-2 px-4 font-semibold text-right">Anomaly</th>
                    <th className="py-2 px-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[12px]">
                  {windows.map((win) => {
                    const id = winLabel(win.window_id);
                    const isSelected = win.window_id === (active?.window_id ?? selected);
                    const conf = win.traffic_confidence != null ? `${Math.round(win.traffic_confidence * 100)}%` : "—";
                    return (
                      <tr
                        key={win.window_id}
                        onClick={() => selectWindow(win.window_id)}
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
                            {id}
                          </span>
                        </td>
                        <td className={`py-2 px-4 ${isSelected ? "text-on-surface font-medium" : "text-outline"}`}>
                          {winRange(win)}
                        </td>
                        <td className="py-2 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {(win.traffic_label ?? "unknown").toUpperCase()} ({conf})
                          </span>
                        </td>
                        <td className={`py-2 px-4 text-right tabular-nums ${isSelected ? "text-primary font-semibold" : "text-on-surface"}`}>
                          {winPps(win) !== null ? `${winPps(win)!.toFixed(1)} pkt/s` : "—"}
                        </td>
                        <td className={`py-2 px-4 text-right tabular-nums ${win.is_anomaly ? "text-rose-400 font-semibold" : "text-outline"}`}>
                          {win.anomaly_score != null ? win.anomaly_score.toFixed(3) : "—"}
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
                                selectWindow(win.window_id);
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
                  Window {activeId} • {active ? formatDuration(winSpan(active)) : "—"}
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
                    {active ? `${(active.packet_count ?? 0).toLocaleString()} pkts` : "—"}
                  </span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Predicted Label</span>
                  <span className="text-primary font-semibold text-[13px] mt-0.5 tabular-nums capitalize">
                    {active?.traffic_label ?? "—"}
                  </span>
                  <span className="text-outline text-[10px]">
                    {active?.traffic_confidence != null ? `${Math.round(active.traffic_confidence * 100)}% confidence` : ""}
                  </span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Anomaly Score</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">
                    {active?.anomaly_score != null ? active.anomaly_score.toFixed(3) : "—"}
                  </span>
                  <span className="text-outline text-[10px]">lower = more anomalous</span>
                </div>
                <div className="traffic-card flex flex-col py-1.5 bg-surface-container px-3 rounded">
                  <span className="text-outline text-[10px] uppercase">Window Span</span>
                  <span className="text-on-surface font-semibold text-[13px] mt-0.5 tabular-nums">
                    {active ? winRange(active) : "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* PANE B: PER-WINDOW MEASUREMENTS */}
            <section className="lg:col-span-7 flex flex-col bg-surface-container-low rounded border border-hairline p-space-md">
              <div className="flex items-center justify-between pb-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase text-outline tracking-wider">
                      Level 3 • Measured Characteristics
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[12px] font-semibold">
                      PER WINDOW
                    </span>
                  </div>
                  <h2 className="text-[13px] font-semibold text-on-surface mt-1">Packet Rate &amp; Anomaly by Window</h2>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="font-mono text-[10px] text-outline uppercase">Windows</span>
                  <span className="font-mono text-[13px] text-primary font-semibold tabular-nums">{windows.length}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {windows.length === 0 ? (
                  <span className="font-mono text-[12px] text-outline">No windows available.</span>
                ) : (
                  windows.map((win) => {
                    const pps = winPps(win);
                    const width = maxPps > 0 && pps !== null ? `${Math.max(2, (pps / maxPps) * 100)}%` : "2%";
                    return (
                      <div
                        key={win.window_id}
                        className="traffic-card p-3 rounded bg-surface-container hover:bg-surface-container-high"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-on-surface font-semibold flex items-center gap-2 text-[13px]">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              {win.is_anomaly ? "warning" : "check_circle"}
                            </span>
                            {winLabel(win.window_id)} · {(win.traffic_label ?? "unknown").toUpperCase()}
                          </span>
                          <span className="font-mono text-[12px] px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                            {pps !== null ? `${pps.toFixed(1)} pkt/s` : "—"}
                          </span>
                        </div>
                        <p className="font-sans text-[12px] text-on-surface-variant mt-1">
                          {winRange(win)} · {win.packet_count ?? 0} packets · confidence{" "}
                          {win.traffic_confidence != null ? `${(win.traffic_confidence * 100).toFixed(1)}%` : "—"}
                        </p>
                        <div className="traffic-bar mt-2 w-full bg-surface-container-lowest h-1.5 rounded overflow-hidden">
                          <div className={`${win.is_anomaly ? "bg-rose-400" : "bg-primary"} h-full rounded`} style={{ width }} />
                        </div>
                      </div>
                    );
                  })
                )}
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
                <span className="text-on-surface font-medium">EVIDENCE SOURCE:</span>
                <span className="text-tertiary font-semibold uppercase">{analysis?.config_json?.evidence_source ?? "unknown"}</span>
              </div>
              <span className="text-outline-variant">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface font-medium">WINDOWS:</span>
                <span className="text-on-surface">{windows.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span>
                CAPTURE SPAN: <span className="text-on-surface font-semibold">{formatDuration(capture?.flow_duration)}</span>
              </span>
              <span className="text-outline-variant">|</span>
              <span>
                BYTES: <span className="text-on-surface font-semibold">{formatBytes(capture?.total_bytes)}</span>
              </span>
            </div>
          </footer>
        </div>
      </AppShell>
    </div>
  );
}
