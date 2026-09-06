"use client";
import { useEffect, useRef, useState } from "react";

export default function ArchiveDeleteDialogsPage() {
  const [dialog, setDialog] = useState<"archive" | "delete" | "sidebyside">("archive");
  const [toast, setToast] = useState({ visible: false, msg: "Operation simulated", variant: "teal" as "teal" | "red" | "gray" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string, variant: "teal" | "red" | "gray", ms: number) => {
    setToast({ visible: true, msg, variant });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), ms);
  };
  const simulateAction = (type: string) => {
    if (type === "archive-success") {
      showToast("Capture branch-emea-gw04.pcap moved to Historical Archive.", "teal", 3200);
    } else {
      showToast("Capture branch-emea-gw04.pcap and all telemetry purged.", "red", 3200);
    }
  };
  const simulateCancel = (msg: string) => showToast(msg, "gray", 2000);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") simulateCancel("Dialog dismissed (Esc)");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="min-h-screen bg-surface-base text-gray-200 font-sans flex flex-col technical-grid select-none relative overflow-x-hidden">


  {/* Underlying Authenticated Application Canvas Preview (TunnelSight Analysis History in backdrop) */}
  <div className="pointer-events-none filter blur-[3px] opacity-25 fixed inset-0 flex flex-col z-0">
    {/* Top Nav Bar Mock */}
    <header className="h-14 border-b border-surface-border bg-surface-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-brand-teal flex items-center justify-center font-mono text-black font-bold text-xs">&gt;_</div>
        <span className="font-mono text-sm tracking-wider font-semibold text-white">TUNNELSIGHT</span>
        <span className="text-xs text-gray-500 font-mono">/ IPsecXray</span>
      </div>
      <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
        <span>ENGINE ONLINE</span>
        <span>•</span>
        <span>DPDK RX: READY</span>
      </div>
    </header>

    {/* Subdued Background Ledger View */}
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-mono font-semibold text-white">Analysis History</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">Review previous captures, posture scores, and active SAs</p>
        </div>
      </div>
      <div className="border border-surface-border rounded-lg bg-surface-card overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border font-mono text-xs text-gray-400 grid grid-cols-6">
          <span>STATUS</span>
          <span>CAPTURE</span>
          <span>PROTOCOL</span>
          <span>MODE</span>
          <span>POSTURE</span>
          <span>ACTION</span>
        </div>
        <div className="divide-y divide-surface-border font-mono text-xs text-gray-300">
          <div className="px-5 py-4 grid grid-cols-6 items-center bg-surface-high/40">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> HIGH</span>
            <span className="text-white font-medium">branch-emea-gw04.pcap</span>
            <span>IKEv2</span>
            <span>Tunnel</span>
            <span className="text-amber-400">61 / 100</span>
            <span className="text-gray-500">Selected</span>
          </div>
          <div className="px-5 py-4 grid grid-cols-6 items-center">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> LOW</span>
            <span>site2site-prod.pcapng</span>
            <span>IKEv2</span>
            <span>Tunnel</span>
            <span className="text-emerald-400">94 / 100</span>
            <span>...</span>
          </div>
        </div>
      </div>
    </main>
  </div>

  {/* Interactive Controls Bar for Design & Evaluation */}
  <div className="relative z-40 bg-surface-card/90 backdrop-blur-md border-b border-surface-border px-6 py-2.5 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse"></span>
        <span className="text-xs font-mono font-semibold text-gray-300 uppercase tracking-wider">Interactive Dialog Component Suite</span>
      </div>
      <span className="text-xs text-gray-500 font-mono">|</span>
      <span className="text-xs text-gray-400 font-mono">Target: <code className="text-gray-200 bg-surface-high px-1.5 py-0.5 rounded border border-surface-border">branch-emea-gw04.pcap</code></span>
    </div>

    {/* Mode Switcher Tabs */}
    <div className="flex items-center gap-2 bg-surface-base p-1 rounded-md border border-surface-border text-xs font-mono">
      <button id="btn-show-archive" className={dialog === "archive" ? "px-3 py-1 rounded transition-colors bg-surface-high text-white font-medium shadow-sm flex items-center gap-1.5" : "px-3 py-1 rounded transition-colors text-gray-400 hover:text-gray-200 flex items-center gap-1.5"} onClick={() => setDialog("archive")}>
        <svg className="w-3.5 h-3.5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"  />
        </svg>
        Archive Dialog
      </button>
      <button id="btn-show-delete" className={dialog === "delete" ? "px-3 py-1 rounded transition-colors bg-surface-high text-white font-medium shadow-sm flex items-center gap-1.5" : "px-3 py-1 rounded transition-colors text-gray-400 hover:text-gray-200 flex items-center gap-1.5"} onClick={() => setDialog("delete")}>
        <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"  />
        </svg>
        Permanent Delete Dialog
      </button>
      <button id="btn-show-sidebyside" className={dialog === "sidebyside" ? "px-3 py-1 rounded transition-colors bg-surface-high text-white font-medium shadow-sm flex items-center gap-1.5" : "px-3 py-1 rounded transition-colors text-gray-400 hover:text-gray-200 flex items-center gap-1.5"} onClick={() => setDialog("sidebyside")}>
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"  />
        </svg>
        Side-by-Side Comparison
      </button>
    </div>
  </div>

  {/* Primary Modal Backdrop Container */}
  <div className="relative z-30 flex-1 flex items-center justify-center p-6 modal-backdrop">

    {/* ========================================================================= */}
    {/* DIALOG A: ARCHIVE CONFIRMATION DIALOG (Standard Focus View)                */}
    {/* ========================================================================= */}
    <div id="modal-archive" className={dialog === "archive" ? "w-full max-w-md bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden transition-all transform duration-200" : "hidden w-full max-w-md bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden transition-all transform duration-200"}>
      
      {/* Modal Header with Semantic Icon Badge */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-surface-border/50">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center shrink-0 text-brand-teal mt-0.5 shadow-inner">
            {/* Technical Archive / Drawer Icon */}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"  />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">Archive capture?</h2>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-brand-teal-subtle text-brand-teal border border-brand-teal/20 font-medium">REVERSIBLE</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              This capture will be removed from active analysis views while its forensic record is preserved.
            </p>
          </div>
        </div>

        {/* Close Escape Button */}
        <button className="text-gray-500 hover:text-gray-300 p-1 rounded-md hover:bg-surface-high transition-colors" title="Close (Esc)" onClick={() => simulateCancel('Archive cancelled')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"  />
          </svg>
        </button>
      </div>

      {/* Target Capture Context Card (Compact & High Precision) */}
      <div className="px-6 py-4 bg-surface-base/50">
        <div className="p-3.5 rounded-lg bg-surface-container border border-surface-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-surface-high flex items-center justify-center text-gray-400 font-mono text-xs shrink-0 border border-surface-border">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"  />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-white truncate tracking-tight">branch-emea-gw04.pcap</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-surface-high text-gray-300 border border-surface-border">PCAP</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400 flex items-center gap-2 mt-0.5">
                <span>Score: <span className="text-amber-400 font-medium">61/100</span></span>
                <span>•</span>
                <span>IKEv2 / Tunnel</span>
                <span>•</span>
                <span>1.48 GB</span>
              </div>
            </div>
          </div>
          
          <span className="px-2 py-1 text-[10px] font-mono rounded bg-surface-high text-gray-400 border border-surface-border shrink-0">
            ACTIVE
          </span>
        </div>

        {/* Archival Policy Note */}
        <div className="mt-3 flex items-start gap-2 text-[11px] font-mono text-gray-500">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"  />
          </svg>
          <span>Retained in Historical Vault for 365 days. Searchable via Archive filter.</span>
        </div>
      </div>

      {/* Action Footer (Explicit Hierarchy) */}
      <div className="px-6 py-4 bg-surface-card border-t border-surface-border flex items-center justify-between">
        <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] bg-surface-high border border-surface-border rounded text-gray-400">Esc</kbd> cancel
        </span>
        <div className="flex items-center gap-3">
          <button type="button" className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-surface-elevated border border-surface-border transition-colors" onClick={() => simulateCancel('Archive cancelled')}>
            Cancel
          </button>
          <button type="button" className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-teal hover:bg-brand-teal-hover text-surface-base flex items-center gap-1.5 shadow-sm transition-all" onClick={() => simulateAction('archive-success')}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"  />
            </svg>
            Archive Capture
          </button>
        </div>
      </div>
    </div>


    {/* ========================================================================= */}
    {/* DIALOG B: PERMANENT DELETE CONFIRMATION DIALOG (Semantic Warning View)     */}
    {/* ========================================================================= */}
    <div id="modal-delete" className={dialog === "delete" ? "w-full max-w-md bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden transition-all transform duration-200" : "hidden w-full max-w-md bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden transition-all transform duration-200"}>
      
      {/* Modal Header with Red Semantic Warning Indicator */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-surface-border/50">
        <div className="flex items-start gap-3.5">
          {/* Controlled Semantic Red Warning Badge (Restrained, not glaring) */}
          <div className="w-10 h-10 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 mt-0.5 shadow-inner">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"  />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">Delete capture permanently?</h2>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-red-950/60 text-red-400 border border-red-500/30 font-medium">IRREVERSIBLE</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              This action permanently removes the capture and its associated analysis record.
            </p>
          </div>
        </div>

        {/* Close Escape Button */}
        <button className="text-gray-500 hover:text-gray-300 p-1 rounded-md hover:bg-surface-high transition-colors" title="Close (Esc)" onClick={() => simulateCancel('Deletion cancelled')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"  />
          </svg>
        </button>
      </div>

      {/* Target Capture Context with Impact Warning */}
      <div className="px-6 py-4 bg-surface-base/50 space-y-3">
        <div className="p-3.5 rounded-lg bg-surface-container border border-surface-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-xs shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"  />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-white truncate tracking-tight">branch-emea-gw04.pcap</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-surface-high text-gray-300 border border-surface-border">PCAP</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400 flex items-center gap-2 mt-0.5">
                <span>SHA-256: <span className="text-gray-300">d41d8cd9...</span></span>
                <span>•</span>
                <span>1,482,091 pkts</span>
              </div>
            </div>
          </div>
          
          <span className="px-2 py-1 text-[10px] font-mono rounded bg-red-950/40 text-red-400 border border-red-500/20 shrink-0">
            UNRECOVERABLE
          </span>
        </div>

        {/* Strict Technical Deletion Boundary Callout */}
        <div className="p-3 rounded-md bg-red-950/20 border border-red-500/20 text-xs font-mono text-red-200/90 leading-relaxed flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"  />
          </svg>
          <div className="text-[11px]">
            Raw packet bytes, extracted SPI flow indices, and ML telemetry features will be purged immediately from NVMe tier-0 storage.
          </div>
        </div>
      </div>

      {/* Action Footer with Controlled Semantic Red Button */}
      <div className="px-6 py-4 bg-surface-card border-t border-surface-border flex items-center justify-between">
        <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] bg-surface-high border border-surface-border rounded text-gray-400">Esc</kbd> cancel
        </span>
        <div className="flex items-center gap-3">
          <button type="button" className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-surface-elevated border border-surface-border transition-colors" onClick={() => simulateCancel('Deletion cancelled')}>
            Cancel
          </button>
          <button type="button" className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-sm transition-all focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-surface-card" onClick={() => simulateAction('delete-success')}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"  />
            </svg>
            Delete Permanently
          </button>
        </div>
      </div>
    </div>


    {/* ========================================================================= */}
    {/* DIALOG C: SIDE-BY-SIDE SPECIFICATION COMPARISON VIEW                       */}
    {/* ========================================================================= */}
    <div id="modal-sidebyside" className={dialog === "sidebyside" ? "w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start" : "hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start"}>
      
      {/* Card A in Side-by-Side: Archive */}
      <div className="bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-surface-high/60 px-4 py-2 border-b border-surface-border flex items-center justify-between text-xs font-mono">
          <span className="text-brand-teal font-semibold">PATTERN 01 // ARCHIVE CAPTURE</span>
          <span className="text-gray-500 text-[10px]">PRESERVATIVE ACTION</span>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center shrink-0 text-brand-teal shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"  />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Archive capture?</h3>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-brand-teal-subtle text-brand-teal border border-brand-teal/20">REVERSIBLE</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                This capture will be removed from active analysis views while its forensic record is preserved.
              </p>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-surface-container border border-surface-border font-mono">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span>branch-emea-gw04.pcap</span>
              <span className="text-[9px] px-1 py-0.2 bg-surface-high text-gray-400 rounded">PCAP</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Score: 61/100 • IKEv2 / Tunnel • 1.48 GB</div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-end gap-3">
            <button className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-surface-elevated border border-surface-border transition-colors" onClick={() => simulateCancel('Archive cancelled')}>
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-teal text-surface-base hover:bg-brand-teal-hover transition-colors" onClick={() => simulateAction('archive-success')}>
              Archive Capture
            </button>
          </div>
        </div>
      </div>

      {/* Card B in Side-by-Side: Delete */}
      <div className="bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-surface-high/60 px-4 py-2 border-b border-surface-border flex items-center justify-between text-xs font-mono">
          <span className="text-red-400 font-semibold">PATTERN 02 // PERMANENT DELETION</span>
          <span className="text-gray-500 text-[10px]">DESTRUCTIVE ACTION</span>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"  />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Delete capture permanently?</h3>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-red-950/60 text-red-400 border border-red-500/30">IRREVERSIBLE</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                This action permanently removes the capture and its associated analysis record.
              </p>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-surface-container border border-surface-border font-mono">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span>branch-emea-gw04.pcap</span>
              <span className="text-[9px] px-1 py-0.2 bg-surface-high text-gray-400 rounded">PCAP</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">SHA-256: d41d8cd9... • 1,482,091 pkts</div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-end gap-3">
            <button className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-surface-elevated border border-surface-border transition-colors" onClick={() => simulateCancel('Deletion cancelled')}>
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors" onClick={() => simulateAction('delete-success')}>
              Delete Permanently
            </button>
          </div>
        </div>
      </div>

    </div>

  </div>

  {/* Toast Notification Overlay for State Feedback */}
  <div id="toast" className={toast.visible ? "fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none" : "fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none"}>
    <div className="px-4 py-3 rounded-lg bg-surface-elevated border border-surface-border shadow-xl font-mono text-xs flex items-center gap-3">
      <span id="toast-indicator" className={toast.variant === "teal" ? "w-2 h-2 rounded-full bg-brand-teal" : toast.variant === "red" ? "w-2 h-2 rounded-full bg-red-400" : "w-2 h-2 rounded-full bg-gray-400"}></span>
      <span id="toast-msg" className="text-gray-200">{toast.msg}</span>
    </div>
  </div>

  {/* Interactive Logic */}
  

    </div>
  );
}
