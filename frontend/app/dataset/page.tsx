"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";

export default function DatasetPage() {
  const [activeProfile, setActiveProfile] = useState("modern-strong");
  const [isCapturing, setIsCapturing] = useState(true);
  const [inspect, setInspect] = useState({
    open: false,
    filename: "synth-modern-01.pcap",
    sha: "3d120a48b59fa876428e3b1c90ae7b12",
    split: "70% Train / 15% Val / 15% Test",
  });
  const [stanzaApplied, setStanzaApplied] = useState(false);
  const [livePkts, setLivePkts] = useState(412890);
  const stanzaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const t = setInterval(() => {
      if (isCapturing) {
        setLivePkts((p) => p + Math.floor(Math.random() * 80) + 40);
      }
    }, 1200);
    return () => clearInterval(t);
  }, [isCapturing]);
  const openInspect = (filename: string, sha: string, split: string) =>
    setInspect({ open: true, filename, sha, split });
  const closeInspect = () => setInspect((s) => ({ ...s, open: false }));
  const toast = useToast();
  const handleApplyStanza = () => {
    setStanzaApplied(true);
    toast({ title: "Stanza applied", body: "Profile stanza loaded into GW-A & GW-B (mock).", kind: "ok" });
    if (stanzaTimer.current) clearTimeout(stanzaTimer.current);
    stanzaTimer.current = setTimeout(() => setStanzaApplied(false), 2400);
  };
  const INSPECT_META: Record<string, { sha: string; split: string }> = {
    "synth-modern-01.pcap": { sha: "3d120a48b59fa876428e3b1c90ae7b12", split: "70% Train / 15% Val / 15% Test" },
    "weak-vpn-07.pcap": { sha: "7f892a01d9f48209bb31aa49c42b490f", split: "80% Train / 20% Anomaly Test" },
    "ipv6-transit-03.pcap": { sha: "e82103ba7802fdca981245011cb9304", split: "70% Train / 15% Val / 15% Test" },
    "bulk-sftp-highburst.parquet": { sha: "1a44c9b2e04319803bf39d019488d1", split: "Columnar Partitioned" },
    "live-session-capture-active.pcap": { sha: "Computing on stream close...", split: "In-flight Capture Buffer" },
  };
  const rowFilename = (el: HTMLElement) => {
    const m = (el.closest("tr")?.textContent ?? "").match(/[\w\-]+\.(?:pcap|parquet|pcapng)/);
    return m?.[0] ?? "synth-modern-01.pcap";
  };
  const openInspectRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const f = rowFilename(e.currentTarget);
    const meta = INSPECT_META[f] ?? { sha: "", split: "" };
    openInspect(f, meta.sha, meta.split);
  };
  const downloadRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const f = rowFilename(e.currentTarget);
    const meta = INSPECT_META[f] ?? { sha: "", split: "" };
    downloadFile(`${f}.sha256.json`, JSON.stringify({ file: f, sha256: meta.sha, split: meta.split }, null, 2), "application/json");
    toast({ title: "Artifact download started", body: `${f} manifest downloaded (mock).`, kind: "ok" });
  };
  const haltCapture = () => {
    setIsCapturing(false);
    toast({ title: "Live capture halted", body: "Streaming TAP paused (mock).", kind: "warn" });
  };
  const syncGateways = () => toast({ title: "Gateway states synced", body: "GW-A & GW-B synchronized (mock).", kind: "ok" });
  const exportArtifacts = () => {
    downloadFile("dataset-export-manifest.json", JSON.stringify({ datasets: Object.keys(INSPECT_META), exported: new Date().toISOString() }, null, 2), "application/json");
    toast({ title: "Export started", body: ".pcap/.parquet manifest downloaded (mock).", kind: "ok" });
  };
  const resetHarness = () => toast({ title: "Harness reset", body: "Testbed harness reset to defaults (mock).", kind: "info" });
  const generateTraffic = () => {
    setLivePkts((p) => p + 5000);
    toast({ title: "Traffic generation started", body: "Synthetic flows injected into TAP (mock).", kind: "ok" });
  };
  const configureStream = () => toast({ title: "Custom stream", body: "Stream designer opened (mock).", kind: "info" });
  const exportArchive = () => {
    downloadFile(`${inspect.filename}.sha256.json`, JSON.stringify({ file: inspect.filename, sha256: inspect.sha, split: inspect.split }, null, 2), "application/json");
    toast({ title: "Archive exported", body: `${inspect.filename} manifest downloaded (mock).`, kind: "ok" });
  };
  const pageToast = () => toast({ title: "Pagination", body: "Additional pages are mocked in this prototype.", kind: "info" });
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span>2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button data-action="search" className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button data-action="export" className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button data-action="notifications" className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full">

{/* Section 1: Top Header Bar / Lab Breadcrumb & Primary Command Strip */}
<header className="px-space-base py-space-sm bg-surface-container-lowest flex flex-col xl:flex-row xl:items-center justify-between gap-space-sm select-none">
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
<span className="text-on-surface-variant">Testbed Laboratory</span>
<span>/</span>
<span className="text-on-surface-variant">Hardware-in-the-Loop Harness</span>
<span>/</span>
<span className="text-primary font-medium">IPsec Synth-01</span>
<span className="bg-surface-container-high text-tertiary px-space-xs py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider">ONLINE TAP</span>
</div>
<div className="flex items-baseline gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">Dataset Curation &amp; IPsec Testbed Console</h1>
<span className="font-code-sm text-code-sm text-outline hidden md:inline">DPDK RX Ring: 0% Drops</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-4xl truncate">
        Simulated &amp; Hardware-Accelerated Gateway Posture Testing, Synthetic Flow Injection &amp; RFC Validation Dataset Generation
      </p>
</div>
{/* Right Controls / Lab Dispatch Buttons */}
<div className="flex flex-wrap items-center gap-space-xs xl:justify-end">
<button className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-code-sm text-code-sm rounded transition-colors" id="btn-sync-gw" type="button" onClick={syncGateways}>
<span className="material-symbols-outlined text-[16px] text-outline">sync</span>
<span>Sync GW States</span>
</button>
<button className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-code-sm text-code-sm rounded transition-colors" id="btn-export-pcap" type="button" onClick={exportArtifacts}>
<span className="material-symbols-outlined text-[16px] text-outline">file_download</span>
<span>Export (.pcap/.parquet)</span>
</button>
<button className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container hover:bg-surface-container-high text-error font-code-sm text-code-sm rounded transition-colors" id="btn-reset-harness" type="button" onClick={resetHarness}>
<span className="material-symbols-outlined text-[16px]">restart_alt</span>
<span>Reset Harness</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-space-xs bg-secondary-container hover:bg-surface-bright text-on-surface font-code-sm text-code-sm font-medium rounded transition-colors" id="btn-traffic-synth" type="button" onClick={generateTraffic}>
<span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
<span>Generate Traffic</span>
</button>
<button className={isCapturing ? "flex items-center gap-space-xs px-space-md py-space-xs bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-semibold rounded hover:bg-primary transition-colors shadow-sm" : "flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-highest text-on-surface font-headline-sm text-headline-sm font-semibold rounded hover:bg-primary transition-colors shadow-sm"} id="btn-capture-toggle" type="button" onClick={() => { setIsCapturing((v) => !v); toast({ title: "Capture toggled", body: "Streaming TAP state flipped (mock).", kind: "info" }); }}>
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-primary-container opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-on-primary-container"></span>
</span>
<span id="capture-label">{isCapturing ? "Capture Engaged" : "Capture Paused"}</span>
</button>
</div>
</header>
{/* Section 2: Analytical Status Row — Testbed Status & Gateway Rig Split Panel */}
<section className="p-space-xl bg-surface flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-sm">
<div className="p-1.5 rounded bg-surface-container-highest flex items-center justify-center"><span className="material-symbols-outlined text-primary text-[20px]">tune</span></div>
<div>
<div className="flex items-center gap-space-xs">
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Preset Posture &amp; Vulnerability Injection Profiles</h2>
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">(4 Curated Modes)</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Select crypto negotiation profile to simulate RFC compliance or active protocol downgrade attacks</p>
</div>
</div>
<div className="flex items-center gap-space-xs">
<button className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-primary font-code-sm text-code-sm rounded flex items-center gap-1.5 transition-colors" id="btn-apply-stanza" type="button" onClick={handleApplyStanza}>
{stanzaApplied ? (<><span className="material-symbols-outlined text-[14px] text-tertiary">check</span><span className="text-tertiary">Applied to GW-A &amp; GW-B</span></>) : (<><span className="material-symbols-outlined text-[16px]">terminal</span><span>Load into Harness &amp; Apply Stanza</span></>)}
</button>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md" id="profiles-container">
<div className={activeProfile === "modern-strong" ? "profile-card cursor-pointer p-space-md rounded bg-surface-container-high ring-1 ring-primary flex flex-col justify-between gap-space-sm transition-all shadow-sm" : "profile-card cursor-pointer p-space-md rounded bg-surface-container hover:bg-surface-container-high flex flex-col justify-between gap-space-sm transition-all shadow-sm"} data-profile-id="modern-strong" onClick={() => setActiveProfile("modern-strong")}>
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-code-sm text-code-sm font-semibold text-primary">01. Modern/Strong</span>
<span className="px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm uppercase font-bold">ACTIVE</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-1">AES-256-GCM</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">ECP-384 (Group 20) · SHA-384 PRF</div>
<p className="font-body-sm text-body-sm text-outline pt-1">CNSA 1.0 / FIPS compliant high-assurance posture.</p>
</div>
<div className="pt-space-xs border-t border-surface-container-highest flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span className="text-tertiary font-semibold">CNSA 1.0</span>
<span className="text-primary font-code-sm text-code-sm">Applied</span>
</div>
</div>
<div className={activeProfile === "aes128-cbc" ? "profile-card cursor-pointer p-space-md rounded bg-surface-container-high ring-1 ring-primary flex flex-col justify-between gap-space-sm transition-all shadow-sm" : "profile-card cursor-pointer p-space-md rounded bg-surface-container hover:bg-surface-container-high flex flex-col justify-between gap-space-sm transition-all"} data-profile-id="aes128-cbc" onClick={() => setActiveProfile("aes128-cbc")}>
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-code-sm text-code-sm font-medium text-secondary">02. AES-128-CBC</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-outline font-label-sm text-label-sm uppercase font-medium">STANDBY</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-1">HMAC-SHA1-96</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">Group 14 (MODP-2048) · PFS Enabled</div>
<p className="font-body-sm text-body-sm text-outline pt-1">Legacy interop fallback with CBC mode ciphertext.</p>
</div>
<div className="pt-space-xs border-t border-surface-container-highest flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span className="text-secondary">Legacy Interop</span>
<span className="font-code-sm text-code-sm">Click to load</span>
</div>
</div>
<div className={activeProfile === "weak-dh" ? "profile-card cursor-pointer p-space-md rounded bg-surface-container-high ring-1 ring-primary flex flex-col justify-between gap-space-sm transition-all shadow-sm border border-error/30" : "profile-card cursor-pointer p-space-md rounded bg-surface-container hover:bg-surface-container-high flex flex-col justify-between gap-space-sm transition-all border border-error/30"} data-profile-id="weak-dh" onClick={() => setActiveProfile("weak-dh")}>
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-code-sm text-code-sm font-semibold text-error">05. Weak DH</span>
<span className="px-space-xs py-0.5 rounded bg-error-container text-error font-label-sm text-label-sm uppercase font-bold">CRITICAL / LOGJAM</span>
</div>
<div className="font-headline-sm text-headline-sm text-error font-semibold pt-1">Group 2 (1024-bit)</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">AES-128-CBC / SHA1 · RFC 8247 Deprecated</div>
<p className="font-body-sm text-body-sm text-outline pt-1">Vulnerable to discrete log precomputations.</p>
</div>
<div className="pt-space-xs border-t border-surface-container-highest flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span className="text-error font-bold">Exploit Sim</span>
<span className="text-error font-code-sm text-code-sm">Inject Vuln</span>
</div>
</div>
<div className={activeProfile === "pfs-disabled" ? "profile-card cursor-pointer p-space-md rounded bg-surface-container-high ring-1 ring-primary flex flex-col justify-between gap-space-sm transition-all shadow-sm border border-error/20" : "profile-card cursor-pointer p-space-md rounded bg-surface-container hover:bg-surface-container-high flex flex-col justify-between gap-space-sm transition-all border border-error/20"} data-profile-id="pfs-disabled" onClick={() => setActiveProfile("pfs-disabled")}>
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-code-sm text-code-sm font-semibold text-error">06. PFS Disabled</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-error font-label-sm text-label-sm uppercase font-bold">SNDL RISK</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-1">No KEi Payload</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">Static SKEYSEED Bind · Child SA Reuse</div>
<p className="font-body-sm text-body-sm text-outline pt-1">Child SA keys derived purely from parent exchange.</p>
</div>
<div className="pt-space-xs border-t border-surface-container-highest flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
<span className="text-error font-medium">Exploit Sim</span>
<span className="text-error font-code-sm text-code-sm">Inject Vuln</span>
</div>
</div>
</div>
</section>
{/* Section 3: Configuration Profiles Switcher & RFC Vulnerability Presets */}
<section className="p-space-xl bg-surface-container-low flex flex-col gap-space-md">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-sm">
<div className="p-1.5 rounded bg-surface-container-highest flex items-center justify-center"><span className="material-symbols-outlined text-primary text-[20px]">speed</span></div>
<div>
<div className="flex items-center gap-space-xs">
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Traffic Generator Engine</h2>
<span className="font-code-sm text-code-sm text-tertiary bg-surface-container-lowest px-space-xs py-0.5 rounded font-medium">KERNEL BYPASS ON</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Multi-stream synthetic payload generator with real-time rate shaping</p>
</div>
</div>
<div className="flex items-center gap-space-sm bg-surface-container px-space-md py-1.5 rounded">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Aggregate Rate:</span>
<span className="font-code-sm text-code-sm text-primary font-semibold" id="synth-rate-label">4,896 pkts/s</span>
<span className="text-outline-variant font-code-sm text-code-sm">|</span>
<span className="font-code-sm text-code-sm text-tertiary font-semibold" id="synth-bandwidth-label">3.63 MB/s</span>
<span className="text-outline-variant font-code-sm text-code-sm">|</span>
<span className="font-code-sm text-code-sm text-on-surface">Queue Depth: 12.4%</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div className="bg-surface-container p-space-md rounded flex flex-col justify-between gap-space-sm shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">public</span>
<span className="font-code-md text-code-md text-on-surface font-semibold">Web (HTTP/HTTPS)</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked className="sr-only peer traffic-toggle" data-stream="web" type="checkbox" />
<div className="w-7 h-4 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
<div className="flex flex-col gap-1 text-outline font-code-sm text-code-sm">
<div className="flex justify-between text-on-surface-variant"><span>Profile Cadence</span><span className="text-on-surface font-medium">TLS 1.3 Synthetic GET / POST</span></div>
<div className="flex justify-between text-on-surface-variant"><span>Packet Size</span><span className="text-on-surface font-medium">MSS 1420 (Avg 890B)</span></div>
</div>
<div className="flex items-center gap-space-sm pt-1 border-t border-surface-container-high">
<input className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-primary" max="1500" min="50" type="range" defaultValue="450" />
<span className="font-code-sm text-code-sm text-primary w-16 text-right font-medium">450 p/s</span>
</div>
</div>
<div className="bg-surface-container p-space-md rounded flex flex-col justify-between gap-space-sm shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">smart_display</span>
<span className="font-code-md text-code-md text-on-surface font-semibold">Video (ABR Stream)</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked className="sr-only peer traffic-toggle" data-stream="video" type="checkbox" />
<div className="w-7 h-4 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
<div className="flex flex-col gap-1 text-outline font-code-sm text-code-sm">
<div className="flex justify-between text-on-surface-variant"><span>Profile Cadence</span><span className="text-on-surface font-medium">Chunked 8s GoP / H.265</span></div>
<div className="flex justify-between text-on-surface-variant"><span>Packet Size</span><span className="text-on-surface font-medium">Full Jumbo Clustered (1400B)</span></div>
</div>
<div className="flex items-center gap-space-sm pt-1 border-t border-surface-container-high">
<input className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-primary" max="6000" min="200" type="range" defaultValue="2400" />
<span className="font-code-sm text-code-sm text-primary w-16 text-right font-medium">2.4k p/s</span>
</div>
</div>
<div className="bg-surface-container p-space-md rounded flex flex-col justify-between gap-space-sm shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">call</span>
<span className="font-code-md text-code-md text-on-surface font-semibold">VoIP (RTP / SIP)</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked className="sr-only peer traffic-toggle" data-stream="voip" type="checkbox" />
<div className="w-7 h-4 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
<div className="flex flex-col gap-1 text-outline font-code-sm text-code-sm">
<div className="flex justify-between text-on-surface-variant"><span>Profile Cadence</span><span className="text-on-surface font-medium">Isochronous G.711 / Opus 20ms</span></div>
<div className="flex justify-between text-on-surface-variant"><span>Packet Size</span><span className="text-on-surface font-medium">Rigid 214B ESP Packets</span></div>
</div>
<div className="flex items-center gap-space-sm pt-1 border-t border-surface-container-high">
<input className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-primary" max="300" min="10" type="range" defaultValue="50" />
<span className="font-code-sm text-code-sm text-primary w-16 text-right font-medium">50 p/s</span>
</div>
</div>
<div className="bg-surface-container p-space-md rounded flex flex-col justify-between gap-space-sm shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">network_ping</span>
<span className="font-code-md text-code-md text-on-surface font-semibold">ICMP (Ping / Trace)</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked className="sr-only peer traffic-toggle" data-stream="icmp" type="checkbox" />
<div className="w-7 h-4 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
<div className="flex flex-col gap-1 text-outline font-code-sm text-code-sm">
<div className="flex justify-between text-on-surface-variant"><span>Profile Cadence</span><span className="text-on-surface font-medium">Path MTU Sweeps (64B-1480B)</span></div>
<div className="flex justify-between text-on-surface-variant"><span>Packet Size</span><span className="text-on-surface font-medium">Sequential Variable MTU</span></div>
</div>
<div className="flex items-center gap-space-sm pt-1 border-t border-surface-container-high">
<input className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-primary" max="500" min="10" type="range" defaultValue="100" />
<span className="font-code-sm text-code-sm text-primary w-16 text-right font-medium">100 p/s</span>
</div>
</div>
<div className="bg-surface-container p-space-md rounded flex flex-col justify-between gap-space-sm shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">upload_file</span>
<span className="font-code-md text-code-md text-on-surface font-semibold">Bulk Transfer (SFTP)</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked className="sr-only peer traffic-toggle" data-stream="bulk" type="checkbox" />
<div className="w-7 h-4 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
<div className="flex flex-col gap-1 text-outline font-code-sm text-code-sm">
<div className="flex justify-between text-on-surface-variant"><span>Profile Cadence</span><span className="text-on-surface font-medium">Continuous Saturated Ingress</span></div>
<div className="flex justify-between text-on-surface-variant"><span>Packet Size</span><span className="text-on-surface font-medium">Full MTU 1420B | 8.5 MB/s</span></div>
</div>
<div className="flex items-center gap-space-sm pt-1 border-t border-surface-container-high">
<input className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-primary" max="5000" min="500" type="range" defaultValue="1800" />
<span className="font-code-sm text-code-sm text-primary w-16 text-right font-medium">1.8k p/s</span>
</div>
</div>
<div className="bg-surface-container/60 border border-dashed border-outline-variant p-space-md rounded flex flex-col justify-between gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-outline text-[18px]">add_circle</span>
<span className="font-code-md text-code-md text-on-surface-variant font-semibold">Add Custom Stream</span>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase">PCAP / Scapy</span>
</div>
<p className="font-body-sm text-body-sm text-outline">Inject raw replay trace or define custom stateful flow script for fuzzing testbed.</p>
<div className="pt-1">
<button className="w-full py-1 bg-surface-container-highest hover:bg-surface-container text-on-surface font-code-sm text-code-sm rounded transition-colors" type="button" onClick={configureStream}>Configure New Stream</button>
</div>
</div>
</div>
</section>
{/* Section 4: Traffic Generator Engine (TRex / Scapy Micro-Injector) */}
<section className="p-space-xl bg-surface flex flex-col gap-space-md relative">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-sm">
<div className="p-1.5 rounded bg-surface-container-highest flex items-center justify-center"><span className="material-symbols-outlined text-primary text-[20px]">biotech</span></div>
<div>
<div className="flex items-center gap-space-xs">
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Datasets &amp; Captured Replay Artifacts</h2>
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">(/var/log/tunnelsight/datasets/)</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Curated forensic captures validated against ground-truth dissection benchmarks</p>
</div>
</div>
<div className="flex items-center gap-space-sm font-code-sm text-code-sm">
<input className="bg-surface-container px-space-sm py-1 rounded text-on-surface font-code-sm text-code-sm placeholder:text-outline focus:outline-none w-56 border border-outline-variant/40" placeholder="Filter datasets..." type="text" />
</div>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
<div className="bg-surface-container p-space-md rounded flex flex-col gap-1 shadow-sm">
<span className="text-outline font-label-sm text-label-sm uppercase tracking-wider">Total Capture Traces</span>
<div className="flex items-baseline gap-space-xs">
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">42</span>
<span className="font-code-sm text-code-sm text-tertiary">Traces</span>
</div>
<span className="text-on-surface-variant font-code-sm text-code-sm">38 Validated · 4 In-Flight</span>
</div>
<div className="bg-surface-container p-space-md rounded flex flex-col gap-1 shadow-sm">
<span className="text-outline font-label-sm text-label-sm uppercase tracking-wider">Cumulative Volume</span>
<div className="flex items-baseline gap-space-xs">
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">24.8M</span>
<span className="font-code-sm text-code-sm text-primary">Packets</span>
</div>
<span className="text-tertiary font-code-sm text-code-sm">Zero Ingress Drops</span>
</div>
<div className="bg-surface-container p-space-md rounded flex flex-col gap-1 shadow-sm">
<span className="text-outline font-label-sm text-label-sm uppercase tracking-wider">Labeled Flows</span>
<div className="flex items-baseline gap-space-xs">
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">1,284</span>
<span className="font-code-sm text-code-sm text-secondary">Flows</span>
</div>
<span className="text-tertiary font-code-sm text-code-sm">100% Dissection Verified</span>
</div>
<div className="bg-surface-container p-space-md rounded flex flex-col gap-1 shadow-sm">
<span className="text-outline font-label-sm text-label-sm uppercase tracking-wider">Capture Timespan</span>
<div className="flex items-baseline gap-space-xs">
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">48h 12m</span>
</div>
<span className="text-on-surface-variant font-code-sm text-code-sm">2025-05-01 → Continuous</span>
</div>
</div>
<div className="bg-surface-container rounded overflow-hidden flex flex-col shadow-sm">
<div className="overflow-x-auto">
<table className="w-full text-left font-code-sm text-code-sm">
<thead>
<tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container-high">
<th className="px-space-md py-space-sm">File Artifact</th>
<th className="px-space-md py-space-sm">Packets</th>
<th className="px-space-md py-space-sm">Applied Posture</th>
<th className="px-space-md py-space-sm">Ground-Truth Status</th>
<th className="px-space-md py-space-sm text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y-0 text-on-surface">
<tr className="hover:bg-surface-container-high/60 transition-colors border-b border-surface-container-high/40">
<td className="px-space-md py-space-sm font-semibold text-primary flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-outline">description</span>
<span>synth-modern-01.pcap</span>
</td>
<td className="px-space-md py-space-sm text-on-surface">842,914 pkts</td>
<td className="px-space-md py-space-sm">
<span className="bg-surface-container-lowest px-space-sm py-1 rounded text-on-surface font-medium">Modern / Strong</span>
</td>
<td className="px-space-md py-space-sm">
<span className="text-tertiary bg-surface-container-lowest px-space-sm py-1 rounded font-medium inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>100% Ground Truth</span>
</td>
<td className="px-space-md py-space-sm text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="dataset-inspect-btn px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors font-medium" data-artifact="synth-modern-01.pcap" data-packets="842,914" data-sha="3d120a48b59fa876428e3b1c90ae7b12" data-split="70% Train / 15% Val / 15% Test" type="button" onClick={() => openInspect("synth-modern-01.pcap", "3d120a48b59fa876428e3b1c90ae7b12", "70% Train / 15% Val / 15% Test")}>Inspect</button>
<button className="px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-high/60 transition-colors bg-surface-container-low/30 border-b border-surface-container-high/40">
<td className="px-space-md py-space-sm font-semibold text-error flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-error">warning</span>
<span>weak-vpn-07.pcap</span>
</td>
<td className="px-space-md py-space-sm text-on-surface">842,914 pkts</td>
<td className="px-space-md py-space-sm">
<span className="bg-error-container text-error px-space-sm py-1 rounded font-medium">Weak DH + No PFS</span>
</td>
<td className="px-space-md py-space-sm">
<span className="text-error bg-surface-container-lowest px-space-sm py-1 rounded font-semibold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-error"></span>Ground-Truth Anomaly</span>
</td>
<td className="px-space-md py-space-sm text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="dataset-inspect-btn px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors font-medium" data-artifact="weak-vpn-07.pcap" data-packets="842,914" data-sha="7f892a01d9f48209bb31aa49c42b490f" data-split="80% Train / 20% Anomaly Test" type="button" onClick={() => openInspect("weak-vpn-07.pcap", "7f892a01d9f48209bb31aa49c42b490f", "80% Train / 20% Anomaly Test")}>Inspect</button>
<button className="px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-high/60 transition-colors border-b border-surface-container-high/40">
<td className="px-space-md py-space-sm font-semibold text-primary flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-outline">description</span>
<span>ipv6-transit-03.pcap</span>
</td>
<td className="px-space-md py-space-sm text-on-surface">1,420,100 pkts</td>
<td className="px-space-md py-space-sm">
<span className="bg-surface-container-lowest px-space-sm py-1 rounded text-on-surface font-medium">IPv6 Tunnel / ESN</span>
</td>
<td className="px-space-md py-space-sm">
<span className="text-tertiary bg-surface-container-lowest px-space-sm py-1 rounded font-medium inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>100% Ground Truth</span>
</td>
<td className="px-space-md py-space-sm text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="dataset-inspect-btn px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors font-medium" data-artifact="ipv6-transit-03.pcap" data-packets="1,420,100" data-sha="e82103ba7802fdca981245011cb9304" data-split="70% Train / 15% Val / 15% Test" type="button" onClick={() => openInspect("ipv6-transit-03.pcap", "e82103ba7802fdca981245011cb9304", "70% Train / 15% Val / 15% Test")}>Inspect</button>
<button className="px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-high/60 transition-colors border-b border-surface-container-high/40">
<td className="px-space-md py-space-sm font-semibold text-on-surface flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-outline">description</span>
<span>bulk-sftp-highburst.parquet</span>
</td>
<td className="px-space-md py-space-sm text-on-surface">3,124,500 pkts</td>
<td className="px-space-md py-space-sm">
<span className="bg-surface-container-lowest px-space-sm py-1 rounded text-on-surface font-medium">AES-256 GCM Fast</span>
</td>
<td className="px-space-md py-space-sm">
<span className="text-tertiary bg-surface-container-lowest px-space-sm py-1 rounded font-medium inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Parquet Formatted</span>
</td>
<td className="px-space-md py-space-sm text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="dataset-inspect-btn px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors font-medium" data-artifact="bulk-sftp-highburst.parquet" data-packets="3,124,500" data-sha="1a44c9b2e04319803bf39d019488d1" data-split="Columnar Partitioned" type="button" onClick={() => openInspect("bulk-sftp-highburst.parquet", "1a44c9b2e04319803bf39d019488d1", "Columnar Partitioned")}>Inspect</button>
<button className="px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-high/60 transition-colors bg-surface-container-lowest/50">
<td className="px-space-md py-space-sm font-semibold text-tertiary flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
<span>live-session-capture-active.pcap</span>
</td>
<td className="px-space-md py-space-sm text-tertiary font-semibold" id="live-row-pkts">{livePkts.toLocaleString()} pkts</td>
<td className="px-space-md py-space-sm">
<span className="bg-surface-container px-space-sm py-1 rounded text-primary font-medium">Active Configuration</span>
</td>
<td className="px-space-md py-space-sm">
<span className="text-primary bg-surface-container px-space-sm py-1 rounded font-code-sm text-code-sm font-medium inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>STREAMING TAP</span>
</td>
<td className="px-space-md py-space-sm text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-sm py-1 bg-surface-container hover:bg-surface-container-high rounded text-error transition-colors" type="button" onClick={haltCapture}>Halt</button>
<button className="dataset-inspect-btn px-space-sm py-1 bg-surface-container hover:bg-surface-container-high rounded text-primary transition-colors font-medium" data-artifact="live-session-capture-active.pcap" data-packets="Streaming Live" data-sha="Computing on stream close..." data-split="In-flight Capture Buffer" type="button" onClick={() => openInspect("live-session-capture-active.pcap", "Computing on stream close...", "In-flight Capture Buffer")}>Tail</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-space-md py-space-sm bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between text-outline font-code-sm text-code-sm border-t border-surface-container-high">
<div className="flex items-center gap-space-md">
<span>Storage Pool: /mnt/fast-nvme/datasets</span>
<span className="text-outline-variant">|</span>
<span>Used: <span className="text-on-surface font-medium">214.2 GB</span> / 1.8 TB</span>
<span className="text-outline-variant">|</span>
<span>Checksum Mode: <span className="text-tertiary">SHA-256 Hardware-Accelerated</span></span>
</div>
<div className="flex items-center gap-space-xs mt-1 sm:mt-0">
<button className="hover:text-on-surface transition-colors px-space-xs py-0.5 rounded bg-surface-container" type="button" onClick={pageToast}>Prev</button>
<span className="px-space-xs">Page 1 of 9</span>
<button className="hover:text-on-surface transition-colors px-space-xs py-0.5 rounded bg-surface-container" type="button" onClick={pageToast}>Next</button>
</div>
</div>
</div>
<div className={inspect.open ? "fixed right-0 top-0 h-full w-96 bg-surface-container-low z-50 p-space-lg shadow-2xl border-l border-surface-container-highest flex flex-col justify-between select-none" : "hidden fixed right-0 top-0 h-full w-96 bg-surface-container-low z-50 p-space-lg shadow-2xl border-l border-surface-container-highest flex flex-col justify-between select-none"} id="dataset-inspect-drawer">
<div className="flex flex-col gap-space-md">
<div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">verified</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Artifact Inspector</span>
</div>
<button className="p-1 text-outline hover:text-on-surface transition-colors" id="close-inspect-drawer" type="button" onClick={closeInspect}>
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Target File</span>
<div className="font-code-md text-code-md text-primary font-semibold truncate" id="drawer-filename">{inspect.filename}</div>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">SHA-256 Digest</span>
<div className="font-code-sm text-code-sm text-on-surface font-mono break-all bg-surface-container-lowest p-space-xs rounded select-all" id="drawer-sha">{inspect.sha}</div>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Partition Breakdown</span>
<div className="font-code-sm text-code-sm text-tertiary" id="drawer-split">{inspect.split}</div>
<div className="w-full h-2 bg-surface-container-highest rounded overflow-hidden flex mt-1">
<div className="bg-primary-container h-full" style={{width: '70%'}}></div>
<div className="bg-tertiary h-full" style={{width: '15%'}}></div>
<div className="bg-secondary h-full" style={{width: '15%'}}></div>
</div>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-1 font-code-sm text-code-sm">
<div className="flex justify-between text-outline"><span>RFC Spec</span><span className="text-on-surface">RFC 4301 / RFC 7296</span></div>
<div className="flex justify-between text-outline"><span>Dissection Level</span><span className="text-tertiary font-medium">Layer 2 - Layer 7 Full</span></div>
<div className="flex justify-between text-outline"><span>Ingress Drops</span><span className="text-on-surface">0 Packets (0.00%)</span></div>
</div>
</div>
<div className="flex items-center gap-space-xs pt-space-md border-t border-surface-container-high">
<button className="flex-1 py-1.5 bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm font-semibold rounded text-center transition-colors" type="button" onClick={exportArchive}>Export Archive</button>
<button className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-code-sm text-code-sm rounded transition-colors" id="close-inspect-btn" type="button" onClick={closeInspect}>Done</button>
</div>
</div>
</section>
{/* Section 5: Dataset Curation, Ground-Truth Metrics & Artifact Manifest */}
<section className="p-space-base bg-surface flex flex-col gap-space-sm">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">biotech</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dataset Metadata &amp; Forensic Ground-Truth Benchmarks</h2>
<span className="font-code-sm text-code-sm text-outline hidden sm:inline">RFC-Validation Repository</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm">
<span className="text-on-surface-variant">Partition Profile:</span>
<span className="text-primary font-semibold">Stratified 70/15/15 K-Fold</span>
</div>
</div>
{/* Forensic Ground-Truth Metric Cards */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-xs">
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-1">
<span className="text-outline font-label-sm text-label-sm uppercase">Total Capture Traces</span>
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">42 <span className="font-code-sm text-code-sm text-tertiary">Traces</span></span>
<span className="text-on-surface-variant font-code-sm text-code-sm">38 Validated · 4 In-Flight</span>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-1">
<span className="text-outline font-label-sm text-label-sm uppercase">Labeled Flow Instances</span>
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">1,284 <span className="font-code-sm text-code-sm text-primary">Flows</span></span>
<span className="text-tertiary font-code-sm text-code-sm">100% Dissection Verified</span>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-1">
<span className="text-outline font-label-sm text-label-sm uppercase">Traffic Categories</span>
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">6 <span className="font-code-sm text-code-sm text-secondary">Canonical</span></span>
<span className="text-on-surface-variant font-code-sm text-code-sm">Web, Video, Voice, Mail, Bulk, Ping</span>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-1">
<span className="text-outline font-label-sm text-label-sm uppercase">Cumulative Packets</span>
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">24.8M <span className="font-code-sm text-code-sm text-primary">Pkts</span></span>
<span className="text-tertiary font-code-sm text-code-sm">Zero Ingress Drops Logged</span>
</div>
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-1 col-span-2 md:col-span-1">
<span className="text-outline font-label-sm text-label-sm uppercase">Capture Duration</span>
<span className="text-on-surface font-headline-lg text-headline-lg font-semibold">48h 12m</span>
<span className="text-on-surface-variant font-code-sm text-code-sm">Timespan: 2025-05-01 → Now</span>
</div>
</div>
{/* Data Split Distribution Bar */}
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between font-code-sm text-code-sm">
<span className="text-outline font-label-sm text-label-sm uppercase tracking-wider">Ground-Truth Training Partition Stratification</span>
<span className="text-on-surface">Total: 24,819,402 Packets</span>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded overflow-hidden flex">
<div className="bg-primary-container h-full" style={{width: '70%'}} title="Train: 70%"></div>
<div className="bg-tertiary h-full" style={{width: '15%'}} title="Validation: 15%"></div>
<div className="bg-secondary h-full" style={{width: '15%'}} title="Test: 15%"></div>
</div>
<div className="grid grid-cols-3 gap-space-xs pt-0.5 font-code-sm text-code-sm">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded bg-primary-container"></span>
<span className="text-on-surface-variant">Train Split:</span>
<span className="text-on-surface font-medium">70.0% (17.37M pkts / 898 flows)</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded bg-tertiary"></span>
<span className="text-on-surface-variant">Validation Split:</span>
<span className="text-on-surface font-medium">15.0% (3.72M pkts / 193 flows)</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded bg-secondary"></span>
<span className="text-on-surface-variant">Test Split:</span>
<span className="text-on-surface font-medium">15.0% (3.72M pkts / 193 flows)</span>
</div>
</div>
</div>
{/* Artifact Manifest Table */}
<div className="bg-surface-container rounded overflow-hidden flex flex-col">
<div className="px-space-md py-space-xs bg-surface-container-highest flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Datasets &amp; Captured Replay Artifacts</span>
<span className="font-code-sm text-code-sm text-outline">(/var/log/tunnelsight/datasets/)</span>
</div>
<div className="flex items-center gap-space-xs">
<input className="bg-surface-container-low px-space-xs py-0.5 rounded text-on-surface font-code-sm text-code-sm placeholder:text-outline focus:outline-none w-48" placeholder="Filter SHA256 / filename..." type="text" />
</div>
</div>
{/* Dense Tabular View */}
<div className="overflow-x-auto">
<table className="w-full text-left font-code-sm text-code-sm">
<thead>
<tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
<th className="px-space-md py-space-xs">File Artifact</th>
<th className="px-space-md py-space-xs">Packets</th>
<th className="px-space-md py-space-xs">Applied Posture / Profile</th>
<th className="px-space-md py-space-xs">Ground-Truth Classes</th>
<th className="px-space-md py-space-xs">Integrity / Validation</th>
<th className="px-space-md py-space-xs">SHA256 Fingerprint</th>
<th className="px-space-md py-space-xs text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y-0 text-on-surface">
{/* Row 1 */}
<tr className="hover:bg-surface-container-high transition-colors">
<td className="px-space-md py-space-xs font-semibold text-primary flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-outline">description</span>
<span>synth-modern-01.pcap</span>
</td>
<td className="px-space-md py-space-xs">842,914 pkts</td>
<td className="px-space-md py-space-xs">
<span className="bg-surface-container-lowest px-space-xs py-0.5 rounded text-on-surface font-medium">Modern / Strong</span>
</td>
<td className="px-space-md py-space-xs text-on-surface-variant">6 Canonical (All)</td>
<td className="px-space-md py-space-xs">
<span className="text-tertiary bg-surface-container-lowest px-space-xs py-0.5 rounded">100% Ground Truth</span>
</td>
<td className="px-space-md py-space-xs text-outline font-mono">3d120a48...90ae7b12</td>
<td className="px-space-md py-space-xs text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors" type="button" onClick={openInspectRow}>Inspect</button>
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container-high transition-colors bg-surface-container-low/40">
<td className="px-space-md py-space-xs font-semibold text-error flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-error">warning</span>
<span>weak-vpn-07.pcap</span>
</td>
<td className="px-space-md py-space-xs">842,914 pkts</td>
<td className="px-space-md py-space-xs">
<span className="bg-error-container text-error px-space-xs py-0.5 rounded font-medium">Weak DH + No PFS</span>
</td>
<td className="px-space-md py-space-xs text-on-surface-variant">4 Classes (Web, VoIP, Ping, Bulk)</td>
<td className="px-space-md py-space-xs">
<span className="text-error bg-surface-container-lowest px-space-xs py-0.5 rounded font-semibold">Ground-Truth Anomaly</span>
</td>
<td className="px-space-md py-space-xs text-outline font-mono">7f892a01...c42b490f</td>
<td className="px-space-md py-space-xs text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors" type="button" onClick={openInspectRow}>Inspect</button>
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container-high transition-colors">
<td className="px-space-md py-space-xs font-semibold text-primary flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-outline">description</span>
<span>ipv6-transit-03.pcap</span>
</td>
<td className="px-space-md py-space-xs">1,420,100 pkts</td>
<td className="px-space-md py-space-xs">
<span className="bg-surface-container-lowest px-space-xs py-0.5 rounded text-on-surface font-medium">IPv6 Tunnel / ESN</span>
</td>
<td className="px-space-md py-space-xs text-on-surface-variant">5 Classes (Excl. Mail)</td>
<td className="px-space-md py-space-xs">
<span className="text-tertiary bg-surface-container-lowest px-space-xs py-0.5 rounded">100% Ground Truth</span>
</td>
<td className="px-space-md py-space-xs text-outline font-mono">e82103ba...11cb9304</td>
<td className="px-space-md py-space-xs text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors" type="button" onClick={openInspectRow}>Inspect</button>
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-surface-container-high transition-colors">
<td className="px-space-md py-space-xs font-semibold text-on-surface flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-outline">description</span>
<span>bulk-sftp-highburst.parquet</span>
</td>
<td className="px-space-md py-space-xs">3,124,500 pkts</td>
<td className="px-space-md py-space-xs">
<span className="bg-surface-container-lowest px-space-xs py-0.5 rounded text-on-surface font-medium">AES-256 GCM Fast</span>
</td>
<td className="px-space-md py-space-xs text-on-surface-variant">Bulk SCP / Max MTU</td>
<td className="px-space-md py-space-xs">
<span className="text-tertiary bg-surface-container-lowest px-space-xs py-0.5 rounded">Parquet Formatted</span>
</td>
<td className="px-space-md py-space-xs text-outline font-mono">1a44c9b2...019488d1</td>
<td className="px-space-md py-space-xs text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary transition-colors" type="button" onClick={openInspectRow}>Inspect</button>
<button className="px-space-xs py-0.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface transition-colors" type="button" onClick={downloadRow}>Download</button>
</div>
</td>
</tr>
{/* Row 5 (In-flight / active capture) */}
<tr className="hover:bg-surface-container-high transition-colors bg-surface-container-lowest/50">
<td className="px-space-md py-space-xs font-semibold text-tertiary flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
<span>live-session-capture-active.pcap</span>
</td>
<td className="px-space-md py-space-xs" id="live-row-pkts">{livePkts.toLocaleString()} pkts</td>
<td className="px-space-md py-space-xs">
<span className="bg-surface-container px-space-xs py-0.5 rounded text-primary font-medium">Active Configuration</span>
</td>
<td className="px-space-md py-space-xs text-on-surface-variant">Multi-Stream Synth</td>
<td className="px-space-md py-space-xs">
<span className="text-primary bg-surface-container px-space-xs py-0.5 rounded font-code-sm text-code-sm">STREAMING TAP</span>
</td>
<td className="px-space-md py-space-xs text-outline font-mono">calculating...</td>
<td className="px-space-md py-space-xs text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-space-xs py-0.5 bg-surface-container hover:bg-surface-container-high rounded text-error transition-colors" type="button" onClick={haltCapture}>Halt</button>
<button className="px-space-xs py-0.5 bg-surface-container hover:bg-surface-container-high rounded text-primary transition-colors" type="button" onClick={() => openInspect("live-session-capture-active.pcap", "Computing on stream close...", "In-flight Capture Buffer")}>Tail</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/* Table Bottom Metadata Footer */}
<div className="px-space-md py-space-xs bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between text-outline font-code-sm text-code-sm">
<div className="flex items-center gap-space-md">
<span>Storage Pool: /mnt/fast-nvme/datasets</span>
<span className="text-outline-variant">|</span>
<span>Used: <span className="text-on-surface font-medium">214.2 GB</span> / 1.8 TB</span>
<span className="text-outline-variant">|</span>
<span>Checksum Mode: <span className="text-tertiary">SHA256 Hardware-Accelerated</span></span>
</div>
<div className="flex items-center gap-space-xs mt-1 sm:mt-0">
<button className="hover:text-on-surface transition-colors" type="button" onClick={pageToast}>First</button>
<span>Page 1 of 9</span>
<button className="hover:text-on-surface transition-colors" type="button" onClick={pageToast}>Next</button>
</div>
</div>
</div>
</section>
{/* Interactive Lab Harness Logic (Vanilla JS) */}

</div></main></div>
    </div>
  );
}
