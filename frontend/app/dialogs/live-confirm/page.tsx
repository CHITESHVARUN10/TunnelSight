"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function LiveConfirmDialogsPage() {
  const [view, setView] = useState<"start" | "stop" | "both">("both");
  const [toast, setToast] = useState({ visible: false, msg: "Action executed" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast({ visible: true, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };
  const simulateAction = (msg: string) => showToast(msg);
  const showDismissMessage = (msg: string) => showToast(msg);
  return (
    <div className="bg-background font-sans text-sm text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">


  {/* Persistent Authenticated Shell Navigation Underlay */}
  <AppShell active="" innerClassName="p-space-base">

      {/* Background Content (Simulated Workbench underneath dialogs) */}
      <div className="flex flex-col gap-space-base max-w-7xl w-full mx-auto opacity-35 filter blur-[1.5px] pointer-events-none select-none">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/40">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-on-surface tracking-tight">Live IPsec Analysis — Continuous Interface Monitoring</h1>
            <span className="text-xs text-outline font-mono">dpdk0 · Promiscuous Ingest · Circular Ring Buffer Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-tertiary/10 text-tertiary font-mono text-xs border border-tertiary/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> CAPTURING
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-space-md">
          <div className="bg-surface-container-low p-space-md rounded border border-surface-container-highest/40 flex flex-col gap-1">
            <span className="text-[11px] font-mono text-outline uppercase">Active ESP Flows</span>
            <div className="text-xl font-mono text-on-surface font-semibold">128 <span className="text-xs text-tertiary font-normal">Active</span></div>
            <span className="text-[11px] font-mono text-outline">Zero drop rate on ring</span>
          </div>
          <div className="bg-surface-container-low p-space-md rounded border border-surface-container-highest/40 flex flex-col gap-1">
            <span className="text-[11px] font-mono text-outline uppercase">Wire Packets</span>
            <div className="text-xl font-mono text-on-surface font-semibold">1,842,901</div>
            <span className="text-[11px] font-mono text-outline">Avg: 94.2 kpps</span>
          </div>
          <div className="bg-surface-container-low p-space-md rounded border border-surface-container-highest/40 flex flex-col gap-1">
            <span className="text-[11px] font-mono text-outline uppercase">Session Elapsed</span>
            <div className="text-xl font-mono text-primary font-semibold">00:18:42</div>
            <span className="text-[11px] font-mono text-outline">Buffer retention: 4.8 GiB</span>
          </div>
          <div className="bg-surface-container-low p-space-md rounded border border-surface-container-highest/40 flex flex-col gap-1">
            <span className="text-[11px] font-mono text-outline uppercase">Security Findings</span>
            <div className="text-xl font-mono text-error font-semibold">3 <span className="text-xs text-error/80 font-normal">Flagged</span></div>
            <span className="text-[11px] font-mono text-outline">1 P0 Critical (DH Grp 2)</span>
          </div>
        </div>

        {/* Wire Telemetry Table preview */}
        <div className="bg-surface-container-low rounded border border-surface-container-highest/40 p-space-md flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono text-outline">
            <span>PACKET INGEST STREAM</span>
            <span>SHOWING LAST 5 FRAMES</span>
          </div>
          <div className="h-24 bg-surface-container-lowest rounded p-2 font-mono text-xs text-outline space-y-1">
            <div>14:32:01.002 [ESP] SPI 0x7a89f31c SEQ 148209 LEN 1420 192.0.2.14 -{'>'} 198.51.100.8</div>
            <div>14:32:01.008 [ESP] SPI 0xd411e89b SEQ 94103 LEN 256 198.51.100.8 -{'>'} 192.0.2.14</div>
            <div>14:32:01.014 [IKE_AUTH] CHILD_SA rekey detected NO_PFS (Transform ID 2)</div>
          </div>
        </div>
      </div>

      {/* Presentation Canvas for Confirmation Modals (Interactive Switcher & Clean Side-by-Side Context) */}
      <div className="fixed inset-0 top-header-height left-sidebar-expanded z-40 bg-surface-container-lowest/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-space-base overflow-y-auto">

        {/* Top Switcher Bar for Reviewers */}
        <div className="mb-6 flex items-center gap-2 bg-surface-container-low border border-surface-container-highest/60 p-1 rounded-lg text-xs select-none shadow-lg">
          <span className="text-outline px-2 font-mono text-[11px] uppercase tracking-wider">Dialog View:</span>
          <button id="tab-start" className={view === "start" ? "px-3 py-1.5 rounded font-medium transition-all bg-primary-container text-on-primary-container font-mono" : "px-3 py-1.5 rounded font-medium transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-mono"} onClick={() => setView("start")}>
            1. Start Live Analysis
          </button>
          <button id="tab-stop" className={view === "stop" ? "px-3 py-1.5 rounded font-medium transition-all bg-primary-container text-on-primary-container font-mono" : "px-3 py-1.5 rounded font-medium transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-mono"} onClick={() => setView("stop")}>
            2. Stop Live Analysis
          </button>
          <button id="tab-both" className={view === "both" ? "px-3 py-1.5 rounded font-medium transition-all bg-primary-container text-on-primary-container font-mono" : "px-3 py-1.5 rounded font-medium transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-mono"} onClick={() => setView("both")}>
            Compare Both
          </button>
        </div>

        {/* Dialogs Wrapper Container */}
        <div id="modals-container" className={view === "both" ? "w-full max-w-4xl flex items-center justify-center gap-8 flex-wrap" : "w-full max-w-md flex items-center justify-center"}>

          {/* ========================================================= */}
          {/* DIALOG 1: START LIVE ANALYSIS                             */}
          {/* ========================================================= */}
          <div id="modal-start" className={view === "stop" ? "hidden w-full max-w-[460px] bg-surface-container-low rounded-xl border border-surface-container-highest/80 shadow-2xl overflow-hidden transition-all duration-200" : "w-full max-w-[460px] bg-surface-container-low rounded-xl border border-surface-container-highest/80 shadow-2xl overflow-hidden transition-all duration-200"}>
            {/* Modal Header */}
            <div className="px-5 pt-5 pb-3 border-b border-surface-container-highest/40 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[19px]">pulse_alert</span>
                </div>
                <div>
                  <h2 className="font-semibold text-base text-on-surface tracking-tight leading-snug">Start live analysis?</h2>
                  <p className="text-[11px] font-mono text-outline mt-0.5">Continuous interface ingest &amp; protocol inspection</p>
                </div>
              </div>
              <button className="text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors" title="Close" onClick={() => showDismissMessage('Start analysis cancelled')}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content / Parameters */}
            <div className="px-5 py-4 flex flex-col gap-3.5">
              {/* Parameter List Cards */}
              <div className="bg-surface-container-lowest/80 rounded-lg border border-surface-container-highest/50 divide-y divide-surface-container-highest/40">
                {/* Interface Row */}
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Interface</span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span className="font-mono text-on-surface font-semibold bg-surface-container px-2 py-0.5 rounded border border-surface-container-highest/50">eth0</span>
                  </div>
                </div>

                {/* Analysis Profile Row */}
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Analysis Profile</span>
                  <span className="font-mono text-primary font-medium">Enterprise Edge Audit</span>
                </div>

                {/* Engines Row */}
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Engines</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[11px] text-on-surface bg-surface-container px-1.5 py-0.5 rounded border border-surface-container-highest/50">IPsec</span>
                    <span className="text-outline-variant font-mono text-xs">+</span>
                    <span className="font-mono text-[11px] text-on-surface bg-surface-container px-1.5 py-0.5 rounded border border-surface-container-highest/50">ML</span>
                    <span className="text-outline-variant font-mono text-xs">+</span>
                    <span className="font-mono text-[11px] text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded border border-tertiary/30">Anomaly Detection</span>
                  </div>
                </div>
              </div>

              {/* Authorization Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container/60 border border-surface-container-highest/40 text-xs">
                <span className="material-symbols-outlined text-outline text-[16px] shrink-0 mt-0.5">verified_user</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  <span className="font-medium text-on-surface">Small authorization notice:</span> Only capture traffic on interfaces you are authorized to monitor.
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-5 py-3.5 bg-surface-container-lowest/90 border-t border-surface-container-highest/50 flex items-center justify-end gap-2.5">
              <button className="px-3.5 py-1.5 rounded text-xs font-mono text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button" onClick={() => showDismissMessage('Start analysis cancelled')}>
                Cancel
              </button>
              <button className="px-4 py-1.5 rounded text-xs font-mono font-medium text-on-primary-container bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5" type="button" onClick={() => simulateAction('Live analysis initiated on eth0')}>
                <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                <span>Start Analysis</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DIALOG 2: STOP LIVE ANALYSIS                              */}
          {/* ========================================================= */}
          <div id="modal-stop" className={view === "start" ? "hidden w-full max-w-[460px] bg-surface-container-low rounded-xl border border-surface-container-highest/80 shadow-2xl overflow-hidden transition-all duration-200" : "w-full max-w-[460px] bg-surface-container-low rounded-xl border border-surface-container-highest/80 shadow-2xl overflow-hidden transition-all duration-200"}>
            {/* Modal Header */}
            <div className="px-5 pt-5 pb-3 border-b border-surface-container-highest/40 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-warning/10 border border-warning/25 flex items-center justify-center text-warning shrink-0">
                  <span className="material-symbols-outlined text-[19px]">stop_circle</span>
                </div>
                <div>
                  <h2 className="font-semibold text-base text-on-surface tracking-tight leading-snug">Stop live analysis?</h2>
                  <p className="text-[11px] font-mono text-outline mt-0.5">Finalize buffer ingest and save session trace</p>
                </div>
              </div>
              <button className="text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors" title="Close" onClick={() => showDismissMessage('Analysis continuing')}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content / Session Statistics */}
            <div className="px-5 py-4 flex flex-col gap-3.5">
              <div className="flex items-center justify-between text-xs text-outline font-mono">
                <span className="uppercase tracking-wider text-[10px]">Session Statistics</span>
                <span className="text-tertiary flex items-center gap-1 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Active on eth0
                </span>
              </div>

              {/* Metrics Grid (Useful session stats) */}
              <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest/80 p-2.5 rounded-lg border border-surface-container-highest/50">
                {/* Duration */}
                <div className="bg-surface-container/60 p-2.5 rounded border border-surface-container-highest/30 flex flex-col">
                  <span className="text-[10px] font-mono text-outline uppercase tracking-wider">Duration</span>
                  <div className="text-base font-mono font-semibold text-on-surface mt-0.5">00:18:42</div>
                </div>

                {/* Packets */}
                <div className="bg-surface-container/60 p-2.5 rounded border border-surface-container-highest/30 flex flex-col">
                  <span className="text-[10px] font-mono text-outline uppercase tracking-wider">Packets</span>
                  <div className="text-base font-mono font-semibold text-on-surface mt-0.5">1,842,901</div>
                </div>

                {/* ESP Flows */}
                <div className="bg-surface-container/60 p-2.5 rounded border border-surface-container-highest/30 flex flex-col">
                  <span className="text-[10px] font-mono text-outline uppercase tracking-wider">ESP Flows</span>
                  <div className="text-base font-mono font-semibold text-primary mt-0.5">128</div>
                </div>

                {/* Findings */}
                <div className="bg-surface-container/60 p-2.5 rounded border border-surface-container-highest/30 flex flex-col">
                  <span className="text-[10px] font-mono text-outline uppercase tracking-wider">Findings</span>
                  <div className="text-base font-mono font-semibold text-error mt-0.5 flex items-center gap-1.5">
                    <span>3</span>
                    <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-error/15 text-error font-medium">1 Critical</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-on-surface-variant flex items-center justify-between px-1">
                <span className="text-outline">Trace Destination:</span>
                <span className="text-on-surface font-medium">/var/log/tunnelsight/live-eth0-001842.pcap</span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-5 py-3.5 bg-surface-container-lowest/90 border-t border-surface-container-highest/50 flex items-center justify-end gap-2.5">
              <button className="px-3.5 py-1.5 rounded text-xs font-mono text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button" onClick={() => simulateAction('Resuming live monitor on eth0')}>
                Continue Analysis
              </button>
              <button className="px-4 py-1.5 rounded text-xs font-mono font-medium text-on-primary-container bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5" type="button" onClick={() => simulateAction('Capture saved: live-eth0-001842.pcap')}>
                <span className="material-symbols-outlined text-[15px]">save</span>
                <span>Stop &amp; Save Capture</span>
              </button>
            </div>
          </div>

        </div>

        {/* Toast Feedback Banner */}
        <div id="toast" className={toast.visible ? "transition-all duration-200 mt-5 px-3 py-1.5 rounded bg-surface-container-high border border-primary/40 text-xs font-mono text-on-surface flex items-center gap-2 shadow-lg" : "opacity-0 pointer-events-none transition-all duration-200 mt-5 px-3 py-1.5 rounded bg-surface-container-high border border-primary/40 text-xs font-mono text-on-surface flex items-center gap-2 shadow-lg"}>
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span id="toast-text">{toast.msg}</span>
        </div>

      </AppShell>

  

    </div>
  );
}
