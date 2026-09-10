"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";

export default function ReportDialogsPage() {
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(true);
  const [evidenceOpen, setEvidenceOpen] = useState(true);
  const [reportType, setReportType] = useState<"executive" | "technical">("executive");
  const [includeTraffic, setIncludeTraffic] = useState(true);
  const [includeAnomalies, setIncludeAnomalies] = useState(true);
  const [includeEvidence, setIncludeEvidence] = useState(false);
  const toast = useToast();

  const dismiss = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/analysis/reports");
    }
  };

  const closeReport = () => {
    setReportOpen(false);
    toast({ title: "Dialog dismissed", body: "Report generation dialog closed.", kind: "info" });
    if (!evidenceOpen) setTimeout(dismiss, 300);
  };

  const generateReport = () => {
    downloadFile(
      "tunnelsight-executive-report.json",
      JSON.stringify({ report_type: reportType, sections: { traffic: includeTraffic, anomalies: includeAnomalies, evidence: includeEvidence }, generated: new Date().toISOString() }, null, 2),
      "application/json"
    );
    toast({ title: "Report generated", body: "tunnelsight-executive-report.json downloaded.", kind: "ok" });
    setReportOpen(false);
    setTimeout(dismiss, 600);
  };

  const closeEvidence = () => {
    setEvidenceOpen(false);
    toast({ title: "Dialog dismissed", body: "Evidence dialog closed.", kind: "info" });
    if (!reportOpen) setTimeout(dismiss, 300);
  };

  const viewEvidence = () => toast({ title: "Related evidence", body: "Evidence trace linked to IKE_AUTH timeline.", kind: "info" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0e11] font-sans antialiased text-zinc-200 p-6 md:p-10 flex flex-col justify-start items-center relative selection:bg-teal-500/20 selection:text-teal-200">
      {/* Background App Mock Canvas */}
      <div className="fixed inset-0 pointer-events-none opacity-20 filter blur-[2px] select-none" aria-hidden="true">
        <div className="h-14 border-b border-zinc-800/80 bg-[#111317] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-teal-400"></div>
            <span className="font-mono text-xs text-zinc-400">TunnelSight / Forensic Engine v4.18</span>
          </div>
          <div className="font-mono text-xs text-zinc-500">CAPTURE: report-preview.pcap</div>
        </div>
        <div className="p-8 max-w-6xl mx-auto space-y-6">
          <div className="h-32 rounded-sm bg-[#111317] border border-zinc-800/80"></div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-64 rounded-sm bg-[#111317] border border-zinc-800/80"></div>
            <div className="h-64 rounded-sm bg-[#111317] border border-zinc-800/80"></div>
            <div className="h-64 rounded-sm bg-[#111317] border border-zinc-800/80"></div>
          </div>
        </div>
      </div>

      {/* Main Showcase Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8 my-auto">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/analysis/reports" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Reports</span>
              </Link>
              <span className="text-zinc-700 font-mono">|</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-mono font-medium bg-teal-950/40 text-teal-400 border border-teal-800/40">
                FORENSIC DIALOG SUITE
              </span>
              <h1 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">Report &amp; Evidence Modals</h1>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">High-fidelity audit dialogs engineered for TunnelSight IPsec Observability.</p>
          </div>
          <div className="text-right font-mono text-[11px] text-zinc-500 hidden sm:block">
            AUTHENTICATED SESSION: <span className="text-zinc-300">analyst@tunnelsight.sec</span>
          </div>
        </div>

        {/* Restore Buttons if Dialogs Dismissed */}
        {(!reportOpen || !evidenceOpen) && (
          <div className="flex flex-wrap items-center gap-2.5 px-1 bg-[#111317] border border-zinc-800/80 rounded-sm p-3">
            <span className="text-xs font-mono text-zinc-500">Dismissed dialogs:</span>
            {!reportOpen && (
              <button
                className="px-3 py-1 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-sm border border-zinc-700 transition-colors"
                type="button"
                onClick={() => setReportOpen(true)}
              >
                Restore Report Dialog
              </button>
            )}
            {!evidenceOpen && (
              <button
                className="px-3 py-1 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-sm border border-zinc-700 transition-colors"
                type="button"
                onClick={() => setEvidenceOpen(true)}
              >
                Restore Evidence Dialog
              </button>
            )}
          </div>
        )}

        {/* Modals Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ========================================================================= */}
          {/* MODAL 1: REPORT GENERATION DIALOG */}
          {/* ========================================================================= */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Report Generation Dialog
              </span>
              <span className="text-[11px] font-mono text-zinc-500">ESC to close</span>
            </div>

            {/* The Modal Card */}
            <div className={reportOpen ? "w-full bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all" : "hidden w-full bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all"}>
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#14171c]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-teal-950/30 border border-teal-800/40 flex items-center justify-center text-teal-400">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <div>
                    <h2 className="text-base font-display-serif font-semibold text-white tracking-tight">Generate Security Report</h2>
                    <p className="text-[11px] font-mono text-zinc-400">Target trace: <span className="text-zinc-200">branch-emea-gw04.pcap</span></p>
                  </div>
                </div>
                <button
                  className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-sm hover:bg-zinc-800 transition-colors"
                  title="Close dialog"
                  onClick={closeReport}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-5 bg-[#0c0e11]/60">
                {/* Report Format Selector */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2 font-medium">Report Profile</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Executive Report Radio Option */}
                    <button
                      type="button"
                      onClick={() => setReportType("executive")}
                      className={`text-left p-3 rounded-sm border cursor-pointer transition-all ${
                        reportType === "executive"
                          ? "border-teal-500/50 bg-[#14171c]"
                          : "border-zinc-800 bg-[#111317] hover:bg-[#14171c]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white">Executive Report</span>
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${reportType === "executive" ? "border-teal-400 bg-teal-500/20" : "border-zinc-700"}`}>
                          {reportType === "executive" && <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono leading-snug">High-level threat scoring, RFC non-conformance, and audit summary.</span>
                    </button>

                    {/* Technical Report Radio Option */}
                    <button
                      type="button"
                      onClick={() => setReportType("technical")}
                      className={`text-left p-3 rounded-sm border cursor-pointer transition-all ${
                        reportType === "technical"
                          ? "border-teal-500/50 bg-[#14171c]"
                          : "border-zinc-800 bg-[#111317] hover:bg-[#14171c]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white">Technical Report</span>
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${reportType === "technical" ? "border-teal-400 bg-teal-500/20" : "border-zinc-700"}`}>
                          {reportType === "technical" && <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono leading-snug">Full cryptographic handshake parameters, SA lifetimes &amp; SPI mappings.</span>
                    </button>
                  </div>
                </div>

                {/* Optional Forensic Sections */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium">Optional Forensic Sections</span>
                    <span className="text-[10px] font-mono text-zinc-600">Conservative defaults applied</span>
                  </div>

                  <div className="divide-y divide-zinc-800/80 border border-zinc-800/80 rounded-sm bg-[#14171c] overflow-hidden">
                    {/* Toggle 1: Traffic Intelligence */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-800/40 transition-colors">
                      <div className="pr-3">
                        <div className="text-xs font-medium text-white">Include Traffic Intelligence</div>
                        <div className="text-[11px] text-zinc-400 font-mono">Classification breakdown of encrypted flows by behavioral fingerprint</div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={includeTraffic}
                        onClick={() => setIncludeTraffic(!includeTraffic)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 border ${includeTraffic ? "bg-teal-500 border-teal-400" : "bg-zinc-800 border-zinc-700"}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${includeTraffic ? "translate-x-4" : "translate-x-0"}`}></div>
                      </button>
                    </div>

                    {/* Toggle 2: Anomaly Analysis */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-800/40 transition-colors">
                      <div className="pr-3">
                        <div className="text-xs font-medium text-white">Include Anomaly Analysis</div>
                        <div className="text-[11px] text-zinc-400 font-mono">Deviation scores, packet burst telemetry, and sequence anomalies</div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={includeAnomalies}
                        onClick={() => setIncludeAnomalies(!includeAnomalies)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 border ${includeAnomalies ? "bg-teal-500 border-teal-400" : "bg-zinc-800 border-zinc-700"}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${includeAnomalies ? "translate-x-4" : "translate-x-0"}`}></div>
                      </button>
                    </div>

                    {/* Toggle 3: Detailed Evidence */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-800/40 transition-colors">
                      <div className="pr-3">
                        <div className="text-xs font-medium text-white">Include Detailed Evidence</div>
                        <div className="text-[11px] text-zinc-400 font-mono">Frame indices, raw hex offsets of transform payloads, and RFC citations</div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={includeEvidence}
                        onClick={() => setIncludeEvidence(!includeEvidence)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 border ${includeEvidence ? "bg-teal-500 border-teal-400" : "bg-zinc-800 border-zinc-700"}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${includeEvidence ? "translate-x-4" : "translate-x-0"}`}></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Output Format & Notice */}
                <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-[#111317] border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">FORMAT:</span>
                    <span className="text-zinc-200 font-semibold">PDF + Structured JSON</span>
                  </div>
                  <div className="text-zinc-500">EST. SIZE: <span className="text-zinc-200 font-mono">1.2 MB</span></div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
                <button
                  className="px-3.5 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-sm border border-zinc-800 transition-colors"
                  onClick={closeReport}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1.5 text-xs font-mono font-semibold text-black bg-teal-500 hover:bg-teal-400 rounded-sm flex items-center gap-1.5 transition-colors shadow-sm"
                  onClick={generateReport}
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MODAL 2: UNKNOWN / INSUFFICIENT EVIDENCE DIALOG */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                Insufficient Evidence Dialog (Transparency Pattern)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Forensic Check</span>
            </div>

            {/* The Modal Card */}
            <div className={evidenceOpen ? "w-full bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all" : "hidden w-full bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all"}>
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#14171c]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-zinc-800/60 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <span className="material-symbols-outlined text-[18px]">help</span>
                  </div>
                  <div>
                    <h2 className="text-base font-display-serif font-semibold text-white tracking-tight">Parameter Unavailable</h2>
                    <p className="text-[11px] font-mono text-zinc-400">Forensic Integrity &amp; Verification Check</p>
                  </div>
                </div>
                <button
                  className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-sm hover:bg-zinc-800 transition-colors"
                  title="Close dialog"
                  onClick={closeEvidence}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-4 bg-[#0c0e11]/60">
                {/* Parameter Status Badge Card */}
                <div className="p-3.5 rounded-sm bg-[#14171c] border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Target Forensic Metric</span>
                    <div className="text-xs font-semibold text-white mt-0.5">Perfect Forward Secrecy (PFS)</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-mono font-medium bg-[#111317] text-zinc-300 border border-zinc-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                      PFS: UNKNOWN
                    </span>
                  </div>
                </div>

                {/* Technical Reason Panel */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium">Diagnostic Explanation</label>
                  <div className="p-3.5 rounded-sm bg-[#111317] border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed font-mono">
                    The supplied capture does not contain sufficient key-exchange information to establish PFS configuration.
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                      <span className="text-zinc-500">MISSING ARTIFACT:</span>
                      <span className="text-amber-400 font-medium">IKE_AUTH or CREATE_CHILD_SA Exchange</span>
                    </div>
                  </div>
                </div>

                {/* Strict Forensic Boundary Statement */}
                <div className="p-3 rounded-sm bg-teal-950/20 border-l-2 border-teal-400 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-teal-400 text-[18px] shrink-0 mt-0.5">shield</span>
                  <p className="text-[11px] text-zinc-300 font-mono leading-relaxed">
                    <strong className="font-medium text-white">Analyzer Transparency Guarantee:</strong> The analyzer will not infer this value without verifiable cryptographic evidence. Speculative deduction is prohibited by RFC 7296 compliance testing.
                  </p>
                </div>

                {/* Observed Packets Context summary */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-sm bg-[#14171c] border border-zinc-800/80">
                    <div className="text-zinc-500 text-[10px]">CAPTURED FRAMES</div>
                    <div className="text-zinc-200 font-semibold mt-0.5">14,892 pkts</div>
                  </div>
                  <div className="p-2 rounded-sm bg-[#14171c] border border-zinc-800/80">
                    <div className="text-zinc-500 text-[10px]">HANDSHAKE FRAMES</div>
                    <div className="text-zinc-200 font-semibold mt-0.5">2 (IKE_SA_INIT)</div>
                  </div>
                  <div className="p-2 rounded-sm bg-[#14171c] border border-zinc-800/80">
                    <div className="text-zinc-500 text-[10px]">REKEY EXCHANGES</div>
                    <div className="text-zinc-200 font-semibold mt-0.5">0 observed</div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-between">
                <div className="text-[11px] font-mono text-zinc-500">
                  TRACE ID: <span className="text-zinc-300">#TR-09241</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3.5 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-sm border border-zinc-800 transition-colors"
                    onClick={closeEvidence}
                  >
                    Close
                  </button>
                  <button
                    className="px-3.5 py-1.5 text-xs font-mono text-zinc-200 bg-[#14171c] hover:bg-zinc-800 hover:text-white rounded-sm border border-zinc-700 flex items-center gap-1.5 transition-colors"
                    onClick={viewEvidence}
                  >
                    <span className="material-symbols-outlined text-teal-400 text-[16px]">manage_search</span>
                    View Related Evidence
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forensic Principles Callout Footer */}
        <div className="border border-zinc-800/80 rounded-sm p-4 bg-[#111317] text-xs text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span><strong>UX Architectural Note:</strong> Dialogs utilize progressive disclosure, restrained obsidian tokens, and monospaced diagnostic telemetry rather than consumer modal cards.</span>
          </div>
          <div className="text-[11px] text-zinc-500 whitespace-nowrap">
            DESIGN SYSTEM: <span className="text-zinc-300">TunnelSight Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
