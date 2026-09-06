"use client";

import { useRef, useState, type ReactNode, type MouseEventHandler } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

/** ReactBits SpotlightCard — cursor-tracking teal glow. Theme default keeps Stitch surfaces. */
export default function GlowCard({
  children,
  className = "",
  spotlightColor = "rgba(94, 234, 212, 0.16)",
}: GlowCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -400, y: -400 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
