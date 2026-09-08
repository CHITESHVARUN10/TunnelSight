"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";

const CAPTURE_SHA256 = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

export default function CaptureDrawerPage() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const closeDrawer = () => setDrawerOpen(false);
  const router = useRouter();
  const toast = useToast();
  const openFullAnalysis = () => router.push("/analysis/results");
  const generateReport = () => {
    downloadFile("branch-emea-gw04-report.json", executiveReportJSON(), "application/json");
    toast({ title: "Report generated", body: "branch-emea-gw04-report.json downloaded.", kind: "ok" });
  };
  const compareCaptures = () => toast({ title: "Compare staged", body: "Capture comparison queued (mock).", kind: "info" });
  const showHashModal = () => {
    navigator.clipboard?.writeText(CAPTURE_SHA256);
    toast({ title: "SHA-256 copied", body: CAPTURE_SHA256, kind: "ok" });
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<AppShell active="" innerClassName="flex flex-col w-full relative overflow-hidden" innerStyle={{minHeight: 'calc(100vh - 2.75rem)'}}>

{/* Background Workspace (Audit History / Captures Log) */}
<div className="w-full px-space-xl py-space-lg flex flex-col gap-space-lg select-none opacity-40 pointer-events-none transition-opacity duration-300">
{/* Breadcrumb & Workspace Title */}
<div className="flex items-center justify-between">
<div className="flex flex-col gap-space-2xs">
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
<span>Ingress Tunnels</span>
<span>/</span>
<span className="text-on-surface-variant">EMEA Operational Edge</span>
<span>/</span>
<span className="text-primary">Captures</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface">PCAP Analysis Pipeline</div>
</div>
<div className="flex items-center gap-space-sm">
<div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded text-on-surface-variant font-code-sm text-code-sm">
<span className="material-symbols-outlined text-[16px]">filter_list</span>
<span>Filtered: Status = All (48 Captures)</span>
</div>
<div className="bg-primary-container text-on-primary-container px-space-md py-space-xs rounded font-headline-sm text-headline-sm flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px]">upload_file</span>
<span>Ingest PCAP</span>
</div>
</div>
</div>
{/* Telemetry Cards Row (Backdrop content) */}
<div className="grid grid-cols-4 gap-space-md">
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Captures Processed (24h)</span>
<span className="font-display text-display text-on-surface">1,402</span>
<span className="font-code-sm text-code-sm text-tertiary">↑ 14.2% vs previous run</span>
</div>
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline">High Risk Violations</span>
<span className="font-display text-display text-error">38</span>
<span className="font-code-sm text-code-sm text-error">Critical cipher suite drift</span>
</div>
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline">PFS Compliance Rate</span>
<span className="font-display text-display text-on-surface">91.4%</span>
<span className="font-code-sm text-code-sm text-outline">Target threshold: 99.0%</span>
</div>
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Aggregate Throughput</span>
<span className="font-display text-display text-primary">84.2 GB</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Across 162 active child SAs</span>
</div>
</div>
{/* Table Shell for realism behind the drawer */}
<div className="bg-surface-container-low rounded overflow-hidden flex flex-col">
<div className="bg-surface-container-high px-space-md py-space-xs flex items-center justify-between font-label-sm text-label-sm text-outline uppercase tracking-wider">
<div className="w-1/4">Capture Artifact</div>
<div className="w-1/6">Protocol Suite</div>
<div className="w-1/6">Posture Index</div>
<div className="w-1/6">Payload Volume</div>
<div className="w-1/6 text-right">Analyzed</div>
</div>
<div className="divide-y divide-surface-container">
<div className="px-space-md py-space-sm flex items-center justify-between font-code-sm text-code-sm bg-surface-container-highest/60 text-on-surface">
<div className="w-1/4 flex items-center gap-space-xs text-primary font-medium">
<span className="material-symbols-outlined text-[16px]">folder_zip</span>
<span>branch-emea-gw04.pcap</span>
</div>
<div className="w-1/6 text-on-surface-variant">IKEv2 / ESP (AES-CBC)</div>
<div className="w-1/6 text-error font-medium">61/100 · High Risk</div>
<div className="w-1/6 text-on-surface-variant">4.82 GB</div>
<div className="w-1/6 text-right text-outline">11:42:08 UTC</div>
</div>
<div className="px-space-md py-space-sm flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
<div className="w-1/4 flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px]">folder_zip</span>
<span>core-transit-chi01.pcap</span>
</div>
<div className="w-1/6">IKEv2 / ESP (GCM-256)</div>
<div className="w-1/6 text-tertiary">98/100 · Optimal</div>
<div className="w-1/6">22.4 GB</div>
<div className="w-1/6 text-right text-outline">10:15:32 UTC</div>
</div>
<div className="px-space-md py-space-sm flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
<div className="w-1/4 flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px]">folder_zip</span>
<span>gateway-tokyo-primary.pcap</span>
</div>
<div className="w-1/6">IKEv2 / ESP (GCM-128)</div>
<div className="w-1/6 text-tertiary">94/100 · Secure</div>
<div className="w-1/6">9.15 GB</div>
<div className="w-1/6 text-right text-outline">09:58:11 UTC</div>
</div>
<div className="px-space-md py-space-sm flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
<div className="w-1/4 flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px]">folder_zip</span>
<span>edge-sp-saopaulo.pcap</span>
</div>
<div className="w-1/6">IKEv1 / 3DES (Deprecated)</div>
<div className="w-1/6 text-error">32/100 · Critical</div>
<div className="w-1/6">1.20 GB</div>
<div className="w-1/6 text-right text-outline">08:24:45 UTC</div>
</div>
</div>
</div>
</div>
{/* Dimmed Ambient Backdrop Filter */}
<div className={drawerOpen ? "absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-[2px] transition-opacity duration-200 z-40" : "absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-[2px] transition-opacity duration-200 z-40 opacity-0 pointer-events-none"} id="backdrop-scrim" onClick={closeDrawer}></div>
{/* SLIDE-OUT CAPTURE DETAIL DRAWER (STRICT FIDELITY) */}
<aside className={drawerOpen ? "absolute top-0 right-0 bottom-0 w-full max-w-[490px] bg-surface-container-lowest z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform translate-x-0" : "absolute top-0 right-0 bottom-0 w-full max-w-[490px] bg-surface-container-lowest z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform translate-x-full"} id="capture-drawer" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
{/* Scrollable Drawer Interior */}
<div className="flex-1 overflow-y-auto flex flex-col p-space-base gap-space-lg">
{/* 1. HEADER SECTION */}
<div className="flex flex-col gap-space-sm pb-space-md bg-surface-container-lowest">
{/* Top Row: Icon, File Identifier, PCAP badge & Dismiss Button */}
<div className="flex items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-primary text-[20px] shrink-0">draft</span>
<span className="font-code-md text-code-md text-on-surface font-semibold truncate tracking-tight">branch-emea-gw04.pcap</span>
<span className="bg-surface-container-high text-primary font-code-sm text-code-sm px-space-xs py-space-2xs rounded shrink-0 uppercase">PCAP</span>
</div>
<button className="p-space-2xs rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors shrink-0" title="Close drawer (Esc)" type="button" onClick={closeDrawer}>
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/* Ingestion / Timestamp Metadata */}
<div className="font-code-sm text-code-sm text-outline flex items-center gap-space-xs flex-wrap">
<span>Oct 24, 2025</span>
<span>·</span>
<span className="text-on-surface-variant font-medium">11:42:08 UTC</span>
<span>·</span>
<span>Ingested via <span className="text-on-surface-variant">edge-collector-04</span></span>
</div>
{/* Prominent Score & Risk Badge Card */}
<div className="mt-space-xs p-space-md rounded bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Security Score:</span>
<span className="font-headline-lg text-headline-lg font-bold text-on-surface">61</span>
<span className="font-code-sm text-code-sm text-outline">/ 100</span>
</div>
{/* High Risk Badge */}
<div className="flex items-center gap-space-2xs px-space-sm py-space-2xs rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold">
<span className="material-symbols-outlined text-[14px]">warning</span>
<span className="tracking-wide">HIGH RISK</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-space-2xs">
            Negotiated legacy cipher transform and ephemeral key exchange omitted during CHILD_SA rekey.
          </p>
</div>
</div>
{/* 2. SUMMARY SECTION (Key-Value Grid / Badges) */}
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-2xs">
<span>Session Parameters</span>
<span className="font-code-sm text-code-sm text-tertiary">Cryptographic Profile</span>
</div>
<div className="bg-surface-container-low rounded p-space-md grid grid-cols-2 gap-y-space-md gap-x-space-base">
{/* Protocol */}
<div className="flex flex-col gap-space-2xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Protocol</span>
<div className="flex items-center gap-space-xs">
<span className="font-code-sm text-code-sm text-on-surface font-medium">IKEv2</span>
<span className="font-label-sm text-label-sm px-space-2xs py-space-2xs rounded bg-surface-container text-on-surface-variant">RFC 7296</span>
</div>
</div>
{/* Mode */}
<div className="flex flex-col gap-space-2xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Encapsulation</span>
<span className="font-code-sm text-code-sm text-on-surface font-medium">Tunnel Mode (ESP)</span>
</div>
{/* Cipher Suite */}
<div className="flex flex-col gap-space-2xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Cipher Suite</span>
<span className="font-code-sm text-code-sm text-error font-medium">AES-128-CBC</span>
</div>
{/* PFS Badge (Highlighted Warning) */}
<div className="flex flex-col gap-space-2xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Forward Secrecy</span>
<div className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded self-start bg-error-container/40 text-error font-code-sm text-code-sm font-semibold">
<span className="material-symbols-outlined text-[12px]">gpp_bad</span>
<span>PFS Disabled</span>
</div>
</div>
{/* Replay Protection */}
<div className="flex flex-col gap-space-2xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Anti-Replay</span>
<span className="font-code-sm text-code-sm text-tertiary font-medium">Replay Enabled (64 pkt)</span>
</div>
{/* Endpoints */}
<div className="flex flex-col gap-space-2xs col-span-2 pt-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline">Tunnel Endpoints</span>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface bg-surface-container px-space-sm py-space-xs rounded">
<span className="material-symbols-outlined text-outline text-[14px]">router</span>
<span className="text-primary font-medium">198.51.100.24</span>
<span className="text-outline">⇄</span>
<span className="text-on-surface font-medium">203.0.113.88</span>
<span className="ml-auto font-label-sm text-label-sm text-outline">UDP 4500 (NAT-T)</span>
</div>
</div>
</div>
</div>
{/* 3. PRIORITY FINDINGS SECTION */}
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between px-space-2xs">
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Top Findings</span>
<span className="font-code-sm text-code-sm text-outline">(2)</span>
</div>
<span className="font-label-sm text-label-sm text-outline">Showing highest severity items</span>
</div>
<div className="flex flex-col gap-space-sm">
{/* Item 1 (P1 - High) */}
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs min-w-0">
<span className="px-space-xs py-space-2xs rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-bold tracking-tight">P1 HIGH</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">Perfect Forward Secrecy Disabled</span>
</div>
<span className="material-symbols-outlined text-error text-[18px]">report_problem</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              CHILD_SA rekeying negotiated without Diffie-Hellman group exchange in IKE_AUTH / CREATE_CHILD_SA.
            </p>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline pt-space-2xs">
<span className="text-error">RFC 8247 §2.3 Violation</span>
<span>·</span>
<span>Impact: Passive decryption of historical captures</span>
</div>
</div>
{/* Item 2 (P2 - Medium) */}
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs min-w-0">
<span className="px-space-xs py-space-2xs rounded bg-surface-container-high text-on-surface font-code-sm text-code-sm font-semibold tracking-tight">P2 MEDIUM</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">CBC-Mode Cipher Deployed</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">shield_with_heart</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              CBC cipher suites vulnerable to padding oracle attacks in untrusted transit networks. RFC 8247 recommends AEAD (AES-GCM).
            </p>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline pt-space-2xs">
<span className="text-on-surface-variant">Recommended: AES-256-GCM (Transform ID 20)</span>
</div>
</div>
</div>
</div>
{/* 4. TRAFFIC SUMMARY SECTION (Compact visual breakdown) */}
<div className="flex flex-col gap-space-xs pb-space-sm">
<div className="flex items-center justify-between px-space-2xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Traffic Distribution</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Classified by Flow Engine</span>
</div>
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-md">
{/* Horizontal Segmented Bar */}
<div className="w-full h-2.5 bg-surface-container-highest rounded flex overflow-hidden">
{/* Video: 72% (primary teal/cyan) */}
<div className="h-full bg-primary" style={{width: '72%'}} title="Video: 72%"></div>
{/* Web: 19% (slate/blue secondary-container) */}
<div className="h-full bg-secondary" style={{width: '19%'}} title="Web: 19%"></div>
{/* Other: 9% (muted gray outline-variant) */}
<div className="h-full bg-outline-variant" style={{width: '9%'}} title="Other: 9%"></div>
</div>
{/* Legend with Percentages */}
<div className="grid grid-cols-3 gap-space-xs text-center font-code-sm text-code-sm">
<div className="flex flex-col items-start gap-space-2xs">
<div className="flex items-center gap-space-2xs">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-on-surface font-medium">Video</span>
</div>
<span className="font-headline-sm text-headline-sm text-primary font-bold">72%</span>
<span className="font-label-sm text-label-sm text-outline">3.47 GB</span>
</div>
<div className="flex flex-col items-start gap-space-2xs">
<div className="flex items-center gap-space-2xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-on-surface font-medium">Web / HTTPS</span>
</div>
<span className="font-headline-sm text-headline-sm text-secondary font-bold">19%</span>
<span className="font-label-sm text-label-sm text-outline">915 MB</span>
</div>
<div className="flex flex-col items-start gap-space-2xs">
<div className="flex items-center gap-space-2xs">
<span className="w-2 h-2 rounded-full bg-outline-variant"></span>
<span className="text-on-surface font-medium">Other</span>
</div>
<span className="font-headline-sm text-headline-sm text-outline font-bold">9%</span>
<span className="font-label-sm text-label-sm text-outline">435 MB</span>
</div>
</div>
{/* Flow Volume Footnote */}
<div className="pt-space-xs font-code-sm text-code-sm text-on-surface-variant flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[14px] text-tertiary">analytics</span>
<span>4.82 GB observed across 18 ESP security associations</span>
</div>
</div>
</div>
</div>
{/* 5. ACTIONS SECTION (Pinned at Drawer Bottom) */}
<div className="p-space-base bg-surface-container-lowest flex flex-col gap-space-sm select-none">
{/* Primary Action */}
<button className="w-full bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm font-semibold py-space-xs px-space-md rounded flex items-center justify-center gap-space-xs shadow-md transition-all active:scale-[0.99]" type="button" onClick={openFullAnalysis}>
<span>Open Full Analysis</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
{/* Secondary Balanced Action Row */}
<div className="grid grid-cols-2 gap-space-sm">
<button className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm py-space-xs px-space-sm rounded flex items-center justify-center gap-space-xs transition-colors" type="button" onClick={generateReport}>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">description</span>
<span>Generate Report</span>
</button>
<button className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm py-space-xs px-space-sm rounded flex items-center justify-center gap-space-xs transition-colors" type="button" onClick={compareCaptures}>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">compare_arrows</span>
<span>Compare...</span>
</button>
</div>
{/* Subtle Helper Link for SHA-256 hash */}
<div className="flex items-center justify-center pt-space-2xs">
<button className="font-code-sm text-code-sm text-outline hover:text-primary transition-colors flex items-center gap-space-2xs" type="button" onClick={showHashModal}>
<span className="material-symbols-outlined text-[13px]">tag</span>
<span>Quick view raw capture hash (SHA-256)</span>
</button>
</div>
</div>
</aside>
{/* Interactive Script for dismiss / micro-interactions */}

</AppShell>
    </div>
  );
}
