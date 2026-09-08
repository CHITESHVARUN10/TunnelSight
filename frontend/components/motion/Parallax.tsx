"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

/** Transform-only scroll parallax wrapper (compositor thread, 60fps).
 *  speed: px of drift per full viewport of scroll. Keep subtle (40–120);
 *  positive drifts down (backgrounds, appear slower), negative rises (foregrounds).
 *  Disabled automatically under prefers-reduced-motion. */
export function Parallax({
  children,
  speed = 80,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, reduce ? 0 : speed]);
  return (
    <motion.div className={className} style={{ y, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}

/** Choreographed headline reveal: each line clips and rises in sequence.
 *  Reads as deliberate craft (editorial), not the generic fade-up-on-scroll. */
export function LineReveal({
  items,
  className = "",
  delay = 0.15,
  step = 0.12,
}: {
  items: ReactNode[];
  className?: string;
  delay?: number;
  step?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {items.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
          <motion.span
            className="block will-change-transform"
            initial={reduce ? { opacity: 0 } : { y: "112%" }}
            animate={reduce ? { opacity: 1 } : { y: "0%" }}
            transition={{ duration: 0.9, delay: delay + i * step, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
