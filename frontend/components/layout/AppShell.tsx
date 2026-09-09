"use client";
// Shared application shell: sidebar + header + main.
// Includes persistent collapsible toggle (stored in localStorage & hotkey ⌘B),
// modernized grouped navigation, and elevated hardware telemetry widget.

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: string;
  badgeType?: "live" | "docs" | "counter";
}

interface NavSection {
  group: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    group: "Core Observability",
    items: [
      { href: "/overview", icon: "dashboard", label: "Overview" },
      { href: "/analyze", icon: "file_open", label: "Analyze PCAP" },
      { href: "/analysis/live", icon: "pulse_alert", label: "Live Analysis", badge: "LIVE", badgeType: "live" },
    ],
  },
  {
    group: "Cryptographic Audit",
    items: [
      { href: "/analysis/configuration", icon: "settings_ethernet", label: "VPN Configurations" },
      { href: "/analysis/traffic", icon: "insights", label: "Traffic Intelligence" },
      { href: "/analysis/findings", icon: "policy", label: "Findings" },
      { href: "/analysis/reports", icon: "assignment", label: "Reports" },
    ],
  },
  {
    group: "Platform & Docs",
    items: [
      { href: "/dataset", icon: "dataset", label: "Dataset / Testbed" },
      { href: "/docs", icon: "menu_book", label: "Documentation", badge: "HUB", badgeType: "docs" },
      { href: "/settings", icon: "tune", label: "Settings" },
    ],
  },
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync state with localStorage and keyboard shortcut (⌘B or Ctrl+B)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tunnelsight:sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => {
          const next = !prev;
          localStorage.setItem("tunnelsight:sidebar_collapsed", String(next));
          return next;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("tunnelsight:sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <>
      {/* ============ REVAMPED COLLAPSIBLE SIDEBAR ============ */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest/95 backdrop-blur-xl border-r border-hairline/80 z-50 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out ${
          isCollapsed ? "-translate-x-full pointer-events-none" : "translate-x-0"
        }`}
        aria-hidden={isCollapsed}
        id="app-sidebar"
      >
        <div className="flex flex-col">
          {/* Top Brand Header */}
          <div className="h-header-height px-4 flex items-center justify-between border-b border-hairline/60 bg-surface-container-low/60">
            <Link href="/overview" className="flex items-center gap-2.5 group">
              <span className="w-7 h-7 rounded bg-primary/15 border border-primary/40 flex items-center justify-center text-primary group-hover:border-primary transition-colors shadow-[0_0_12px_rgba(20,184,166,0.2)]">
                <span className="material-symbols-outlined text-[17px]">security</span>
              </span>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-sans text-sm font-semibold text-on-surface tracking-tight">TunnelSight</span>
                  <span className="font-mono text-[11px] text-outline">/ Xray</span>
                </div>
                <span className="font-mono text-[9px] text-primary/90 tracking-widest uppercase -mt-0.5">SEC-OPS v2.4</span>
              </div>
            </Link>

            {/* Collapse button on sidebar header */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded text-outline hover:text-on-surface hover:bg-surface-container-high/80 transition-colors"
              title="Collapse Sidebar (⌘B)"
              type="button"
              aria-label="Collapse sidebar"
            >
              <span className="material-symbols-outlined text-[18px]">dock_to_left</span>
            </button>
          </div>

          {/* Subheader Status Pill */}
          <div className="px-4 py-2 bg-surface-container-low border-b border-hairline/40 flex items-center justify-between font-mono text-[11px]">
            <span className="text-outline uppercase tracking-wider text-[10px]">Active Profile</span>
            <span className="text-primary font-medium">Enterprise-Edge</span>
          </div>

          {/* Navigation Groups */}
          <nav className="flex flex-col gap-4 p-3 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
            {NAV_SECTIONS.map((section) => (
              <div key={section.group} className="flex flex-col gap-1">
                <span className="px-2.5 text-[10px] font-mono text-outline uppercase tracking-wider font-semibold">
                  {section.group}
                </span>

                <div className="flex flex-col gap-0.5 mt-0.5">
                  {section.items.map((item) => {
                    const isActive = item.href === active;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`group relative flex items-center justify-between px-3 py-2 rounded text-xs transition-all font-sans ${
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/30 font-semibold shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 border border-transparent"
                        }`}
                      >
                        {/* Active left indicator accent bar */}
                        {isActive && (
                          <span className="absolute left-0 inset-y-1.5 w-0.5 bg-primary rounded-r-full shadow-[0_0_8px_#14b8a6]" />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`material-symbols-outlined text-[18px] shrink-0 transition-colors ${
                              isActive ? "text-primary" : "text-outline group-hover:text-on-surface-variant"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>

                        {/* Optional Badges */}
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded tracking-wider uppercase shrink-0 ${
                              item.badgeType === "live"
                                ? "bg-error/20 text-error border border-error/40 animate-pulse"
                                : item.badgeType === "docs"
                                ? "bg-primary/20 text-primary border border-primary/40"
                                : "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Elevated Telemetry Hardware Mini-Card */}
        <div className="p-3 bg-surface-container-low border-t border-hairline/80">
          <div className="p-2.5 rounded bg-surface-container border border-hairline/90 flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-on-surface-variant font-semibold tracking-wider uppercase">DPDK RX ENGINE</span>
              </div>
              <span className="text-primary font-bold">ONLINE</span>
            </div>

            {/* Hardware Ring Buffer Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-outline">
                <span>Ring Buffer (0-3)</span>
                <span className="text-on-surface-variant">0.02ms</span>
              </div>
              <div className="w-full bg-surface-container-high/80 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-tertiary h-1 rounded-full w-3/4 shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] text-outline pt-0.5 border-t border-hairline/50">
              <span>ML Workers: 4/4</span>
              <span className="text-tertiary">98.4% Free</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ============ MAIN CONTENT WRAPPER ============ */}
      <div className={`transition-[padding] duration-300 ease-in-out ${isCollapsed ? "pl-0" : "pl-64"}`}>
        {/* Fixed Header Bar */}
        <header
          className={`fixed top-0 right-0 h-header-height bg-surface-container-lowest/90 backdrop-blur-md z-40 flex items-center justify-between px-4 select-none border-b border-hairline/80 transition-[left] duration-300 ease-in-out ${
            isCollapsed ? "left-0" : "left-64"
          }`}
        >
          {/* Left section: Persistent toggle button + status badges */}
          <div className="flex items-center gap-3">
            {/* PERSISTENT SIDEBAR TOGGLE BUTTON */}
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-8 h-8 rounded bg-surface-container-high hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-hairline hover:border-hairline transition-all shadow-lift-sm group"
              title={isCollapsed ? "Expand Sidebar (⌘B)" : "Collapse Sidebar (⌘B)"}
              type="button"
              aria-label="Toggle Sidebar Navigation"
              id="sidebar-persistent-toggle"
            >
              <span className="material-symbols-outlined text-[19px] group-hover:text-primary transition-colors">
                {isCollapsed ? "menu_open" : "dock_to_left"}
              </span>
            </button>

            {/* If collapsed, show small brand lockup */}
            {isCollapsed && (
              <Link href="/overview" className="flex items-center gap-2 pr-2 border-r border-hairline">
                <span className="w-5 h-5 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs">
                  <span className="material-symbols-outlined text-[14px]">security</span>
                </span>
                <span className="font-sans text-xs font-semibold text-on-surface">TunnelSight</span>
              </Link>
            )}

            {/* Engine status indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded border border-hairline/70 font-mono text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-on-surface font-medium">ENGINE ONLINE</span>
              <span className="text-outline">|</span>
              <span className="text-on-surface-variant">DPDK: READY</span>
              <span className="text-outline">|</span>
              <span className="text-primary">ML: ACTIVE</span>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded border border-hairline/70 font-mono text-xs text-on-surface-variant">
              <span className="text-outline uppercase text-[10px]">Profile:</span>
              <span className="text-primary font-medium">Enterprise-Edge-Audit</span>
            </div>
          </div>

          {/* Right section: Search button, shortcuts, theme toggle, profile */}
          <div className="flex items-center gap-3">
            <button
              data-action="search"
              className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-hairline px-3 py-1.5 rounded transition-colors text-xs font-mono"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">search</span>
              <span className="hidden md:inline">Search packets/SPI/tunnels</span>
              <kbd className="bg-surface-container-high/80 border border-hairline/60 px-1.5 py-0.5 rounded text-[10px] text-on-surface-variant">⌘K</kbd>
            </button>

            <div className="flex items-center gap-1">
              <button
                data-action="export"
                className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                title="Quick Export"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
              <button
                data-action="notifications"
                className="relative p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                title="Notification Feed"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>
              <ThemeToggle variant="inline" />
            </div>

            <div className="h-4 w-px bg-surface-container-high mx-1" />
            <div
              data-action="profile"
              role="button"
              tabIndex={0}
              className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
              title="Analyst Profile"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
            </div>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="relative pt-header-height w-full bg-background min-h-screen">
          <div className={`flex flex-col w-full text-on-surface ${innerClassName}`} style={innerStyle}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
