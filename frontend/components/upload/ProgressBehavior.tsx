"use client";
// Demo pipeline runner for /analysis/progress. Auto-advances to results after
// ~9s unless paused or cancelled. Cancel returns to /analyze.
// "Inspect Partial Results" jumps straight to results.

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function ProgressBehavior({ pausedRef }: { pausedRef?: React.MutableRefObject<boolean> }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const go = () => router.push("/analysis/results");
    const tick = () => {
      if (pausedRef?.current) {
        timer.current = setTimeout(tick, 500);
        return;
      }
      go();
    };
    timer.current = setTimeout(tick, 9000);

    const partials = Array.from(document.querySelectorAll("button")).filter((b) =>
      (b.textContent ?? "").includes("Inspect Partial Results")
    );
    partials.forEach((b) => b.addEventListener("click", go));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      partials.forEach((b) => b.removeEventListener("click", go));
    };
  }, [router, pausedRef]);

  return null;
}
