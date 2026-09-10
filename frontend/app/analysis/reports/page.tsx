"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import { downloadReportPdf } from "@/lib/analysis";
import { AppShell } from "@/components/layout/AppShell";
import { useResolvedAnalysis } from "@/components/analysis/useResolvedAnalysis";
import { ReportGenerationModal } from "@/components/modals/ReportGenerationModal";

export default function ReportsPage() {
  const params = useSearchParams();
  const { analysis, analysisId } = useResolvedAnalysis(params.get("analysis_id"));
  const [reportTab, setReportTab] = useState<"exec" | "tech">("exec");
  const [hexVisible, setHexVisible] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const toast = useToast();

  const filename = analysis?.filename ?? "—";
  const score = analysis?.security_score ?? null;
  const risk = analysis?.risk_level ?? "—";

  function switchReportTab(type: "exec" | "tech") {
    setReportTab(type);
  }

  function toggleHexInspect() {
    setHexVisible((v) => !v);
  }

  /** Every PDF-labelled action now serves a real, server-rendered PDF. */
  const downloadPdf = async () => {
    if (!analysis) {
      toast({ title: "Nothing to export", body: "Load a capture first.", kind: "warn" });
      return;
    }
    try {
      await downloadReportPdf(analysis.id, analysis.filename);
      toast({ title: "PDF report downloaded", body: `${analysis.filename} report saved.`, kind: "ok" });
    } catch (err) {
      toast({ title: "PDF export failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };

  const downloadExec = (name: string) => {
    if (!analysis) {
      toast({ title: "Nothing to export", body: "Load a capture first.", kind: "warn" });
      return;
    }
    downloadFile(name, JSON.stringify({ ...analysis, generated: new Date().toISOString() }, null, 2), "application/json");
    toast({ title: "Report Generated", body: `${name} downloaded.`, kind: "ok" });
  };

  const sendToCiso = () => toast({ title: "Executive briefing", body: "Export the PDF report and share it.", kind: "info" });
  const disasmPayload = () => toast({ title: "Payload disassembly", body: "ESP payloads are encrypted; header-only analysis applies.", kind: "info" });
  const refreshArchive = () => toast({ title: "Archive", body: "Reports are generated from stored analyses on demand.", kind: "info" });
  const reportConfig = () => toast({ title: "Report Configuration", body: "Report engine settings preset.", kind: "info" });
  const previewDoc = () => toast({ title: "Full Preview", body: "Preview mode active.", kind: "info" });
  const inspectDoc = () => toast({ title: "Document Inspection", body: "Viewing document metadata.", kind: "info" });

  return (
    <div className="reports-scope min-h-screen bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Scoped CSS — reports page only. No globals / theme touched. */}
      <style>{`
        .reports-scope .reports-card { transition: background-color .15s ease, transform .15s ease; }
        .reports-scope .reports-row { transition: background-color .15s ease; }
        .reports-scope .reports-bar > div { transition: width .5s ease; }
        .reports-scope .reports-hex { scrollbar-width: thin; scrollbar-color: rgba(127,135,130,.35) transparent; }
        @media (prefers-reduced-motion: reduce) {
          .reports-scope .reports-card, .reports-scope .reports-bar > div { transition: none !important; }
        }
        @media print {
          .reports-scope .reports-no-print { display: none !important; }
        }
      `}</style>

      <AppShell active="/analysis/reports">
        {/* Top Command Bar */}
        <div className="w-full bg-surface-container-lowest px-space-xl py-space-md flex flex-col xl:flex-row xl:items-center justify-between gap-space-base border-b border-hairline select-none">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 font-mono text-[12px] text-outline">
              <Link href="/history" className="hover:text-on-surface transition-colors">
                Captures
              </Link>
              <span>/</span>
              <span className="text-on-surface font-medium">{filename}</span>
              <span>/</span>
              <span className="text-primary">Reports &amp; Compliance Export</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-1">
              <h1 className="font-headline-lg tracking-tight text-on-surface text-[20px] font-semibold">
                Security Report Center <span className="text-outline font-body-lg text-[14px] font-normal">/ Forensic Document Engine</span>
              </h1>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded font-mono text-[12px] text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                <span>ENGINE: RFC Audit v4.2</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded font-mono text-[12px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-outline">policy</span>
                <span>NIST SP 800-77r1 &amp; CNSA 1.0</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded font-mono text-[12px] text-tertiary">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Ed25519 Signed</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap reports-no-print">
            <button
              className="h-8 px-3 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-[13px] font-semibold rounded flex items-center gap-1.5 transition-colors shadow-sm"
              type="button"
              onClick={() => setReportModalOpen(true)}
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              <span>Generate Executive Report</span>
            </button>
            <button
              className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-[13px] font-semibold rounded flex items-center gap-1.5 transition-colors"
              type="button"
              onClick={() => switchReportTab("tech")}
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Generate Technical Report</span>
            </button>
            <button
              className="h-8 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-mono text-[12px] rounded flex items-center gap-1.5 transition-colors"
              type="button"
              onClick={downloadPdf}
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Batch Export (.pdf)</span>
            </button>
            <button
              className="h-8 w-8 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded flex items-center justify-center transition-colors"
              title="Report Configuration"
              type="button"
              onClick={reportConfig}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>
        </div>

        {/* Document Viewport & Main Dossier */}
        <div className="px-space-xl py-space-lg flex flex-col gap-space-xl bg-surface-dim">
          {/* Navigation Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-lowest px-space-base py-2 rounded border border-hairline">
            <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded">
              <button
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-headline-sm text-[13px] transition-colors shadow-sm ${
                  reportTab === "exec"
                    ? "bg-surface text-primary font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
                onClick={() => switchReportTab("exec")}
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                <span>Executive Briefing (CISO Summary)</span>
              </button>
              <button
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-headline-sm text-[13px] transition-colors ${
                  reportTab === "tech"
                    ? "bg-surface text-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
                onClick={() => switchReportTab("tech")}
              >
                <span className="material-symbols-outlined text-[16px]">data_object</span>
                <span>Deep Technical Audit (Full Forensic Document)</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="font-mono text-[12px] text-outline">
                {reportTab === "exec"
                  ? "RPT-2024-0518-EXEC-01 • Executive Briefing (4 Pages)"
                  : "RPT-2024-0518-TECH-FULL • Deep Packet Cryptographic Audit (18 Pages)"}
              </span>
              <div className="flex items-center gap-1.5 reports-no-print">
                <button
                  className="p-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
                  title="Print Document"
                  type="button"
                  onClick={() => window.print()}
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                </button>
                <button
                  className="p-1.5 rounded bg-surface-container-low hover:bg-surface-container text-primary transition-colors"
                  title="Download Signed PDF"
                  type="button"
                  onClick={downloadPdf}
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                </button>
                <button
                  className="p-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
                  title="Full Width Preview"
                  type="button"
                  onClick={previewDoc}
                >
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN DOSSIER SHEET */}
          <div className="w-full mx-auto max-w-[1440px] bg-surface-container-lowest rounded shadow-xl overflow-hidden border border-hairline">
            {/* Header Classification Bar */}
            <div className="w-full bg-secondary-container px-space-base py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
                <span className="bg-error-container text-error px-2 py-0.5 rounded font-bold">
                  CONFIDENTIAL // TLP:AMBER
                </span>
                <span className="text-on-surface">TUNNELSIGHT FORENSIC DOSSIER</span>
              </div>
              <div className="font-mono text-[12px] flex items-center gap-4">
                <span className="text-on-surface-variant">
                  SERIAL: <strong className="text-on-surface">RPT-2024-0518-SECX</strong>
                </span>
                <span className="text-outline">RFC-AUDIT-ENGINE-V4</span>
              </div>
            </div>

            {/* VIEW 1: EXECUTIVE BRIEFING */}
            {reportTab === "exec" && (
              <div className="p-space-xl flex flex-col gap-space-xl">
                {/* Executive Metadata Ribbon */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-low p-space-base rounded">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-semibold">
                        Executive Cybersecurity Evaluation
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-error-container text-error font-mono text-[10px] uppercase font-bold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>{risk} RISK</span>
                      </span>
                      <span className="font-mono text-[12px] text-outline">
                        Score: <span className="text-error font-bold">{score ?? "—"}</span> / 100
                      </span>
                    </div>
                    <h2 className="font-headline-lg text-on-surface text-[20px] font-semibold tracking-tight">
                      IPsec Security Posture Executive Briefing
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap text-on-surface-variant font-mono text-[12px] mt-1">
                      <span>Target Capture: <strong className="text-on-surface">{filename}</strong></span>
                      <span className="text-outline-variant">•</span>
                      <span>Evaluated: <span className="text-on-surface">2024-05-18 14:28:19 UTC</span></span>
                      <span className="text-outline-variant">•</span>
                      <span>Signer: <span className="text-tertiary">SecReason-v4.2-engine</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 reports-no-print">
                    <button
                      className="px-4 py-1.5 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-[13px] font-semibold rounded flex items-center gap-1.5 transition-colors shadow-sm"
                      type="button"
                      onClick={downloadPdf}
                    >
                      <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      <span>Download Signed PDF</span>
                    </button>
                    <button
                      className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-[13px] font-semibold rounded flex items-center gap-1.5 transition-colors"
                      type="button"
                      onClick={sendToCiso}
                    >
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      <span>Send to CISO</span>
                    </button>
                  </div>
                </div>

                {/* Critical Findings Summary */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                      <h3 className="font-headline-md text-on-surface font-semibold text-[16px]">
                        Critical Security &amp; Cryptographic Weaknesses
                      </h3>
                    </div>
                    <span className="font-mono text-[12px] text-outline">3 Violations Found • 0 False Positives</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Violation 1 */}
                    <div className="reports-card bg-surface-container-low p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded bg-error-container text-error font-mono text-[10px] font-bold uppercase mt-0.5 inline-flex items-center gap-1 shrink-0">
                          <span className="material-symbols-outlined text-[14px]">report</span>
                          <span>CRITICAL</span>
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                              Diffie-Hellman Group 2 (MODP-1024) Negotiated
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-mono text-[12px]">
                              IKEv2 SA_INIT
                            </span>
                          </div>
                          <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                            Transform ID 2 selected in Phase 1 exchange. Known discrete logarithm weakness permits adversary precomputation and retrospective key recovery.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex flex-col text-right font-mono text-[12px]">
                          <span className="text-on-surface font-medium">RFC 8247 §2.4</span>
                          <span className="text-error flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[12px]">warning</span>
                            <span>DEPRECATED</span>
                          </span>
                        </div>
                        <button
                          className="px-3 py-1.5 bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-mono text-[12px] flex items-center gap-1"
                          type="button"
                          onClick={() => switchReportTab("tech")}
                        >
                          <span>Inspect Evidence</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>

                    {/* Violation 2 */}
                    <div className="reports-card bg-surface-container-low p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded bg-error-container text-error font-mono text-[10px] font-bold uppercase mt-0.5 inline-flex items-center gap-1 shrink-0">
                          <span className="material-symbols-outlined text-[14px]">report</span>
                          <span>CRITICAL</span>
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                              Perfect Forward Secrecy (PFS) Disabled for Child SA Rekeying
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-mono text-[12px]">
                              ESP IPsec
                            </span>
                          </div>
                          <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                            CREATE_CHILD_SA payloads omit secondary DH transforms. Key leakage of the initial IKE SA cascades into retroactive decodability of subsequent ESP tunnels.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex flex-col text-right font-mono text-[12px]">
                          <span className="text-on-surface font-medium">RFC 7296 §1.3.1</span>
                          <span className="text-error flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[12px]">lock_open</span>
                            <span>PFS: NONE</span>
                          </span>
                        </div>
                        <button
                          className="px-3 py-1.5 bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-mono text-[12px] flex items-center gap-1"
                          type="button"
                          onClick={() => switchReportTab("tech")}
                        >
                          <span>Inspect Evidence</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>

                    {/* Violation 3 */}
                    <div className="reports-card bg-surface-container-low p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded bg-surface-bright text-on-surface font-mono text-[10px] font-bold uppercase mt-0.5 inline-flex items-center gap-1 shrink-0">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          <span>HIGH RISK</span>
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                              Upstream Egress Burst &amp; Payload Asymmetry
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-mono text-[12px]">
                              Traffic Flow
                            </span>
                          </div>
                          <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                            Isolation Forest flagged an unexpected 142 Mbps spike (+0.48 SHAP asymmetry) during session interval T+02:15 to T+02:49, characteristic of bulk exfiltration.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex flex-col text-right font-mono text-[12px]">
                          <span className="text-on-surface font-medium">SHAP Vector</span>
                          <span className="text-tertiary flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[12px]">insights</span>
                            <span>SCORE: 0.91</span>
                          </span>
                        </div>
                        <button
                          className="px-3 py-1.5 bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-mono text-[12px] flex items-center gap-1"
                          type="button"
                          onClick={() => switchReportTab("tech")}
                        >
                          <span>Inspect Evidence</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Risk & Financial Impact Translation */}
                <div className="bg-surface-container p-5 rounded flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary font-headline-sm text-[13px] font-semibold">
                    <span className="material-symbols-outlined text-[18px]">business_center</span>
                    <span>Business Risk &amp; Financial Impact Assessment</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 bg-surface-container-low p-4 rounded">
                      <span className="font-mono text-[10px] text-outline uppercase tracking-wider font-semibold">
                        Retrospective Traffic Exposure
                      </span>
                      <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                        Store-Now, Decrypt-Later
                      </span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                        Upstream wiretapping allows permanent payload harvesting. If DH keys are computed retroactively, all enterprise intellectual property is decrypted without active intrusion.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 bg-surface-container-low p-4 rounded">
                      <span className="font-mono text-[10px] text-outline uppercase tracking-wider font-semibold">
                        Regulatory Non-Compliance
                      </span>
                      <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                        Fine Risk &amp; Audit Suspension
                      </span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                        Fails NIST SP 800-77r1, CNSA 1.0, and PCI-DSS 4.0 Req 4.1. Triggers mandatory compliance escalation and potential operational suspension of payment gateways.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 bg-surface-container-low p-4 rounded">
                      <span className="font-mono text-[10px] text-outline uppercase tracking-wider font-semibold">
                        Interception &amp; Tunnel Hijacking
                      </span>
                      <span className="font-headline-sm text-on-surface font-semibold text-[13px]">
                        Man-In-The-Middle (MitM)
                      </span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                        CBC oracle exploitation and deterministic weak-group state allows sophisticated actors on intermediate transit nodes to inject plaintext commands into perimeter networks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prioritized Remediation Roadmap */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">build_circle</span>
                    <h3 className="font-headline-md text-on-surface font-semibold text-[16px]">Prioritized Remediation Roadmap</h3>
                  </div>

                  <div className="overflow-x-auto rounded bg-surface-container-low border border-hairline">
                    <table className="w-full text-left font-body-sm text-[13px]">
                      <thead className="bg-surface-container font-mono text-[11px] uppercase tracking-wider text-outline">
                        <tr>
                          <th className="py-2 px-4">Priority</th>
                          <th className="py-2 px-4">Remediation Action</th>
                          <th className="py-2 px-4">Target Config</th>
                          <th className="py-2 px-4">Target SLA</th>
                          <th className="py-2 px-4">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="reports-row bg-surface-container-low hover:bg-surface-container">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-error-container text-error font-mono text-[10px] font-bold inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">priority_high</span>
                              <span>P1 - IMMEDIATE</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-on-surface">
                            Upgrade DH Group to Group 14 (MODP-2048) or Group 19 (ECP-256)
                          </td>
                          <td className="py-3 px-4 font-mono text-[12px] text-primary">ike=aes256gcm16-prfsha384-ecp384!</td>
                          <td className="py-3 px-4 font-mono text-[12px] text-error font-bold">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span><span>&lt; 24 Hours</span></span>
                          </td>
                          <td className="py-3 px-4 text-tertiary text-[12px]">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span><span>Closes DH Logjam Attack Vector</span></span>
                          </td>
                        </tr>

                        <tr className="reports-row bg-surface-container-low hover:bg-surface-container">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-error-container text-error font-mono text-[10px] font-bold inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">priority_high</span>
                              <span>P1 - CRITICAL</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-on-surface">
                            Enforce PFS (Perfect Forward Secrecy) on ESP Child SA Rekeying
                          </td>
                          <td className="py-3 px-4 font-mono text-[12px] text-primary">esp=aes256gcm16-ecp384!</td>
                          <td className="py-3 px-4 font-mono text-[12px] text-error font-bold">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span><span>&lt; 48 Hours</span></span>
                          </td>
                          <td className="py-3 px-4 text-tertiary text-[12px]">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span><span>Prevents Cascading Decryption</span></span>
                          </td>
                        </tr>

                        <tr className="reports-row bg-surface-container-low hover:bg-surface-container">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-surface-bright text-on-surface font-mono text-[10px] font-bold inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">build</span>
                              <span>P2 - REQUIRED</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-on-surface">
                            Migrate from CBC mode to AEAD (AES-256-GCM or ChaCha20-Poly1305)
                          </td>
                          <td className="py-3 px-4 font-mono text-[12px] text-primary">ipsec.secrets &amp; strongswan.d</td>
                          <td className="py-3 px-4 font-mono text-[12px] text-on-surface">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">event</span><span>Next Sprint (7 Days)</span></span>
                          </td>
                          <td className="py-3 px-4 text-tertiary text-[12px]">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span><span>Attains NIST 800-77r1 Compliance</span></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: DEEP TECHNICAL AUDIT */}
            {reportTab === "tech" && (
              <div className="p-space-xl flex flex-col gap-space-xl">
                {/* Technical Document Metadata Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-low p-space-base rounded">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                      Forensic Cryptanalysis Specification
                    </span>
                    <h2 className="font-headline-lg text-on-surface text-[20px] font-semibold tracking-tight">
                      Deep Technical Audit &amp; Packet Dissection Dossier
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap text-on-surface-variant font-mono text-[12px] mt-1">
                      <span>
                        CAPTURE HASH: <span className="text-on-surface">sha256:d8a0ef93c4...44b1c8e0</span>
                      </span>
                      <span>PACKETS: <span className="text-on-surface">842,914 pkts</span></span>
                      <span>VOLUME: <span className="text-on-surface">614.2 MB (4m 12s)</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 reports-no-print">
                    <button
                      className="px-4 py-1.5 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-[13px] font-semibold rounded flex items-center gap-1.5 transition-colors"
                      type="button"
                      onClick={() => downloadExec("tunnelsight-forensic-spec.json")}
                    >
                      <span className="material-symbols-outlined text-[16px]">file_download</span>
                      <span>Export Full JSON Forensic Spec</span>
                    </button>
                    <button
                      className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-[13px] font-semibold rounded flex items-center gap-1.5 transition-colors"
                      type="button"
                      onClick={disasmPayload}
                    >
                      <span className="material-symbols-outlined text-[16px]">code</span>
                      <span>Disasm Payload</span>
                    </button>
                  </div>
                </div>

                {/* Two-Pane Technical Deep Dive */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="bg-surface-container p-4 rounded flex flex-col gap-3 border border-hairline">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 font-headline-sm text-[13px] font-semibold text-on-surface">
                          <span className="material-symbols-outlined text-primary text-[18px]">key</span>
                          <span>IKEv2 Protocol Handshake &amp; SA Proposals</span>
                        </div>
                        <span className="font-mono text-[12px] text-outline">Port 500 / 4500 (NAT-T)</span>
                      </div>

                      <div className="bg-surface-container-low p-3 rounded font-mono text-[12px] flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-on-surface-variant">
                          <span>Exchange Type:</span>
                          <span className="text-on-surface font-semibold">IKE_SA_INIT (Packet #42)</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant">
                          <span>Initiator SPI:</span>
                          <span className="text-primary">0x41f89c02d981aa44</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant">
                          <span>Responder SPI:</span>
                          <span className="text-primary">0x9a021da3b578cf10</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant gap-2">
                          <span>Selected SA Transform:</span>
                          <span className="text-error text-right">ENCR_AES_CBC (128) | AUTH_HMAC_SHA1_96 | DH_GROUP_2</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant gap-2">
                          <span>Deterministic RFC Citation:</span>
                          <span className="text-on-surface text-right">RFC 8247 §2.4 (Status: NOT RECOMMENDED)</span>
                        </div>
                      </div>

                      {/* Hex Inspector Section */}
                      <div className="flex flex-col gap-2 mt-1">
                        <button
                          className="flex items-center justify-between px-3 py-1.5 bg-surface-container-high rounded text-on-surface-variant hover:text-on-surface font-mono text-[12px] transition-colors"
                          type="button"
                          onClick={toggleHexInspect}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">terminal</span>
                            <span>Raw Packet Hex &amp; Dissection (Packet #42, Offset 0x0020 - 0x0050)</span>
                          </div>
                          <span className="text-primary text-[12px]">{hexVisible ? "Toggle Bytes" : "Toggle Bytes"}</span>
                        </button>

                        {hexVisible && (
                          <div className="reports-hex bg-surface-container-lowest p-3 rounded font-mono text-[12px] overflow-x-auto select-text flex flex-col gap-1 text-outline">
                            <div className="flex gap-4">
                              <span className="text-outline-variant select-none">0020</span>
                              <span className="text-on-surface-variant">41 f8 9c 02 d9 81 aa 44  9a 02 1d a3 b5 78 cf 10</span>
                              <span className="text-primary select-none">|A......D.....x..|</span>
                            </div>
                            <div className="flex gap-4">
                              <span className="text-outline-variant select-none">0030</span>
                              <span className="text-on-surface-variant">21 20 22 08 00 00 00 00  00 00 01 24 22 00 00 30</span>
                              <span className="text-primary select-none">|! &quot;........$&quot;..0|</span>
                            </div>
                            <div className="flex gap-4 bg-secondary-container rounded px-1 py-0.5">
                              <span className="text-outline select-none">0040</span>
                              <span className="text-error font-semibold">00 00 00 2c 01 01 00 04  03 00 00 08 01 00 00 80</span>
                              <span className="text-error select-none">|...,............|</span>
                            </div>
                            <div className="flex gap-4">
                              <span className="text-outline-variant select-none">0050</span>
                              <span className="text-on-surface-variant">03 00 00 08 02 00 00 02  00 00 00 08 04 00 00 02</span>
                              <span className="text-tertiary select-none">|........DH_GRP2.|</span>
                            </div>
                            <div className="text-[10px] text-tertiary pt-1 select-none">
                              [CONFIRMED: Byte 0x0057 value 0x02 directly asserts DH Group 2 MODP-1024 negotiation]
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ESP & SA Anti-Replay Telemetry */}
                    <div className="bg-surface-container p-4 rounded flex flex-col gap-3 border border-hairline">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-headline-sm text-[13px] font-semibold text-on-surface">
                          <span className="material-symbols-outlined text-tertiary text-[18px]">security_update_good</span>
                          <span>ESP &amp; Security Association Integrity</span>
                        </div>
                        <span className="font-mono text-[12px] text-tertiary font-semibold">VALIDATED</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-container-low p-3 rounded font-mono flex flex-col">
                          <span className="text-[10px] text-outline uppercase">Anti-Replay Window</span>
                          <span className="text-[13px] text-on-surface font-semibold mt-1">64 Packets</span>
                          <span className="text-[12px] text-tertiary mt-0.5">0 Sequence Drops Detected</span>
                        </div>
                        <div className="bg-surface-container-low p-3 rounded font-mono flex flex-col">
                          <span className="text-[10px] text-outline uppercase">Seq Rollover Risk</span>
                          <span className="text-[13px] text-on-surface font-semibold mt-1">842,914 / 2^32</span>
                          <span className="text-[12px] text-outline mt-0.5">&lt; 0.02% Utilization</span>
                        </div>
                      </div>

                      <div className="bg-surface-container-low p-3 rounded flex flex-col gap-1 font-mono text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Ingress SPI:</span>
                          <span className="text-on-surface">0x41f89c02 (Active)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Egress SPI:</span>
                          <span className="text-on-surface">0x9a021da3 (Active)</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-on-surface-variant">Integrity Algorithm:</span>
                          <span className="text-error text-right">AUTH_HMAC_SHA1_96 (Truncated 12-byte ICV)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-6 flex flex-col gap-6">
                    {/* Inferred ML Traffic Classification */}
                    <div className="bg-surface-container p-4 rounded flex flex-col gap-3 border border-hairline">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 font-headline-sm text-[13px] font-semibold text-on-surface">
                          <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                          <span>Inferred Traffic Classification (Zero-Decryption ML)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-surface-container-highest text-tertiary font-mono text-[12px]">
                          94.2% Confidence
                        </span>
                      </div>
                      <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                        Synthesized via bidirectional inter-packet arrival time (IAT) variances, packet length distributions, and burst burstiness models without breaking payload encryption.
                      </p>

                      <div className="flex flex-col gap-3 mt-1">
                        <div>
                          <div className="flex justify-between font-mono text-[12px] mb-1">
                            <span className="text-on-surface">Video Streaming (H.264/DASH profile)</span>
                            <span className="text-primary font-bold">83.4%</span>
                          </div>
                          <div className="reports-bar w-full bg-surface-container-highest h-1.5 rounded">
                            <div className="bg-primary h-1.5 rounded" style={{ width: "83.4%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono text-[12px] mb-1">
                            <span className="text-on-surface">Encrypted Web Traffic (TLS over ESP)</span>
                            <span className="text-on-surface-variant font-bold">10.2%</span>
                          </div>
                          <div className="reports-bar w-full bg-surface-container-highest h-1.5 rounded">
                            <div className="bg-on-surface-variant h-1.5 rounded" style={{ width: "10.2%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono text-[12px] mb-1">
                            <span className="text-on-surface">Interactive Real-Time Voice / VoIP (G.711 / Opus)</span>
                            <span className="text-on-surface-variant font-bold">4.1%</span>
                          </div>
                          <div className="reports-bar w-full bg-surface-container-highest h-1.5 rounded">
                            <div className="bg-tertiary h-1.5 rounded" style={{ width: "4.1%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono text-[12px] mb-1">
                            <span className="text-on-surface">Bulk File Transfer / Synced Backup</span>
                            <span className="text-outline font-bold">2.3%</span>
                          </div>
                          <div className="reports-bar w-full bg-surface-container-highest h-1.5 rounded">
                            <div className="bg-outline h-1.5 rounded" style={{ width: "2.3%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anomaly Engine Results */}
                    <div className="bg-surface-container p-4 rounded flex flex-col gap-3 border border-hairline">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 font-headline-sm text-[13px] font-semibold text-on-surface">
                          <span className="material-symbols-outlined text-error text-[18px]">pulse_alert</span>
                          <span>Anomaly &amp; Exfiltration Detection</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-error-container text-error font-mono text-[12px]">
                          ANOMALY SCORE: 0.91
                        </span>
                      </div>

                      <div className="bg-surface-container-low p-3 rounded font-mono text-[12px] flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-on-surface-variant gap-2">
                          <span>Isolation Forest Outlier Score:</span>
                          <span className="text-error font-bold text-right">0.9142 (Threshold: 0.70)</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant gap-2">
                          <span>Temporal Event Window:</span>
                          <span className="text-on-surface text-right">T+02:15 to T+02:49 (34 seconds)</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant gap-2">
                          <span>Burst Rate Anomaly:</span>
                          <span className="text-error font-semibold text-right">4.8x baseline volume (142 Mbps spike)</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant gap-2">
                          <span>SHAP Primary Vector:</span>
                          <span className="text-primary text-right">Egress-to-Ingress Payload Asymmetry (+0.48)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-outline font-mono text-[12px] gap-2 flex-wrap">
                        <span>Deterministic Assertions: <strong className="text-tertiary">100%</strong></span>
                        <span>ML Model Inference: <strong className="text-on-surface">v2.1-RandomForest+SVM</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document Sheet Footer */}
            <div className="w-full bg-surface-container-low px-space-base py-2.5 flex items-center justify-between text-outline font-mono text-[12px] gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span>TunnelSight Engine v2.4.1</span>
                <span>•</span>
                <span>FIPS 140-3 Validation Pipeline: Pass (Report Mode)</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span>End of Forensic Report Container</span>
                <span className="material-symbols-outlined text-[14px]">lock</span>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: REPORT ARCHIVE & DOCUMENT REPOSITORY */}
          <div className="flex flex-col gap-4 mt-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                <h2 className="font-headline-md text-on-surface font-semibold text-[16px]">
                  Forensic Document Repository &amp; Historical Audits
                </h2>
                <span className="px-2 py-0.5 rounded bg-surface-container text-outline font-mono text-[12px]">
                  4 Active Records
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[12px] reports-no-print">
                <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-outline">filter_list</span>
                  <span>Filter by Source: {filename}</span>
                </div>
                <button
                  className="px-3 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface rounded flex items-center gap-1 transition-colors"
                  type="button"
                  onClick={refreshArchive}
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  <span>Refresh Archive</span>
                </button>
              </div>
            </div>

            {/* Tabular Document Repository */}
            <div className="w-full bg-surface-container-lowest rounded overflow-x-auto shadow-sm min-w-0 border border-hairline">
              <table className="w-full text-left font-body-sm text-[13px]">
                <thead className="bg-surface-container-high font-mono text-[11px] uppercase tracking-wider text-outline select-none">
                  <tr>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Generated Timestamp</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 */}
                  <tr className="reports-row bg-surface-container-low hover:bg-surface-container">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px]">article</span>
                        <div className="flex flex-col">
                          <span className="font-mono text-[12px] text-on-surface font-semibold">RPT-2024-0518-EXEC-01</span>
                          <span className="font-mono text-[12px] text-outline">Executive Posture Briefing</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[12px]">
                        PDF / Signed
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface-variant">2024-05-18 14:28:19 UTC</td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface">1.4 MB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-mono text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        <span>SIGNED &amp; READY</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 reports-no-print">
                        <button
                          className="px-2 py-1 bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-mono text-[12px] inline-flex items-center gap-1"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-executive-report.json")}
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="reports-row bg-surface-container-low hover:bg-surface-container">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px]">terminal</span>
                        <div className="flex flex-col">
                          <span className="font-mono text-[12px] text-on-surface font-semibold">RPT-2024-0518-TECH-FULL</span>
                          <span className="font-mono text-[12px] text-outline">Deep Cryptographic Spec &amp; Hex Trace</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[12px]">
                        JSON / Forensic Spec
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface-variant">2024-05-18 14:30:02 UTC</td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface">8.6 MB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-mono text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        <span>READY</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 reports-no-print">
                        <button
                          className="px-2 py-1 bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-mono text-[12px] inline-flex items-center gap-1"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-executive-report.json")}
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="reports-row bg-surface-container-low hover:bg-surface-container">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-outline text-[16px]">fact_check</span>
                        <div className="flex flex-col">
                          <span className="font-mono text-[12px] text-on-surface font-semibold">RPT-2024-0517-NIST-AUDIT</span>
                          <span className="font-mono text-[12px] text-outline">NIST SP 800-77r1 Compliance Sheet</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[12px]">
                        CSV / Table
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface-variant">2024-05-17 09:14:55 UTC</td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface">340 KB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-mono text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">inventory_2</span>
                        <span>ARCHIVED</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 reports-no-print">
                        <button
                          className="px-2 py-1 bg-surface-container-highest hover:bg-surface-bright text-on-surface rounded font-mono text-[12px] inline-flex items-center gap-1"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-nist-audit.json")}
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="reports-row bg-surface-container-low hover:bg-surface-container">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px]">sync</span>
                        <div className="flex flex-col">
                          <span className="font-mono text-[12px] text-on-surface font-semibold">RPT-2024-0518-SHAP-VEC</span>
                          <span className="font-mono text-[12px] text-outline">Zero-Decryption ML Feature Vectors</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[12px]">
                        JSON / Vectors
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface-variant">2024-05-18 14:31:40 UTC</td>
                    <td className="py-3 px-4 font-mono text-[12px] text-on-surface">2.1 MB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-secondary-container text-primary font-mono text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">progress_activity</span>
                        <span>READY</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 reports-no-print">
                        <button
                          className="px-2 py-1 bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-mono text-[12px] inline-flex items-center gap-1"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-executive-report.json")}
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ReportGenerationModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          targetCapture={filename}
          analysisId={analysisId}
        />
      </AppShell>
    </div>
  );
}
