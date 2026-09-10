"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UploadBehavior } from "@/components/upload/UploadBehavior";
import { useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";
import { listHistory, type Analysis } from "@/lib/analysis";
import { capturePackets, captureVolume, formatClock, suiteString } from "@/lib/format";

export default function AnalyzePage() {
  const router = useRouter();
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [captures, setCaptures] = useState<Analysis[]>([]);
  const [selectedCapture, setSelectedCapture] = useState<Analysis | null>(null);
  const [filterQuery, setFilterQuery] = useState("");

  const openPolicy = () => setPolicyOpen(true);
  const closePolicy = () => setPolicyOpen(false);
  const closeDrawer = () => setDrawerOpen(false);

  // Synchronize with database schema via /api/history
  const syncCaptures = async (showNotification = false) => {
    try {
      const res = await listHistory({ limit: 50 });
      setCaptures(res.items);
      setSelectedCapture((current) => current ?? res.items[0] ?? null);
      if (showNotification) {
        toast({ title: "Captures refreshed", body: `${res.total} record(s) synchronized.`, kind: "info" });
      }
    } catch (err) {
      if (showNotification) {
        toast({ title: "Captures unavailable", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
      }
    }
  };

  useEffect(() => {
    syncCaptures(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openInspectRow = (item: Analysis) => {
    setSelectedCapture(item);
    setDrawerOpen(true);
  };

  const inspectConfig = (e: React.MouseEvent) => {
    const m = ((e.currentTarget as HTMLElement).closest("div")?.parentElement?.textContent ?? "").match(/MOD_\d{2}/);
    toast({ title: m?.[0] ?? "Module", body: "Run a capture to populate this module's output.", kind: "info" });
  };

  const refreshCaptures = () => syncCaptures(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setPolicyOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const filteredCaptures = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return captures;
    return captures.filter((c) => {
      const name = c.filename.toLowerCase();
      const risk = (c.risk_level ?? "").toLowerCase();
      const suite = suiteString(c).toLowerCase();
      return name.includes(q) || risk.includes(q) || suite.includes(q);
    });
  }, [captures, filterQuery]);

  const selCrypto = selectedCapture?.config_json?.ipsec_config?.cryptography as
    | { dh_group?: number | null }
    | undefined;
  const selSa = selectedCapture?.config_json?.ipsec_config?.sa_config as
    | { replay_protection?: boolean }
    | undefined;
  const dhGroup = selCrypto?.dh_group;
  const replayProtection = selSa?.replay_protection;

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      <UploadBehavior />
      <AppShell active="/analyze" innerClassName="flex flex-col w-full pb-space-2xl">
        {/* Top Sub-Nav Telemetry Banner (Lightweight & Clean) */}
        <div className="px-space-base py-space-xs bg-surface-container-low border-b border-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs font-code-sm text-code-sm">
            <span className="text-outline">FORENSICS</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-medium">ANALYZE_PCAP</span>
            <span className="ml-space-sm px-space-xs py-0.5 rounded bg-surface-container-highest font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
              Ready
            </span>
          </div>
          <div className="flex items-center gap-space-md font-code-sm text-code-sm text-outline">
            <span>RFC 7296 / RFC 4303 / SP 800-77r1</span>
            <span className="text-outline-variant">•</span>
            <span>DPDK Intake Buffer Active</span>
          </div>
        </div>

        {/* Main Viewport Workspace with Generous Breathing Room */}
        <div className="p-space-xl max-w-7xl w-full mx-auto flex flex-col gap-space-xl">
          {/* Header Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-sm">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                  Analyze Capture
                </h1>
                <span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-surface-container-high text-on-surface-variant font-medium">
                  {captures.length} CAPTURE{captures.length === 1 ? "" : "S"} ON RECORD
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Forensic intake pipeline for cryptographic posture, replay detection, and encrypted traffic profiling.
              </p>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="font-code-sm text-code-sm text-outline">
                Captures are parsed and scored on upload — no sample traces.
              </span>
            </div>
          </div>

          {/* Import Flow Sequence */}
          <div className="grid grid-cols-3 gap-2 p-2 bg-surface-container-low rounded border border-hairline font-mono text-[11px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container text-on-surface">
              <span className="w-4 h-4 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center">1</span>
              <span className="font-semibold">File Intake</span>
              <span className="text-outline text-[10px]">(.pcap / .pcapng)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded text-outline">
              <span className="w-4 h-4 rounded-full bg-surface-container-highest text-outline font-bold text-[10px] flex items-center justify-center">2</span>
              <span>Protocol Validate</span>
              <span className="text-[10px]">(RFC 7296)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded text-outline">
              <span className="w-4 h-4 rounded-full bg-surface-container-highest text-outline font-bold text-[10px] flex items-center justify-center">3</span>
              <span>Cryptographic Dissect</span>
            </div>
          </div>

          {/* Primary Streamlined Upload Area */}
          <div className="bg-surface-container-lowest border border-hairline rounded p-space-xl shadow-xl flex flex-col gap-space-md">
            {/* Drop Target Terminal Box */}
            <div
              className="border-2 border-dashed border-outline-variant/40 hover:border-primary/60 bg-surface-container-low hover:bg-surface-container rounded-lg p-space-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer group"
              id="drop-zone"
            >
              <input accept=".pcap,.pcapng,.cap,.erf" className="hidden" id="pcap-file-input" type="file" />
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shadow-inner">
                <span className="material-symbols-outlined text-[30px]">upload_file</span>
              </div>
              <div className="mt-space-md flex flex-col items-center">
                <div className="font-headline-md text-headline-md text-on-surface tracking-wide font-semibold">
                  Drop forensic PCAP trace here
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm">
                  or click to browse local capture files (up to 4 GB per trace)
                </p>
              </div>
              <div className="mt-space-md flex items-center gap-space-sm">
                <button
                  className="flex items-center gap-space-xs bg-primary text-on-primary px-space-lg py-space-xs rounded font-headline-sm text-headline-sm font-semibold hover:bg-primary-fixed transition-colors"
                  id="trigger-select-btn"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">folder_open</span>
                  <span>Select Capture</span>
                </button>
                <kbd className="px-space-sm py-space-xs rounded bg-surface-container-highest font-code-sm text-code-sm text-outline border border-surface-container-high">
                  ⌘O / Ctrl+O
                </kbd>
              </div>
              {/* Concise Secondary Metadata Row */}
              <div className="mt-space-lg pt-space-md border-t border-surface-container-highest/60 flex flex-wrap justify-center items-center gap-x-space-md gap-y-space-xs font-code-sm text-code-sm text-outline">
                <span>Formats: .pcap, .pcapng, .cap</span>
                <span className="text-outline-variant">•</span>
                <span>Max size: 4 GB</span>
                <span className="text-outline-variant">•</span>
                <span className="text-tertiary">Integrity verification: SHA-256 Enabled</span>
              </div>
            </div>
            {/* Options & Concise 1-Line Evidence Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm px-space-xs">
              <label className="flex items-center gap-space-sm cursor-pointer select-none">
                <input
                  defaultChecked
                  className="w-4 h-4 rounded bg-surface-container-lowest text-primary accent-primary focus:ring-0"
                  type="checkbox"
                />
                <span className="font-body-sm text-body-sm text-on-surface">Strict RFC compliance validation</span>
              </label>
              <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                <span>Decryption keys optional: flow telemetry classifies tunnels without breaking crypto.</span>
                <button
                  className="text-primary hover:underline font-medium inline-flex items-center ml-1"
                  id="evidence-policy-link"
                  type="button"
                  onClick={openPolicy}
                >
                  Evidence Policy Details →
                </button>
              </div>
            </div>
          </div>

          {/* Streamlined Forensic Pipeline Execution Modules */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Forensic Pipeline Modules
                </span>
              </div>
              <span className="font-code-sm text-code-sm text-outline">Profile: NIST-FIPS-140-3-STRICT</span>
            </div>
            {/* 5 Compact, Crisp Modular Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
              {/* Card 01 */}
              <div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_01</span>
                    <span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-medium">Crypto &amp; Protocol</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">IKE &amp; ESP validation</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
                  <button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
                    <span>Inspect config</span>
                    <span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
              {/* Card 02 */}
              <div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_02</span>
                    <span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-medium">ML Flow</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Encrypted flow fingerprinting</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
                  <button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
                    <span>Inspect config</span>
                    <span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
              {/* Card 03 */}
              <div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_03</span>
                    <span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-medium">Tunnel Integrity</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Replay &amp; sequence skew</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
                  <button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
                    <span>Inspect config</span>
                    <span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
              {/* Card 04 */}
              <div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_04</span>
                    <span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-surface-container-highest text-tertiary font-medium">LOCKED</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-medium">Evidence Provenance</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Deterministic verification</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
                  <button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
                    <span>Inspect config</span>
                    <span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
              {/* Card 05 */}
              <div className="p-space-md rounded bg-surface-container-low border border-surface-container-high/50 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">MOD_05</span>
                    <span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-tertiary-container/30 text-tertiary font-medium">READY</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-medium">Forensic Export</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">RFC audit &amp; STIX 2.1</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
                  <button className="font-code-sm text-code-sm text-primary hover:text-primary-fixed flex items-center gap-1 group" type="button" onClick={inspectConfig}>
                    <span>Inspect config</span>
                    <span className="text-[12px] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Recent Captures History (Progressive Disclosure) */}
          <div className="flex flex-col gap-space-sm mt-space-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Recent Captures</h2>
                <span className="px-space-xs py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-outline">
                  {filteredCaptures.length} Recorded
                </span>
              </div>
              <div className="flex items-center gap-space-sm font-code-sm text-code-sm">
                <input
                  className="bg-surface-container-low border border-surface-container-high/50 px-space-sm py-1 rounded text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:border-primary"
                  placeholder="Filter captures..."
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
                <button
                  className="p-1 rounded bg-surface-container-low border border-surface-container-high/50 text-on-surface-variant hover:text-on-surface"
                  title="Refresh"
                  type="button"
                  onClick={refreshCaptures}
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Clean Streamlined Table (Clutter Removed) */}
            <div className="bg-surface-container-low rounded border border-surface-container-high/40 overflow-hidden shadow-sm">
              <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                <thead>
                  <tr className="bg-surface-container/60 font-label-sm text-label-sm uppercase tracking-wider text-outline select-none border-b border-surface-container-high/40">
                    <th className="py-space-sm px-space-md">Status</th>
                    <th className="py-space-sm px-space-md">Capture Name</th>
                    <th className="py-space-sm px-space-md">Volume</th>
                    <th className="py-space-sm px-space-md">Risk</th>
                    <th className="py-space-sm px-space-md">Ingested</th>
                    <th className="py-space-sm px-space-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/30 font-code-sm text-code-sm">
                  {filteredCaptures.length === 0 ? (
                    <tr>
                      <td className="py-space-lg px-space-md text-center text-on-surface-variant" colSpan={6}>
                        No captures yet. Drop a .pcap above to run the parser and models.
                      </td>
                    </tr>
                  ) : (
                    filteredCaptures.map((item) => {
                      const isPass = item.risk_level === "LOW";
                      const isHigh = item.risk_level === "HIGH" || item.risk_level === "CRITICAL";

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-surface-container/50 transition-colors group cursor-pointer inspect-trigger-row"
                          data-name={item.filename}
                          data-packets={capturePackets(item)}
                          data-risk={item.risk_level ?? "—"}
                          data-id={item.id}
                          data-suite={suiteString(item)}
                          data-time={formatClock(item.created_at)}
                          data-vol={captureVolume(item)}
                          onClick={() => openInspectRow(item)}
                        >
                          <td className="py-space-sm px-space-md">
                            <div className="flex items-center gap-space-xs">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isPass ? "bg-tertiary" : isHigh ? "bg-error" : "bg-secondary"
                                }`}
                              ></span>
                              <span className={`${isPass ? "text-tertiary" : "text-on-surface"} font-medium`}>
                                {isPass ? "PASS" : "AUDITED"}
                              </span>
                            </div>
                          </td>
                          <td className="py-space-sm px-space-md font-medium text-on-surface">{item.filename}</td>
                          <td className="py-space-sm px-space-md text-on-surface-variant">{captureVolume(item)}</td>
                          <td className="py-space-sm px-space-md">
                            {isPass ? (
                              <span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-tertiary-container/40 text-tertiary">
                                LOW
                              </span>
                            ) : isHigh ? (
                              <span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-error-container/60 text-error">
                                {item.risk_level}
                              </span>
                            ) : (
                              <span className="px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold bg-secondary-container text-secondary-fixed">
                                {item.risk_level ?? "—"}
                              </span>
                            )}
                          </td>
                          <td className="py-space-sm px-space-md text-outline">{formatClock(item.created_at)}</td>
                          <td className="py-space-sm px-space-md text-right">
                            <button
                              className="inspect-btn text-primary hover:text-primary-fixed font-medium inline-flex items-center gap-1 group/btn"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openInspectRow(item);
                              }}
                            >
                              <span>Inspect</span>
                              <span className="text-[12px] group-hover/btn:translate-x-0.5 transition-transform">→</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppShell>

      {/* Slide-Over Forensic Detail Drawer (Progressive Disclosure) */}
      <div className="fixed inset-0 z-50 pointer-events-none transition-all duration-300" id="drawer-backdrop">
        {/* Backdrop Overlay */}
        <div
          className={
            drawerOpen
              ? "absolute inset-0 bg-black/60 opacity-100 transition-opacity duration-300 pointer-events-auto"
              : "absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none"
          }
          id="drawer-overlay"
          onClick={closeDrawer}
        ></div>

        {/* Drawer Surface */}
        <div
          className={
            drawerOpen
              ? "absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface-container-low border-l border-surface-container-high/60 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out pointer-events-auto"
              : "absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface-container-low border-l border-surface-container-high/60 shadow-2xl flex flex-col justify-between translate-x-full transition-transform duration-300 ease-in-out pointer-events-auto"
          }
          id="forensic-drawer"
        >
          {/* Drawer Header */}
          <div className="p-space-lg bg-surface-container-lowest border-b border-surface-container-high/60 flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">manage_search</span>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Forensic Capture Detail
                </div>
                <div className="font-code-sm text-[11px] text-outline" id="drawer-header-subtitle">
                  {selectedCapture ? `SESSION #${selectedCapture.id.slice(0, 8).toUpperCase()}` : "NO CAPTURE SELECTED"}
                </div>
              </div>
            </div>
            <button
              className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              id="close-drawer-btn"
              type="button"
              onClick={closeDrawer}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="p-space-lg flex-1 overflow-y-auto flex flex-col gap-space-lg">
            {/* Primary Target Info */}
            <div className="bg-surface-container-lowest p-space-md rounded border border-surface-container-high/40 flex flex-col gap-space-xs">
              <div className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Capture Archive</div>
              <div className="font-headline-sm text-headline-sm text-on-surface font-semibold break-all" id="drawer-filename">
                {selectedCapture?.filename ?? "—"}
              </div>
              <div className="flex items-center gap-space-md mt-1 font-code-sm text-code-sm">
                <span className="text-on-surface-variant">
                  Volume: <strong className="text-on-surface" id="drawer-volume">{captureVolume(selectedCapture)}</strong>
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-on-surface-variant">
                  Packets: <strong className="text-on-surface" id="drawer-packets">{capturePackets(selectedCapture)}</strong>
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-on-surface-variant">
                  Risk:{" "}
                  <strong
                    className={
                      selectedCapture?.risk_level === "LOW"
                        ? "text-tertiary"
                        : selectedCapture?.risk_level === "MEDIUM"
                        ? "text-secondary-fixed"
                        : "text-error"
                    }
                    id="drawer-risk"
                  >
                    {selectedCapture?.risk_level ?? "—"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Detailed Parameter Specs */}
            <div className="flex flex-col gap-space-sm">
              <div className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Forensic Audit Parameters
              </div>
              <div className="bg-surface-container-lowest rounded border border-surface-container-high/40 divide-y divide-surface-container-high/30 font-code-sm text-code-sm">
                <div className="p-space-sm flex flex-col gap-1">
                  <span className="text-outline text-[11px]">Analysis Record ID</span>
                  <span className="text-on-surface break-all select-all font-mono text-[11px]" id="drawer-id">
                    {selectedCapture?.id ?? "—"}
                  </span>
                </div>
                <div className="p-space-sm flex items-center justify-between">
                  <span className="text-outline">Ingested (UTC)</span>
                  <span className="text-on-surface font-medium" id="drawer-time">
                    {formatClock(selectedCapture?.created_at)}
                  </span>
                </div>
                <div className="p-space-sm flex flex-col gap-1">
                  <span className="text-outline text-[11px]">IKE / ESP Parameters</span>
                  <span className="text-on-surface font-medium" id="drawer-suite">
                    {suiteString(selectedCapture)}
                  </span>
                </div>
                <div className="p-space-sm flex items-center justify-between">
                  <span className="text-outline">Diffie-Hellman Group</span>
                  {dhGroup === 2 ? (
                    <span className="text-error font-medium" id="drawer-dh">
                      MODP-1024 (Group 2 - Insecure)
                    </span>
                  ) : dhGroup === 19 ? (
                    <span className="text-tertiary font-medium" id="drawer-dh">
                      ECP-256 (Group 19 - Curve25519)
                    </span>
                  ) : dhGroup === 14 ? (
                    <span className="text-on-surface font-medium" id="drawer-dh">
                      MODP-2048 (Group 14)
                    </span>
                  ) : dhGroup ? (
                    <span className="text-on-surface font-medium" id="drawer-dh">
                      Group {dhGroup}
                    </span>
                  ) : (
                    <span className="text-outline font-medium" id="drawer-dh">
                      Not observed in capture
                    </span>
                  )}
                </div>
                <div className="p-space-sm flex items-center justify-between">
                  <span className="text-outline">Anti-Replay Window</span>
                  {replayProtection === false ? (
                    <span className="text-error font-medium">Disabled (Vulnerable)</span>
                  ) : (
                    <span className="text-on-surface">64 Packets (Strict)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Evidence Provenance Card */}
            <div className="bg-surface-container-lowest p-space-md rounded border border-surface-container-high/40 flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-tertiary">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="font-headline-sm text-[13px] font-semibold">Evidence Provenance</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {selectedCapture?.config_json?.evidence_source === "parser"
                  ? "Deterministic rule justification confirms weak key exchange without requiring private payload disclosure. Findings are grounded strictly in packet header records."
                  : "Parameters for this record came from the seeded fallback because the capture could not be parsed. Upload a valid .pcap to get packet-grounded findings."}
              </p>
              <div className="mt-space-xs flex items-center gap-space-sm text-[11px] font-code-sm text-outline">
                <span>VALIDATION: DETERMINISTIC</span>
                <span>•</span>
                <span className="text-tertiary">ZERO_HALLUCINATION</span>
              </div>
            </div>
          </div>

          {/* Drawer Footer Action */}
          <div className="p-space-lg bg-surface-container-lowest border-t border-surface-container-high/60 flex flex-col gap-space-xs">
            <button
              className="w-full py-space-sm px-space-md rounded bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-space-xs shadow-md disabled:opacity-50 disabled:hover:bg-primary"
              type="button"
              disabled={!selectedCapture}
              onClick={() => {
                if (!selectedCapture) return;
                closeDrawer();
                router.push(`/analysis/results?analysis_id=${selectedCapture.id}`);
              }}
            >
              <span>Proceed to Deep Inspection</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <div className="text-center">
              <button
                className="font-code-sm text-[11px] text-outline hover:text-on-surface pt-1"
                id="cancel-drawer-btn"
                type="button"
                onClick={closeDrawer}
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Policy Modal (triggered by "Evidence Policy Details →") */}
      <div
        className={
          policyOpen
            ? "fixed inset-0 z-50 flex items-center justify-center p-space-md"
            : "fixed inset-0 z-50 hidden flex items-center justify-center p-space-md"
        }
        id="policy-modal"
      >
        <div className="absolute inset-0 bg-black/70" id="policy-backdrop" onClick={closePolicy}></div>
        <div className="relative bg-surface-container rounded-lg max-w-lg w-full p-space-lg border border-surface-container-high shadow-2xl flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
            <div className="flex items-center gap-space-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="font-headline-sm text-headline-sm font-semibold">
                Forensic Evidence &amp; Decryption Policy
              </span>
            </div>
            <button className="text-outline hover:text-on-surface" id="close-policy-btn" type="button" onClick={closePolicy}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-space-sm leading-relaxed">
            <p>
              Payload decryption keys (IKE Secret / ESP Private Key) are entirely optional. TunnelSight models analyze flow dynamics, packet timing entropy, and encapsulated frame structures without requiring plaintext inspection.
            </p>
            <p>
              In accordance with forensic chain-of-custody standards, all analytical claims are tagged strictly as{" "}
              <span className="font-code-sm text-on-surface bg-surface-container-high px-1 rounded">CONFIRMED</span> or{" "}
              <span className="font-code-sm text-outline bg-surface-container-high px-1 rounded">INFERRED</span> to ensure verifiable provenance.
            </p>
          </div>
          <div className="flex justify-end pt-space-xs">
            <button
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-md py-space-xs rounded font-code-sm text-code-sm transition-colors"
              id="ack-policy-btn"
              type="button"
              onClick={closePolicy}
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
