"use client";
import Link from "next/link";
import { useState } from "react";

export default function VpnConfigurationPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [inspectedPkt, setInspectedPkt] = useState("Packet #142");
  const [inspectedExchange, setInspectedExchange] = useState("CREATE_CHILD_SA (Req)");
  const [inspectedSpi, setInspectedSpi] = useState("0x8a91f3c401340b12");
  const selectEvidencePacket = (pktNum: number, exchangeName: string, spi: string) => {
    setInspectedPkt(`Packet #${pktNum}`);
    setInspectedExchange(exchangeName);
    setInspectedSpi(spi);
  };
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span className="">2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full">
{/* Top Operational Breadcrumb & Context Header */}
<div className="px-space-base py-space-sm bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex flex-wrap items-center gap-space-sm">
<div className="flex items-center gap-space-xs font-code-sm text-code-sm">
<span className="text-outline hover:text-on-surface cursor-pointer">Captures</span>
<span className="text-outline-variant">/</span>
<span className="text-primary font-medium">weak-vpn-07.pcap</span>
<span className="text-outline-variant">/</span>
<span className="text-on-surface">VPN Configuration &amp; Protocol Inspection</span>
</div>
<div className="h-3 w-px bg-surface-container-highest"></div>
{/* Provenance and Session Pills */}
<div className="flex items-center gap-space-2xs">
<span className="h-5 px-1.5 rounded bg-surface-container-high text-on-surface font-code-sm text-code-sm flex items-center">IKEv2</span>
<span className="h-5 px-1.5 rounded bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm flex items-center">ESP Tunnel Mode</span>
<span className="h-5 px-1.5 rounded bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm flex items-center">IPv4</span>
<span className="h-5 px-1.5 rounded bg-secondary-container/40 text-secondary-fixed font-code-sm text-code-sm flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>NAT-T Active
        </span>
<span className="h-5 px-2 rounded bg-tertiary/10 text-tertiary font-code-sm text-code-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]">verified</span> Evidence: 100% Confirmed
        </span>
</div>
</div>
{/* Right Controls: View Filter & Actions */}
<div className="flex items-center gap-space-xs">
<div className="inline-flex rounded bg-surface-container-low p-0.5">
<button className={activeFilter === "all" ? "tab-filter-btn px-space-sm py-0.5 rounded text-on-surface bg-surface-container font-code-sm text-code-sm" : "tab-filter-btn px-space-sm py-0.5 rounded text-outline hover:text-on-surface font-code-sm text-code-sm"} data-target="all" type="button" onClick={() => setActiveFilter("all")}>All Layers</button>
<button className={activeFilter === "ike" ? "tab-filter-btn px-space-sm py-0.5 rounded text-on-surface bg-surface-container font-code-sm text-code-sm" : "tab-filter-btn px-space-sm py-0.5 rounded text-outline hover:text-on-surface font-code-sm text-code-sm"} data-target="ike" type="button" onClick={() => setActiveFilter("ike")}>IKE Control</button>
<button className={activeFilter === "esp" ? "tab-filter-btn px-space-sm py-0.5 rounded text-on-surface bg-surface-container font-code-sm text-code-sm" : "tab-filter-btn px-space-sm py-0.5 rounded text-outline hover:text-on-surface font-code-sm text-code-sm"} data-target="esp" type="button" onClick={() => setActiveFilter("esp")}>ESP Data</button>
<button className={activeFilter === "sa" ? "tab-filter-btn px-space-sm py-0.5 rounded text-on-surface bg-surface-container font-code-sm text-code-sm" : "tab-filter-btn px-space-sm py-0.5 rounded text-outline hover:text-on-surface font-code-sm text-code-sm"} data-target="sa" type="button" onClick={() => setActiveFilter("sa")}>SA Tables</button>
</div>
<div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div>
<button className="h-7 px-space-sm bg-surface-container hover:bg-surface-container-high rounded text-on-surface font-code-sm text-code-sm flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[14px]">terminal</span> Export Proof (.json)
      </button>
</div>
</div>
{/* Main Multi-Pane Analytical Workbench */}
<div className="flex-1 grid grid-cols-1 2xl:grid-cols-12 bg-surface-container-lowest gap-px">
{/* Primary Content Area (Left 8 Cols on 2xl) */}
<div className="2xl:col-span-8 flex flex-col gap-px bg-surface-container-lowest">
{/* SECTION 1: Identity & Security Endpoints Key-Value Matrix */}
<section className={(activeFilter === "all" || activeFilter === "ike" || activeFilter === "esp") ? "bg-surface-container-low p-space-md" : "bg-surface-container-low p-space-md hidden"} data-section="all,ike,esp">
<div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-highest/40">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">hub</span>
<span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Tunnel Endpoints &amp; Peer Identity</span>
<span className="font-code-sm text-code-sm text-outline">[RFC 7296 §3.8 / §3.5]</span>
</div>
<span className="font-code-sm text-code-sm text-outline">Session Hash: <code className="text-on-surface">d98f7e21a0c44b91</code></span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md font-code-sm text-code-sm">
{/* Initiator Entity */}
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between pb-space-2xs">
<span className="font-label-sm text-label-sm text-outline uppercase">Initiator (Local Peer)</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary text-[10px]">SRC_PORT: 500 → 4500</span>
</div>
<div className="grid grid-cols-3 gap-1 pt-1">
<span className="text-outline">Outer IP:</span>
<span className="col-span-2 text-on-surface font-medium">198.51.100.1 : 500</span>
<span className="text-outline">Post-NAT:</span>
<span className="col-span-2 text-primary font-medium">198.51.100.1 : 4500 (UDP Encapsulated)</span>
<span className="text-outline">Host ID:</span>
<span className="col-span-2 text-on-surface-variant">branch-edge-gw01.internal</span>
<span className="text-outline">ID Type:</span>
<span className="col-span-2 text-on-surface">ID_IPV4_ADDR <span className="text-outline">(0x01)</span></span>
</div>
</div>
{/* Responder Entity */}
<div className="bg-surface-container p-space-sm rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between pb-space-2xs">
<span className="font-label-sm text-label-sm text-outline uppercase">Responder (Remote Gateway)</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary text-[10px]">DST_PORT: 500 → 4500</span>
</div>
<div className="grid grid-cols-3 gap-1 pt-1">
<span className="text-outline">Outer IP:</span>
<span className="col-span-2 text-on-surface font-medium">203.0.113.44 : 500</span>
<span className="text-outline">Post-NAT:</span>
<span className="col-span-2 text-on-surface font-medium">203.0.113.44 : 4500 (UDP Floating)</span>
<span className="text-outline">FQDN:</span>
<span className="col-span-2 text-on-surface-variant">vpn.chicago-dc.net</span>
<span className="text-outline">ID Type:</span>
<span className="col-span-2 text-on-surface">ID_FQDN <span className="text-outline">(0x02)</span></span>
</div>
</div>
</div>
{/* Encapsulation & Operational Parameters Strip */}
<div className="mt-space-sm grid grid-cols-1 md:grid-cols-3 gap-space-xs font-code-sm text-code-sm">
<div className="bg-surface-container-low px-space-sm py-1.5 rounded flex items-center justify-between">
<span className="text-outline">Network Mode:</span>
<span className="text-on-surface font-medium">IPsec Tunnel (IPv4 in ESP)</span>
</div>
<div className="bg-surface-container-low px-space-sm py-1.5 rounded flex items-center justify-between">
<span className="text-outline">NAT-T Status:</span>
<span className="text-primary font-medium flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> DETECTED (RFC 3947)
            </span>
</div>
<div className="bg-surface-container-low px-space-sm py-1.5 rounded flex items-center justify-between">
<span className="text-outline">Authentication:</span>
<span className="text-on-surface font-medium">AUTH_PSK <span className="text-outline">(Type 0x02)</span></span>
</div>
</div>
</section>
{/* SECTION 2: IKEv2 Protocol Handshake & Exchange Table */}
<section className={(activeFilter === "all" || activeFilter === "ike") ? "bg-surface-container-low p-space-md" : "bg-surface-container-low p-space-md hidden"} data-section="all,ike">
<div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-highest/40">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">sync_alt</span>
<span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">IKEv2 Exchange Evidence Log</span>
<span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-outline">5 Messages Captured</span>
</div>
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
<span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span> Complete Handshake Confirmed
          </div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-code-sm text-code-sm">
<thead className="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider"><tr><th className="py-2 px-space-sm">Msg #</th><th className="py-2 px-space-sm">Exchange Type</th><th className="py-2 px-space-sm">Timestamp</th><th className="py-2 px-space-sm">SPI / Key Payloads</th><th className="py-2 px-space-sm text-right">Audit Status</th></tr></thead>
<tbody className="divide-y divide-surface-container-highest/30"><tr className="hover:bg-surface-container cursor-pointer transition-colors" onClick={() => selectEvidencePacket(42, 'IKE_SA_INIT (Req)', '0x8a91f3c401340b12')}><td className="py-2.5 px-space-sm text-outline font-medium">01</td><td className="py-2.5 px-space-sm font-medium flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span> IKE_SA_INIT (Req) <span className="text-[11px] text-primary ml-1">#42</span></td><td className="py-2.5 px-space-sm text-on-surface-variant font-mono">00:00:00.114</td><td className="py-2.5 px-space-sm"><div className="flex items-center gap-2"><span className="font-mono text-on-surface text-[12px]">8a91f3c4...</span><span className="text-outline-variant">|</span><span className="text-on-surface-variant text-[12px] truncate max-w-xs">SA, KE (DH Grp 2), Ni, NAT-D</span></div></td><td className="py-2.5 px-space-sm text-right"><span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[11px] font-medium">OK</span></td></tr><tr className="hover:bg-surface-container cursor-pointer transition-colors" onClick={() => selectEvidencePacket(45, 'IKE_SA_INIT (Resp)', '0x7c2901a8ef11b402')}><td className="py-2.5 px-space-sm text-outline font-medium">02</td><td className="py-2.5 px-space-sm font-medium flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-[14px] text-secondary">arrow_back</span> IKE_SA_INIT (Resp) <span className="text-[11px] text-primary ml-1">#45</span></td><td className="py-2.5 px-space-sm text-on-surface-variant font-mono">00:00:00.189</td><td className="py-2.5 px-space-sm"><div className="flex items-center gap-2"><span className="font-mono text-on-surface text-[12px]">7c2901a8...</span><span className="text-outline-variant">|</span><span className="text-on-surface-variant text-[12px] truncate max-w-xs">SA (Transform 1), KE, Nr, NAT-D Mismatch</span></div></td><td className="py-2.5 px-space-sm text-right"><span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[11px] font-medium">NAT_DETECT</span></td></tr><tr className="hover:bg-surface-container cursor-pointer transition-colors" onClick={() => selectEvidencePacket(58, 'IKE_AUTH (Req)', '0x8a91f3c401340b12')}><td className="py-2.5 px-space-sm text-outline font-medium">03</td><td className="py-2.5 px-space-sm font-medium flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span> IKE_AUTH (Req) <span className="text-[11px] text-primary ml-1">#58</span></td><td className="py-2.5 px-space-sm text-on-surface-variant font-mono">00:00:00.412</td><td className="py-2.5 px-space-sm"><div className="flex items-center gap-2"><span className="font-mono text-on-surface text-[12px]">8a91f3c4...</span><span className="text-outline-variant">|</span><span className="text-on-surface-variant text-[12px] truncate max-w-xs">Encrypted: SK {"{"} IDi, AUTH(PSK), SA(Child) {"}"}</span></div></td><td className="py-2.5 px-space-sm text-right"><span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[11px] font-medium">AUTH_OK</span></td></tr><tr className="hover:bg-surface-container cursor-pointer transition-colors" onClick={() => selectEvidencePacket(61, 'IKE_AUTH (Resp)', '0x7c2901a8ef11b402')}><td className="py-2.5 px-space-sm text-outline font-medium">04</td><td className="py-2.5 px-space-sm font-medium flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-[14px] text-secondary">arrow_back</span> IKE_AUTH (Resp) <span className="text-[11px] text-primary ml-1">#61</span></td><td className="py-2.5 px-space-sm text-on-surface-variant font-mono">00:00:00.490</td><td className="py-2.5 px-space-sm"><div className="flex items-center gap-2"><span className="font-mono text-on-surface text-[12px]">7c2901a8...</span><span className="text-outline-variant">|</span><span className="text-on-surface-variant text-[12px] truncate max-w-xs">Encrypted: SK {"{"} IDr, AUTH(PSK), SA(Child) {"}"}</span></div></td><td className="py-2.5 px-space-sm text-right"><span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[11px] font-medium">ESTABLISHED</span></td></tr><tr className="bg-surface-container-high/60 cursor-pointer transition-colors border-l-2 border-primary" onClick={() => selectEvidencePacket(142, 'CREATE_CHILD_SA (Req)', '0x8a91f3c401340b12')}><td className="py-2.5 px-space-sm text-primary font-bold">05</td><td className="py-2.5 px-space-sm font-semibold flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-[14px] text-error">warning</span> CREATE_CHILD_SA <span className="text-[11px] text-primary font-bold ml-1">#142</span></td><td className="py-2.5 px-space-sm text-on-surface font-mono">00:00:02.381</td><td className="py-2.5 px-space-sm"><div className="flex items-center gap-2"><span className="font-mono text-on-surface text-[12px]">8a91f3c4...</span><span className="text-outline-variant">|</span><span className="text-error text-[12px] truncate max-w-xs">Rekey Child SA — Missing KEi (NO PFS)</span></div></td><td className="py-2.5 px-space-sm text-right"><span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-semibold">RISK_DETECTED</span></td></tr></tbody>
</table>
</div>
</section>
{/* SECTION 3: Negotiated Cryptographic Proposals & Transforms Matrix */}
<section className={(activeFilter === "all" || activeFilter === "ike" || activeFilter === "esp") ? "bg-surface-container-low p-space-md" : "bg-surface-container-low p-space-md hidden"} data-section="all,ike,esp">
<div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-highest/40">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">security_update_good</span>
<span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Cryptographic Proposals &amp; Transforms Matrix</span>
</div>
<span className="font-code-sm text-code-sm text-error font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">report</span> Security Posture: Sub-Optimal
          </span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-code-sm text-code-sm">
<thead className="bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th className="py-1 px-space-sm">Transform Type</th>
<th className="py-1 px-space-sm">IKE_SA (Control Plane)</th>
<th className="py-1 px-space-sm">Child SA / ESP (Data Plane)</th>
<th className="py-1 px-space-sm">Evidence Source</th>
<th className="py-1 px-space-sm text-right">Cryptographic Evaluation</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-highest/30">
{/* Encryption */}
<tr className="hover:bg-surface-container transition-colors">
<td className="py-1.5 px-space-sm text-on-surface font-medium">Encryption (ENCR)</td>
<td className="py-1.5 px-space-sm text-on-surface">AES-CBC-128 <span className="text-outline">(128-bit key)</span></td>
<td className="py-1.5 px-space-sm text-on-surface">AES-CBC-128 <span className="text-outline">(IV: 16B)</span></td>
<td className="py-1.5 px-space-sm"><span className="text-primary hover:underline cursor-pointer">#42, #58</span></td>
<td className="py-1.5 px-space-sm text-right">
<span className="h-5 px-1.5 rounded bg-surface-container-highest text-secondary text-[11px] inline-flex items-center">Sub-optimal (NIST SP 800-77r1)</span>
</td>
</tr>
{/* Integrity */}
<tr className="hover:bg-surface-container transition-colors">
<td className="py-1.5 px-space-sm text-on-surface font-medium">Integrity (INTEG)</td>
<td className="py-1.5 px-space-sm text-on-surface">AUTH_HMAC_SHA1_96</td>
<td className="py-1.5 px-space-sm text-on-surface">AUTH_HMAC_SHA1_96 <span className="text-outline">(ICV: 12B)</span></td>
<td className="py-1.5 px-space-sm"><span className="text-primary hover:underline cursor-pointer">#42, #58</span></td>
<td className="py-1.5 px-space-sm text-right">
<span className="h-5 px-1.5 rounded bg-error/15 text-error text-[11px] inline-flex items-center font-medium">Legacy SHA1 (Collision Vector)</span>
</td>
</tr>
{/* PRF */}
<tr className="hover:bg-surface-container transition-colors">
<td className="py-1.5 px-space-sm text-on-surface font-medium">Pseudo-Random (PRF)</td>
<td className="py-1.5 px-space-sm text-on-surface">PRF_HMAC_SHA1</td>
<td className="py-1.5 px-space-sm text-outline">N/A (Data Plane)</td>
<td className="py-1.5 px-space-sm"><span className="text-primary hover:underline cursor-pointer">#45</span></td>
<td className="py-1.5 px-space-sm text-right">
<span className="h-5 px-1.5 rounded bg-surface-container-highest text-on-surface-variant text-[11px] inline-flex items-center">RFC 7296 Compliant</span>
</td>
</tr>
{/* Diffie-Hellman */}
<tr className="bg-error/5 hover:bg-error/10 transition-colors"><td className="py-2 px-space-sm text-error font-medium">Diffie-Hellman (D-H)</td><td className="py-2 px-space-sm"><div className="flex items-center gap-1.5"><span className="text-on-surface font-medium">Group 2</span><span className="h-5 px-1.5 rounded bg-error-container text-on-error-container text-[10px] font-semibold inline-flex items-center">CRITICAL: 1024b MODP</span></div></td><td className="py-2 px-space-sm"><div className="flex items-center gap-1.5"><span className="text-outline">Child SA:</span><span className="h-5 px-1.5 rounded bg-error-container text-on-error-container text-[10px] font-semibold inline-flex items-center">PFS DISABLED</span></div></td><td className="py-2 px-space-sm"><span className="text-primary hover:underline cursor-pointer">#42 &amp; #142</span></td><td className="py-2 px-space-sm text-right"><span className="h-5 px-1.5 rounded bg-error/15 text-error text-[11px] inline-flex items-center font-semibold">Vulnerable to Compromise</span></td></tr>
{/* Nonce Exchange */}
<tr className="hover:bg-surface-container transition-colors">
<td className="py-1.5 px-space-sm text-on-surface font-medium">Nonce Entropy</td>
<td className="py-1.5 px-space-sm text-on-surface">Ni (32B), Nr (32B)</td>
<td className="py-1.5 px-space-sm text-on-surface">Derived via SKEYSEED</td>
<td className="py-1.5 px-space-sm"><span className="text-primary hover:underline cursor-pointer">#42, #45</span></td>
<td className="py-1.5 px-space-sm text-right">
<span className="h-5 px-1.5 rounded bg-tertiary/15 text-tertiary text-[11px] inline-flex items-center">7.994 b/B (Nominal)</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
{/* SECTION 4: ESP Security Associations (SA) & Data Plane Telemetry */}
<section className={(activeFilter === "all" || activeFilter === "esp" || activeFilter === "sa") ? "bg-surface-container-low p-space-md" : "bg-surface-container-low p-space-md hidden"} data-section="all,esp,sa">
<div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-highest/40">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">dns</span>
<span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">ESP Active Security Associations (SA) &amp; Sequence State</span>
</div>
<span className="font-code-sm text-code-sm text-outline">UDP Port 4500 Encap</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
{/* Ingress SA Card/Table Unit */}
<div className="bg-surface-container p-space-sm rounded flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/40">
<div className="flex items-center gap-1 font-code-sm text-code-sm">
<span className="text-primary font-bold">INGRESS SA</span>
<span className="text-outline">(Responder → Initiator)</span>
</div>
<span className="font-code-sm text-code-sm text-primary font-mono bg-surface-container-highest px-1.5 rounded">SPI: 0x41f89c02</span>
</div>
<div className="mt-space-sm grid grid-cols-2 gap-y-1.5 font-code-sm text-code-sm">
<span className="text-outline">Lifetime Remaining:</span>
<span className="text-on-surface text-right">28,800s Hard / 25,920s Soft</span>
<span className="text-outline">Volume Transferred:</span>
<span className="text-on-surface text-right font-medium">421,050 pkts (712.4 MB)</span>
<span className="text-outline">Monotonic Sequence:</span>
<span className="text-tertiary text-right font-bold">421,050 (0 drops)</span>
<span className="text-outline">Anti-Replay Window:</span>
<span className="text-on-surface text-right">64 pkts (Strict Bitmap)</span>
<span className="text-outline">Frame Evidence:</span>
<span className="text-on-surface-variant text-right">#68 → #842,109</span>
</div>
</div>
{/* Sequence Integrity Sparkline Graphic */}
<div className="mt-space-md pt-space-xs border-t border-surface-container-highest/30">
<div className="flex justify-between font-label-sm text-label-sm text-outline mb-1">
<span className="">SEQUENCE CONTINUITY</span>
<span className="text-tertiary">100% HEALTH</span>
</div>
<svg className="w-full h-5 text-tertiary" preserveAspectRatio="none" viewBox="0 0 200 20">
<path d="M0,18 L30,16 L60,13 L90,10 L120,8 L150,5 L180,3 L200,1" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
</svg>
</div>
</div>
{/* Egress SA Card/Table Unit */}
<div className="bg-surface-container p-space-sm rounded flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/40">
<div className="flex items-center gap-1 font-code-sm text-code-sm">
<span className="text-secondary-fixed font-bold">EGRESS SA</span>
<span className="text-outline">(Initiator → Responder)</span>
</div>
<span className="font-code-sm text-code-sm text-secondary-fixed font-mono bg-surface-container-highest px-1.5 rounded">SPI: 0x9a021da3</span>
</div>
<div className="mt-space-sm grid grid-cols-2 gap-y-1.5 font-code-sm text-code-sm">
<span className="text-outline">Lifetime Remaining:</span>
<span className="text-on-surface text-right">28,800s / 4.00 GB Cap</span>
<span className="text-outline">Volume Transferred:</span>
<span className="text-on-surface text-right font-medium">421,059 pkts (707.6 MB)</span>
<span className="text-outline">Monotonic Sequence:</span>
<span className="text-tertiary text-right font-bold">421,059 (0 drops)</span>
<span className="text-outline">Anti-Replay Window:</span>
<span className="text-on-surface text-right">64 pkts (Strict Bitmap)</span>
<span className="text-outline">Frame Evidence:</span>
<span className="text-on-surface-variant text-right">#69 → #842,108</span>
</div>
</div>
{/* Sequence Integrity Sparkline Graphic */}
<div className="mt-space-md pt-space-xs border-t border-surface-container-highest/30">
<div className="flex justify-between font-label-sm text-label-sm text-outline mb-1">
<span className="">SEQUENCE CONTINUITY</span>
<span className="text-tertiary">100% HEALTH</span>
</div>
<svg className="w-full h-5 text-primary" preserveAspectRatio="none" viewBox="0 0 200 20">
<path d="M0,18 L25,16 L55,14 L95,11 L130,7 L165,4 L200,1" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
</svg>
</div>
</div>
</div>
</section>
</div>
{/* SECTION 5: Inline Expandable Packet Dissection Inspector Drawer (Right 4 Cols on 2xl) */}
<div className="2xl:col-span-4 bg-surface-container flex flex-col p-space-md gap-space-md border-t 2xl:border-t-0 2xl:border-l border-surface-container-highest/40">
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/50">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">find_in_page</span>
<span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Protocol Frame Inspector</span>
</div>
<span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono" id="inspectedPktBadge">{inspectedPkt}</span>
</div>
{/* Active Frame Overview Strip */}
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm flex flex-col gap-1">
<div className="flex justify-between">
<span className="text-outline">Exchange Type:</span>
<span className="text-on-surface font-semibold" id="inspectedExchange">{inspectedExchange}</span>
</div>
<div className="flex justify-between">
<span className="text-outline">Timestamp:</span>
<span className="text-on-surface">00:00:02.381 (T+2.267s)</span>
</div>
<div className="flex justify-between">
<span className="text-outline">Initiator SPI:</span>
<span className="text-primary" id="inspectedSpi">{inspectedSpi}</span>
</div>
<div className="flex justify-between">
<span className="text-outline">Encapsulation:</span>
<span className="text-on-surface">UDP:4500 (Non-ESP Marker 0x00000000)</span>
</div>
</div>
{/* Deterministic Protocol Assertion / Proof Box */}
<div className="bg-error-container/20 border-l-2 border-error p-space-sm rounded-r flex flex-col gap-1">
<div className="flex items-center gap-1 text-error font-code-sm text-code-sm font-semibold">
<span className="material-symbols-outlined text-[16px]">gpp_maybe</span> Deterministic Cryptographic Proof
        </div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Child SA Rekey initiated without <code className="text-primary font-code-sm">KEi</code> payload at offset <code className="text-primary font-code-sm">0x0028</code>. The absence of an ephemeral Diffie-Hellman public key proves <strong className="text-error">PFS (Perfect Forward Secrecy) is Disabled</strong>. Past sessions are vulnerable to retrospective decryption if private keys are compromised.
        </p>
</div>
{/* Raw Hex & ASCII Dissection Panel */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between font-label-sm text-label-sm text-outline">
<span className="uppercase">Frame Hex Payload (Byte Dissection)</span>
<span className="">16-Byte Chunked</span>
</div>
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm overflow-x-auto leading-5 select-text">
{/* Hex Dissection Grid */}
<div className="grid grid-cols-12 gap-x-2 text-outline">
<span className="col-span-2 text-outline">0000</span>
<span className="col-span-6 text-on-surface font-mono">00 00 00 00 8a 91 f3 c4</span>
<span className="col-span-4 text-on-surface-variant font-mono">....4..|</span>
<span className="col-span-2 text-outline">0008</span>
<span className="col-span-6 text-on-surface font-mono">01 34 0b 12 7c 29 01 a8</span>
<span className="col-span-4 text-on-surface-variant font-mono">)..ef11.</span>
<span className="col-span-2 text-outline">0010</span>
<span className="col-span-6 text-on-surface font-mono">ef 11 b4 02 2e 20 23 20</span>
<span className="col-span-4 text-on-surface-variant font-mono">.... # .</span>
<span className="col-span-2 text-outline">0018</span>
<span className="col-span-6 text-on-surface font-mono">00 00 00 02 00 00 00 9c</span>
<span className="col-span-4 text-on-surface-variant font-mono">....\x9c</span>
<span className="col-span-2 text-primary font-bold">0020</span>
<span className="col-span-6 text-primary font-bold font-mono">29 00 00 80 00 00 00 24</span>
<span className="col-span-4 text-primary font-mono">).....$</span>
<span className="col-span-2 text-outline">0028</span>
<span className="col-span-6 text-error font-mono">01 03 04 03 00 00 00 0c</span>
<span className="col-span-4 text-error font-mono">........</span>
<span className="col-span-2 text-outline">0030</span>
<span className="col-span-6 text-on-surface font-mono">80 0c 00 80 00 00 00 08</span>
<span className="col-span-4 text-on-surface-variant font-mono">........</span>
<span className="col-span-2 text-outline">0038</span>
<span className="col-span-6 text-on-surface font-mono">03 00 00 02 00 00 00 08</span>
<span className="col-span-4 text-on-surface-variant font-mono">........</span>
</div>
</div>
</div>
{/* Payload Structural Breakdown Tree */}
<div className="flex flex-col gap-1 mt-space-xs">
<span className="font-label-sm text-label-sm text-outline uppercase">Decoded Payload Hierarchy</span>
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm flex flex-col gap-1 divide-y divide-surface-container-highest/20">
<div className="pt-1 flex items-center justify-between text-on-surface">
<span className="">Non-ESP Marker (4 Bytes)</span>
<span className="text-tertiary">0x00000000 [OK]</span>
</div>
<div className="pt-1 flex items-center justify-between text-on-surface">
<span className="">IKE Header [HDR] (28 Bytes)</span>
<span className="text-on-surface-variant">Type: CREATE_CHILD_SA (36)</span>
</div>
<div className="pt-1 flex items-center justify-between text-on-surface">
<span className="">Security Association [SA]</span>
<span className="text-on-surface-variant">SPI: 0x9a021da3</span>
</div>
<div className="pt-1 flex items-center justify-between text-error font-medium">
<span className="">Key Exchange [KEi]</span>
<span className="">ABSENT (PFS Disabled)</span>
</div>
<div className="pt-1 flex items-center justify-between text-on-surface">
<span className="">Traffic Selectors [TSi, TSr]</span>
<span className="text-on-surface-variant">0.0.0.0/0 ↔ 0.0.0.0/0</span>
</div>
</div>
</div>
{/* Action Button */}
<div className="mt-auto pt-space-sm flex gap-space-xs">
<button className="w-full h-8 bg-primary hover:bg-primary/90 text-on-primary font-semibold rounded font-code-sm text-code-sm flex items-center justify-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[16px]">download</span> Export Frame #142 Dissection
        </button>
</div>
</div>
</div>
</div>
</main></div>


    </div>
  );
}
