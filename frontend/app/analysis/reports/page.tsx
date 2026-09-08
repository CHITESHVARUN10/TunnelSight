"use client";
import Link from "next/link";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";
export default function ReportsPage() {
  const [reportTab, setReportTab] = useState("exec");
  const [hexVisible, setHexVisible] = useState(true);
  function switchReportTab(type: string) {
    setReportTab(type);
  }
  function toggleHexInspect() {
    setHexVisible((v) => !v);
  }
  const toast = useToast();
  const downloadExec = (filename: string) => {
    downloadFile(filename, executiveReportJSON(), "application/json");
    toast({ title: "Report generated", body: `${filename} downloaded (mock).`, kind: "ok" });
  };
  const handleGenerateExec = () => {
    switchReportTab("exec");
    downloadExec("tunnelsight-executive-report.json");
  };
  const handleGenerateTech = () => {
    switchReportTab("tech");
    downloadExec("tunnelsight-technical-report.json");
  };
  const sendToCiso = () => toast({ title: "Sent to CISO", body: "Executive briefing link shared (mock).", kind: "ok" });
  const disasmPayload = () => toast({ title: "Disassembly queued", body: "Payload disassembly scheduled (mock).", kind: "info" });
  const refreshArchive = () => toast({ title: "Archive refreshed", body: "4 records synchronized (mock).", kind: "info" });
  const reportConfig = () => toast({ title: "Report configuration", body: "Report engine settings preset (mock).", kind: "info" });
  const previewDoc = () => toast({ title: "Preview", body: "Full-width preview is mocked in this prototype.", kind: "info" });
  const inspectDoc = () => toast({ title: "Document preview", body: "In-viewer document inspection is mocked.", kind: "info" });
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<AppShell active="/analysis/reports" innerClassName="flex flex-col w-full text-on-surface select-none">

{/* Script for Tab & Navigation State Synchronization */}

{/* Top Ingestion & Action Command Bar */}
<div className="w-full bg-surface-container-lowest px-space-xl py-space-md flex flex-col xl:flex-row xl:items-center justify-between gap-space-base shadow-sm">
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
<span className="">Captures</span>
<span className="">/</span>
<span className="text-on-surface font-code-md text-code-md">weak-vpn-07.pcap</span>
<span className="">/</span>
<span className="text-primary">Reports &amp; Compliance Export</span>
</div>
<div className="flex items-center gap-space-md flex-wrap mt-space-2xs">
<h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">Security Report Center <span className="text-outline font-body-lg text-body-lg">/ Forensic Document Engine</span></h1>
<div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
<span className="font-code-sm text-code-sm text-on-surface-variant">ENGINE: RFC Audit v4.2</span>
</div>
<div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded">
<span className="material-symbols-outlined text-outline text-[14px]">policy</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">NIST SP 800-77r1 &amp; CNSA 1.0</span>
</div>
<div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded">
<span className="material-symbols-outlined text-tertiary text-[14px]">verified</span>
<span className="font-code-sm text-code-sm text-tertiary">Ed25519 Signed</span>
</div>
</div>
</div>
{/* Action Buttons Group */}
<div className="flex items-center gap-space-sm flex-wrap self-start xl:self-center"><button className="h-8 px-space-md bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-headline-sm rounded flex items-center gap-space-xs transition-colors shadow-sm focus:outline-none" type="button" onClick={handleGenerateExec}><span className="material-symbols-outlined text-[16px]">picture_as_pdf</span><span className="">Generate Executive Report</span></button><button className="h-8 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm rounded flex items-center gap-space-xs transition-colors focus:outline-none" type="button" onClick={handleGenerateTech}><span className="material-symbols-outlined text-[16px]">terminal</span><span className="">Generate Technical Report</span></button><button className="h-8 px-space-sm bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded flex items-center gap-space-xs transition-colors focus:outline-none" type="button" onClick={() => downloadExec("tunnelsight-reports-batch.json")}><span className="material-symbols-outlined text-[16px]">archive</span><span className="font-code-sm text-code-sm">Batch Export (.zip)</span></button><button className="h-8 w-8 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded flex items-center justify-center transition-colors focus:outline-none" title="Report Configuration" type="button" onClick={reportConfig}><span className="material-symbols-outlined text-[18px]">settings</span></button></div>
</div>
{/* Document Stage / Workspace Canvas */}
<div className="w-full px-space-xl py-space-lg flex flex-col gap-space-xl">
{/* Document Viewport Navigation & Canvas Header */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm bg-surface-container-lowest px-space-base py-space-xs rounded">
<div className="flex items-center gap-space-xs bg-surface-container-low p-space-2xs rounded">
<button className={reportTab === "exec" ? "flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface text-primary font-headline-sm text-headline-sm transition-colors shadow-sm" : "flex items-center gap-space-xs px-space-md py-space-xs rounded text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-colors"} id="tab-btn-exec" type="button" onClick={() => switchReportTab('exec')}>
<span className="material-symbols-outlined text-[16px]">description</span>
<span className="">Executive Briefing (CISO Summary)</span>
</button>
<button className={reportTab === "tech" ? "flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface text-primary font-headline-sm text-headline-sm transition-colors shadow-sm" : "flex items-center gap-space-xs px-space-md py-space-xs rounded text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-colors"} id="tab-btn-tech" type="button" onClick={() => switchReportTab('tech')}>
<span className="material-symbols-outlined text-[16px]">data_object</span>
<span className="">Deep Technical Audit (Full Forensic Document)</span>
</button>
</div>
<div className="flex items-center gap-space-md text-on-surface-variant">
<span className="font-code-sm text-code-sm text-outline" id="doc-meta-indicator">{reportTab === "exec" ? "RPT-2024-0518-EXEC-01 • Executive Briefing (4 Pages)" : "RPT-2024-0518-TECH-FULL • Deep Packet Cryptographic Audit (18 Pages)"}</span>
<div className="flex items-center gap-space-xs">
<button className="p-space-xs rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors" title="Print Document" type="button" onClick={() => window.print()}>
<span className="material-symbols-outlined text-[16px]">print</span>
</button>
<button className="p-space-xs rounded bg-surface-container-low hover:bg-surface-container text-primary transition-colors" title="Download Signed PDF" type="button" onClick={() => downloadExec("tunnelsight-signed-report.json")}>
<span className="material-symbols-outlined text-[16px]">file_download</span>
</button>
<button className="p-space-xs rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors" title="Full Width Preview" type="button" onClick={previewDoc}>
<span className="material-symbols-outlined text-[16px]">fullscreen</span>
</button>
</div>
</div>
</div>
{/* MAIN DOSSIER SHEET (Forensic Technical Document Simulation) */}
<div className="w-full mx-auto max-w-[1440px] bg-surface-container-lowest rounded shadow-xl overflow-hidden">
{/* Forensic Header Classification Bar */}
<div className="w-full bg-secondary-container px-space-base py-space-2xs flex items-center justify-between text-on-secondary-container">
<div className="flex items-center gap-space-sm font-label-sm text-label-sm uppercase tracking-wider">
<span className="bg-error-container text-error px-space-xs py-space-2xs rounded font-bold">CONFIDENTIAL // TLP:AMBER</span>
<span className="">TUNNELSIGHT FORENSIC DOSSIER</span>
</div>
<div className="font-code-sm text-code-sm flex items-center gap-space-md">
<span className="">SERIAL: <strong className="text-on-surface">RPT-2024-0518-SECX</strong></span>
<span className="text-outline">RFC-AUDIT-ENGINE-V4</span>
</div>
</div>
{/* ======================================================== */}
{/* VIEW 1: EXECUTIVE REPORT BRIEFING CANVAS                */}
{/* ======================================================== */}
<div className={reportTab === "exec" ? "p-space-xl flex flex-col gap-space-xl border-l-2 border-tertiary/50" : "hidden p-space-xl flex flex-col gap-space-xl"} id="report-view-exec">{/* Document Meta Ribbon & Quick Action Header */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low p-space-base rounded">
<div className="flex flex-col gap-space-2xs">
<div className="flex items-center gap-space-sm">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Executive Cybersecurity Evaluation</span>
<span className="px-space-xs py-space-2xs rounded bg-error-container text-error font-label-sm text-label-sm uppercase font-bold inline-flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[14px]">error</span><span>HIGH RISK</span></span>
<span className="font-code-sm text-code-sm text-outline">Score: <span className="text-error font-bold">47</span> / 100</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">IPsec Security Posture Executive Briefing</h2>
<div className="flex items-center gap-space-base flex-wrap text-on-surface-variant font-code-sm text-code-sm mt-space-2xs">
<span>Target Capture: <strong className="text-on-surface font-mono">weak-vpn-07.pcap</strong></span>
<span className="text-outline-variant">•</span>
<span>Evaluated: <span className="text-on-surface font-mono">2024-05-18 14:28:19 UTC</span></span>
<span className="text-outline-variant">•</span>
<span>Signer: <span className="text-tertiary font-mono">SecReason-v4.2-engine</span></span>
</div>
</div>
<div className="flex items-center gap-space-sm self-start lg:self-center shrink-0">
<button className="px-space-md py-space-xs bg-primary-container text-on-primary-container hover:bg-tertiary-container font-headline-sm text-headline-sm rounded flex items-center gap-space-xs transition-colors shadow-sm focus:outline-none" type="button" onClick={() => downloadExec("tunnelsight-signed-report.json")}>
<span className="material-symbols-outlined text-[16px]">verified_user</span>
<span>Download Signed PDF</span>
</button>
<button className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm rounded flex items-center gap-space-xs transition-colors focus:outline-none" type="button" onClick={sendToCiso}>
<span className="material-symbols-outlined text-[16px]">mail</span>
<span>Send to CISO</span>
</button>
</div>
</div>
{/* Critical Findings Summary */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[18px]">policy</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Critical Security &amp; Cryptographic Weaknesses</h3>
</div>
<span className="font-code-sm text-code-sm text-outline">3 Violations Found • 0 False Positives</span>
</div>
<div className="flex flex-col gap-space-xs">
{/* Violation 1 */}
<div className="bg-surface-container-low p-space-md rounded flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex items-start gap-space-md">
<span className="px-space-xs py-space-2xs rounded bg-error-container text-error font-label-sm text-label-sm font-bold uppercase mt-space-2xs inline-flex items-center gap-space-2xs shrink-0"><span className="material-symbols-outlined text-[14px]">report</span><span>CRITICAL</span></span>
<div className="flex flex-col">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Diffie-Hellman Group 2 (MODP-1024) Negotiated</span>
<span className="px-space-xs py-space-2xs rounded bg-surface-container-highest text-outline font-code-sm text-code-sm font-mono">IKEv2 SA_INIT</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">Transform ID 2 selected in Phase 1 exchange. Known discrete logarithm weakness permits adversary precomputation and retrospective key recovery.</p>
</div>
</div>
<div className="flex items-center gap-space-md shrink-0">
<div className="flex flex-col text-right font-code-sm text-code-sm">
<span className="text-on-surface font-medium">RFC 8247 §2.4</span>
<span className="text-error flex items-center justify-end gap-space-2xs"><span className="material-symbols-outlined text-[12px]">warning</span><span>DEPRECATED</span></span>
</div>
<button className="px-space-sm py-space-xs bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-code-sm text-code-sm flex items-center gap-space-2xs focus:outline-none" type="button" onClick={() => switchReportTab('tech')}>
<span>Inspect Evidence</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
{/* Violation 2 */}
<div className="bg-surface-container-low p-space-md rounded flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex items-start gap-space-md">
<span className="px-space-xs py-space-2xs rounded bg-error-container text-error font-label-sm text-label-sm font-bold uppercase mt-space-2xs inline-flex items-center gap-space-2xs shrink-0"><span className="material-symbols-outlined text-[14px]">report</span><span>CRITICAL</span></span>
<div className="flex flex-col">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Perfect Forward Secrecy (PFS) Disabled for Child SA Rekeying</span>
<span className="px-space-xs py-space-2xs rounded bg-surface-container-highest text-outline font-code-sm text-code-sm font-mono">ESP IPsec</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">CREATE_CHILD_SA payloads omit secondary DH transforms. Key leakage of the initial IKE SA cascades into retroactive decodability of subsequent ESP tunnels.</p>
</div>
</div>
<div className="flex items-center gap-space-md shrink-0">
<div className="flex flex-col text-right font-code-sm text-code-sm">
<span className="text-on-surface font-medium">RFC 7296 §1.3.1</span>
<span className="text-error flex items-center justify-end gap-space-2xs"><span className="material-symbols-outlined text-[12px]">lock_open</span><span>PFS: NONE</span></span>
</div>
<button className="px-space-sm py-space-xs bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-code-sm text-code-sm flex items-center gap-space-2xs focus:outline-none" type="button" onClick={() => switchReportTab('tech')}>
<span>Inspect Evidence</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
{/* Violation 3 */}
<div className="bg-surface-container-low p-space-md rounded flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex items-start gap-space-md">
<span className="px-space-xs py-space-2xs rounded bg-surface-bright text-on-surface font-label-sm text-label-sm font-bold uppercase mt-space-2xs inline-flex items-center gap-space-2xs shrink-0"><span className="material-symbols-outlined text-[14px]">warning</span><span>HIGH RISK</span></span>
<div className="flex flex-col">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Upstream Egress Burst &amp; Payload Asymmetry</span>
<span className="px-space-xs py-space-2xs rounded bg-surface-container-highest text-outline font-code-sm text-code-sm font-mono">Traffic Flow</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">Isolation Forest flagged an unexpected 142 Mbps spike (+0.48 SHAP asymmetry) during session interval T+02:15 to T+02:49, characteristic of bulk exfiltration.</p>
</div>
</div>
<div className="flex items-center gap-space-md shrink-0">
<div className="flex flex-col text-right font-code-sm text-code-sm">
<span className="text-on-surface font-medium">SHAP Vector</span>
<span className="text-tertiary flex items-center justify-end gap-space-2xs"><span className="material-symbols-outlined text-[12px]">insights</span><span>SCORE: 0.91</span></span>
</div>
<button className="px-space-sm py-space-xs bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-code-sm text-code-sm flex items-center gap-space-2xs focus:outline-none" type="button" onClick={() => switchReportTab('tech')}>
<span>Inspect Evidence</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
{/* Business Risk & Financial Impact Translation */}
<div className="bg-surface-container p-space-lg rounded flex flex-col gap-space-md">
<div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm font-semibold">
<span className="material-symbols-outlined text-[18px]">business_center</span>
<span>Business Risk &amp; Financial Impact Assessment</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Retrospective Traffic Exposure</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Store-Now, Decrypt-Later</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs leading-relaxed">
        Upstream wiretapping allows permanent payload harvesting. If DH keys are computed retroactively, all enterprise intellectual property is decrypted without active intrusion.
      </p>
</div>
<div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Regulatory Non-Compliance</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Fine Risk &amp; Audit Suspension</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs leading-relaxed">
        Fails NIST SP 800-77r1, CNSA 1.0, and PCI-DSS 4.0 Requirement 4.1. Triggers mandatory compliance escalation and potential operational suspension of payment gateways.
      </p>
</div>
<div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Interception &amp; Tunnel Hijacking</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Man-In-The-Middle (MitM)</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs leading-relaxed">
        CBC oracle exploitation and deterministic weak-group state allows sophisticated actors on intermediate transit nodes to inject plaintext commands into perimeter networks.
      </p>
</div>
</div>
</div>
{/* Prioritized Actions Matrix */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[18px]">build_circle</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Prioritized Remediation Roadmap</h3>
</div>
<div className="overflow-x-auto rounded bg-surface-container-low">
<table className="w-full text-left font-body-sm text-body-sm">
<thead className="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-outline">
<tr>
<th className="py-space-xs px-space-md">Priority</th>
<th className="py-space-xs px-space-md">Remediation Action</th>
<th className="py-space-xs px-space-md">Target Config</th>
<th className="py-space-xs px-space-md">Target SLA</th>
<th className="py-space-xs px-space-md">Impact</th>
</tr>
</thead>
<tbody className="divide-y-0">
<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-space-sm px-space-md"><span className="px-space-xs py-space-2xs rounded bg-error-container text-error font-label-sm text-label-sm font-bold inline-flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[14px]">priority_high</span><span>P1 - IMMEDIATE</span></span></td>
<td className="py-space-sm px-space-md font-semibold text-on-surface">Upgrade DH Group to Group 14 (MODP-2048) or Group 19 (ECP-256)</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-primary font-mono">ike=aes256gcm16-prfsha384-ecp384!</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-error font-bold flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[12px]">schedule</span><span>&lt; 24 Hours</span></td>
<td className="py-space-sm px-space-md text-tertiary flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[14px]">check_circle</span><span>Closes DH Logjam Attack Vector</span></td>
</tr>
<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-space-sm px-space-md"><span className="px-space-xs py-space-2xs rounded bg-error-container text-error font-label-sm text-label-sm font-bold inline-flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[14px]">priority_high</span><span>P1 - CRITICAL</span></span></td>
<td className="py-space-sm px-space-md font-semibold text-on-surface">Enforce PFS (Perfect Forward Secrecy) on ESP Child SA Rekeying</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-primary font-mono">esp=aes256gcm16-ecp384!</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-error font-bold flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[12px]">schedule</span><span>&lt; 48 Hours</span></td>
<td className="py-space-sm px-space-md text-tertiary flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[14px]">check_circle</span><span>Prevents Cascading Decryption</span></td>
</tr>
<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-space-sm px-space-md"><span className="px-space-xs py-space-2xs rounded bg-surface-bright text-on-surface font-label-sm text-label-sm font-bold inline-flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[14px]">build</span><span>P2 - REQUIRED</span></span></td>
<td className="py-space-sm px-space-md font-semibold text-on-surface">Migrate from CBC mode to AEAD (AES-256-GCM or ChaCha20-Poly1305)</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-primary font-mono">ipsec.secrets &amp; strongswan.d</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[12px]">event</span><span>Next Sprint (7 Days)</span></td>
<td className="py-space-sm px-space-md text-tertiary flex items-center gap-space-2xs"><span className="material-symbols-outlined text-[14px]">check_circle</span><span>Attains NIST 800-77r1 Compliance</span></td>
</tr>
</tbody>
</table>
</div>
</div></div>
{/* ======================================================== */}
{/* VIEW 2: DEEP TECHNICAL AUDIT CANVAS (FORENSIC DETAIL)    */}
{/* ======================================================== */}
<div className={reportTab === "tech" ? "p-space-xl flex flex-col gap-space-xl border-l-2 border-primary/50" : "hidden p-space-xl flex flex-col gap-space-xl"} id="report-view-tech">
{/* Technical Document Metadata Banner */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-lg bg-surface-container-low p-space-base rounded">
<div className="flex flex-col gap-space-2xs">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Forensic Cryptanalysis Specification</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Deep Technical Audit &amp; Packet Dissection Dossier</h2>
<div className="flex items-center gap-space-base flex-wrap text-on-surface-variant font-code-sm text-code-sm mt-space-2xs">
<span className="">CAPTURE HASH: <span className="text-on-surface font-mono">sha256:d8a0ef93c4...44b1c8e0</span></span>
<span className="">PACKETS: <span className="text-on-surface">842,914 pkts</span></span>
<span className="">VOLUME: <span className="text-on-surface">614.2 MB (4m 12s)</span></span>
</div>
</div>
<div className="flex items-center gap-space-sm self-start lg:self-center">
<button className="px-space-md py-space-xs bg-primary-container text-on-primary-container hover:bg-tertiary-container font-headline-sm text-headline-sm rounded flex items-center gap-space-xs transition-colors" type="button" onClick={() => downloadExec("tunnelsight-forensic-spec.json")}>
<span className="material-symbols-outlined text-[16px]">file_download</span>
<span className="">Export Full JSON Forensic Spec</span>
</button>
<button className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm rounded flex items-center gap-space-xs transition-colors" type="button" onClick={disasmPayload}>
<span className="material-symbols-outlined text-[16px]">code</span>
<span className="">Disasm Payload</span>
</button>
</div>
</div>
{/* Two-Pane Technical Deep Dive */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-base">
{/* Left Col: IKEv2 Protocol Analysis & Hex Offsets */}
<div className="lg:col-span-6 flex flex-col gap-space-base">
<div className="bg-surface-container p-space-base rounded flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">key</span>
<span className="">IKEv2 Protocol Handshake &amp; SA Proposals</span>
</span>
<span className="font-code-sm text-code-sm text-outline">Port 500 / 4500 (NAT-T)</span>
</div>
<div className="bg-surface-container-low p-space-sm rounded font-code-sm text-code-sm flex flex-col gap-space-xs">
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Exchange Type:</span>
<span className="text-on-surface font-semibold">IKE_SA_INIT (Packet #42)</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Initiator SPI:</span>
<span className="text-primary font-mono">0x41f89c02d981aa44</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Responder SPI:</span>
<span className="text-primary font-mono">0x9a021da3b578cf10</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Selected SA Transform:</span>
<span className="text-error font-mono">ENCR_AES_CBC (128) | AUTH_HMAC_SHA1_96 | DH_GROUP_2</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Deterministic RFC Citation:</span>
<span className="text-on-surface font-mono">RFC 8247 §2.4 (Status: NOT RECOMMENDED)</span>
</div>
</div>
{/* Collapsible Hex Inspector Section */}
<div className="flex flex-col gap-space-xs mt-space-2xs">
<button className="flex items-center justify-between px-space-sm py-space-xs bg-surface-container-high rounded text-on-surface-variant hover:text-on-surface font-code-sm text-code-sm transition-colors" type="button" onClick={toggleHexInspect}>
<span className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[14px]">terminal</span>
<span className="">Raw Packet Hex &amp; Dissection (Packet #42, Offset 0x0020 - 0x0050)</span>
</span>
<span className="text-primary">Toggle Bytes</span>
</button>
<div className={`bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm overflow-x-auto text-outline${hexVisible ? "" : " hidden"}`} id="hex-block-1">
<div className="flex gap-space-md">
<span className="text-outline-variant select-none">0020</span>
<span className="text-on-surface-variant">41 f8 9c 02 d9 81 aa 44  9a 02 1d a3 b5 78 cf 10</span>
<span className="text-primary select-none">|A......D.....x..|</span>
</div>
<div className="flex gap-space-md">
<span className="text-outline-variant select-none">0030</span>
<span className="text-on-surface-variant">21 20 22 08 00 00 00 00  00 00 01 24 22 00 00 30</span>
<span className="text-primary select-none">|! "........$"..0|</span>
</div>
<div className="flex gap-space-md bg-secondary-container rounded px-space-2xs">
<span className="text-outline select-none">0040</span>
<span className="text-error font-semibold">00 00 00 2c 01 01 00 04  03 00 00 08 01 00 00 80</span>
<span className="text-error select-none">|...,............|</span>
</div>
<div className="flex gap-space-md">
<span className="text-outline-variant select-none">0050</span>
<span className="text-on-surface-variant">03 00 00 08 02 00 00 02  00 00 00 08 04 00 00 02</span>
<span className="text-tertiary select-none">|........DH_GRP2.|</span>
</div>
<div className="text-[10px] text-tertiary mt-space-xs select-none">
                    [CONFIRMED: Byte 0x0057 value 0x02 directly asserts DH Group 2 MODP-1024 negotiation]
                  </div>
</div>
</div>
</div>
{/* ESP & SA Anti-Replay Telemetry */}
<div className="bg-surface-container p-space-base rounded flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span className="material-symbols-outlined text-tertiary text-[18px]">security_update_good</span>
<span className="">ESP &amp; Security Association Integrity</span>
</span>
<span className="font-code-sm text-code-sm text-tertiary">VALIDATED</span>
</div>
<div className="grid grid-cols-2 gap-space-sm">
<div className="bg-surface-container-low p-space-sm rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase">Anti-Replay Window</span>
<span className="font-code-md text-code-md text-on-surface mt-space-2xs font-semibold">64 Packets</span>
<span className="font-code-sm text-code-sm text-tertiary">0 Sequence Drops Detected</span>
</div>
<div className="bg-surface-container-low p-space-sm rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase">Seq Rollover Risk</span>
<span className="font-code-md text-code-md text-on-surface mt-space-2xs font-semibold">842,914 / 2^32</span>
<span className="font-code-sm text-code-sm text-outline">&lt; 0.02% Utilization</span>
</div>
</div>
<div className="bg-surface-container-low p-space-sm rounded flex flex-col gap-space-2xs font-code-sm text-code-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant">Ingress SPI:</span>
<span className="text-on-surface font-mono">0x41f89c02 (Active)</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Egress SPI:</span>
<span className="text-on-surface font-mono">0x9a021da3 (Active)</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Integrity Algorithm:</span>
<span className="text-error font-mono">AUTH_HMAC_SHA1_96 (Truncated 12-byte ICV)</span>
</div>
</div>
</div>
</div>
{/* Right Col: ML Classification & Anomaly Detection */}
<div className="lg:col-span-6 flex flex-col gap-space-base">
{/* Inferred ML Traffic Classification */}
<div className="bg-surface-container p-space-base rounded flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
<span className="">Inferred Traffic Classification (Zero-Decryption ML)</span>
</span>
<span className="px-space-xs py-space-2xs rounded bg-surface-container-highest text-tertiary font-code-sm text-code-sm">94.2% Confidence</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Synthesized via bidirectional inter-packet arrival time (IAT) variances, packet length distributions, and burst burstiness models without breaking payload encryption.
              </p>
{/* Category breakdown progress bars */}
<div className="flex flex-col gap-space-sm mt-space-2xs">
<div>
<div className="flex justify-between font-code-sm text-code-sm mb-space-2xs">
<span className="text-on-surface">Video Streaming (H.264/DASH profile)</span>
<span className="text-primary font-bold">83.4%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded">
<div className="bg-primary h-1.5 rounded w-[83.4%]"></div>
</div>
</div>
<div>
<div className="flex justify-between font-code-sm text-code-sm mb-space-2xs">
<span className="text-on-surface">Encrypted Web Traffic (TLS over ESP)</span>
<span className="text-on-surface-variant font-bold">10.2%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded">
<div className="bg-on-surface-variant h-1.5 rounded w-[10.2%]"></div>
</div>
</div>
<div>
<div className="flex justify-between font-code-sm text-code-sm mb-space-2xs">
<span className="text-on-surface">Interactive Real-Time Voice / VoIP (G.711 / Opus)</span>
<span className="text-on-surface-variant font-bold">4.1%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded">
<div className="bg-tertiary h-1.5 rounded w-[4.1%]"></div>
</div>
</div>
<div>
<div className="flex justify-between font-code-sm text-code-sm mb-space-2xs">
<span className="text-on-surface">Bulk File Transfer / Synced Backup</span>
<span className="text-outline font-bold">2.3%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded">
<div className="bg-outline h-1.5 rounded w-[2.3%]"></div>
</div>
</div>
</div>
</div>
{/* Anomaly Engine Results */}
<div className="bg-surface-container p-space-base rounded flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span className="material-symbols-outlined text-error text-[18px]">pulse_alert</span>
<span className="">Anomaly &amp; Exfiltration Detection</span>
</span>
<span className="px-space-xs py-space-2xs rounded bg-error-container text-error font-code-sm text-code-sm">ANOMALY SCORE: 0.91</span>
</div>
<div className="bg-surface-container-low p-space-sm rounded flex flex-col gap-space-xs">
<div className="flex justify-between items-center font-code-sm text-code-sm">
<span className="text-on-surface-variant">Isolation Forest Outlier Score:</span>
<span className="text-error font-bold">0.9142 (Threshold: 0.70)</span>
</div>
<div className="flex justify-between items-center font-code-sm text-code-sm">
<span className="text-on-surface-variant">Temporal Event Window:</span>
<span className="text-on-surface">T+02:15 to T+02:49 (34 seconds)</span>
</div>
<div className="flex justify-between items-center font-code-sm text-code-sm">
<span className="text-on-surface-variant">Burst Rate Anomaly:</span>
<span className="text-error font-semibold">4.8x baseline volume (142 Mbps spike)</span>
</div>
<div className="flex justify-between items-center font-code-sm text-code-sm">
<span className="text-on-surface-variant">SHAP Primary Vector:</span>
<span className="text-primary">Egress-to-Ingress Payload Asymmetry (+0.48)</span>
</div>
</div>
{/* Confidence & Provenance Breakdown */}
<div className="flex items-center justify-between pt-space-xs text-outline font-code-sm text-code-sm">
<span className="">Deterministic Assertions: <strong className="text-tertiary">100%</strong></span>
<span className="">ML Model Inference: <strong className="text-on-surface">v2.1-RandomForest+SVM</strong></span>
</div>
</div>
</div>
</div>
</div>
{/* Document Sheet Footer */}
<div className="w-full bg-surface-container-low px-space-base py-space-sm flex items-center justify-between text-outline font-code-sm text-code-sm border-t-0">
<div className="flex items-center gap-space-sm">
<span className="">TunnelSight Engine v2.4.1</span>
<span className="">•</span>
<span className="">FIPS 140-3 Validation Pipeline: Pass (Report Mode)</span>
</div>
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span className="">End of Forensic Report Container</span>
<span className="material-symbols-outlined text-[14px]">lock</span>
</div>
</div>
</div>
{/* ======================================================== */}
{/* BOTTOM SECTION: REPORT ARCHIVE & DOCUMENT REPOSITORY     */}
{/* ======================================================== */}
<div className="flex flex-col gap-space-md mt-space-sm"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
<h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Forensic Document Repository &amp; Historical Audits</h2>
<span className="px-space-xs py-space-2xs rounded bg-surface-container text-outline font-code-sm text-code-sm">4 Active Records</span>
</div>
<div className="flex items-center gap-space-sm">
<div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded">
<span className="material-symbols-outlined text-outline text-[16px]">filter_list</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Filter by Source: weak-vpn-07.pcap</span>
</div>
<button className="px-space-sm py-space-2xs bg-surface-container-low hover:bg-surface-container text-on-surface font-code-sm text-code-sm rounded flex items-center gap-space-2xs transition-colors" type="button" onClick={refreshArchive}>
<span className="material-symbols-outlined text-[14px]">refresh</span>
<span>Refresh Archive</span>
</button>
</div>
</div>
{/* Tabular Document Repository with required columns */}
<div className="w-full bg-surface-container-lowest rounded overflow-x-auto shadow-sm min-w-0">
<table className="w-full text-left font-body-sm text-body-sm">
<thead className="bg-surface-container-high font-label-sm text-label-sm uppercase tracking-wider text-outline select-none">
<tr>
<th className="py-space-sm px-space-md">Document Title</th>
<th className="py-space-sm px-space-md">Format</th>
<th className="py-space-sm px-space-md">Generated Timestamp</th>
<th className="py-space-sm px-space-md">Size</th>
<th className="py-space-sm px-space-md">Status</th>
<th className="py-space-sm px-space-md text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y-0">
{/* Row 1 */}
<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[16px]">article</span>
<div className="flex flex-col">
<span className="font-code-md text-code-md text-on-surface font-semibold">RPT-2024-0518-EXEC-01</span>
<span className="font-code-sm text-code-sm text-outline">Executive Posture Briefing</span>
</div>
</div>
</td>
<td className="py-space-sm px-space-md"><span className="px-space-xs py-space-2xs rounded bg-surface-container text-on-surface font-code-sm text-code-sm font-mono">PDF / Signed</span></td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface-variant font-mono">2024-05-18 14:28:19 UTC</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface font-mono">1.4 MB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-space-2xs rounded bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-semibold inline-flex items-center gap-space-2xs">
<span className="material-symbols-outlined text-[12px]">verified</span>
<span>SIGNED &amp; READY</span>
</span>
</td>
<td className="py-space-sm px-space-md text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-space-2xs bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-code-sm text-code-sm inline-flex items-center gap-space-2xs focus:outline-none" title="Download Document" type="button" onClick={() => downloadExec("tunnelsight-executive-report.json")}>
<span className="material-symbols-outlined text-[14px]">download</span>
<span>Download</span>
</button>
<button className="p-space-2xs hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors focus:outline-none" title="Inspect Document Content" type="button" onClick={inspectDoc}>
<span className="material-symbols-outlined text-[16px]">visibility</span>
</button>
</div>
</td>
</tr>
{/* Row 2 */}
<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[16px]">terminal</span>
<div className="flex flex-col">
<span className="font-code-md text-code-md text-on-surface font-semibold">RPT-2024-0518-TECH-FULL</span>
<span className="font-code-sm text-code-sm text-outline">Deep Cryptographic Spec &amp; Hex Trace</span>
</div>
</div>
</td>
<td className="py-space-sm px-space-md"><span className="px-space-xs py-space-2xs rounded bg-surface-container text-on-surface font-code-sm text-code-sm font-mono">JSON / Forensic Spec</span></td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface-variant font-mono">2024-05-18 14:30:02 UTC</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface font-mono">8.6 MB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-space-2xs rounded bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-semibold inline-flex items-center gap-space-2xs">
<span className="material-symbols-outlined text-[12px]">check_circle</span>
<span>READY</span>
</span>
</td>
<td className="py-space-sm px-space-md text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-space-2xs bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-code-sm text-code-sm inline-flex items-center gap-space-2xs focus:outline-none" title="Download Document" type="button" onClick={() => downloadExec("tunnelsight-executive-report.json")}>
<span className="material-symbols-outlined text-[14px]">download</span>
<span>Download</span>
</button>
<button className="p-space-2xs hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors focus:outline-none" title="Inspect Document Content" type="button" onClick={inspectDoc}>
<span className="material-symbols-outlined text-[16px]">visibility</span>
</button>
</div>
</td>
</tr>
{/* Row 3 */}
<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-outline text-[16px]">fact_check</span>
<div className="flex flex-col">
<span className="font-code-md text-code-md text-on-surface font-semibold">RPT-2024-0517-NIST-AUDIT</span>
<span className="font-code-sm text-code-sm text-outline">NIST SP 800-77r1 Compliance Sheet</span>
</div>
</div>
</td>
<td className="py-space-sm px-space-md"><span className="px-space-xs py-space-2xs rounded bg-surface-container text-on-surface font-code-sm text-code-sm font-mono">CSV / Table</span></td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface-variant font-mono">2024-05-17 09:14:55 UTC</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface font-mono">340 KB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-space-2xs rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold inline-flex items-center gap-space-2xs">
<span className="material-symbols-outlined text-[12px]">inventory_2</span>
<span>ARCHIVED</span>
</span>
</td>
<td className="py-space-sm px-space-md text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-space-2xs bg-surface-container-highest hover:bg-surface-bright text-on-surface rounded font-code-sm text-code-sm inline-flex items-center gap-space-2xs focus:outline-none" title="Download Document" type="button" onClick={() => downloadExec("tunnelsight-nist-audit.json")}>
<span className="material-symbols-outlined text-[14px]">download</span>
<span>Download</span>
</button>
<button className="p-space-2xs hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors focus:outline-none" title="Inspect Document Content" type="button" onClick={inspectDoc}>
<span className="material-symbols-outlined text-[16px]">visibility</span>
</button>
</div>
</td>
</tr>
{/* Row 4 */}
<tr className="bg-surface-container-low hover:bg-surface-container transition-colors">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[16px]">sync</span>
<div className="flex flex-col">
<span className="font-code-md text-code-md text-on-surface font-semibold">RPT-2024-0518-SHAP-VEC</span>
<span className="font-code-sm text-code-sm text-outline">Zero-Decryption ML Feature Vectors</span>
</div>
</div>
</td>
<td className="py-space-sm px-space-md"><span className="px-space-xs py-space-2xs rounded bg-surface-container text-on-surface font-code-sm text-code-sm font-mono">JSON / Vectors</span></td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface-variant font-mono">2024-05-18 14:31:40 UTC</td>
<td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface font-mono">2.1 MB</td>
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="px-space-xs py-space-2xs rounded bg-secondary-container text-primary font-label-sm text-label-sm font-semibold inline-flex items-center gap-space-2xs">
<span className="material-symbols-outlined text-[12px]">progress_activity</span>
<span>READY</span>
</span>
</div>
</td>
<td className="py-space-sm px-space-md text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-space-2xs bg-surface-container-highest hover:bg-surface-bright text-primary rounded font-code-sm text-code-sm inline-flex items-center gap-space-2xs focus:outline-none" title="Download Document" type="button" onClick={() => downloadExec("tunnelsight-executive-report.json")}>
<span className="material-symbols-outlined text-[14px]">download</span>
<span>Download</span>
</button>
<button className="p-space-2xs hover:bg-surface-container-highest text-on-surface-variant rounded transition-colors focus:outline-none" title="Inspect Document Content" type="button" onClick={inspectDoc}>
<span className="material-symbols-outlined text-[16px]">visibility</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div></div>
</div>
</AppShell>

    </div>
  );
}
