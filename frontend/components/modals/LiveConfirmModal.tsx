"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/lib/mock/toast";

interface LiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "start" | "stop";
  onConfirm?: (mode: "start" | "stop") => void;
}

export function LiveConfirmModal({
  isOpen,
  onClose,
  mode,
  onConfirm,
}: LiveConfirmModalProps) {
  const toast = useToast();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = () => {
    if (mode === "start") {
      toast({
        title: "Live Analysis Started",
        body: "Ingest stream active on dpdk0 interface.",
        kind: "ok",
      });
    } else {
      toast({
        title: "Live Analysis Stopped",
        body: "Capture saved to /var/log/tunnelsight/live-dpdk0-001842.pcap",
        kind: "info",
      });
    }
    onConfirm?.(mode);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[440px] bg-[#111317] rounded-sm border border-zinc-800/90 shadow-2xl overflow-hidden font-sans text-zinc-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 pt-5 pb-3.5 border-b border-zinc-800/80 bg-[#14171c]/50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 border ${
                mode === "start"
                  ? "bg-teal-950/40 border-teal-800/40 text-teal-400"
                  : "bg-amber-950/40 border-amber-800/40 text-amber-400"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {mode === "start" ? "sensors" : "stop_circle"}
              </span>
            </div>
            <div>
              <h2 className="font-display-serif font-semibold text-base text-white tracking-tight leading-snug">
                {mode === "start" ? "Start live analysis?" : "Stop live analysis?"}
              </h2>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                {mode === "start"
                  ? "Continuous interface ingest & protocol inspection"
                  : "Finalize buffer ingest and save session trace"}
              </p>
            </div>
          </div>
          <button
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-sm hover:bg-[#14171c] transition-colors"
            title="Close"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        {mode === "start" ? (
          <div className="px-5 py-4 flex flex-col gap-3.5 bg-[#0c0e11]/60">
            {/* Parameter List Cards */}
            <div className="bg-[#14171c] rounded-sm border border-zinc-800/80 divide-y divide-zinc-800/60">
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Interface</span>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  <span className="font-mono text-white font-semibold bg-[#111317] px-2 py-0.5 rounded-sm border border-zinc-800">
                    dpdk0 (eth0)
                  </span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Analysis Profile</span>
                <span className="font-mono text-teal-400 font-medium">Enterprise Edge Audit</span>
              </div>

              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Engines</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[11px] text-zinc-200 bg-[#111317] px-1.5 py-0.5 rounded-sm border border-zinc-800">
                    IPsec
                  </span>
                  <span className="text-zinc-600 font-mono text-xs">+</span>
                  <span className="font-mono text-[11px] text-zinc-200 bg-[#111317] px-1.5 py-0.5 rounded-sm border border-zinc-800">
                    ML
                  </span>
                  <span className="text-zinc-600 font-mono text-xs">+</span>
                  <span className="font-mono text-[11px] text-teal-400 bg-teal-950/30 px-1.5 py-0.5 rounded-sm border border-teal-800/40">
                    Anomaly
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-sm bg-[#14171c] border border-zinc-800/80 text-xs">
              <span className="material-symbols-outlined text-zinc-400 text-[16px] shrink-0 mt-0.5">verified_user</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                <span className="font-medium text-zinc-300">Authorization notice:</span> Only capture traffic on interfaces you are authorized to monitor under organizational mandate.
              </p>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 flex flex-col gap-3.5 bg-[#0c0e11]/60">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="uppercase tracking-wider text-[10px]">Session Statistics</span>
              <span className="text-teal-400 flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Active on dpdk0
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#14171c] p-2.5 rounded-sm border border-zinc-800/80">
              <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Duration</span>
                <div className="text-base font-mono font-semibold text-white mt-0.5">00:18:42</div>
              </div>

              <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Packets</span>
                <div className="text-base font-mono font-semibold text-white mt-0.5">1,842,901</div>
              </div>

              <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">ESP Flows</span>
                <div className="text-base font-mono font-semibold text-teal-400 mt-0.5">128</div>
              </div>

              <div className="bg-[#111317] p-2.5 rounded-sm border border-zinc-800/60 flex flex-col">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Findings</span>
                <div className="text-base font-mono font-semibold text-rose-400 mt-0.5 flex items-center gap-1.5">
                  <span>3</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-rose-950/50 text-rose-300 font-medium">
                    1 Critical
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between px-1">
              <span className="text-zinc-500">Destination:</span>
              <span className="text-zinc-200 font-medium truncate ml-2">
                /var/log/tunnelsight/live-dpdk0-001842.pcap
              </span>
            </div>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="px-5 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
          <button
            className="px-3.5 py-1.5 rounded-sm text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-1.5 rounded-sm text-xs font-mono font-semibold transition-colors shadow-sm flex items-center gap-1.5 ${
              mode === "start"
                ? "bg-teal-500 hover:bg-teal-400 text-black"
                : "bg-teal-500 hover:bg-teal-400 text-black"
            }`}
            type="button"
            onClick={handleAction}
          >
            <span className="material-symbols-outlined text-[15px]">
              {mode === "start" ? "play_arrow" : "save"}
            </span>
            <span>{mode === "start" ? "Start Analysis" : "Stop & Save Capture"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
