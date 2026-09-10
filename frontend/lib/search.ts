import { api } from "./api";

export type SearchScope = "all" | "captures" | "findings" | "spis" | "reports" | "vpns" | "docs";

export type SearchCapture = {
  id: string;
  filename: string;
  score: number | null;
  risk: string | null;
  suite: string;
  created_at: string | null;
};

export type SearchFinding = {
  severity: string | null;
  category: string | null;
  description: string | null;
  capture: string;
  analysis_id: string;
};

export type SearchSpi = {
  match: string;
  capture: string;
  analysis_id: string;
  packet_index: number | null;
  peer: string;
};

export type SearchReport = {
  id: string;
  filename: string;
  created_at: string | null;
};

export type SearchVpn = {
  suite: string;
  captures: number;
  analysis_id: string;
};

export type SearchDoc = {
  title: string;
  desc: string;
  href: string;
};

export type SearchResponse = {
  q: string;
  total: number;
  counts: Record<SearchScope, number>;
  groups: {
    captures: SearchCapture[];
    findings: SearchFinding[];
    spis: SearchSpi[];
    reports: SearchReport[];
    vpns: SearchVpn[];
    docs: SearchDoc[];
  };
};

export const SEARCH_SCOPES: { id: SearchScope; label: string }[] = [
  { id: "all", label: "All Results" },
  { id: "captures", label: "Captures" },
  { id: "findings", label: "Findings" },
  { id: "vpns", label: "VPNs" },
  { id: "spis", label: "SPI" },
  { id: "reports", label: "Reports" },
  { id: "docs", label: "Docs" },
];

/** Live search over the caller's own analyses. Empty q returns recent items. */
export const searchBackend = (q: string, scope: SearchScope = "all"): Promise<SearchResponse> => {
  const params = new URLSearchParams({ q, scope });
  return api(`/api/search?${params.toString()}`);
};

/** Path of the top result, mirroring render order (for Enter-to-open). */
export function firstResultPath(data: SearchResponse | null): string | null {
  if (!data) return null;
  const g = data.groups;
  if (g.captures[0]) return `/analysis/results?analysis_id=${g.captures[0].id}`;
  if (g.findings[0]) return `/analysis/findings?analysis_id=${g.findings[0].analysis_id}`;
  if (g.spis[0]) return `/analysis/capture?analysis_id=${g.spis[0].analysis_id}`;
  if (g.reports[0]) return `/analysis/reports?analysis_id=${g.reports[0].id}`;
  if (g.vpns[0]) return `/analysis/configuration?analysis_id=${g.vpns[0].analysis_id}`;
  if (g.docs[0]) return g.docs[0].href;
  return null;
}
