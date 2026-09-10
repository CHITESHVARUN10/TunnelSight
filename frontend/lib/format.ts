import type { Analysis } from "./analysis";

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)} s`;
  return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
}

export function formatClock(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

export function captureVolume(a: Analysis | null | undefined): string {
  const capture = a?.config_json?.capture;
  return formatBytes(capture?.file_bytes ?? capture?.total_bytes);
}

export function capturePackets(a: Analysis | null | undefined): string {
  return formatCount(a?.config_json?.capture?.packet_count);
}

export function suiteString(a: Analysis | null | undefined): string {
  const ipsec = a?.config_json?.ipsec_config;
  const crypto = ipsec?.cryptography as Record<string, unknown> | undefined;
  const sa = ipsec?.sa_config as Record<string, unknown> | undefined;
  if (!crypto && !sa) return "—";
  const ike = (sa?.ike_version as string) ?? "UNKNOWN";
  const enc = (crypto?.encryption_algorithm as string) ?? "UNKNOWN";
  const integ = (crypto?.integrity_algorithm as string) ?? "UNKNOWN";
  const dh = typeof crypto?.dh_group === "number" ? ` / DH Group ${crypto.dh_group}` : "";
  return `${ike} / ESP ${enc} / ${integ}${dh}`;
}
