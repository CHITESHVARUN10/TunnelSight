"use client";
// Shared hook: fetch analysis + findings + traffic + anomalies for an analysis id.

import { useEffect, useState } from "react";
import {
  getAnalysis,
  getAnomalies,
  getFindings,
  getTraffic,
  type Analysis,
} from "@/lib/analysis";

export type Bundle = {
  analysis: Analysis;
  findings: { security_score: number | null; risk_level: string | null; findings: Analysis["findings_json"] };
  traffic: { mix: Record<string, number>; windows_count: number };
  anomalies: { engine: string; threshold: number | null; windows: unknown[] };
};

export function useAnalysisBundle(id: string | null) {
  const [data, setData] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const [analysis, findings, traffic, anomalies] = await Promise.all([
          getAnalysis(id),
          getFindings(id),
          getTraffic(id),
          getAnomalies(id),
        ]);
        if (!cancelled) {
          setData({ analysis, findings, traffic, anomalies });
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Load failed.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error };
}
