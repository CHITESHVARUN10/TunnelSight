"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/mock/toast";

export default function SearchOverlayPage() {
  const [query, setQuery] = useState("branch");
  const [paletteOpen, setPaletteOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();
  const openResult = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.currentTarget.textContent ?? "";
    if (t.includes("Weak Diffie-Hellman") || t.includes("PFS Disabled")) router.push("/analysis/findings");
    else if (t.includes(".pdf")) router.push("/analysis/reports");
    else router.push("/analysis/results");
  };
  const scopeToast = (e: React.MouseEvent<HTMLButtonElement>) => {
    const label = (e.currentTarget.textContent ?? "").replace(/[0-9]/g, "").trim();
    toast({ title: `Scope: ${label}`, body: "Result scope filter staged (mock).", kind: "info" });
  };

  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.focus();
      try {
        el.setSelectionRange(el.value.length, el.value.length);
      } catch {
        // non-text input types may throw; ignore
      }
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPaletteOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span>2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button data-action="search" className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button data-action="export" className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button data-action="notifications" className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full relative">
{/* Underlay Mockup: Authentic SecOps Background Workbench (Dimmed & Blurred) */}
<div className="w-full pointer-events-none select-none opacity-40 filter blur-[2px] transition-opacity">
<div className="p-space-base flex flex-col gap-space-base max-w-7xl mx-auto">
{/* Background Stats Row */}
<div className="grid grid-cols-4 gap-space-md">
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span>Active IKEv2 SAs</span>
<span className="material-symbols-outlined text-primary text-[16px]">key</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface">148 <span className="font-code-sm text-code-sm text-tertiary font-normal">↑ 4%</span></div>
<span className="font-code-sm text-code-sm text-outline">Negotiation latency: 24.1ms</span>
</div>
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span>ESP Throughput</span>
<span className="material-symbols-outlined text-primary text-[16px]">speed</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface">4.82 <span className="font-code-sm text-code-sm text-on-surface-variant font-normal">Gbps</span></div>
<span className="font-code-sm text-code-sm text-outline">Drop/Corrupt rate: 0.000%</span>
</div>
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span>Compliance Violations</span>
<span className="material-symbols-outlined text-error text-[16px]">gpp_maybe</span>
</div>
<div className="font-headline-lg text-headline-lg text-error">12 <span className="font-code-sm text-code-sm text-error font-normal">P0 / P1</span></div>
<span className="font-code-sm text-code-sm text-outline">RFC 8247 Non-conformant</span>
</div>
<div className="bg-surface-container-low p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span>Capture Replay Buffer</span>
<span className="material-symbols-outlined text-primary text-[16px]">memory</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface">38.4 <span className="font-code-sm text-code-sm text-on-surface-variant font-normal">GiB</span></div>
<span className="font-code-sm text-code-sm text-tertiary">RingBuffer Ready (Core 0)</span>
</div>
</div>
{/* Background Capture Table Skeleton */}
<div className="bg-surface-container-low rounded p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between py-space-2xs">
<div className="font-headline-sm text-headline-sm text-on-surface">Operational Capture Stream</div>
<div className="font-code-sm text-code-sm text-outline">Ingest: Interface eth1.400</div>
</div>
<div className="bg-surface-container-highest h-6 rounded w-full opacity-60"></div>
<div className="bg-surface-container h-8 rounded w-full"></div>
<div className="bg-surface-container h-8 rounded w-full"></div>
<div className="bg-surface-container h-8 rounded w-full"></div>
</div>
</div>
</div>
{/* Global Modal Layer Overlay */}
<div className={`fixed inset-0 top-header-height left-sidebar-expanded z-50 flex items-start justify-center pt-8 px-space-base bg-surface-container-lowest/85${paletteOpen ? "" : " opacity-0 pointer-events-none"}`} id="palette-backdrop" onClick={(e) => { if (!(e.target as HTMLElement).closest("#command-modal")) setPaletteOpen(false); }}>
{/* Command Palette Container (Centered & Elevated) */}
<div className="w-full max-w-[760px] bg-surface-container-low rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all" id="command-modal">
{/* Top Primary Search Bar */}
<div className="p-space-base pb-space-sm flex flex-col gap-space-sm bg-surface-container-low">
<div className="flex items-center gap-space-sm bg-surface-container-lowest rounded-lg px-space-md py-2.5">
<span className="material-symbols-outlined text-primary text-[22px] select-none">search</span>
<input autoFocus ref={inputRef} className="w-full bg-transparent border-0 p-0 font-code-md text-code-md text-on-surface placeholder:text-outline focus:outline-none tracking-tight" id="search-input" placeholder="Search captures, tunnels, SPI (0x...), RFC findings, reports…" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
<div className="flex items-center gap-space-xs select-none">
<button className="flex items-center justify-center w-5 h-5 rounded bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors" id="clear-search-btn" title="Clear query" onClick={handleClear}>
<span className="material-symbols-outlined text-[14px]">close</span>
</button>
<div className="flex items-center gap-1 bg-surface-container-high px-space-xs py-space-2xs rounded">
<span className="font-code-sm text-code-sm text-outline uppercase font-semibold">ESC</span>
</div>
</div>
</div>
{/* Scope & Category Filter Chips */}
<div className="flex items-center gap-space-xs overflow-x-auto pb-1 select-none">
<button className="flex items-center gap-1.5 px-space-sm py-space-2xs rounded text-on-primary-container bg-primary-container font-label-md text-label-md transition-colors" onClick={scopeToast}>
<span>All Results</span>
<span className="font-code-sm text-code-sm opacity-80">37</span>
</button>
<button className="flex items-center gap-1.5 px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high font-label-md text-label-md transition-colors" onClick={scopeToast}>
<span>Captures</span>
<span className="font-code-sm text-code-sm text-primary font-medium">14</span>
</button>
<button className="flex items-center gap-1.5 px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high font-label-md text-label-md transition-colors" onClick={scopeToast}>
<span>Findings</span>
<span className="font-code-sm text-code-sm text-error font-medium">8</span>
</button>
<button className="flex items-center gap-1.5 px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high font-label-md text-label-md transition-colors" onClick={scopeToast}>
<span>VPNs</span>
<span className="font-code-sm text-code-sm text-outline">4</span>
</button>
<button className="flex items-center gap-1.5 px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high font-label-md text-label-md transition-colors" onClick={scopeToast}>
<span>SPI</span>
<span className="font-code-sm text-code-sm text-tertiary">6</span>
</button>
<button className="flex items-center gap-1.5 px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high font-label-md text-label-md transition-colors" onClick={scopeToast}>
<span>Reports</span>
<span className="font-code-sm text-code-sm text-outline">5</span>
</button>
</div>
</div>
{/* Results Ledger Body */}
<div className="max-h-[593px] overflow-y-auto px-space-base py-space-xs flex flex-col gap-space-md" id="results-container">
{/* SECTION 1: CAPTURES */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between px-space-xs py-1">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Captures (PCAP / PCAPNG)</span>
<span className="font-code-sm text-code-sm text-outline">Matches in filename &amp; IP</span>
</div>
{/* Item 1: Selected State */}
<div className="group relative flex items-center justify-between p-space-sm rounded-lg bg-surface-container cursor-pointer transition-all" onClick={openResult}>
{/* Left active indicator marker */}
<div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r"></div>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-surface-container-highest text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">receipt_long</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-code-md text-code-md text-on-surface font-semibold truncate"><mark className="bg-primary/20 text-primary font-semibold">branch</mark>-emea-gw04.pcap</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">PCAP</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-error-container/30 text-error font-semibold">SCORE 61 · HIGH RISK</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span className="text-on-surface">IKEv2/Tunnel</span>
<span className="text-outline">·</span>
<span>192.0.2.14 ↔ 198.51.100.8</span>
<span className="text-outline">·</span>
<span className="text-outline">18m ago by j.chen</span>
</div>
</div>
</div>
{/* Action Keys Preview on Hover/Selection */}
<div className="flex items-center gap-space-xs shrink-0 pl-space-sm">
<div className="flex items-center gap-1 bg-surface-container-highest px-space-xs py-0.5 rounded text-outline font-code-sm text-code-sm">
<span>↵ Open</span>
</div>
<div className="flex items-center gap-1 bg-surface-container-highest px-space-xs py-0.5 rounded text-outline font-code-sm text-code-sm">
<span>Tab Inspect</span>
</div>
</div>
</div>
{/* Item 2 */}
<div className="group flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors" onClick={openResult}>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-surface-container text-on-surface-variant group-hover:text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">file_open</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-code-md text-code-md text-on-surface truncate">edge-<mark className="bg-primary/20 text-primary font-semibold">branch</mark>-tokyo-02.pcapng</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">PCAPNG</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-tertiary-container/30 text-tertiary font-semibold">SCORE 88 · PASS</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span>IKEv2/Transport</span>
<span className="text-outline">·</span>
<span>203.0.113.50 ↔ 198.51.100.1</span>
<span className="text-outline">·</span>
<span className="text-outline">Analyzed 2h ago</span>
</div>
</div>
</div>
<div className="hidden group-hover:flex items-center gap-space-xs shrink-0 pl-space-sm font-code-sm text-code-sm text-outline">
<span>↵ Open</span>
</div>
</div>
</div>
{/* SECTION 2: FINDINGS */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between px-space-xs py-1">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Findings &amp; Cryptographic Posture</span>
<span className="font-code-sm text-code-sm text-error">2 RFC Non-Conformances</span>
</div>
{/* Finding Item 1 */}
<div className="group flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors" onClick={openResult}>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-error-container/20 text-error shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">security_update_warning</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface truncate">Weak Diffie-Hellman Group 2 (MODP-1024)</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-error-container text-error font-semibold uppercase">P0 CRITICAL</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span className="text-error">RFC 8247 § 2.4 Violation</span>
<span className="text-outline">·</span>
<span>Affected: <span className="text-on-surface font-medium"><mark className="bg-primary/20 text-primary font-semibold">branch</mark>-emea-gw04</span>, legacy-radius, dc-west-vpn</span>
</div>
</div>
</div>
<div className="hidden group-hover:flex items-center gap-space-xs shrink-0 pl-space-sm font-code-sm text-code-sm text-outline">
<span>Inspect finding</span>
</div>
</div>
{/* Finding Item 2 */}
<div className="group flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors" onClick={openResult}>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-surface-container-highest text-on-surface-variant group-hover:text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">warning</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface truncate">PFS Disabled on CHILD_SA (Phase 2 Rekey)</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface font-semibold uppercase">P1 HIGH</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span>5 captures affected</span>
<span className="text-outline">·</span>
<span>No ephemeral key exchange in <mark className="bg-primary/20 text-primary font-semibold">branch</mark> profile</span>
</div>
</div>
</div>
</div>
</div>
{/* SECTION 3: VPNs & TUNNELS */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between px-space-xs py-1">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Configured Gateways &amp; Tunnels</span>
<span className="font-code-sm text-code-sm text-outline">IPsec Topology</span>
</div>
<div className="group flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors" onClick={openResult}>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-surface-container text-on-surface-variant group-hover:text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-code-md text-code-md text-on-surface font-semibold">tun-emea-gw04-core</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-tertiary-container/20 text-tertiary font-semibold uppercase">ESTABLISHED</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span>192.0.2.14 (<mark className="bg-primary/20 text-primary font-semibold">Branch</mark>-Frankfurt) ↔ 198.51.100.8 (HQ-Primary)</span>
<span className="text-outline">·</span>
<span className="text-outline">AES-CBC-128 / SHA256</span>
</div>
</div>
</div>
<div className="hidden group-hover:flex items-center gap-space-xs shrink-0 pl-space-sm font-code-sm text-code-sm text-outline">
<span>View Tunnel</span>
</div>
</div>
</div>
{/* SECTION 4: SPI (SECURITY PARAMETER INDEX) */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between px-space-xs py-1">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">SPI (Security Parameter Indexes)</span>
<span className="font-code-sm text-code-sm text-primary">In-Memory Hash Matches</span>
</div>
{/* SPI Item 1 */}
<div className="group flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors" onClick={openResult}>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-surface-container text-tertiary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">tag</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-code-md text-code-md text-tertiary font-bold tracking-wider">0x7a89f31c</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant uppercase">Inbound SA</span>
<span className="font-code-sm text-code-sm text-outline">In: <mark className="bg-primary/20 text-primary font-semibold">branch</mark>-emea-gw04.pcap</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span>ESP_AES_GCM_16_256</span>
<span className="text-outline">·</span>
<span>Sequence Window: 64</span>
<span className="text-outline">·</span>
<span>Pkt Count: 148,209</span>
</div>
</div>
</div>
<div className="hidden group-hover:flex items-center gap-space-xs shrink-0 pl-space-sm font-code-sm text-code-sm text-outline">
<span>Jump to Hex</span>
</div>
</div>
{/* SPI Item 2 */}
<div className="group flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors" onClick={openResult}>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-surface-container text-on-surface-variant group-hover:text-tertiary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">tag</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-code-md text-code-md text-on-surface font-bold tracking-wider">0xd411e89b</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant uppercase">Outbound SA</span>
<span className="font-code-sm text-code-sm text-outline">In: <mark className="bg-primary/20 text-primary font-semibold">branch</mark>-emea-gw04.pcap</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span>ESP_AES_GCM_16_256</span>
<span className="text-outline">·</span>
<span>Associated Peer: 198.51.100.8</span>
</div>
</div>
</div>
</div>
</div>
{/* SECTION 5: REPORTS & AUDIT EVIDENCE */}
<div className="flex flex-col gap-1 pb-space-sm">
<div className="flex items-center justify-between px-space-xs py-1">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Reports &amp; Exported Audits</span>
<span className="font-code-sm text-code-sm text-outline">Signed Forensics</span>
</div>
{/* Report Item 1 */}
<div className="group flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors" onClick={openResult}>
<div className="flex items-start gap-space-sm pl-2 min-w-0">
<div className="p-1.5 rounded bg-surface-container text-on-surface-variant group-hover:text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center gap-space-xs">
<span className="font-code-md text-code-md text-on-surface font-semibold truncate"><mark className="bg-primary/20 text-primary font-semibold">branch</mark>-emea-security-assessment.pdf</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">PDF</span>
<span className="px-1.5 py-0.5 rounded font-label-sm text-label-sm bg-tertiary-container/20 text-tertiary">ED25519 SIGNED</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant truncate">
<span>Executive Cryptographic Posture</span>
<span className="text-outline">·</span>
<span>2.4 MB</span>
<span className="text-outline">·</span>
<span className="text-outline">Oct 22, 2025</span>
</div>
</div>
</div>
<div className="hidden group-hover:flex items-center gap-space-xs shrink-0 pl-space-sm font-code-sm text-code-sm text-outline">
<span>Download</span>
</div>
</div>
</div>
</div>
{/* Command Palette Terminal Footer */}
<div className="bg-surface-container-lowest px-space-base py-space-sm flex items-center justify-between select-none">
{/* Keyboard shortcuts */}
<div className="flex items-center gap-space-md font-code-sm text-code-sm text-outline">
<div className="flex items-center gap-1">
<kbd className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">↑</kbd>
<kbd className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">↓</kbd>
<span>Navigate</span>
</div>
<div className="flex items-center gap-1">
<kbd className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">↵</kbd>
<span>Select</span>
</div>
<div className="flex items-center gap-1">
<kbd className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">Esc</kbd>
<span>Dismiss</span>
</div>
<div className="hidden sm:flex items-center gap-1">
<kbd className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">⌘P</kbd>
<span>Direct PCAP</span>
</div>
</div>
{/* Telemetry sync indicator */}
<div className="flex items-center gap-space-xs font-code-sm text-code-sm">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
<span className="text-on-surface-variant">Index Synced: <span className="text-on-surface font-medium">1,428 traces</span> · <span className="text-primary font-medium">4,891 SPIs</span></span>
</div>
</div>
</div>
</div>
</div>
</main></div>
    </div>
  );
}
