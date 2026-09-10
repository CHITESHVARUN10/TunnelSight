"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON, findingsCSV } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";
import { useAnalysisBundle } from "@/components/analysis/useAnalysisBundle";
export default function AnalysisResultsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const toast = useToast();
  const { data, loading, error } = useAnalysisBundle(analysisId);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedFinding, setSelectedFinding] = useState("dh2");
  function toggleDrawer() {
    setDrawerOpen((o) => !o);
  }
  function selectFinding(id: string) {
    setSelectedFinding(id);
    setDrawerOpen(true);
  }
  if (!analysisId) {
    return (
      <div className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <AppShell active="">
          <div className="p-8 text-sm">No analysis selected. <Link className="underline" href="/analyze">Upload a capture</Link>.</div>
        </AppShell>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <AppShell active="">
          <div className="p-8 text-sm font-mono">Loading analysis…</div>
        </AppShell>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <AppShell active="">
          <div className="p-8 text-sm font-mono">Analysis unavailable: {error ?? "not found"}.</div>
        </AppShell>
      </div>
    );
  }
  const { analysis, findings, traffic } = data;
  const score = analysis.security_score ?? 47;
  const risk = analysis.risk_level ?? "HIGH";
  const crypto = analysis.config_json?.ipsec_config?.cryptography ?? {};
  const sa = analysis.config_json?.ipsec_config?.sa_config ?? {};
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<AppShell active="">

{/* Top Command & Ingestion Meta Header */}
<div className="w-full bg-surface-container-lowest px-space-xl py-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="flex flex-col gap-space-2xs min-w-0">
{/* Breadcrumb Hierarchy */}
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
<span className="hover:text-on-surface cursor-pointer">Captures</span>
<span>/</span>
<span className="text-primary font-medium">{analysis.filename}</span>
<span>/</span>
<span className="text-on-surface">Forensic Analysis Results</span>
</div>
{/* Ingestion Verification String */}
<div className="flex flex-wrap items-center gap-space-sm font-code-sm text-code-sm text-on-surface-variant mt-space-2xs">
<span className="inline-flex items-center gap-space-2xs">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          Ingested 14:18:22 UTC
        </span>
<span className="text-outline-variant">•</span>
<span>1.42 GB</span>
<span className="text-outline-variant">•</span>
<span>842,109 pkts</span>
<span className="text-outline-variant">•</span>
<span className="text-primary font-mono tracking-tight flex items-center gap-space-2xs">
<span className="material-symbols-outlined text-[13px] text-tertiary">verified_user</span>
          SHA-256: 8c3e...f49a
        </span>
</div>
</div>
{/* Global Actions Group */}
<div className="flex items-center gap-space-xs shrink-0">
<button className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button" onClick={() => { downloadFile(`${analysis.filename}-report.json`, JSON.stringify({ capture: analysis.filename, risk, security_score: score, traffic_label: analysis.traffic_label, traffic_confidence: analysis.traffic_confidence, anomaly_score: analysis.anomaly_score, findings: findings.findings }, null, 2)); toast({ title: "Report exported", body: `${analysis.filename}-report.json downloaded.`, kind: "ok" }); }}>
<span className="material-symbols-outlined text-[15px] text-primary">download</span>
        Export Report (STIX/PDF)
      </button>
<button className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button" onClick={() => { toast({ title: "Re-analysis queued", body: "Re-upload the capture to re-analyze.", kind: "info" }); router.push("/analyze"); }}>
<span className="material-symbols-outlined text-[15px]">autorenew</span>
        Re-analyze
      </button>
<button className="flex items-center gap-space-xs bg-primary-container px-space-sm py-space-xs rounded text-on-primary-container hover:bg-primary transition-colors font-label-md text-label-md font-semibold" type="button" onClick={() => router.push("/analysis/capture")}>
<span className="material-symbols-outlined text-[15px]">terminal</span>
        Inspect Packets
      </button>
</div>
</div>
{/* Level 1: Hero Executive Posture Assessment (Clean, High Contrast, Non-Card Spammed) */}
<div className="px-space-xl py-space-lg bg-surface-container-low">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
{/* Primary Posture Gauge & Metrics */}
<div className="lg:col-span-4 flex items-center gap-space-lg">
<div className="relative flex items-center justify-center shrink-0 w-24 h-24 bg-surface-container-lowest rounded-xl shadow-md">
<svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
<circle className="text-surface-container-highest fill-none" cx="36" cy="36" r="30" stroke="currentColor" strokeWidth="5"></circle>
<circle className="text-error fill-none transition-all duration-700 ease-out" cx="36" cy="36" r="30" stroke="currentColor" strokeDasharray="188.5" strokeDashoffset="99.9" strokeLinecap="round" strokeWidth="5"></circle>
</svg>
<div className="absolute flex flex-col items-center justify-center">
<span className="font-display-serif text-3xl text-on-surface font-semibold tracking-tight">{score}</span>
<span className="font-mono text-[10px] text-outline -mt-1">/ 100</span>
</div>
</div>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Risk Classification</span>
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold">{risk}</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface">Sub-optimal Cryptographic Margin</div>
<div className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-space-xs">
<span className="text-tertiary">91%</span>
<span>Packet Framing Evidence Coverage</span>
</div>
</div>
</div>
{/* Analytical Verdict Notice */}
<div className="lg:col-span-8 bg-surface-container-lowest p-space-md rounded-xl flex items-start gap-space-md shadow-sm">
<div className="w-8 h-8 rounded bg-error-container/30 flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px] text-error">gpp_maybe</span>
</div>
<div className="flex flex-col gap-space-2xs flex-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Primary Analytical Assessment</span>
<span className="font-code-sm text-code-sm text-outline">NIST SP 800-77r1 Audit Target</span>
</div>
<p className="font-body-md text-body-md text-on-surface leading-relaxed">
            Vulnerable to offline cryptanalysis and legacy key exchange downgrade. The capture exhibits single-proposal MODP-1024 without Ephemeral PFS across child exchanges, allowing retrospective bulk decryption if peer session state is acquired.
          </p>
</div>
</div>
</div>
</div>
{/* Main Multi-Pane Workbench Content (Level 1 Analysis + Drawer Ready) */}
<div className="px-space-xl py-space-lg flex flex-col xl:flex-row gap-space-lg">
{/* Wide Analytical Column (Left: Findings + Traffic ML) */}
<div className="flex-1 flex flex-col gap-space-lg min-w-0">
{/* Section: Key Security Findings */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="font-headline-md text-headline-md text-on-surface">Key Cryptographic Findings</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-surface-container-highest text-on-surface-variant">4 Assertions</span>
</div>
<div className="flex items-center gap-space-sm font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              [CONFIRMED] Protocol Dissection
            </span>
<span className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              [INFERRED] Flow ML
            </span>
</div>
</div>
{/* Dense, Structured Findings List */}
<div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
{/* Finding Item 1 (Active/Inspected) */}
<div className="p-space-md rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden group" id="finding-item-1" onClick={() => selectFinding('dh2')}>
{selectedFinding === 'dh2' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-start gap-space-md min-w-0">
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold shrink-0">HIGH</span>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Weak DH Group (MODP-1024 / Group 2 in IKE_SA proposal)</span>
<span className="font-label-sm text-label-sm px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-mono uppercase tracking-wide">[CONFIRMED]</span>
</div>
<p className="text-on-surface-variant truncate">IKE_SA_INIT frame payload negotiation offers Group 2 with known logjam vulnerability profile.</p>
</div>
</div>
<div className={`flex items-center gap-space-xs shrink-0 font-code-sm text-code-sm transition-transform ${selectedFinding === 'dh2' ? "text-primary group-hover:translate-x-0.5" : "text-on-surface-variant group-hover:text-primary"}`}>
<span>Inspect Evidence</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>
{/* Finding Item 2 */}
<div className="p-space-md rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden group" onClick={() => selectFinding('legacy-crypto')}>
{selectedFinding === 'legacy-crypto' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-start gap-space-md min-w-0">
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold shrink-0">HIGH</span>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Legacy Cryptographic Suite (AES-128-CBC + HMAC-SHA1)</span>
<span className="font-label-sm text-label-sm px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-mono uppercase tracking-wide">[CONFIRMED]</span>
</div>
<p className="text-on-surface-variant truncate">Strictly deprecated per NIST SP 800-77r1. Susceptible to padding oracle vector if unauthenticated CBC is permitted.</p>
</div>
</div>
<div className={`flex items-center gap-space-xs shrink-0 font-code-sm text-code-sm transition-colors ${selectedFinding === 'legacy-crypto' ? "text-primary group-hover:translate-x-0.5 transition-transform" : "text-on-surface-variant group-hover:text-primary"}`}>
<span>Inspect Evidence</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>
{/* Finding Item 3 */}
<div className="p-space-md rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden group" onClick={() => selectFinding('pfs-disabled')}>
{selectedFinding === 'pfs-disabled' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-start gap-space-md min-w-0">
<span className="px-space-xs py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-code-sm text-code-sm font-semibold shrink-0">MED</span>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Perfect Forward Secrecy (PFS) Disabled on Rekey</span>
<span className="font-label-sm text-label-sm px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-mono uppercase tracking-wide">[CONFIRMED]</span>
</div>
<p className="text-on-surface-variant truncate">CREATE_CHILD_SA omits ephemeral Key Exchange (KEi) payload. Rekeyed SAs derive directly from original SKEYSEED.</p>
</div>
</div>
<div className={`flex items-center gap-space-xs shrink-0 font-code-sm text-code-sm transition-colors ${selectedFinding === 'pfs-disabled' ? "text-primary group-hover:translate-x-0.5 transition-transform" : "text-on-surface-variant group-hover:text-primary"}`}>
<span>Remediation</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>
{/* Finding Item 4 */}
<div className="p-space-md rounded bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden" onClick={() => toast({ title: "Verified compliant", body: "Anti-replay window: 0 drops across 842,109 frames.", kind: "ok" })}>
<div className="flex items-start gap-space-md min-w-0">
<span className="px-space-xs py-0.5 rounded bg-tertiary/20 text-tertiary font-code-sm text-code-sm font-semibold shrink-0">PASS</span>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Anti-Replay Window Verification Monotonic</span>
<span className="font-label-sm text-label-sm px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-mono uppercase tracking-wide">[CONFIRMED]</span>
</div>
<p className="text-on-surface-variant truncate">ESP sequence counters sequentially linear. 0 window drop anomalies across 842,109 analyzed ESP frames.</p>
</div>
</div>
<div className="flex items-center gap-space-xs shrink-0 font-code-sm text-code-sm text-outline">
<span>Verified Compliant</span>
</div>
</div>
</div>
</div>
{/* Section: Encrypted Traffic Intelligence Snapshot (Level 1 Summary) */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-xs">
<span className="font-headline-md text-headline-md text-on-surface">Encrypted Flow Intelligence</span>
<span className="px-space-xs py-0.2 rounded font-label-sm text-label-sm bg-primary/10 text-primary font-mono uppercase">[INFERRED VIA ML]</span>
</div>
<span className="font-code-sm text-code-sm text-outline">Classified via packet timing &amp; payload entropy distributions</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center bg-surface-container-lowest p-space-md rounded">
{/* Category Proportion Bar */}
<div className="md:col-span-8 flex flex-col gap-space-xs">
<div className="flex items-center justify-between font-label-sm text-label-sm">
<span className="text-outline uppercase tracking-wider">Tunnel Payload Mix</span>
<span className="font-code-sm text-code-sm text-on-surface font-mono">1.42 GB Ingress/Egress</span>
</div>
{/* Segmented Progress Track */}
<div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
<div className="bg-primary h-full transition-all" style={{width: '78%'}} title="Video: 78%"></div>
<div className="bg-tertiary h-full transition-all" style={{width: '17%'}} title="Web: 17%"></div>
<div className="bg-secondary-container h-full transition-all" style={{width: '5%'}} title="Other: 5%"></div>
</div>
{/* Legend Indicators */}
<div className="flex flex-wrap items-center gap-space-md pt-space-2xs font-code-sm text-code-sm">
<div className="flex items-center gap-space-2xs">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-on-surface font-semibold">Video 78%</span>
<span className="text-outline">(H.264/RTP)</span>
</div>
<div className="flex items-center gap-space-2xs">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="text-on-surface font-semibold">Web 17%</span>
<span className="text-outline">(TLS over IPsec)</span>
</div>
<div className="flex items-center gap-space-2xs">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span className="text-on-surface font-semibold">Other 5%</span>
<span className="text-outline">(DNS/Signaling)</span>
</div>
</div>
</div>
{/* Entropy & Behavioral Anomaly Index */}
<div className="md:col-span-4 flex flex-col gap-space-2xs bg-surface-container-low p-space-sm rounded">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-outline">Anomaly Score</span>
<span className="px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-code-sm text-code-sm font-semibold">0.12 NORMAL</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface">Nominal ESP Dispersion</div>
<p className="font-code-sm text-code-sm text-on-surface-variant">No sequence desync or covert timing channels detected in ESP payload interval.</p>
</div>
</div>
<div className="flex items-center justify-end">
<a className="inline-flex items-center gap-space-xs font-code-sm text-code-sm text-primary hover:underline" href="#">
<span>View Complete Traffic Distribution &amp; Entropy Matrix</span>
<span className="material-symbols-outlined text-[15px]">open_in_new</span>
</a>
</div>
</div>
</div>
{/* Structured Protocol Architecture Matrix (Right Column, Level 1 Matrix) */}
<div className="w-full xl:w-96 flex flex-col gap-space-lg shrink-0">
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
<div className="flex items-center justify-between pb-space-2xs">
<div className="flex items-center gap-space-xs">
<span className="font-headline-md text-headline-md text-on-surface">Negotiated Stack</span>
<span className="font-label-sm text-label-sm px-space-xs py-0.2 rounded bg-tertiary/10 text-tertiary font-mono uppercase">[CONFIRMED]</span>
</div>
<span className="material-symbols-outlined text-[18px] text-outline">tune</span>
</div>
{/* Protocol Architecture Group */}
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Protocol Architecture</span>
<div className="bg-surface-container rounded p-space-sm flex flex-col gap-space-xs font-code-sm text-code-sm">
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">IPsec Operational</span>
<span className="text-tertiary font-semibold">YES</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">IKE Standard</span>
<span className="text-on-surface font-semibold">IKEv2 (RFC 7296)</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">Encapsulation</span>
<span className="text-on-surface">ESP (YES) • AH (NO)</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">Tunnel Mode</span>
<span className="text-on-surface">Tunnel (Outer IPv4)</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">NAT-Traversal</span>
<span className="text-primary">ACTIVE (UDP 4500)</span>
</div>
</div>
</div>
{/* Cryptographic Negotiation Group */}
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Negotiated Cryptography</span>
<div className="bg-surface-container rounded p-space-sm flex flex-col gap-space-xs font-code-sm text-code-sm">
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">Encryption</span>
<span className="text-on-surface font-semibold">AES-128-CBC</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">Integrity (ICV)</span>
<span className="text-on-surface">HMAC-SHA1-96</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">Key Exchange</span>
<span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-semibold">DH Group 2 (1024-bit)</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">Forward Secrecy</span>
<span className="text-error font-semibold">PFS DISABLED</span>
</div>
<div className="flex justify-between items-center py-0.5">
<span className="text-on-surface-variant">Peer Authentication</span>
<span className="text-on-surface">Pre-Shared Key (PSK)</span>
</div>
</div>
</div>
{/* Diagnostic Audit Context */}
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm flex items-center justify-between text-outline">
<span>Security Association (SA) Count:</span>
<span className="text-on-surface font-mono">1 IKE / 2 Child ESP</span>
</div>
</div>
</div>
</div>
{/* Interactive Forensic Deep-Dive Drawer (Progressive Disclosure - Level 2 / Level 3) */}
<div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-surface-container-low shadow-xl z-50 transform transition-transform duration-300 flex flex-col ${drawerOpen ? "translate-x-0" : "translate-x-full"}`} id="forensic-drawer">
{/* Drawer Header */}
<div className="h-header-height px-space-base bg-surface-container-lowest flex items-center justify-between shrink-0">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">biotech</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Forensic Dissection Inspector</span>
</div>
<button className="p-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button" onClick={toggleDrawer}>
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/* Drawer Body */}
<div className="flex-1 overflow-y-auto p-space-base flex flex-col gap-space-md">
{/* Target Finding Callout */}
<div className="bg-surface-container p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold">CRITICAL PROPOSAL</span>
<span className="font-code-sm text-code-sm text-tertiary">[CONFIRMED PROTOCOL FACT]</span>
</div>
<div className="font-headline-md text-headline-md text-on-surface">Weak Diffie-Hellman Group 2 in IKE_SA</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          The initiator negotiated Oakley Group 2 (1024-bit MODP) during the initial exchange. Discrete logarithm computations for 1024-bit primes are accessible to well-funded adversaries.
        </p>
</div>
{/* Dissected Packet Context */}
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Packet Dissection Frame Metadata</span>
<div className="bg-surface-container-lowest rounded p-space-sm flex flex-col gap-space-xs font-code-sm text-code-sm">
<div className="flex justify-between py-0.5">
<span className="text-outline">Target Frame</span>
<span className="text-primary font-mono font-semibold">Frame #142 (IKE_SA_INIT Request)</span>
</div>
<div className="flex justify-between py-0.5">
<span className="text-outline">Initiator SPI</span>
<span className="text-on-surface font-mono">0x8a91f3c401340b12</span>
</div>
<div className="flex justify-between py-0.5">
<span className="text-outline">Responder SPI</span>
<span className="text-on-surface font-mono">0x0000000000000000</span>
</div>
<div className="flex justify-between py-0.5">
<span className="text-outline">Byte Offset</span>
<span className="text-on-surface font-mono">0x0048 (Transform Substructure)</span>
</div>
<div className="flex justify-between py-0.5">
<span className="text-outline">Proposal ID</span>
<span className="text-on-surface font-mono">Proposal #1 (Protocol ID: 1 - IKE)</span>
</div>
</div>
</div>
{/* Dissected Transform Proposal Tree */}
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Dissected Transform Attributes</span>
<div className="bg-surface-container rounded p-space-sm flex flex-col gap-space-xs font-code-sm text-code-sm">
<div className="flex items-center justify-between text-on-surface-variant">
<span>• ENCR (Transform Type 1)</span>
<span className="text-on-surface">AES_CBC [Key Length: 128]</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant">
<span>• PRF (Transform Type 2)</span>
<span className="text-on-surface">PRF_HMAC_SHA1</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant">
<span>• INTEG (Transform Type 3)</span>
<span className="text-on-surface">AUTH_HMAC_SHA1_96</span>
</div>
<div className="flex items-center justify-between bg-error-container/20 p-space-2xs rounded text-on-surface font-semibold">
<span className="text-error">• D-H (Transform Type 4)</span>
<span className="text-error font-mono">Group 2 (1024-bit MODP)</span>
</div>
</div>
</div>
{/* Hex Dissection Snippet */}
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Raw Dissection Payload (Offset 0x0040)</span>
<span className="font-code-sm text-code-sm text-primary font-mono">Payload: Security Association (33)</span>
</div>
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm text-on-surface-variant leading-relaxed select-all overflow-x-auto">
<div className="text-outline">0040  00 00 00 28 01 01 04 03  03 00 00 08 01 00 00 80</div>
<div className="bg-primary/10 text-primary">0050  03 00 00 08 02 00 00 02  03 00 00 08 03 00 00 02</div>
<div className="text-outline">0060  00 00 00 08 04 00 00 02  00 00 00 88 00 00 00 00</div>
</div>
</div>
{/* Concrete Remediation Action Block */}
<div className="bg-surface-container-high p-space-md rounded flex flex-col gap-space-sm mt-space-xs">
<div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm">
<span className="material-symbols-outlined text-[18px]">verified</span>
<span>Prescribed Remediation</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">
          Reconfigure strongSwan / Cisco ASA / FortiOS proposal policy to mandate minimum DH Group 14 (MODP-2048) or prefer Curve25519 / DH Group 19 (ECDH-256). Disable legacy transform fallbacks in responder policy.
        </p>
<div className="bg-surface-container-lowest p-space-xs rounded font-code-sm text-code-sm text-on-surface-variant flex items-center justify-between gap-2">
  <div className="select-all overflow-x-auto">
    <span className="text-outline"># swanctl.conf / ipsec.conf:</span><br />
    <span className="text-tertiary">proposals = aes256gcm16-prfsha384-ecp256, aes256-sha256-modp2048</span>
  </div>
  <button
    type="button"
    className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary hover:text-on-surface text-[10px] font-mono shrink-0 transition-colors"
    onClick={() => {
      navigator.clipboard?.writeText("proposals = aes256gcm16-prfsha384-ecp256, aes256-sha256-modp2048");
      toast({ title: "Copied to Clipboard", body: "swanctl.conf proposal string copied.", kind: "ok" });
    }}
  >
    Copy Patch
  </button>
</div>
</div>
</div>
{/* Drawer Footer Actions */}
<div className="p-space-base bg-surface-container-lowest flex items-center justify-between shrink-0">
<button className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button" onClick={toggleDrawer}>
        Dismiss Inspector
      </button>
<button className="px-space-md py-space-xs rounded bg-primary-container hover:bg-primary text-on-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-space-xs" type="button" onClick={() => { downloadFile("pcap-slices.csv", findingsCSV(), "text/csv"); toast({ title: "PCAP slices exported", body: "pcap-slices.csv downloaded.", kind: "ok" }); }}>
<span className="material-symbols-outlined text-[15px]">file_download</span>
        Export PCAP Slices
      </button>
</div>
</div>
</AppShell>
    </div>
  );
}
