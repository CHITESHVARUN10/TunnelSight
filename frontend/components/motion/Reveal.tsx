"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** px to rise/fall in from */
  distance?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
  as?: "div" | "section" | "span";
};

/** Scroll-triggered rise + fade (+ optional deblur). Motion-based take on ReactBits AnimatedContent — no GSAP. */
export default function Reveal({
  children,
  className,
  distance = 24,
  direction = "up",
  delay = 0,
  duration = 0.7,
  blur = true,
  once = true,
  as = "div",
}: RevealProps) {
  const offset =
    direction === "none"
      ? { x: 0, y: 0 }
      : direction === "up"
        ? { x: 0, y: distance }
        : direction === "down"
          ? { x: 0, y: -distance }
          : direction === "left"
            ? { x: distance, y: 0 }
            : { x: -distance, y: 0 };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
      ...(blur ? { filter: "blur(8px)" } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: "blur(0px)" } : {}),
    },
  };

  const Comp = (motion as never)[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-64px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
