"use client";

import { useEffect, useState } from "react";
import { downloadFile, useToast } from "@/lib/toast";
import { getAnalysis } from "@/lib/analysis";

interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCapture?: string;
  analysisId?: string | null;
}

export function ReportGenerationModal({
  isOpen,
  onClose,
  targetCapture = "branch-emea-gw04.pcap",
  analysisId = null,
}: ReportGenerationModalProps) {
  const [reportType, setReportType] = useState<"executive" | "technical">("executive");
  const [includeTraffic, setIncludeTraffic] = useState(true);
  const [includeAnomalies, setIncludeAnomalies] = useState(true);
  const [includeEvidence, setIncludeEvidence] = useState(false);
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

  const handleGenerate = async () => {
    const base = targetCapture.replace(/\.pcap\w*$/, "");
    const filename = `${base}-${reportType}-report.json`;
    try {
      const payload = analysisId
        ? await getAnalysis(analysisId)
        : {
            capture: targetCapture,
            report_type: reportType,
            sections: {
              traffic: includeTraffic,
              anomalies: includeAnomalies,
              evidence: includeEvidence,
            },
            generated: new Date().toISOString(),
          };
      downloadFile(filename, JSON.stringify(payload, null, 2), "application/json");
      toast({ title: "Security Report Generated", body: `${filename} exported.`, kind: "ok" });
    } catch (err) {
      toast({ title: "Report failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
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
        className="w-full max-w-xl bg-[#111317] border border-zinc-800/90 rounded-sm shadow-2xl overflow-hidden font-sans text-zinc-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#14171c]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-teal-950/30 border border-teal-800/40 flex items-center justify-center text-teal-400">
              <span className="material-symbols-outlined text-[18px]">description</span>
            </div>
            <div>
              <h2 className="text-base font-display-serif font-semibold text-white tracking-tight">
                Generate Security Report
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Target trace: <span className="text-zinc-200">{targetCapture}</span>
              </p>
            </div>
          </div>
          <button
            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-sm hover:bg-zinc-800 transition-colors"
            title="Close dialog"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-5 bg-[#0c0e11]/60">
          {/* Report Format Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2 font-medium">
              Report Profile
            </label>
            <div className="grid grid-cols-2 gap-2.5">
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
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      reportType === "executive" ? "border-teal-400 bg-teal-500/20" : "border-zinc-700"
                    }`}
                  >
                    {reportType === "executive" && <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono leading-snug">
                  High-level threat scoring, RFC non-conformance, and audit summary.
                </span>
              </button>

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
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      reportType === "technical" ? "border-teal-400 bg-teal-500/20" : "border-zinc-700"
                    }`}
                  >
                    {reportType === "technical" && <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono leading-snug">
                  Full cryptographic handshake parameters, SA lifetimes &amp; SPI mappings.
                </span>
              </button>
            </div>
          </div>

          {/* Optional Forensic Sections */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium">
                Optional Forensic Sections
              </span>
              <span className="text-[10px] font-mono text-zinc-600">Conservative defaults applied</span>
            </div>

            <div className="divide-y divide-zinc-800/80 border border-zinc-800/80 rounded-sm bg-[#14171c] overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-800/40 transition-colors">
                <div className="pr-3">
                  <div className="text-xs font-medium text-white">Include Traffic Intelligence</div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Classification breakdown of encrypted flows by behavioral fingerprint
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeTraffic}
                  onClick={() => setIncludeTraffic(!includeTraffic)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 border ${
                    includeTraffic ? "bg-teal-500 border-teal-400" : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${
                      includeTraffic ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-800/40 transition-colors">
                <div className="pr-3">
                  <div className="text-xs font-medium text-white">Include Anomaly Analysis</div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Deviation scores, packet burst telemetry, and sequence anomalies
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeAnomalies}
                  onClick={() => setIncludeAnomalies(!includeAnomalies)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 border ${
                    includeAnomalies ? "bg-teal-500 border-teal-400" : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${
                      includeAnomalies ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-800/40 transition-colors">
                <div className="pr-3">
                  <div className="text-xs font-medium text-white">Include Detailed Evidence</div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Frame indices, raw hex offsets of transform payloads, and RFC citations
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeEvidence}
                  onClick={() => setIncludeEvidence(!includeEvidence)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 border ${
                    includeEvidence ? "bg-teal-500 border-teal-400" : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${
                      includeEvidence ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
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
            <div className="text-zinc-500">
              EST. SIZE: <span className="text-zinc-200 font-mono">1.2 MB</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-5 py-3.5 bg-[#111317] border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
          <button
            className="px-3.5 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-sm border border-zinc-800 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 text-xs font-mono font-semibold text-black bg-teal-500 hover:bg-teal-400 rounded-sm flex items-center gap-1.5 transition-colors shadow-sm"
            onClick={handleGenerate}
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
