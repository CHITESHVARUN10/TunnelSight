"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMemo, useRef, type ReactNode } from "react";

function Word({
  children,
  progress,
  range,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, [4, 0]);
  const filter = useTransform(blur, (v) => `blur(${v.toFixed(2)}px)`);
  return (
    <motion.span style={{ opacity, filter }} className="inline-block">
      {children}
    </motion.span>
  );
}

/** Scroll-scrubbed word-by-word illumination. Motion-based take on ReactBits ScrollReveal — no GSAP. */
export default function ScrollStory({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = useMemo(() => text.split(/(\s+)/), [text]);

  return (
    <h2 ref={containerRef} className={className}>
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
        const total = words.filter((w) => !/^\s+$/.test(w)).length;
        const idx = words.slice(0, i).filter((w) => !/^\s+$/.test(w)).length;
        const start = idx / total;
        const end = (idx + 1) / total;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </h2>
  );
}
