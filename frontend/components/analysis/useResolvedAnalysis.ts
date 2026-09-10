"use client";
// Resolves which capture a page should render.
//
// The sidebar links to /analysis/findings, /analysis/configuration and
// /analysis/traffic without a query string, so those pages used to bail out with
// "No analysis selected". Resolution order is therefore:
//   1. ?analysis_id=<id> from the URL
//   2. the most recent capture for the signed-in user
// A page distinguishes "no captures at all" from "load failed" so it can prompt an
// upload instead of showing an error.

import { useEffect, useState } from "react";
import { getAnalysis, listHistory, type Analysis } from "@/lib/analysis";

export type Resolved = {
  analysis: Analysis | null;
  analysisId: string | null;
  loading: boolean;
  error: string | null;
  /** True only when the account genuinely has no captures yet. */
  empty: boolean;
};

export function useResolvedAnalysis(requestedId?: string | null): Resolved {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    let dead = false;

    (async () => {
      setLoading(true);
      setError(null);
      setEmpty(false);
      try {
        const row = requestedId
          ? await getAnalysis(requestedId)
          : (await listHistory({ limit: 1 })).items[0] ?? null;

        if (dead) return;
        setAnalysis(row);
        setAnalysisId(row?.id ?? null);
        setEmpty(row === null);
      } catch (err) {
        if (dead) return;
        setAnalysis(null);
        setAnalysisId(null);
        setError(err instanceof Error ? err.message : "Unable to load this capture.");
      } finally {
        if (!dead) setLoading(false);
      }
    })();

    return () => {
      dead = true;
    };
  }, [requestedId]);

  return { analysis, analysisId, loading, error, empty };
}
