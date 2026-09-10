"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressBehavior } from "@/components/upload/ProgressBehavior";
import { AppShell } from "@/components/layout/AppShell";
import { getAnalysis, getWindows, type Analysis, type Window } from "@/lib/analysis";
import { capturePackets, captureVolume, formatClock, formatDuration } from "@/lib/format";

const STAGES = [
  "PCAP ingestion & header verification",
  "IKE detection & SA handshake extraction",
  "ESP / AH decapsulation & integrity inspection",
  "IPsec protocol normalization",
  "Encrypted flow segmentation & windowing",
  "ML encrypted traffic classification",
  "Anomaly & tunnel sequence detection",
  "Deterministic security assessment",
  "Evidence provenance & artifact persistence",
];

const MAX_WORKER_LINES = 8;

export default function AnalysisProgressPage() {
  const router = useRouter();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisId) return;
    let dead = false;
    (async () => {
      try {
        const row = await getAnalysis(analysisId);
        if (dead) return;
        setAnalysis(row);
        if (row.status === "completed") {
          const w = await getWindows(analysisId);
          if (!dead) setWindows(w);
        }
      } catch (err) {
        if (!dead) setError(err instanceof Error ? err.message : "unavailable");
      }
    })();
    return () => {
      dead = true;
    };
  }, [analysisId]);

  const status = analysis?.status ?? "processing";
  const done = status === "completed";
  const failed = status === "failed";
  const percent = failed || done ? 100 : 55;
  const capture = analysis?.config_json?.capture;
  const anomalous = windows.filter((w) => w.is_anomaly).length;
  const throughput =
    capture?.total_bytes && capture?.flow_duration ? capture.total_bytes / capture.flow_duration : null;

  const logLines = useMemo(() => {
    if (error) {
      return [{ text: `[error] ${error}`, tone: "text-rose-400" }];
    }
    if (!analysis) {
      return [{ text: "[system] resolving analysis record...", tone: "text-zinc-500" }];
    }
    const lines: { text: string; tone: string }[] = [
      {
        text: `[intake] ${analysis.filename} — ${captureVolume(analysis)} · ${capturePackets(analysis)} packets`,
        tone: "text-zinc-300",
      },
    ];
    if (capture?.started_at) {
      lines.push({
        text: `[capture] first packet ${capture.started_at} · span ${formatDuration(capture.flow_duration)}`,
        tone: "text-zinc-400",
      });
    }
    lines.push({
      text: `[parse] ${analysis.config_json?.evidence_source ?? "unknown"} evidence · ${analysis.config_json?.windows_count ?? 0} window(s) featurized`,
      tone: "text-zinc-300",
    });
    if (analysis.traffic_label) {
      lines.push({
        text: `[ml] dominant flow class ${analysis.traffic_label} (${((analysis.traffic_confidence ?? 0) * 100).toFixed(1)}%)`,
        tone: "text-teal-300",
      });
    }
    if (analysis.security_score !== null) {
      lines.push({
        text: `[rules] security score ${analysis.security_score}/100 · risk ${analysis.risk_level}`,
        tone: failed ? "text-rose-400" : "text-teal-400",
      });
    }
    (analysis.findings_json ?? []).slice(0, 3).forEach((f) => {
      lines.push({
        text: `[${f.severity.toLowerCase()}] ${f.category}: ${f.description}`,
        tone: f.severity === "CRITICAL" || f.severity === "HIGH" ? "text-rose-400" : "text-zinc-400",
      });
    });
    if (failed) {
      lines.push({
        text: `[failed] ${analysis.config_json?.error ?? "pipeline error"}`,
        tone: "text-rose-400",
      });
    }
    return lines.slice(0, MAX_WORKER_LINES);
  }, [analysis, capture, error, failed]);

  if (!analysisId) {
    return (
      <div className="min-h-screen bg-[#0c0e11] text-zinc-100 antialiased">
        <AppShell active="">
          <div className="p-8 text-sm font-mono">
            No analysis selected.{" "}
            <Link className="underline" href="/analyze">
              Upload a capture
            </Link>
            .
          </div>
        </AppShell>
      </div>
    );
  }

  const badge = failed
    ? "bg-rose-500/10 border-rose-500/25 text-rose-300"
    : "bg-teal-500/10 border-teal-500/25 text-teal-300";

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <ProgressBehavior />
      <AppShell active="">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Subheader Operational Control Strip & File Identity */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <div className="flex items-center gap-2 bg-[#111317] border border-zinc-800 px-3 py-1.5 rounded">
                <span className="material-symbols-outlined text-teal-400 text-base">folder_zip</span>
                <span className="font-mono text-xs text-zinc-200 font-semibold tracking-tight">
                  {analysis?.filename ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span>
                  VOL: <strong className="text-zinc-200 font-normal">{captureVolume(analysis)}</strong>
                </span>
                <span className="text-zinc-700">/</span>
                <span>
                  INGEST: <strong className="text-zinc-200 font-normal">{formatClock(analysis?.created_at)}</strong>
                </span>
                <span className="text-zinc-700">/</span>
                <span>
                  RECORD: <strong className="text-zinc-200 font-normal">#{analysisId.slice(0, 8).toUpperCase()}</strong>
                </span>
              </div>
              <div className={`flex items-center gap-1.5 border px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${failed ? "bg-rose-400" : done ? "bg-teal-400" : "bg-teal-400 animate-pulse"}`}></span>
                {failed ? "PIPELINE FAILED" : done ? "PIPELINE COMPLETE" : "PIPELINE ACTIVE"}
              </div>
            </div>

            {/* Primary Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded text-rose-400 transition-colors text-xs font-mono"
                onClick={() => router.push("/analyze")}
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
                  <span className={`font-mono text-xs font-semibold ${failed ? "text-rose-400" : "text-teal-400"}`}>
                    {failed ? "PIPELINE FAILED" : done ? "100% COMPLETE" : `${percent}% COMPLETE`}
                  </span>
                </div>
                <p className="font-mono text-xs text-zinc-500">
                  {analysis
                    ? `${analysis.config_json?.windows_count ?? 0} window(s) · evidence: ${analysis.config_json?.evidence_source ?? "unknown"}`
                    : "Resolving analysis record…"}
                </p>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Capture Span</span>
                  <span className="text-teal-400 font-semibold text-sm">{formatDuration(capture?.flow_duration)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Ingested Total</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-zinc-200 font-semibold text-sm">{capturePackets(analysis)}</span>
                    <span className="text-zinc-500 text-[11px]">pkts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden flex border border-zinc-800/60">
              <div
                className={`${failed ? "bg-rose-500" : "bg-teal-500"} h-full transition-all duration-500 ease-out`}
                style={{ width: `${percent}%` }}
              ></div>
              {!done && !failed && <div className="bg-teal-400/30 h-full w-4 animate-pulse"></div>}
            </div>
          </div>

          {/* Multi-Pane Execution & Telemetry Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
            {/* Left Column: Pipeline Stages */}
            <div className="xl:col-span-7 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Pipeline Topology</span>
                  <span className="text-zinc-700 font-mono text-xs">/</span>
                  <span className="font-mono text-xs text-zinc-400">{STAGES.length} Verification Passes</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-400">
                  {failed ? "halted" : done ? `${STAGES.length} complete` : "running"}
                </span>
              </div>

              <div className="space-y-1.5">
                {STAGES.map((label, i) => {
                  const state = failed ? "FAILED" : done ? "COMPLETE" : "RUNNING";
                  const tone = failed
                    ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    : done
                    ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                    : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
                  return (
                    <div
                      key={label}
                      className="bg-[#111317] border border-zinc-800/80 rounded px-4 py-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-zinc-500 font-semibold w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-zinc-200 font-medium truncate">{label}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold uppercase tracking-wider flex-shrink-0 ${tone}`}>
                        {state}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Real Telemetry */}
            <div className="xl:col-span-5 flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Packets Parsed</span>
                  <div className="font-display-serif text-2xl text-zinc-100">{capturePackets(analysis)}</div>
                </div>
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">ML Windows</span>
                  <div className="font-display-serif text-2xl text-teal-400">
                    {analysis?.config_json?.windows_count ?? "—"}
                  </div>
                </div>
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Anomalous Windows</span>
                  <div className={`font-display-serif text-2xl ${anomalous > 0 ? "text-rose-400" : "text-zinc-100"}`}>
                    {windows.length ? anomalous : "—"}
                  </div>
                </div>
                <div className="p-3.5 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Mean Throughput</span>
                  <div className="font-display-serif text-2xl text-zinc-100">
                    {throughput !== null ? `${(throughput / 1024).toFixed(1)} KB/s` : "—"}
                  </div>
                </div>
              </div>

              {/* Pipeline trace — built from the stored analysis record */}
              <div className="p-4 rounded-lg bg-[#111317] border border-zinc-800/80 flex flex-col flex-1">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-zinc-500 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base text-teal-400">terminal</span>
                    <span>Pipeline Trace</span>
                  </div>
                  <span className={`font-semibold ${failed ? "text-rose-400" : "text-teal-400"}`}>
                    {failed ? "FAILED" : done ? "FINAL" : "LIVE"}
                  </span>
                </div>
                <div className="mt-3 flex-1 font-mono text-[11px] overflow-y-auto space-y-1 text-zinc-400 select-text pr-1 min-h-[190px]">
                  {logLines.map((line, i) => (
                    <div key={i} className={line.tone}>
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/analysis/results?analysis_id=${analysisId}`}
                className="w-full py-2 rounded bg-teal-500 hover:bg-teal-400 text-zinc-950 font-mono text-xs font-semibold text-center transition-colors"
              >
                View Result Set →
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}
