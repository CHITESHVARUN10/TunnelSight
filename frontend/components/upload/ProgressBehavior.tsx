"use client";
// Progress polling for /analysis/progress?analysis_id=UUID.
// Polls GET /api/history/{id} until completed/failed, then routes to results.

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast";

export function ProgressBehavior({ pausedRef }: { pausedRef?: React.MutableRefObject<boolean> }) {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = params.get("analysis_id");
    if (!id) {
      toast({ title: "No analysis", body: "Upload a capture first.", kind: "warn" });
      router.push("/analyze");
      return;
    }
    let dead = false;
    let attempts = 0;
    const go = (path: string) => {
      if (!dead) router.push(path);
    };
    const tick = async () => {
      if (dead) return;
      if (pausedRef?.current) {
        timer.current = setTimeout(tick, 500);
        return;
      }
      attempts += 1;
      try {
        const row = await api(`/api/history/${id}`);
        if (row.status === "completed") {
          go(`/analysis/results?analysis_id=${id}`);
          return;
        }
        if (row.status === "failed") {
          toast({ title: "Analysis failed", body: row.config_json?.error ?? "Pipeline error.", kind: "warn" });
          go(`/analysis/results?analysis_id=${id}`);
          return;
        }
      } catch (err) {
        if (err instanceof Error && /^40[14]/.test(err.message)) {
          toast({ title: "Analysis not found", body: "It may belong to another session.", kind: "warn" });
          go("/analyze");
          return;
        }
      }
      if (attempts >= 30) {
        go(`/analysis/results?analysis_id=${id}`);
        return;
      }
      timer.current = setTimeout(tick, 2000);
    };
    tick();

    const partials = Array.from(document.querySelectorAll("button")).filter((b) =>
      (b.textContent ?? "").includes("Inspect Partial Results")
    );
    const goPartial = () => go(`/analysis/results?analysis_id=${id}`);
    partials.forEach((b) => b.addEventListener("click", goPartial));
    return () => {
      dead = true;
      if (timer.current) clearTimeout(timer.current);
      partials.forEach((b) => b.removeEventListener("click", goPartial));
    };
  }, [router, params, pausedRef, toast]);

  return null;
}
