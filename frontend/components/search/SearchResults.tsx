"use client";

import type {
  SearchResponse,
  SearchScope,
} from "@/lib/search";

/** Bold the matched substring (case-insensitive). */
export function Hi({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-teal-400 font-bold">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  HIGH: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  MEDIUM: "bg-teal-500/20 text-teal-300 border-teal-500/40",
  LOW: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

function SectionHead({ left, right, rightClass = "text-zinc-500" }: { left: string; right: string; rightClass?: string }) {
  return (
    <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 uppercase tracking-wider">
      <span>{left}</span>
      <span className={rightClass}>{right}</span>
    </div>
  );
}

function Row({
  onOpen,
  icon,
  iconClass,
  children,
  action,
}: {
  onOpen: () => void;
  icon: string;
  iconClass: string;
  children: React.ReactNode;
  action: string;
}) {
  return (
    <div
      className="group flex items-center justify-between p-3 rounded bg-[#0c0e11] border border-zinc-800 hover:border-teal-500/50 hover:bg-[#14171c] cursor-pointer transition-colors"
      onClick={onOpen}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className={`p-1.5 rounded shrink-0 mt-0.5 ${iconClass}`}>
          <span className="material-symbols-outlined text-base">{icon}</span>
        </div>
        <div className="space-y-0.5 min-w-0">{children}</div>
      </div>
      <span className="hidden group-hover:inline-block text-[11px] text-teal-400 shrink-0 pl-3">
        {action}
      </span>
    </div>
  );
}

function extOf(filename: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(filename);
  return (m?.[1] ?? "PCAP").toUpperCase();
}

export function SearchResults({
  data,
  query,
  loading,
  scope,
  onOpen,
  onDownloadReport,
}: {
  data: SearchResponse | null;
  query: string;
  loading: boolean;
  scope: SearchScope;
  onOpen: (path: string) => void;
  onDownloadReport: (id: string, filename: string) => void;
}) {
  if (loading && !data) {
    return <div className="p-6 font-mono text-xs text-zinc-500">Searching…</div>;
  }
  if (!data || data.total === 0) {
    return (
      <div className="p-6 font-mono text-xs text-zinc-500">
        {query.trim()
          ? `No results for “${query.trim()}”.`
          : "No captures yet. Upload a PCAP or run a simulation to populate search."}
      </div>
    );
  }

  const show = (s: SearchScope) => scope === "all" || scope === s;
  const g = data.groups;

  return (
    <div className="space-y-4 font-mono text-xs">
      {show("captures") && g.captures.length > 0 && (
        <div className="space-y-1.5">
          <SectionHead left={`Captures (${data.counts.captures})`} right="Matches in filename" />
          {g.captures.map((c) => (
            <Row
              key={c.id}
              onOpen={() => onOpen(`/analysis/results?analysis_id=${c.id}`)}
              icon="receipt_long"
              iconClass="bg-teal-500/10 text-teal-400"
              action="↵ Open"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-100 truncate">
                  <Hi text={c.filename} query={query} />
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">{extOf(c.filename)}</span>
                {c.score !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] border font-semibold ${
                      (c.risk === "HIGH" || c.risk === "CRITICAL") && c.score < 70
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : "bg-teal-500/15 text-teal-300 border-teal-500/30"
                    }`}
                  >
                    SCORE {c.score} · {c.risk ?? "—"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                <span className="text-zinc-300">{c.suite}</span>
              </div>
            </Row>
          ))}
        </div>
      )}

      {show("findings") && g.findings.length > 0 && (
        <div className="space-y-1.5">
          <SectionHead
            left={`Findings (${data.counts.findings})`}
            right="Category · severity · description"
            rightClass="text-rose-400 font-medium"
          />
          {g.findings.map((f, i) => (
            <Row
              key={`${f.analysis_id}-${i}`}
              onOpen={() => onOpen(`/analysis/findings?analysis_id=${f.analysis_id}`)}
              icon="security_update_warning"
              iconClass="bg-rose-500/15 text-rose-400"
              action="Inspect"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-100 truncate">
                  <Hi text={`${f.category ?? "Finding"} — ${f.description ?? ""}`} query={query} />
                </span>
                {f.severity && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] border font-bold uppercase ${SEVERITY_BADGE[f.severity] ?? SEVERITY_BADGE.LOW}`}>
                    {f.severity}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                <span>
                  In: <span className="text-teal-400">{f.capture}</span>
                </span>
              </div>
            </Row>
          ))}
        </div>
      )}

      {show("vpns") && g.vpns.length > 0 && (
        <div className="space-y-1.5">
          <SectionHead left={`VPN Suites (${data.counts.vpns})`} right="Distinct negotiated configurations" />
          {g.vpns.map((v) => (
            <Row
              key={v.suite}
              onOpen={() => onOpen(`/analysis/configuration?analysis_id=${v.analysis_id}`)}
              icon="settings_ethernet"
              iconClass="bg-zinc-800 text-teal-400"
              action="↵ Open"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-100 truncate">
                  <Hi text={v.suite} query={query} />
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">
                  {v.captures} CAPTURE{v.captures === 1 ? "" : "S"}
                </span>
              </div>
            </Row>
          ))}
        </div>
      )}

      {show("spis") && g.spis.length > 0 && (
        <div className="space-y-1.5">
          <SectionHead left={`Packet Hex Matches (${data.counts.spis})`} right="Stored packet previews" rightClass="text-cyan-400" />
          {g.spis.map((s, i) => (
            <Row
              key={`${s.analysis_id}-${i}`}
              onOpen={() => onOpen(`/analysis/capture?analysis_id=${s.analysis_id}`)}
              icon="tag"
              iconClass="bg-zinc-800 text-teal-400"
              action="Jump to Hex"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-teal-400 tracking-wider">{s.match}</span>
                <span className="text-zinc-500 text-[11px]">
                  In: <span className="text-teal-400">{s.capture}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px] truncate">
                <span>{s.peer}</span>
                <span>·</span>
                <span>packet #{s.packet_index ?? "—"}</span>
              </div>
            </Row>
          ))}
        </div>
      )}

      {show("reports") && g.reports.length > 0 && (
        <div className="space-y-1.5">
          <SectionHead left={`Reports (${data.counts.reports})`} right="Server-rendered PDF" />
          {g.reports.map((r) => (
            <Row
              key={r.id}
              onOpen={() => onDownloadReport(r.id, r.filename)}
              icon="picture_as_pdf"
              iconClass="bg-zinc-800 text-zinc-400 group-hover:text-teal-400"
              action="Download"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-200 truncate">
                  <Hi text={r.filename.replace(/\.(pcapng|pcap|cap|erf)$/i, "") + "-report.pdf"} query={query} />
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">PDF</span>
              </div>
            </Row>
          ))}
        </div>
      )}

      {show("docs") && g.docs.length > 0 && (
        <div className="space-y-1.5">
          <SectionHead left={`Documentation (${data.counts.docs})`} right="Knowledge Hub" rightClass="text-emerald-400 font-medium" />
          {g.docs.map((d) => (
            <Row
              key={d.href + d.title}
              onOpen={() => onOpen(d.href)}
              icon="menu_book"
              iconClass="bg-emerald-500/10 text-emerald-400"
              action="↵ Read"
            >
              <div className="font-semibold text-zinc-100 truncate">
                <Hi text={d.title} query={query} />
              </div>
              <div className="text-zinc-500 text-[11px] truncate">{d.desc}</div>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}
