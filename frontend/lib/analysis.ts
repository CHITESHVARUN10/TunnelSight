import { api, apiBlob, apiForm } from "./api";

export type PreviewPacket = {
  index: number;
  offset: number;
  length: number;
  src: string | null;
  dst: string | null;
  proto: string;
  hex: string;
  hex_truncated: boolean;
};

export type CaptureStats = {
  packet_count: number | null;
  total_bytes: number | null;
  flow_duration: number | null;
  file_bytes: number | null;
  started_at: string | null;
  packets_preview?: PreviewPacket[] | null;
};

export type Analysis = {
  id: string;
  filename: string;
  status: string;
  config_json: {
    ipsec_config?: {
      capture_name?: string;
      cryptography?: Record<string, unknown>;
      sa_config?: Record<string, unknown>;
    };
    capture?: CaptureStats | null;
    windows_count?: number;
    note?: string;
    evidence_source?: string;
    error?: string;
  } | null;
  anomaly_score: number | null;
  traffic_label: string | null;
  traffic_confidence: number | null;
  security_score: number | null;
  risk_level: string | null;
  findings_json: { severity: string; category: string; description: string }[] | null;
  created_at: string;
};

export type Window = {
  window_id: number;
  window_start: number | null;
  window_end: number | null;
  packet_count: number | null;
  traffic_label: string | null;
  traffic_confidence: number | null;
  anomaly_score: number | null;
  is_anomaly: boolean | null;
};

export async function uploadPcap(file: File): Promise<Analysis> {
  const form = new FormData();
  form.append("file", file, file.name);
  return apiForm("/api/analyze", form);
}

export const getAnalysis = (id: string): Promise<Analysis> => api(`/api/history/${id}`);

export const getWindows = (
  id: string,
  params: { label?: string; anomaly_only?: boolean } = {}
): Promise<Window[]> => {
  const q = new URLSearchParams();
  if (params.label) q.set("label", params.label);
  if (params.anomaly_only) q.set("anomaly_only", "true");
  const s = q.toString();
  return api(`/api/history/${id}/windows${s ? `?${s}` : ""}`);
};

export const getFindings = (
  id: string,
  params: { severity?: string; q?: string } = {}
): Promise<{ security_score: number | null; risk_level: string | null; findings: Analysis["findings_json"] }> => {
  const q = new URLSearchParams();
  if (params.severity) q.set("severity", params.severity);
  if (params.q) q.set("q", params.q);
  const s = q.toString();
  return api(`/api/history/${id}/findings${s ? `?${s}` : ""}`);
};

export const getTraffic = (id: string): Promise<{ mix: Record<string, number>; windows_count: number }> =>
  api(`/api/history/${id}/traffic`);

export const getAnomalies = (
  id: string,
  threshold?: number
): Promise<{ engine: string; threshold: number | null; windows: Window[] }> =>
  api(`/api/history/${id}/anomalies${threshold !== undefined ? `?threshold=${threshold}` : ""}`);

export const assessConfig = (config: object) =>
  api("/api/assess/config", { method: "POST", body: JSON.stringify(config) });

export type SimulateOptions = {
  encryption: Record<string, string>;
  integrity: Record<string, string>;
  dh_group: Record<string, string>;
};

export type SimulateInput = {
  encryption: string;
  integrity: string;
  dh_group: string;
};

/** Option labels for the interactive simulation UI. */
export const getSimulateOptions = (): Promise<SimulateOptions> => api("/api/simulate/options");

/** Generate a synthetic capture from the chosen suite and run the full pipeline. */
export const runSimulation = (input: SimulateInput): Promise<Analysis> =>
  api("/api/simulate", { method: "POST", body: JSON.stringify(input) });

export const compareAnalyses = (alpha: string, beta: string) =>
  api(`/api/compare?alpha=${alpha}&beta=${beta}`);

export const listHistory = (
  params: { q?: string; risk?: string; page?: number; limit?: number } = {}
): Promise<{ items: Analysis[]; total: number; page: number; limit: number }> => {
  const q = new URLSearchParams();
  if (params.q) q.set("q", params.q);
  if (params.risk) q.set("risk", params.risk);
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  const s = q.toString();
  return api(`/api/history${s ? `?${s}` : ""}`);
};

export const deleteAnalysis = (id: string) =>
  api(`/api/history/${id}`, { method: "DELETE" });

export type Explanation = {
  summary: string;
  per_finding: { severity: string; category: string; why: string; remediation: string }[];
  model: string | null;
  generated_at: string | null;
};

/** Cached explanation, or null when it has not been generated yet (404). */
export const getExplanation = async (id: string): Promise<Explanation | null> => {
  try {
    return (await api(`/api/history/${id}/explanation`)) as Explanation;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("404")) return null;
    throw err;
  }
};

/** Generate (or regenerate) the explanation. Throws on 503 when the AI layer is off. */
export const generateExplanation = (id: string, regenerate = false): Promise<Explanation> =>
  api(`/api/history/${id}/explanation${regenerate ? "?regenerate=true" : ""}`, { method: "POST" });

/** Download the server-rendered PDF report for an analysis. */
export async function downloadReportPdf(id: string, filename: string): Promise<void> {
  const blob = await apiBlob(`/api/history/${id}/report.pdf`);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename.replace(/\.(pcapng|pcap|cap|erf)$/i, "")}-report.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
