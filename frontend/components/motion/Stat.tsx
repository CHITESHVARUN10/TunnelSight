"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

type StatProps = {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
};

/** ReactBits CountUp — spring-animated metric, starts when scrolled into view. */
export default function Stat({
  to,
  from = 0,
  duration = 1.8,
  delay = 0,
  className = "",
  separator = ",",
  prefix = "",
  suffix = "",
}: StatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const decimals = (() => {
    const parts = to.toString().split(".");
    return parts.length > 1 && parseInt(parts[1]) !== 0 ? parts[1].length : 0;
  })();

  const formatValue = useCallback(
    (latest: number) =>
      prefix +
      Intl.NumberFormat("en-US", {
        useGrouping: !!separator,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
        .format(latest)
        .replace(/,/g, separator) +
      suffix,
    [decimals, separator, prefix, suffix]
  );

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(from);
  }, [from, formatValue]);

  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => motionValue.set(to), delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, motionValue, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest: number) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
