"use client";
import Link from "next/link";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON, findingsCSV } from "@/lib/mock/analysis"; import Stat from "@/components/motion/Stat";
import { AppShell } from "@/components/layout/AppShell";

export default function FindingsPage() {
  const toast = useToast();
  const [selectedRow, setSelectedRow] = useState<string | null>("row-fnd-01");
  const [severity, setSeverity] = useState("all");
  const [evidence, setEvidence] = useState("all");
  const [query, setQuery] = useState("");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  function pickSeverity(s: string, label: string) {
    setSeverity(s);
    toast({ title: `Severity filter: ${label}`, body: "Finding queue filtered (mock).", kind: "info" });
  }
  function pickEvidence(e: string, label: string) {
    setEvidence(e);
    toast({ title: `Evidence filter: ${label}`, body: "Finding queue filtered (mock).", kind: "info" });
  }
  function selectRow(id: string) {
    setSelectedRow(id);
    setInspectorOpen(true);
  }
  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/analysis/findings" innerClassName="flex flex-col w-full text-zinc-200">

        {/* 1. SUB-HEADER / CONTEXT BAR */}
        <section className="bg-[#111317] border-b border-zinc-800/80 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
              <Link href="/history" className="hover:text-zinc-300 transition-colors">Captures</Link>
              <span>/</span>
              <span className="text-teal-400 font-medium">weak-vpn-07.pcap</span>
              <span>/</span>
              <span className="text-zinc-200 font-medium">Security Findings &amp; Threat Matrix</span>
            </div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-zinc-400">
              <span className="flex items-center gap-2 text-zinc-100 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                <span className="font-display-serif font-bold text-base text-white tabular-nums"><Stat to={7} /></span> Security Findings Identified
              </span>
              <span className="text-zinc-700">|</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-semibold">2 Critical</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold">2 High</span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">2 Medium</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 font-mono">1 Low</span>
              <span className="text-zinc-700">|</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Framework: NIST SP 800-77r1 &amp; RFC 8247</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800/80 transition-colors rounded text-xs font-mono font-medium"
              type="button"
              onClick={() => { downloadFile("findings.csv", findingsCSV(), "text/csv"); toast({ title: "Findings exported", body: "findings.csv downloaded.", kind: "ok" }); }}
            >
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>Export CSV</span>
            </button>
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-colors rounded text-xs font-medium font-mono"
              type="button"
              onClick={() => { downloadFile("executive-remediation-plan.json", executiveReportJSON()); toast({ title: "Remediation plan exported", body: "executive-remediation-plan.json downloaded.", kind: "ok" }); }}
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
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === "row-fnd-04" ? "bg-rose-950/50 border-rose-500 ring-1 ring-rose-500" : "bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/40"}`}
                onClick={() => selectRow("row-fnd-04")}
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
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === "row-fnd-06" ? "bg-sky-950/50 border-sky-500 ring-1 ring-sky-500" : "bg-sky-950/20 border-sky-500/30 hover:bg-sky-950/40"}`}
                onClick={() => selectRow("row-fnd-06")}
              >
                <span className="text-zinc-500 text-[10px]">L4/I2</span>
                <div className="bg-sky-900/60 text-sky-200 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate" title="FND-2024-06: NAT-T UDP Encapsulation Without Jitter">
                  F-06 NAT-T
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === "row-fnd-05" ? "bg-sky-950/50 border-sky-500 ring-1 ring-sky-500" : "bg-sky-950/20 border-sky-500/30 hover:bg-sky-950/40"}`}
                onClick={() => selectRow("row-fnd-05")}
              >
                <span className="text-zinc-500 text-[10px]">L4/I3</span>
                <div className="bg-sky-900/60 text-sky-200 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight truncate" title="FND-2024-05: PSK Authentication with Weak Proofing">
                  F-05 PSK Auth
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === "row-fnd-02" ? "bg-amber-950/50 border-amber-500 ring-1 ring-amber-500" : "bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/40"}`}
                onClick={() => selectRow("row-fnd-02")}
              >
                <span className="text-amber-400 text-[10px] font-semibold">L4/I4</span>
                <div className="bg-amber-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight truncate" title="FND-2024-02: PFS Disabled on Rekey">
                  F-02 No PFS
                </div>
              </div>
              <div
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === "row-fnd-01" ? "bg-rose-950/70 border-rose-400 ring-1 ring-teal-400" : "bg-rose-950/30 border-rose-500/50 hover:bg-rose-950/50"}`}
                onClick={() => selectRow("row-fnd-01")}
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
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === "row-fnd-03" ? "bg-amber-950/50 border-amber-500 ring-1 ring-amber-500" : "bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/40"}`}
                onClick={() => selectRow("row-fnd-03")}
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
                className={`rounded p-1.5 border flex flex-col justify-between cursor-pointer transition-colors ${selectedRow === "row-fnd-07" ? "bg-zinc-800 border-zinc-500 ring-1 ring-zinc-400" : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/60"}`}
                onClick={() => selectRow("row-fnd-07")}
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
                placeholder="Filter by CVE, transform, RFC..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
              {/* Row 1 */}
              <div
                className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === "row-fnd-01" ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                id="row-fnd-01"
                onClick={() => selectRow("row-fnd-01")}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>
                  <span className="font-mono text-teal-400 font-semibold">FND-2024-01</span>
                </div>
                <div className="col-span-4 flex flex-col min-w-0">
                  <span className="font-semibold text-white truncate">Weak DH Group 2 (MODP-1024)</span>
                  <span className="text-zinc-400 text-[11px] truncate">Cryptography · Key Exchange</span>
                </div>
                <div className="col-span-3 flex flex-col min-w-0 font-mono">
                  <span className="text-zinc-200 truncate">IKEv2 Control Plane</span>
                  <span className="text-zinc-500 text-[11px] truncate">Frames #42, #45</span>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 font-medium">CONFIRMED</span>
                  <span className="font-mono text-[10px] text-zinc-500">Deterministic</span>
                </div>
              </div>

              {/* Row 2 */}
              <div
                className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === "row-fnd-02" ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                id="row-fnd-02"
                onClick={() => selectRow("row-fnd-02")}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>
                  <span className="font-mono text-zinc-400">FND-2024-02</span>
                </div>
                <div className="col-span-4 flex flex-col min-w-0">
                  <span className="font-medium text-white truncate">PFS Disabled on Rekey</span>
                  <span className="text-zinc-400 text-[11px] truncate">Key Management · Ephemeral KE</span>
                </div>
                <div className="col-span-3 flex flex-col min-w-0 font-mono">
                  <span className="text-zinc-200 truncate">ESP Data SA (0x9a02)</span>
                  <span className="text-zinc-500 text-[11px] truncate">Frame #142</span>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 font-medium">CONFIRMED</span>
                  <span className="font-mono text-[10px] text-zinc-500">Deterministic</span>
                </div>
              </div>

              {/* Row 3 */}
              <div
                className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === "row-fnd-04" ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                id="row-fnd-04"
                onClick={() => selectRow("row-fnd-04")}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>
                  <span className="font-mono text-zinc-400">FND-2024-04</span>
                </div>
                <div className="col-span-4 flex flex-col min-w-0">
                  <span className="font-medium text-white truncate">High-Velocity Upstream Egress</span>
                  <span className="text-zinc-400 text-[11px] truncate">Behavioral Anomaly · Flow Burst</span>
                </div>
                <div className="col-span-3 flex flex-col min-w-0 font-mono">
                  <span className="text-zinc-200 truncate">Tunnel 0x0c3e8019a</span>
                  <span className="text-zinc-500 text-[11px] truncate">Window W-28</span>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-dashed border-amber-500/30 font-medium">INFERRED</span>
                  <span className="font-mono text-[10px] text-zinc-500">ML Isolation</span>
                </div>
              </div>

              {/* Row 4 */}
              <div
                className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === "row-fnd-03" ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                id="row-fnd-03"
                onClick={() => selectRow("row-fnd-03")}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>
                  <span className="font-mono text-zinc-400">FND-2024-03</span>
                </div>
                <div className="col-span-4 flex flex-col min-w-0">
                  <span className="font-medium text-white truncate">Legacy AES-CBC + SHA-1 Suite</span>
                  <span className="text-zinc-400 text-[11px] truncate">Cryptography · Cipher Mode</span>
                </div>
                <div className="col-span-3 flex flex-col min-w-0 font-mono">
                  <span className="text-zinc-200 truncate">ESP &amp; IKE_SA Suite</span>
                  <span className="text-zinc-500 text-[11px] truncate">Frames #42, #58</span>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 font-medium">CONFIRMED</span>
                  <span className="font-mono text-[10px] text-zinc-500">Deterministic</span>
                </div>
              </div>

              {/* Row 5 */}
              <div
                className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === "row-fnd-05" ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                id="row-fnd-05"
                onClick={() => selectRow("row-fnd-05")}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">MEDIUM</span>
                  <span className="font-mono text-zinc-400">FND-2024-05</span>
                </div>
                <div className="col-span-4 flex flex-col min-w-0">
                  <span className="font-medium text-white truncate">PSK Auth with Weak ID Proofing</span>
                  <span className="text-zinc-400 text-[11px] truncate">Authentication · IKE_AUTH</span>
                </div>
                <div className="col-span-3 flex flex-col min-w-0 font-mono">
                  <span className="text-zinc-200 truncate">Control Plane</span>
                  <span className="text-zinc-500 text-[11px] truncate">Frames #58, #61</span>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 font-medium">CONFIRMED</span>
                  <span className="font-mono text-[10px] text-zinc-500">Deterministic</span>
                </div>
              </div>

              {/* Row 6 */}
              <div
                className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === "row-fnd-06" ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                id="row-fnd-06"
                onClick={() => selectRow("row-fnd-06")}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">MEDIUM</span>
                  <span className="font-mono text-zinc-400">FND-2024-06</span>
                </div>
                <div className="col-span-4 flex flex-col min-w-0">
                  <span className="font-medium text-white truncate">NAT-T Periodic Burst Fingerprint</span>
                  <span className="text-zinc-400 text-[11px] truncate">Network · Cadence Anomaly</span>
                </div>
                <div className="col-span-3 flex flex-col min-w-0 font-mono">
                  <span className="text-zinc-200 truncate">UDP:4500 NAT-T</span>
                  <span className="text-zinc-500 text-[11px] truncate">Frame #45</span>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 font-medium">CONFIRMED</span>
                  <span className="font-mono text-[10px] text-zinc-500">Heuristic</span>
                </div>
              </div>

              {/* Row 7 */}
              <div
                className={`px-4 py-3 grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${selectedRow === "row-fnd-07" ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"}`}
                id="row-fnd-07"
                onClick={() => selectRow("row-fnd-07")}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700/60">LOW</span>
                  <span className="font-mono text-zinc-500">FND-2024-07</span>
                </div>
                <div className="col-span-4 flex flex-col min-w-0">
                  <span className="font-medium text-white truncate">ESP Sequence Counter Jump (+4)</span>
                  <span className="text-zinc-400 text-[11px] truncate">Integrity · Replay Window</span>
                </div>
                <div className="col-span-3 flex flex-col min-w-0 font-mono">
                  <span className="text-zinc-200 truncate">SPI: 0x9a021da3</span>
                  <span className="text-zinc-500 text-[11px] truncate">Frames #890-#891</span>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 font-medium">CONFIRMED</span>
                  <span className="font-mono text-[10px] text-zinc-500">Dropped Burst</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/90 px-4 py-2.5 flex items-center justify-between text-zinc-400 font-mono text-xs border-t border-zinc-800">
              <span>7 findings evaluated · Deterministic engine OK</span>
              <div className="flex items-center gap-4">
                <span>Sort: <strong className="text-zinc-200">Severity (Desc)</strong></span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Forensic Inspector Drawer */}
          <div className={inspectorOpen ? "xl:col-span-5 bg-[#111317] rounded-lg border border-zinc-800/90 flex flex-col p-5 gap-4" : "xl:col-span-5 bg-[#111317] rounded-lg border border-zinc-800/90 flex flex-col p-5 gap-4 hidden"}>
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-mono text-[10px] font-bold">CRITICAL</span>
                  <span className="font-mono text-xs text-teal-400 font-bold">FND-2024-01</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20">CONFIRMED Protocol Fact</span>
                </div>
                <h2 className="text-lg font-semibold text-white tracking-tight mt-1">Weak Diffie-Hellman Group 2 (MODP-1024)</h2>
              </div>
              <button
                className="text-zinc-400 hover:text-white p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                title="Close details"
                type="button"
                onClick={() => setInspectorOpen(false)}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs bg-zinc-900/60 p-3 rounded border border-zinc-800/70">
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-500 uppercase text-[10px] block">Protocol Stage</span>
                <span className="text-zinc-200 font-medium">IKE_SA_INIT (Exchange 34)</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-500 uppercase text-[10px] block">Packet Reference</span>
                <span className="text-teal-400 font-medium">Frame #42 (T+0.114s)</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-500 uppercase text-[10px] block">Initiator SPI</span>
                <span className="text-zinc-300">0x8a91f3c401340b12</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-500 uppercase text-[10px] block">Selected Transform</span>
                <span className="text-rose-400 font-medium">Transform Type 4: ID 0x0002</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">Forensic Hex Dissector (Frame #42)</span>
                <span className="font-mono text-xs text-teal-400">Offset 0x0040 - 0x0050</span>
              </div>
              <div className="bg-[#0c0e11] p-3 rounded font-mono text-[11px] leading-relaxed text-zinc-300 select-text border border-zinc-800/80">
                <div className="text-zinc-500 pb-1 font-semibold flex justify-between border-b border-zinc-800/50 mb-1">
                  <span>INDEX  00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</span>
                  <span>ASCII</span>
                </div>
                <div className="flex justify-between hover:bg-zinc-800/40 px-1 rounded">
                  <span><span className="text-zinc-600">0040:</span>  03 00 00 0c 01 00 00 0c  <mark className="bg-teal-500/20 text-teal-300 font-bold px-0.5">00 00 00 08 04 00 00 02</mark></span>
                  <span className="text-zinc-600">........ .......</span>
                </div>
                <div className="flex justify-between hover:bg-zinc-800/40 px-1 rounded">
                  <span><span className="text-zinc-600">0050:</span>  00 00 00 08 02 00 00 02  00 00 00 08 03 00 00 02</span>
                  <span className="text-zinc-600">........ ........</span>
                </div>
                <div className="mt-2 text-teal-400 text-[10px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  <span>Byte [0x0048-0x004F] specifies Proposal Transform 4: DH Group 2 (MODP-1024)</span>
                </div>
              </div>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded flex flex-col gap-1">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                <span>NIST SP 800-77r1 &amp; RFC 8247 §2.4 Violation</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Group 2 yields &lt;80 bits of cryptographic strength. Modern Number Field Sieve (NFS) enables passive factoring of 1024-bit primes. Adversaries passively capturing traffic can deduce <span className="font-mono text-teal-400">SKEYSEED</span> and decrypt child ESP payloads retroactively.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">Remediation Stanza (strongSwan ipsec.conf)</span>
                <button
                  className="text-teal-400 hover:text-teal-300 font-mono text-xs flex items-center gap-1 transition-colors"
                  type="button"
                  onClick={() => { navigator.clipboard.writeText("ike = aes256gcm16-prfsha384-ecp256,aes256-sha256-modp2048!"); toast({ title: "Snippet copied", body: "Remediation stanza copied to clipboard.", kind: "ok" }); }}
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>Copy Snippet</span>
                </button>
              </div>
              <div className="bg-[#0c0e11] p-3 rounded font-mono text-xs text-teal-300 select-text leading-relaxed border border-zinc-800/80">
                <span className="text-zinc-600"># Enforce Group 14 or Group 19 (Curve25519)</span><br />
                <span className="text-zinc-400">conn enterprise-production-edge</span><br />
                &nbsp;&nbsp;ike = aes256gcm16-prfsha384-ecp256,aes256-sha256-modp2048!<br />
                &nbsp;&nbsp;esp = aes256gcm16-ecp256!<br />
                <span className="text-zinc-600"># Forbids fallback to DH Group 2</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-1">
              <button
                className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2 shadow-md"
                type="button"
                onClick={() => toast({ title: "Policy patch staged", body: "Mock apply: strongSwan proposal update queued.", kind: "ok" })}
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Apply Policy Patch</span>
              </button>
              <button
                className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded transition-colors"
                title="Export Forensic Bundle"
                type="button"
                onClick={() => { downloadFile("forensic-bundle.json", executiveReportJSON()); toast({ title: "Forensic bundle exported", body: "forensic-bundle.json downloaded.", kind: "ok" }); }}
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
              <button
                className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 rounded transition-colors"
                title="Ignore / Mark False Positive"
                type="button"
                onClick={() => toast({ title: "Finding flagged", body: "Marked for review (mock).", kind: "warn" })}
              >
                <span className="material-symbols-outlined text-[16px]">flag</span>
              </button>
            </div>
          </div>
        </section>
      </AppShell>
    </div>
  );
}
