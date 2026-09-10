"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";
import { useResolvedAnalysis } from "@/components/analysis/useResolvedAnalysis";
import { downloadReportPdf, type PreviewPacket } from "@/lib/analysis";
import { capturePackets, formatBytes, formatCount, formatDuration, suiteString } from "@/lib/format";

function hexRows(hex: string, width = 16) {
  const bytes = hex.trim() ? hex.trim().split(/\s+/) : [];
  const rows: { offset: string; hex: string; ascii: string }[] = [];
  for (let i = 0; i < bytes.length; i += width) {
    const slice = bytes.slice(i, i + width);
    rows.push({
      offset: i.toString(16).padStart(4, "0"),
      hex: slice.join(" "),
      ascii: slice
        .map((b) => {
          const n = parseInt(b, 16);
          return n >= 32 && n < 127 ? String.fromCharCode(n) : ".";
        })
        .join(""),
    });
  }
  return rows;
}

export default function VpnConfigurationPage() {
  const toast = useToast();
  const params = useSearchParams();
  const { analysis, analysisId, loading, error, empty } = useResolvedAnalysis(params.get("analysis_id"));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterProto, setFilterProto] = useState<"all" | "ike" | "esp" | "other">("all");

  const ipsecConfig = analysis?.config_json?.ipsec_config;
  const crypto = (ipsecConfig?.cryptography ?? {}) as Record<string, unknown>;
  const saConfig = (ipsecConfig?.sa_config ?? {}) as Record<string, unknown>;
  const capture = analysis?.config_json?.capture;
  const findings = analysis?.findings_json ?? [];

  const packets: PreviewPacket[] = useMemo(() => capture?.packets_preview ?? [], [capture]);

  const visiblePackets = useMemo(
    () => (filterProto === "all" ? packets : packets.filter((p) => p.proto === filterProto)),
    [packets, filterProto]
  );

  // Clamp instead of resetting in an effect so changing the filter never strands the panel.
  const safeIndex = selectedIndex < visiblePackets.length ? selectedIndex : 0;
  const selected = visiblePackets[safeIndex] ?? null;
  const selectedRows = useMemo(() => (selected ? hexRows(selected.hex) : []), [selected]);

  const peers = useMemo(() => {
    const seen = new Set<string>();
    for (const p of packets) {
      if (p.src && p.dst) seen.add(`${p.src} → ${p.dst}`);
    }
    return [...seen];
  }, [packets]);

  const protoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of packets) counts[p.proto] = (counts[p.proto] ?? 0) + 1;
    return counts;
  }, [packets]);

  const exportProof = () => {
    downloadFile(
      `${analysis?.filename ?? "vpn"}-configuration-proof.json`,
      JSON.stringify(
        {
          capture: analysis?.filename,
          record: analysis?.id,
          evidence_source: analysis?.config_json?.evidence_source,
          ipsec_config: analysis?.config_json?.ipsec_config,
          capture_stats: analysis?.config_json?.capture,
          security_score: analysis?.security_score,
          risk_level: analysis?.risk_level,
          findings,
        },
        null,
        2
      )
    );
    toast({ title: "Proof exported", body: "configuration-proof.json downloaded.", kind: "ok" });
  };

  const exportPdf = async () => {
    if (!analysis) return;
    try {
      await downloadReportPdf(analysis.id, analysis.filename);
      toast({ title: "PDF report downloaded", body: `${analysis.filename} report saved.`, kind: "ok" });
    } catch (err) {
      toast({ title: "PDF export failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };

  const exportFrame = () => {
    if (!selected) return;
    downloadFile(
      `packet-${selected.index + 1}-dissection.json`,
      JSON.stringify(
        {
          capture: analysis?.filename,
          index: selected.index + 1,
          offset_seconds: selected.offset,
          length: selected.length,
          src: selected.src,
          dst: selected.dst,
          protocol: selected.proto,
          hex: selected.hex,
          hex_truncated: selected.hex_truncated,
        },
        null,
        2
      )
    );
    toast({ title: "Packet exported", body: `packet-${selected.index + 1}-dissection.json downloaded.`, kind: "ok" });
  };

  if (!analysisId && !loading && (empty || error)) {
    return (
      <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
        <AppShell active="/analysis/configuration">
          <div className="p-8 text-sm">
            {error ? `Configuration unavailable: ${error}` : "No captures yet."}{" "}
            <Link className="underline text-teal-400" href="/analyze">
              Upload a capture
            </Link>
            .
          </div>
        </AppShell>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
      <AppShell active="/analysis/configuration">
        {/* Header */}
        <div className="border-b border-zinc-800/80 bg-[#111317]/90 backdrop-blur px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <Link href="/history" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                Captures
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">{analysis?.filename ?? "loading…"}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">VPN Configuration &amp; Protocol Inspection</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                className="h-7 px-3 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800/80 rounded text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
                type="button"
                disabled={!analysis}
                onClick={exportProof}
              >
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                <span>Export Proof (.json)</span>
              </button>
              <button
                className="h-7 px-3 bg-teal-500 hover:bg-teal-400 text-zinc-950 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                type="button"
                disabled={!analysis}
                onClick={exportPdf}
              >
                <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display-serif text-2xl font-bold tracking-tight text-white">
                  VPN Configuration &amp; Protocol Inspection
                </h1>
                <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 font-mono text-[11px]">
                  RFC 7296 / RFC 4303
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Negotiated parameters and raw packet records extracted from the capture. Evidence source:{" "}
                <span className="text-zinc-300 font-mono">{analysis?.config_json?.evidence_source ?? "unknown"}</span>.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 flex items-center">
                {String(saConfig.ike_version ?? "UNKNOWN")}
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 flex items-center">
                {saConfig.mode ? `ESP ${String(saConfig.mode)} Mode` : "ESP Mode Unknown"}
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-teal-400">verified</span>
                {analysis?.config_json?.evidence_source === "parser" ? "Evidence Confirmed" : "Evidence Unconfirmed"}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80 items-start">
          {/* Left: negotiated configuration */}
          <div className="lg:col-span-7 xl:col-span-8 p-6 space-y-6">
            {/* Endpoints */}
            <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">hub</span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                    Tunnel Endpoints &amp; Peer Identity
                  </h2>
                </div>
                <span className="font-mono text-xs text-zinc-500">
                  Record <code className="text-zinc-300">{analysis?.id.slice(0, 16) ?? "—"}</code>
                </span>
              </div>

              {peers.length === 0 ? (
                <p className="font-mono text-xs text-zinc-500">
                  No packet-level endpoints available for this record.
                </p>
              ) : (
                <div className="flex flex-col gap-2 font-mono text-xs">
                  {peers.slice(0, 8).map((pair) => (
                    <div
                      key={pair}
                      className="bg-[#14171c] border border-zinc-800/60 px-4 py-3 rounded-lg flex items-center justify-between"
                    >
                      <span className="text-zinc-200">{pair}</span>
                      <span className="text-zinc-500">
                        {packets.filter((p) => `${p.src} → ${p.dst}` === pair).length} pkt(s)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Negotiated cryptography */}
            <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">lock</span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                    Negotiated Cryptography
                  </h2>
                </div>
                <span className="font-mono text-xs text-zinc-500">[RFC 7296 §3.3]</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">IKE Security Association</span>
                  <div className="flex justify-between"><span className="text-zinc-500">Version</span><span className="text-zinc-200">{String(saConfig.ike_version ?? "UNKNOWN")}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Mode</span><span className="text-zinc-200">{String(saConfig.mode ?? "UNKNOWN")}</span></div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Lifetime</span>
                    <span className="text-zinc-200">
                      {typeof saConfig.lifetime_seconds === "number" ? `${saConfig.lifetime_seconds.toLocaleString()}s` : "UNKNOWN"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Anti-replay</span>
                    <span className={saConfig.replay_protection === false ? "text-rose-400" : "text-teal-400"}>
                      {saConfig.replay_protection === false ? "DISABLED" : "ENABLED"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">ESP Transform</span>
                  <div className="flex justify-between"><span className="text-zinc-500">Encryption</span><span className="text-zinc-200">{String(crypto.encryption_algorithm ?? "UNKNOWN")}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Integrity</span><span className="text-zinc-200">{String(crypto.integrity_algorithm ?? "UNKNOWN")}</span></div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">DH group</span>
                    <span className={crypto.dh_group === 2 ? "text-rose-400 font-semibold" : "text-zinc-200"}>
                      {crypto.dh_group ? String(crypto.dh_group) : "NOT OBSERVED"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Forward secrecy</span>
                    <span className={crypto.pfs_enabled ? "text-teal-400" : "text-rose-400"}>
                      {crypto.pfs_enabled ? "ENABLED" : "DISABLED"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#0c0e11] border border-zinc-800/60 rounded-lg px-4 py-3 font-mono text-xs flex items-center justify-between gap-3">
                <span className="text-zinc-500">Suite</span>
                <span className="text-zinc-200 truncate">{suiteString(analysis)}</span>
              </div>
            </section>

            {/* Capture composition */}
            <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">dataset</span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                    Capture Composition
                  </h2>
                </div>
                <span className="font-mono text-xs text-zinc-500">
                  {formatDuration(capture?.flow_duration)} span
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                {[
                  { label: "Packets", value: capturePackets(analysis) },
                  { label: "File size", value: formatBytes(capture?.file_bytes) },
                  { label: "Captured bytes", value: formatBytes(capture?.total_bytes) },
                  { label: "ML windows", value: formatCount(analysis?.config_json?.windows_count ?? null) },
                ].map((cell) => (
                  <div key={cell.label} className="bg-[#14171c] border border-zinc-800/60 p-3 rounded-lg">
                    <div className="text-[10px] uppercase text-zinc-500">{cell.label}</div>
                    <div className="mt-1 text-zinc-100 font-semibold">{cell.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
                {Object.entries(protoCounts).map(([proto, count]) => (
                  <span key={proto} className="px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">
                    {proto.toUpperCase()} · {count}
                  </span>
                ))}
                {Object.keys(protoCounts).length === 0 ? (
                  <span className="text-zinc-500">No packet protocol breakdown available.</span>
                ) : null}
              </div>
            </section>

            {/* Findings */}
            <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">policy</span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                    Configuration Findings
                  </h2>
                </div>
                <Link href="/analysis/findings" className="font-mono text-xs text-teal-400 hover:text-teal-300">
                  Open findings →
                </Link>
              </div>

              {findings.length === 0 ? (
                <p className="font-mono text-xs text-zinc-500">
                  The rule engine raised no configuration findings for this capture.
                </p>
              ) : (
                <div className="flex flex-col gap-2 font-mono text-xs">
                  {findings.map((f, i) => (
                    <div key={`${f.category}-${i}`} className="bg-[#14171c] border border-zinc-800/60 p-3 rounded-lg flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] font-bold shrink-0">
                        {f.severity}
                      </span>
                      <div className="min-w-0">
                        <div className="text-zinc-100 font-semibold">{f.category}</div>
                        <p className="text-zinc-400 mt-1 leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right: packet inspector driven by real capture bytes */}
          <div className="lg:col-span-5 xl:col-span-4 p-6 space-y-4 lg:sticky lg:top-0">
            <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[18px]">troubleshoot</span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                    Packet Inspector
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">{visiblePackets.length} shown</span>
              </div>

              <div className="px-4 py-2 border-b border-zinc-800/60 flex items-center gap-1.5">
                {(["all", "ike", "esp", "other"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilterProto(key)}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                      filterProto === key ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-zinc-800/40">
                {visiblePackets.length === 0 ? (
                  <div className="px-4 py-6 text-center font-mono text-[11px] text-zinc-500">
                    {packets.length === 0 ? "No packet preview stored for this record." : "No packets match this filter."}
                  </div>
                ) : (
                  visiblePackets.map((p, i) => (
                    <button
                      key={p.index}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`w-full px-4 py-2 flex items-center justify-between gap-3 font-mono text-[11px] text-left transition-colors ${
                        safeIndex === i ? "bg-zinc-800/70 border-l-2 border-teal-400" : "hover:bg-zinc-800/30"
                      }`}
                    >
                      <span className="text-zinc-300">#{String(p.index + 1).padStart(3, "0")}</span>
                      <span className="text-zinc-500 truncate">{p.src} → {p.dst}</span>
                      <span className="text-teal-400 uppercase">{p.proto}</span>
                      <span className="text-zinc-400 tabular-nums">{p.length} B</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {selected ? (
              <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="font-mono text-xs font-semibold text-white">Packet #{selected.index + 1}</span>
                  <span className="font-mono text-[11px] text-zinc-500">offset {selected.offset.toFixed(6)}s</span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="flex flex-col"><span className="text-zinc-500">Source</span><span className="text-zinc-200">{selected.src ?? "—"}</span></div>
                  <div className="flex flex-col"><span className="text-zinc-500">Destination</span><span className="text-zinc-200">{selected.dst ?? "—"}</span></div>
                  <div className="flex flex-col"><span className="text-zinc-500">Protocol</span><span className="text-teal-400 uppercase">{selected.proto}</span></div>
                  <div className="flex flex-col"><span className="text-zinc-500">Frame length</span><span className="text-zinc-200">{selected.length} B</span></div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Raw bytes {selected.hex_truncated ? "(truncated preview)" : ""}
                  </span>
                  <div className="bg-[#0c0e11] border border-zinc-800/60 rounded p-3 overflow-x-auto">
                    {selectedRows.length === 0 ? (
                      <span className="font-mono text-[11px] text-zinc-500">No bytes captured.</span>
                    ) : (
                      selectedRows.map((row) => (
                        <div key={row.offset} className="font-mono text-[11px] whitespace-pre text-zinc-300 flex gap-3">
                          <span className="text-zinc-600">{row.offset}</span>
                          <span className="text-teal-300">{row.hex.padEnd(47, " ")}</span>
                          <span className="text-zinc-500">{row.ascii}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800/80 rounded text-xs font-mono transition-colors"
                  type="button"
                  onClick={exportFrame}
                >
                  Export packet dissection (.json)
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </AppShell>
    </div>
  );
}
