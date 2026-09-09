"use client";

import type { ReactNode } from "react";

/* Shared docs surfaces — one flat Astra-quiet system for every diagram.
   Rules: max two background levels (panel over page, well over panel),
   hairline white borders only, no tinted translucent fills. Color appears
   solely as small solid dots. */

export function DocPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/[0.08] bg-[#090d17] ${className}`}>
      {children}
    </div>
  );
}

export function DocWell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-white/[0.06] bg-black/40 ${className}`}>
      {children}
    </div>
  );
}

export function DocLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider text-[#8c8a82] ${className}`}>
      {children}
    </span>
  );
}

export const VERDICT_DOT: Record<string, string> = {
  CONFORMANT: "#8fae6a",
  RECOMMENDED: "#8fae6a",
  HIGH_ASSURANCE: "#96d9a8",
  AUDITED: "#c2b59b",
  MINIMUM: "#c2b59b",
  EXTRACTED: "#d97757",
  SYNTHESIZED: "#d97757",
  DEPRECATED: "#d49a4f",
  FORBIDDEN: "#c75450",
};

export function DocChip({ verdict, className = "" }: { verdict: string; className?: string }) {
  const dot = VERDICT_DOT[verdict] ?? "#c2b59b";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] text-[#d8d4c7] ${className}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {verdict}
    </span>
  );
}

/* Selected / active state: white hairline + ivory text, no colored wash. */
export const DOC_ACTIVE = "border-white/25 bg-white/[0.06] text-[#f7f4ee]";
export const DOC_IDLE = "border-white/[0.06] bg-transparent text-[#8c8a82]";
