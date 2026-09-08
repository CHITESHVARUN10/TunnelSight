"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/lib/mock/toast";

interface ArchiveDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  captureName?: string;
  pcapScore?: number;
  pcapSize?: string;
  packetCount?: string;
  initialMode?: "archive" | "delete";
  onSuccess?: (mode: "archive" | "delete") => void;
}

export function ArchiveDeleteModal({
  isOpen,
  onClose,
  captureName = "branch-emea-gw04.pcap",
  pcapScore = 61,
  pcapSize = "1.48 GB",
  packetCount = "1,482,091 pkts",
  initialMode = "archive",
  onSuccess,
}: ArchiveDeleteModalProps) {
  const [mode, setMode] = useState<"archive" | "delete">(initialMode);
  const toast = useToast();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

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
    if (mode === "archive") {
      toast({
        title: "Capture archived",
        body: `Capture ${captureName} moved to Historical Vault.`,
        kind: "ok",
      });
      onSuccess?.("archive");
    } else {
      toast({
        title: "Capture deleted",
        body: `Capture ${captureName} and raw frame telemetry purged.`,
        kind: "info",
      });
      onSuccess?.("delete");
    }
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
        className="w-full max-w-md bg-[#111317] border border-zinc-800/90 rounded-sm shadow-2xl overflow-hidden font-sans text-zinc-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Toggle between Archive / Delete modes if user wants to switch */}
        <div className="bg-[#0c0e11] px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Operation Type</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode("archive")}
              className={`px-2 py-0.5 rounded-sm text-[11px] transition-colors ${
                mode === "archive" ? "bg-teal-950/50 text-teal-400 border border-teal-800/50" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Archive
            </button>
            <button
              onClick={() => setMode("delete")}
              className={`px-2 py-0.5 rounded-sm text-[11px] transition-colors ${
                mode === "delete" ? "bg-rose-950/50 text-rose-400 border border-rose-800/50" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Permanent Delete
            </button>
          </div>
        </div>

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-zinc-800/80 bg-[#14171c]/50">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5 border ${
                mode === "archive"
                  ? "bg-teal-950/40 border-teal-800/40 text-teal-400"
                  : "bg-rose-950/40 border-rose-800/40 text-rose-400"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {mode === "archive" ? "inventory_2" : "warning"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-display-serif font-semibold text-white tracking-tight">
                  {mode === "archive" ? "Archive capture?" : "Delete capture permanently?"}
                </h2>
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded-sm font-medium border ${
                    mode === "archive"
                      ? "bg-teal-950/50 text-teal-300 border-teal-800/40"
                      : "bg-rose-950/60 text-rose-300 border-rose-800/40"
                  }`}
                >
                  {mode === "archive" ? "REVERSIBLE" : "IRREVERSIBLE"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {mode === "archive"
                  ? "This capture will be removed from active analysis views while its forensic record is preserved."
                  : "This action permanently removes the capture and its associated cryptographic analysis record."}
              </p>
            </div>
          </div>

          <button
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-sm hover:bg-[#14171c] transition-colors"
            title="Close (Esc)"
            onClick={onClose}
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
                  <span className="font-mono text-xs font-semibold text-white truncate tracking-tight">
                    {captureName}
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-sm bg-zinc-800/60 text-zinc-300 border border-zinc-700">
                    PCAP
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span>
                    Score: <span className="text-amber-400 font-medium">{pcapScore}/100</span>
                  </span>
                  <span>•</span>
                  <span>{mode === "archive" ? pcapSize : packetCount}</span>
                </div>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 text-[10px] font-mono rounded-sm shrink-0 border ${
                mode === "archive"
                  ? "bg-zinc-800/60 text-zinc-400 border-zinc-700"
                  : "bg-rose-950/40 text-rose-400 border-rose-800/40"
              }`}
            >
              {mode === "archive" ? "ACTIVE" : "PURGE TIER-0"}
            </span>
          </div>

          {/* Context Explanatory Callout */}
          {mode === "archive" ? (
            <div className="flex items-start gap-2 text-[11px] font-mono text-zinc-500">
              <span className="material-symbols-outlined text-[15px] text-zinc-400 shrink-0 mt-0.5">info</span>
              <span>Retained in Historical Vault for 365 days. Searchable via Archive filter.</span>
            </div>
          ) : (
            <div className="p-3 rounded-sm bg-rose-950/20 border border-rose-800/30 text-xs font-mono text-rose-200/90 leading-relaxed flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[16px] text-rose-400 shrink-0 mt-0.5">error</span>
              <div className="text-[11px]">
                Raw packet bytes, extracted SPI flow indices, and ML telemetry features will be purged immediately from NVMe tier-0 storage.
              </div>
            </div>
          )}
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
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-4 py-1.5 rounded-sm text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm ${
                mode === "archive"
                  ? "bg-teal-500 hover:bg-teal-400 text-black"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              }`}
              onClick={handleAction}
            >
              <span className="material-symbols-outlined text-[16px]">
                {mode === "archive" ? "inventory_2" : "delete_forever"}
              </span>
              {mode === "archive" ? "Archive Capture" : "Delete Permanently"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
