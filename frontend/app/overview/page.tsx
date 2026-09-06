"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; import Stat from "@/components/motion/Stat";

export default function OverviewPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState("");
  function closeDrawer() {
    setDrawerOpen(false);
  }
  return (
    <div className="type-plex bg-background font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen overflow-x-hidden">

{/* LEFT SIDEBAR */}
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none border-r border-surface-container-highest/40">
<div className="flex flex-col">
<div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest border-b border-surface-container-highest/30">
<span className="material-symbols-outlined text-primary text-[20px]">security</span>
<div className="flex items-baseline gap-space-2xs">
<span className="font-semibold text-[14px] text-on-surface tracking-tight">TunnelSight</span>
<span className="font-mono text-[12px] text-outline">/</span>
<span className="font-mono text-[11px] text-on-surface-variant font-medium">IPsecXray</span>
</div>
</div>
<div className="px-space-base py-space-xs bg-surface-container-low border-b border-surface-container-highest/20">
<div className="flex items-center justify-between text-outline text-[10px] uppercase font-mono tracking-wider">
<span>Operational Posture</span>
<span className="text-primary font-semibold">v2.4.1-rc3</span>
</div>
</div>
<nav className="flex flex-col gap-1 p-space-sm mt-space-xs">
<Link aria-current="page" className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors bg-primary-container text-on-primary-container font-semibold" href="/overview">
<span className="material-symbols-outlined text-[18px]">dashboard</span>
<span>Overview</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze">
<span className="material-symbols-outlined text-[18px]">file_open</span>
<span>Analyze PCAP</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live">
<span className="material-symbols-outlined text-[18px]">pulse_alert</span>
<span>Live Analysis</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration">
<span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
<span>VPN Configurations</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic">
<span className="material-symbols-outlined text-[18px]">insights</span>
<span>Traffic Intelligence</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings">
<span className="material-symbols-outlined text-[18px]">policy</span>
<span>Findings</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports">
<span className="material-symbols-outlined text-[18px]">assignment</span>
<span>Reports</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset">
<span className="material-symbols-outlined text-[18px]">dataset</span>
<span>Dataset / Testbed</span>
</Link>
<Link className="flex items-center gap-space-md px-space-md py-2 rounded text-[13px] transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings">
<span className="material-symbols-outlined text-[18px]">tune</span>
<span>Settings</span>
</Link>
</nav>
</div>
<div className="p-space-sm bg-surface-container-lowest border-t border-surface-container-highest/30">
<div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-[10px] tracking-wider uppercase font-mono">
<span className="text-outline">Pipeline</span>
<span className="text-tertiary font-semibold">ONLINE</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden">
<div className="bg-primary-container h-1 rounded w-3/4"></div>
</div>
<div className="flex justify-between font-mono text-[11px] text-on-surface-variant">
<span className="truncate">DPDK Core 0-3</span>
<span className="text-on-surface">0.02ms</span>
</div>
</div>
</div>
</aside>
{/* MAIN VIEWPORT WRAPPER */}
<div className="pl-sidebar-expanded">
{/* TOP STATUS & ENGINE HEADER */}
<header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base border-b border-surface-container-highest/40 select-none">
<div className="flex items-center gap-space-md">
<div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded border border-surface-container-highest/40">
<span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span>
<span className="font-mono text-[11px] text-on-surface font-semibold">ENGINE ONLINE</span>
<span className="text-outline-variant font-mono text-[11px]">|</span>
<span className="font-mono text-[11px] text-on-surface-variant">DPDK RX: READY</span>
<span className="text-outline-variant font-mono text-[11px]">|</span>
<span className="font-mono text-[11px] text-tertiary">ML WORKERS: 4/4 ACTIVE</span>
</div>
<div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded">
<span className="text-[10px] text-outline uppercase font-mono tracking-wide">Profile</span>
<span className="font-mono text-[11px] text-primary font-medium">Enterprise-Edge-Audit</span>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="hidden 2xl:flex items-center gap-space-xs font-mono text-[11px] text-on-surface-variant">
<span className="text-outline">UTC</span><span>2025-05-18 14:32:09</span>
<span className="text-outline-variant">|</span>
<span className="text-outline">Buffer:</span>
<span className="text-tertiary">98.4% Free</span>
</div>
<button data-action="search" className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button">
<span className="material-symbols-outlined text-[15px]">search</span>
<span className="font-mono text-[11px]">Search packets/SPI/tunnels</span>
<kbd className="bg-surface-container-highest px-1.5 rounded font-mono text-[10px] text-outline ml-1">⌘K</kbd>
</button>
<div className="flex items-center gap-1">
<button data-action="export" className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Export" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
<button data-action="notifications" className="relative p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notifications" type="button">
<span className="material-symbols-outlined text-[18px]">notifications</span>
<span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-tertiary"></span>
</button>
</div>
<div className="h-4 w-px bg-surface-container-highest mx-1"></div>
<div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary text-[16px]">person</span>
</div>
</div>
</header>
{/* CONTENT BODY */}
<main className="relative pt-header-height w-full bg-background min-h-screen">
<div className="max-w-[1580px] mx-auto px-6 py-8 flex flex-col gap-8">
{/* CONTEXT BAR: SCOPE & QUICK ACTIONS */}
<section className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-container-highest/30">
<div className="flex items-center gap-3">
<div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded border border-surface-container-highest/30">
<span className="material-symbols-outlined text-primary text-[18px]">domain_verification</span>
<span className="text-[11px] text-outline uppercase font-mono tracking-wider">Scope</span>
<span className="text-[13px] text-on-surface font-semibold">Production Edge &amp; Core</span>
<span className="font-mono text-[11px] text-primary font-semibold px-2 py-0.5 bg-surface-container-highest rounded">72 Tunnels Audited</span>
</div>
<div className="hidden md:flex items-center gap-2 font-mono text-[12px] text-on-surface-variant pl-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span>DPDK Buffer: <strong className="text-on-surface">0.04% loss</strong></span>
</div>
</div>
<div className="flex items-center gap-2">
<button className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold rounded flex items-center gap-2 border border-surface-container-highest/50 transition-colors" type="button" onClick={() => router.push("/analysis/live")}>
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span>Start Live Analysis</span>
</button>
<button className="h-8 px-3.5 bg-primary-container hover:bg-primary text-on-primary-container text-[12px] font-semibold rounded flex items-center gap-2 shadow-sm transition-colors" id="btn-analyze-pcap" type="button" onClick={() => router.push("/analyze")}>
<span className="material-symbols-outlined text-[16px]">upload_file</span>
<span>Analyze PCAP</span>
<kbd className="bg-on-primary-container/20 px-1.5 rounded font-mono text-[10px]">Alt+U</kbd>
</button>
</div>
</section>
{/* 2. SECURITY & PROTOCOL POSTURE (CLEAN & MINIMAL UNIFIED POSTURE) */}
<section className="bg-surface-container-low rounded-lg p-6 border border-surface-container-highest/30 flex flex-col gap-6 shadow-sm">
{/* Top row: Status header + concise posture spectrum */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[22px]">shield_lock</span>
<div>
<h1 className="text-[18px] font-semibold tracking-tight text-on-surface">Security &amp; Cryptographic Posture</h1>
<p className="text-[12px] text-on-surface-variant font-mono mt-0.5">Automated deep-packet posture assessment across 72 active tunnels</p>
</div>
</div>
{/* Status Indicators Legend */}
<div className="flex items-center gap-4 font-mono text-[12px]">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
<span className="text-on-surface font-semibold"><Stat to={41} /></span>
<span className="text-outline">Hardened</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
<span className="text-on-surface font-semibold"><Stat to={23} /></span>
<span className="text-outline">Sub-optimal</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
<span className="text-on-surface font-semibold text-[#EF4444]"><Stat to={8} /></span>
<span className="text-[#EF4444]">Critical</span>
</div>
</div>
</div>
{/* Minimal Horizontal Posture Segment Bar */}
<div className="flex flex-col gap-1.5">
<div className="h-2.5 w-full rounded-full bg-surface-container-highest flex overflow-hidden">
<div className="bg-[#10B981] transition-all" style={{width: '56.9%'}} title="41 Hardened (56.9%)"></div>
<div className="bg-[#F59E0B] transition-all" style={{width: '31.9%'}} title="23 Sub-optimal (31.9%)"></div>
<div className="bg-[#EF4444] transition-all" style={{width: '11.2%'}} title="8 Critical (11.2%)"></div>
</div>
<div className="flex justify-between font-mono text-[11px] text-outline pt-0.5">
<span>56.9% Compliant Modern Suites</span>
<span>31.9% Deprecated Parameters</span>
<span className="text-[#EF4444] font-medium">11.2% Immediate Vulnerabilities</span>
</div>
</div>
{/* Grid: Protocol Indicators + Forensic Provenance (Clean Minimal Cards) */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-surface-container-highest/30">
{/* Indicator 1 */}
<div className="bg-surface-container p-4 rounded-md flex flex-col justify-between">
<span className="text-[11px] uppercase font-mono tracking-wider text-outline">IKEv2 Adoption</span>
<div className="flex items-baseline justify-between mt-2">
<span className="font-mono text-[26px] font-semibold text-on-surface">86<span className="text-[16px] text-outline font-normal">%</span></span>
<span className="text-[12px] font-mono text-primary font-medium">62 / 72</span>
</div>
<span className="text-[11px] text-on-surface-variant font-mono mt-1">10 legacy IKEv1 tunnels</span>
</div>
{/* Indicator 2 */}
<div className="bg-surface-container p-4 rounded-md flex flex-col justify-between">
<span className="text-[11px] uppercase font-mono tracking-wider text-outline">PFS Enforcement</span>
<div className="flex items-baseline justify-between mt-2">
<span className="font-mono text-[26px] font-semibold text-on-surface">94.2<span className="text-[16px] text-outline font-normal">%</span></span>
<span className="text-[12px] font-mono text-[#10B981] font-medium">ECDH Groups</span>
</div>
<span className="text-[11px] text-on-surface-variant font-mono mt-1">4 Child SAs missing PFS</span>
</div>
{/* Indicator 3 */}
<div className="bg-surface-container p-4 rounded-md flex flex-col justify-between">
<span className="text-[11px] uppercase font-mono tracking-wider text-outline">ESP Integrity</span>
<div className="flex items-baseline justify-between mt-2">
<span className="font-mono text-[26px] font-semibold text-on-surface">99.8<span className="text-[16px] text-outline font-normal">%</span></span>
<span className="text-[12px] font-mono text-tertiary font-medium">In-Order</span>
</div>
<span className="text-[11px] text-on-surface-variant font-mono mt-1">Zero replay sequence drops</span>
</div>
{/* Provenance Summary */}
<div className="bg-surface-container p-4 rounded-md flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="text-[11px] uppercase font-mono tracking-wider text-outline">Evidence Provenance</span>
<span className="text-[10px] font-mono text-outline">NIST SP 800</span>
</div>
<div className="flex items-center gap-3 my-2 font-mono">
<span className="text-[11px] px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] font-medium" title="58 Confirmed">58 Conf</span>
<span className="text-[11px] px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#FBBF24] font-medium" title="11 Inferred">11 Inf</span>
<span className="text-[11px] px-2 py-0.5 rounded bg-surface-container-highest text-outline font-medium" title="3 Unknown">3 Unk</span>
</div>
<a className="text-[11px] text-primary hover:underline font-mono inline-flex items-center gap-1" href="#">
                Inspect Provenance →
              </a>
</div>
</div>
</section>
{/* 3. RECENT CAPTURES (CLEAN SUMMARY TABLE WITH PROGRESSIVE DISCLOSURE) */}
<section className="bg-surface-container-low rounded-lg border border-surface-container-highest/30 overflow-hidden shadow-sm">
<div className="px-6 py-4 bg-surface-container flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-highest/40">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[20px]">table_rows</span>
<div>
<h2 className="text-[15px] font-semibold text-on-surface">Recent PCAP Ingestions &amp; Captures</h2>
<p className="text-[11px] text-outline font-mono">Click any row or "Inspect →" for full cryptographic forensic payload</p>
</div>
</div>
<div className="flex items-center gap-3">
<div className="relative">
<input className="h-8 w-60 bg-surface-container-lowest text-on-surface placeholder:text-outline font-mono text-[12px] px-3 rounded border border-surface-container-highest/40 outline-none focus:border-primary" placeholder="Filter capture file or status..." type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
</div>
<span className="font-mono text-[11px] text-outline">Showing 5 of 24</span>
</div>
</div>
<div className="w-full overflow-x-auto">
<table className="w-full text-left font-sans text-[13px] whitespace-nowrap">
<thead className="bg-surface-container-lowest text-outline font-mono text-[11px] uppercase tracking-wider select-none border-b border-surface-container-highest/30">
<tr>
<th className="py-3 px-6">Status</th>
<th className="py-3 px-6">Capture</th>
<th className="py-3 px-6">Protocol</th>
<th className="py-3 px-6">Risk</th>
<th className="py-3 px-6">Score</th>
<th className="py-3 px-6">Ingested</th>
<th className="py-3 px-6 text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-highest/30 text-on-surface">
{/* Row 1 */}
<tr className="table-row-item hover:bg-surface-container/70 cursor-pointer transition-colors" onClick={() => router.push("/analysis/capture")} data-capture="core-dc-chicago-gw1.pcap">
<td className="py-4 px-6 font-mono text-[12px]">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
<span className="font-semibold text-[#EF4444]">CRITICAL</span>
</div>
</td>
<td className="py-4 px-6 font-mono font-medium text-on-surface">core-dc-chicago-gw1.pcap</td>
<td className="py-4 px-6 font-mono text-on-surface-variant text-[12px]">IKEv1 / Tunnel</td>
<td className="py-4 px-6">
<span className="px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] font-mono text-[11px] font-semibold">HIGH</span>
</td>
<td className="py-4 px-6 font-mono text-[#EF4444] font-semibold">41</td>
<td className="py-4 px-6 font-mono text-outline text-[12px]">14:18</td>
<td className="py-4 px-6 text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-mono text-[12px] font-semibold inline-flex items-center gap-1 group" type="button" onClick={() => router.push("/analysis/capture")}>
                      Inspect <span className="group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 2 */}
<tr className="table-row-item hover:bg-surface-container/70 cursor-pointer transition-colors" onClick={() => router.push("/analysis/capture")} data-capture="branch-emea-gw04.pcap">
<td className="py-4 px-6 font-mono text-[12px]">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
<span className="font-semibold text-on-surface">AUDITED</span>
</div>
</td>
<td className="py-4 px-6 font-mono font-medium text-on-surface">branch-emea-gw04.pcap</td>
<td className="py-4 px-6 font-mono text-on-surface-variant text-[12px]">IKEv2 / Tunnel</td>
<td className="py-4 px-6">
<span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#FBBF24] font-mono text-[11px] font-semibold">MEDIUM</span>
</td>
<td className="py-4 px-6 font-mono text-[#FBBF24] font-semibold">68</td>
<td className="py-4 px-6 font-mono text-outline text-[12px]">14:02</td>
<td className="py-4 px-6 text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-mono text-[12px] font-semibold inline-flex items-center gap-1 group" type="button" onClick={() => router.push("/analysis/capture")}>
                      Inspect <span className="group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 3 */}
<tr className="table-row-item hover:bg-surface-container/70 cursor-pointer transition-colors" onClick={() => router.push("/analysis/capture")} data-capture="site2site-failover.pcapng">
<td className="py-4 px-6 font-mono text-[12px]">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
<span className="font-semibold text-[#10B981]">PASS</span>
</div>
</td>
<td className="py-4 px-6 font-mono font-medium text-on-surface">site2site-failover.pcapng</td>
<td className="py-4 px-6 font-mono text-on-surface-variant text-[12px]">IKEv2 / Transport</td>
<td className="py-4 px-6">
<span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] font-mono text-[11px] font-semibold">LOW</span>
</td>
<td className="py-4 px-6 font-mono text-[#34D399] font-semibold">94</td>
<td className="py-4 px-6 font-mono text-outline text-[12px]">13:45</td>
<td className="py-4 px-6 text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-mono text-[12px] font-semibold inline-flex items-center gap-1 group" type="button" onClick={() => router.push("/analysis/capture")}>
                      Inspect <span className="group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 4 */}
<tr className="table-row-item hover:bg-surface-container/70 cursor-pointer transition-colors" onClick={() => router.push("/analysis/capture")} data-capture="azure-expressroute-ipsec.pcap">
<td className="py-4 px-6 font-mono text-[12px]">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
<span className="font-semibold text-on-surface">AUDITED</span>
</div>
</td>
<td className="py-4 px-6 font-mono font-medium text-on-surface">azure-expressroute-ipsec.pcap</td>
<td className="py-4 px-6 font-mono text-on-surface-variant text-[12px]">IKEv2 / Tunnel</td>
<td className="py-4 px-6">
<span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#FBBF24] font-mono text-[11px] font-semibold">MEDIUM</span>
</td>
<td className="py-4 px-6 font-mono text-[#FBBF24] font-semibold">72</td>
<td className="py-4 px-6 font-mono text-outline text-[12px]">13:12</td>
<td className="py-4 px-6 text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-mono text-[12px] font-semibold inline-flex items-center gap-1 group" type="button" onClick={() => router.push("/analysis/capture")}>
                      Inspect <span className="group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
{/* Row 5 */}
<tr className="table-row-item hover:bg-surface-container/70 cursor-pointer transition-colors" onClick={() => router.push("/analysis/capture")} data-capture="live-tap-frankfurt-ixp.pcapng">
<td className="py-4 px-6 font-mono text-[12px]">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
<span className="font-semibold text-[#10B981]">PASS</span>
</div>
</td>
<td className="py-4 px-6 font-mono font-medium text-on-surface">live-tap-frankfurt-ixp.pcapng</td>
<td className="py-4 px-6 font-mono text-on-surface-variant text-[12px]">IKEv2 / Tunnel</td>
<td className="py-4 px-6">
<span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] font-mono text-[11px] font-semibold">LOW</span>
</td>
<td className="py-4 px-6 font-mono text-[#34D399] font-semibold">98</td>
<td className="py-4 px-6 font-mono text-outline text-[12px]">12:15</td>
<td className="py-4 px-6 text-right">
<button className="inspect-btn text-primary hover:text-primary-fixed font-mono text-[12px] font-semibold inline-flex items-center gap-1 group" type="button" onClick={() => router.push("/analysis/capture")}>
                      Inspect <span className="group-hover:translate-x-0.5 transition-transform">→</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
{/* 4. ACTIVE FINDINGS & TRAFFIC INTELLIGENCE (DUAL PANEL, MINIMAL) */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/* Left side: 3 high-priority findings only (7 cols) */}
<div className="lg:col-span-7 bg-surface-container-low rounded-lg p-6 border border-surface-container-highest/30 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[20px]">warning</span>
<h2 className="text-[16px] font-semibold text-on-surface">High-Priority Security Findings</h2>
</div>
<span className="text-[11px] font-mono text-outline">Priority Queue</span>
</div>
{/* 3 Minimal Finding Rows */}
<div className="flex flex-col gap-3">
{/* Finding 1 */}
<div className="bg-surface-container p-3.5 rounded-md border border-surface-container-highest/30 flex items-center justify-between gap-4" onClick={() => router.push("/analysis/findings")}>
<div className="flex items-center gap-3 min-w-0">
<span className="px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] font-mono text-[10px] font-bold tracking-wider shrink-0">CRITICAL</span>
<div className="min-w-0">
<p className="text-[13px] font-medium text-on-surface truncate">Weak Diffie-Hellman Group 2 (1024-bit MODP)</p>
<p className="text-[11px] font-mono text-outline mt-0.5">core-dc-chicago-gw1</p>
</div>
</div>
<span className="text-[11px] font-mono text-outline shrink-0">14:18</span>
</div>
{/* Finding 2 */}
<div className="bg-surface-container p-3.5 rounded-md border border-surface-container-highest/30 flex items-center justify-between gap-4" onClick={() => router.push("/analysis/findings")}>
<div className="flex items-center gap-3 min-w-0">
<span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#FBBF24] font-mono text-[10px] font-bold tracking-wider shrink-0">MEDIUM</span>
<div className="min-w-0">
<p className="text-[13px] font-medium text-on-surface truncate">PFS Disabled on Child SA</p>
<p className="text-[11px] font-mono text-outline mt-0.5">branch-emea-gw04</p>
</div>
</div>
<span className="text-[11px] font-mono text-outline shrink-0">14:02</span>
</div>
{/* Finding 3 */}
<div className="bg-surface-container p-3.5 rounded-md border border-surface-container-highest/30 flex items-center justify-between gap-4" onClick={() => router.push("/analysis/findings")}>
<div className="flex items-center gap-3 min-w-0">
<span className="px-2 py-0.5 rounded bg-surface-container-highest text-outline font-mono text-[10px] font-bold tracking-wider shrink-0">LOW</span>
<div className="min-w-0">
<p className="text-[13px] font-medium text-on-surface truncate">Unusual SA Rekey Frequency</p>
<p className="text-[11px] font-mono text-outline mt-0.5">azure-expressroute-ipsec</p>
</div>
</div>
<span className="text-[11px] font-mono text-outline shrink-0">13:12</span>
</div>
</div>
</div>
{/* Bottom link */}
<div className="pt-4 mt-2 border-t border-surface-container-highest/30 flex justify-between items-center">
<span className="text-[12px] font-mono text-outline">3 flagged in last audit window</span>
<a className="text-[12px] font-mono text-primary hover:underline font-medium inline-flex items-center gap-1" href="#">
                View all 14 findings →
              </a>
</div>
</div>
{/* Right side: Traffic Intelligence Snapshot (5 cols) */}
<div className="lg:col-span-5 bg-surface-container-low rounded-lg p-6 border border-surface-container-highest/30 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[20px]">insights</span>
<h2 className="text-[16px] font-semibold text-on-surface">Traffic Intelligence Snapshot</h2>
</div>
<span className="text-[11px] font-mono text-outline">DPDK DPI</span>
</div>
{/* Breakdown metrics */}
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between text-[12px] font-mono">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-on-surface">Video Streaming</span>
</div>
<span className="font-semibold text-on-surface">81%</span>
</div>
<div className="flex items-center justify-between text-[12px] font-mono">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="text-on-surface">Encrypted Web (HTTPS)</span>
</div>
<span className="font-semibold text-on-surface">12%</span>
</div>
<div className="flex items-center justify-between text-[12px] font-mono">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
<span className="text-on-surface">VoIP / Realtime</span>
</div>
<span className="font-semibold text-on-surface">4%</span>
</div>
<div className="flex items-center justify-between text-[12px] font-mono">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="text-on-surface">Other Tunnel Transit</span>
</div>
<span className="font-semibold text-outline">3%</span>
</div>
{/* Mini distribution bar */}
<div className="h-2 w-full rounded-full bg-surface-container-highest flex overflow-hidden my-1">
<div className="bg-primary h-full" style={{width: '81%'}}></div>
<div className="bg-tertiary h-full" style={{width: '12%'}}></div>
<div className="bg-[#F59E0B] h-full" style={{width: '4%'}}></div>
<div className="bg-outline h-full" style={{width: '3%'}}></div>
</div>
{/* Status note on classification */}
<div className="bg-surface-container p-3 rounded text-[11px] font-mono text-on-surface-variant flex items-center gap-2 border border-surface-container-highest/20 mt-1">
<span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span>
<span>96.4% flows classified by ML entropy model (v4.1)</span>
</div>
</div>
</div>
{/* Bottom link */}
<div className="pt-4 mt-2 border-t border-surface-container-highest/30 flex justify-end">
<a className="text-[12px] font-mono text-primary hover:underline font-medium inline-flex items-center gap-1" href="#">
                View traffic analysis →
              </a>
</div>
</div>
</section>
</div>
{/* 5. INTERACTIVE DETAIL DRAWER / SLIDE-OVER (PROGRESSIVE DISCLOSURE) */}
{/* Semi-transparent Backdrop for focused inspection */}
<div className={drawerOpen ? "fixed inset-0 bg-black/50 backdrop-blur-[1px] z-50 transition-opacity opacity-100 block" : "fixed inset-0 bg-black/50 backdrop-blur-[1px] z-50 transition-opacity opacity-0 pointer-events-none hidden"} id="drawer-backdrop" onClick={closeDrawer}></div>
{/* Slide-over Drawer Panel */}
<aside className={drawerOpen ? "fixed top-0 right-0 h-full w-[440px] max-w-full bg-surface-container-low border-l border-surface-container-highest z-50 flex flex-col shadow-2xl transition-transform duration-300 translate-x-0" : "fixed top-0 right-0 h-full w-[440px] max-w-full bg-surface-container-low border-l border-surface-container-highest z-50 flex flex-col shadow-2xl transition-transform duration-300 translate-x-full pointer-events-none"} id="detail-drawer">
{/* Header */}
<div className="p-5 bg-surface-container border-b border-surface-container-highest flex items-start justify-between">
<div className="flex flex-col gap-1">
<span className="text-[10px] font-mono text-outline uppercase tracking-wider">Forensic Record</span>
<h2 className="font-mono text-[15px] font-semibold text-on-surface break-all" id="drawer-title">core-dc-chicago-gw1.pcap</h2>
<div className="flex items-center gap-2 mt-1">
<span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444]" id="drawer-state-badge">CRITICAL RISK</span>
<span className="text-[11px] font-mono text-outline">Frame #412 Dissection</span>
</div>
</div>
<button className="p-1.5 rounded hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors" id="close-drawer" title="Close Drawer" type="button" onClick={closeDrawer}>
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/* Deep Specs Content (Database ≠ Dashboard principle) */}
<div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 text-[12px] font-mono">
{/* Evidence State */}
<div className="bg-surface-container p-3.5 rounded border border-surface-container-highest/40 flex items-center justify-between">
<span className="text-outline uppercase text-[10px] tracking-wider">Evidence State</span>
<span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#10B981]/15 text-[#34D399]" id="drawer-evidence">CONFIRMED (Deep Packet Parse)</span>
</div>
{/* Cryptographic Suite Details */}
<div className="flex flex-col gap-2">
<span className="text-outline uppercase text-[10px] tracking-wider">Negotiated Cipher Suite</span>
<div className="bg-surface-container p-3.5 rounded border border-surface-container-highest/40 flex flex-col gap-2">
<div className="flex justify-between items-center pb-2 border-b border-surface-container-highest/30">
<span className="text-outline">Encryption:</span>
<span className="text-[#EF4444] font-semibold" id="drawer-cipher">3DES-CBC</span>
</div>
<div className="flex justify-between items-center pb-2 border-b border-surface-container-highest/30">
<span className="text-outline">Integrity / HMAC:</span>
<span className="text-[#EF4444] font-semibold" id="drawer-hmac">HMAC-MD5</span>
</div>
<div className="flex justify-between items-center">
<span className="text-outline">DH Exchange:</span>
<span className="text-[#EF4444] font-semibold" id="drawer-dh">MODP-1024 (Group 2)</span>
</div>
</div>
</div>
{/* SPI Keys and Endpoints */}
<div className="flex flex-col gap-2">
<span className="text-outline uppercase text-[10px] tracking-wider">Security Parameter Indices (SPI)</span>
<div className="bg-surface-container p-3.5 rounded border border-surface-container-highest/40 flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="text-outline">Initiator SPI:</span>
<span className="text-primary font-mono" id="drawer-initiator-spi">0x41f89c02</span>
</div>
<div className="flex justify-between items-center">
<span className="text-outline">Responder SPI:</span>
<span className="text-primary font-mono" id="drawer-responder-spi">0x9a4f21e8</span>
</div>
</div>
</div>
{/* Endpoints */}
<div className="flex flex-col gap-2">
<span className="text-outline uppercase text-[10px] tracking-wider">Transit Endpoints</span>
<div className="bg-surface-container p-3 rounded border border-surface-container-highest/40 flex justify-between items-center text-on-surface">
<span id="drawer-endpoints">198.51.100.1 ↔ 203.0.113.44</span>
<span className="text-[10px] text-outline">UDP / 500</span>
</div>
</div>
{/* Forensic Volume & Entropy */}
<div className="grid grid-cols-2 gap-3">
<div className="bg-surface-container p-3 rounded border border-surface-container-highest/40 flex flex-col gap-1">
<span className="text-outline text-[10px] uppercase">Packet Count</span>
<span className="text-[14px] text-on-surface font-semibold" id="drawer-packet-count">842,109 pkts</span>
</div>
<div className="bg-surface-container p-3 rounded border border-surface-container-highest/40 flex flex-col gap-1">
<span className="text-outline text-[10px] uppercase">Nonce Entropy</span>
<span className="text-[14px] text-tertiary font-semibold" id="drawer-entropy">7.994 b/B</span>
</div>
</div>
{/* Cryptographic SHA-256 Digest */}
<div className="flex flex-col gap-1.5">
<span className="text-outline uppercase text-[10px] tracking-wider">Capture SHA-256 Digest</span>
<div className="bg-surface-container-lowest p-2.5 rounded border border-surface-container-highest/50 font-mono text-[11px] text-on-surface-variant break-all select-all">
              7b3e819fa2c4d98a0021bde792c01948ae1c48fbb291a0391d4e0e5cb19409df
            </div>
</div>
</div>
{/* Drawer Footer CTA */}
<div className="p-4 bg-surface-container border-t border-surface-container-highest flex items-center justify-between gap-3">
<button className="h-9 px-4 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-sans text-[12px] font-semibold transition-colors" id="close-drawer-btn" type="button" onClick={closeDrawer}>
            Close
          </button>
<button className="h-9 px-4 rounded bg-primary-container hover:bg-primary text-on-primary-container font-sans text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm" type="button" onClick={() => router.push("/analysis/results")}>
<span>View Full Forensic Analysis</span>
<span>→</span>
</button>
</div>
</aside>
</main>
</div>
{/* VANILLA INTERACTION SCRIPT FOR PROGRESSIVE DISCLOSURE */}


    </div>
  );
}
