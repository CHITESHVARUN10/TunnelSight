"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Stat from "@/components/motion/Stat";
import { AppShell } from "@/components/layout/AppShell";

interface CaptureRow {
  id: string;
  name: string;
  scope: string;
  timestamp: string;
  status: "CRITICAL" | "HARDENED" | "SUB-OPTIMAL" | "MONITORING";
  proto: string;
  score: number;
  packets: string;
  spi: string;
  rekey: string;
  pfs: boolean;
}

const CAPTURES: CaptureRow[] = [
  {
    id: "cap-01",
    name: "core-dc-chicago-gw1.pcap",
    scope: "Core Transit · 10GbE",
    timestamp: "14:18:22 UTC",
    status: "CRITICAL",
    proto: "IKEv2 / ESP",
    score: 34,
    packets: "1.42M",
    spi: "0x7c1189ab",
    rekey: "Reused Secret",
    pfs: false,
  },
  {
    id: "cap-02",
    name: "branch-emea-gw04.pcap",
    scope: "Branch Edge · SFP+",
    timestamp: "14:02:19 UTC",
    status: "SUB-OPTIMAL",
    proto: "IKEv2 / ESP",
    score: 68,
    packets: "890K",
    spi: "0x9a021da3",
    rekey: "3600s interval",
    pfs: false,
  },
  {
    id: "cap-03",
    name: "prod-frankfurt-core.pcap",
    scope: "EU Core Backbone",
    timestamp: "13:45:00 UTC",
    status: "HARDENED",
    proto: "IKEv2 (RFC 7296)",
    score: 94,
    packets: "4.12M",
    spi: "0x4fbc0018",
    rekey: "MODP-2048 PFS",
    pfs: true,
  },
  {
    id: "cap-04",
    name: "aws-vpn-uswest2-gw.pcap",
    scope: "Cloud Interconnect",
    timestamp: "12:30:11 UTC",
    status: "HARDENED",
    proto: "IKEv2 / GCM-256",
    score: 96,
    packets: "2.80M",
    spi: "0x3e1109ff",
    rekey: "Curve25519 PFS",
    pfs: true,
  },
  {
    id: "cap-05",
    name: "azure-expressroute-ipsec.pcap",
    scope: "Hybrid Edge Mesh",
    timestamp: "11:15:44 UTC",
    status: "SUB-OPTIMAL",
    proto: "IKEv1 (Legacy)",
    score: 52,
    packets: "640K",
    spi: "0x12a9bc04",
    rekey: "Frequent Drift",
    pfs: false,
  },
];

export default function OverviewPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCapture, setSelectedCapture] = useState<CaptureRow>(CAPTURES[0]);
  const [filterQuery, setFilterQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  function openDrawer(cap: CaptureRow) {
    setSelectedCapture(cap);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  const filteredCaptures = CAPTURES.filter((cap) => {
    const matchesQuery =
      cap.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      cap.scope.toLowerCase().includes(filterQuery.toLowerCase()) ||
      cap.proto.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ? true : cap.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="bg-background font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <AppShell active="/overview" innerClassName="max-w-[1580px] mx-auto px-6 py-6 flex flex-col gap-6">

        {/* 1. VERDICT STRIP: FRAUNCES POSTURE SCORE + CONTEXT + ACTIONS */}
        <section className="bg-surface-container-low rounded p-5 border border-hairline flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            {/* Big Serif Posture Numeral */}
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] uppercase font-mono tracking-widest text-outline">
                Audit Posture Score
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display-serif text-4xl font-medium text-on-surface tracking-tight">
                  <Stat to={78} />
                </span>
                <span className="font-display-serif text-xl text-outline font-normal">/ 100</span>
                <span className="ml-2 font-mono text-[11px] font-semibold text-tertiary px-2 py-0.5 rounded bg-tertiary-container/20">
                  +3.4% vs last audit
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-hairline hidden sm:block" />

            {/* Verdict summary */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span className="font-headline-sm text-[14px] font-semibold text-on-surface">
                  Production Edge &amp; Core Hardened
                </span>
              </div>
              <p className="font-mono text-[12px] text-on-surface-variant mt-0.5">
                72 active tunnels monitored · 0.04% DPDK buffer drop rate · NIST SP 800-77r1 aligned
              </p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              className="h-8 px-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold rounded flex items-center gap-2 border border-hairline transition-colors"
              type="button"
              onClick={() => router.push("/analysis/live")}
            >
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span>Live Terminal</span>
            </button>
            <button
              className="h-8 px-4 bg-primary hover:bg-teal-bright text-on-primary text-[12px] font-semibold rounded flex items-center gap-2 transition-colors shadow-sm"
              id="btn-analyze-pcap"
              type="button"
              onClick={() => router.push("/analyze")}
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Analyze PCAP</span>
              <kbd className="bg-black/20 px-1.5 rounded font-mono text-[10px]">Alt+U</kbd>
            </button>
          </div>
        </section>

        {/* 2. POSTURE COMPOSITION RAIL */}
        <section className="bg-surface-container-low rounded p-5 border border-hairline flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">security</span>
              <span className="font-headline-sm text-[13px] font-semibold text-on-surface">
                Fleet Security Distribution
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="text-on-surface font-semibold">41 Hardened</span>
                <span className="text-outline">(56.9%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-on-surface font-semibold">23 Sub-optimal</span>
                <span className="text-outline">(31.9%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="text-on-surface font-semibold text-error">8 Critical</span>
                <span className="text-outline">(11.2%)</span>
              </div>
            </div>
          </div>

          {/* Segmented Bar */}
          <div className="h-2 w-full rounded bg-surface-container-highest flex overflow-hidden">
            <div className="bg-tertiary transition-all" style={{ width: "56.9%" }} title="41 Hardened (56.9%)" />
            <div className="bg-amber-400 transition-all" style={{ width: "31.9%" }} title="23 Sub-optimal (31.9%)" />
            <div className="bg-error transition-all" style={{ width: "11.2%" }} title="8 Critical (11.2%)" />
          </div>

          {/* 4 Contextual Metric Cards with Trend / Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-hairline">
            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">IKEv2 Adoption</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-display-serif text-2xl font-semibold text-on-surface">86%</span>
                <span className="text-[11px] font-mono text-primary font-medium">62 / 72</span>
              </div>
              <span className="text-[11px] text-tertiary font-mono mt-1">+4 tunnels vs baseline</span>
            </div>

            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">PFS Enforcement</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-display-serif text-2xl font-semibold text-on-surface">94.2%</span>
                <span className="text-[11px] font-mono text-amber-300 font-medium">4 Missing</span>
              </div>
              <span className="text-[11px] text-outline font-mono mt-1">Target: 100% ephemeral DH</span>
            </div>

            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">ESP Integrity</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-display-serif text-2xl font-semibold text-on-surface">99.8%</span>
                <span className="text-[11px] font-mono text-tertiary font-medium">In-Order</span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-mono mt-1">Zero replay sequence drops</span>
            </div>

            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-outline">Provenance</span>
                <span className="text-[10px] font-mono text-outline">NIST SP 800</span>
              </div>
              <div className="flex items-center gap-2 my-1.5 font-mono">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-medium">58 Conf</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">11 Inf</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-medium">3 Unk</span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-mono">92% cryptographically verified</span>
            </div>
          </div>
        </section>

        {/* 3. RECENT CAPTURES TABLE WITH FROZEN COLUMN & STICKY HEADER */}
        <section className="bg-surface-container-low rounded border border-hairline overflow-hidden">
          <div className="px-5 py-3.5 bg-surface-container flex flex-wrap items-center justify-between gap-3 border-b border-hairline">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px]">table_rows</span>
              <h2 className="text-[14px] font-semibold text-on-surface">Recent Forensic Captures</h2>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2.5">
              {/* Filter chips */}
              <div className="hidden sm:flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded font-mono text-[11px]">
                {["ALL", "CRITICAL", "SUB-OPTIMAL", "HARDENED"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`px-2.5 py-1 rounded transition-colors ${
                      statusFilter === s
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <input
                className="h-7 w-48 sm:w-56 bg-surface-container-lowest text-on-surface placeholder:text-outline font-mono text-[11px] px-2.5 rounded border border-hairline outline-none focus:border-primary"
                placeholder="Filter trace or scope..."
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
              <span className="font-mono text-[11px] text-outline">
                {filteredCaptures.length} of {CAPTURES.length}
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto max-h-[420px] relative">
            <table className="w-full text-left font-sans text-[12px] whitespace-nowrap">
              <thead className="sticky top-0 bg-surface-container-lowest text-outline font-mono text-[11px] uppercase tracking-wider select-none border-b border-hairline z-20">
                <tr>
                  <th className="py-2.5 px-5">Status</th>
                  <th className="py-2.5 px-5 sticky left-0 bg-surface-container-lowest z-30">Capture File</th>
                  <th className="py-2.5 px-5">Scope</th>
                  <th className="py-2.5 px-5">Protocol</th>
                  <th className="py-2.5 px-5">Posture Score</th>
                  <th className="py-2.5 px-5">Timestamp</th>
                  <th className="py-2.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono text-[12px]">
                {filteredCaptures.map((cap) => (
                  <tr
                    key={cap.id}
                    className="hover:bg-surface-container/60 transition-colors cursor-pointer group"
                    onClick={() => openDrawer(cap)}
                  >
                    <td className="py-3 px-5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          cap.status === "CRITICAL"
                            ? "bg-error/15 text-error"
                            : cap.status === "SUB-OPTIMAL"
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-tertiary-container/20 text-tertiary"
                        }`}
                      >
                        {cap.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-semibold text-on-surface sticky left-0 bg-surface-container-low group-hover:bg-surface-container transition-colors z-10">
                      {cap.name}
                    </td>
                    <td className="py-3 px-5 text-on-surface-variant">{cap.scope}</td>
                    <td className="py-3 px-5 text-outline">{cap.proto}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-on-surface tabular-nums">{cap.score}/100</span>
                        <div className="w-16 h-1 rounded bg-surface-container-highest overflow-hidden">
                          <div
                            className={`h-full ${
                              cap.score < 50 ? "bg-error" : cap.score < 80 ? "bg-amber-400" : "bg-tertiary"
                            }`}
                            style={{ width: `${cap.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-outline">{cap.timestamp}</td>
                    <td className="py-3 px-5 text-right">
                      <button
                        className="text-primary hover:text-teal-bright font-semibold inline-flex items-center gap-1 group-hover:underline"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDrawer(cap);
                        }}
                      >
                        Inspect <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. DUAL WORKBENCH CARDS: FINDINGS QUEUE + TRAFFIC MIX */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Priority Findings Queue */}
          <div className="lg:col-span-7 bg-surface-container-low rounded p-5 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">warning</span>
                  <h2 className="text-[14px] font-semibold text-on-surface">Immediate Threat Findings</h2>
                </div>
                <span className="text-[11px] font-mono text-outline">3 Flagged in Trace</span>
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="bg-surface-container p-3 rounded border border-hairline flex items-center justify-between gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => router.push("/analysis/findings")}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded bg-error/15 text-error font-mono text-[9px] font-bold">
                      CRITICAL
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-on-surface truncate">
                        Weak Diffie-Hellman Group 2 (1024-bit MODP)
                      </p>
                      <p className="text-[10px] font-mono text-outline">core-dc-chicago-gw1 · CVE-2015-4000 (Logjam)</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-outline shrink-0">14:18 UTC</span>
                </div>

                <div
                  className="bg-surface-container p-3 rounded border border-hairline flex items-center justify-between gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => router.push("/analysis/findings")}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono text-[9px] font-bold">
                      MEDIUM
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-on-surface truncate">
                        PFS Disabled on Child SA Rekey
                      </p>
                      <p className="text-[10px] font-mono text-outline">branch-emea-gw04 · Ephemeral Secret Omitted</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-outline shrink-0">14:02 UTC</span>
                </div>

                <div
                  className="bg-surface-container p-3 rounded border border-hairline flex items-center justify-between gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => router.push("/analysis/findings")}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-mono text-[9px] font-bold">
                      LOW
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-on-surface truncate">
                        Unusual Rekey Cadence Drift (+18%)
                      </p>
                      <p className="text-[10px] font-mono text-outline">azure-expressroute-ipsec · Stochastic Jitter</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-outline shrink-0">13:12 UTC</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-hairline flex justify-between items-center text-[11px] font-mono">
              <span className="text-outline">14 total audit findings indexed</span>
              <button
                type="button"
                className="text-primary hover:underline font-semibold"
                onClick={() => router.push("/analysis/findings")}
              >
                View all findings →
              </button>
            </div>
          </div>

          {/* Traffic Intelligence Snapshot */}
          <div className="lg:col-span-5 bg-surface-container-low rounded p-5 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">insights</span>
                  <h2 className="text-[14px] font-semibold text-on-surface">Traffic Mix Overview</h2>
                </div>
                <span className="text-[10px] font-mono text-tertiary px-1.5 py-0.5 rounded bg-tertiary-container/20">
                  ML ENTROPY ONLINE
                </span>
              </div>

              <div className="flex flex-col gap-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-on-surface">Video Streaming (ABR H.264)</span>
                  </div>
                  <span className="font-semibold text-on-surface">81%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    <span className="text-on-surface">Encrypted Web (HTTPS/TLS)</span>
                  </div>
                  <span className="font-semibold text-on-surface">12%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-on-surface">VoIP / Real-time Media</span>
                  </div>
                  <span className="font-semibold text-on-surface">4%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-outline" />
                    <span className="text-on-surface">Other Tunnel Transit</span>
                  </div>
                  <span className="font-semibold text-outline">3%</span>
                </div>

                {/* Bar */}
                <div className="h-1.5 w-full rounded bg-surface-container-highest flex overflow-hidden my-1">
                  <div className="bg-primary h-full" style={{ width: "81%" }} />
                  <div className="bg-tertiary h-full" style={{ width: "12%" }} />
                  <div className="bg-amber-400 h-full" style={{ width: "4%" }} />
                  <div className="bg-outline h-full" style={{ width: "3%" }} />
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-hairline flex justify-between items-center text-[11px] font-mono">
              <span className="text-outline">DPDK Zero-Copy DPI</span>
              <button
                type="button"
                className="text-primary hover:underline font-semibold"
                onClick={() => router.push("/analysis/traffic")}
              >
                View traffic telemetry →
              </button>
            </div>
          </div>
        </section>

        {/* 5. SLIDE-OVER FORENSIC INSPECTION DRAWER */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 transition-opacity"
            id="drawer-backdrop"
            onClick={closeDrawer}
          />
        )}

        <aside
          className={`fixed top-0 right-0 h-full w-[460px] max-w-full bg-surface-container-low border-l border-hairline z-50 flex flex-col shadow-2xl transition-transform duration-200 ${
            drawerOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
          id="detail-drawer"
        >
          {/* Drawer Header */}
          <div className="p-4 bg-surface-container border-b border-hairline flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-outline uppercase tracking-wider">Forensic Trace Inspector</span>
              <h2 className="font-mono text-[14px] font-semibold text-on-surface break-all">{selectedCapture.name}</h2>
              <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    selectedCapture.status === "CRITICAL"
                      ? "bg-error/20 text-error"
                      : selectedCapture.status === "SUB-OPTIMAL"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-tertiary-container/20 text-tertiary"
                  }`}
                >
                  {selectedCapture.status}
                </span>
                <span className="text-outline">{selectedCapture.scope}</span>
              </div>
            </div>
            <button
              className="p-1 rounded hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors"
              title="Close Drawer"
              type="button"
              onClick={closeDrawer}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-[12px] font-mono text-on-surface-variant">
            <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col gap-2">
              <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">SA Cryptographic Negotiation</span>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">Inbound SPI:</span>
                <span className="text-primary font-semibold">{selectedCapture.spi}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">Protocol:</span>
                <span className="text-on-surface">{selectedCapture.proto}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">PFS Status:</span>
                <span className={selectedCapture.pfs ? "text-tertiary font-semibold" : "text-error font-semibold"}>
                  {selectedCapture.pfs ? "ENABLED (MODP-2048)" : "DISABLED (NO KEi PAYLOAD)"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">Total Packet Volume:</span>
                <span className="text-on-surface">{selectedCapture.packets}</span>
              </div>
            </div>

            {/* Hex Dump Snippet */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase text-outline tracking-wider">Raw Dissection Sample (ESP Header)</span>
              <div className="bg-surface-container-lowest p-3 rounded border border-hairline font-mono text-[11px] leading-relaxed text-on-surface select-all">
                <span className="text-outline">0000: </span>00 00 11 94 {selectedCapture.spi.slice(2, 4)} {selectedCapture.spi.slice(4, 6)} {selectedCapture.spi.slice(6, 8)} {selectedCapture.spi.slice(8, 10)} 00 d8 ce a2<br />
                <span className="text-outline">0010: </span>14 02 19 41 20 00 00 24 02 00 00 00 00 04 00 02<br />
                <span className="text-outline">0020: </span>00 00 00 08 03 00 00 02 00 00 00 08 04 00 00 05
              </div>
            </div>

            {/* Conformance Check */}
            <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col gap-1.5">
              <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">Standard Compliance Assessment</span>
              <p className="text-[11px] leading-relaxed">
                {selectedCapture.pfs
                  ? "Meets NIST SP 800-77r1 criteria with ephemeral Diffie-Hellman exchange and modern AES cipher suite."
                  : "Violates NIST SP 800-77r1 §4.1: Diffie-Hellman secret key is reused across child SA renegotiations."}
              </p>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-3.5 bg-surface-container border-t border-hairline flex items-center justify-between gap-2.5">
            <button
              className="h-8 px-3 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-semibold transition-colors"
              type="button"
              onClick={closeDrawer}
            >
              Close
            </button>
            <button
              className="h-8 px-3.5 rounded bg-primary hover:bg-teal-bright text-on-primary text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors"
              type="button"
              onClick={() => router.push("/analysis/results")}
            >
              <span>Full Analysis Results</span>
              <span>→</span>
            </button>
          </div>
        </aside>

      </AppShell>
    </div>
  );
}
