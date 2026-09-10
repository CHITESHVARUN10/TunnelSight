"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Stat from "@/components/motion/Stat";
import { AppShell } from "@/components/layout/AppShell";
import { listHistory } from "@/lib/analysis";

/* ============================================================================
   TunnelSight Overview — schema-aligned
   Mirrors backend source of truth:
     backend/schema.sql            -> analyses (id, user_id, filename, status,
                                      config_json, anomaly_score, traffic_label,
                                      traffic_confidence, security_score,
                                      risk_level, findings_json, created_at)
     backend/app/schemas/analysis.py -> AnalysisOut (same fields, minus user_id)
     backend/security_engine/schema.py -> IPsecConfig / SecurityFinding /
                                          SecurityAssessmentResult
     backend/app/services/analyzer.py  -> config_json bundle shape:
                                          { ipsec_config, security_score,
                                            risk_level, security_findings,
                                            traffic_prediction, anomaly_score }
   No other file is touched. All extra CSS lives in the <style> block at the
   bottom of this file (ov-* classes). Theme tokens unchanged.
   ========================================================================== */

/* ---- Backend schema mirrors ---- */
type AnalysisStatus = "pending" | "completed" | "failed" | string;

interface IPsecCryptography {
  encryption_algorithm?: string | null;
  integrity_algorithm?: string | null;
  dh_group?: number | null;
  pfs_enabled?: boolean | null;
}

interface IPsecSAConfig {
  ike_version?: string | null;
  mode?: string | null;
  replay_protection?: boolean | null;
  lifetime_seconds?: number | null;
}

interface IPsecConfig {
  capture_name: string;
  cryptography: IPsecCryptography;
  sa_config: IPsecSAConfig;
}

interface SecurityFinding {
  severity: string; // CRITICAL | HIGH | MEDIUM | LOW | INFO
  category: string; // Cryptography | Key Exchange | Configuration ...
  description: string;
}

interface AnalyzerBundle {
  ipsec_config?: IPsecConfig;
  security_score?: number | null;
  risk_level?: string | null;
  security_findings?: SecurityFinding[] | null;
  traffic_prediction?: string | null;
  traffic_confidence?: number | null;
  anomaly_score?: number | null;
}

interface AnalysisOut {
  id: string;
  filename: string;
  status: AnalysisStatus;
  config_json: (AnalyzerBundle & Partial<IPsecConfig>) | null;
  anomaly_score: number | null;
  traffic_label: string | null;
  traffic_confidence: number | null;
  security_score: number | null;
  risk_level: string | null;
  findings_json: SecurityFinding[] | null;
  created_at: string;
}

/* ---- Normalizers: prefer top-level columns, fall back to config_json bundle ---- */
function getBundle(a: AnalysisOut): AnalyzerBundle {
  return (a.config_json ?? {}) as AnalyzerBundle;
}

function getIpsecConfig(a: AnalysisOut): IPsecConfig | null {
  const b = getBundle(a);
  if (b.ipsec_config) return b.ipsec_config;
  // Tolerate parsers that stored IPsecConfig directly in config_json
  const raw = a.config_json as unknown as Partial<IPsecConfig> | null;
  if (raw && (raw.cryptography || raw.sa_config)) {
    return {
      capture_name: raw.capture_name ?? a.filename,
      cryptography: raw.cryptography ?? {},
      sa_config: raw.sa_config ?? {},
    };
  }
  return null;
}

function getScore(a: AnalysisOut): number | null {
  if (typeof a.security_score === "number") return a.security_score;
  const b = getBundle(a);
  return typeof b.security_score === "number" ? b.security_score : null;
}

function getRisk(a: AnalysisOut): string | null {
  if (a.risk_level) return a.risk_level.toUpperCase();
  const b = getBundle(a);
  return b.risk_level ? String(b.risk_level).toUpperCase() : null;
}

function getFindings(a: AnalysisOut): SecurityFinding[] {
  if (Array.isArray(a.findings_json)) return a.findings_json;
  const b = getBundle(a);
  if (Array.isArray(b.security_findings)) return b.security_findings;
  return [];
}

function getTrafficLabel(a: AnalysisOut): string | null {
  if (a.traffic_label) return a.traffic_label;
  const b = getBundle(a);
  return b.traffic_prediction ? String(b.traffic_prediction) : null;
}

function getTrafficConfidence(a: AnalysisOut): number | null {
  if (typeof a.traffic_confidence === "number") return a.traffic_confidence;
  const b = getBundle(a);
  return typeof b.traffic_confidence === "number" ? b.traffic_confidence : null;
}

function getAnomaly(a: AnalysisOut): number | null {
  if (typeof a.anomaly_score === "number") return a.anomaly_score;
  const b = getBundle(a);
  return typeof b.anomaly_score === "number" ? b.anomaly_score : null;
}

function riskTone(risk: string | null): "critical" | "high" | "medium" | "low" | "pending" {
  switch (risk) {
    case "CRITICAL":
      return "critical";
    case "HIGH":
      return "high";
    case "MEDIUM":
      return "medium";
    case "LOW":
      return "low";
    default:
      return "pending";
  }
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

function formatPct01(v: number | null): string {
  if (v === null || Number.isNaN(v)) return "—";
  const pct = v <= 1 && v >= 0 ? v * 100 : v;
  return `${pct.toFixed(0)}%`;
}

const RISK_FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "PENDING"] as const;

export default function OverviewPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<AnalysisOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");

  /* Live data: GET /api/history */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listHistory({ limit: 50 });
        if (!cancelled) {
          setAnalyses(res.items as unknown as AnalysisOut[]);
          setSelectedId((prev) => (res.items.some((r) => r.id === prev) ? prev : res.items[0]?.id ?? ""));
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "history unavailable");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected: AnalysisOut | null =
    analyses.find((a) => a.id === selectedId) ?? analyses[0] ?? null;

  function openDrawer(a: AnalysisOut) {
    setSelectedId(a.id);
    setDrawerOpen(true);
  }

  /* ---- Derived posture (all from schema columns) ---- */
  const stats = useMemo(() => {
    const scored = analyses.map(getScore).filter((s): s is number => typeof s === "number");
    const avg = scored.length
      ? Math.round(scored.reduce((x, y) => x + y, 0) / scored.length)
      : null;
    const counts: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      PENDING: 0,
    };
    let ikev2 = 0;
    let ikeKnown = 0;
    let pfsOn = 0;
    let pfsKnown = 0;
    let replayOn = 0;
    let replayKnown = 0;
    const traffic: Record<string, number> = {};
    let findingsTotal = 0;

    for (const a of analyses) {
      const risk = getRisk(a);
      if (risk && counts[risk] !== undefined) counts[risk] += 1;
      else counts.PENDING += 1;

      const cfg = getIpsecConfig(a);
      const ike = cfg?.sa_config?.ike_version?.toUpperCase() ?? null;
      if (ike) {
        ikeKnown += 1;
        if (ike.includes("IKEV2")) ikev2 += 1;
      }
      const pfs = cfg?.cryptography?.pfs_enabled;
      if (typeof pfs === "boolean") {
        pfsKnown += 1;
        if (pfs) pfsOn += 1;
      }
      const replay = cfg?.sa_config?.replay_protection;
      if (typeof replay === "boolean") {
        replayKnown += 1;
        if (replay) replayOn += 1;
      }
      const t = getTrafficLabel(a)?.toLowerCase();
      if (t) traffic[t] = (traffic[t] ?? 0) + 1;
      findingsTotal += getFindings(a).length;
    }

    const total = analyses.length || 1;
    return {
      avg,
      counts,
      total: analyses.length,
      pending: analyses.filter((a) => a.status === "pending").length,
      ikev2Pct: ikeKnown ? Math.round((ikev2 / ikeKnown) * 100) : null,
      ikev2Frac: ikeKnown ? `${ikev2} / ${ikeKnown}` : "—",
      pfsPct: pfsKnown ? (pfsOn / pfsKnown) * 100 : null,
      pfsMissing: pfsKnown ? pfsKnown - pfsOn : 0,
      replayPct: replayKnown ? (replayOn / replayKnown) * 100 : null,
      traffic,
      findingsTotal,
      hardened: counts.LOW,
      subOptimal: counts.MEDIUM + counts.HIGH,
      critical: counts.CRITICAL,
      hardenedPct: (counts.LOW / total) * 100,
      subOptimalPct: ((counts.MEDIUM + counts.HIGH) / total) * 100,
      criticalPct: (counts.CRITICAL / total) * 100,
    };
  }, [analyses]);

  const findingsQueue = useMemo(() => {
    const sevRank: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
      INFO: 4,
    };
    return analyses
      .flatMap((a) =>
        getFindings(a).map((f) => ({
          analysisId: a.id,
          filename: a.filename,
          created_at: a.created_at,
          ...f,
          severity: String(f.severity ?? "INFO").toUpperCase(),
        }))
      )
      .sort(
        (x, y) =>
          (sevRank[x.severity] ?? 9) - (sevRank[y.severity] ?? 9)
      )
      .slice(0, 3);
  }, [analyses]);

  const trafficRows = useMemo(() => {
    const entries = Object.entries(stats.traffic);
    const total = entries.reduce((n, [, c]) => n + c, 0) || 1;
    const palette: Record<string, string> = {
      video: "ov-dot-video",
      web: "ov-dot-web",
      voip: "ov-dot-voip",
      icmp: "ov-dot-icmp",
      email: "ov-dot-email",
    };
    return entries
      .map(([label, count]) => ({
        label,
        count,
        pct: Math.round((count / total) * 100),
        dot: palette[label] ?? "ov-dot-other",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [stats.traffic]);

  const filtered = analyses
    .filter((a) => {
      const q = filterQuery.trim().toLowerCase();
      const risk = getRisk(a) ?? (a.status === "pending" ? "PENDING" : null);
      if (riskFilter !== "ALL") {
        const want = riskFilter.toUpperCase();
        if ((risk ?? "PENDING") !== want) return false;
      }
      if (!q) return true;
      const cfg = getIpsecConfig(a);
      const hay = [
        a.filename,
        a.status,
        a.id,
        risk ?? "",
        getTrafficLabel(a) ?? "",
        cfg?.cryptography?.encryption_algorithm ?? "",
        cfg?.cryptography?.integrity_algorithm ?? "",
        cfg?.sa_config?.ike_version ?? "",
        cfg?.sa_config?.mode ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const selCfg = getIpsecConfig(selected);
  const selScore = getScore(selected);
  const selRisk = getRisk(selected);
  const selFindings = selected ? getFindings(selected) : [];
  const selTraffic = selected ? getTrafficLabel(selected) : null;
  const selTrafficConf = selected ? getTrafficConfidence(selected) : null;
  const selAnomaly = selected ? getAnomaly(selected) : null;

  return (
    <div className="ov-scope bg-background font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <AppShell active="/overview" innerClassName="max-w-[1580px] mx-auto px-6 py-6 flex flex-col gap-6">

        {/* 1. VERDICT STRIP — posture derived from analyses.security_score */}
        <section className="bg-surface-container-low rounded p-5 border border-hairline flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] uppercase font-mono tracking-widest text-outline">
                Audit Posture Score · mean(security_score)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display-serif text-4xl font-medium text-on-surface tracking-tight">
                  {stats.avg === null ? (
                    <span className="text-outline text-2xl font-mono">no scores yet</span>
                  ) : (
                    <Stat to={stats.avg} />
                  )}
                </span>
                {stats.avg !== null && (
                  <span className="font-display-serif text-xl text-outline font-normal">/ 100</span>
                )}
                <span className="ml-2 font-mono text-[11px] font-semibold text-tertiary px-2 py-0.5 rounded bg-tertiary-container/20">
                  {stats.total} {stats.total === 1 ? "analysis" : "analyses"}
                  {stats.pending > 0 ? ` · ${stats.pending} pending` : ""}
                </span>
              </div>
              {loadError && (
                <span className="font-mono text-[11px] text-amber-300 mt-1">
                  live history unreachable — snapshot shown
                </span>
              )}
              {loading && (
                <span className="font-mono text-[11px] text-outline mt-1">syncing /api/history…</span>
              )}
            </div>

            <div className="h-10 w-px bg-hairline hidden sm:block" />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="ov-pulse w-2 h-2 rounded-full bg-tertiary" />
                <span className="font-headline-sm text-[14px] font-semibold text-on-surface">
                  {stats.critical > 0
                    ? `${stats.critical} critical tunnel${stats.critical === 1 ? "" : "s"} need review`
                    : "Fleet posture nominal"}
                </span>
              </div>
              <p className="font-mono text-[12px] text-on-surface-variant mt-0.5">
                {stats.hardened} LOW · {stats.subOptimal} MED/HIGH · {stats.critical} CRITICAL · NIST SP 800-77r1 aligned
              </p>
            </div>
          </div>

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
              <kbd className="ov-kbd bg-black/20 px-1.5 rounded font-mono text-[10px]">Alt+U</kbd>
            </button>
          </div>
        </section>

        {/* 2. POSTURE COMPOSITION — counts grouped by analyses.risk_level */}
        <section className="bg-surface-container-low rounded p-5 border border-hairline flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">security</span>
              <span className="font-headline-sm text-[13px] font-semibold text-on-surface">
                Fleet Security Distribution · by risk_level
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="text-on-surface font-semibold">{stats.hardened} LOW</span>
                <span className="text-outline">({stats.hardenedPct.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-on-surface font-semibold">{stats.subOptimal} MED/HIGH</span>
                <span className="text-outline">({stats.subOptimalPct.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="text-on-surface font-semibold text-error">{stats.critical} Critical</span>
                <span className="text-outline">({stats.criticalPct.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          <div className="ov-bar h-2 w-full rounded bg-surface-container-highest flex overflow-hidden" aria-hidden>
            <div className="ov-bar-fill bg-tertiary" style={{ width: `${stats.hardenedPct}%` }} title={`${stats.hardened} LOW`} />
            <div className="ov-bar-fill bg-amber-400" style={{ width: `${stats.subOptimalPct}%` }} title={`${stats.subOptimal} MED/HIGH`} />
            <div className="ov-bar-fill bg-error" style={{ width: `${stats.criticalPct}%` }} title={`${stats.critical} Critical`} />
          </div>

          {/* config_json-derived indicators: ike_version / pfs_enabled / replay_protection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-hairline">
            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">IKEv2 Adoption · sa_config</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-display-serif text-2xl font-semibold text-on-surface">
                  {stats.ikev2Pct === null ? "—" : `${stats.ikev2Pct}%`}
                </span>
                <span className="text-[11px] font-mono text-primary font-medium">{stats.ikev2Frac}</span>
              </div>
              <span className="text-[11px] text-tertiary font-mono mt-1">from config_json.sa_config.ike_version</span>
            </div>

            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">PFS Enforcement · cryptography</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-display-serif text-2xl font-semibold text-on-surface">
                  {stats.pfsPct === null ? "—" : `${stats.pfsPct.toFixed(1)}%`}
                </span>
                <span className="text-[11px] font-mono text-amber-300 font-medium">
                  {stats.pfsMissing} missing
                </span>
              </div>
              <span className="text-[11px] text-outline font-mono mt-1">Target: 100% ephemeral DH</span>
            </div>

            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">Replay Protection · sa_config</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-display-serif text-2xl font-semibold text-on-surface">
                  {stats.replayPct === null ? "—" : `${stats.replayPct.toFixed(1)}%`}
                </span>
                <span className="text-[11px] font-mono text-tertiary font-medium">In-Order</span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-mono mt-1">replay_protection = true share</span>
            </div>

            <div className="bg-surface-container p-3.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-outline">Pipeline Status</span>
                <span className="text-[10px] font-mono text-outline">status column</span>
              </div>
              <div className="flex items-center gap-2 my-1.5 font-mono">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-medium">
                  {analyses.filter((a) => a.status === "completed").length} done
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                  {stats.pending} pending
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-medium">
                  {stats.findingsTotal} findings
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-mono">findings_json aggregate</span>
            </div>
          </div>
        </section>

        {/* 3. ANALYSES TABLE — one row per analyses row */}
        <section className="bg-surface-container-low rounded border border-hairline overflow-hidden">
          <div className="px-5 py-3.5 bg-surface-container flex flex-wrap items-center justify-between gap-3 border-b border-hairline">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px]">table_rows</span>
              <h2 className="text-[14px] font-semibold text-on-surface">Analyses · filename / risk_level / security_score</h2>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded font-mono text-[11px]">
                {RISK_FILTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`px-2.5 py-1 rounded transition-colors ${
                      riskFilter === s
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => setRiskFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <input
                className="h-7 w-48 sm:w-56 bg-surface-container-lowest text-on-surface placeholder:text-outline font-mono text-[11px] px-2.5 rounded border border-hairline outline-none focus:border-primary"
                placeholder="Filter filename, IKE, cipher…"
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
              <span className="font-mono text-[11px] text-outline">
                {filtered.length} of {analyses.length}
              </span>
            </div>
          </div>

          <div className="ov-tablewrap w-full overflow-x-auto max-h-[420px] relative">
            <table className="w-full text-left font-sans text-[12px] whitespace-nowrap">
              <thead className="ov-thead sticky top-0 bg-surface-container-lowest text-outline font-mono text-[11px] uppercase tracking-wider select-none border-b border-hairline z-20">
                <tr>
                  <th className="py-2.5 px-5">Risk · risk_level</th>
                  <th className="py-2.5 px-5 sticky left-0 bg-surface-container-lowest z-30">Capture · filename</th>
                  <th className="py-2.5 px-5">IKE / Mode · config_json</th>
                  <th className="py-2.5 px-5">Score · security_score</th>
                  <th className="py-2.5 px-5">Traffic · label/conf</th>
                  <th className="py-2.5 px-5">Anomaly</th>
                  <th className="py-2.5 px-5">Status / Ingested</th>
                  <th className="py-2.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono text-[12px]">
                {filtered.map((a) => {
                  const risk = getRisk(a);
                  const tone = a.status === "pending" && !risk ? "pending" : riskTone(risk);
                  const score = getScore(a);
                  const cfg = getIpsecConfig(a);
                  const ike = cfg?.sa_config?.ike_version ?? "—";
                  const mode = cfg?.sa_config?.mode ?? "—";
                  const label = getTrafficLabel(a);
                  const conf = getTrafficConfidence(a);
                  const anom = getAnomaly(a);
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-surface-container/60 transition-colors cursor-pointer group"
                      onClick={() => openDrawer(a)}
                    >
                      <td className="py-3 px-5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            tone === "critical" || tone === "high"
                              ? "bg-error/15 text-error"
                              : tone === "medium"
                              ? "bg-amber-500/15 text-amber-300"
                              : tone === "low"
                              ? "bg-tertiary-container/20 text-tertiary"
                              : "bg-surface-container-highest text-outline"
                          }`}
                        >
                          {risk ?? (a.status === "pending" ? "PENDING" : "—")}
                        </span>
                      </td>
                      <td className="py-3 px-5 font-semibold text-on-surface sticky left-0 bg-surface-container-low group-hover:bg-surface-container transition-colors z-10 max-w-[260px] truncate">
                        {a.filename}
                      </td>
                      <td className="py-3 px-5 text-outline">
                        {ike} / {mode}
                      </td>
                      <td className="py-3 px-5">
                        {score === null ? (
                          <span className="text-outline">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-on-surface tabular-nums">{score}/100</span>
                            <div className="w-16 h-1 rounded bg-surface-container-highest overflow-hidden">
                              <div
                                className={`h-full ${
                                  score < 50 ? "bg-error" : score < 80 ? "bg-amber-400" : "bg-tertiary"
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-5 text-on-surface-variant">
                        {label ? (
                          <>
                            {label}
                            <span className="text-outline"> · {formatPct01(conf)}</span>
                          </>
                        ) : (
                          <span className="text-outline">—</span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-outline">
                        {anom === null ? "—" : anom.toFixed(3)}
                      </td>
                      <td className="py-3 px-5 text-outline">
                        {a.status} · {formatTime(a.created_at)}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <button
                          className="text-primary hover:text-teal-bright font-semibold inline-flex items-center gap-1 group-hover:underline"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(a);
                          }}
                        >
                          Inspect <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 px-5 text-center text-outline font-mono">
                      No analyses match filename / risk_level / config_json filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. DUAL WORKBENCH — findings_json queue + traffic_label mix */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-surface-container-low rounded p-5 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">warning</span>
                  <h2 className="text-[14px] font-semibold text-on-surface">Priority Findings · findings_json</h2>
                </div>
                <span className="text-[11px] font-mono text-outline">
                  {stats.findingsTotal} total · top {findingsQueue.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {findingsQueue.map((f, i) => (
                  <div
                    key={`${f.analysisId}-${i}`}
                    className="bg-surface-container p-3 rounded border border-hairline flex items-center justify-between gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => router.push("/analysis/findings")}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                          f.severity === "CRITICAL" || f.severity === "HIGH"
                            ? "bg-error/15 text-error"
                            : f.severity === "MEDIUM"
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-surface-container-highest text-outline"
                        }`}
                      >
                        {f.severity}
                      </span>
                      <div className="min-w-0">
                        <p className="ov-clamp text-[12px] font-medium text-on-surface">
                          {f.description}
                        </p>
                        <p className="text-[10px] font-mono text-outline">
                          {f.filename} · {f.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-outline shrink-0">{formatTime(f.created_at)}</span>
                  </div>
                ))}
                {findingsQueue.length === 0 && (
                  <p className="font-mono text-[12px] text-outline bg-surface-container p-3 rounded border border-hairline">
                    No findings_json rows yet — upload a PCAP to populate the rule-engine queue.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-hairline flex justify-between items-center text-[11px] font-mono">
              <span className="text-outline">severity / category / description per finding</span>
              <button
                type="button"
                className="text-primary hover:underline font-semibold"
                onClick={() => router.push("/analysis/findings")}
              >
                View all findings →
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container-low rounded p-5 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">insights</span>
                  <h2 className="text-[14px] font-semibold text-on-surface">Traffic Mix · traffic_label</h2>
                </div>
                <span className="text-[10px] font-mono text-tertiary px-1.5 py-0.5 rounded bg-tertiary-container/20">
                  RF CLASSIFIER
                </span>
              </div>

              <div className="flex flex-col gap-2.5 font-mono text-[11px]">
                {trafficRows.map((t) => (
                  <div key={t.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`ov-dot w-2 h-2 rounded-full ${t.dot}`} />
                      <span className="text-on-surface capitalize">{t.label}</span>
                    </div>
                    <span className="font-semibold text-on-surface">
                      {t.pct}% <span className="text-outline font-normal">· {t.count}</span>
                    </span>
                  </div>
                ))}
                {trafficRows.length === 0 && (
                  <p className="text-outline">No traffic_label rows yet.</p>
                )}

                <div className="h-1.5 w-full rounded bg-surface-container-highest flex overflow-hidden my-1">
                  {trafficRows.map((t) => (
                    <div key={t.label} className={`ov-seg ${t.dot.replace("ov-dot", "ov-fill")}`} style={{ width: `${t.pct}%` }} />
                  ))}
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  traffic_confidence shown per row · anomaly_score in table + drawer
                </p>
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

        {/* 5. SLIDE-OVER INSPECTOR — full AnalysisOut record */}
        {drawerOpen && (
          <div
            className="ov-backdrop fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50"
            id="drawer-backdrop"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <aside
          className={`ov-drawer fixed top-0 right-0 h-full w-[480px] max-w-full bg-surface-container-low border-l border-hairline z-50 flex flex-col shadow-2xl ${
            drawerOpen ? "ov-drawer-open" : "ov-drawer-closed"
          }`}
          id="detail-drawer"
          aria-hidden={!drawerOpen}
        >
          <div className="p-4 bg-surface-container border-b border-hairline flex items-start justify-between">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
                Analysis record · analyses
              </span>
              <h2 className="font-mono text-[14px] font-semibold text-on-surface break-all">{selected.filename}</h2>
              <div className="flex items-center gap-2 mt-1 font-mono text-[10px] flex-wrap">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    (selRisk === "CRITICAL" || selRisk === "HIGH")
                      ? "bg-error/20 text-error"
                      : selRisk === "MEDIUM"
                      ? "bg-amber-500/20 text-amber-300"
                      : selRisk === "LOW"
                      ? "bg-tertiary-container/20 text-tertiary"
                      : "bg-surface-container-highest text-outline"
                  }`}
                >
                  {selRisk ?? selected.status.toUpperCase()}
                </span>
                <span className="text-outline">score {selScore ?? "—"}</span>
                <span className="text-outline">{formatTime(selected.created_at)}</span>
              </div>
            </div>
            <button
              className="p-1 rounded hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors"
              title="Close Drawer"
              type="button"
              onClick={() => setDrawerOpen(false)}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-[12px] font-mono text-on-surface-variant">
            <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col gap-2">
              <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">
                Row identity · id / status / created_at
              </span>
              <div className="flex justify-between gap-3 py-1 border-b border-hairline">
                <span className="text-outline shrink-0">id</span>
                <span className="text-on-surface break-all text-right select-all">{selected.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">status</span>
                <span className="text-on-surface">{selected.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">created_at</span>
                <span className="text-on-surface">{selected.created_at}</span>
              </div>
            </div>

            <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col gap-2">
              <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">
                Scores · security_score / anomaly_score / traffic
              </span>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">security_score</span>
                <span className="text-on-surface font-semibold">{selScore ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">risk_level</span>
                <span className="text-on-surface">{selRisk ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">traffic_label</span>
                <span className="text-on-surface">
                  {selTraffic ?? "—"}
                  {selTrafficConf !== null && selTraffic ? ` · ${formatPct01(selTrafficConf)}` : ""}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">anomaly_score</span>
                <span className="text-on-surface">{selAnomaly === null ? "—" : selAnomaly.toFixed(4)}</span>
              </div>
            </div>

            <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col gap-2">
              <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">
                config_json.ipsec_config · cryptography
              </span>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">encryption</span>
                <span className="text-on-surface">{selCfg?.cryptography?.encryption_algorithm ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">integrity</span>
                <span className="text-on-surface">{selCfg?.cryptography?.integrity_algorithm ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">dh_group</span>
                <span className="text-on-surface">{selCfg?.cryptography?.dh_group ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">pfs_enabled</span>
                <span className={selCfg?.cryptography?.pfs_enabled ? "text-tertiary font-semibold" : "text-error font-semibold"}>
                  {typeof selCfg?.cryptography?.pfs_enabled === "boolean"
                    ? selCfg.cryptography.pfs_enabled
                      ? "TRUE"
                      : "FALSE"
                    : "—"}
                </span>
              </div>
            </div>

            <div className="bg-surface-container p-3 rounded border border-hairline flex flex-col gap-2">
              <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">
                config_json.ipsec_config · sa_config
              </span>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">ike_version</span>
                <span className="text-on-surface">{selCfg?.sa_config?.ike_version ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">mode</span>
                <span className="text-on-surface">{selCfg?.sa_config?.mode ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span className="text-outline">replay_protection</span>
                <span className="text-on-surface">
                  {typeof selCfg?.sa_config?.replay_protection === "boolean"
                    ? String(selCfg.sa_config.replay_protection).toUpperCase()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">lifetime_seconds</span>
                <span className="text-on-surface">{selCfg?.sa_config?.lifetime_seconds ?? "—"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">
                findings_json · {selFindings.length} finding{selFindings.length === 1 ? "" : "s"}
              </span>
              {selFindings.map((f, i) => (
                <div key={i} className="bg-surface-container p-3 rounded border border-hairline">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-error/15 text-error text-[10px] font-bold">
                      {String(f.severity).toUpperCase()}
                    </span>
                    <span className="text-[11px] text-primary">{f.category}</span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-on-surface">{f.description}</p>
                </div>
              ))}
              {selFindings.length === 0 && (
                <p className="bg-surface-container p-3 rounded border border-hairline text-[11px]">
                  {selected.status === "pending"
                    ? "Pipeline has not populated findings_json yet."
                    : "No rule-engine findings for this analysis."}
                </p>
              )}
            </div>

            <details className="ov-details bg-surface-container-lowest rounded border border-hairline">
              <summary className="cursor-pointer p-3 text-[11px] text-outline hover:text-on-surface">
                raw config_json (bundle)
              </summary>
              <pre className="ov-pre p-3 pt-0 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(selected.config_json, null, 2) ?? "null"}
              </pre>
            </details>
          </div>

          <div className="p-3.5 bg-surface-container border-t border-hairline flex items-center justify-between gap-2.5">
            <button
              className="h-8 px-3 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-semibold transition-colors"
              type="button"
              onClick={() => setDrawerOpen(false)}
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

      {/* Overview-scoped CSS only — theme tokens reused, no globals.css edits. */}
      <style>{`
        .ov-scope .ov-tablewrap { scrollbar-width: thin; }
        .ov-scope .ov-tablewrap::-webkit-scrollbar { display: none; }
        .ov-scope .ov-thead th { background: var(--color-surface-container-lowest); }
        .ov-scope .ov-kbd { border: 1px solid rgba(255,255,255,0.12); }
        .ov-scope .ov-pulse { animation: ov-pulse 1.8s ease-in-out infinite; }
        @keyframes ov-pulse { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
        .ov-scope .ov-bar-fill { transition: width 0.5s ease; min-width: 2px; }
        .ov-scope .ov-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ov-scope .ov-drawer { transition: transform 0.22s ease; will-change: transform; }
        .ov-scope .ov-drawer-closed { transform: translateX(100%); pointer-events: none; }
        .ov-scope .ov-drawer-open { transform: translateX(0); }
        .ov-scope .ov-backdrop { animation: ov-fade 0.22s ease both; }
        @keyframes ov-fade { from { opacity: 0; } to { opacity: 1; } }
        .ov-scope .ov-dot-video { background: var(--color-primary); }
        .ov-scope .ov-dot-web { background: var(--color-tertiary); }
        .ov-scope .ov-dot-voip { background: #f5a623; }
        .ov-scope .ov-dot-icmp { background: var(--color-outline); }
        .ov-scope .ov-dot-email { background: var(--color-secondary, #8b949e); }
        .ov-scope .ov-dot-other { background: var(--color-outline); }
        .ov-scope .ov-fill-video { background: var(--color-primary); }
        .ov-scope .ov-fill-web { background: var(--color-tertiary); }
        .ov-scope .ov-fill-voip { background: #f5a623; }
        .ov-scope .ov-fill-icmp { background: var(--color-outline); }
        .ov-scope .ov-fill-email { background: var(--color-secondary, #8b949e); }
        .ov-scope .ov-fill-other { background: var(--color-outline); }
        .ov-scope .ov-seg { min-width: 3px; }
        .ov-scope .ov-details summary::-webkit-details-marker { display: none; }
        .ov-scope .ov-pre { color: var(--color-on-surface-variant); }
        @media (prefers-reduced-motion: reduce) {
          .ov-scope .ov-pulse, .ov-scope .ov-backdrop { animation: none; }
          .ov-scope .ov-drawer, .ov-scope .ov-bar-fill { transition: none; }
        }
      `}</style>
    </div>
  );
}
