"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";
import { getAnalysis, listHistory, type Analysis } from "@/lib/analysis";
import { capturePackets, captureVolume, formatClock, suiteString } from "@/lib/format";

const SEVERITY_TONE: Record<string, string> = {
  CRITICAL: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  HIGH: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  MEDIUM: "border-teal-500/20 bg-teal-500/10 text-teal-400",
  LOW: "border-teal-500/20 bg-teal-500/10 text-teal-400",
  INFO: "border-zinc-800 bg-zinc-900 text-zinc-400",
};

export default function AssistantPage() {
  const params = useSearchParams();
  const toast = useToast();
  const analysisId = params.get("analysis_id");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const row = analysisId ? await getAnalysis(analysisId) : (await listHistory({ limit: 1 })).items[0];
        if (!dead) setAnalysis(row ?? null);
      } catch (err) {
        if (!dead) setError(err instanceof Error ? err.message : "Unavailable.");
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, [analysisId]);

  const crypto = (analysis?.config_json?.ipsec_config?.cryptography ?? {}) as Record<string, unknown>;
  const sa = (analysis?.config_json?.ipsec_config?.sa_config ?? {}) as Record<string, unknown>;
  const findings = analysis?.findings_json ?? [];

  function exportDossier() {
    if (!analysis) return;
    downloadFile(
      `${analysis.filename}-explanation.json`,
      JSON.stringify(
        {
          capture: analysis.filename,
          evidence_source: analysis.config_json?.evidence_source,
          ipsec_config: analysis.config_json?.ipsec_config,
          capture_stats: analysis.config_json?.capture,
          security_score: analysis.security_score,
          risk_level: analysis.risk_level,
          findings,
        },
        null,
        2
      )
    );
    toast({ title: "Dossier exported", body: `${analysis.filename}-explanation.json downloaded.`, kind: "ok" });
  }

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
      <AppShell active="analysis">
        <div className="border-b border-zinc-800/80 bg-[#111317]/90 backdrop-blur px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Link href="/history" className="hover:text-zinc-300 transition-colors">
                Captures
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">{analysis?.filename ?? "—"}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">Finding Explanation</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 text-xs font-mono">
              <span className="material-symbols-outlined text-[14px] text-teal-400">verified_user</span>
              <span>DETERMINISTIC RULE ENGINE</span>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
            <div>
              <h1 className="font-display-serif text-2xl font-bold tracking-tight text-white">
                Finding Explanation
              </h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Explanations below are generated from the deterministic rule engine output for this capture. No
                generative model is involved.
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 bg-[#14171c] hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 px-3 py-1.5 rounded text-xs font-mono transition-colors disabled:opacity-50"
              type="button"
              disabled={!analysis}
              onClick={exportDossier}
            >
              <span className="material-symbols-outlined text-[14px] text-zinc-400">data_object</span>
              <span>Export Dossier (.json)</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="font-mono text-xs text-zinc-500">Loading…</div>
          ) : error ? (
            <div className="font-mono text-xs text-rose-400">{error}</div>
          ) : !analysis ? (
            <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5 font-mono text-xs text-zinc-400">
              No analyses yet.{" "}
              <Link className="underline text-teal-400" href="/analyze">
                Upload a capture
              </Link>
              .
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5 flex flex-col xl:flex-row gap-6 justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col justify-center items-center bg-[#0c0e11] border border-zinc-800/60 px-5 py-3 rounded-lg min-w-[120px]">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Security Score</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span
                        className={`font-display-serif text-3xl font-bold ${
                          analysis.risk_level === "LOW" ? "text-teal-400" : "text-rose-400"
                        }`}
                      >
                        {analysis.security_score ?? "—"}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">/ 100</span>
                    </div>
                    <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded mt-2 uppercase">
                      {analysis.risk_level ?? "—"}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center space-y-1">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      Negotiated Suite
                    </span>
                    <h2 className="font-mono text-base font-semibold text-white">{suiteString(analysis)}</h2>
                    <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                      {findings.length} finding(s) raised · {analysis.config_json?.windows_count ?? 0} ML window(s) ·
                      evidence from {analysis.config_json?.evidence_source ?? "unknown"}
                    </p>
                  </div>
                </div>
                <div className="bg-[#14171c] border border-zinc-800/60 px-4 py-3 rounded-lg flex flex-col gap-1 min-w-[190px] font-mono text-xs">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Evaluated Capture</span>
                  <span className="text-teal-400 font-medium">{analysis.filename}</span>
                  <span className="text-zinc-500 text-[11px]">
                    {captureVolume(analysis)} · {capturePackets(analysis)} pkts
                  </span>
                  <span className="text-zinc-500 text-[11px]">{formatClock(analysis.created_at)}</span>
                </div>
              </div>

              {/* Negotiated parameters */}
              <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5 space-y-3">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  Negotiated Parameters
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                  {[
                    { label: "Encryption", value: String(crypto.encryption_algorithm ?? "UNKNOWN") },
                    { label: "Integrity", value: String(crypto.integrity_algorithm ?? "UNKNOWN") },
                    { label: "DH Group", value: crypto.dh_group ? String(crypto.dh_group) : "—" },
                    { label: "PFS", value: crypto.pfs_enabled ? "ENABLED" : "DISABLED" },
                    { label: "IKE", value: String(sa.ike_version ?? "UNKNOWN") },
                    { label: "Mode", value: String(sa.mode ?? "UNKNOWN") },
                    { label: "Anti-Replay", value: sa.replay_protection === false ? "DISABLED" : "ENABLED" },
                    { label: "Lifetime", value: sa.lifetime_seconds ? `${sa.lifetime_seconds}s` : "—" },
                  ].map((cell) => (
                    <div key={cell.label} className="bg-[#14171c] border border-zinc-800/60 p-3 rounded-lg">
                      <div className="text-zinc-500 text-[10px] uppercase">{cell.label}</div>
                      <div className="mt-1 font-semibold text-zinc-100">{cell.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-3">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  Findings ({findings.length})
                </h2>
                {findings.length === 0 ? (
                  <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-4 font-mono text-xs text-zinc-400">
                    The rule engine raised no findings for this capture.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {findings.map((f, i) => (
                      <div
                        key={`${f.category}-${i}`}
                        className="bg-[#111317] border border-zinc-800/80 p-4 rounded-lg flex items-start gap-3"
                      >
                        <span
                          className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                            SEVERITY_TONE[f.severity] ?? SEVERITY_TONE.INFO
                          }`}
                        >
                          {f.severity}
                        </span>
                        <div>
                          <div className="font-mono text-xs font-semibold text-zinc-100">{f.category}</div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{f.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </AppShell>
    </div>
  );
}
