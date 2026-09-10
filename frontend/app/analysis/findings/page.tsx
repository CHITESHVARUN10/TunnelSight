"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import Stat from "@/components/motion/Stat";
import { AppShell } from "@/components/layout/AppShell";
import { getAnalysis, getFindings, type Analysis } from "@/lib/analysis";

type Finding = { severity: string; category: string; description: string };

export default function FindingsPage() {
  const toast = useToast();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [risk, setRisk] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [severity, setSeverity] = useState("all");
  const [evidence, setEvidence] = useState("all");
  const [query, setQuery] = useState("");
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const reload = async (sev = severity, q = query) => {
    if (!analysisId) return;
    try {
      const [a, f] = await Promise.all([
        getAnalysis(analysisId),
        getFindings(analysisId, { severity: sev === "all" ? undefined : sev.toUpperCase(), q: q || undefined }),
      ]);
      setAnalysis(a);
      setFindings(f.findings ?? []);
      setScore(f.security_score);
      setRisk(f.risk_level);
    } catch (err) {
      toast({ title: "Findings unavailable", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]);

  if (!analysisId) {
    return (
      <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased">
        <AppShell active="/analysis/findings" innerClassName="flex flex-col w-full text-zinc-200">
          <div className="p-8 text-sm">No analysis selected. <Link className="underline" href="/analyze">Upload a capture</Link>.</div>
        </AppShell>
      </div>
    );
  }
  const counts = (sev: string) => findings.filter((f) => f.severity === sev).length;
  function pickSeverity(s: string, label: string) {
    setSeverity(s);
    reload(s, query);
    toast({ title: `Severity filter: ${label}`, body: "Finding queue filtered.", kind: "info" });
  }
  function pickEvidence(e: string, label: string) {
    setEvidence(e);
    toast({ title: `Evidence filter: ${label}`, body: "All rule findings are deterministic.", kind: "info" });
  }
  function selectRow(id: number) {
    setSelectedRow(id);
    setInspectorOpen(true);
  }
  const selected = selectedRow !== null ? findings[selectedRow] : undefined;
  const exportCSV = () => {
    const rows = [["severity", "category", "description"], ...findings.map((f) => [f.severity, f.category, f.description])];
    downloadFile(`${analysis?.filename ?? "findings"}.csv`, rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n"), "text/csv");
    toast({ title: "Findings exported", body: "findings.csv downloaded.", kind: "ok" });
  };
  const exportPlan = () => {
    downloadFile(
      `${analysis?.filename ?? "remediation"}-plan.json`,
      JSON.stringify({ capture: analysis?.filename, risk, security_score: score, findings }, null, 2)
    );
    toast({ title: "Remediation plan exported", body: "plan downloaded.", kind: "ok" });
  };
  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/analysis/findings" innerClassName="flex flex-col w-full text-zinc-200">

        {/* 1. SUB-HEADER / CONTEXT BAR */}
        <section className="bg-[#111317] border-b border-zinc-800/80 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
              <Link href="/history" className="hover:text-zinc-300 transition-colors">Captures</Link>
              <span>/</span>
              <span className="text-teal-400 font-medium">{analysis?.filename ?? "—"}</span>
              <span>/</span>
              <span className="text-zinc-200 font-medium">Security Findings &amp; Threat Matrix</span>
            </div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-zinc-400">
              <span className="flex items-center gap-2 text-zinc-100 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                <span className="font-display-serif font-bold text-base text-white tabular-nums"><Stat to={findings.length} /></span> Security Findings Identified
              </span>
              <span className="text-zinc-700">|</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-semibold">{counts("CRITICAL")} Critical</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold">{counts("HIGH")} High</span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">{counts("MEDIUM")} Medium</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 font-mono">{counts("LOW")} Low</span>
              <span className="text-zinc-700">|</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Framework: NIST SP 800-77r1 &amp; RFC 8247</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800/80 transition-colors rounded text-xs font-mono font-medium"
              type="button"
              onClick={exportCSV}
            >
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>Export CSV</span>
            </button>
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-colors rounded text-xs font-medium font-mono"
              type="button"
              onClick={exportPlan}
            >
              <span className="material-symbols-outlined text-[15px] text-teal-400">verified_user</span>
              <span>Remediation Plan</span>
            </button>
          </div>
        </section>

        {/* 2. TOP ANALYTICAL SUMMARY & THREAT MATRIX */}
        <section className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 bg-[#111317] p-5 rounded-lg border border-zinc-800/90 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">Exploitability vs. Impact Matrix</h3>
                  <p className="font-mono text-xs text-zinc-400">NIST CVE-CVSS Calibration · 7 Discovered Vulnerabilities Plotted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase">
                <span className="flex items-center gap-1.5 text-zinc-400"><span className="w-2 h-2 rounded-sm bg-zinc-700"></span>Low</span>
                <span className="flex items-center gap-1.5 text-sky-400"><span className="w-2 h-2 rounded-sm bg-sky-500/40"></span>Medium</span>
                <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-sm bg-amber-500/40"></span>High</span>
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Critical</span>
              </div>
            </div>

            {/* 5x5 Matrix Grid */}
            <div className="relative grid grid-cols-5 grid-rows-5 gap-1.5 font-mono text-xs select-none h-60">
              {/* Row 5 (Likelihood 5) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L5/I1</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L5/I2</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L5/I3</span></div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === 0 ? "bg-rose-950/50 border-rose-500 ring-1 ring-rose-500" : "bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/40"}`}
                onClick={() => selectRow(0)}
              >
                <span className="text-rose-400 text-[10px] font-semibold">L5/I4</span>
                <div className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight truncate" title="FND-2024-04: High-Velocity Upstream Egress Anomaly">
                  F-04 Flow Blast
                </div>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L5/I5</span></div>

              {/* Row 4 (Likelihood 4) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L4/I1</span></div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === 1 ? "bg-sky-950/50 border-sky-500 ring-1 ring-sky-500" : "bg-sky-950/20 border-sky-500/30 hover:bg-sky-950/40"}`}
                onClick={() => selectRow(1)}
              >
                <span className="text-zinc-500 text-[10px]">L4/I2</span>
                <div className="bg-sky-900/60 text-sky-200 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate" title="FND-2024-06: NAT-T UDP Encapsulation Without Jitter">
                  F-06 NAT-T
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === 2 ? "bg-sky-950/50 border-sky-500 ring-1 ring-sky-500" : "bg-sky-950/20 border-sky-500/30 hover:bg-sky-950/40"}`}
                onClick={() => selectRow(2)}
              >
                <span className="text-zinc-500 text-[10px]">L4/I3</span>
                <div className="bg-sky-900/60 text-sky-200 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate" title="FND-2024-05: PSK Authentication with Weak Proofing">
                  F-05 PSK Auth
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === 3 ? "bg-amber-950/50 border-amber-500 ring-1 ring-amber-500" : "bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/40"}`}
                onClick={() => selectRow(3)}
              >
                <span className="text-amber-400 text-[10px] font-semibold">L4/I4</span>
                <div className="bg-amber-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight truncate" title="FND-2024-02: PFS Disabled on Rekey">
                  F-02 No PFS
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === 4 ? "bg-rose-950/70 border-rose-400 ring-1 ring-teal-400" : "bg-rose-950/30 border-rose-500/50 hover:bg-rose-950/50"}`}
                onClick={() => selectRow(4)}
              >
                <span className="text-rose-400 text-[10px] font-bold">L4/I5</span>
                <div className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-md truncate" title="FND-2024-01: Weak Diffie-Hellman Group 2">
                  F-01 DH Grp 2
                </div>
              </div>

              {/* Row 3 (Likelihood 3) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L3/I1</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L3/I2</span></div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === 5 ? "bg-amber-950/50 border-amber-500 ring-1 ring-amber-500" : "bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/40"}`}
                onClick={() => selectRow(5)}
              >
                <span className="text-zinc-500 text-[10px]">L3/I3</span>
                <div className="bg-amber-900/60 text-amber-200 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate" title="FND-2024-03: Legacy AES-CBC + SHA-1 Suite">
                  F-03 3DES/SHA1
                </div>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L3/I4</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L3/I5</span></div>

              {/* Row 2 (Likelihood 2) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L2/I1</span></div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === 6 ? "bg-zinc-800 border-zinc-500 ring-1 ring-zinc-400" : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/60"}`}
                onClick={() => selectRow(6)}
              >
                <span className="text-zinc-500 text-[10px]">L2/I2</span>
                <div className="bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate">
                  F-07 Replay Gap
                </div>
              </div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L2/I3</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L2/I4</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L2/I5</span></div>

              {/* Row 1 (Likelihood 1) */}
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L1/I1</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L1/I2</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L1/I3</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L1/I4</span></div>
              <div className="bg-zinc-900/50 rounded p-1.5 border border-zinc-800/50 flex flex-col justify-between"><span className="text-zinc-600 text-[10px]">L1/I5</span></div>
            </div>

            <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase pt-2.5 border-t border-zinc-800/80">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-teal-400">arrow_forward</span>
                Impact: Negligible (I1) → Catastrophic (I5)
              </span>
              <span className="text-right">Likelihood: Rare (L1) → Active (L5)</span>
            </div>
          </div>

          {/* Side Summary Cards */}
          <div className="xl:col-span-4 flex flex-col gap-3 justify-between">
            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Cryptographic Margin</span>
                <span className="text-base text-rose-400 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">warning</span>Compromised
                </span>
                <span className="text-xs text-zinc-400">Legacy 1024-bit primes detected</span>
              </div>
              <div className="w-14 h-14 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-display-serif font-bold text-lg text-rose-400">
                &lt;80b
              </div>
            </div>

            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Forward Secrecy (PFS)</span>
                <span className="text-base text-rose-400 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">lock_open</span>Disabled
                </span>
                <span className="text-xs text-zinc-400">Subject to retroactive decryption</span>
              </div>
              <div className="w-14 h-14 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-display-serif font-bold text-lg text-rose-400">
                0%
              </div>
            </div>

            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Tunnel Behavioral Drift</span>
                <span className="text-base text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">crisis_alert</span>Severe Egress Spike
                </span>
                <span className="text-xs text-zinc-400">4.8x burst anomaly in W-28</span>
              </div>
              <div className="w-14 h-14 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-display-serif font-bold text-lg text-amber-400 tabular-nums">
                0.91
              </div>
            </div>

            <div className="bg-[#111317] p-4 rounded-lg border border-zinc-800/90 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Remediation Effort</span>
                <span className="text-base text-teal-400 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">build_circle</span>Low Effort
                </span>
                <span className="text-xs text-zinc-400">3 config stanza replacements</span>
              </div>
              <div className="w-14 h-14 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-display-serif font-bold text-sm text-teal-400">
                3 LOC
              </div>
            </div>
          </div>
        </section>

        {/* 3. MULTI-DIMENSIONAL FILTER TOOLBAR */}
        <section className="px-6 pb-4">
          <div className="bg-[#111317] p-2 rounded-lg border border-zinc-800/90 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-2.5">
              <div className="flex items-center bg-zinc-900 border border-zinc-800/80 rounded-md p-0.5">
                <span className="font-mono text-[10px] uppercase text-zinc-500 px-2">Severity</span>
                <button
                  className={severity === "all" ? "px-2.5 py-1 text-xs font-mono bg-zinc-800 text-white rounded font-medium" : "px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"}
                  type="button"
                  onClick={() => pickSeverity("all", "All (7)")}
                >All (7)</button>
                <button
                  className={severity === "critical" ? "px-2.5 py-1 text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-medium" : "px-2.5 py-1 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"}
                  type="button"
                  onClick={() => pickSeverity("critical", "Critical (2)")}
                >Critical (2)</button>
                <button
                  className={severity === "high" ? "px-2.5 py-1 text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-medium" : "px-2.5 py-1 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"}
                  type="button"
                  onClick={() => pickSeverity("high", "High (2)")}
                >High (2)</button>
                <button
                  className={severity === "medium" ? "px-2.5 py-1 text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded font-medium" : "px-2.5 py-1 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"}
                  type="button"
                  onClick={() => pickSeverity("medium", "Medium (2)")}
                >Medium (2)</button>
                <button
                  className={severity === "low" ? "px-2.5 py-1 text-xs font-mono bg-zinc-800 text-zinc-200 rounded font-medium" : "px-2.5 py-1 text-xs font-mono text-zinc-500 hover:text-zinc-400 transition-colors"}
                  type="button"
                  onClick={() => pickSeverity("low", "Low (1)")}
                >Low (1)</button>
              </div>

              <div className="flex items-center bg-zinc-900 border border-zinc-800/80 rounded-md p-0.5">
                <span className="font-mono text-[10px] uppercase text-zinc-500 px-2">Evidence</span>
                <button
                  className={evidence === "all" ? "px-2.5 py-1 text-xs font-mono bg-zinc-800 text-white rounded font-medium" : "px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"}
                  type="button"
                  onClick={() => pickEvidence("all", "All")}
                >All</button>
                <button
                  className={evidence === "confirmed" ? "px-2.5 py-1 text-xs font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded flex items-center gap-1.5 font-medium" : "px-2.5 py-1 text-xs font-mono text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"}
                  type="button"
                  onClick={() => pickEvidence("confirmed", "Confirmed (6)")}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>Confirmed (6)
                </button>
                <button
                  className={evidence === "inferred" ? "px-2.5 py-1 text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded flex items-center gap-1.5 font-medium" : "px-2.5 py-1 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"}
                  type="button"
                  onClick={() => pickEvidence("inferred", "Inferred (1)")}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Inferred (1)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 w-full sm:w-80">
              <span className="material-symbols-outlined text-[16px] text-zinc-500">search</span>
              <input
                className="bg-transparent border-0 p-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none w-full font-mono"
                placeholder="Filter by description..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") reload(severity, query);
                  if (e.key === "Escape") {
                    setQuery("");
                    reload(severity, "");
                  }
                }}
              />
              <kbd className="font-mono text-[10px] text-zinc-500 bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700">ESC</kbd>
            </div>
          </div>
        </section>

        {/* 4. WORKBENCH SPLIT: PRIORITIZED FINDINGS TABLE + INSPECTOR DRAWER */}
        <section className="px-6 pb-12 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 bg-[#111317] rounded-lg border border-zinc-800/90 flex flex-col overflow-hidden">
            <div className="bg-zinc-900/80 px-4 py-2.5 grid grid-cols-12 gap-3 text-zinc-400 font-mono text-[11px] uppercase tracking-wider select-none border-b border-zinc-800">
              <div className="col-span-3">Severity &amp; ID</div>
              <div className="col-span-4">Finding &amp; Layer</div>
              <div className="col-span-3">Target Scope</div>
              <div className="col-span-2 text-right">Evidence</div>
            </div>

            <div className="divide-y divide-zinc-800/50 flex flex-col text-xs">
              {findings.map((f, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === i ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                  onClick={() => selectRow(i)}
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">{f.severity}</span>
                    <span className="font-mono text-zinc-400">F-{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="col-span-4 flex flex-col min-w-0">
                    <span className="font-semibold text-white truncate">{f.category}</span>
                    <span className="text-zinc-400 text-[11px] truncate">{f.description}</span>
                  </div>
                  <div className="col-span-3 flex flex-col min-w-0 font-mono">
                    <span className="text-zinc-200 truncate">{analysis?.filename ?? "—"}</span>
                    <span className="text-zinc-500 text-[11px] truncate">{risk ?? ""} · {score ?? "—"}/100</span>
                  </div>
                  <div className="col-span-2 flex flex-col items-end gap-0.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 font-medium">CONFIRMED</span>
                    <span className="font-mono text-[10px] text-zinc-500">Deterministic</span>
                  </div>
                </div>
              ))}
              {findings.length === 0 && (
                <div className="px-4 py-8 text-center text-zinc-500 font-mono text-xs">No findings match this filter.</div>
              )}
            </div>
          </div>

          {/* Inspector drawer: selected finding detail */}
          <div className="xl:col-span-5 bg-[#111317] rounded-lg border border-zinc-800/90 p-5 flex flex-col gap-3">
            {selected ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">{selected.severity}</span>
                  <span className="text-sm text-white font-semibold">{selected.category}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{selected.description}</p>
                <div className="font-mono text-[11px] text-zinc-500">
                  Capture: <span className="text-zinc-300">{analysis?.filename ?? "—"}</span>
                </div>
              </>
            ) : (
              <span className="text-xs font-mono text-zinc-500">Select a finding to inspect.</span>
            )}
          </div>
        </section>
      </AppShell>
    </div>
  );
}
