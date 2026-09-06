"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UploadBehavior } from "@/components/upload/UploadBehavior";
import { useToast } from "@/lib/mock/toast";

type DrawerCapture = { name: string; volume: string; packets: string; risk: string; sha: string; source: string; suite: string };

const DEFAULT_CAPTURE: DrawerCapture = {
  name: "core-dc-chicago-gw1.pcap",
  volume: "1.42 GB",
  packets: "842,109",
  risk: "HIGH",
  sha: "4f81a792e091bfa3c6781290bb34e91a784d12c82098b1a3c75d40192e5912a0",
  source: "Edge TAP (SPAN 04)",
  suite: "IKEv1 Aggressive / ESP 3DES-CBC",
};

export default function AnalyzePage() {
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [capture, setCapture] = useState<DrawerCapture>(DEFAULT_CAPTURE);
  const openPolicy = () => setPolicyOpen(true);
  const closePolicy = () => setPolicyOpen(false);
  const closeDrawer = () => setDrawerOpen(false);
  const openInspectRow = (e: React.MouseEvent) => {
    const d: DOMStringMap = ((e.currentTarget as HTMLElement).closest("tr") as HTMLElement | null)?.dataset ?? {};
    setCapture({
      name: d.name ?? DEFAULT_CAPTURE.name,
      volume: d.vol ?? DEFAULT_CAPTURE.volume,
      packets: d.packets ?? DEFAULT_CAPTURE.packets,
      risk: d.risk ?? DEFAULT_CAPTURE.risk,
      sha: d.sha ?? DEFAULT_CAPTURE.sha,
      source: d.source ?? DEFAULT_CAPTURE.source,
      suite: d.suite ?? DEFAULT_CAPTURE.suite,
    });
    setDrawerOpen(true);
  };
  const inspectConfig = (e: React.MouseEvent) => {
    const m = ((e.currentTarget as HTMLElement).closest("div")?.parentElement?.textContent ?? "").match(/MOD_\d{2}/);
    toast({ title: m?.[0] ?? "Module", body: "Module config is preset-managed (mock).", kind: "info" });
  };
  const refreshCaptures = () => toast({ title: "Captures refreshed", body: "5 records synchronized (mock).", kind: "info" });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setPolicyOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      <UploadBehavior />
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none border-r border-surface-container-high/40"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low border-b border-surface-container-high/40"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest border-t border-surface-container-high/40"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none border-b border-surface-container-high/40"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span>2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button data-action="search" className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button data-action="export" className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button data-action="notifications" className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full pb-space-2xl">
{/* Top Sub-Nav Telemetry Banner (Lightweight & Clean) */}
<div className="px-space-base py-space-xs bg-surface-container-low border-b border-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-xs font-code-sm text-code-sm">
<span className="text-outline">FORENSICS</span>
<span className="text-outline-variant">/</span>
<span className="text-primary font-medium">ANALYZE_PCAP</span>
<span className="ml-space-sm px-space-xs py-0.5 rounded bg-surface-container-highest font-label-sm text-label-sm uppercase tracking-wider text-tertiary">Ready</span>
</div>
<div className="flex items-center gap-space-md font-code-sm text-code-sm text-outline">
<span>RFC 7296 / RFC 4303 / SP 800-77r1</span>
<span className="text-outline-variant">•</span>
<span>DPDK Intake Buffer Active</span>
</div>
</div>
{/* Main Viewport Workspace with Generous Breathing Room */}
<div className="p-space-xl max-w-7xl w-full mx-auto flex flex-col gap-space-xl">
{/* Header Title & Quick Actions */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div>
<div className="flex items-center gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">Analyze Capture</h1>
<span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-surface-container-high text-on-surface-variant font-medium">SESSION #8820-A</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Forensic intake pipeline for cryptographic posture, replay detection, and encrypted traffic profiling.
        </p>
</div>
<div className="flex items-center gap-space-sm">
<button className="flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high px-space-md py-space-xs rounded text-on-surface transition-colors font-code-sm text-code-sm border border-outline-variant/30" id="load-sample-btn" type="button">
<span className="material-symbols-outlined text-[16px] text-primary">play_arrow</span>
<span>Load sample trace: site2site-ikev2-anomalous.pcapng</span>
</button>
</div>
</div>
{/* Primary Streamlined Upload Area */}
<div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-space-xl shadow-xl flex flex-col gap-space-md">
{/* Drop Target Terminal Box */}
<div className="border-2 border-dashed border-outline-variant/50 hover:border-primary/60 bg-surface-container-low hover:bg-surface-container rounded-lg p-space-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group" id="drop-zone">
<input accept=".pcap,.pcapng,.cap,.erf" className="hidden" id="pcap-file-input" type="file" />
<div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-on-primary transition-all shadow-inner">
<span className="material-symbols-outlined text-[30px]">upload_file</span>
</div>
<div className="mt-space-md flex flex-col items-center">
<div className="font-headline-md text-headline-md text-on-surface tracking-wide">
            Drop PCAP here
          </div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm">
            or click to browse your forensic capture files from local disk
          </p>
</div>
<div className="mt-space-md flex items-center gap-space-sm">
<button className="flex items-center gap-space-xs bg-primary text-on-primary px-space-lg py-space-xs rounded font-headline-sm text-headline-sm font-semibold hover:bg-primary-fixed transition-colors" id="trigger-select-btn" type="button">
<span className="material-symbols-outlined text-[18px]">folder_open</span>
<span>Select Capture</span>
</button>
<kbd className="px-space-sm py-space-xs rounded bg-surface-container-highest font-code-sm text-code-sm text-outline border border-surface-container-high">⌘O / Ctrl+O</kbd>
</div>
{/* Concise Secondary Metadata Row */}
<div className="mt-space-lg pt-space-md border-t border-surface-container-highest/60 flex flex-wrap justify-center items-center gap-x-space-md gap-y-space-xs font-code-sm text-code-sm text-outline">
<span>Formats: .pcap, .pcapng, .cap</span>
<span className="text-outline-variant">•</span>
<span>Max size: 4 GB</span>
<span className="text-outline-variant">•</span>
<span className="text-tertiary">Integrity verification: SHA-256 Enabled</span>
</div>
</div>
{/* Options & Concise 1-Line Evidence Notice */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm px-space-xs">
<label className="flex items-center gap-space-sm cursor-pointer select-none">
<input defaultChecked className="w-4 h-4 rounded bg-surface-container-lowest text-primary accent-primary focus:ring-0" type="checkbox" />
<span className="font-body-sm text-body-sm text-on-surface">Strict RFC compliance validation</span>
</label>
<div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
<span>Decryption keys optional: flow telemetry classifies tunnels without breaking crypto.</span>
<button className="text-primary hover:underline font-medium inline-flex items-center ml-1" id="evidence-policy-link" type="button" onClick={openPolicy}>
            Evidence Policy Details →
          </button>
</div>
</div>
</div>
{/* Streamlined Forensic Pipeline Execution Modules */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">tune</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Forensic Pipeline Modules</span>
</div>
<span className="font-code-sm text-code-sm text-outline">Profile: NIST-FIPS-140-3-STRICT</span>
</div>
{/* 5 Compact, Crisp Modular Status Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
{/* Card 01 */}
<div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_01</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-medium">Crypto &amp; Protocol</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">IKE &amp; ESP validation</p>
</div>
<div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
<button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
<span>Inspect config</span>
<span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</div>
</div>
{/* Card 02 */}
<div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_02</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-medium">ML Flow</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Encrypted flow fingerprinting</p>
</div>
<div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
<button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
<span>Inspect config</span>
<span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</div>
</div>
{/* Card 03 */}
<div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_03</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-medium">Tunnel Integrity</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Replay &amp; sequence skew</p>
</div>
<div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
<button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
<span>Inspect config</span>
<span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</div>
</div>
{/* Card 04 */}
<div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_04</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-surface-container-highest text-tertiary font-medium">LOCKED</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-medium">Evidence Provenance</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Deterministic verification</p>
</div>
<div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
<button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
<span>Inspect config</span>
<span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</div>
</div>
{/* Card 05 */}
<div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_05</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-medium">Forensic Export</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">RFC audit &amp; STIX 2.1</p>
</div>
<div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
<button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
<span>Inspect config</span>
<span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</div>
</div>
</div>
</div>
{/* Clean Recent Captures History (Progressive Disclosure) */}
<div className="flex flex-col gap-space-sm mt-space-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[18px]">history</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Recent Captures</h2>
<span className="px-space-xs py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-outline">5 Recorded</span>
</div>
<div className="flex items-center gap-space-sm font-code-sm text-code-sm">
<input className="bg-surface-container-low border border-surface-container-high/50 px-space-sm py-1 rounded text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:border-primary" placeholder="Filter captures..." type="text" />
<button className="p-1 rounded bg-surface-container-low border border-surface-container-high/50 text-on-surface-variant hover:text-on-surface" title="Refresh" type="button" onClick={refreshCaptures}>
<span className="material-symbols-outlined text-[16px]">refresh</span>
</button>
</div>
</div>
{/* Clean Streamlined Table (Clutter Removed) */}
<div className="bg-surface-container-low rounded border border-surface-container-high/40 overflow-hidden shadow-sm">
<table className="w-full text-left font-body-sm text-body-sm border-collapse">
<thead>
<tr className="bg-surface-container/60 font-label-sm text-label-sm uppercase tracking-wider text-outline select-none border-b border-surface-container-high/40">
<th className="py-space-sm px-space-md">Status</th>
<th className="py-space-sm px-space-md">Capture Name</th>
<th className="py-space-sm px-space-md">Volume</th>
<th className="py-space-sm px-space-md">Risk</th>
<th className="py-space-sm px-space-md">Ingested</th>
<th className="py-space-sm px-space-md text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high/30 font-code-sm text-code-sm">
{/* Row 1 */}
<tr className="hover:bg-surface-container/50 transition-colors group cursor-pointer inspect-trigger-row" data-name="core-dc-chicago-gw1.pcap" data-packets="842,109" data-risk="HIGH" data-sha="4f81a792e091bfa3c6781290bb34e91a784d12c82098b1a3c75d40192e5912a0" data-source="Edge TAP (SPAN 04)" data-suite="IKEv1 Aggressive / ESP 3DES-CBC / DH Group 2" data-time="18:32 UTC" data-vol="1.42 GB">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="text-on-surface font-medium">AUDITED</span>
</div>
</td>
<td className="py-space-sm px-space-md font-medium text-on-surface">core-dc-chicago-gw1.pcap</td>
<td className="py-space-sm px-space-md text-on-surface-variant">1.42 GB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-error-container/60 text-error">HIGH</span>
</td>
<td className="py-space-sm px-space-md text-outline">18:32 UTC</td>
<td className="py-space-sm px-space-md text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-medium inline-flex items-center gap-1 group/btn" type="button" onClick={openInspectRow}>
<span>Inspect</span>
<span className="text-[12px] group-hover/btn:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container/50 transition-colors group cursor-pointer inspect-trigger-row" data-name="live-tap-frankfurt-ixp.pcapng" data-packets="2,190,412" data-risk="LOW" data-sha="b1704e6c98234ea7f12a90098bc91124f4e75d0124b48d9a203f69b1834288dc" data-source="IXP Mirror (DPDK Ring)" data-suite="IKEv2 (RFC 7296) / ESP AES-256-GCM / Curve25519" data-time="17:51 UTC" data-vol="3.80 GB">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="text-tertiary font-medium">PASS</span>
</div>
</td>
<td className="py-space-sm px-space-md font-medium text-on-surface">live-tap-frankfurt-ixp.pcapng</td>
<td className="py-space-sm px-space-md text-on-surface-variant">3.80 GB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-tertiary-container/40 text-tertiary">LOW</span>
</td>
<td className="py-space-sm px-space-md text-outline">17:51 UTC</td>
<td className="py-space-sm px-space-md text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-medium inline-flex items-center gap-1 group/btn" type="button" onClick={openInspectRow}>
<span>Inspect</span>
<span className="text-[12px] group-hover/btn:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container/50 transition-colors group cursor-pointer inspect-trigger-row" data-name="site2site-failover.pcapng" data-packets="145,820" data-risk="MEDIUM" data-sha="88fa2904c6019b8823d04a9192b512c091f822a611c095e49021da66230192b5" data-source="Disaster Recovery Ingest" data-suite="IKEv2 Transport / ChaCha20-Poly1305 / MODP-2048 (No PFS)" data-time="15:04 UTC" data-vol="210 MB">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-on-surface font-medium">AUDITED</span>
</div>
</td>
<td className="py-space-sm px-space-md font-medium text-on-surface">site2site-failover.pcapng</td>
<td className="py-space-sm px-space-md text-on-surface-variant">210 MB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-secondary-container text-secondary-fixed">MEDIUM</span>
</td>
<td className="py-space-sm px-space-md text-outline">15:04 UTC</td>
<td className="py-space-sm px-space-md text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-medium inline-flex items-center gap-1 group/btn" type="button" onClick={openInspectRow}>
<span>Inspect</span>
<span className="text-[12px] group-hover/btn:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-surface-container/50 transition-colors group cursor-pointer inspect-trigger-row" data-name="branch-emea-gw04.pcap" data-packets="412,090" data-risk="MEDIUM" data-sha="cc0210a489110db44199c0182aa410499bcf812903ea770182bb1948cc02aa41" data-source="FortiGate Mirror Ingest" data-suite="IKEv2 Tunnel / AES-128-CBC / HMAC-SHA1-96" data-time="13:34 UTC" data-vol="640 MB">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-on-surface font-medium">AUDITED</span>
</div>
</td>
<td className="py-space-sm px-space-md font-medium text-on-surface">branch-emea-gw04.pcap</td>
<td className="py-space-sm px-space-md text-on-surface-variant">640 MB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-secondary-container text-secondary-fixed">MEDIUM</span>
</td>
<td className="py-space-sm px-space-md text-outline">13:34 UTC</td>
<td className="py-space-sm px-space-md text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-medium inline-flex items-center gap-1 group/btn" type="button" onClick={openInspectRow}>
<span>Inspect</span>
<span className="text-[12px] group-hover/btn:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 5 */}
<tr className="hover:bg-surface-container/50 transition-colors group cursor-pointer inspect-trigger-row" data-name="azure-expressroute-ipsec.pcap" data-packets="670,119" data-risk="LOW" data-sha="11e73990812bfa701934bc8166f20918c55e90145b98aa1248c0812911e766f2" data-source="Cloud Ingress Collector" data-suite="IKEv2 Site-to-Site / AES-256-CBC / HMAC-SHA256" data-time="09:19 UTC" data-vol="890 MB">
<td className="py-space-sm px-space-md">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-on-surface font-medium">AUDITED</span>
</div>
</td>
<td className="py-space-sm px-space-md font-medium text-on-surface">azure-expressroute-ipsec.pcap</td>
<td className="py-space-sm px-space-md text-on-surface-variant">890 MB</td>
<td className="py-space-sm px-space-md">
<span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-tertiary-container/40 text-tertiary">LOW</span>
</td>
<td className="py-space-sm px-space-md text-outline">09:19 UTC</td>
<td className="py-space-sm px-space-md text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-medium inline-flex items-center gap-1 group/btn" type="button" onClick={openInspectRow}>
<span>Inspect</span>
<span className="text-[12px] group-hover/btn:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</main></div>
{/* Slide-Over Forensic Detail Drawer (Progressive Disclosure) */}
<div className="fixed inset-0 z-50 pointer-events-none transition-all duration-300" id="drawer-backdrop">
{/* Backdrop Overlay */}
<div className={drawerOpen ? "absolute inset-0 bg-black/60 opacity-100 transition-opacity duration-300 pointer-events-auto" : "absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none"} id="drawer-overlay" onClick={closeDrawer}></div>
{/* Drawer Surface */}
<div className={drawerOpen ? "absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface-container-low border-l border-surface-container-high/60 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out pointer-events-auto" : "absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface-container-low border-l border-surface-container-high/60 shadow-2xl flex flex-col justify-between translate-x-full transition-transform duration-300 ease-in-out pointer-events-auto"} id="forensic-drawer">
{/* Drawer Header */}
<div className="p-space-lg bg-surface-container-lowest border-b border-surface-container-high/60 flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">manage_search</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold">Forensic Capture Detail</div>
<div className="font-code-sm text-[11px] text-outline" id="drawer-header-subtitle">SESSION #8820-A • PROVENANCE VERIFIED</div>
</div>
</div>
<button className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors" id="close-drawer-btn" type="button" onClick={closeDrawer}>
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/* Drawer Scrollable Content */}
<div className="p-space-lg flex-1 overflow-y-auto flex flex-col gap-space-lg">
{/* Primary Target Info */}
<div className="bg-surface-container-lowest p-space-md rounded border border-surface-container-high/40 flex flex-col gap-space-xs">
<div className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Capture Archive</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold break-all" id="drawer-filename">{capture.name}</div>
<div className="flex items-center gap-space-md mt-1 font-code-sm text-code-sm">
<span className="text-on-surface-variant">Volume: <strong className="text-on-surface" id="drawer-volume">{capture.volume}</strong></span>
<span className="text-outline-variant">•</span>
<span className="text-on-surface-variant">Packets: <strong className="text-on-surface" id="drawer-packets">{capture.packets}</strong></span>
<span className="text-outline-variant">•</span>
<span className="text-on-surface-variant">Risk: <strong className="text-error" id="drawer-risk">{capture.risk}</strong></span>
</div>
</div>
{/* Detailed Parameter Specs */}
<div className="flex flex-col gap-space-sm">
<div className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Forensic Audit Parameters</div>
<div className="bg-surface-container-lowest rounded border border-surface-container-high/40 divide-y divide-surface-container-high/30 font-code-sm text-code-sm">
<div className="p-space-sm flex flex-col gap-1">
<span className="text-outline text-[11px]">Trace SHA-256</span>
<span className="text-on-surface break-all select-all font-mono text-[11px]" id="drawer-sha">{capture.sha}</span>
</div>
<div className="p-space-sm flex items-center justify-between">
<span className="text-outline">Capture Interface</span>
<span className="text-on-surface font-medium" id="drawer-source">{capture.source}</span>
</div>
<div className="p-space-sm flex flex-col gap-1">
<span className="text-outline text-[11px]">IKE / ESP Parameters</span>
<span className="text-on-surface font-medium" id="drawer-suite">{capture.suite}</span>
</div>
<div className="p-space-sm flex items-center justify-between">
<span className="text-outline">Diffie-Hellman Group</span>
<span className="text-error font-medium" id="drawer-dh">MODP-1024 (Group 2 - Insecure)</span>
</div>
<div className="p-space-sm flex items-center justify-between">
<span className="text-outline">Anti-Replay Window</span>
<span className="text-on-surface">64 Packets (Strict)</span>
</div>
</div>
</div>
{/* Evidence Provenance Card */}
<div className="bg-surface-container-lowest p-space-md rounded border border-surface-container-high/40 flex flex-col gap-space-xs">
<div className="flex items-center gap-space-xs text-tertiary">
<span className="material-symbols-outlined text-[16px]">verified</span>
<span className="font-headline-sm text-[13px] font-semibold">Evidence Provenance</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Deterministic rule justification confirms weak key exchange without requiring private payload disclosure. Findings are grounded strictly in packet header records.
        </p>
<div className="mt-space-xs flex items-center gap-space-sm text-[11px] font-code-sm text-outline">
<span>VALIDATION: DETERMINISTIC</span>
<span>•</span>
<span className="text-tertiary">ZERO_HALLUCINATION</span>
</div>
</div>
</div>
{/* Drawer Footer Action */}
<div className="p-space-lg bg-surface-container-lowest border-t border-surface-container-high/60 flex flex-col gap-space-xs">
<button className="w-full py-space-sm px-space-md rounded bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-space-xs shadow-md" type="button">
<span>Proceed to Deep Inspection</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
<div className="text-center">
<button className="font-code-sm text-[11px] text-outline hover:text-on-surface pt-1" id="cancel-drawer-btn" type="button" onClick={closeDrawer}>
            Close Panel
          </button>
</div>
</div>
</div>
</div>
{/* Minimal Policy Modal (triggered by "Evidence Policy Details →") */}
<div className={policyOpen ? "fixed inset-0 z-50 flex items-center justify-center p-space-md" : "fixed inset-0 z-50 hidden flex items-center justify-center p-space-md"} id="policy-modal">
<div className="absolute inset-0 bg-black/70" id="policy-backdrop" onClick={closePolicy}></div>
<div className="relative bg-surface-container rounded-lg max-w-lg w-full p-space-lg border border-surface-container-high shadow-2xl flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
<div className="flex items-center gap-space-xs text-primary">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
<span className="font-headline-sm text-headline-sm font-semibold">Forensic Evidence &amp; Decryption Policy</span>
</div>
<button className="text-outline hover:text-on-surface" id="close-policy-btn" type="button" onClick={closePolicy}>
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<div className="font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-space-sm leading-relaxed">
<p>
        Payload decryption keys (IKE Secret / ESP Private Key) are entirely optional. TunnelSight models analyze flow dynamics, packet timing entropy, and encapsulated frame structures without requiring plaintext inspection.
      </p>
<p>
        In accordance with forensic chain-of-custody standards, all analytical claims are tagged strictly as <span className="font-code-sm text-on-surface bg-surface-container-high px-1 rounded">CONFIRMED</span> or <span className="font-code-sm text-outline bg-surface-container-high px-1 rounded">INFERRED</span> to ensure verifiable provenance.
      </p>
</div>
<div className="flex justify-end pt-space-xs">
<button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-md py-space-xs rounded font-code-sm text-code-sm transition-colors" id="ack-policy-btn" type="button" onClick={closePolicy}>
        Acknowledge
      </button>
</div>
</div>
</div>

    </div>
  );
}
