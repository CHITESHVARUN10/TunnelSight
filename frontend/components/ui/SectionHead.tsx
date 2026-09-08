"use client";
// Shared page-section heading: mono kicker, serif title, optional lede and
// trailing action. Enforces one editorial voice across all app pages.

import type { ReactNode } from "react";

export function SectionHead({
  kicker,
  title,
  lede,
  action,
  className = "",
  titleSize = "clamp(1.75rem, 3vw, 2.5rem)",
}: {
  kicker: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  className?: string;
  titleSize?: string;
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-space-md ${className}`}>
      <div className="flex flex-col gap-space-2xs max-w-2xl">
        <span className="font-code-sm text-code-sm text-primary uppercase tracking-widest">{kicker}</span>
        <h2 className="font-display-serif section-display text-on-surface font-medium" style={{ fontSize: titleSize }}>
          {title}
        </h2>
        {lede ? (
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{lede}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
