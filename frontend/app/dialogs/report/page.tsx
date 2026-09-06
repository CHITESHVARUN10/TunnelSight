"use client";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";

export default function ReportDialogsPage() {
  const [reportOpen, setReportOpen] = useState(true);
  const [evidenceOpen, setEvidenceOpen] = useState(true);
  const toast = useToast();
  const closeReport = () => {
    setReportOpen(false);
    toast({ title: "Dialog dismissed", body: "Report generation dialog closed (mock).", kind: "info" });
  };
  const generateReport = () => {
    downloadFile("tunnelsight-executive-report.json", executiveReportJSON(), "application/json");
    toast({ title: "Report generated", body: "tunnelsight-executive-report.json downloaded.", kind: "ok" });
    setReportOpen(false);
  };
  const closeEvidence = () => {
    setEvidenceOpen(false);
    toast({ title: "Dialog dismissed", body: "Evidence dialog closed (mock).", kind: "info" });
  };
  const viewEvidence = () => toast({ title: "Related evidence", body: "Evidence trace linked (mock).", kind: "info" });
  return (
    <div className="min-h-screen bg-[#0c0e11] font-sans antialiased text-slate-300 p-6 md:p-10 flex flex-col justify-start items-center">


  {/* Background App Mock Canvas (Contextual backdrop) */}
  <div className="fixed inset-0 pointer-events-none opacity-20 filter blur-[1px] select-none" aria-hidden="true">
    <div className="h-14 border-b border-surface-border bg-surface-panel flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-teal"></div>
        <span className="font-mono text-xs text-slate-400">TunnelSight / Forensic Engine v4.18</span>
      </div>
      <div className="font-mono text-xs text-slate-500">CAPTURE: weak-vpn-07.pcap (4.82 GB)</div>
    </div>
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="h-32 rounded-lg bg-surface-container border border-surface-border"></div>
      <div className="grid grid-cols-3 gap-6">
        <div className="h-64 rounded-lg bg-surface-container border border-surface-border"></div>
        <div className="h-64 rounded-lg bg-surface-container border border-surface-border"></div>
        <div className="h-64 rounded-lg bg-surface-container border border-surface-border"></div>
      </div>
    </div>
  </div>

  {/* Main Showcase Container */}
  <div className="relative z-10 w-full max-w-5xl flex flex-col gap-10 my-auto">

    {/* Top Badge / Indicator */}
    <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-brand-teal/10 text-brand-teal border border-brand-teal/20">SIH26160 MODAL SUITE</span>
          <h1 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">Modal & Diagnostic Dialog Components</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">High-fidelity, compact security dialogs engineered for TunnelSight IPsec Observability.</p>
      </div>
      <div className="text-right font-mono text-[11px] text-slate-500 hidden sm:block">
        AUTHENTICATED SESSION: <span className="text-slate-300">analyst@tunnelsight.sec</span>
      </div>
    </div>

    {/* Modals Display Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {(!reportOpen || !evidenceOpen) && (
        <div className="lg:col-span-2 flex flex-wrap items-center gap-2.5 px-1">
          <span className="text-xs font-mono text-slate-500">Dismissed dialogs:</span>
          {!reportOpen && (
            <button className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1e222b] rounded-md border border-[#262a33] transition-colors" type="button" onClick={() => setReportOpen(true)}>
              Restore Report dialog
            </button>
          )}
          {!evidenceOpen && (
            <button className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1e222b] rounded-md border border-[#262a33] transition-colors" type="button" onClick={() => setEvidenceOpen(true)}>
              Restore Evidence dialog
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: REPORT GENERATION DIALOG */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
            Report Generation Dialog
          </span>
          <span className="text-[11px] font-mono text-slate-500">ESC to close</span>
        </div>

        {/* The Modal Card */}
        <div className={reportOpen ? "w-full bg-[#111317] border border-[#262a33] rounded-xl shadow-2xl shadow-black/80 overflow-hidden transition-all" : "hidden w-full bg-[#111317] border border-[#262a33] rounded-xl shadow-2xl shadow-black/80 overflow-hidden transition-all"}>
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#1c2027] flex items-center justify-between bg-[#14171d]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1a1e27] border border-[#262a33] flex items-center justify-center text-brand-teal">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-100 tracking-tight">Generate Security Report</h2>
                <p className="text-[11px] font-mono text-slate-400">Target trace: <span className="text-slate-300">branch-emea-gw04.pcap</span></p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-[#1f242d] transition-colors" title="Close dialog" onClick={closeReport}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-5">

            {/* Report Format Selector (Conservative & Uncluttered) */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-medium">Report Profile</label>
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* Executive Report Radio Option */}
                <label className="relative flex flex-col p-3 rounded-lg border border-[#2a2f3b] bg-[#161920] hover:bg-[#1a1e27] cursor-pointer transition group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">Executive Report</span>
                    <input type="radio" name="report_type" value="executive" defaultChecked className="w-3.5 h-3.5 text-brand-teal accent-[#00a896] bg-[#0c0e11] border-[#333844] focus:ring-0" />
                  </div>
                  <span className="text-[11px] text-slate-400 leading-snug">High-level threat scoring, RFC non-conformance, and audit summary.</span>
                </label>

                {/* Technical Report Radio Option */}
                <label className="relative flex flex-col p-3 rounded-lg border border-[#20242e] bg-[#14161d] hover:bg-[#1a1e27] cursor-pointer transition group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white">Technical Report</span>
                    <input type="radio" name="report_type" value="technical" className="w-3.5 h-3.5 text-brand-teal accent-[#00a896] bg-[#0c0e11] border-[#333844] focus:ring-0" />
                  </div>
                  <span className="text-[11px] text-slate-500 leading-snug">Full cryptographic handshake parameters, SA lifetimes & SPI mappings.</span>
                </label>

              </div>
            </div>

            {/* Optional Toggles */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">Optional Forensic Sections</span>
                <span className="text-[10px] font-mono text-slate-500">Conservative defaults applied</span>
              </div>

              <div className="divide-y divide-[#1c2027] border border-[#20242e] rounded-lg bg-[#14171d]/80 overflow-hidden">
                
                {/* Toggle 1: Traffic Intelligence */}
                <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-[#181b22] transition-colors">
                  <div className="pr-3">
                    <div className="text-xs font-medium text-slate-200">Include Traffic Intelligence</div>
                    <div className="text-[11px] text-slate-400">Classification breakdown of encrypted flows by behavioral fingerprint</div>
                  </div>
                  <label className="custom-switch flex-shrink-0">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* Toggle 2: Anomaly Analysis */}
                <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-[#181b22] transition-colors">
                  <div className="pr-3">
                    <div className="text-xs font-medium text-slate-200">Include Anomaly Analysis</div>
                    <div className="text-[11px] text-slate-400">Deviation scores, packet burst telemetry, and sequence anomalies</div>
                  </div>
                  <label className="custom-switch flex-shrink-0">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* Toggle 3: Detailed Evidence */}
                <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-[#181b22] transition-colors">
                  <div className="pr-3">
                    <div className="text-xs font-medium text-slate-200">Include Detailed Evidence</div>
                    <div className="text-[11px] text-slate-400">Frame indices, raw hex offsets of transform payloads, and RFC citations</div>
                  </div>
                  <label className="custom-switch flex-shrink-0">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>

              </div>
            </div>

            {/* Output Format & Notice */}
            <div className="flex items-center justify-between px-3 py-2 rounded bg-[#0c0e11] border border-[#1e222b] text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">FORMAT:</span>
                <span className="text-slate-300 font-semibold">PDF + Structured JSON</span>
              </div>
              <div className="text-slate-500">EST. SIZE: <span className="text-slate-300 font-mono">1.2 MB</span></div>
            </div>

          </div>

          {/* Actions Footer */}
          <div className="px-5 py-3.5 bg-[#14171d] border-t border-[#1c2027] flex items-center justify-end gap-2.5">
            <button className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1e222b] rounded-md border border-[#262a33] transition-colors" onClick={closeReport}>
              Cancel
            </button>
            <button className="px-4 py-1.5 text-xs font-medium text-black bg-[#00a896] hover:bg-[#028e7f] rounded-md font-sans flex items-center gap-1.5 font-semibold transition-colors shadow-sm" onClick={generateReport}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Generate Report
            </button>
          </div>

        </div>
      </div>


      {/* ========================================================================= */}
      {/* MODAL 2: UNKNOWN / INSUFFICIENT EVIDENCE DIALOG */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Insufficient Evidence Dialog (Transparency Pattern)
          </span>
          <span className="text-[11px] font-mono text-slate-500">Reusable Component</span>
        </div>

        {/* The Modal Card */}
        <div className={evidenceOpen ? "w-full bg-[#111317] border border-[#262a33] rounded-xl shadow-2xl shadow-black/80 overflow-hidden transition-all" : "hidden w-full bg-[#111317] border border-[#262a33] rounded-xl shadow-2xl shadow-black/80 overflow-hidden transition-all"}>
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#1c2027] flex items-center justify-between bg-[#14171d]">
            <div className="flex items-center gap-2.5">
              {/* Neutral Forensic Inspection Icon (Communicates integrity, not error) */}
              <div className="w-7 h-7 rounded-md bg-[#181d26] border border-[#2a303d] flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-200 tracking-tight">Parameter Unavailable</h2>
                <p className="text-[11px] font-mono text-slate-400">Forensic Integrity & Verification Check</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-[#1f242d] transition-colors" title="Close dialog" onClick={closeEvidence}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4">

            {/* Parameter Status Badge Card */}
            <div className="p-3.5 rounded-lg bg-[#14171e] border border-[#222733] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Target Forensic Metric</span>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">Perfect Forward Secrecy (PFS)</div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#1c212b] text-slate-300 border border-[#2e3544]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  PFS Status: UNKNOWN
                </span>
              </div>
            </div>

            {/* Technical Reason Panel */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">Diagnostic Explanation</label>
              <div className="p-3.5 rounded-lg bg-[#0c0e11] border border-[#1e222b] text-xs text-slate-300 leading-relaxed font-sans">
                The supplied capture does not contain sufficient key-exchange information to establish PFS configuration.
                <div className="mt-2.5 pt-2.5 border-t border-[#1a1e27] font-mono text-[11px] text-slate-400 flex items-center justify-between">
                  <span>MISSING ARTIFACT:</span>
                  <span className="text-amber-400/90 font-medium">IKE_AUTH or CREATE_CHILD_SA Exchange</span>
                </div>
              </div>
            </div>

            {/* Strict Forensic Boundary Statement */}
            <div className="p-3 rounded-md bg-[#13161d] border-l-2 border-brand-teal/80 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <p className="text-[11px] text-slate-300 font-sans leading-normal">
                <strong className="font-medium text-slate-200">Analyzer Transparency Guarantee:</strong> The analyzer will not infer this value without sufficient evidence. Forensic standards prevent speculative deductions.
              </p>
            </div>

            {/* Observed Packets Context summary */}
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-[#13161c] border border-[#1f232c]">
                <div className="text-slate-500 text-[10px]">CAPTURED FRAMES</div>
                <div className="text-slate-300 font-semibold mt-0.5">14,892 pkts</div>
              </div>
              <div className="p-2 rounded bg-[#13161c] border border-[#1f232c]">
                <div className="text-slate-500 text-[10px]">HANDSHAKE FRAMES</div>
                <div className="text-slate-300 font-semibold mt-0.5">2 (IKE_SA_INIT)</div>
              </div>
              <div className="p-2 rounded bg-[#13161c] border border-[#1f232c]">
                <div className="text-slate-500 text-[10px]">REKEY EXCHANGES</div>
                <div className="text-slate-300 font-semibold mt-0.5">0 observed</div>
              </div>
            </div>

          </div>

          {/* Actions Footer */}
          <div className="px-5 py-3.5 bg-[#14171d] border-t border-[#1c2027] flex items-center justify-between">
            <div className="text-[11px] font-mono text-slate-500">
              TRACE ID: <span className="text-slate-400">#TR-09241</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1e222b] rounded-md border border-[#262a33] transition-colors" onClick={closeEvidence}>
                Close
              </button>
              <button className="px-3.5 py-1.5 text-xs font-medium text-slate-100 bg-[#1e2430] hover:bg-[#252c3b] hover:text-white rounded-md border border-[#2d3647] font-sans flex items-center gap-1.5 transition-colors" onClick={viewEvidence}>
                <svg className="w-3.5 h-3.5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path>
                </svg>
                View Related Evidence
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>

    {/* Forensic Principles Callout Footer */}
    <div className="border border-surface-border/70 rounded-lg p-4 bg-surface-panel/60 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
        <span><strong>UX Architectural Note:</strong> Dialogs utilize progressive disclosure, restrained palette tokens, and monospaced diagnostic telemetry rather than consumer modal cards.</span>
      </div>
      <div className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
        DESIGN SYSTEM: <span className="text-slate-300">TunnelSight Engine</span>
      </div>
    </div>

  </div>


    </div>
  );
}
