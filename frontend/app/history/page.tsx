"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast, downloadFile } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis"; import Stat from "@/components/motion/Stat";
import { AppShell } from "@/components/layout/AppShell";

const ROW_RISK: Record<string, string> = {
  "branch-emea-gw04.pcap": "HIGH",
  "site2site-prod.pcapng": "LOW",
  "dc-west-vpn.pcap": "MEDIUM",
  "weak-vpn-07.pcap": "HIGH",
  "aws-transit-gw01.pcapng": "LOW",
  "legacy-radius-ipsec.pcap": "CRITICAL",
  "edge-gw-04-us-east.pcap": "HIGH",
};

const RISK_OPTIONS = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

const ROW_SEARCH_TEXT: Record<string, string> = {
  "branch-emea-gw04.pcap":
    "branch-emea-gw04.pcap pcap ikev2 tunnel 61 high 2 hours ago oct 24 14:12 j.chen 192.0.2.14 description",
  "site2site-prod.pcapng":
    "site2site-prod.pcapng pcapng ikev2 tunnel 94 low 5 hours ago oct 24 11:38 m.vasquez description",
  "dc-west-vpn.pcap":
    "dc-west-vpn.pcap pcap ikev1 tunnel 67 medium yesterday oct 23 18:04 s.patel description",
  "weak-vpn-07.pcap":
    "weak-vpn-07.pcap pcap ikev2 tunnel 47 high oct 22 14:02 j.chen flag",
  "aws-transit-gw01.pcapng":
    "aws-transit-gw01.pcapng pcapng ikev2 transport 88 low oct 21 09:15 automations description",
  "legacy-radius-ipsec.pcap":
    "legacy-radius-ipsec.pcap pcap ikev1 tunnel 38 critical oct 19 22:40 r.kumar warning",
  "edge-gw-04-us-east.pcap":
    "edge-gw-04-us-east.pcap pcap ikev2 tunnel 52 high oct 18 16:55 j.chen description",
};

export default function HistoryPage() {
  const [filter, setFilter] = useState("");
  const [selectedCapture, setSelectedCapture] = useState("weak-vpn-07.pcap");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [risk, setRisk] = useState("All");
  const [density, setDensity] = useState("spacious");
  const router = useRouter();
  const toast = useToast();

  function matchesFilter(capture: string) {
    const q = filter.toLowerCase().trim();
    if (q) {
      const hay = ROW_SEARCH_TEXT[capture] ?? capture.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (risk !== "All" && ROW_RISK[capture] !== risk) return false;
    return true;
  }

  function cycleRisk() {
    const next = RISK_OPTIONS[(RISK_OPTIONS.indexOf(risk) + 1) % RISK_OPTIONS.length];
    setRisk(next);
    toast({ title: `Risk filter: ${next}`, body: next === "All" ? "Showing all captures." : `Showing ${next} captures only.`, kind: "info" });
  }

  function handleRowClick(capture: string) {
    setSelectedCapture(capture);
    setDrawerOpen(true);
  }

  function handleReset() {
    setFilter("");
    setDrawerOpen(true);
  }

  useEffect(() => {
    function onInspect(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('.row-inspect-btn');
      if (!btn) return;
      const tr = btn.closest('tr[data-capture]');
      const cap = tr?.getAttribute('data-capture');
      if (cap) handleRowClick(cap);
    }
    document.addEventListener('click', onInspect);
    return () => document.removeEventListener('click', onInspect);
  }, []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("filter-input")?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<AppShell active="">

{/* Subtle Ambient Glow & Context Grid */}
<div className="relative w-full px-space-base py-space-md flex flex-col gap-space-md max-w-[1920px] mx-auto">
<div className="pointer-events-none absolute top-0 left-1/3 w-[500px] h-[180px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
{/* Header Section: Breathable, High Contrast & High Signal */}
<section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md pb-space-xs">
<div className="flex flex-col gap-space-2xs">
<div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm uppercase tracking-wider">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
<span>Forensic Records</span>
<span>/</span>
<span className="text-on-surface">Execution Logbook</span>
</div>
<div className="flex items-baseline gap-space-sm">
<h1 className="font-display text-display text-on-surface tracking-tight font-semibold">Analysis History</h1>
<span className="font-code-sm text-code-sm text-outline hidden sm:inline-block">session-scoped ledger</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Review previous captures, posture scores, negotiated cryptographic suites, and posture regressions across verified tunnels.
        </p>
</div>
{/* Quick stats pills: restrained, structured metrics */}
<div className="flex flex-wrap items-center gap-space-xs self-start lg:self-center">
<div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-sm">
<span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider leading-none">Total Runs</span>
<span className="font-code-md text-code-md text-on-surface font-semibold leading-tight"><Stat to={1428} /></span>
</div>
</div>
<div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-sm">
<span className="material-symbols-outlined text-[16px] text-tertiary">hub</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider leading-none">Assessed Tunnels</span>
<span className="font-code-md text-code-md text-on-surface font-semibold leading-tight"><Stat to={24} suffix=" Active" /></span>
</div>
</div>
<div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-sm">
<span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider leading-none">Last Replay</span>
<div className="flex items-center gap-space-2xs">
<span className="font-code-md text-code-md text-primary font-medium leading-tight">14m ago</span>
<span className="font-code-sm text-code-sm text-outline-variant">by</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">j.chen</span>
</div>
</div>
</div>
</div>
</section>
{/* Controls / Compact Toolbar */}
<div className="bg-surface-container-low rounded-lg p-space-xs shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-xs">
{/* Search and Dropdown Filter Pills */}
<div className="flex flex-wrap items-center gap-space-xs flex-1 min-w-0">
{/* Search bar */}
<div className="relative min-w-[280px] sm:min-w-[320px] flex-1 max-w-md">
<span className="material-symbols-outlined absolute left-space-xs top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
<input className="w-full h-[30px] pl-7 pr-12 bg-surface text-on-surface font-code-sm text-code-sm placeholder:text-outline/70 rounded focus:outline-none focus:bg-surface-container-high transition-colors" id="filter-input" placeholder="Filter by capture name, tunnel ID, tag..." type="text" value={filter} onInput={(e) => setFilter(e.currentTarget.value)} />
<span className="absolute right-space-xs top-1/2 -translate-y-1/2 font-code-sm text-[10px] text-outline bg-surface-container-highest px-1 py-0.5 rounded pointer-events-none">⌘K</span>
</div>
{/* Filter Pills */}
<div className="flex flex-wrap items-center gap-space-2xs">
{/* Date Filter */}
<button onClick={() => toast({ title: "Prototype filter", body: "Fixed.", kind: "info" })} className="h-[30px] px-space-xs bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded flex items-center gap-space-2xs font-code-sm text-code-sm transition-colors" type="button">
<span className="text-outline">Date:</span>
<span className="text-on-surface font-medium">Past 30 Days</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
{/* Risk Filter */}
<button onClick={cycleRisk} className="h-[30px] px-space-xs bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded flex items-center gap-space-2xs font-code-sm text-code-sm transition-colors" type="button">
<span className="text-outline">Risk:</span>
<span className="text-on-surface font-medium">{risk === "All" ? "All Risk Levels" : risk}</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
{/* Protocol Filter */}
<button onClick={() => toast({ title: "Prototype filter", body: "Fixed.", kind: "info" })} className="h-[30px] px-space-xs bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded flex items-center gap-space-2xs font-code-sm text-code-sm transition-colors" type="button">
<span className="text-outline">Proto:</span>
<span className="text-on-surface font-medium">All Protocols</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
{/* Mode Filter */}
<button onClick={() => toast({ title: "Prototype filter", body: "Single demo snapshot — this dimension is fixed.", kind: "info" })} className="h-[30px] px-space-xs bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded flex items-center gap-space-2xs font-code-sm text-code-sm transition-colors" type="button">
<span className="text-outline">Mode:</span>
<span className="text-on-surface font-medium">All Modes</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
{/* Analyst Filter */}
<button onClick={() => toast({ title: "Prototype filter", body: "Fixed.", kind: "info" })} className="h-[30px] px-space-xs bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded flex items-center gap-space-2xs font-code-sm text-code-sm transition-colors" type="button">
<span className="text-outline">Analyst:</span>
<span className="text-on-surface font-medium">All</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
</div>
</div>
{/* Action Toggles */}
<div className="flex items-center gap-space-xs self-end xl:self-auto shrink-0">
<button className="h-[30px] px-space-xs text-outline hover:text-primary font-label-md text-label-md transition-colors flex items-center gap-space-2xs" id="reset-filter-btn" type="button" onClick={handleReset}>
<span className="material-symbols-outlined text-[14px]">restart_alt</span>
<span>Reset Filters</span>
</button>
<div className="flex items-center bg-surface-container p-0.5 rounded">
<button className={density === "spacious" ? "px-space-xs py-0.5 rounded font-label-sm text-label-sm bg-surface text-primary shadow-xs" : "px-space-xs py-0.5 rounded font-label-sm text-label-sm text-outline hover:text-on-surface"} id="toggle-density-spacious" onClick={() => { setDensity("spacious"); toast({ title: "Density: spacious", kind: "info" }); }} title="Spacious Grid" type="button">Spacious</button>
<button className={density === "compact" ? "px-space-xs py-0.5 rounded font-label-sm text-label-sm bg-surface text-primary shadow-xs" : "px-space-xs py-0.5 rounded font-label-sm text-label-sm text-outline hover:text-on-surface"} id="toggle-density-compact" onClick={() => { setDensity("compact"); toast({ title: "Density: compact", kind: "info" }); }} title="Compact Rows" type="button">Compact</button>
</div>
</div>
</div>
{/* Main Workspace Split-Pane: Responsive Layout containing Data Table & Docked Detail Drawer */}
<div className="relative flex items-start gap-space-md w-full">
{/* Data Table Card Container */}
<div className="flex-1 min-w-0 bg-surface-container-low rounded-xl shadow-md overflow-hidden flex flex-col">
{/* Table Scroll Gutter */}
<div className="w-full overflow-x-auto">
<table className="w-full text-left border-collapse" id="history-table">
<thead>
<tr className="bg-surface-container h-8 text-outline font-label-sm text-label-sm tracking-wider uppercase select-none">
<th className="w-10 px-space-sm font-semibold">Status</th>
<th className="px-space-sm font-semibold">Capture File</th>
<th className="px-space-sm font-semibold">Protocol</th>
<th className="px-space-sm font-semibold">Mode</th>
<th className="px-space-sm font-semibold">Posture Score</th>
<th className="px-space-sm font-semibold">Risk Classification</th>
<th className="px-space-sm font-semibold">Analyzed</th>
<th className="px-space-sm text-right font-semibold pr-space-md">Action</th>
</tr>
</thead>
<tbody className="divide-y-0 font-body-md text-body-md text-on-surface" id="table-body">
{/* ROW 1: branch-emea-gw04.pcap */}
<tr className={selectedCapture === "branch-emea-gw04.pcap" ? "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer bg-surface-container-high shadow-inner" : "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer"} data-capture="branch-emea-gw04.pcap" onClick={() => handleRowClick("branch-emea-gw04.pcap")} style={{ display: matchesFilter("branch-emea-gw04.pcap") ? undefined : "none" }}>
<td className={selectedCapture === "branch-emea-gw04.pcap" ? "px-space-sm relative" : "px-space-sm"}>
{selectedCapture === "branch-emea-gw04.pcap" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-center justify-center">
<span className="w-2 h-2 rounded-full bg-tertiary" title="Completed Audit"></span>
</div>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">description</span>
<span className="font-code-md text-code-md text-on-surface font-medium truncate">branch-emea-gw04.pcap</span>
<span className="font-code-sm text-[10px] bg-surface-container-highest text-outline px-1 rounded uppercase">pcap</span>
</div>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IKEv2</span>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-outline">Tunnel</span>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-12 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-error h-full rounded-full w-[61%]"></div>
</div>
<span className="font-code-md text-code-md font-semibold text-error">61<span className="text-outline font-normal text-code-sm">/100</span></span>
</div>
</td>
<td className="px-space-sm">
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-error-container/40 text-error tracking-wide">
                    HIGH
                  </span>
</td>
<td className="px-space-sm">
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface">2 hours ago</span>
<span className="font-code-sm text-[10px] text-outline">Oct 24, 14:12 · <span className="text-on-surface-variant">j.chen</span></span>
</div>
</td>
<td className="px-space-sm text-right pr-space-md">
<button className="row-inspect-btn px-space-xs py-1 rounded font-code-sm text-code-sm text-primary hover:text-on-primary hover:bg-primary transition-colors inline-flex items-center gap-1" type="button">
<span>Inspect</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</td>
</tr>
{/* ROW 2: site2site-prod.pcapng */}
<tr className={selectedCapture === "site2site-prod.pcapng" ? "group h-12 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer bg-surface-container-high shadow-inner" : "group h-12 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"} data-capture="site2site-prod.pcapng" onClick={() => handleRowClick("site2site-prod.pcapng")} style={{ display: matchesFilter("site2site-prod.pcapng") ? undefined : "none" }}>
<td className={selectedCapture === "site2site-prod.pcapng" ? "px-space-sm relative" : "px-space-sm"}>
{selectedCapture === "site2site-prod.pcapng" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-center justify-center">
<span className="w-2 h-2 rounded-full bg-tertiary" title="Completed Audit"></span>
</div>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">description</span>
<span className="font-code-md text-code-md text-on-surface font-medium truncate">site2site-prod.pcapng</span>
<span className="font-code-sm text-[10px] bg-surface-container-highest text-outline px-1 rounded uppercase">pcapng</span>
</div>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IKEv2</span>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-outline">Tunnel</span>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-12 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full w-[94%]"></div>
</div>
<span className="font-code-md text-code-md font-semibold text-tertiary">94<span className="text-outline font-normal text-code-sm">/100</span></span>
</div>
</td>
<td className="px-space-sm">
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-tertiary-container/20 text-tertiary tracking-wide">
                    LOW
                  </span>
</td>
<td className="px-space-sm">
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface">5 hours ago</span>
<span className="font-code-sm text-[10px] text-outline">Oct 24, 11:38 · <span className="text-on-surface-variant">m.vasquez</span></span>
</div>
</td>
<td className="px-space-sm text-right pr-space-md">
<button className="row-inspect-btn px-space-xs py-1 rounded font-code-sm text-code-sm text-outline-variant hover:text-primary hover:bg-surface-container-highest transition-colors inline-flex items-center gap-1" type="button">
<span>Inspect</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</td>
</tr>
{/* ROW 3: dc-west-vpn.pcap */}
<tr className={selectedCapture === "dc-west-vpn.pcap" ? "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer bg-surface-container-high shadow-inner" : "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer"} data-capture="dc-west-vpn.pcap" onClick={() => handleRowClick("dc-west-vpn.pcap")} style={{ display: matchesFilter("dc-west-vpn.pcap") ? undefined : "none" }}>
<td className={selectedCapture === "dc-west-vpn.pcap" ? "px-space-sm relative" : "px-space-sm"}>
{selectedCapture === "dc-west-vpn.pcap" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-center justify-center">
<span className="w-2 h-2 rounded-full bg-tertiary" title="Completed Audit"></span>
</div>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">description</span>
<span className="font-code-md text-code-md text-on-surface font-medium truncate">dc-west-vpn.pcap</span>
<span className="font-code-sm text-[10px] bg-surface-container-highest text-outline px-1 rounded uppercase">pcap</span>
</div>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IKEv1</span>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-outline">Tunnel</span>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-12 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full w-[67%]"></div>
</div>
<span className="font-code-md text-code-md font-semibold text-secondary">67<span className="text-outline font-normal text-code-sm">/100</span></span>
</div>
</td>
<td className="px-space-sm">
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-secondary-container/40 text-secondary-fixed tracking-wide">
                    MEDIUM
                  </span>
</td>
<td className="px-space-sm">
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface">Yesterday</span>
<span className="font-code-sm text-[10px] text-outline">Oct 23, 18:04 · <span className="text-on-surface-variant">s.patel</span></span>
</div>
</td>
<td className="px-space-sm text-right pr-space-md">
<button className="row-inspect-btn px-space-xs py-1 rounded font-code-sm text-code-sm text-outline-variant hover:text-primary hover:bg-surface-container-highest transition-colors inline-flex items-center gap-1" type="button">
<span>Inspect</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</td>
</tr>
{/* ROW 4: weak-vpn-07.pcap (ACTIVE / HIGHLIGHTED ROW) */}
<tr className={selectedCapture === "weak-vpn-07.pcap" ? "group h-12 bg-surface-container-high text-on-surface transition-colors cursor-pointer relative shadow-inner" : "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer"} data-capture="weak-vpn-07.pcap" onClick={() => handleRowClick("weak-vpn-07.pcap")} style={{ display: matchesFilter("weak-vpn-07.pcap") ? undefined : "none" }}>
<td className="px-space-sm relative">
{/* Leading active indicator strip */}
{selectedCapture === "weak-vpn-07.pcap" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-center justify-center">
<span className={selectedCapture === "weak-vpn-07.pcap" ? "w-2 h-2 rounded-full bg-primary animate-pulse" : "w-2 h-2 rounded-full bg-tertiary"} title="Active Focus"></span>
</div>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-[16px] text-primary">flag</span>
<span className="font-code-md text-code-md text-primary font-semibold truncate">weak-vpn-07.pcap</span>
<span className="font-code-sm text-[10px] bg-primary-container text-on-primary-container font-semibold px-1 rounded uppercase">pcap</span>
</div>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface font-semibold">IKEv2</span>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant">Tunnel</span>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-12 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-error h-full rounded-full w-[47%]"></div>
</div>
<span className="font-code-md text-code-md font-semibold text-error">47<span className="text-outline font-normal text-code-sm">/100</span></span>
</div>
</td>
<td className="px-space-sm">
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-error-container text-error tracking-wide">
                    HIGH
                  </span>
</td>
<td className="px-space-sm">
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface font-medium">Oct 22</span>
<span className="font-code-sm text-[10px] text-outline">Oct 22, 14:02 · <span className="text-primary font-medium">j.chen</span></span>
</div>
</td>
<td className="px-space-sm text-right pr-space-md">
<button className="row-inspect-btn px-space-xs py-1 rounded font-code-sm text-code-sm text-on-primary bg-primary font-semibold inline-flex items-center gap-1 shadow-xs" type="button">
<span>Active</span>
<span className="material-symbols-outlined text-[14px]">read_more</span>
</button>
</td>
</tr>
{/* ROW 5: aws-transit-gw01.pcapng */}
<tr className={selectedCapture === "aws-transit-gw01.pcapng" ? "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer bg-surface-container-high shadow-inner" : "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer"} data-capture="aws-transit-gw01.pcapng" onClick={() => handleRowClick("aws-transit-gw01.pcapng")} style={{ display: matchesFilter("aws-transit-gw01.pcapng") ? undefined : "none" }}>
<td className={selectedCapture === "aws-transit-gw01.pcapng" ? "px-space-sm relative" : "px-space-sm"}>
{selectedCapture === "aws-transit-gw01.pcapng" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-center justify-center">
<span className="w-2 h-2 rounded-full bg-tertiary" title="Completed Audit"></span>
</div>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">description</span>
<span className="font-code-md text-code-md text-on-surface font-medium truncate">aws-transit-gw01.pcapng</span>
<span className="font-code-sm text-[10px] bg-surface-container-highest text-outline px-1 rounded uppercase">pcapng</span>
</div>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IKEv2</span>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-outline">Transport</span>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-12 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full w-[88%]"></div>
</div>
<span className="font-code-md text-code-md font-semibold text-tertiary">88<span className="text-outline font-normal text-code-sm">/100</span></span>
</div>
</td>
<td className="px-space-sm">
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-tertiary-container/20 text-tertiary tracking-wide">
                    LOW
                  </span>
</td>
<td className="px-space-sm">
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface">Oct 21</span>
<span className="font-code-sm text-[10px] text-outline">Oct 21, 09:15 · <span className="text-on-surface-variant">automations</span></span>
</div>
</td>
<td className="px-space-sm text-right pr-space-md">
<button className="row-inspect-btn px-space-xs py-1 rounded font-code-sm text-code-sm text-outline-variant hover:text-primary hover:bg-surface-container-highest transition-colors inline-flex items-center gap-1" type="button">
<span>Inspect</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</td>
</tr>
{/* ROW 6: legacy-radius-ipsec.pcap */}
<tr className={selectedCapture === "legacy-radius-ipsec.pcap" ? "group h-12 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer bg-surface-container-high shadow-inner" : "group h-12 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"} data-capture="legacy-radius-ipsec.pcap" onClick={() => handleRowClick("legacy-radius-ipsec.pcap")} style={{ display: matchesFilter("legacy-radius-ipsec.pcap") ? undefined : "none" }}>
<td className={selectedCapture === "legacy-radius-ipsec.pcap" ? "px-space-sm relative" : "px-space-sm"}>
{selectedCapture === "legacy-radius-ipsec.pcap" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-center justify-center">
<span className="w-2 h-2 rounded-full bg-error" title="Critical Policy Violation"></span>
</div>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-[16px] text-error">warning</span>
<span className="font-code-md text-code-md text-on-surface font-medium truncate">legacy-radius-ipsec.pcap</span>
<span className="font-code-sm text-[10px] bg-surface-container-highest text-outline px-1 rounded uppercase">pcap</span>
</div>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IKEv1</span>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-outline">Tunnel</span>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-12 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-error-container h-full rounded-full w-[38%]"></div>
</div>
<span className="font-code-md text-code-md font-semibold text-error">38<span className="text-outline font-normal text-code-sm">/100</span></span>
</div>
</td>
<td className="px-space-sm">
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-error-container text-on-error-container tracking-wide animate-pulse">
                    CRITICAL
                  </span>
</td>
<td className="px-space-sm">
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface">Oct 19</span>
<span className="font-code-sm text-[10px] text-outline">Oct 19, 22:40 · <span className="text-on-surface-variant">r.kumar</span></span>
</div>
</td>
<td className="px-space-sm text-right pr-space-md">
<button className="row-inspect-btn px-space-xs py-1 rounded font-code-sm text-code-sm text-outline-variant hover:text-primary hover:bg-surface-container-highest transition-colors inline-flex items-center gap-1" type="button">
<span>Inspect</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</td>
</tr>
{/* ROW 7: edge-gw-04-us-east.pcap */}
<tr className={selectedCapture === "edge-gw-04-us-east.pcap" ? "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer bg-surface-container-high shadow-inner" : "group h-12 bg-surface hover:bg-surface-container transition-colors cursor-pointer"} data-capture="edge-gw-04-us-east.pcap" onClick={() => handleRowClick("edge-gw-04-us-east.pcap")} style={{ display: matchesFilter("edge-gw-04-us-east.pcap") ? undefined : "none" }}>
<td className={selectedCapture === "edge-gw-04-us-east.pcap" ? "px-space-sm relative" : "px-space-sm"}>
{selectedCapture === "edge-gw-04-us-east.pcap" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
<div className="flex items-center justify-center">
<span className="w-2 h-2 rounded-full bg-tertiary" title="Completed Audit"></span>
</div>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">description</span>
<span className="font-code-md text-code-md text-on-surface font-medium truncate">edge-gw-04-us-east.pcap</span>
<span className="font-code-sm text-[10px] bg-surface-container-highest text-outline px-1 rounded uppercase">pcap</span>
</div>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IKEv2</span>
</td>
<td className="px-space-sm">
<span className="font-code-sm text-code-sm text-outline">Tunnel</span>
</td>
<td className="px-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-12 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-error h-full rounded-full w-[52%]"></div>
</div>
<span className="font-code-md text-code-md font-semibold text-error">52<span className="text-outline font-normal text-code-sm">/100</span></span>
</div>
</td>
<td className="px-space-sm">
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-error-container/40 text-error tracking-wide">
                    HIGH
                  </span>
</td>
<td className="px-space-sm">
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface">Oct 18</span>
<span className="font-code-sm text-[10px] text-outline">Oct 18, 16:55 · <span className="text-on-surface-variant">j.chen</span></span>
</div>
</td>
<td className="px-space-sm text-right pr-space-md">
<button className="row-inspect-btn px-space-xs py-1 rounded font-code-sm text-code-sm text-outline-variant hover:text-primary hover:bg-surface-container-highest transition-colors inline-flex items-center gap-1" type="button">
<span>Inspect</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination / Table Footer */}
<div className="bg-surface-container h-12 px-space-base flex flex-col sm:flex-row items-center justify-between gap-space-xs select-none">
<div className="flex items-center gap-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing <span className="font-semibold text-on-surface font-code-sm">1–7</span> of <span className="font-semibold text-on-surface font-code-sm">1,428</span> captures
            </span>
<div className="flex items-center gap-space-2xs">
<span className="font-label-sm text-label-sm text-outline uppercase">View:</span>
<button onClick={() => toast({ title: "Prototype dataset", body: "7 captures on a single demo page.", kind: "info" })} className="font-code-sm text-code-sm text-primary font-semibold bg-surface-container-high px-1.5 py-0.5 rounded" type="button">25 per page</button>
</div>
</div>
<div className="flex items-center gap-space-xs">
<button className="px-space-xs py-1 rounded font-code-sm text-code-sm text-outline-variant bg-surface-container-low cursor-not-allowed flex items-center gap-1" disabled type="button">
<span className="material-symbols-outlined text-[14px]">chevron_left</span>
<span>Previous</span>
</button>
<div className="flex items-center gap-1">
<span className="w-6 h-6 rounded bg-primary-container text-on-primary-container font-code-sm text-code-sm font-semibold flex items-center justify-center">1</span>
<button onClick={() => toast({ title: "Prototype dataset", body: "7 captures on a single demo page.", kind: "info" })} className="w-6 h-6 rounded text-on-surface-variant hover:bg-surface-container-highest font-code-sm text-code-sm flex items-center justify-center" type="button">2</button>
<button onClick={() => toast({ title: "Prototype dataset", body: "7 captures on a single demo page.", kind: "info" })} className="w-6 h-6 rounded text-on-surface-variant hover:bg-surface-container-highest font-code-sm text-code-sm flex items-center justify-center" type="button">3</button>
<span className="text-outline font-code-sm px-1">…</span>
<button onClick={() => toast({ title: "Prototype dataset", body: "7 captures on a single demo page.", kind: "info" })} className="w-6 h-6 rounded text-on-surface-variant hover:bg-surface-container-highest font-code-sm text-code-sm flex items-center justify-center" type="button">58</button>
</div>
<button onClick={() => toast({ title: "Prototype dataset", body: "7 captures on a single demo page.", kind: "info" })} className="px-space-xs py-1 rounded font-code-sm text-code-sm text-on-surface hover:text-primary hover:bg-surface-container-highest flex items-center gap-1 transition-colors" type="button">
<span>Next</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Right-Side Capture Detail Drawer (Docked, Open & Fully Populated for Selected Analysis) */}
<aside className={`w-full xl:w-inspector-width bg-surface-container-low rounded-xl shadow-xl flex flex-col shrink-0 overflow-hidden self-start sticky top-header-height${drawerOpen ? "" : " hidden"}`} id="detail-drawer">
{/* Drawer Top Bar */}
<div className="bg-surface-container px-space-base py-space-sm flex items-center justify-between">
<div className="flex items-center gap-space-xs min-w-0">
<span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-space-2xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate" id="drawer-capture-name">{selectedCapture}</span>
<span className="font-code-sm text-[9px] bg-primary-container text-on-primary-container px-1 rounded uppercase">Selected</span>
</div>
<span className="font-code-sm text-[10px] text-outline">Oct 22, 2025 · 14:02:19 UTC</span>
</div>
</div>
<button className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors" id="drawer-close-btn" title="Close Drawer" type="button" onClick={(e) => { e.stopPropagation(); setDrawerOpen(false); }}>
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
{/* Drawer Content Body */}
<div className="p-space-base flex flex-col gap-space-md max-h-[calc(100vh-14rem)] overflow-y-auto">
{/* Score & Risk Banner */}
<div className="bg-surface-container rounded-lg p-space-sm flex flex-col gap-space-xs shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-space-2xs">
<span className="font-display text-[26px] font-semibold text-error tracking-tight">47</span>
<span className="font-code-sm text-code-sm text-outline">/ 100</span>
<span className="font-label-sm text-label-sm text-outline-variant ml-1 uppercase">Posture Score</span>
</div>
<span className="inline-flex items-center gap-1 h-5 px-2 rounded font-code-sm text-code-sm font-semibold bg-error-container text-error tracking-wide">
                HIGH RISK
              </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Non-compliant cryptographic suite &amp; weak ephemeral key exchange detected. RFC 8247 minimum security thresholds failed.
            </p>
</div>
{/* Protocol & Association Architecture */}
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider">
<span>Negotiated Security Context</span>
<span className="font-code-sm text-[10px] text-tertiary">CONFIRMED</span>
</div>
<div className="grid grid-cols-2 gap-space-xs font-code-sm text-code-sm">
<div className="bg-surface-container p-space-xs rounded flex flex-col">
<span className="text-outline text-[10px] uppercase font-label-sm">Protocol / Mode</span>
<span className="text-on-surface font-medium">IKEv2 · Tunnel</span>
</div>
<div className="bg-surface-container p-space-xs rounded flex flex-col">
<span className="text-outline text-[10px] uppercase font-label-sm">Anti-Replay Window</span>
<span className="text-on-surface font-medium">64 Packets (Enabled)</span>
</div>
<div className="bg-surface-container p-space-xs rounded flex flex-col">
<span className="text-outline text-[10px] uppercase font-label-sm">Initiator Gateway</span>
<span className="text-on-surface font-medium">192.0.2.14</span>
</div>
<div className="bg-surface-container p-space-xs rounded flex flex-col">
<span className="text-outline text-[10px] uppercase font-label-sm">Responder Gateway</span>
<span className="text-on-surface font-medium">198.51.100.8</span>
</div>
</div>
</div>
{/* Top Curated Findings */}
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider">
<span>Priority Cryptographic Findings</span>
<span className="font-code-sm text-[10px] text-error font-medium">3 Detected</span>
</div>
<div className="flex flex-col gap-space-xs">
{/* Finding P0 */}
<div className="p-space-xs rounded bg-surface-container flex items-start gap-space-xs">
<span className="font-code-sm text-[10px] font-semibold text-error bg-error-container/40 px-1 py-0.5 rounded shrink-0">P0</span>
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface font-medium">Weak Diffie-Hellman Group 2 (MODP-1024)</span>
<span className="font-code-sm text-[11px] text-on-surface-variant mt-0.5">Negotiated in IKE_SA_INIT. RFC 8247 deprecates bit length &lt; 2048.</span>
</div>
</div>
{/* Finding P1 */}
<div className="p-space-xs rounded bg-surface-container flex items-start gap-space-xs">
<span className="font-code-sm text-[10px] font-semibold text-secondary-fixed bg-secondary-container/40 px-1 py-0.5 rounded shrink-0">P1</span>
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface font-medium">PFS Disabled on CHILD_SA</span>
<span className="font-code-sm text-[11px] text-on-surface-variant mt-0.5">Perfect Forward Secrecy omitted during phase 2 rekeying sequence.</span>
</div>
</div>
{/* Finding P2 */}
<div className="p-space-xs rounded bg-surface-container flex items-start gap-space-xs">
<span className="font-code-sm text-[10px] font-semibold text-secondary-fixed bg-secondary-container/40 px-1 py-0.5 rounded shrink-0">P2</span>
<div className="flex flex-col leading-tight">
<span className="font-body-sm text-body-sm text-on-surface font-medium">3DES-CBC Cipher Offered</span>
<span className="font-code-sm text-[11px] text-on-surface-variant mt-0.5">Legacy sweet32 vulnerable transform proposed in SA payload #3.</span>
</div>
</div>
</div>
</div>
{/* Traffic & Ingestion Summary Metric Strip */}
<div className="bg-surface-container rounded-lg p-space-sm flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider">
<span>Capture Ingestion Telemetry</span>
<span className="material-symbols-outlined text-[14px] text-tertiary">memory</span>
</div>
<div className="flex flex-col gap-1 font-code-sm text-code-sm text-on-surface-variant">
<div className="flex justify-between">
<span className="text-outline">Packet Volume:</span>
<span className="text-on-surface font-medium">1,482,091 packets</span>
</div>
<div className="flex justify-between">
<span className="text-outline">Wire Data Rate:</span>
<span className="text-on-surface font-medium">1.48 Gbps</span>
</div>
<div className="flex justify-between">
<span className="text-outline">Processing Duration:</span>
<span className="text-on-surface font-medium">18.4s</span>
</div>
<div className="flex justify-between">
<span className="text-outline">Ingestion Pipeline:</span>
<span className="text-primary font-medium">DPDK Ring 0 (Worker 2)</span>
</div>
</div>
</div>
{/* Quick Drawer Actions & Clear Hierarchy */}
<div className="flex flex-col gap-space-xs pt-space-xs">
{/* Primary Action */}
<button onClick={() => router.push("/analysis/results")} className="w-full h-8 px-space-base bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm rounded flex items-center justify-center gap-space-xs transition-colors shadow-sm" type="button">
<span>Open Full Analysis</span>
<span className="material-symbols-outlined text-[16px]">open_in_new</span>
</button>
<div className="grid grid-cols-2 gap-space-xs">
{/* Secondary Action */}
<button onClick={() => { downloadFile("weak-vpn-07-executive-report.json", executiveReportJSON()); toast({ title: "Report generated", body: "weak-vpn-07-executive-report.json downloaded.", kind: "ok" }); }} className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium rounded flex items-center justify-center gap-space-2xs transition-colors" type="button">
<span className="material-symbols-outlined text-[15px] text-outline">picture_as_pdf</span>
<span>Generate Report</span>
</button>
{/* Tertiary Action */}
<button onClick={() => router.push("/analysis/compare")} className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium rounded flex items-center justify-center gap-space-2xs transition-colors" type="button">
<span className="material-symbols-outlined text-[15px] text-outline">compare_arrows</span>
<span>Compare...</span>
</button>
</div>
{/* Contextual raw evidence drilldown link */}
<div className="pt-space-xs flex justify-center">
<a className="font-code-sm text-code-sm text-primary hover:text-primary-fixed inline-flex items-center gap-1 transition-colors" href="#">
<span className="material-symbols-outlined text-[14px]">dataset</span>
<span>View Raw Evidence / PCAP Trace</span>
</a>
</div>
</div>
</div>
</aside>
</div>
</div>
{/* Interactive behavior: row selection, drawer toggle, density toggle, search mock */}

</AppShell>
    </div>
  );
}
