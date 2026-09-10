"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";
import { useAnalysisBundle } from "@/components/analysis/useAnalysisBundle";
import { downloadReportPdf } from "@/lib/analysis";
import { capturePackets, captureVolume, formatClock, suiteString } from "@/lib/format";

const SEVERITY_TONE: Record<string, string> = {
  CRITICAL: "bg-error-container text-on-error-container",
  HIGH: "bg-error-container text-on-error-container",
  MEDIUM: "bg-secondary-container text-on-secondary-fixed",
  LOW: "bg-tertiary/20 text-tertiary",
  INFO: "bg-surface-container-highest text-on-surface-variant",
};

const MIX_COLORS = ["bg-primary", "bg-tertiary", "bg-secondary-container", "bg-surface-variant", "bg-tertiary-container"];

export default function AnalysisResultsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const toast = useToast();
  const { data, loading, error } = useAnalysisBundle(analysisId);
  const [selected, setSelected] = useState(0);

  if (!analysisId) {
    return (
      <div className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <AppShell active="">
          <div className="p-8 text-sm">No analysis selected. <Link className="underline" href="/analyze">Upload a capture</Link>.</div>
        </AppShell>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <AppShell active="">
          <div className="p-8 text-sm font-mono">Loading analysis…</div>
        </AppShell>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <AppShell active="">
          <div className="p-8 text-sm font-mono">Analysis unavailable: {error ?? "not found"}.</div>
        </AppShell>
      </div>
    );
  }

  const { analysis, findings, traffic } = data;
  const findingList = findings.findings ?? [];
  const score = analysis.security_score;
  const risk = analysis.risk_level ?? "—";
  const crypto = (analysis.config_json?.ipsec_config?.cryptography ?? {}) as Record<string, unknown>;
  const sa = (analysis.config_json?.ipsec_config?.sa_config ?? {}) as Record<string, unknown>;
  const mix = Object.entries(traffic.mix).sort((a, b) => b[1] - a[1]);
  const active = findingList[selected];
  const riskIsBad = risk === "HIGH" || risk === "CRITICAL";
  const gaugeOffset = score === null ? 188.5 : 188.5 * (1 - Math.max(0, Math.min(100, score)) / 100);

  function exportSlices() {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["severity", "category", "description"],
      ...findingList.map((f) => [f.severity, f.category, esc(f.description)]),
    ];
    downloadFile(`${analysis.filename}.findings.csv`, rows.map((r) => r.join(",")).join("\n"), "text/csv");
    toast({ title: "Findings exported", body: `${analysis.filename}.findings.csv downloaded.`, kind: "ok" });
  }

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <AppShell active="">

        {/* Top Command & Ingestion Meta Header */}
        <div className="w-full bg-surface-container-lowest px-space-xl py-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-2xs min-w-0">
            <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
              <span className="hover:text-on-surface cursor-pointer">Captures</span>
              <span>/</span>
              <span className="text-primary font-medium">{analysis.filename}</span>
              <span>/</span>
              <span className="text-on-surface">Forensic Analysis Results</span>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm font-code-sm text-code-sm text-on-surface-variant mt-space-2xs">
              <span className="inline-flex items-center gap-space-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Ingested {formatClock(analysis.created_at)}
              </span>
              <span className="text-outline-variant">•</span>
              <span>{captureVolume(analysis)}</span>
              <span className="text-outline-variant">•</span>
              <span>{capturePackets(analysis)} pkts</span>
              <span className="text-outline-variant">•</span>
              <span className="text-primary font-mono tracking-tight">
                Record {analysis.id.slice(0, 8).toUpperCase()} · {analysis.config_json?.evidence_source ?? "unknown"} evidence
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0">
            <button
              className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
              type="button"
              onClick={async () => {
                try {
                  await downloadReportPdf(analysis.id, analysis.filename);
                  toast({ title: "PDF report downloaded", body: `${analysis.filename} report saved.`, kind: "ok" });
                } catch (err) {
                  toast({ title: "PDF export failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
                }
              }}
            >
              <span className="material-symbols-outlined text-[15px] text-primary">picture_as_pdf</span>
              Export PDF Report
            </button>
            <button
              className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
              type="button"
              onClick={() => {
                downloadFile(
                  `${analysis.filename}-report.json`,
                  JSON.stringify(
                    {
                      capture: analysis.filename,
                      evidence_source: analysis.config_json?.evidence_source,
                      capture_stats: analysis.config_json?.capture,
                      ipsec_config: analysis.config_json?.ipsec_config,
                      risk,
                      security_score: score,
                      traffic_label: analysis.traffic_label,
                      traffic_confidence: analysis.traffic_confidence,
                      anomaly_score: analysis.anomaly_score,
                      findings: findingList,
                    },
                    null,
                    2
                  )
                );
                toast({ title: "Report exported", body: `${analysis.filename}-report.json downloaded.`, kind: "ok" });
              }}
            >
              <span className="material-symbols-outlined text-[15px] text-primary">download</span>
              Export Report (JSON)
            </button>
            <button
              className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
              type="button"
              onClick={() => {
                toast({ title: "Re-analyze", body: "Re-upload the capture to run the pipeline again.", kind: "info" });
                router.push("/analyze");
              }}
            >
              <span className="material-symbols-outlined text-[15px]">autorenew</span>
              Re-analyze
            </button>
            <button
              className="flex items-center gap-space-xs bg-primary-container px-space-sm py-space-xs rounded text-on-primary-container hover:bg-primary transition-colors font-label-md text-label-md font-semibold"
              type="button"
              onClick={() => router.push(`/analysis/capture?analysis_id=${analysis.id}`)}
            >
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              Inspect Packets
            </button>
          </div>
        </div>

        {/* Level 1: Hero Executive Posture Assessment */}
        <div className="px-space-xl py-space-lg bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-4 flex items-center gap-space-lg">
              <div className="relative flex items-center justify-center shrink-0 w-24 h-24 bg-surface-container-lowest rounded-xl shadow-md">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                  <circle className="text-surface-container-highest fill-none" cx="36" cy="36" r="30" stroke="currentColor" strokeWidth="5"></circle>
                  <circle
                    className={`${riskIsBad ? "text-error" : "text-tertiary"} fill-none transition-all duration-700 ease-out`}
                    cx="36"
                    cy="36"
                    r="30"
                    stroke="currentColor"
                    strokeDasharray="188.5"
                    strokeDashoffset={gaugeOffset}
                    strokeLinecap="round"
                    strokeWidth="5"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-display-serif text-3xl text-on-surface font-semibold tracking-tight">{score ?? "—"}</span>
                  <span className="font-mono text-[10px] text-outline -mt-1">/ 100</span>
                </div>
              </div>
              <div className="flex flex-col gap-space-2xs min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Risk Classification</span>
                  <span className={`px-space-xs py-0.5 rounded font-code-sm text-code-sm font-semibold ${riskIsBad ? "bg-error-container text-on-error-container" : "bg-tertiary-container/40 text-tertiary"}`}>
                    {risk}
                  </span>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface">
                  {findingList.length === 0 ? "No rule violations detected" : `${findingList.length} rule violation(s) detected`}
                </div>
                <div className="font-code-sm text-code-sm text-on-surface-variant">
                  {analysis.config_json?.windows_count ?? 0} ML window(s) · anomaly score {analysis.anomaly_score?.toFixed(3) ?? "—"}
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 bg-surface-container-lowest p-space-md rounded-xl flex items-start gap-space-md shadow-sm">
              <div className="w-8 h-8 rounded bg-error-container/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px] text-error">gpp_maybe</span>
              </div>
              <div className="flex flex-col gap-space-2xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Primary Analytical Assessment</span>
                  <span className="font-code-sm text-code-sm text-outline">NIST SP 800-77r1 audit target</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  {active
                    ? active.description
                    : "The deterministic rule engine found no violations for the negotiated suite in this capture."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workbench */}
        <div className="px-space-xl py-space-lg flex flex-col xl:flex-row gap-space-lg">
          <div className="flex-1 flex flex-col gap-space-lg min-w-0">
            {/* Key Security Findings */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md text-on-surface">Key Cryptographic Findings</span>
                  <span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-surface-container-highest text-on-surface-variant">
                    {findingList.length} Assertion{findingList.length === 1 ? "" : "s"}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline">Deterministic rule engine</span>
              </div>
              <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                {findingList.length === 0 ? (
                  <div className="p-space-md rounded bg-surface-container text-on-surface-variant">
                    No findings were raised for this capture.
                  </div>
                ) : (
                  findingList.map((f, i) => (
                    <div
                      key={`${f.category}-${i}`}
                      className="p-space-md rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden group"
                      onClick={() => setSelected(i)}
                    >
                      {selected === i && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                      <div className="flex items-start gap-space-md min-w-0">
                        <span className={`px-space-xs py-0.5 rounded font-code-sm text-code-sm font-semibold shrink-0 ${SEVERITY_TONE[f.severity] ?? SEVERITY_TONE.INFO}`}>
                          {f.severity}
                        </span>
                        <div className="flex flex-col gap-space-2xs min-w-0">
                          <span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                            {f.category}
                          </span>
                          <p className="text-on-surface-variant">{f.description}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-space-xs shrink-0 font-code-sm text-code-sm ${selected === i ? "text-primary" : "text-on-surface-variant group-hover:text-primary"}`}>
                        <span>Inspect</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Encrypted Traffic Intelligence */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md text-on-surface">Encrypted Flow Intelligence</span>
                  <span className="px-space-xs py-0.2 rounded font-label-sm text-label-sm bg-primary/10 text-primary font-mono uppercase">[INFERRED VIA ML]</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline">Classified via packet timing &amp; payload size distributions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center bg-surface-container-lowest p-space-md rounded">
                <div className="md:col-span-8 flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-outline uppercase tracking-wider">Window Label Mix</span>
                    <span className="font-code-sm text-code-sm text-on-surface font-mono">{captureVolume(analysis)} Ingress/Egress</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                    {mix.length === 0 ? (
                      <div className="bg-surface-variant h-full w-full" title="No windows"></div>
                    ) : (
                      mix.map(([label, ratio], i) => (
                        <div
                          key={label}
                          className={`${MIX_COLORS[i % MIX_COLORS.length]} h-full transition-all`}
                          style={{ width: `${ratio * 100}%` }}
                          title={`${label}: ${(ratio * 100).toFixed(0)}%`}
                        ></div>
                      ))
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-space-md pt-space-2xs font-code-sm text-code-sm">
                    {mix.map(([label, ratio], i) => (
                      <div key={label} className="flex items-center gap-space-2xs">
                        <span className={`w-2 h-2 rounded-full ${MIX_COLORS[i % MIX_COLORS.length]}`}></span>
                        <span className="text-on-surface font-semibold capitalize">{label}</span>
                        <span className="text-outline">{(ratio * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-4 flex flex-col gap-space-2xs bg-surface-container-low p-space-sm rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-outline">Anomaly Score</span>
                    <span className="px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-code-sm text-code-sm font-semibold">
                      {analysis.anomaly_score !== null ? analysis.anomaly_score.toFixed(3) : "—"}
                    </span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface capitalize">
                    {analysis.traffic_label ?? "Unclassified"}
                  </div>
                  <p className="font-code-sm text-code-sm text-on-surface-variant">
                    Dominant window label at {((analysis.traffic_confidence ?? 0) * 100).toFixed(1)}% confidence.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  className="inline-flex items-center gap-space-xs font-code-sm text-code-sm text-primary hover:underline"
                  href={`/analysis/traffic?analysis_id=${analysis.id}`}
                >
                  <span>View Complete Traffic Distribution</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Negotiated Stack */}
          <div className="w-full xl:w-96 flex flex-col gap-space-lg shrink-0">
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
              <div className="flex items-center justify-between pb-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md text-on-surface">Negotiated Stack</span>
                  <span className="font-label-sm text-label-sm px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-mono uppercase">
                    [{analysis.config_json?.evidence_source === "parser" ? "CONFIRMED" : "UNCONFIRMED"}]
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Protocol Architecture</span>
                <div className="bg-surface-container rounded p-space-sm flex flex-col gap-space-xs font-code-sm text-code-sm">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">IKE Standard</span>
                    <span className="text-on-surface font-semibold">{String(sa.ike_version ?? "UNKNOWN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">Mode</span>
                    <span className="text-on-surface">{String(sa.mode ?? "UNKNOWN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">Anti-Replay</span>
                    <span className={sa.replay_protection === false ? "text-error font-semibold" : "text-on-surface"}>
                      {sa.replay_protection === false ? "DISABLED" : "ENABLED"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">SA Lifetime</span>
                    <span className="text-on-surface">{sa.lifetime_seconds ? `${sa.lifetime_seconds}s` : "UNKNOWN"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Negotiated Cryptography</span>
                <div className="bg-surface-container rounded p-space-sm flex flex-col gap-space-xs font-code-sm text-code-sm">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">Encryption</span>
                    <span className="text-on-surface font-semibold">{String(crypto.encryption_algorithm ?? "UNKNOWN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">Integrity (ICV)</span>
                    <span className="text-on-surface">{String(crypto.integrity_algorithm ?? "UNKNOWN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">Key Exchange</span>
                    <span className={crypto.dh_group === 2 ? "px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-semibold" : "text-on-surface"}>
                      {crypto.dh_group ? `DH Group ${crypto.dh_group}` : "UNKNOWN"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-on-surface-variant">Forward Secrecy</span>
                    <span className={crypto.pfs_enabled ? "text-tertiary font-semibold" : "text-error font-semibold"}>
                      {crypto.pfs_enabled ? "ENABLED" : "DISABLED"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm flex items-center justify-between text-outline">
                <span>Suite:</span>
                <span className="text-on-surface font-mono truncate">{suiteString(analysis)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forensic Deep-Dive Drawer */}
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-surface-container-low shadow-xl z-50 transform transition-transform duration-300 flex flex-col ${active ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-header-height px-space-base bg-surface-container-lowest flex items-center justify-between shrink-0">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">biotech</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Forensic Dissection Inspector</span>
            </div>
            <button className="p-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button" onClick={() => setSelected(-1)}>
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-space-base flex flex-col gap-space-md">
            {active ? (
              <>
                <div className="bg-surface-container p-space-md rounded flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className={`px-space-xs py-0.5 rounded font-code-sm text-code-sm font-semibold ${SEVERITY_TONE[active.severity] ?? SEVERITY_TONE.INFO}`}>
                      {active.severity}
                    </span>
                    <span className="font-code-sm text-code-sm text-outline">{active.category}</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface">{active.category} finding</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{active.description}</p>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Parameters Cited</span>
                  <div className="bg-surface-container-lowest rounded p-space-sm flex flex-col gap-space-xs font-code-sm text-code-sm">
                    <div className="flex justify-between py-0.5">
                      <span className="text-outline">Capture</span>
                      <span className="text-on-surface font-mono truncate">{analysis.filename}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-outline">Evidence source</span>
                      <span className="text-on-surface font-mono">{analysis.config_json?.evidence_source ?? "unknown"}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-outline">Encryption</span>
                      <span className="text-on-surface font-mono">{String(crypto.encryption_algorithm ?? "UNKNOWN")}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-outline">Integrity</span>
                      <span className="text-on-surface font-mono">{String(crypto.integrity_algorithm ?? "UNKNOWN")}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-outline">DH Group</span>
                      <span className={crypto.dh_group === 2 ? "text-error font-mono font-semibold" : "text-on-surface font-mono"}>
                        {crypto.dh_group ? String(crypto.dh_group) : "UNKNOWN"}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-outline">PFS</span>
                      <span className={crypto.pfs_enabled ? "text-tertiary font-mono" : "text-error font-mono font-semibold"}>
                        {crypto.pfs_enabled ? "ENABLED" : "DISABLED"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm text-on-surface-variant leading-relaxed">
                  Findings are produced by the deterministic rule engine in
                  <span className="text-on-surface font-mono"> backend/app/security_engine</span> from the parsed
                  SA parameters — no generative text is involved.
                </div>
              </>
            ) : null}
          </div>
          <div className="p-space-base bg-surface-container-lowest flex items-center justify-between shrink-0">
            <button className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button" onClick={() => setSelected(-1)}>
              Dismiss Inspector
            </button>
            <button className="px-space-md py-space-xs rounded bg-primary-container hover:bg-primary text-on-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-space-xs" type="button" onClick={exportSlices}>
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              Export Findings CSV
            </button>
          </div>
        </div>
      </AppShell>
    </div>
  );
}
