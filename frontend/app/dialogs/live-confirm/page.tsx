"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function LiveConfirmDialogsPage() {
  const router = useRouter();
  const [view, setView] = useState<"start" | "stop" | "both">("both");
  const [toast, setToast] = useState({ visible: false, msg: "Action executed" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/analysis/live");
    }
  };

  const showToast = (msg: string) => {
    setToast({ visible: true, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const simulateAction = (msg: string) => {
    showToast(msg);
    setTimeout(dismiss, 600);
  };
  const showDismissMessage = (msg: string) => {
    showToast(msg);
    setTimeout(dismiss, 400);
  };

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
    <div className="min-h-screen bg-[#0c0e11] font-sans text-zinc-200 antialiased selection:bg-teal-500/20 selection:text-teal-200 flex flex-col relative overflow-x-hidden">
      {/* Background Content (Simulated Workbench underneath dialogs) */}
      <div className="fixed inset-0 pointer-events-none filter blur-[2px] opacity-20 flex flex-col z-0 select-none" aria-hidden="true">
        {/* Top Header Mock */}
        <header className="h-14 border-b border-zinc-800/80 bg-[#111317] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm bg-teal-500 flex items-center justify-center font-mono text-black font-bold text-xs">&gt;_</div>
            <span className="font-mono text-sm tracking-wider font-semibold text-white">TUNNELSIGHT</span>
            <span className="text-xs text-zinc-500 font-mono">/ Live Monitor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-sm bg-teal-950/40 text-teal-400 font-mono text-xs border border-teal-800/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> CAPTURING
            </span>
          </div>
        </header>

        {/* Mock Live Workbench */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div>
              <h1 className="text-2xl font-display-serif text-white tracking-tight">Live IPsec Analysis — Continuous Interface Monitoring</h1>
              <span className="text-xs text-zinc-500 font-mono">dpdk0 · Promiscuous Ingest · Circular Ring Buffer Active</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#111317] p-4 rounded-sm border border-zinc-800/80 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Active ESP Flows</span>
              <div className="text-2xl font-display-serif text-white font-semibold">128 <span className="text-xs text-teal-400 font-mono font-normal">Active</span></div>
              <span className="text-[11px] font-mono text-zinc-500">Zero drop rate on ring</span>
            </div>
            <div className="bg-[#111317] p-4 rounded-sm border border-zinc-800/80 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Wire Packets</span>
              <div className="text-2xl font-display-serif text-white font-semibold">1,842,901</div>
              <span className="text-[11px] font-mono text-zinc-500">Avg: 94.2 kpps</span>
            </div>
            <div className="bg-[#111317] p-4 rounded-sm border border-zinc-800/80 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Session Elapsed</span>
              <div className="text-2xl font-display-serif text-teal-400 font-semibold">00:18:42</div>
              <span className="text-[11px] font-mono text-zinc-500">Buffer retention: 4.8 GiB</span>
            </div>
            <div className="bg-[#111317] p-4 rounded-sm border border-zinc-800/80 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Security Findings</span>
              <div className="text-2xl font-display-serif text-rose-400 font-semibold">3 <span className="text-xs text-rose-300 font-mono font-normal">Flagged</span></div>
              <span className="text-[11px] font-mono text-zinc-500">1 P0 Critical (DH Grp 2)</span>
            </div>
          </div>

          <div className="bg-[#111317] rounded-sm border border-zinc-800/80 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>PACKET INGEST STREAM</span>
              <span>SHOWING LAST 3 FRAMES</span>
            </div>
            <div className="bg-[#0c0e11] rounded-sm p-3 font-mono text-xs text-zinc-400 space-y-1 border border-zinc-800/60">
              <div>14:32:01.002 [ESP] SPI 0x7a89f31c SEQ 148209 LEN 1420 192.0.2.14 -&gt; 198.51.100.8</div>
              <div>14:32:01.008 [ESP] SPI 0xd411e89b SEQ 94103 LEN 256 198.51.100.8 -&gt; 192.0.2.14</div>
              <div>14:32:01.014 [IKE_AUTH] CHILD_SA rekey detected NO_PFS (Transform ID 2)</div>
            </div>
          </div>
        </main>
      </div>

      {/* Top Switcher Bar */}
      <div className="relative z-40 bg-[#111317]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/analysis/live" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Live Analysis</span>
          </Link>
          <span className="text-zinc-700 font-mono">|</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">Live Capture Confirmation Dialogs</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0c0e11] p-1 rounded-sm border border-zinc-800/80 text-xs font-mono">
          <button
            id="tab-start"
            className={view === "start" ? "px-3 py-1 rounded-sm bg-[#14171c] text-white font-medium border border-zinc-700 transition-colors flex items-center gap-1.5" : "px-3 py-1 rounded-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5"}
            onClick={() => setView("start")}
          >
            <span className="material-symbols-outlined text-teal-400 text-[15px]">play_circle</span>
            Start Analysis
          </button>
          <button
            id="tab-stop"
            className={view === "stop" ? "px-3 py-1 rounded-sm bg-[#14171c] text-white font-medium border border-zinc-700 transition-colors flex items-center gap-1.5" : "px-3 py-1 rounded-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5"}
            onClick={() => setView("stop")}
          >
            <span className="material-symbols-outlined text-amber-400 text-[15px]">stop_circle</span>
            Stop Analysis
          </button>
          <button
            id="tab-both"
            className={view === "both" ? "px-3 py-1 rounded-sm bg-[#14171c] text-white font-medium border border-zinc-700 transition-colors flex items-center gap-1.5" : "px-3 py-1 rounded-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5"}
            onClick={() => setView("both")}
          >
            <span className="material-symbols-outlined text-zinc-400 text-[15px]">view_column</span>
            Compare Both
          </button>
        </div>
      </div>

      {/* Main Presentation Canvas for Dialogs */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center p-6 bg-black/40">
        <div id="modals-container" className={view === "both" ? "w-full max-w-4xl flex items-center justify-center gap-6 flex-wrap" : "w-full max-w-md flex items-center justify-center"}>
          {/* ========================================================= */}
          {/* DIALOG 1: START LIVE ANALYSIS                             */}
          {/* ========================================================= */}
          <div
            id="modal-start"
            className={view === "stop" ? "hidden w-full max-w-[440px] bg-[#111317] rounded-sm border border-zinc-800/80 shadow-2xl overflow-hidden transition-all duration-200" : "w-full max-w-[440px] bg-[#111317] rounded-sm border border-zinc-800/80 shadow-2xl overflow-hidden transition-all duration-200"}
          >
            {/* Modal Header */}
            <div className="px-5 pt-5 pb-3.5 border-b border-zinc-800/80 bg-[#14171c]/50 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-teal-950/40 border border-teal-800/40 flex items-center justify-center text-teal-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">sensors</span>
                </div>
                <div>
                  <h2 className="font-display-serif font-semibold text-base text-white tracking-tight leading-snug">Start live analysis?</h2>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">Continuous interface ingest &amp; protocol inspection</p>
                </div>
              </div>
              <button
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-sm hover:bg-[#14171c] transition-colors"
                title="Close"
                onClick={() => showDismissMessage("Start analysis cancelled")}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content / Parameters */}
            <div className="px-5 py-4 flex flex-col gap-3.5 bg-[#0c0e11]/60">
              {/* Parameter List Cards */}
              <div className="bg-[#14171c] rounded-sm border border-zinc-800/80 divide-y divide-zinc-800/60">
                {/* Interface Row */}
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Interface</span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span className="font-mono text-white font-semibold bg-[#111317] px-2 py-0.5 rounded-sm border border-zinc-800">dpdk0 (eth0)</span>
                  </div>
                </div>

                {/* Analysis Profile Row */}
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Analysis Profile</span>
                  <span className="font-mono text-teal-400 font-medium">Enterprise Edge Audit</span>
                </div>

                {/* Engines Row */}
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Engines</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[11px] text-zinc-200 bg-[#111317] px-1.5 py-0.5 rounded-sm border border-zinc-800">IPsec</span>
                    <span className="text-zinc-600 font-mono text-xs">+</span>
                    <span className="font-mono text-[11px] text-zinc-200 bg-[#111317] px-1.5 py-0.5 rounded-sm border border-zinc-800">ML</span>
                    <span className="text-zinc-600 font-mono text-xs">+</span>
                    <span className="font-mono text-[11px] text-teal-400 bg-teal-950/30 px-1.5 py-0.5 rounded-sm border border-teal-800/40">Anomaly</span>
                  </div>
                </div>
              </div>

              {/* Authorization Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-sm bg-[#14171c] border border-zinc-800/80 text-xs">
                <span className="material-symbols-outlined text-zinc-400 text-[16px] shrink-0 mt-0.5">verified_user</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                  <span className="font-medium text-zinc-300">Authorization notice:</span> Only capture traffic on interfaces you are authorized to monitor under organizational mandate.
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-5 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
              <button
                className="px-3.5 py-1.5 rounded-sm text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                type="button"
                onClick={() => showDismissMessage("Start analysis cancelled")}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 rounded-sm text-xs font-mono font-semibold text-black bg-teal-500 hover:bg-teal-400 transition-colors shadow-sm flex items-center gap-1.5"
                type="button"
                onClick={() => simulateAction("Live analysis initiated on dpdk0")}
              >
                <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                <span>Start Analysis</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DIALOG 2: STOP LIVE ANALYSIS                              */}
          {/* ========================================================= */}
          <div
            id="modal-stop"
            className={view === "start" ? "hidden w-full max-w-[440px] bg-[#111317] rounded-sm border border-zinc-800/80 shadow-2xl overflow-hidden transition-all duration-200" : "w-full max-w-[440px] bg-[#111317] rounded-sm border border-zinc-800/80 shadow-2xl overflow-hidden transition-all duration-200"}
          >
            {/* Modal Header */}
            <div className="px-5 pt-5 pb-3.5 border-b border-zinc-800/80 bg-[#14171c]/50 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">stop_circle</span>
                </div>
                <div>
                  <h2 className="font-display-serif font-semibold text-base text-white tracking-tight leading-snug">Stop live analysis?</h2>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">Finalize buffer ingest and save session trace</p>
                </div>
              </div>
              <button
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-sm hover:bg-[#14171c] transition-colors"
                title="Close"
                onClick={() => showDismissMessage("Analysis continuing")}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content / Session Statistics */}
            <div className="px-5 py-4 flex flex-col gap-3.5 bg-[#0c0e11]/60">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span className="uppercase tracking-wider text-[10px]">Session Statistics</span>
                <span className="text-teal-400 flex items-center gap-1 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  Active on dpdk0
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 bg-[#14171c] p-2.5 rounded-sm border border-zinc-800/80">
                {/* Duration */}
                <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Duration</span>
                  <div className="text-base font-mono font-semibold text-white mt-0.5">00:18:42</div>
                </div>

                {/* Packets */}
                <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Packets</span>
                  <div className="text-base font-mono font-semibold text-white mt-0.5">1,842,901</div>
                </div>

                {/* ESP Flows */}
                <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">ESP Flows</span>
                  <div className="text-base font-mono font-semibold text-teal-400 mt-0.5">128</div>
                </div>

                {/* Findings */}
                <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Findings</span>
                  <div className="text-base font-mono font-semibold text-rose-400 mt-0.5 flex items-center gap-1.5">
                    <span>3</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-rose-950/50 text-rose-300 font-medium">1 Critical</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between px-1">
                <span className="text-zinc-500">Destination:</span>
                <span className="text-zinc-200 font-medium">/var/log/tunnelsight/live-dpdk0-001842.pcap</span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-5 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
              <button
                className="px-3.5 py-1.5 rounded-sm text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                type="button"
                onClick={() => simulateAction("Resuming live monitor on dpdk0")}
              >
                Continue Analysis
              </button>
              <button
                className="px-4 py-1.5 rounded-sm text-xs font-mono font-semibold text-black bg-teal-500 hover:bg-teal-400 transition-colors shadow-sm flex items-center gap-1.5"
                type="button"
                onClick={() => simulateAction("Capture saved: live-dpdk0-001842.pcap")}
              >
                <span className="material-symbols-outlined text-[15px]">save</span>
                <span>Stop &amp; Save Capture</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Feedback Banner */}
        <div
          id="toast"
          className={toast.visible ? "transition-all duration-200 mt-6 px-4 py-2 rounded-sm bg-[#14171c] border border-zinc-800 text-xs font-mono text-zinc-200 flex items-center gap-2.5 shadow-2xl" : "opacity-0 pointer-events-none transition-all duration-200 mt-6 px-4 py-2 rounded-sm bg-[#14171c] border border-zinc-800 text-xs font-mono text-zinc-200 flex items-center gap-2.5 shadow-2xl"}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          <span id="toast-text">{toast.msg}</span>
        </div>
      </div>
    </div>
  );
}
