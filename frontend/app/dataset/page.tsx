"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";

export default function DatasetPage() {
  const [activeProfile, setActiveProfile] = useState("modern-strong");
  const [isCapturing, setIsCapturing] = useState(false);
  const [inspect, setInspect] = useState({
    open: false,
    filename: "synth-modern-01.pcap",
    sha: "—",
    split: "—",
  });
  const [stanzaApplied, setStanzaApplied] = useState(false);
  const stanzaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const NOT_WIRED = "This harness view is not connected to the backend yet.";

  const openInspect = (filename: string, sha: string, split: string) =>
    setInspect({ open: true, filename, sha, split });
  const closeInspect = () => setInspect((s) => ({ ...s, open: false }));
  const toast = useToast();

  const handleApplyStanza = () => {
    setStanzaApplied(true);
    toast({ title: "Stanza staged", body: NOT_WIRED, kind: "info" });
    if (stanzaTimer.current) clearTimeout(stanzaTimer.current);
    stanzaTimer.current = setTimeout(() => setStanzaApplied(false), 2400);
  };

  const INSPECT_META: Record<string, { sha: string; split: string }> = {};

  const rowFilename = (el: HTMLElement) => {
    const m = (el.closest("tr")?.textContent ?? "").match(/[\w\-]+\.(?:pcap|parquet|pcapng)/);
    return m?.[0] ?? "synth-modern-01.pcap";
  };

  const downloadRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const f = rowFilename(e.currentTarget);
    toast({ title: "Artifact unavailable", body: NOT_WIRED, kind: "info" });
    void f;
  };

  const haltCapture = () => {
    setIsCapturing(false);
    toast({ title: "Capture sessions", body: NOT_WIRED, kind: "info" });
  };

  const syncGateways = () => toast({ title: "Gateway states", body: NOT_WIRED, kind: "info" });
  const exportArtifacts = () => toast({ title: "Export", body: NOT_WIRED, kind: "info" });
  const resetHarness = () => toast({ title: "Testbed harness", body: NOT_WIRED, kind: "info" });
  const generateTraffic = () => toast({ title: "Traffic generation", body: NOT_WIRED, kind: "info" });
  const configureStream = () => toast({ title: "Stream designer", body: NOT_WIRED, kind: "info" });
  const exportArchive = () => toast({ title: "Archive export", body: NOT_WIRED, kind: "info" });
  const pageToast = () => toast({ title: "Pagination", body: NOT_WIRED, kind: "info" });

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/dataset">
        {/* Header Bar */}
        <header className="px-6 py-5 bg-[#0f1115] border-b border-zinc-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span>Testbed Laboratory</span>
              <span className="text-zinc-600">/</span>
              <span>Hardware-in-the-Loop Harness</span>
              <span className="text-zinc-600">/</span>
              <span className="text-teal-400 font-medium">IPsec Synth-01</span>
              <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] uppercase tracking-wider font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                ONLINE TAP
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-display-serif text-2xl md:text-3xl text-zinc-100 tracking-tight">
                Dataset Curation &amp; IPsec Testbed Console
              </h1>
              <span className="font-mono text-xs text-zinc-500 hidden md:inline">DPDK RX Ring: 0% Drops</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-4xl">
              Hardware-accelerated gateway posture verification, synthetic traffic injection, and RFC compliance benchmark generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <button
              onClick={syncGateways}
              type="button"
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px] text-zinc-400">sync</span>
              <span>Sync Gateways</span>
            </button>
            <button
              onClick={exportArtifacts}
              type="button"
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px] text-zinc-400">file_download</span>
              <span>Export Manifest</span>
            </button>
            <button
              onClick={resetHarness}
              type="button"
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Reset Harness</span>
            </button>
            <button
              onClick={generateTraffic}
              type="button"
              className="px-3 py-1.5 rounded bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-xs font-mono text-teal-300 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px] text-teal-400">bolt</span>
              <span>Inject Traffic</span>
            </button>
            <button
              onClick={() => {
                setIsCapturing((v) => !v);
                toast({ title: "Capture sessions", body: NOT_WIRED, kind: "info" });
              }}
              type="button"
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors flex items-center gap-2 border ${
                isCapturing
                  ? "bg-teal-500/15 text-teal-300 border-teal-500/40 hover:bg-teal-500/25"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isCapturing && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isCapturing ? "bg-teal-400" : "bg-zinc-500"}`}></span>
              </span>
              <span>{isCapturing ? "Capture Active" : "Capture Paused"}</span>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
          {/* Section 1: Posture & Vulnerability Injection Profiles */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-lg">tune</span>
                  Preset Posture &amp; Vulnerability Profiles
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Simulate standard RFC configurations or test detection against intentional cryptographic downgrades
                </p>
              </div>
              <button
                onClick={handleApplyStanza}
                type="button"
                className="self-start sm:self-auto px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-teal-400 transition-colors flex items-center gap-1.5"
              >
                {stanzaApplied ? (
                  <>
                    <span className="material-symbols-outlined text-sm text-teal-400">check</span>
                    <span className="text-teal-400">Applied to Gateways</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">terminal</span>
                    <span>Apply Stanza to Rig</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Profile 1 */}
              <div
                onClick={() => setActiveProfile("modern-strong")}
                className={`p-4 rounded border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  activeProfile === "modern-strong"
                    ? "bg-[#14171c] border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                    : "bg-[#111317] border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-teal-400">01. Modern/Strong</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      CNSA 1.0
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-100 pt-1">AES-256-GCM</div>
                  <div className="font-mono text-xs text-zinc-400">ECP-384 (Group 20) · SHA-384 PRF</div>
                  <p className="text-xs text-zinc-500 pt-1">FIPS 140-3 &amp; RFC 8247 compliant posture.</p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-teal-400">High Assurance</span>
                  <span className="text-zinc-500">{activeProfile === "modern-strong" ? "Active" : "Click to select"}</span>
                </div>
              </div>

              {/* Profile 2 */}
              <div
                onClick={() => setActiveProfile("aes128-cbc")}
                className={`p-4 rounded border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  activeProfile === "aes128-cbc"
                    ? "bg-[#14171c] border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                    : "bg-[#111317] border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-zinc-300">02. Legacy Interop</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      RFC 4301
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-100 pt-1">AES-128-CBC</div>
                  <div className="font-mono text-xs text-zinc-400">Group 14 (MODP-2048) · SHA1-96</div>
                  <p className="text-xs text-zinc-500 pt-1">Legacy interop fallback with CBC mode ciphertext.</p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Transitional</span>
                  <span className="text-zinc-500">{activeProfile === "aes128-cbc" ? "Active" : "Click to select"}</span>
                </div>
              </div>

              {/* Profile 3 */}
              <div
                onClick={() => setActiveProfile("weak-dh")}
                className={`p-4 rounded border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  activeProfile === "weak-dh"
                    ? "bg-[#1a1315] border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                    : "bg-[#111317] border-rose-900/30 hover:border-rose-900/60"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-rose-400">03. Weak DH (Logjam)</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      VULN
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-rose-300 pt-1">MODP-1024 (Group 2)</div>
                  <div className="font-mono text-xs text-zinc-400">AES-128-CBC / SHA1 · RFC 8247 Deprecated</div>
                  <p className="text-xs text-zinc-500 pt-1">Vulnerable to discrete log precomputations.</p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-medium">Exploit Simulation</span>
                  <span className="text-zinc-500">{activeProfile === "weak-dh" ? "Active" : "Inject Vuln"}</span>
                </div>
              </div>

              {/* Profile 4 */}
              <div
                onClick={() => setActiveProfile("pfs-disabled")}
                className={`p-4 rounded border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  activeProfile === "pfs-disabled"
                    ? "bg-[#1a1315] border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                    : "bg-[#111317] border-rose-900/30 hover:border-rose-900/60"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-rose-400">04. PFS Disabled</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      SNDL RISK
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-100 pt-1">No KEi Child SA</div>
                  <div className="font-mono text-xs text-zinc-400">Static SKEYSEED Bind · Key Reuse</div>
                  <p className="text-xs text-zinc-500 pt-1">Child SA keys derived purely from parent exchange.</p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-medium">Retroactive Decrypt</span>
                  <span className="text-zinc-500">{activeProfile === "pfs-disabled" ? "Active" : "Inject Vuln"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Traffic Generator Engine */}
          <section className="p-5 rounded-lg bg-[#111317] border border-zinc-800/80 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-lg">speed</span>
                  Traffic Generator Engine
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 ml-2">
                    Kernel Bypass On
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Multi-stream synthetic payload generator with microsecond rate shaping
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono bg-[#0c0e11] px-3 py-1.5 rounded border border-zinc-800">
                <div>
                  <span className="text-zinc-500">Aggregate: </span>
                  <span className="text-teal-400 font-semibold">4,896 pkts/s</span>
                </div>
                <span className="text-zinc-700">|</span>
                <div>
                  <span className="text-zinc-500">Bandwidth: </span>
                  <span className="text-zinc-200 font-semibold">3.63 MB/s</span>
                </div>
                <span className="text-zinc-700">|</span>
                <div>
                  <span className="text-zinc-500">Queue Depth: </span>
                  <span className="text-zinc-300">12.4%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stream 1 */}
              <div className="p-4 rounded bg-[#0c0e11] border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-base">public</span>
                    <span className="font-mono text-xs font-semibold text-zinc-200">Web (HTTP/HTTPS)</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">ACTIVE</span>
                </div>
                <div className="space-y-1 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between"><span>Profile</span><span className="text-zinc-200">TLS 1.3 Synthetic GET</span></div>
                  <div className="flex justify-between"><span>Packet Size</span><span className="text-zinc-200">MSS 1420 (Avg 890B)</span></div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                  <input className="w-full h-1 bg-zinc-800 rounded accent-teal-400 cursor-pointer" max="1500" min="50" type="range" defaultValue="450" />
                  <span className="font-mono text-xs text-teal-400 w-16 text-right">450 p/s</span>
                </div>
              </div>

              {/* Stream 2 */}
              <div className="p-4 rounded bg-[#0c0e11] border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-base">smart_display</span>
                    <span className="font-mono text-xs font-semibold text-zinc-200">Video (ABR Stream)</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">ACTIVE</span>
                </div>
                <div className="space-y-1 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between"><span>Profile</span><span className="text-zinc-200">Chunked 8s GoP / H.265</span></div>
                  <div className="flex justify-between"><span>Packet Size</span><span className="text-zinc-200">Full Jumbo (1400B)</span></div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                  <input className="w-full h-1 bg-zinc-800 rounded accent-teal-400 cursor-pointer" max="6000" min="200" type="range" defaultValue="2400" />
                  <span className="font-mono text-xs text-teal-400 w-16 text-right">2.4k p/s</span>
                </div>
              </div>

              {/* Stream 3 */}
              <div className="p-4 rounded bg-[#0c0e11] border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-base">call</span>
                    <span className="font-mono text-xs font-semibold text-zinc-200">VoIP (RTP / SIP)</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">ACTIVE</span>
                </div>
                <div className="space-y-1 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between"><span>Profile</span><span className="text-zinc-200">Isochronous Opus 20ms</span></div>
                  <div className="flex justify-between"><span>Packet Size</span><span className="text-zinc-200">Rigid 214B ESP</span></div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                  <input className="w-full h-1 bg-zinc-800 rounded accent-teal-400 cursor-pointer" max="300" min="10" type="range" defaultValue="50" />
                  <span className="font-mono text-xs text-teal-400 w-16 text-right">50 p/s</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Ground-Truth Telemetry & Artifact Repository */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-lg">biotech</span>
                  Ground-Truth Datasets &amp; Replay Traces
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Curated forensic captures validated against ground-truth dissection benchmarks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter datasets..."
                  className="px-3 py-1.5 rounded bg-[#111317] border border-zinc-800 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/60 w-52"
                />
              </div>
            </div>

            {/* Macro Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Captures</span>
                <div className="font-display-serif text-3xl text-zinc-100">42</div>
                <div className="font-mono text-xs text-zinc-500">38 Validated · 4 In-Flight</div>
              </div>
              <div className="p-4 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Cumulative Volume</span>
                <div className="font-display-serif text-3xl text-teal-400">24.8M</div>
                <div className="font-mono text-xs text-teal-400/80">Zero Ingress Drops</div>
              </div>
              <div className="p-4 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Labeled Flows</span>
                <div className="font-display-serif text-3xl text-zinc-100">1,284</div>
                <div className="font-mono text-xs text-zinc-500">100% Dissection Verified</div>
              </div>
              <div className="p-4 rounded bg-[#111317] border border-zinc-800/80 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Timespan</span>
                <div className="font-display-serif text-3xl text-zinc-100">48h 12m</div>
                <div className="font-mono text-xs text-zinc-500">2025-05-01 → Continuous</div>
              </div>
            </div>

            {/* Partition Stratification Bar */}
            <div className="p-4 rounded bg-[#111317] border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Stratified Dataset Partition Allocation</span>
                <span className="text-zinc-200">24,819,402 Packets Total</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-900 rounded overflow-hidden flex">
                <div className="bg-teal-500 h-full" style={{ width: "70%" }} title="Train: 70%"></div>
                <div className="bg-cyan-600 h-full" style={{ width: "15%" }} title="Validation: 15%"></div>
                <div className="bg-amber-600 h-full" style={{ width: "15%" }} title="Test: 15%"></div>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-500"></span>
                  <span className="text-zinc-400">Train:</span>
                  <span className="text-zinc-200">70% (17.37M pkts)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600"></span>
                  <span className="text-zinc-400">Validation:</span>
                  <span className="text-zinc-200">15% (3.72M pkts)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-600"></span>
                  <span className="text-zinc-400">Test:</span>
                  <span className="text-zinc-200">15% (3.72M pkts)</span>
                </div>
              </div>
            </div>

            {/* Tabular Dataset Manifest */}
            <div className="rounded border border-zinc-800/80 overflow-hidden bg-[#111317]">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="bg-[#0f1115] text-zinc-400 uppercase tracking-wider border-b border-zinc-800/80">
                      <th className="px-4 py-3">File Artifact</th>
                      <th className="px-4 py-3">Packets</th>
                      <th className="px-4 py-3">Applied Posture</th>
                      <th className="px-4 py-3">Ground Truth</th>
                      <th className="px-4 py-3">SHA-256 Digest</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    <tr className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-zinc-200 flex items-center gap-2">
                        <span className="material-symbols-outlined text-zinc-500 text-base">description</span>
                        <span>synth-modern-01.pcap</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">842,914 pkts</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">Modern / Strong</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                          100% Ground Truth
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 font-mono">3d120a48...90ae7b12</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openInspect("synth-modern-01.pcap", "—", "—")}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-teal-400 transition-colors"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={downloadRow}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-zinc-800/30 transition-colors bg-rose-500/[0.02]">
                      <td className="px-4 py-3 font-semibold text-rose-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-400 text-base">warning</span>
                        <span>weak-vpn-07.pcap</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">842,914 pkts</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          Weak DH + No PFS
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                          Anomaly Ground Truth
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 font-mono">7f892a01...c42b490f</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openInspect("weak-vpn-07.pcap", "—", "—")}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-teal-400 transition-colors"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={downloadRow}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-zinc-200 flex items-center gap-2">
                        <span className="material-symbols-outlined text-zinc-500 text-base">description</span>
                        <span>ipv6-transit-03.pcap</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">1,420,100 pkts</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">IPv6 Tunnel / ESN</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                          100% Ground Truth
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 font-mono">e82103ba...11cb9304</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openInspect("ipv6-transit-03.pcap", "—", "—")}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-teal-400 transition-colors"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={downloadRow}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-zinc-200 flex items-center gap-2">
                        <span className="material-symbols-outlined text-zinc-500 text-base">description</span>
                        <span>bulk-sftp-highburst.parquet</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">3,124,500 pkts</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">AES-256 GCM Fast</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px]">
                          Parquet Formatted
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 font-mono">1a44c9b2...019488d1</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openInspect("bulk-sftp-highburst.parquet", "—", "—")}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-teal-400 transition-colors"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={downloadRow}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Live Row */}
                    <tr className="hover:bg-zinc-800/30 transition-colors bg-teal-500/[0.03]">
                      <td className="px-4 py-3 font-semibold text-teal-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        <span>live-session-capture-active.pcap</span>
                      </td>
                      <td className="px-4 py-3 text-teal-400 font-semibold">— pkts</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          Active Profile
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px]">
                          STREAMING TAP
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 font-mono">in-flight buffer...</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={haltCapture}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400 transition-colors"
                          >
                            Halt
                          </button>
                          <button
                            onClick={() => openInspect("live-session-capture-active.pcap", "—", "—")}
                            type="button"
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-teal-400 transition-colors"
                          >
                            Tail
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-4 py-3 bg-[#0f1115] border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-3">
                  <span>Storage: /mnt/fast-nvme/datasets</span>
                  <span className="text-zinc-700">|</span>
                  <span>Used: <span className="text-zinc-200">214.2 GB</span> / 1.8 TB</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-teal-400">SHA-256 Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={pageToast} type="button" className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400">Prev</button>
                  <span className="text-zinc-400">Page 1 of 9</span>
                  <button onClick={pageToast} type="button" className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400">Next</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Slide-over Artifact Inspector Drawer */}
        {inspect.open && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-[#111317] border-l border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-lg">verified</span>
                    <h3 className="font-semibold text-zinc-100 text-base">Artifact Inspector</h3>
                  </div>
                  <button
                    onClick={closeInspect}
                    type="button"
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Target File</span>
                  <div className="font-mono text-sm font-semibold text-teal-400 truncate">{inspect.filename}</div>
                </div>

                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">SHA-256 Digest</span>
                  <div className="font-mono text-xs text-zinc-300 break-all select-all">{inspect.sha}</div>
                </div>

                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800 space-y-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Partition Breakdown</span>
                  <div className="font-mono text-xs text-teal-400">{inspect.split}</div>
                  <div className="w-full h-2 bg-zinc-800 rounded overflow-hidden flex">
                    <div className="bg-teal-500 h-full" style={{ width: "70%" }}></div>
                    <div className="bg-cyan-600 h-full" style={{ width: "15%" }}></div>
                    <div className="bg-amber-600 h-full" style={{ width: "15%" }}></div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0c0e11] border border-zinc-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>RFC Spec</span>
                    <span className="text-zinc-200">RFC 4301 / RFC 7296</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Dissection Level</span>
                    <span className="text-teal-400 font-medium">Layer 2 – Layer 7 Full</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Ingress Drops</span>
                    <span className="text-zinc-200">0 Packets (0.00%)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  onClick={exportArchive}
                  type="button"
                  className="flex-1 py-2 rounded bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-xs font-mono transition-colors text-center"
                >
                  Export Archive
                </button>
                <button
                  onClick={closeInspect}
                  type="button"
                  className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </div>
  );
}

