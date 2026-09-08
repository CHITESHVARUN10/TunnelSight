"use client";
// Shared application shell: sidebar + header + main. Extracted from the
// Stitch screens so polish applies once, everywhere. Active nav styling is
// derived from the `active` prop (a route href, or "" for none).
// Header buttons keep data-action hooks consumed by HeaderBehavior.

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const NAV: { href: string; icon: string; label: string }[] = [
  { href: "/overview", icon: "dashboard", label: "Overview" },
  { href: "/analyze", icon: "file_open", label: "Analyze PCAP" },
  { href: "/analysis/live", icon: "pulse_alert", label: "Live Analysis" },
  { href: "/analysis/configuration", icon: "settings_ethernet", label: "VPN Configurations" },
  { href: "/analysis/traffic", icon: "insights", label: "Traffic Intelligence" },
  { href: "/analysis/findings", icon: "policy", label: "Findings" },
  { href: "/analysis/reports", icon: "assignment", label: "Reports" },
  { href: "/dataset", icon: "dataset", label: "Dataset / Testbed" },
  { href: "/settings", icon: "tune", label: "Settings" },
];

export function AppShell({
  active,
  children,
  innerClassName = "",
  innerStyle,
}: {
  active: string;
  children: ReactNode;
  innerClassName?: string;
  innerStyle?: CSSProperties;
}) {
  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none">
        <div className="flex flex-col">
          <div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest">
            <span className="material-symbols-outlined text-primary text-[20px]">security</span>
            <div className="flex items-baseline gap-space-2xs">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span>
              <span className="font-code-sm text-code-sm text-outline">/</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span>
            </div>
          </div>
          <div className="px-space-base py-space-xs bg-surface-container-low border-b border-hairline">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span>
              <span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span>
            </div>
          </div>
          <nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs">
            {NAV.map((item) =>
              item.href === active ? (
                <Link key={item.href} aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href={item.href}>
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="font-body-md text-body-md">{
item.label}</span>
                </Link>
              ) : (
                <Link key={item.href} className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href={item.href}>
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="p-space-sm bg-surface-container-lowest border-t border-hairline">
          <div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs">
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-outline uppercase">Pipeline</span>
              <span className="text-tertiary font-code-sm text-code-sm">ONLINE</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded">
              <div className="bg-primary-container h-1 rounded w-3/4"></div>
            </div>
            <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant">
              <span className="truncate">DPDK Core 0-3</span>
              <span className="text-on-surface">0.02ms</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="pl-sidebar-expanded">
        <header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none border-b border-hairline">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded">
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span>
              <span className="text-outline-variant font-code-sm text-code-sm">|</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span>
              <span className="text-outline-variant font-code-sm text-code-sm">|</span>
              <span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span>
            </div>
            <div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded">
              <span className="font-label-sm text-label-sm text-outline uppercase">Profile</span>
              <span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
              <span className="text-outline">UTC</span>
              <span className="">2025-05-18 14:32:09</span>
              <span className="text-outline-variant">|</span>
              <span className="text-outline">Buffer:</span>
              <span className="text-tertiary">98.4% Free</span>
            </div>
            <button data-action="search" className="flex items-center gap-2 bg-[#14171c] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 px-3 py-1.5 rounded-sm transition-colors text-xs font-mono" type="button">
              <span className="material-symbols-outlined text-[16px] text-teal-400">search</span>
              <span>Search packets/SPI/tunnels</span>
              <kbd className="bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 rounded-sm text-[10px] text-zinc-400">⌘K</kbd>
            </button>
            <div className="flex items-center gap-space-xs">
              <button data-action="export" className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button">
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
              <button data-action="notifications" className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span>
              </button>
              <ThemeToggle variant="inline" />
            </div>
            <div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div>
            <div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>
        <main className="relative pt-header-height w-full bg-background min-h-screen">
          <div className={`flex flex-col w-full text-on-surface ${innerClassName}`} style={innerStyle}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
