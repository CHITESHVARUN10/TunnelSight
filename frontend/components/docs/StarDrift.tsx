"use client";

import { useEffect, useRef } from "react";

interface DriftStar {
  x: number;
  y: number;
  r: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  drift: number; // vertical drift speed
  par: number; // cursor-parallax factor
}

/* Page-ambient star layer for /docs: fixed, very dim, weighted toward the
   left/right gutters so the reading column stays quiet. Slow drift, faint
   twinkle, whisper of cursor parallax. The hero spiral (ConstellationCanvas)
   carries the cinematic moment; this carries continuity. */
export function StarDrift({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    let W = 0;
    let H = 0;
    let stars: DriftStar[] = [];

    const PALETTE = ["255, 255, 255", "247, 244, 238", "238, 225, 202", "212, 190, 150"];

    const build = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(110, Math.floor((W * H) / 16000));
      stars = [];
      for (let i = 0; i < count; i++) {
        // Gutter weighting: reject-center sampling keeps the reading column clear
        let x = Math.random() * W;
        const centerBand = Math.abs(x - W / 2) < Math.min(360, W * 0.22);
        if (centerBand && Math.random() < 0.72) {
          x = Math.random() < 0.5 ? Math.random() * W * 0.18 : W * 0.82 + Math.random() * W * 0.18;
        }
        stars.push({
          x,
          y: Math.random() * H,
          r: 0.4 + 1.1 * Math.pow(Math.random(), 2.4),
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 0.07 + Math.random() * 0.15,
          twinkleSpeed: 0.004 + Math.random() * 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          drift: 0.008 + Math.random() * 0.03,
          par: 4 + Math.random() * 10,
        });
      }
    };
    build();

    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / Math.max(1, window.innerWidth);
      mouse.y = e.clientY / Math.max(1, window.innerHeight);
    };

    let tick = Math.floor(Math.random() * 1000);
    let raf = 0;

    const frame = () => {
      tick++;
      ctx.clearRect(0, 0, W, H);
      mouse.sx += (mouse.x - mouse.sx) * 0.04;
      mouse.sy += (mouse.y - mouse.sy) * 0.04;
      const px = (mouse.sx - 0.5) * 2;
      const py = (mouse.sy - 0.5) * 2;
      for (const s of stars) {
        if (!reduced) {
          s.y -= s.drift;
          if (s.y < -4) s.y = H + 4;
        }
        const tw = Math.sin(tick * s.twinkleSpeed + s.twinklePhase);
        const a = Math.max(0.03, s.alpha + tw * 0.06);
        ctx.beginPath();
        ctx.arc(s.x - px * s.par, s.y - py * s.par, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${a.toFixed(3)})`;
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      build();
      if (reduced) frame();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}

export default StarDrift;
