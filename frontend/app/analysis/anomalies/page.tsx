"use client";
import Link from "next/link";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";

export default function AnomaliesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const toast = useToast();
  const adjustThreshold = () => toast({ title: "Threshold preset", body: "τ ≥ 0.72 applied to iForest v3.2 (mock).", kind: "info" });
  const exportVectors = () => {
    downloadFile(
      "anomaly-vectors-w28.json",
      JSON.stringify({ capture: "weak-vpn-07.pcap", window: "W-28", score: 0.91, threshold: 0.72, engine: "iForest v3.2" }, null, 2),
      "application/json"
    );
    toast({ title: "Vectors exported", body: "anomaly-vectors-w28.json downloaded.", kind: "ok" });
  };
  const filterWindow = () => toast({ title: "Window filter staged", body: "Focus locked to 02:10–02:40 (mock).", kind: "info" });
  const correlateRekey = () => toast({ title: "Correlation started", body: "IKE rekey events joined to W-28 (mock).", kind: "info" });
  const openVectorDrawer = () => toast({ title: "Feature vectors", body: "Full vector drawer is mocked in this prototype.", kind: "info" });
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span className="">2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button data-action="search" className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button data-action="export" className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button data-action="notifications" className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full">
{/* Top Forensic Breadcrumb & Filter Bar */}
<div className="px-space-base py-space-sm bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30">
<div className="flex items-center gap-space-sm">
<nav className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
<span className="text-outline">Captures</span>
<span className="text-outline-variant">/</span>
<span className="text-primary font-medium flex items-center gap-space-2xs">
<span className="material-symbols-outlined text-[14px]">terminal</span>
          weak-vpn-07.pcap
        </span>
<span className="text-outline-variant">/</span>
<span className="text-on-surface font-semibold">Anomaly Detection &amp; Baseline Drift</span>
</nav>
<span className="hidden sm:inline-block w-px h-3 bg-outline-variant"></span>
<span className="px-space-xs py-space-2xs rounded bg-surface-container font-code-sm text-[10px] uppercase tracking-wider text-outline flex items-center gap-space-2xs">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
        INFERRED — ML ANOMALY DETECTOR
      </span>
</div>
<div className="flex items-center gap-space-sm text-code-sm text-on-surface-variant">
<div className="hidden md:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded">
<span className="text-outline">Engine:</span>
<span className="text-on-surface font-mono">iForest v3.2</span>
<span className="text-outline-variant">|</span>
<span className="text-outline">Profile:</span>
<span className="text-primary font-mono">Edge-48h</span>
<span className="text-outline-variant">|</span>
<span className="text-outline">Threshold:</span>
<span className="text-error font-mono">τ ≥ 0.72</span>
<span className="text-outline-variant">|</span>
<span className="text-tertiary font-mono">1.8ms</span>
</div>
<div className="flex items-center gap-space-2xs">
<button className="px-space-sm py-space-2xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-code-sm flex items-center gap-space-2xs" type="button" onClick={adjustThreshold}>
<span className="material-symbols-outlined text-[14px]">tune</span>
          Threshold
        </button>
</div>
</div>
</div>
{/* Sub-tabs Navigation */}
<div className="px-space-base bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
<div className="flex gap-space-xs overflow-x-auto py-space-2xs" id="subtab-container">
<button className={activeTab === "all" ? "px-space-sm py-space-xs font-label-md text-label-md rounded bg-surface-container text-primary font-semibold flex items-center gap-space-2xs" : "px-space-sm py-space-xs font-label-md text-label-md rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-space-2xs"} data-tab="all" onClick={() => setActiveTab("all")}>
<span className="material-symbols-outlined text-[15px]">multiline_chart</span>
        All Signals
      </button>
<button className={activeTab === "timing" ? "px-space-sm py-space-xs font-label-md text-label-md rounded bg-surface-container text-primary font-semibold flex items-center gap-space-2xs" : "px-space-sm py-space-xs font-label-md text-label-md rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-space-2xs"} data-tab="timing" onClick={() => setActiveTab("timing")}>
<span className="material-symbols-outlined text-[15px]">schedule</span>
        Timing &amp; Volumetrics
      </button>
<button className={activeTab === "direction" ? "px-space-sm py-space-xs font-label-md text-label-md rounded bg-surface-container text-primary font-semibold flex items-center gap-space-2xs" : "px-space-sm py-space-xs font-label-md text-label-md rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-space-2xs"} data-tab="direction" onClick={() => setActiveTab("direction")}>
<span className="material-symbols-outlined text-[15px]">swap_vert</span>
        Directional Shift
      </button>
<button className={activeTab === "size" ? "px-space-sm py-space-xs font-label-md text-label-md rounded bg-surface-container text-primary font-semibold flex items-center gap-space-2xs" : "px-space-sm py-space-xs font-label-md text-label-md rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-space-2xs"} data-tab="size" onClick={() => setActiveTab("size")}>
<span className="material-symbols-outlined text-[15px]">bar_chart</span>
        Size Distribution
      </button>
<button className={activeTab === "provenance" ? "px-space-sm py-space-xs font-label-md text-label-md rounded bg-surface-container text-primary font-semibold flex items-center gap-space-2xs" : "px-space-sm py-space-xs font-label-md text-label-md rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center gap-space-2xs"} data-tab="provenance" onClick={() => setActiveTab("provenance")}>
<span className="material-symbols-outlined text-[15px]">model_training</span>
        Model Provenance
      </button>
</div>
<div className="hidden lg:flex items-center gap-space-xs py-space-2xs text-code-sm text-outline">
<span className="">Focus: Window W-28</span>
<span className="text-outline-variant">·</span>
<span className="text-on-surface font-medium">T+02:15:00 → T+02:20:00</span>
</div>
</div>
{/* Primary Workspace Content */}
<div className="p-space-base flex flex-col gap-space-base">
{/* LEVEL 1: Primary Posture Alert Banner */}
<div className="relative overflow-hidden rounded bg-surface-container-low p-space-base shadow-lg border border-outline-variant/30 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-lg"><div className="absolute top-0 left-0 bottom-0 w-1.5 bg-error"></div><div className="flex items-center gap-space-md pl-space-xs"><div className="w-10 h-10 rounded bg-error/15 flex items-center justify-center shrink-0 border border-error/30"><span className="material-symbols-outlined text-error text-[22px]" style={{fontVariationSettings: "'FILL' 1"}}>warning</span></div><div className="flex flex-col gap-space-2xs"><div className="flex items-center gap-space-sm"><span className="px-space-xs py-space-2xs rounded bg-error-container text-on-error-container font-label-sm uppercase tracking-wider font-semibold">ANOMALY DETECTED</span><span className="font-code-sm text-error font-medium">Severity Level 4 (Critical)</span><span className="text-outline-variant">·</span><span className="font-code-sm text-outline">Window Focus <strong className="text-primary font-mono">W-28</strong> (T+02:15)</span></div><p className="font-body-md text-on-surface max-w-2xl">Encrypted traffic demonstrates severe baseline deviation with acute volume surge and cadence desynchronization relative to the learned profile.</p></div></div><div className="flex items-center gap-space-lg shrink-0 bg-surface-container-lowest px-space-base py-space-sm rounded border border-outline-variant/40"><div className="flex flex-col items-end"><span className="font-label-sm uppercase tracking-wider text-outline">Anomaly Score</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-lg text-[26px] leading-tight font-bold text-error font-mono">0.91</span><span className="font-code-sm text-on-surface-variant font-mono">/ 1.00</span></div><span className="font-code-sm text-[11px] text-error font-mono">Threshold τ = 0.72 (+0.19)</span></div><div className="h-10 w-px bg-outline-variant/30"></div><div className="flex flex-col gap-space-xs"><button className="px-space-sm py-space-xs rounded bg-primary-container text-on-primary-container hover:bg-primary font-code-sm font-semibold transition-colors flex items-center gap-space-2xs" type="button" onClick={exportVectors}><span className="material-symbols-outlined text-[15px]">file_download</span>Export Anomaly Vectors (.json)</button><div className="flex items-center gap-space-xs"><button className="px-space-xs py-space-2xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface font-code-sm text-[11px] transition-colors flex items-center gap-space-2xs" type="button" onClick={filterWindow}><span className="material-symbols-outlined text-[13px]">zoom_in</span>Filter Window [02:10–02:40]</button><button className="px-space-xs py-space-2xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface font-code-sm text-[11px] transition-colors flex items-center gap-space-2xs" type="button" onClick={correlateRekey}><span className="material-symbols-outlined text-[13px]">vpn_key_alert</span>Correlate IKE Rekey</button></div></div></div></div>
{/* SECTION 1: Time-Series Anomaly Timeline */}
<div className="flex flex-col bg-surface-container-lowest rounded p-space-md border border-outline-variant/30">
<div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-sm">
<div className="flex items-center gap-space-sm">
<span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">timeline</span>
            Sliding Window Anomaly Score
          </span>
<span className="font-code-sm text-code-sm text-outline">Capture Span: 00:00 → 04:12 (Δ 252s)</span>
</div>
{/* Legend */}
<div className="flex items-center gap-space-md font-code-sm text-code-sm">
<div className="flex items-center gap-space-2xs">
<span className="w-3 h-0.5 bg-tertiary inline-block"></span>
<span className="text-on-surface-variant">Baseline Range (0.05-0.22)</span>
</div>
<div className="flex items-center gap-space-2xs">
<span className="w-3 h-0.5 border-t border-dashed border-error inline-block"></span>
<span className="text-error font-medium">Trigger Threshold (τ = 0.72)</span>
</div>
<div className="flex items-center gap-space-2xs">
<span className="w-2 h-2 rounded-full bg-error inline-block"></span>
<span className="text-on-surface">Spike Peak: 0.91</span>
</div>
</div>
</div>
{/* Time Series Interactive Graph Container */}
<div className="relative w-full h-44 bg-surface-container-low rounded border border-outline-variant/20 flex flex-col justify-between p-space-sm overflow-hidden select-none">
{/* Background Grid Lines */}
<div className="absolute inset-0 flex flex-col justify-between p-space-sm pointer-events-none opacity-20">
<div className="border-b border-outline w-full"></div>
<div className="border-b border-outline w-full"></div>
<div className="border-b border-outline w-full"></div>
<div className="border-b border-outline w-full"></div>
</div>
{/* Axis Labels */}
<div className="absolute left-space-xs top-space-xs bottom-space-xs flex flex-col justify-between font-code-sm text-[10px] text-outline pointer-events-none">
<span className="">1.0</span>
<span className="text-error">0.72</span>
<span className="">0.5</span>
<span className="text-tertiary">0.1</span>
<span className="">0.0</span>
</div>
{/* Threshold Reference Line (0.72) */}
<div className="absolute left-8 right-space-sm top-[28%] border-t border-dashed border-error/70 flex items-center justify-end pointer-events-none">
<span className="font-code-sm text-[10px] text-error bg-surface-container-lowest px-space-2xs -mt-2">Threshold τ=0.72</span>
</div>
{/* Nominal Band Underlay (0.05 - 0.22) */}
<div className="absolute left-8 right-space-sm bottom-[8%] h-[18%] bg-primary/5 pointer-events-none"></div>
{/* Sparkline SVG */}
<div className="relative w-full h-full pl-8">
<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 900 120">
<defs>
<linearGradient id="anomalyGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#ffb4ab" stop-opacity="0.3"></stop>
<stop offset="60%" stopColor="#59dbc7" stop-opacity="0.05"></stop>
<stop offset="100%" stopColor="#111317" stop-opacity="0"></stop>
</linearGradient>
</defs>
{/* Gradient Area */}
<path d="M 0 105 
                     L 40 104 L 80 106 L 120 102 L 160 104 L 200 103 L 240 102 L 280 104 L 320 101 L 360 98 
                     L 400 95 L 430 75 L 460 22 L 490 12 L 520 28 L 550 50 L 580 60 L 610 58 L 650 62 L 690 68 
                     L 730 85 L 770 94 L 810 98 L 850 101 L 900 102 
                     L 900 120 L 0 120 Z" fill="url(#anomalyGradient)"></path>
{/* Trajectory Line */}
<path d="M 0 105 
                     L 40 104 L 80 106 L 120 102 L 160 104 L 200 103 L 240 102 L 280 104 L 320 101 L 360 98 
                     L 400 95 L 430 75 L 460 22 L 490 12 L 520 28 L 550 50 L 580 60 L 610 58 L 650 62 L 690 68 
                     L 730 85 L 770 94 L 810 98 L 850 101 L 900 102" fill="none" style={{stroke: 'var(--color-primary)'}} strokeLinecap="round" strokeWidth="1.75"></path>
{/* Critical Spike Segment Over Threshold */}
<path d="M 438 65 L 460 22 L 490 12 L 520 28 L 542 45" fill="none" style={{stroke: 'var(--color-error)'}} strokeLinecap="round" strokeWidth="2.5"></path>
{/* Highlight Peak Dot at W-28 */}
<circle className="animate-pulse" cx="490" cy="12" style={{fill: 'var(--color-error)'}} r="4.5"></circle>
<circle cx="490" cy="12" fill="none" opacity="0.6" r="8" style={{stroke: 'var(--color-error)'}} strokeWidth="1"></circle>
{/* Secondary Sustained Points */}
<circle cx="580" cy="60" style={{fill: 'var(--color-secondary)'}} r="2.5"></circle>
<circle cx="610" cy="58" style={{fill: 'var(--color-secondary)'}} r="2.5"></circle>
</svg>
{/* Active Investigation Focus Indicator (Window W-28) */}
<div className="absolute left-[51%] top-0 bottom-0 w-20 -ml-10 bg-primary/10 border-x border-primary/40 pointer-events-none flex flex-col justify-start items-center">
<div className="bg-surface-container-highest px-space-xs py-space-2xs rounded shadow text-center -mt-2">
<span className="font-code-sm text-[10px] text-primary font-bold block whitespace-nowrap">W-28 (02:15 - 02:20)</span>
<span className="font-code-sm text-[9px] text-error font-medium">PEAK 0.91</span>
</div>
</div>
</div>
{/* Timeline Bottom Ticks */}
<div className="flex justify-between items-center text-outline font-code-sm text-[10px] pl-8 pt-space-xs border-t border-outline-variant/30">
<span className="">00:00 (W-01)</span>
<span className="">00:45 (W-09)</span>
<span className="">01:30 (W-18)</span>
<span className="text-primary font-semibold">02:15 [Window W-28]</span>
<span className="">03:00 (W-36)</span>
<span className="">03:45 (W-45)</span>
<span className="">04:12 (END)</span>
</div>
</div>
{/* Scrubber & Window Phase Description Bar */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mt-space-sm text-code-sm">
<div className="p-space-xs rounded bg-surface-container flex items-center justify-between border-l-2 border-tertiary">
<div className="flex flex-col">
<span className="text-outline text-[10px] uppercase tracking-wider">Windows W-01 → W-25</span>
<span className="text-on-surface font-medium">Nominal Baseline Envelope</span>
</div>
<span className="px-space-xs py-space-2xs rounded bg-tertiary/10 text-tertiary text-[10px] font-semibold">0.08 - 0.14</span>
</div>
<div className="p-space-xs rounded bg-surface-container-high flex items-center justify-between border-l-2 border-error">
<div className="flex flex-col">
<span className="text-error text-[10px] uppercase tracking-wider font-bold">Windows W-26 → W-31</span>
<span className="text-on-surface font-medium">Acute Inverted Burst Spike</span>
</div>
<span className="px-space-xs py-space-2xs rounded bg-error-container text-on-error-container text-[10px] font-bold">PEAK 0.91 [CRITICAL]</span>
</div>
<div className="p-space-xs rounded bg-surface-container flex items-center justify-between border-l-2 border-secondary">
<div className="flex flex-col">
<span className="text-outline text-[10px] uppercase tracking-wider">Windows W-32 → W-42</span>
<span className="text-on-surface font-medium">Post-Spike Residual Elevation</span>
</div>
<span className="px-space-xs py-space-2xs rounded bg-secondary-container text-on-secondary-container text-[10px] font-semibold">0.44 - 0.58</span>
</div>
</div>
</div>
{/* SECTION 2: Observed vs. Baseline Telemetry Matrix (Level 2) */}
<div className="flex flex-col bg-surface-container-lowest rounded border border-outline-variant/30 overflow-hidden"><div className="px-space-base py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-xs border-b border-outline-variant/20"><div className="flex items-center gap-space-sm"><span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs"><span className="material-symbols-outlined text-primary text-[18px]">table_rows</span>Observed vs. Learned Baseline Telemetry</span><span className="text-outline-variant font-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">Active Comparison Frame: <strong className="text-primary font-mono">W-28</strong> (T+02:15:00 → T+02:20:00)</span></div><div className="flex items-center gap-space-xs text-code-sm"><span className="text-outline">Statistical Mode:</span><span className="text-on-surface bg-surface-container px-space-xs py-space-2xs rounded font-mono">Student-t / 3σ Bound</span></div></div><div className="overflow-x-auto"><table className="w-full text-left font-body-sm text-body-sm border-collapse"><thead><tr className="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30 h-9 select-none"><th className="px-space-md py-space-sm font-semibold">Metric Dimension</th><th className="px-space-md py-space-sm font-semibold">Learned Baseline</th><th className="px-space-md py-space-sm font-semibold">Observed (W-28)</th><th className="px-space-md py-space-sm font-semibold">Delta / Deviation</th><th className="px-space-md py-space-sm font-semibold text-right">Risk State</th></tr></thead><tbody className="divide-y divide-outline-variant/15 text-on-surface font-mono text-code-sm"><tr className="hover:bg-surface-container transition-colors"><td className="px-space-md py-space-sm font-sans text-on-surface font-medium flex items-center gap-space-2xs"><span className="w-1.5 h-1.5 rounded-full bg-error"></span>Packet Size Variance</td><td className="px-space-md py-space-sm text-on-surface-variant">840B ± 120B</td><td className="px-space-md py-space-sm text-error font-bold bg-error/5">1,420B Fixed</td><td className="px-space-md py-space-sm text-error font-semibold">+69% MSS Saturation</td><td className="px-space-md py-space-sm text-right"><span className="px-space-xs py-space-2xs rounded bg-error-container text-on-error-container font-label-sm text-[10px] uppercase font-bold">CRITICAL</span></td></tr><tr className="hover:bg-surface-container transition-colors"><td className="px-space-md py-space-sm font-sans text-on-surface font-medium flex items-center gap-space-2xs"><span className="w-1.5 h-1.5 rounded-full bg-error"></span>Inter-Arrival Jitter</td><td className="px-space-md py-space-sm text-on-surface-variant">12.4 ms</td><td className="px-space-md py-space-sm text-error font-bold bg-error/5">0.002 ms</td><td className="px-space-md py-space-sm text-error font-semibold">Continuous Burst Lock</td><td className="px-space-md py-space-sm text-right"><span className="px-space-xs py-space-2xs rounded bg-error-container text-on-error-container font-label-sm text-[10px] uppercase font-bold">ANOMALOUS</span></td></tr><tr className="hover:bg-surface-container transition-colors"><td className="px-space-md py-space-sm font-sans text-on-surface font-medium flex items-center gap-space-2xs"><span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>Egress Throughput</td><td className="px-space-md py-space-sm text-on-surface-variant">1.2 MB/s</td><td className="px-space-md py-space-sm text-secondary font-bold">8.4 MB/s</td><td className="px-space-md py-space-sm text-secondary font-semibold">+600% Spike</td><td className="px-space-md py-space-sm text-right"><span className="px-space-xs py-space-2xs rounded bg-secondary-container text-secondary font-label-sm text-[10px] uppercase font-bold">HIGH</span></td></tr><tr className="hover:bg-surface-container transition-colors"><td className="px-space-md py-space-sm font-sans text-on-surface font-medium flex items-center gap-space-2xs"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Entropy Distribution</td><td className="px-space-md py-space-sm text-on-surface-variant">7.92 bits</td><td className="px-space-md py-space-sm text-tertiary font-medium">7.98 bits</td><td className="px-space-md py-space-sm text-tertiary">Nominal ESP Ciphertext</td><td className="px-space-md py-space-sm text-right"><span className="px-space-xs py-space-2xs rounded bg-tertiary/10 text-tertiary font-label-sm text-[10px] uppercase font-bold">NORMAL</span></td></tr><tr className="hover:bg-surface-container transition-colors"><td className="px-space-md py-space-sm font-sans text-on-surface font-medium flex items-center gap-space-2xs"><span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>SA Rekey Dispersion</td><td className="px-space-md py-space-sm text-on-surface-variant">3,600s cadence</td><td className="px-space-md py-space-sm text-secondary font-bold">Rekey Suppressed</td><td className="px-space-md py-space-sm text-secondary font-semibold">IKEv2 Timer Exceeded</td><td className="px-space-md py-space-sm text-right"><span className="px-space-xs py-space-2xs rounded bg-secondary-container text-secondary font-label-sm text-[10px] uppercase font-bold">VIOLATION</span></td></tr></tbody></table></div></div>
{/* SECTION 3: Evidence-Grounded Explainability & SHAP Attribution (Level 3) */}
<div className="flex flex-col bg-surface-container-lowest rounded p-space-md border border-outline-variant/30"><div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-md pb-space-xs border-b border-outline-variant/20"><div><span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs"><span className="material-symbols-outlined text-primary text-[18px]">psychology</span>Detection Explainability &amp; SHAP Vector Attribution</span><p className="font-body-sm text-body-sm text-outline mt-space-2xs">Mathematical breakdown of individual feature influence contributing to the combined 0.91 outlier score.</p></div><div className="flex items-center gap-space-md font-code-sm text-code-sm"><div className="hidden md:flex items-center gap-space-xs"><span className="text-outline">Algorithm:</span><span className="text-primary">TreeSHAP (150 trees)</span></div><button className="px-space-sm py-space-2xs rounded bg-surface-container-high hover:bg-surface-bright text-primary font-code-sm flex items-center gap-space-2xs transition-colors" type="button" onClick={openVectorDrawer}><span className="material-symbols-outlined text-[15px]">open_in_new</span>Open Full Feature Vector Drawer</button></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-space-md"><div className="bg-surface-container-low p-space-md rounded border border-outline-variant/20 flex flex-col justify-between gap-space-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-error text-[16px]">lock_clock</span><span className="font-headline-sm text-headline-sm text-on-surface font-medium">Continuous Flow Lock</span></div><span className="px-space-xs py-space-2xs rounded bg-error/15 text-error font-code-sm text-code-sm font-bold">+28% SHAP</span></div><div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden"><div className="bg-error h-full rounded" style={{width: '28%'}}></div></div><p className="font-body-sm text-body-sm text-on-surface-variant truncate">Uninterrupted packet stream with &lt;0.005ms jitter breaks standard human/client cadence.</p><div className="flex items-center justify-between font-code-sm text-[11px] text-outline pt-space-2xs border-t border-outline-variant/15"><span>Variance: ±3.82σ</span><span className="text-error font-medium">Primary Cadence Driver</span></div></div><div className="bg-surface-container-low p-space-md rounded border border-outline-variant/20 flex flex-col justify-between gap-space-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-secondary-fixed-dim text-[16px]">speed</span><span className="font-headline-sm text-headline-sm text-on-surface font-medium">Egress Velocity Surge</span></div><span className="px-space-xs py-space-2xs rounded bg-secondary-container text-secondary font-code-sm text-code-sm font-bold">+24% SHAP</span></div><div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden"><div className="bg-secondary-fixed-dim h-full rounded" style={{width: '24%'}}></div></div><p className="font-body-sm text-body-sm text-on-surface-variant truncate">Egress throughput accelerated to 8.4 MB/s (600% delta above 1.2 MB/s expected mean).</p><div className="flex items-center justify-between font-code-sm text-[11px] text-outline pt-space-2xs border-t border-outline-variant/15"><span>Delta: +7.2 MB/s</span><span className="text-secondary font-medium">Volume Outlier</span></div></div><div className="bg-surface-container-low p-space-md rounded border border-outline-variant/20 flex flex-col justify-between gap-space-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-primary text-[16px]">compress</span><span className="font-headline-sm text-headline-sm text-on-surface font-medium">Packet-Size Clustering</span></div><span className="px-space-xs py-space-2xs rounded bg-primary/15 text-primary font-code-sm text-code-sm font-bold">+19% SHAP</span></div><div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden"><div className="bg-primary h-full rounded" style={{width: '19%'}}></div></div><p className="font-body-sm text-body-sm text-on-surface-variant truncate">MSS rigidification collapsed packets into static 1,420B units without bimodal dispersion.</p><div className="flex items-center justify-between font-code-sm text-[11px] text-outline pt-space-2xs border-t border-outline-variant/15"><span>Size: 1,420B Fixed</span><span className="text-primary font-medium">Size Rigidification</span></div></div><div className="bg-surface-container-low p-space-md rounded border border-outline-variant/20 flex flex-col justify-between gap-space-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-outline text-[16px]">update_disabled</span><span className="font-headline-sm text-headline-sm text-on-surface font-medium">Rekey Timing Deviation</span></div><span className="px-space-xs py-space-2xs rounded bg-surface-container-high text-on-surface font-code-sm text-code-sm font-bold">+11% SHAP</span></div><div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden"><div className="bg-outline h-full rounded" style={{width: '11%'}}></div></div><p className="font-body-sm text-body-sm text-on-surface-variant truncate">IKE Security Association rekey negotiation bypassed despite high cumulative byte counter.</p><div className="flex items-center justify-between font-code-sm text-[11px] text-outline pt-space-2xs border-t border-outline-variant/15"><span>State: Expired Interval</span><span className="text-on-surface font-medium">Protocol Drift</span></div></div></div></div>
{/* UNOBTRUSIVE MODEL METADATA FOOTER */}
<details className="group bg-surface-container-lowest rounded border border-outline-variant/30 font-code-sm text-code-sm overflow-hidden"><summary className="cursor-pointer select-none p-space-sm bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between"><div className="flex items-center gap-space-sm text-on-surface-variant"><span className="material-symbols-outlined text-[16px] text-tertiary">verified</span><span className="text-outline">Model &amp; Pipeline:</span><span className="text-on-surface font-medium">Isolation Forest (150 trees)</span><span className="text-outline-variant">·</span><span className="text-primary">Edge-48h Profile</span><span className="px-space-xs py-space-2xs rounded bg-tertiary/10 text-tertiary text-[10px] font-semibold">dpdk-lcore-02</span></div><div className="flex items-center gap-space-xs text-outline text-[11px]"><span className="">Hyperparameters &amp; Provenance</span><span className="material-symbols-outlined text-[16px] transition-transform group-open:rotate-180">expand_more</span></div></summary><div className="p-space-md flex flex-wrap items-center justify-between gap-space-md border-t border-outline-variant/20 text-on-surface-variant bg-surface-container-lowest"><div className="flex flex-wrap items-center gap-space-md text-[11px]"><span className="text-outline">Samples: <code className="text-on-surface font-mono">512 (sub=0.8)</code></span><span className="text-outline-variant">|</span><span className="text-outline">Metric: <code className="text-on-surface font-mono">Mahalanobis + Tree Depth Norm</code></span><span className="text-outline-variant">|</span><span className="text-outline">Contamination: <code className="text-on-surface font-mono">0.015</code></span><span className="text-outline-variant">|</span><span className="text-outline">Baseline Volume: <code className="text-primary font-mono">14.8M packets</code></span></div><div className="text-[11px] text-tertiary flex items-center gap-space-2xs"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Ring Buffer Drops: 0</div></div></details>
</div>
</div>
</main></div>

    </div>
  );
}
