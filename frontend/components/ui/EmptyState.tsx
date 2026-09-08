"use client";
// Shared empty state: names what produced the emptiness and offers the way
// out. Used by tables, search, palette, and filtered views.

import type { ReactNode } from "react";

export function EmptyState({
  icon = "search_off",
  title,
  body,
  action,
  className = "",
}: {
  icon?: string;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center gap-space-sm py-space-2xl px-space-base ${className}`}>
      <span className="material-symbols-outlined text-outline text-[32px]">{icon}</span>
      <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">{title}</div>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md leading-relaxed">{body}</p>
      {action ? <div className="pt-space-xs">{action}</div> : null}
    </div>
  );
}
