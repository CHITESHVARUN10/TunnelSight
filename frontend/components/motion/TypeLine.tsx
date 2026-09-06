"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TypeLineProps = {
  text: string | string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  initialDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  startOnVisible?: boolean;
};

/** ReactBits TextType — terminal typing loop. GSAP cursor blink replaced with a CSS blink. */
export default function TypeLine({
  text,
  className = "",
  typingSpeed = 42,
  deletingSpeed = 22,
  pauseDuration = 2200,
  initialDelay = 400,
  loop = true,
  showCursor = true,
  cursorCharacter = "▊",
  cursorClassName = "text-primary",
  startOnVisible = true,
}: TypeLineProps) {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const containerRef = useRef<HTMLSpanElement>(null);

  const getRandomSpeed = useCallback(
    () => typingSpeed * (0.6 + Math.random() * 0.9),
    [typingSpeed]
  );

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let timeout: ReturnType<typeof setTimeout>;
    const current = textArray[textIndex];

    if (isDeleting) {
      if (displayed === "") {
        setIsDeleting(false);
        if (textIndex === textArray.length - 1 && !loop) return;
        setTextIndex((prev) => (prev + 1) % textArray.length);
        setCharIndex(0);
        timeout = setTimeout(() => {}, pauseDuration);
      } else {
        timeout = setTimeout(() => setDisplayed((prev) => prev.slice(0, -1)), deletingSpeed);
      }
    } else if (charIndex < current.length) {
      timeout = setTimeout(
        () => {
          setDisplayed((prev) => prev + current[charIndex]);
          setCharIndex((prev) => prev + 1);
        },
        charIndex === 0 && displayed === "" ? initialDelay : getRandomSpeed()
      );
    } else {
      if (!loop && textIndex === textArray.length - 1) return;
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    }
    return () => clearTimeout(timeout);
  }, [
    charIndex,
    displayed,
    isDeleting,
    textArray,
    textIndex,
    loop,
    pauseDuration,
    deletingSpeed,
    initialDelay,
    isVisible,
    getRandomSpeed,
  ]);

  return (
    <span ref={containerRef} className={`inline-block whitespace-pre-wrap ${className}`}>
      <span className="inline">{displayed}</span>
      {showCursor && (
        <span className={`cursor-blink ml-0.5 inline-block ${cursorClassName}`} aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}
