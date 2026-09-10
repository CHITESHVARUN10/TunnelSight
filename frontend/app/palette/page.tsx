"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";

interface CommandItem {
  id: string;
  title: string;
  desc: string;
  category: "Ingestion" | "Analysis" | "Navigation" | "Configuration";
  shortcut: string[];
  badge?: string;
  badgeType?: "teal" | "rose" | "emerald";
  action: () => void;
}

export default function CommandPalettePage() {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [activeScope, setActiveScope] = useState<"All" | "Ingestion" | "Analysis" | "Navigation" | "Configuration">("All");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = useMemo(() => [
    {
      id: "analyze",
      title: "Analyze PCAP",
      desc: "Upload or ingest trace for cryptographic inspection",
      category: "Ingestion",
      shortcut: ["⌘", "U"],
      badge: "INGEST",
      badgeType: "teal",
      action: () => router.push("/analyze"),
    },
    {
      id: "live",
      title: "Start Live Analysis",
      desc: "Attach ring buffer & monitor live TAP interface (dpdk0)",
      category: "Analysis",
      shortcut: ["⌘", "L"],
      badge: "dpdk0",
      badgeType: "emerald",
      action: () => router.push("/analysis/live"),
    },
    {
      id: "report",
      title: "Generate Forensic Report",
      desc: "Export PDF executive summary or JSON forensic artifact",
      category: "Analysis",
      shortcut: ["⌘", "R"],
      action: () => {
        downloadFile("tunnelsight-executive-report.json", JSON.stringify({ generated: new Date().toISOString() }, null, 2), "application/json");
        toast({ title: "Report generated", body: "tunnelsight-executive-report.json downloaded.", kind: "ok" });
      },
    },
    {
      id: "search",
      title: "Search Captures & SPIs",
      desc: "Filter ingested traces, SPI keys, and tunnel endpoints",
      category: "Navigation",
      shortcut: ["⌘", "K"],
      action: () => window.dispatchEvent(new CustomEvent("tunnelsight:open-search")),
    },
    {
      id: "history",
      title: "Open Session History",
      desc: "Audit ledger and previously analyzed forensic captures",
      category: "Navigation",
      shortcut: ["⌘", "H"],
      action: () => router.push("/history"),
    },
    {
      id: "findings",
      title: "Open Threat Matrix & Findings",
      desc: "Prioritized cryptographic vulnerabilities and RFC violations",
      category: "Analysis",
      shortcut: ["G", "F"],
      badge: "3 HIGH RISK",
      badgeType: "rose",
      action: () => router.push("/analysis/findings"),
    },
    {
      id: "compare",
      title: "Compare VPN Postures",
      desc: "Side-by-side posture diff between gateways & policies",
      category: "Analysis",
      shortcut: ["⌘", "D"],
      action: () => router.push("/analysis/compare"),
    },
    {
      id: "anomalies",
      title: "View Traffic Anomalies",
      desc: "Isolation Forest unsupervised telemetry scoring",
      category: "Analysis",
      shortcut: ["G", "A"],
      action: () => router.push("/analysis/anomalies"),
    },
    {
      id: "settings",
      title: "Open Settings & Engine Params",
      desc: "Pipeline tuning, RFC validation strictness & DPDK core mask",
      category: "Configuration",
      shortcut: ["⌘", ","],
      action: () => router.push("/settings"),
    },
  ], [router, toast]);

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesScope = activeScope === "All" || cmd.category === activeScope;
      const q = query.toLowerCase().trim();
      const matchesQuery = !q || cmd.title.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q);
      return matchesScope && matchesQuery;
    });
  }, [commands, activeScope, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  const dismiss = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/overview");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      dismiss();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-300 antialiased relative overflow-hidden flex flex-col justify-between select-none">
      {/* Background App Mockup (dimmed/frosted for true overlay feel) */}
      <div className="absolute inset-0 z-0 filter blur-[2px] opacity-25 pointer-events-none p-6 flex flex-col space-y-4">
        <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
            <span className="text-teal-400 font-semibold tracking-tight">TunnelSight</span>
            <span>/</span>
            <span>IPsecXray</span>
            <span className="text-teal-400 ml-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> ENGINE ONLINE
            </span>
          </div>
          <div className="h-7 w-64 bg-zinc-900 border border-zinc-800 rounded px-2 text-xs flex items-center justify-between text-zinc-500 font-mono">
            <span>Search packets/SPI/tunnels</span>
            <kbd className="border border-zinc-700 px-1 py-0.5 text-[10px] rounded">⌘K</kbd>
          </div>
        </header>
        <div className="grid grid-cols-4 gap-4 flex-1">
          <div className="col-span-1 border border-zinc-800/80 bg-zinc-900/40 rounded-sm p-4 space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-24"></div>
            <div className="h-3 bg-zinc-800/50 rounded w-40"></div>
          </div>
          <div className="col-span-3 border border-zinc-800/80 bg-zinc-900/40 rounded-sm p-4 space-y-4">
            <div className="h-6 bg-zinc-800 rounded w-64"></div>
            <div className="h-48 bg-zinc-800/30 rounded border border-zinc-800/50"></div>
          </div>
        </div>
      </div>

      {/* Backdrop Modal Overlay */}
      <div 
        className="absolute inset-0 z-10 bg-black/80 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) dismiss();
        }}
      >
        {/* Command Palette Dialog Container */}
        <div 
          className="w-full max-w-[620px] bg-[#111317] border border-zinc-800 rounded-sm shadow-2xl shadow-black/90 overflow-hidden flex flex-col transition-all"
          onKeyDown={handleKeyDown}
        >
          {/* Search Input Area */}
          <div className="relative flex items-center px-4 py-3.5 border-b border-zinc-800/90 bg-[#14171c]">
            <div className="flex items-center justify-center text-teal-400 mr-3 font-mono text-sm font-semibold">
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <input 
              id="cmd-input"
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or jump to tool..." 
              className="flex-1 bg-transparent border-0 p-0 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans font-normal"
              autoComplete="off" 
              spellCheck="false"
              autoFocus
            />

            <div className="flex items-center gap-1.5 ml-2">
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-mono font-medium text-zinc-400 bg-zinc-800/80 border border-zinc-700/70 rounded hover:text-zinc-200"
              >
                ESC
              </button>
            </div>
          </div>

          {/* Quick Category Filter Bar */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-[#0e1014] border-b border-zinc-800/60 text-[11px] font-mono text-zinc-400 overflow-x-auto">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px] mr-1">Scope:</span>
            {(["All", "Ingestion", "Analysis", "Navigation", "Configuration"] as const).map((scope) => (
              <button
                key={scope}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  activeScope === scope
                    ? "bg-zinc-800 text-teal-400 border border-zinc-700/80 font-medium"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
                onClick={() => {
                  setActiveScope(scope);
                  toast({ title: `Scope: ${scope}`, body: `Filtered commands to ${scope}.`, kind: "info" });
                }}
              >
                {scope === "All" ? "All Commands" : scope}
              </button>
            ))}
          </div>

          {/* Commands List Container */}
          <div className="max-h-[380px] overflow-y-auto py-2 text-xs" id="command-list">
            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                No matching commands found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="px-2 space-y-1">
                {filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      className={`group flex items-center justify-between px-2.5 py-2 rounded-sm border cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-zinc-800/70 border-teal-500/40 text-zinc-100"
                          : "bg-transparent border-transparent text-zinc-300 hover:bg-zinc-800/40 hover:text-white"
                      }`}
                      tabIndex={0}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-6 h-6 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-teal-500/10 border-teal-500/40 text-teal-400"
                            : "bg-zinc-800/80 border-zinc-700/60 text-zinc-400 group-hover:text-teal-400"
                        }`}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white text-[13px] truncate">{cmd.title}</span>
                            {cmd.badge && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                cmd.badgeType === "teal"
                                  ? "bg-teal-950/60 border-teal-800/50 text-teal-300"
                                  : cmd.badgeType === "rose"
                                  ? "bg-rose-950/60 border-rose-800/50 text-rose-400"
                                  : "bg-emerald-950/60 border-emerald-800/50 text-emerald-400"
                              }`}>
                                {cmd.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 font-normal truncate">{cmd.desc}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 font-mono text-[11px] text-zinc-400 flex-shrink-0 ml-3">
                        {cmd.shortcut.map((key, kIdx) => (
                          <kbd key={kIdx} className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Command Palette Technical Footer */}
          <div className="px-4 py-2.5 bg-[#0d0f12] border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">↑</kbd>
                <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">↓</kbd>
                <span className="text-zinc-400">Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">↵</kbd>
                <span className="text-zinc-400">Execute</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">ESC</kbd>
                <span className="text-zinc-400">Close</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>v2.4.1-rc3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
