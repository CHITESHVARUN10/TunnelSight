"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBehavior } from "@/components/upload/ProgressBehavior";
export default function AnalysisProgressPage() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [terminalCleared, setTerminalCleared] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<"details" | "tty">("details");
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);
  function togglePause() {
    setIsPaused((p) => !p);
  }
  function cancelAnalysis() {
    if (window.confirm("Are you sure you want to terminate the active forensic pipeline? Intermediate memory states will be discarded.")) {
      setCancelled(true);
      router.push("/analyze");
    }
  }
  function clearTerminal() {
    setTerminalCleared(true);
  }
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <ProgressBehavior pausedRef={pausedRef} />
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span>2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button data-action="search" className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button data-action="export" className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button data-action="notifications" className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full max-w-7xl mx-auto px-space-base py-space-md gap-space-lg select-none">
{/* Subheader Operational Control Strip & File Identity */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-outline-variant/30 pb-space-md">
<div className="flex flex-wrap items-center gap-space-md min-w-0">
<div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded">
<span className="material-symbols-outlined text-primary text-[16px]">folder_zip</span>
<span className="font-code-md text-code-md text-on-surface font-semibold tracking-tight">core-dc-chicago-gw1.pcap</span>
</div>
<div className="flex items-center gap-space-sm font-code-sm text-code-sm text-on-surface-variant">
<span className="flex items-center gap-1"><span className="text-outline">VOL:</span> 1.42 GB</span>
<span className="text-outline-variant">/</span>
<span className="flex items-center gap-1"><span className="text-outline">INGEST:</span> 14:18:22 UTC</span>
<span className="text-outline-variant">/</span>
<span className="flex items-center gap-1"><span className="text-outline">SESSION:</span> #8820-A</span>
</div>
<div className="flex items-center gap-space-xs bg-surface-container-high px-space-xs py-space-2xs rounded text-label-sm font-label-sm uppercase tracking-wider text-tertiary">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
PIPELINE ACTIVE
</div>
</div>
{/* Primary Controls */}
<div className="flex items-center gap-space-xs flex-shrink-0">
<button className={`flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded text-on-surface hover:bg-surface-container-high transition-colors text-body-sm font-body-sm${isPaused ? " bg-primary-container text-on-primary-container" : ""}`} id="pauseBtn" onClick={togglePause}>
<span className="material-symbols-outlined text-[16px]" id="pauseIcon">{isPaused ? "play_arrow" : "pause"}</span>
<span id="pauseLabel">{isPaused ? "Resume" : "Pause"}</span>
</button>
<button className="flex items-center gap-space-xs bg-error-container/20 px-space-md py-space-xs rounded text-error hover:bg-error-container/40 transition-colors text-body-sm font-body-sm" onClick={cancelAnalysis}>
<span className="material-symbols-outlined text-[16px]">cancel</span>
<span>Cancel</span>
</button>
<div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div>
<button className="flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-space-xs rounded font-body-sm font-semibold hover:bg-primary-fixed transition-colors shadow-sm">
<span className="material-symbols-outlined text-[16px]">stream</span>
<span>Inspect Partial Results</span>
</button>
</div>
</div>
{/* Overall Aggregate Forensic Progress Card */}
<div className="bg-surface-container-low rounded p-space-base flex flex-col gap-space-sm">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
<div className="flex items-baseline gap-space-sm">
<span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">Forensic Decapsulation &amp; Verification</span>
<span className={`font-code-md text-code-md font-semibold ${cancelled ? "text-error" : "text-primary"}`} id="globalPercentText">{cancelled ? "PIPELINE ABORTED" : "69% COMPLETE"}</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">ETA: <span className="text-on-surface font-medium" id="etaTimer">{cancelled ? "Analysis cancelled by operator" : "~13s remaining"}</span></span>
</div>
<div className="flex items-center gap-space-lg font-code-sm text-code-sm">
<div className="flex items-center gap-space-xs">
<span className="text-outline uppercase text-label-sm font-label-sm">Throughput:</span>
<span className="text-tertiary font-semibold" id="rxRate">48,010</span>
<span className="text-on-surface-variant">pkts/sec</span>
</div>
<div className="flex items-center gap-space-xs">
<span className="text-outline uppercase text-label-sm font-label-sm">Ingested Total:</span>
<span className="text-on-surface font-semibold">842,109</span>
<span className="text-on-surface-variant">pkts</span>
</div>
</div>
</div>
{/* Progress Bar */}
<div className="w-full bg-surface-container h-1.5 rounded overflow-hidden flex">
<div className={`${cancelled ? "bg-error" : "bg-primary"} h-full transition-all duration-500 ease-out`} id="globalProgressBar" style={{width: '69%'}}></div>
<div className="bg-tertiary/40 h-full w-4 animate-pulse"></div>
</div>
</div>
{/* Multi-Pane Execution & Progressive Telemetry Grid */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg w-full">
{/* Left Column: Streamlined 11 Pipeline Stages (7 cols) */}
<div className="xl:col-span-7 flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-2xs">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Pipeline Topology</span>
<span className="text-outline-variant font-code-sm text-code-sm">/</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">11 Verification Passes</span>
</div>
<div className="flex items-center gap-space-md font-label-sm text-label-sm">
<span className="flex items-center gap-1 text-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 6 Complete</span>
<span className="flex items-center gap-1 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> 2 Running</span>
<span className="flex items-center gap-1 text-error"><span className="w-1.5 h-1.5 rounded-full bg-error"></span> 1 Warning</span>
<span className="flex items-center gap-1 text-outline"><span className="w-1.5 h-1.5 rounded-full bg-outline"></span> 2 Pending</span>
</div>
</div>
{/* Cleaned Streamlined Stages List */}
<div className="flex flex-col gap-space-2xs">
{/* Stage 01 */}
<div className="bg-surface-container-low rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm hover:bg-surface-container transition-colors cursor-pointer">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline font-semibold w-6">01</span>
<span className="font-body-md text-body-md text-on-surface font-medium truncate">PCAP Ingestion &amp; Magic Header Verification</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">112ms</span>
<span className="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">COMPLETE</span>
</div>
</div>
{/* Stage 02 */}
<div className="bg-surface-container-low rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm hover:bg-surface-container transition-colors cursor-pointer">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline font-semibold w-6">02</span>
<span className="font-body-md text-body-md text-on-surface font-medium truncate">DPDK Packet Parsing &amp; Framing</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">480ms</span>
<span className="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">COMPLETE</span>
</div>
</div>
{/* Stage 03 */}
<div className="bg-surface-container-low rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm hover:bg-surface-container transition-colors cursor-pointer">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline font-semibold w-6">03</span>
<span className="font-body-md text-body-md text-on-surface font-medium truncate">IKE Detection &amp; SA Handshake Extraction</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">210ms</span>
<span className="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">COMPLETE</span>
</div>
</div>
{/* Stage 04 */}
<div className="bg-surface-container-low rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm hover:bg-surface-container transition-colors cursor-pointer">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline font-semibold w-6">04</span>
<span className="font-body-md text-body-md text-on-surface font-medium truncate">ESP/AH Decapsulation &amp; Integrity Inspection</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">1.84s</span>
<span className="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">COMPLETE</span>
</div>
</div>
{/* Stage 05 */}
<div className="bg-surface-container-low rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm hover:bg-surface-container transition-colors cursor-pointer">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline font-semibold w-6">05</span>
<span className="font-body-md text-body-md text-on-surface font-medium truncate">IPsec Protocol Normalization</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">340ms</span>
<span className="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">COMPLETE</span>
</div>
</div>
{/* Stage 06: WARNING with single clean summary line and clickable action */}
<div className="bg-surface-container rounded px-space-md py-space-xs flex flex-col gap-1 hover:bg-surface-container-high transition-colors cursor-pointer">
<div className="flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-error font-semibold w-6">06</span>
<div className="flex items-center gap-space-xs truncate">
<span className="font-body-md text-body-md text-on-surface font-medium truncate">Deterministic Security Assessment</span>
<span className="material-symbols-outlined text-error text-[16px]">warning</span>
</div>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">590ms</span>
<span className="bg-error-container/30 text-error font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">WARNING</span>
</div>
</div>
<div className="flex items-center justify-between text-code-sm font-code-sm pl-8 text-error">
<span className="truncate">Weak MODP-1024 / DH Group 2 flagged in 3 proposals</span>
<span className="text-primary hover:text-on-surface flex items-center gap-0.5 text-label-sm font-label-sm flex-shrink-0">View Evidence <span className="material-symbols-outlined text-[14px]">arrow_forward</span></span>
</div>
</div>
{/* Stage 07 */}
<div className="bg-surface-container-low rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm hover:bg-surface-container transition-colors cursor-pointer">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline font-semibold w-6">07</span>
<span className="font-body-md text-body-md text-on-surface font-medium truncate">Encrypted Flow Segmentation &amp; Windowing</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">620ms</span>
<span className="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">COMPLETE</span>
</div>
</div>
{/* Stage 08: ACTIVE / INSPECTED STAGE */}
<div className="bg-surface-container-high rounded px-space-md py-space-xs flex flex-col gap-1 transition-colors cursor-pointer">
<div className="flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-primary font-bold w-6">08</span>
<span className="font-body-md text-body-md text-on-surface font-semibold truncate">ML Encrypted Traffic Classification</span>
<span className="bg-surface-container-highest text-primary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider hidden sm:inline">INSPECTION ACTIVE</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-primary font-medium">71%</span>
<span className="bg-primary/20 text-primary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> RUNNING
</span>
</div>
</div>
<div className="w-full bg-surface-container-lowest h-1 rounded overflow-hidden mt-0.5">
<div className="bg-primary h-full transition-all duration-300" style={{width: '71%'}}></div>
</div>
</div>
{/* Stage 09: RUNNING */}
<div className="bg-surface-container rounded px-space-md py-space-xs flex flex-col gap-1 hover:bg-surface-container-high transition-colors cursor-pointer">
<div className="flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline font-bold w-6">09</span>
<span className="font-body-md text-body-md text-on-surface font-medium truncate">Anomaly &amp; Tunnel Sequence Detection</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="font-code-sm text-code-sm text-primary font-medium">42%</span>
<span className="bg-primary/20 text-primary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> RUNNING
</span>
</div>
</div>
<div className="w-full bg-surface-container-lowest h-1 rounded overflow-hidden mt-0.5">
<div className="bg-primary/80 h-full transition-all duration-300" style={{width: '42%'}}></div>
</div>
</div>
{/* Stage 10: PENDING */}
<div className="bg-surface-container-low/50 rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm opacity-60">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline w-6">10</span>
<span className="font-body-md text-body-md text-on-surface truncate">Evidence-Grounded AI Explanation</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="bg-surface-container-highest text-outline font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">PENDING</span>
</div>
</div>
{/* Stage 11: PENDING */}
<div className="bg-surface-container-low/50 rounded px-space-md py-space-xs flex items-center justify-between gap-space-sm opacity-60">
<div className="flex items-center gap-space-sm min-w-0">
<span className="font-code-sm text-code-sm text-outline w-6">11</span>
<span className="font-body-md text-body-md text-on-surface truncate">RFC Forensic Audit &amp; Report Generation</span>
</div>
<div className="flex items-center gap-space-md flex-shrink-0">
<span className="bg-surface-container-highest text-outline font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase tracking-wider">PENDING</span>
</div>
</div>
</div>
</div>
{/* Right Column: Focused Telemetry & Progressive Detail Inspection (5 cols) */}
<div className="xl:col-span-5 flex flex-col gap-space-md">
{/* Essential 4-Card Forensic Metric Summary */}
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between pb-space-2xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Live Pipeline Metrics</span>
<span className="font-code-sm text-code-sm text-tertiary font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> DPDK BUS ACTIVE
</span>
</div>
<div className="grid grid-cols-2 gap-space-xs">
<div className="bg-surface-container p-space-sm rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase truncate">Packets Processed</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">842,109</span>
<span className="font-code-sm text-code-sm text-tertiary mt-0.5">96.4% ESP Payload</span>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase truncate">Encrypted Flows</span>
<span className="font-headline-sm text-headline-sm text-primary font-bold mt-1">24 Flows</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-0.5">5s Window Size</span>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase truncate">Anomaly Flags</span>
<span className="font-headline-sm text-headline-sm text-error font-bold mt-1">3 Flagged</span>
<span className="font-code-sm text-code-sm text-error mt-0.5">1 High, 2 Moderate</span>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase truncate">RX Throughput</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">48.0k <span className="text-body-sm font-normal text-on-surface-variant">pkts/s</span></span>
<span className="font-code-sm text-code-sm text-tertiary mt-0.5">0 Frame Drops</span>
</div>
</div>
</div>
{/* Progressive Stage Detail Drawer / Inspection Pane for Stage 08 */}
<div className="bg-surface-container-low rounded p-space-sm flex flex-col gap-space-sm flex-1">
<div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">insights</span>
<span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Stage 08 Inspection: ML Classification</span>
</div>
<div className="flex items-center gap-space-xs">
<button className={inspectorTab === "details" ? "px-space-xs py-space-2xs text-label-sm font-label-sm rounded bg-surface-container text-primary font-medium" : "px-space-xs py-space-2xs text-label-sm font-label-sm rounded text-outline hover:text-on-surface transition-colors"} onClick={() => setInspectorTab("details")}>Stage Details</button>
<button className={inspectorTab === "tty" ? "px-space-xs py-space-2xs text-label-sm font-label-sm rounded bg-surface-container text-primary font-medium" : "px-space-xs py-space-2xs text-label-sm font-label-sm rounded text-outline hover:text-on-surface transition-colors"} onClick={() => setInspectorTab("tty")}>Live TTY</button>
</div>
</div>
{/* Stage 08 Telemetry & Feature Progress */}
<div className="grid grid-cols-2 gap-space-xs">
<div className="bg-surface-container px-space-sm py-space-xs rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase">Feature Vectors</span>
<span className="font-code-md text-code-md text-on-surface font-bold mt-0.5">184 / 256</span>
<span className="font-code-sm text-code-sm text-primary">71.8% Converged</span>
</div>
<div className="bg-surface-container px-space-sm py-space-xs rounded flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase">Inferred Overlay</span>
<span className="font-code-md text-code-md text-tertiary font-bold mt-0.5">WireGuard/ESP</span>
<span className="font-code-sm text-code-sm text-tertiary">98.2% Confidence</span>
</div>
</div>
{/* Shannon Byte Entropy Quick Glance */}
<div className="bg-surface-container px-space-sm py-space-xs rounded flex flex-col gap-1">
<div className="flex items-center justify-between text-label-sm font-label-sm">
<span className="text-outline uppercase">Entropy Variance (ESP Windows)</span>
<span className="font-code-sm text-code-sm text-tertiary">7.994 bits/byte (Nominal AES-GCM)</span>
</div>
<div className="h-4 w-full flex items-end gap-1 pt-1">
<div className="flex-1 bg-tertiary-container/50 rounded-t h-full"></div>
<div className="flex-1 bg-tertiary-container/60 rounded-t h-full"></div>
<div className="flex-1 bg-tertiary-container/70 rounded-t h-full"></div>
<div className="flex-1 bg-tertiary-container/80 rounded-t h-full"></div>
<div className="flex-1 bg-error/60 rounded-t h-2/3" title="Entropy Dip in Flow #08"></div>
<div className="flex-1 bg-tertiary-container/90 rounded-t h-full"></div>
<div className="flex-1 bg-tertiary h-full rounded-t"></div>
<div className="flex-1 bg-tertiary h-full rounded-t"></div>
</div>
</div>
{/* Worker Execution Stream TTY Log (Streamlined) */}
<div className="bg-surface-container-lowest rounded p-space-sm flex flex-col flex-1 min-h-[220px]">
<div className="flex items-center justify-between pb-space-2xs mb-space-2xs border-b border-outline-variant/30">
<div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm uppercase tracking-wider">
<span className="material-symbols-outlined text-[14px]">terminal</span>
<span>Worker Stream (4 Cores)</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
<span className="text-primary font-medium text-label-sm">LIVE</span>
<button className="text-outline hover:text-on-surface text-label-sm ml-2" onClick={clearTerminal}>CLEAR</button>
</div>
</div>
<div className="flex-1 font-code-sm text-code-sm overflow-y-auto space-y-1 text-on-surface-variant select-text pr-1" id="terminalStream">
{!terminalCleared && <>
<div className="text-outline">14:18:22.004 [system] Initiated DPDK ring buffer bind on core [0,1,2,3]</div>
<div className="text-on-surface">14:18:22.380 [worker-01] IKE_SA_INIT detected: SPIi=0x8fa10c0291, SPIr=0x0000000000</div>
<div className="text-error font-medium">14:18:22.990 [worker-02] WARN: Fallback SA proposal contains MODP-1024 (Group 2)</div>
<div className="text-on-surface">14:18:23.511 [worker-03] ESP SPI 0x41f89c02: sequence counter 1042 verified</div>
<div className="text-primary font-medium">14:18:24.015 [ml-worker-1] Feature vector compiled: flow #08, entropy=7.998</div>
<div className="text-tertiary">14:18:24.320 [ml-worker-2] Traffic category: IPsec/WireGuard overlay (98.2%)</div>
</>}
<div className="text-primary animate-pulse" id="terminalLiveLine">14:18:24.712 [worker-02] Sequence counter initialized. Window check running...</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main></div>
    </div>
  );
}
