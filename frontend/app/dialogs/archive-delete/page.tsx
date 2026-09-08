"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function ArchiveDeleteDialogsPage() {
  const router = useRouter();
  const [dialog, setDialog] = useState<"archive" | "delete" | "sidebyside">("archive");
  const [toast, setToast] = useState({ visible: false, msg: "Operation simulated", variant: "teal" as "teal" | "red" | "gray" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/history");
    }
  };

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

  const simulateCancel = (msg: string) => {
    showToast(msg, "gray", 2000);
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
    <div className="min-h-screen bg-[#0c0e11] text-zinc-200 font-sans flex flex-col relative overflow-x-hidden selection:bg-teal-500/20 selection:text-teal-200">
      {/* Underlying Authenticated Application Canvas Preview (TunnelSight Analysis History in backdrop) */}
      <div className="pointer-events-none filter blur-[3px] opacity-20 fixed inset-0 flex flex-col z-0 select-none" aria-hidden="true">
        {/* Top Nav Bar Mock */}
        <header className="h-14 border-b border-zinc-800/80 bg-[#111317] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm bg-teal-500 flex items-center justify-center font-mono text-black font-bold text-xs">&gt;_</div>
            <span className="font-mono text-sm tracking-wider font-semibold text-white">TUNNELSIGHT</span>
            <span className="text-xs text-zinc-500 font-mono">/ IPsecXray</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ENGINE ONLINE</span>
            <span>•</span>
            <span>DPDK RX: READY</span>
          </div>
        </header>

        {/* Subdued Background Ledger View */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-display-serif text-white">Analysis History</h1>
              <p className="text-xs text-zinc-500 font-mono mt-1">Review previous captures, posture scores, and active SAs</p>
            </div>
          </div>
          <div className="border border-zinc-800/80 rounded-sm bg-[#111317] overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800/80 font-mono text-xs text-zinc-400 grid grid-cols-6">
              <span>STATUS</span>
              <span>CAPTURE</span>
              <span>PROTOCOL</span>
              <span>MODE</span>
              <span>POSTURE</span>
              <span>ACTION</span>
            </div>
            <div className="divide-y divide-zinc-800/80 font-mono text-xs text-zinc-300">
              <div className="px-5 py-4 grid grid-cols-6 items-center bg-[#14171c]">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> HIGH</span>
                <span className="text-white font-medium">branch-emea-gw04.pcap</span>
                <span>IKEv2</span>
                <span>Tunnel</span>
                <span className="text-amber-400">61 / 100</span>
                <span className="text-zinc-500">Selected</span>
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

      {/* Top Interactive Controls Bar */}
      <div className="relative z-40 bg-[#111317]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/history" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>History</span>
          </Link>
          <span className="text-zinc-700 font-mono">|</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">Dialog Component Suite</span>
          </div>
          <span className="text-zinc-700 font-mono hidden sm:inline">|</span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">Target: <code className="text-zinc-200 bg-[#14171c] px-1.5 py-0.5 rounded-sm border border-zinc-800">branch-emea-gw04.pcap</code></span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0c0e11] p-1 rounded-sm border border-zinc-800/80 text-xs font-mono">
          <button
            id="btn-show-archive"
            className={dialog === "archive" ? "px-3 py-1 rounded-sm bg-[#14171c] text-white font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors" : "px-3 py-1 rounded-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"}
            onClick={() => setDialog("archive")}
          >
            <span className="material-symbols-outlined text-teal-400 text-[15px]">inventory_2</span>
            Archive Dialog
          </button>
          <button
            id="btn-show-delete"
            className={dialog === "delete" ? "px-3 py-1 rounded-sm bg-[#14171c] text-white font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors" : "px-3 py-1 rounded-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"}
            onClick={() => setDialog("delete")}
          >
            <span className="material-symbols-outlined text-rose-400 text-[15px]">delete_forever</span>
            Permanent Delete Dialog
          </button>
          <button
            id="btn-show-sidebyside"
            className={dialog === "sidebyside" ? "px-3 py-1 rounded-sm bg-[#14171c] text-white font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors" : "px-3 py-1 rounded-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"}
            onClick={() => setDialog("sidebyside")}
          >
            <span className="material-symbols-outlined text-zinc-400 text-[15px]">view_column</span>
            Side-by-Side Comparison
          </button>
        </div>
      </div>

      {/* Primary Modal Backdrop Container */}
      <div className="relative z-30 flex-1 flex items-center justify-center p-6 bg-black/40">
        {/* ========================================================================= */}
        {/* DIALOG A: ARCHIVE CONFIRMATION DIALOG (Standard Focus View)                */}
        {/* ========================================================================= */}
        <div
          id="modal-archive"
          className={dialog === "archive" ? "w-full max-w-md bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all duration-200" : "hidden w-full max-w-md bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all duration-200"}
        >
          {/* Modal Header with Semantic Icon Badge */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-zinc-800/80 bg-[#14171c]/50">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-sm bg-teal-950/30 border border-teal-800/40 flex items-center justify-center shrink-0 text-teal-400 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-display-serif font-semibold text-white tracking-tight">Archive capture?</h2>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-teal-950/50 text-teal-300 border border-teal-800/40 font-medium">REVERSIBLE</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  This capture will be removed from active analysis views while its forensic record is preserved.
                </p>
              </div>
            </div>

            {/* Close Escape Button */}
            <button
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-sm hover:bg-[#14171c] transition-colors"
              title="Close (Esc)"
              onClick={() => simulateCancel("Archive cancelled")}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Target Capture Context Card */}
          <div className="px-6 py-4 bg-[#0c0e11]/60 space-y-3">
            <div className="p-3.5 rounded-sm bg-[#14171c] border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-sm bg-[#111317] flex items-center justify-center text-zinc-400 font-mono text-xs shrink-0 border border-zinc-800">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-white truncate tracking-tight">branch-emea-gw04.pcap</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-sm bg-zinc-800/60 text-zinc-300 border border-zinc-700">PCAP</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>Score: <span className="text-amber-400 font-medium">61/100</span></span>
                    <span>•</span>
                    <span>IKEv2 / Tunnel</span>
                    <span>•</span>
                    <span>1.48 GB</span>
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 text-[10px] font-mono rounded-sm bg-zinc-800/60 text-zinc-400 border border-zinc-700 shrink-0">
                ACTIVE
              </span>
            </div>

            {/* Archival Policy Note */}
            <div className="flex items-start gap-2 text-[11px] font-mono text-zinc-500">
              <span className="material-symbols-outlined text-[15px] text-zinc-400 shrink-0 mt-0.5">info</span>
              <span>Retained in Historical Vault for 365 days. Searchable via Archive filter.</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-6 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[#14171c] border border-zinc-800 rounded-sm text-zinc-400">Esc</kbd> cancel
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-sm text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                onClick={() => simulateCancel("Archive cancelled")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-1.5 rounded-sm text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-black flex items-center gap-1.5 transition-colors shadow-sm"
                onClick={() => simulateAction("archive-success")}
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                Archive Capture
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIALOG B: PERMANENT DELETE CONFIRMATION DIALOG (Semantic Warning View)     */}
        {/* ========================================================================= */}
        <div
          id="modal-delete"
          className={dialog === "delete" ? "w-full max-w-md bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all duration-200" : "hidden w-full max-w-md bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden transition-all duration-200"}
        >
          {/* Modal Header with Red Semantic Warning Indicator */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-zinc-800/80 bg-[#14171c]/50">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-sm bg-rose-950/40 border border-rose-800/40 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-display-serif font-semibold text-white tracking-tight">Delete capture permanently?</h2>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-rose-950/60 text-rose-300 border border-rose-800/40 font-medium">IRREVERSIBLE</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  This action permanently removes the capture and its associated analysis record.
                </p>
              </div>
            </div>

            {/* Close Escape Button */}
            <button
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-sm hover:bg-[#14171c] transition-colors"
              title="Close (Esc)"
              onClick={() => simulateCancel("Deletion cancelled")}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Target Capture Context with Impact Warning */}
          <div className="px-6 py-4 bg-[#0c0e11]/60 space-y-3">
            <div className="p-3.5 rounded-sm bg-[#14171c] border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-sm bg-rose-950/30 border border-rose-800/30 flex items-center justify-center text-rose-400 font-mono text-xs shrink-0">
                  <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-white truncate tracking-tight">branch-emea-gw04.pcap</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-sm bg-zinc-800/60 text-zinc-300 border border-zinc-700">PCAP</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>SHA-256: <span className="text-zinc-300">d41d8cd9...</span></span>
                    <span>•</span>
                    <span>1,482,091 pkts</span>
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 text-[10px] font-mono rounded-sm bg-rose-950/40 text-rose-400 border border-rose-800/30 shrink-0">
                UNRECOVERABLE
              </span>
            </div>

            {/* Strict Technical Deletion Boundary Callout */}
            <div className="p-3 rounded-sm bg-rose-950/20 border border-rose-800/30 text-xs font-mono text-rose-200/90 leading-relaxed flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[16px] text-rose-400 shrink-0 mt-0.5">error</span>
              <div className="text-[11px]">
                Raw packet bytes, extracted SPI flow indices, and ML telemetry features will be purged immediately from NVMe tier-0 storage.
              </div>
            </div>
          </div>

          {/* Action Footer with Controlled Semantic Red Button */}
          <div className="px-6 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[#14171c] border border-zinc-800 rounded-sm text-zinc-400">Esc</kbd> cancel
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-sm text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                onClick={() => simulateCancel("Deletion cancelled")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-1.5 rounded-sm text-xs font-mono font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                onClick={() => simulateAction("delete-success")}
              >
                <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIALOG C: SIDE-BY-SIDE SPECIFICATION COMPARISON VIEW                       */}
        {/* ========================================================================= */}
        <div
          id="modal-sidebyside"
          className={dialog === "sidebyside" ? "w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start" : "hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start"}
        >
          {/* Card A in Side-by-Side: Archive */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden">
            <div className="bg-[#14171c] px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-teal-400 font-semibold">PATTERN 01 // ARCHIVE CAPTURE</span>
              <span className="text-zinc-500 text-[10px]">PRESERVATIVE ACTION</span>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-sm bg-teal-950/30 border border-teal-800/40 flex items-center justify-center shrink-0 text-teal-400">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-display-serif font-semibold text-white">Archive capture?</h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-teal-950/50 text-teal-300 border border-teal-800/40">REVERSIBLE</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    This capture will be removed from active analysis views while its forensic record is preserved.
                  </p>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-sm bg-[#14171c] border border-zinc-800/80 font-mono">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>branch-emea-gw04.pcap</span>
                  <span className="text-[9px] px-1 py-0.2 bg-zinc-800 text-zinc-300 rounded-sm">PCAP</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Score: 61/100 • IKEv2 / Tunnel • 1.48 GB</div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
                <button
                  className="px-3.5 py-1.5 rounded-sm text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                  onClick={() => simulateCancel("Archive cancelled")}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1.5 rounded-sm text-xs font-mono font-semibold bg-teal-500 text-black hover:bg-teal-400 transition-colors"
                  onClick={() => simulateAction("archive-success")}
                >
                  Archive Capture
                </button>
              </div>
            </div>
          </div>

          {/* Card B in Side-by-Side: Delete */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden">
            <div className="bg-[#14171c] px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-semibold">PATTERN 02 // PERMANENT DELETION</span>
              <span className="text-zinc-500 text-[10px]">DESTRUCTIVE ACTION</span>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-sm bg-rose-950/40 border border-rose-800/40 flex items-center justify-center shrink-0 text-rose-400">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-display-serif font-semibold text-white">Delete capture permanently?</h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-rose-950/60 text-rose-300 border border-rose-800/40">IRREVERSIBLE</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    This action permanently removes the capture and its associated analysis record.
                  </p>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-sm bg-[#14171c] border border-zinc-800/80 font-mono">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>branch-emea-gw04.pcap</span>
                  <span className="text-[9px] px-1 py-0.2 bg-zinc-800 text-zinc-300 rounded-sm">PCAP</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">SHA-256: d41d8cd9... • 1,482,091 pkts</div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
                <button
                  className="px-3.5 py-1.5 rounded-sm text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                  onClick={() => simulateCancel("Deletion cancelled")}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1.5 rounded-sm text-xs font-mono font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                  onClick={() => simulateAction("delete-success")}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification Overlay */}
      <div
        id="toast"
        className={toast.visible ? "fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none" : "fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none"}
      >
        <div className="px-4 py-2.5 rounded-sm bg-[#14171c] border border-zinc-800 shadow-2xl font-mono text-xs flex items-center gap-3">
          <span
            id="toast-indicator"
            className={toast.variant === "teal" ? "w-2 h-2 rounded-full bg-teal-400" : toast.variant === "red" ? "w-2 h-2 rounded-full bg-rose-400" : "w-2 h-2 rounded-full bg-zinc-400"}
          ></span>
          <span id="toast-msg" className="text-zinc-200">{toast.msg}</span>
        </div>
      </div>
    </div>
  );
}
