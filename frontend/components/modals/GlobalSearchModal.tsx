"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/mock/toast";

export function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeScope, setActiveScope] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  // Listen for global open events and keyboard shortcuts
  useEffect(() => {
    function handleOpenSearch() {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K or Ctrl+K opens/toggles search modal
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) setTimeout(() => inputRef.current?.focus(), 50);
          return next;
        });
      }

      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    window.addEventListener("tunnelsight:open-search", handleOpenSearch);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("tunnelsight:open-search", handleOpenSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const setScope = (scope: string, label: string) => {
    setActiveScope(scope);
    toast({ title: `Scope: ${label}`, body: `Filtered search to ${label}.`, kind: "info" });
  };

  const navigateTo = (path: string, msg?: string) => {
    setIsOpen(false);
    if (msg) toast({ title: "Opening forensic record", body: msg, kind: "info" });
    router.push(path);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-14 md:pt-20 px-4 bg-black/80 backdrop-blur-md select-none transition-all duration-150 animate-in fade-in"
      id="global-search-backdrop"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("#global-search-container")) {
          handleClose();
        }
      }}
    >
      <div
        id="global-search-container"
        className="w-full max-w-3xl bg-[#111317] border border-zinc-800/90 rounded-sm shadow-2xl flex flex-col overflow-hidden text-zinc-200 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Global Technical Search"
      >
        {/* Search Header Input */}
        <div className="p-4 bg-[#14171c] border-b border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-3 bg-[#0c0e11] border border-zinc-800 rounded-sm px-3.5 py-2.5">
            <span className="material-symbols-outlined text-teal-400 text-xl select-none">search</span>
            <input
              autoFocus
              ref={inputRef}
              className="w-full bg-transparent border-0 p-0 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none tracking-tight"
              id="global-search-input"
              placeholder="Search captures, tunnels, SPI (0x...), RFC findings, reports…"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2 select-none font-mono">
              {query && (
                <button
                  className="flex items-center justify-center w-5 h-5 rounded-sm hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                  title="Clear query"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
              <span className="text-[10px] text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.5 rounded-sm uppercase font-semibold">
                ESC
              </span>
            </div>
          </div>

          {/* Scope Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto select-none font-mono text-xs scrollbar-none">
            {[
              { id: "all", label: "All Results", count: 45 },
              { id: "captures", label: "Captures", count: 14, badgeColor: "text-teal-400" },
              { id: "findings", label: "Findings", count: 8, badgeColor: "text-rose-400" },
              { id: "docs", label: "Docs", count: 8, badgeColor: "text-emerald-400" },
              { id: "vpns", label: "VPNs", count: 4 },
              { id: "spi", label: "SPI", count: 6, badgeColor: "text-cyan-400" },
              { id: "reports", label: "Reports", count: 5 },
            ].map((scope) => (
              <button
                key={scope.id}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-sm transition-colors text-xs ${
                  activeScope === scope.id
                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/40 font-medium"
                    : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                }`}
                onClick={() => setScope(scope.id, scope.label)}
                type="button"
              >
                <span>{scope.label}</span>
                <span className={`text-[10px] ${scope.badgeColor || "text-zinc-500"}`}>{scope.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Ledger Body */}
        <div className="max-h-[500px] overflow-y-auto p-4 space-y-4 font-mono text-xs divide-y divide-zinc-800/40">
          {/* SECTION 1: CAPTURES */}
          {(activeScope === "all" || activeScope === "captures") && (
            <div className="space-y-2 pt-2 first:pt-0">
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                <span>Captures (PCAP / PCAPNG)</span>
                <span>Matches in filename &amp; IP</span>
              </div>

              {/* Capture 1 */}
              <div
                className="group relative flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-teal-500/30 hover:border-teal-500/70 hover:bg-[#14171c] cursor-pointer transition-all"
                onClick={() => navigateTo("/history", "Navigating to capture branch-emea-gw04.pcap")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-teal-500/10 text-teal-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 truncate">
                        <span className="text-teal-400 font-bold">branch</span>-emea-gw04.pcap
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-zinc-800 text-zinc-400">PCAP</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                        SCORE 61 · HIGH RISK
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span className="text-zinc-300">IKEv2/Tunnel</span>
                      <span>·</span>
                      <span>192.0.2.14 ↔ 198.51.100.8</span>
                      <span>·</span>
                      <span>18m ago by j.chen</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  ↵ Open
                </span>
              </div>

              {/* Capture 2 */}
              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/analysis/results", "Navigating to analysis results")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-zinc-800 text-zinc-400 group-hover:text-teal-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">file_open</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-200 truncate">
                        edge-<span className="text-teal-400 font-bold">branch</span>-tokyo-02.pcapng
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-zinc-800 text-zinc-400">PCAPNG</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold">
                        SCORE 88 · PASS
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>IKEv2/Transport</span>
                      <span>·</span>
                      <span>203.0.113.50 ↔ 198.51.100.1</span>
                      <span>·</span>
                      <span>Analyzed 2h ago</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  ↵ Open
                </span>
              </div>
            </div>
          )}

          {/* SECTION 2: FINDINGS */}
          {(activeScope === "all" || activeScope === "findings") && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                <span>Findings &amp; Cryptographic Posture</span>
                <span className="text-rose-400 font-medium">2 RFC Non-Conformances</span>
              </div>

              {/* Finding 1 */}
              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-rose-500/30 hover:border-rose-500/60 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/analysis/findings", "Inspecting Weak Diffie-Hellman Group 2")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-rose-500/15 text-rose-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">security_update_warning</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 truncate">Weak Diffie-Hellman Group 2 (MODP-1024)</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                        P0 CRITICAL
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span className="text-rose-400">RFC 8247 § 2.4 Violation</span>
                      <span>·</span>
                      <span>Affected: branch-emea-gw04</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  Inspect
                </span>
              </div>

              {/* Finding 2 */}
              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/analysis/findings", "Inspecting PFS Disabled on CHILD_SA")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">warning</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 truncate">PFS Disabled on CHILD_SA (Phase 2)</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                        P1 HIGH
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>5 captures affected</span>
                      <span>·</span>
                      <span>No ephemeral key exchange in branch profile</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  Inspect
                </span>
              </div>
            </div>
          )}

          {/* SECTION 3: SPI */}
          {(activeScope === "all" || activeScope === "spi") && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                <span>SPI (Security Parameter Indexes)</span>
                <span className="text-cyan-400">Hash Matches</span>
              </div>

              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/analysis/configuration", "Viewing SPI 0x7a89f31c in Configuration")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-zinc-800 text-teal-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">tag</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-400 tracking-wider">0x7a89f31c</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-zinc-800 text-zinc-400 uppercase">Inbound SA</span>
                      <span className="text-zinc-500 text-[11px]">In: branch-emea-gw04.pcap</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>ESP_AES_GCM_16_256</span>
                      <span>·</span>
                      <span>Seq Window: 64</span>
                      <span>·</span>
                      <span>Pkt Count: 148,209</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  Jump to Hex
                </span>
              </div>
            </div>
          )}

          {/* SECTION 4: REPORTS */}
          {(activeScope === "all" || activeScope === "reports") && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                <span>Reports &amp; Exported Audits</span>
                <span className="text-zinc-500">Signed Forensics</span>
              </div>

              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/analysis/reports", "Opening branch-emea assessment report")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-zinc-800 text-zinc-400 group-hover:text-teal-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200 truncate">
                        branch-emea-security-assessment.pdf
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-zinc-800 text-zinc-400">PDF</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        ED25519 SIGNED
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>Executive Cryptographic Posture</span>
                      <span>·</span>
                      <span>2.4 MB</span>
                      <span>·</span>
                      <span>Oct 22, 2025</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  Download
                </span>
              </div>
            </div>
          )}

          {/* SECTION 5: DOCUMENTATION & SPECIFICATIONS */}
          {(activeScope === "all" || activeScope === "docs") && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                <span>Documentation &amp; RFC Standards</span>
                <span className="text-emerald-400 font-medium">Knowledge Hub</span>
              </div>

              {/* Doc 1: Workflow */}
              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-teal-500/50 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/docs#workflow", "Opening End-to-End Workflow guide")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-teal-500/10 text-teal-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">alt_route</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 truncate">
                        End-to-End Operational Workflow
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        GUIDE
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>PCAP Ingestion → Pre-flight → SA Extraction → Remediation</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  ↵ Read
                </span>
              </div>

              {/* Doc 2: RFC Standards */}
              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-teal-500/50 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/docs#standards", "Opening RFC Standards Matrix")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">gavel</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 truncate">
                        RFC Compliance &amp; Regulatory Standards Matrix
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        RFC 7296 / 8247
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>NIST SP 800-77 Rev. 1 · CNSA 1.0 · FIPS 140-3 Cryptographic Mandates</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  ↵ Read
                </span>
              </div>

              {/* Doc 3: Page Guides */}
              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-teal-500/50 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/docs#pages", "Opening Page Architecture & Telemetry Guide")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-zinc-800 text-zinc-400 group-hover:text-teal-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">auto_stories</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200 truncate">
                        Operational Page Catalog &amp; Metric Telemetry
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-zinc-800 text-zinc-400">
                        12 PAGES
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>Detailed breakdown of every indicator across all 12 operational views</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  ↵ Read
                </span>
              </div>

              {/* Doc 4: Cryptographic Concepts */}
              <div
                className="group flex items-center justify-between p-3 rounded-sm bg-[#0c0e11] border border-zinc-800 hover:border-teal-500/50 hover:bg-[#14171c] cursor-pointer transition-colors"
                onClick={() => navigateTo("/docs#concepts", "Opening Cryptographic Deep-Dive")}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-1.5 rounded-sm bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">vpn_key</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200 truncate">
                        Cryptographic Foundations &amp; Protocol Theory
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        THEORY
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                      <span>IKEv1 vs IKEv2 · DH Group Deprecation · Anti-Replay Bitmaps · Sweet32</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-teal-400 shrink-0 pl-3">
                  ↵ Read
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-[#0f1115] border-t border-zinc-800/80 px-4 py-2.5 flex items-center justify-between select-none font-mono text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-sm text-[10px]">ESC</kbd>
              <span>Dismiss</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-sm text-[10px]">↵</kbd>
              <span>Navigate</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span>1,428 traces · 4,891 SPIs indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
