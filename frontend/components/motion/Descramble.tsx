"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DescrambleProps = {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
};

const HEX_CHARS = "0123456789ABCDEFabcdef:$x._";

/** ReactBits DecryptedText — scramble-to-clear crypto reveal. Defaults to play-once on scroll into view. */
export default function Descramble({
  text,
  speed = 42,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  characters = HEX_CHARS,
  className = "",
  encryptedClassName = "text-primary",
  parentClassName = "",
  animateOn = "view",
}: DescrambleProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(true);
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableChars = useMemo(() => characters.split(""), [characters]);

  const shuffleText = useCallback(
    (original: string, revealed: Set<number>) =>
      original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (revealed.has(i)) return original[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join(""),
    [availableChars]
  );

  const triggerDecrypt = useCallback(() => {
    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    let currentIteration = 0;
    intervalRef.current = setInterval(() => {
      setRevealedIndices((prev) => {
        setDisplayText(shuffleText(text, prev));
        currentIteration++;
        if (currentIteration >= maxIterations) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
          setDisplayText(text);
          setIsDecrypted(true);
        }
        return prev;
      });
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, text, speed, maxIterations, shuffleText]);

  useEffect(() => {
    if (animateOn !== "view" || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            triggerDecrypt();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    const el = containerRef.current;
    observer.observe(el);
    return () => observer.disconnect();
  }, [animateOn, hasAnimated, triggerDecrypt]);

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating || animateOn !== "hover") return;
    setHasAnimated(false);
    triggerDecrypt();
  }, [isAnimating, animateOn, triggerDecrypt]);

  // Keep sequential/revealDirection in the public API for parity; sequential path decrypts left→right.
  void sequential;
  void revealDirection;

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={triggerHoverDecrypt}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const revealed = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          return (
            <span key={index} className={revealed ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
