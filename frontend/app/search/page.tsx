"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";

export default function SearchOverlayPage() {
  const [query, setQuery] = useState("branch");
  const [activeScope, setActiveScope] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  const dismiss = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/overview");
    }
  };

  const openResult = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.currentTarget.textContent ?? "";
    if (t.includes("Weak Diffie-Hellman") || t.includes("PFS Disabled")) router.push("/analysis/findings");
    else if (t.includes(".pdf")) router.push("/analysis/reports");
    else router.push("/analysis/results");
  };

  const setScope = (scope: string, label: string) => {
    setActiveScope(scope);
    toast({ title: `Scope: ${label}`, body: `Filtered to ${label} results.`, kind: "info" });
  };

  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.focus();
      try {
        el.setSelectionRange(el.value.length, el.value.length);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/search">
        <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
          {/* Underlay Mockup: Dimmed SecOps Workbench */}
          <div className="w-full max-w-7xl px-6 py-8 pointer-events-none select-none opacity-25 filter blur-[2px] space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#111317] border border-zinc-800 p-4 rounded space-y-1">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase">
                  <span>Active IKEv2 SAs</span>
                  <span className="material-symbols-outlined text-teal-400 text-sm">key</span>
                </div>
                <div className="font-display-serif text-2xl text-zinc-100">
                  148 <span className="font-mono text-xs text-teal-400 font-normal">↑ 4%</span>
                </div>
                <span className="font-mono text-xs text-zinc-500 block">Latency: 24.1ms</span>
              </div>
              <div className="bg-[#111317] border border-zinc-800 p-4 rounded space-y-1">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase">
                  <span>ESP Throughput</span>
                  <span className="material-symbols-outlined text-teal-400 text-sm">speed</span>
                </div>
                <div className="font-display-serif text-2xl text-zinc-100">
                  4.82 <span className="font-mono text-xs text-zinc-400 font-normal">Gbps</span>
                </div>
                <span className="font-mono text-xs text-zinc-500 block">Drop rate: 0.000%</span>
              </div>
              <div className="bg-[#111317] border border-zinc-800 p-4 rounded space-y-1">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase">
                  <span>Compliance Violations</span>
                  <span className="material-symbols-outlined text-rose-400 text-sm">gpp_maybe</span>
                </div>
                <div className="font-display-serif text-2xl text-rose-400">
                  12 <span className="font-mono text-xs text-rose-400/80 font-normal">P0 / P1</span>
                </div>
                <span className="font-mono text-xs text-zinc-500 block">RFC 8247 Non-conformant</span>
              </div>
              <div className="bg-[#111317] border border-zinc-800 p-4 rounded space-y-1">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase">
                  <span>Capture Buffer</span>
                  <span className="material-symbols-outlined text-teal-400 text-sm">memory</span>
                </div>
                <div className="font-display-serif text-2xl text-zinc-100">
                  38.4 <span className="font-mono text-xs text-zinc-400 font-normal">GiB</span>
                </div>
                <span className="font-mono text-xs text-teal-400 block">RingBuffer Ready</span>
              </div>
            </div>

            <div className="bg-[#111317] border border-zinc-800 rounded p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-300">Operational Capture Stream</span>
                <span className="font-mono text-xs text-zinc-600">eth1.400 DPDK</span>
              </div>
              <div className="h-6 bg-zinc-900 rounded w-full"></div>
              <div className="h-8 bg-zinc-900/60 rounded w-full"></div>
              <div className="h-8 bg-zinc-900/60 rounded w-full"></div>
            </div>
          </div>

          {/* Global Modal Layer Overlay */}
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md"
            id="palette-backdrop"
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest("#command-modal")) dismiss();
            }}
          >
              {/* Command Palette Container */}
              <div
                className="w-full max-w-3xl bg-[#111317] border border-zinc-800 rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all"
                id="command-modal"
              >
                {/* Top Search Input */}
                <div className="p-4 bg-[#14171c] border-b border-zinc-800/80 space-y-3">
                  <div className="flex items-center gap-3 bg-[#0c0e11] border border-zinc-800/80 rounded px-3.5 py-2.5">
                    <span className="material-symbols-outlined text-teal-400 text-xl select-none">search</span>
                    <input
                      autoFocus
                      ref={inputRef}
                      className="w-full bg-transparent border-0 p-0 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none tracking-tight"
                      id="search-input"
                      placeholder="Search captures, tunnels, SPI (0x...), RFC findings, reports…"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-1.5 select-none font-mono">
                      {query && (
                        <button
                          className="flex items-center justify-center w-5 h-5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                          id="clear-search-btn"
                          title="Clear query"
                          onClick={handleClear}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                      <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded uppercase font-semibold">
                        ESC
                      </span>
                    </div>
                  </div>

                  {/* Scope Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto select-none font-mono text-xs">
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                        activeScope === "all"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                      }`}
                      onClick={() => setScope("all", "All Results")}
                      type="button"
                    >
                      <span>All Results</span>
                      <span className="text-[10px] text-zinc-500">37</span>
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                        activeScope === "captures"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                      }`}
                      onClick={() => setScope("captures", "Captures")}
                      type="button"
                    >
                      <span>Captures</span>
                      <span className="text-[10px] text-teal-400">14</span>
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                        activeScope === "findings"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                      }`}
                      onClick={() => setScope("findings", "Findings")}
                      type="button"
                    >
                      <span>Findings</span>
                      <span className="text-[10px] text-rose-400">8</span>
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                        activeScope === "vpns"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                      }`}
                      onClick={() => setScope("vpns", "VPNs")}
                      type="button"
                    >
                      <span>VPNs</span>
                      <span className="text-[10px] text-zinc-500">4</span>
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                        activeScope === "spi"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                      }`}
                      onClick={() => setScope("spi", "SPI")}
                      type="button"
                    >
                      <span>SPI</span>
                      <span className="text-[10px] text-cyan-400">6</span>
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                        activeScope === "reports"
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                          : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                      }`}
                      onClick={() => setScope("reports", "Reports")}
                      type="button"
                    >
                      <span>Reports</span>
                      <span className="text-[10px] text-zinc-500">5</span>
                    </button>
                  </div>
                </div>

                {/* Results Ledger Body */}
                <div className="max-h-[520px] overflow-y-auto p-4 space-y-4 font-mono text-xs" id="results-container">
                  {/* SECTION 1: CAPTURES */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                      <span>Captures (PCAP / PCAPNG)</span>
                      <span>Matches in filename &amp; IP</span>
                    </div>

                    {/* Item 1 */}
                    <div
                      className="group relative flex items-center justify-between p-3 rounded bg-[#0c0e11] border border-teal-500/40 hover:border-teal-500/70 cursor-pointer transition-all"
                      onClick={openResult}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-teal-500/10 text-teal-400 shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-base">receipt_long</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-100 truncate">
                              <span className="text-teal-400 font-bold">branch</span>-emea-gw04.pcap
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">PCAP</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
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
                      <div className="flex items-center gap-1 text-[11px] text-zinc-500 shrink-0 pl-3">
                        <span className="group-hover:text-teal-400">↵ Open</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div
                      className="group flex items-center justify-between p-3 rounded bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
                      onClick={openResult}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-zinc-800 text-zinc-400 group-hover:text-teal-400 shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-base">file_open</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-200 truncate">
                              edge-<span className="text-teal-400 font-bold">branch</span>-tokyo-02.pcapng
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">PCAPNG</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold">
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
                      <div className="hidden group-hover:flex items-center gap-1 text-[11px] text-teal-400 shrink-0 pl-3">
                        <span>↵ Open</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: FINDINGS */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                      <span>Findings &amp; Cryptographic Posture</span>
                      <span className="text-rose-400 font-medium">2 RFC Non-Conformances</span>
                    </div>

                    <div
                      className="group flex items-center justify-between p-3 rounded bg-[#0c0e11] border border-rose-500/30 hover:border-rose-500/60 cursor-pointer transition-colors"
                      onClick={openResult}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-rose-500/15 text-rose-400 shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-base">security_update_warning</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-100 truncate">Weak Diffie-Hellman Group 2 (MODP-1024)</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                              P0 CRITICAL
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                            <span className="text-rose-400">RFC 8247 § 2.4 Violation</span>
                            <span>·</span>
                            <span>Affected: <span className="text-teal-400 font-medium">branch</span>-emea-gw04</span>
                          </div>
                        </div>
                      </div>
                      <span className="hidden group-hover:inline-block text-[11px] text-teal-400 shrink-0 pl-3">
                        Inspect
                      </span>
                    </div>

                    <div
                      className="group flex items-center justify-between p-3 rounded bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
                      onClick={openResult}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-base">warning</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-100 truncate">PFS Disabled on CHILD_SA (Phase 2)</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                              P1 HIGH
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                            <span>5 captures affected</span>
                            <span>·</span>
                            <span>No ephemeral key exchange in <span className="text-teal-400 font-medium">branch</span> profile</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: SPI */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                      <span>SPI (Security Parameter Indexes)</span>
                      <span className="text-cyan-400">Hash Matches</span>
                    </div>

                    <div
                      className="group flex items-center justify-between p-3 rounded bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
                      onClick={openResult}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-zinc-800 text-teal-400 shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-base">tag</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-teal-400 tracking-wider">0x7a89f31c</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400 uppercase">Inbound SA</span>
                            <span className="text-zinc-500 text-[11px]">In: <span className="text-teal-400">branch</span>-emea-gw04.pcap</span>
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
                      <span className="hidden group-hover:inline-block text-[11px] text-teal-400 shrink-0 pl-3">
                        Jump to Hex
                      </span>
                    </div>
                  </div>

                  {/* SECTION 4: REPORTS */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                      <span>Reports &amp; Exported Audits</span>
                      <span className="text-zinc-500">Signed Forensics</span>
                    </div>

                    <div
                      className="group flex items-center justify-between p-3 rounded bg-[#0c0e11] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
                      onClick={openResult}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-zinc-800 text-zinc-400 group-hover:text-teal-400 shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-200 truncate">
                              <span className="text-teal-400">branch</span>-emea-security-assessment.pdf
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">PDF</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20">
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
                      <span className="hidden group-hover:inline-block text-[11px] text-teal-400 shrink-0 pl-3">
                        Download
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="bg-[#0f1115] border-t border-zinc-800/80 px-4 py-2.5 flex items-center justify-between select-none font-mono text-xs text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">↑</kbd>
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">↵</kbd>
                      <span>Select</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd>
                      <span>Dismiss</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    <span>1,428 traces · 4,891 SPIs indexed</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </AppShell>
    </div>
  );
}
