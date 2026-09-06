"use client";

import type { ReactNode } from "react";

type StarCTAProps = {
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

/** ReactBits StarBorder — comet of light orbiting the CTA border. Keyframes live in globals.css. */
export default function StarCTA({
  children,
  className = "",
  color = "#5eead4",
  speed = "5s",
  thickness = 1,
  backgroundColor = "#00a896",
  textColor = "#00352e",
  borderColor = "rgba(94, 234, 212, 0.35)",
}: StarCTAProps) {
  return (
    <span
      className={`relative inline-block overflow-hidden rounded-lg ${className}`}
      style={{ padding: `${thickness}px 0` }}
    >
      <span
        className="animate-star-movement-bottom absolute bottom-[-11px] right-[-250%] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
        aria-hidden="true"
      />
      <span
        className="animate-star-movement-top absolute left-[-250%] top-[-10px] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
        aria-hidden="true"
      />
      <span
        className="relative z-[1] inline-flex items-center justify-center gap-2 rounded-lg border px-space-lg py-2.5 font-headline-sm text-headline-sm"
        style={{ background: backgroundColor, color: textColor, borderColor }}
      >
        {children}
      </span>
    </span>
  );
}
