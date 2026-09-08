"use client";
import Link from "next/link";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";
import { ReportGenerationModal } from "@/components/modals/ReportGenerationModal";

export default function ReportsPage() {
  const [reportTab, setReportTab] = useState<"exec" | "tech">("exec");
  const [hexVisible, setHexVisible] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const toast = useToast();

  function switchReportTab(type: "exec" | "tech") {
    setReportTab(type);
  }

  function toggleHexInspect() {
    setHexVisible((v) => !v);
  }

  const downloadExec = (filename: string) => {
    downloadFile(filename, executiveReportJSON(), "application/json");
    toast({ title: "Report Generated", body: `${filename} downloaded.`, kind: "ok" });
  };

  const handleGenerateExec = () => {
    switchReportTab("exec");
    downloadExec("tunnelsight-executive-report.json");
  };

  const handleGenerateTech = () => {
    switchReportTab("tech");
    downloadExec("tunnelsight-technical-report.json");
  };

  const sendToCiso = () => toast({ title: "Sent to CISO", body: "Executive briefing link shared.", kind: "ok" });
  const disasmPayload = () => toast({ title: "Disassembly Queued", body: "Payload disassembly scheduled.", kind: "info" });
  const refreshArchive = () => toast({ title: "Archive Refreshed", body: "4 records synchronized.", kind: "info" });
  const reportConfig = () => toast({ title: "Report Configuration", body: "Report engine settings preset.", kind: "info" });
  const previewDoc = () => toast({ title: "Full Preview", body: "Preview mode active.", kind: "info" });
  const inspectDoc = () => toast({ title: "Document Inspection", body: "Viewing document metadata.", kind: "info" });

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
      <AppShell active="/analysis/reports">
        {/* Top Command Bar */}
        <div className="border-b border-zinc-800/80 bg-[#111317]/90 backdrop-blur px-6 py-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Link href="/history" className="hover:text-zinc-300 transition-colors">
                  Captures
                </Link>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-300">weak-vpn-07.pcap</span>
                <span className="text-zinc-700">/</span>
                <span className="text-teal-400 font-medium">Reports &amp; Compliance Export</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap pt-1">
                <h1 className="font-display-serif text-2xl font-bold tracking-tight text-white">
                  Security Report Center
                </h1>
                <span className="text-zinc-500 font-mono text-xs hidden sm:inline">
                  / Forensic Document Engine
                </span>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>ENGINE: RFC Audit v4.2</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-zinc-500">policy</span>
                  <span>NIST SP 800-77r1 &amp; CNSA 1.0</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>Ed25519 Signed</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                className="h-8 px-3 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-mono text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                type="button"
                onClick={() => setReportModalOpen(true)}
              >
                <span className="material-symbols-outlined text-[15px]">description</span>
                <span>Generate Report</span>
              </button>
              <button
                className="h-8 px-3 bg-[#14171c] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-mono text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
                type="button"
                onClick={handleGenerateTech}
              >
                <span className="material-symbols-outlined text-[15px]">terminal</span>
                <span>Technical Report</span>
              </button>
              <button
                className="h-8 px-3 bg-[#14171c] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 font-mono text-xs rounded flex items-center gap-1.5 transition-colors"
                type="button"
                onClick={() => downloadExec("tunnelsight-reports-batch.json")}
              >
                <span className="material-symbols-outlined text-[15px]">archive</span>
                <span>Batch Export (.zip)</span>
              </button>
              <button
                className="h-8 w-8 bg-[#14171c] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 rounded flex items-center justify-center transition-colors"
                title="Report Configuration"
                type="button"
                onClick={reportConfig}
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Document Viewport & Main Dossier */}
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Navigation Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#111317] border border-zinc-800/80 px-4 py-2 rounded-lg">
            <div className="inline-flex rounded-md border border-zinc-800 bg-[#0c0e11] p-0.5 text-xs font-mono">
              <button
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                  reportTab === "exec"
                    ? "bg-zinc-800 text-white font-medium shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                type="button"
                onClick={() => switchReportTab("exec")}
              >
                <span className="material-symbols-outlined text-[14px]">description</span>
                <span>Executive Briefing (CISO)</span>
              </button>
              <button
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                  reportTab === "tech"
                    ? "bg-zinc-800 text-white font-medium shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                type="button"
                onClick={() => switchReportTab("tech")}
              >
                <span className="material-symbols-outlined text-[14px]">data_object</span>
                <span>Deep Technical Audit (Forensic)</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs">
              <span className="text-zinc-500">
                {reportTab === "exec"
                  ? "RPT-2024-0518-EXEC-01 • Executive Briefing (4 Pages)"
                  : "RPT-2024-0518-TECH-FULL • Cryptographic Audit (18 Pages)"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                  title="Print Document"
                  type="button"
                  onClick={() => window.print()}
                >
                  <span className="material-symbols-outlined text-[15px]">print</span>
                </button>
                <button
                  className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-teal-400 transition-colors"
                  title="Download Signed PDF"
                  type="button"
                  onClick={() => downloadExec("tunnelsight-signed-report.json")}
                >
                  <span className="material-symbols-outlined text-[15px]">file_download</span>
                </button>
                <button
                  className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                  title="Full Width Preview"
                  type="button"
                  onClick={previewDoc}
                >
                  <span className="material-symbols-outlined text-[15px]">fullscreen</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN DOSSIER SHEET */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg shadow-xl overflow-hidden">
            {/* Header Classification Bar */}
            <div className="w-full bg-[#14171c] border-b border-zinc-800/80 px-4 py-2 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                  CONFIDENTIAL // TLP:AMBER
                </span>
                <span className="text-zinc-400 uppercase tracking-wider text-[11px]">TUNNELSIGHT FORENSIC DOSSIER</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                <span>
                  SERIAL: <strong className="text-zinc-200">RPT-2024-0518-SECX</strong>
                </span>
                <span className="text-zinc-600">|</span>
                <span>RFC-AUDIT-ENGINE-V4</span>
              </div>
            </div>

            {/* VIEW 1: EXECUTIVE BRIEFING */}
            {reportTab === "exec" && (
              <div className="p-6 space-y-6">
                {/* Executive Metadata Ribbon */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2.5 font-mono text-xs mb-1">
                      <span className="text-teal-400 uppercase tracking-widest text-[10px] font-semibold">
                        Executive Cybersecurity Evaluation
                      </span>
                      <span className="px-1.5 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-bold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">error</span>
                        <span>HIGH RISK</span>
                      </span>
                      <span className="text-zinc-500">
                        Score: <span className="font-display-serif text-rose-400 font-bold text-sm">47</span> / 100
                      </span>
                    </div>
                    <h2 className="font-display-serif text-xl font-bold tracking-tight text-white">
                      IPsec Security Posture Executive Briefing
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap text-zinc-400 font-mono text-xs mt-1">
                      <span>Target: <strong className="text-zinc-200">weak-vpn-07.pcap</strong></span>
                      <span className="text-zinc-600">•</span>
                      <span>Evaluated: 2024-05-18 14:28:19 UTC</span>
                      <span className="text-zinc-600">•</span>
                      <span>Signer: <span className="text-teal-400">SecReason-v4.2-engine</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-mono text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                      type="button"
                      onClick={() => downloadExec("tunnelsight-signed-report.json")}
                    >
                      <span className="material-symbols-outlined text-[15px]">verified_user</span>
                      <span>Download Signed PDF</span>
                    </button>
                    <button
                      className="px-3 py-1.5 bg-[#0c0e11] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-mono text-xs rounded flex items-center gap-1.5 transition-colors"
                      type="button"
                      onClick={sendToCiso}
                    >
                      <span className="material-symbols-outlined text-[15px]">mail</span>
                      <span>Send to CISO</span>
                    </button>
                  </div>
                </div>

                {/* Critical Findings Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-400 text-[18px]">policy</span>
                      <h3 className="font-mono text-sm font-semibold text-white">
                        Critical Security &amp; Cryptographic Weaknesses
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">3 Violations Found • 0 False Positives</span>
                  </div>

                  <div className="space-y-2">
                    {/* Violation 1 */}
                    <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700/80 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                          CRITICAL
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                            <span className="font-semibold text-zinc-100">
                              Diffie-Hellman Group 2 (MODP-1024) Negotiated
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                              IKEv2 SA_INIT
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Transform ID 2 selected in Phase 1 exchange. Known discrete logarithm weakness permits adversary precomputation and retrospective key recovery.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono text-xs">
                          <span className="text-zinc-300 block">RFC 8247 §2.4</span>
                          <span className="text-rose-400 text-[11px] font-medium">DEPRECATED</span>
                        </div>
                        <button
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-mono text-xs flex items-center gap-1 border border-zinc-700 transition-colors"
                          type="button"
                          onClick={() => switchReportTab("tech")}
                        >
                          <span>Evidence</span>
                          <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Violation 2 */}
                    <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700/80 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                          CRITICAL
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                            <span className="font-semibold text-zinc-100">
                              Perfect Forward Secrecy (PFS) Disabled for Child SA Rekeying
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                              ESP IPsec
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            CREATE_CHILD_SA payloads omit secondary DH transforms. Compromise of the initial IKE SA cascades into retroactive decodability of all subsequent ESP traffic.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono text-xs">
                          <span className="text-zinc-300 block">RFC 7296 §1.3.1</span>
                          <span className="text-rose-400 text-[11px] font-medium">PFS: NONE</span>
                        </div>
                        <button
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-mono text-xs flex items-center gap-1 border border-zinc-700 transition-colors"
                          type="button"
                          onClick={() => switchReportTab("tech")}
                        >
                          <span>Evidence</span>
                          <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Violation 3 */}
                    <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700/80 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                          HIGH RISK
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                            <span className="font-semibold text-zinc-100">
                              Upstream Egress Burst &amp; Payload Asymmetry
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                              Traffic Flow
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Isolation Forest flagged an unexpected 142 Mbps spike (+0.48 SHAP asymmetry) during interval T+02:15 to T+02:49, characteristic of bulk exfiltration.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono text-xs">
                          <span className="text-zinc-300 block">SHAP Vector</span>
                          <span className="text-teal-400 text-[11px] font-medium">SCORE: 0.91</span>
                        </div>
                        <button
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-mono text-xs flex items-center gap-1 border border-zinc-700 transition-colors"
                          type="button"
                          onClick={() => switchReportTab("tech")}
                        >
                          <span>Evidence</span>
                          <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Risk & Financial Impact Translation */}
                <div className="bg-[#14171c] border border-zinc-800/80 p-5 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-teal-400 font-mono text-sm font-semibold">
                    <span className="material-symbols-outlined text-[18px]">business_center</span>
                    <span>Business Risk &amp; Financial Impact Assessment</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[#0c0e11] border border-zinc-800/60 p-4 rounded-lg space-y-1">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                        Retrospective Traffic Exposure
                      </span>
                      <span className="font-mono text-xs font-semibold text-zinc-100 block">
                        Store-Now, Decrypt-Later (SNDL)
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                        Upstream wiretapping allows permanent payload harvesting. If DH keys are computed retroactively, all enterprise intellectual property is decrypted without active intrusion.
                      </p>
                    </div>

                    <div className="bg-[#0c0e11] border border-zinc-800/60 p-4 rounded-lg space-y-1">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                        Regulatory Non-Compliance
                      </span>
                      <span className="font-mono text-xs font-semibold text-zinc-100 block">
                        Fine Risk &amp; Audit Suspension
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                        Fails NIST SP 800-77r1, CNSA 1.0, and PCI-DSS 4.0 Req 4.1. Triggers mandatory compliance escalation and potential operational suspension of payment gateways.
                      </p>
                    </div>

                    <div className="bg-[#0c0e11] border border-zinc-800/60 p-4 rounded-lg space-y-1">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                        Interception &amp; Tunnel Hijacking
                      </span>
                      <span className="font-mono text-xs font-semibold text-zinc-100 block">
                        Man-In-The-Middle (MitM)
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                        CBC oracle exploitation and deterministic weak-group state allows sophisticated actors on intermediate transit nodes to inject plaintext commands into perimeter networks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prioritized Remediation Roadmap */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">build_circle</span>
                    <h3 className="font-mono text-sm font-semibold text-white">Prioritized Remediation Roadmap</h3>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-zinc-800/80 bg-[#111317]">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-[#0c0e11] text-zinc-400 text-[11px] uppercase tracking-wider">
                          <th className="py-2.5 px-4">Priority</th>
                          <th className="py-2.5 px-4">Remediation Action</th>
                          <th className="py-2.5 px-4">Target Config Directive</th>
                          <th className="py-2.5 px-4">Target SLA</th>
                          <th className="py-2.5 px-4">Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        <tr className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 font-bold text-[10px]">
                              P1 - IMMEDIATE
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-zinc-200">
                            Upgrade DH Group to Group 14 (MODP-2048) or Group 19 (ECP-256)
                          </td>
                          <td className="py-3 px-4 text-teal-400">ike=aes256gcm16-prfsha384-ecp384!</td>
                          <td className="py-3 px-4 text-rose-400 font-bold">&lt; 24 Hours</td>
                          <td className="py-3 px-4 text-teal-400">Closes DH Logjam Attack Vector</td>
                        </tr>

                        <tr className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 font-bold text-[10px]">
                              P1 - CRITICAL
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-zinc-200">
                            Enforce PFS (Perfect Forward Secrecy) on ESP Child SA Rekeying
                          </td>
                          <td className="py-3 px-4 text-teal-400">esp=aes256gcm16-ecp384!</td>
                          <td className="py-3 px-4 text-rose-400 font-bold">&lt; 48 Hours</td>
                          <td className="py-3 px-4 text-teal-400">Prevents Cascading Decryption</td>
                        </tr>

                        <tr className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                              P2 - REQUIRED
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-zinc-200">
                            Migrate from CBC mode to AEAD (AES-256-GCM or ChaCha20-Poly1305)
                          </td>
                          <td className="py-3 px-4 text-zinc-400">ipsec.secrets &amp; strongswan.d</td>
                          <td className="py-3 px-4 text-zinc-300">Next Sprint (7 Days)</td>
                          <td className="py-3 px-4 text-teal-400">Attains NIST 800-77r1 Compliance</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: DEEP TECHNICAL AUDIT */}
            {reportTab === "tech" && (
              <div className="p-6 space-y-6">
                {/* Technical Document Metadata Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-semibold block mb-1">
                      Forensic Cryptanalysis Specification
                    </span>
                    <h2 className="font-display-serif text-xl font-bold tracking-tight text-white">
                      Deep Technical Audit &amp; Packet Dissection Dossier
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap text-zinc-400 font-mono text-xs mt-1">
                      <span>
                        CAPTURE HASH: <span className="text-zinc-200">sha256:d8a0ef93c4...44b1c8e0</span>
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span>PACKETS: <span className="text-zinc-200">842,914 pkts</span></span>
                      <span className="text-zinc-600">•</span>
                      <span>VOLUME: <span className="text-zinc-200">614.2 MB (4m 12s)</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-mono text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                      type="button"
                      onClick={() => downloadExec("tunnelsight-forensic-spec.json")}
                    >
                      <span className="material-symbols-outlined text-[15px]">file_download</span>
                      <span>Export JSON Spec</span>
                    </button>
                    <button
                      className="px-3 py-1.5 bg-[#0c0e11] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-mono text-xs rounded flex items-center gap-1.5 transition-colors"
                      type="button"
                      onClick={disasmPayload}
                    >
                      <span className="material-symbols-outlined text-[15px]">code</span>
                      <span>Disasm Payload</span>
                    </button>
                  </div>
                </div>

                {/* Two-Pane Technical Deep Dive */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: IKEv2 Protocol Analysis & Hex Offsets */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="bg-[#14171c] border border-zinc-800/80 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
                          <span className="material-symbols-outlined text-teal-400 text-[18px]">key</span>
                          <span>IKEv2 Handshake &amp; SA Proposals</span>
                        </div>
                        <span className="font-mono text-xs text-zinc-500">Port 500 / 4500 (NAT-T)</span>
                      </div>

                      <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded font-mono text-xs space-y-1.5">
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Exchange Type:</span>
                          <span className="text-zinc-200 font-semibold">IKE_SA_INIT (Packet #42)</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Initiator SPI:</span>
                          <span className="text-teal-400">0x41f89c02d981aa44</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Responder SPI:</span>
                          <span className="text-teal-400">0x9a021da3b578cf10</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Selected SA Transform:</span>
                          <span className="text-rose-400">ENCR_AES_CBC (128) | AUTH_HMAC_SHA1_96 | DH_GROUP_2</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Deterministic RFC Citation:</span>
                          <span className="text-zinc-200">RFC 8247 §2.4 (Status: NOT RECOMMENDED)</span>
                        </div>
                      </div>

                      {/* Hex Inspector Section */}
                      <div className="space-y-1.5 pt-1">
                        <button
                          className="w-full flex items-center justify-between px-3 py-1.5 bg-[#0c0e11] border border-zinc-800 rounded text-zinc-400 hover:text-zinc-200 font-mono text-xs transition-colors"
                          type="button"
                          onClick={toggleHexInspect}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">terminal</span>
                            <span>Raw Packet Hex (Packet #42, Offset 0x0020 - 0x0050)</span>
                          </div>
                          <span className="text-teal-400 text-[11px]">{hexVisible ? "Hide Bytes" : "Show Bytes"}</span>
                        </button>

                        {hexVisible && (
                          <div className="bg-[#0c0e11] border border-zinc-800/80 p-3 rounded font-mono text-[11px] leading-relaxed overflow-x-auto select-text space-y-1">
                            <div className="flex gap-4">
                              <span className="text-zinc-600 select-none">0020</span>
                              <span className="text-zinc-300">41 f8 9c 02 d9 81 aa 44  9a 02 1d a3 b5 78 cf 10</span>
                              <span className="text-teal-400 select-none">|A......D.....x..|</span>
                            </div>
                            <div className="flex gap-4">
                              <span className="text-zinc-600 select-none">0030</span>
                              <span className="text-zinc-300">21 20 22 08 00 00 00 00  00 00 01 24 22 00 00 30</span>
                              <span className="text-teal-400 select-none">|! "........$"..0|</span>
                            </div>
                            <div className="flex gap-4 bg-rose-500/10 px-1 py-0.5 rounded">
                              <span className="text-rose-500 select-none">0040</span>
                              <span className="text-rose-400 font-semibold">00 00 00 2c 01 01 00 04  03 00 00 08 01 00 00 80</span>
                              <span className="text-rose-400 select-none">|...,............|</span>
                            </div>
                            <div className="flex gap-4">
                              <span className="text-zinc-600 select-none">0050</span>
                              <span className="text-zinc-300">03 00 00 08 02 00 00 02  00 00 00 08 04 00 00 02</span>
                              <span className="text-teal-400 select-none">|........DH_GRP2.|</span>
                            </div>
                            <div className="text-[10px] text-teal-400 pt-1 select-none">
                              [CONFIRMED: Byte 0x0057 value 0x02 directly asserts DH Group 2 MODP-1024 negotiation]
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ESP & SA Anti-Replay Telemetry */}
                    <div className="bg-[#14171c] border border-zinc-800/80 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
                          <span className="material-symbols-outlined text-teal-400 text-[18px]">security_update_good</span>
                          <span>ESP &amp; Security Association Integrity</span>
                        </div>
                        <span className="font-mono text-xs text-teal-400 font-semibold">VALIDATED</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded font-mono">
                          <span className="text-[10px] text-zinc-500 uppercase block">Anti-Replay Window</span>
                          <span className="text-sm text-white font-semibold block mt-1">64 Packets</span>
                          <span className="text-[11px] text-teal-400 block mt-0.5">0 Drops Detected</span>
                        </div>
                        <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded font-mono">
                          <span className="text-[10px] text-zinc-500 uppercase block">Seq Rollover Risk</span>
                          <span className="text-sm text-white font-semibold block mt-1">842,914 / 2^32</span>
                          <span className="text-[11px] text-zinc-400 block mt-0.5">&lt; 0.02% Utilization</span>
                        </div>
                      </div>

                      <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded font-mono text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Ingress SPI:</span>
                          <span className="text-zinc-300">0x41f89c02 (Active)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Egress SPI:</span>
                          <span className="text-zinc-300">0x9a021da3 (Active)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Integrity:</span>
                          <span className="text-rose-400">AUTH_HMAC_SHA1_96 (Truncated 12B ICV)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: ML Classification & Anomaly Detection */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Inferred ML Traffic Classification */}
                    <div className="bg-[#14171c] border border-zinc-800/80 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
                          <span className="material-symbols-outlined text-teal-400 text-[18px]">psychology</span>
                          <span>Inferred Traffic (Zero-Decryption ML)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 font-mono text-xs">
                          94.2% Confidence
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Synthesized via bidirectional inter-packet arrival time variances, packet length distributions, and burst models without breaking payload encryption.
                      </p>

                      <div className="space-y-2.5 pt-1">
                        <div>
                          <div className="flex justify-between font-mono text-xs mb-1">
                            <span className="text-zinc-200">Video Streaming (H.264/DASH)</span>
                            <span className="text-teal-400 font-bold">83.4%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: "83.4%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono text-xs mb-1">
                            <span className="text-zinc-200">Encrypted Web (TLS over ESP)</span>
                            <span className="text-zinc-400 font-bold">10.2%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-zinc-400 h-1.5 rounded-full" style={{ width: "10.2%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono text-xs mb-1">
                            <span className="text-zinc-200">Interactive Voice / VoIP (G.711)</span>
                            <span className="text-zinc-400 font-bold">4.1%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-zinc-600 h-1.5 rounded-full" style={{ width: "4.1%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono text-xs mb-1">
                            <span className="text-zinc-200">Bulk File Transfer / Synced Backup</span>
                            <span className="text-zinc-500 font-bold">2.3%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-zinc-700 h-1.5 rounded-full" style={{ width: "2.3%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anomaly Engine Results */}
                    <div className="bg-[#14171c] border border-zinc-800/80 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
                          <span className="material-symbols-outlined text-rose-400 text-[18px]">pulse_alert</span>
                          <span>Anomaly &amp; Exfiltration Detection</span>
                        </div>
                        <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 font-mono text-xs">
                          ANOMALY SCORE: 0.91
                        </span>
                      </div>

                      <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded font-mono text-xs space-y-1.5">
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Isolation Forest Outlier Score:</span>
                          <span className="text-rose-400 font-bold">0.9142 (Threshold: 0.70)</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Temporal Event Window:</span>
                          <span className="text-zinc-200">T+02:15 to T+02:49 (34 seconds)</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Burst Rate Anomaly:</span>
                          <span className="text-rose-400 font-semibold">4.8x baseline volume (142 Mbps spike)</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>SHAP Primary Vector:</span>
                          <span className="text-teal-400">Egress-to-Ingress Payload Asymmetry (+0.48)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-zinc-500 font-mono text-[11px]">
                        <span>Deterministic Assertions: <strong className="text-teal-400">100%</strong></span>
                        <span>ML Model: <strong className="text-zinc-300">v2.1-RandomForest+SVM</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document Sheet Footer */}
            <div className="w-full bg-[#14171c] border-t border-zinc-800/80 px-4 py-2.5 flex items-center justify-between text-zinc-500 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span>TunnelSight Engine v2.4.1</span>
                <span>•</span>
                <span>FIPS 140-3 Validation Pipeline: Pass</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span>End of Forensic Report Container</span>
                <span className="material-symbols-outlined text-[14px]">lock</span>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: REPORT ARCHIVE & DOCUMENT REPOSITORY */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">inventory_2</span>
                <h2 className="font-mono text-base font-semibold text-white">
                  Forensic Document Repository &amp; Historical Audits
                </h2>
                <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-xs">
                  4 Active Records
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 bg-[#14171c] border border-zinc-800 px-3 py-1 rounded text-zinc-400">
                  <span className="material-symbols-outlined text-[14px]">filter_list</span>
                  <span>Filter: weak-vpn-07.pcap</span>
                </div>
                <button
                  className="px-3 py-1 bg-[#14171c] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded flex items-center gap-1 transition-colors"
                  type="button"
                  onClick={refreshArchive}
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Tabular Document Repository */}
            <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#0c0e11] text-zinc-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Generated Timestamp</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {/* Row 1 */}
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-400 text-[16px]">article</span>
                        <div>
                          <span className="font-semibold text-zinc-100 block">RPT-2024-0518-EXEC-01</span>
                          <span className="text-zinc-500 text-[11px]">Executive Posture Briefing</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px]">
                        PDF / Signed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">2024-05-18 14:28:19 UTC</td>
                    <td className="py-3 px-4 text-zinc-300">1.4 MB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        <span>SIGNED &amp; READY</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-xs inline-flex items-center gap-1 transition-colors"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-executive-report.json")}
                        >
                          <span className="material-symbols-outlined text-[13px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-400 text-[16px]">terminal</span>
                        <div>
                          <span className="font-semibold text-zinc-100 block">RPT-2024-0518-TECH-FULL</span>
                          <span className="text-zinc-500 text-[11px]">Deep Cryptographic Spec &amp; Hex Trace</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px]">
                        JSON / Spec
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">2024-05-18 14:30:02 UTC</td>
                    <td className="py-3 px-4 text-zinc-300">8.6 MB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        <span>READY</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-xs inline-flex items-center gap-1 transition-colors"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-executive-report.json")}
                        >
                          <span className="material-symbols-outlined text-[13px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-zinc-400 text-[16px]">fact_check</span>
                        <div>
                          <span className="font-semibold text-zinc-100 block">RPT-2024-0517-NIST-AUDIT</span>
                          <span className="text-zinc-500 text-[11px]">NIST SP 800-77r1 Compliance Sheet</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px]">
                        CSV / Table
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">2024-05-17 09:14:55 UTC</td>
                    <td className="py-3 px-4 text-zinc-300">340 KB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">inventory_2</span>
                        <span>ARCHIVED</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-xs inline-flex items-center gap-1 transition-colors"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-nist-audit.json")}
                        >
                          <span className="material-symbols-outlined text-[13px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-400 text-[16px]">sync</span>
                        <div>
                          <span className="font-semibold text-zinc-100 block">RPT-2024-0518-SHAP-VEC</span>
                          <span className="text-zinc-500 text-[11px]">Zero-Decryption ML Feature Vectors</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px]">
                        JSON / Vectors
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">2024-05-18 14:31:40 UTC</td>
                    <td className="py-3 px-4 text-zinc-300">2.1 MB</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-semibold inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        <span>READY</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-xs inline-flex items-center gap-1 transition-colors"
                          type="button"
                          onClick={() => downloadExec("tunnelsight-executive-report.json")}
                        >
                          <span className="material-symbols-outlined text-[13px]">download</span>
                          <span>Download</span>
                        </button>
                        <button
                          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                          title="Inspect Document Content"
                          type="button"
                          onClick={inspectDoc}
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
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
          targetCapture="weak-vpn-07.pcap"
        />
      </AppShell>
    </div>
  );
}

