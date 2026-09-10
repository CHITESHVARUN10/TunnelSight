"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getWindows, listHistory, type Analysis, type Window } from "@/lib/analysis";
import { capturePackets, captureVolume, formatBytes, formatClock, formatDuration } from "@/lib/format";

const SEVERITY_ACCENT: Record<string, string> = {
  CRITICAL: "border-rose-400",
  HIGH: "border-amber-400",
  MEDIUM: "border-primary",
  LOW: "border-tertiary",
  INFO: "border-tertiary",
};

const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: "bg-error-container/40 text-error",
  HIGH: "bg-amber-500/20 text-amber-300",
  MEDIUM: "bg-primary-container/20 text-primary",
  LOW: "bg-tertiary-container/20 text-tertiary",
  INFO: "bg-surface-container-highest text-outline",
};

function winPps(w: Window) {
  const span = (w.window_end ?? 0) - (w.window_start ?? 0);
  return span > 0 && w.packet_count ? w.packet_count / span : 0;
}

export default function LiveAnalysisPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const res = await listHistory({ limit: 1 });
        const latest = res.items[0];
        if (dead) return;
        setAnalysis(latest ?? null);
        if (latest) {
          const w = await getWindows(latest.id);
          if (!dead) setWindows(w);
        }
      } catch (err) {
        if (!dead) setError(err instanceof Error ? err.message : "History unavailable.");
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, []);

  const ipsec = analysis?.config_json?.ipsec_config;
  const crypto = (ipsec?.cryptography ?? {}) as Record<string, unknown>;
  const sa = (ipsec?.sa_config ?? {}) as Record<string, unknown>;
  const capture = analysis?.config_json?.capture;
  const findings = analysis?.findings_json ?? [];
  const anomalous = windows.filter((w) => w.is_anomaly).length;
  const meanPps =
    capture?.packet_count && capture?.flow_duration ? capture.packet_count / capture.flow_duration : null;
  const maxPps = Math.max(1, ...windows.map(winPps));

  return (
    <div className="live-scope bg-background font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <AppShell active="/analysis/live">
        {/* 1. STATUS STRIP */}
        <div className="w-full bg-surface-container-lowest border-b border-hairline px-space-base py-space-sm flex flex-col gap-space-sm select-none">
          <div className="flex flex-wrap items-center justify-between gap-space-base">
            <div className="flex items-center gap-space-md flex-wrap">
              <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-outline">
                <span>Analysis Monitor</span>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold">{analysis?.filename ?? "—"}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-mono text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-outline" />
                <span className="tracking-wide">UPLOAD-BASED</span>
              </div>
              <div className="hidden md:flex items-center gap-2 font-mono text-[12px] text-outline">
                <span>Evidence:</span>
                <span className="text-on-surface font-medium">
                  {analysis?.config_json?.evidence_source ?? "—"}
                </span>
                <span className="text-outline-variant mx-1">|</span>
                <span>Mean rate:</span>
                <span className="text-on-surface font-medium">
                  {meanPps !== null ? `${meanPps.toFixed(1)} pkt/s` : "—"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="h-8 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center gap-1.5 font-mono text-[12px]"
                type="button"
                onClick={() => window.location.reload()}
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">refresh</span>
                <span>Refresh</span>
              </button>
              {analysis ? (
                <Link
                  href={`/analysis/results?analysis_id=${analysis.id}`}
                  className="h-8 px-3 rounded bg-primary-container text-on-primary-container hover:bg-primary transition-colors flex items-center gap-1 font-mono text-[12px] font-medium"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Open Results</span>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 py-1 border-t border-hairline text-on-surface-variant font-mono text-[12px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                <span>Negotiated:</span>
                <span className="text-tertiary font-semibold">
                  {String(sa.ike_version ?? "UNKNOWN")} / {String(crypto.encryption_algorithm ?? "UNKNOWN")}
                </span>
              </span>
              {findings.length > 0 ? (
                <span className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  <span>{findings.length} finding(s)</span>
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-outline">
                Ingested: <span className="text-on-surface font-medium">{formatClock(analysis?.created_at)}</span>
              </span>
              <span className="text-outline">
                Span: <span className="text-on-surface font-medium">{formatDuration(capture?.flow_duration)}</span>
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-space-base font-mono text-xs text-outline">Loading…</div>
        ) : error ? (
          <div className="p-space-base font-mono text-xs text-error">{error}</div>
        ) : !analysis ? (
          <div className="p-space-base">
            <div className="rounded border border-hairline bg-surface-container-low p-space-base font-mono text-xs text-outline">
              No analyses yet.{" "}
              <Link className="underline text-primary" href="/analyze">
                Upload a capture
              </Link>{" "}
              to populate this view.
            </div>
          </div>
        ) : (
          <div className="p-space-base grid grid-cols-1 lg:grid-cols-12 gap-space-base bg-surface-dim">
            {/* Left 8 cols */}
            <div className="lg:col-span-8 flex flex-col gap-space-base">
              {/* Negotiated SA */}
              <div className="bg-surface-container-low rounded p-space-base border border-hairline flex flex-col gap-space-sm">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">vpn_key</span>
                    <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                      Negotiated Security Association
                    </span>
                  </div>
                  <span className="text-outline font-mono text-[11px]">
                    Record {analysis.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1 font-mono text-[12px]">
                  {[
                    { label: "Encryption", value: String(crypto.encryption_algorithm ?? "UNKNOWN"), bad: false },
                    { label: "Integrity", value: String(crypto.integrity_algorithm ?? "UNKNOWN"), bad: false },
                    {
                      label: "DH Group",
                      value: crypto.dh_group ? String(crypto.dh_group) : "—",
                      bad: crypto.dh_group === 2,
                    },
                    {
                      label: "PFS",
                      value: crypto.pfs_enabled ? "ENABLED" : "DISABLED",
                      bad: crypto.pfs_enabled === false,
                    },
                    { label: "IKE", value: String(sa.ike_version ?? "UNKNOWN"), bad: false },
                    { label: "Mode", value: String(sa.mode ?? "UNKNOWN"), bad: false },
                    {
                      label: "Anti-Replay",
                      value: sa.replay_protection === false ? "DISABLED" : "ENABLED",
                      bad: sa.replay_protection === false,
                    },
                    { label: "Lifetime", value: sa.lifetime_seconds ? `${sa.lifetime_seconds}s` : "—", bad: false },
                  ].map((cell) => (
                    <div key={cell.label} className="bg-surface-container p-3 rounded">
                      <div className="text-outline text-[10px] uppercase">{cell.label}</div>
                      <div className={`mt-1 font-semibold ${cell.bad ? "text-error" : "text-on-surface"}`}>
                        {cell.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Findings */}
              <div className="bg-surface-container-low rounded border border-hairline flex flex-col overflow-hidden">
                <div className="bg-surface-container px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline">
                  <span className="font-headline-sm text-on-surface text-[13px] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[17px]">terminal</span>
                    Deterministic Findings
                  </span>
                  <span className="text-outline font-mono text-[11px]">{findings.length} event(s)</span>
                </div>

                <div className="flex flex-col p-2.5 gap-1.5 overflow-y-auto max-h-[580px] font-mono text-[12px]">
                  {findings.length === 0 ? (
                    <div className="p-4 text-center text-outline font-mono text-[12px]">
                      No findings raised for this capture.
                    </div>
                  ) : (
                    findings.map((f, i) => (
                      <div
                        key={`${f.category}-${i}`}
                        className={`flex flex-col gap-1 p-2.5 rounded bg-surface-container border-l-2 ${
                          SEVERITY_ACCENT[f.severity] ?? "border-tertiary"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold uppercase shrink-0 ${
                              SEVERITY_BADGE[f.severity] ?? SEVERITY_BADGE.INFO
                            }`}
                          >
                            {f.severity}
                          </span>
                          <span className="font-medium text-on-surface">{f.category}</span>
                        </div>
                        <span className="text-on-surface-variant text-[11px]">{f.description}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-surface-container px-4 py-1 flex items-center justify-between text-outline font-mono text-[11px]">
                  <span>Rule engine: deterministic, header-grounded</span>
                  <span>Windows: {windows.length}</span>
                </div>
              </div>
            </div>

            {/* Right 4 cols */}
            <div className="lg:col-span-4 flex flex-col gap-space-base">
              {/* Anomaly */}
              <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">speed</span>
                  <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                    Isolation Forest
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
                        strokeDasharray={`${windows.length ? Math.max(2, (anomalous / windows.length) * 100) : 2}, 100`}
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <span className="absolute font-mono text-[14px] text-on-surface font-semibold">
                      {analysis.anomaly_score != null ? analysis.anomaly_score.toFixed(2) : "—"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 font-mono text-[12px]">
                    <div className="text-on-surface font-semibold">
                      Anomaly score: {analysis.anomaly_score != null ? analysis.anomaly_score.toFixed(3) : "—"}
                    </div>
                    <div className="text-outline">
                      Flagged windows: <span className="text-on-surface">{anomalous}</span> / {windows.length}
                    </div>
                    <div className="text-outline text-[11px]">Lower score = more anomalous</div>
                  </div>
                </div>
              </div>

              {/* Window distribution */}
              <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
                    <span className="font-headline-sm text-on-surface font-semibold text-[13px]">Windows</span>
                  </div>
                  <span className="text-outline font-mono text-[11px]">{windows.length} total</span>
                </div>
                <div className="flex flex-col gap-3 font-mono text-[12px]">
                  {windows.length === 0 ? (
                    <span className="text-outline">No windows.</span>
                  ) : (
                    windows.slice(0, 6).map((w) => {
                      const pps = winPps(w);
                      return (
                        <div key={w.window_id}>
                          <div className="flex justify-between text-on-surface-variant mb-1">
                            <span>
                              W-{String(w.window_id + 1).padStart(2, "0")} ·{" "}
                              {(w.traffic_label ?? "unknown").toUpperCase()}
                            </span>
                            <span className={w.is_anomaly ? "text-error font-semibold" : "text-on-surface"}>
                              {pps.toFixed(1)} pkt/s
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                            <div
                              className={`h-full ${w.is_anomaly ? "bg-error" : "bg-primary"}`}
                              style={{ width: `${Math.max(2, (pps / maxPps) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Capture summary */}
              <div className="bg-surface-container-low rounded p-4 border border-hairline flex flex-col gap-2 font-mono text-[12px]">
                <span className="font-headline-sm text-on-surface font-semibold text-[13px]">Capture</span>
                <div className="flex justify-between py-1 border-b border-hairline">
                  <span className="text-outline">File size</span>
                  <span className="text-on-surface">{captureVolume(analysis)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline">
                  <span className="text-outline">Packets</span>
                  <span className="text-on-surface">{capturePackets(analysis)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline">
                  <span className="text-outline">Bytes</span>
                  <span className="text-on-surface">{formatBytes(capture?.total_bytes)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-outline">Span</span>
                  <span className="text-on-surface">{formatDuration(capture?.flow_duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </div>
  );
}
