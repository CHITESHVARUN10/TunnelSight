"use client";

import { useEffect, useRef } from "react";

interface SpiralStar {
  arm: number;
  armRatio: number; // position along spiral arm (0 to 1)
  baseRadius: number;
  radius: number;
  angleOffset: number;
  radialScatter: number;
  z: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface AmbientStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export function ConstellationCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse
    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      prevX: -1000,
      prevY: -1000,
      radius: 170,
      active: false,
    };

    // OpenAI Astra & Anthropic Celestial Palette (Zero Cyan, Zero Blue)
    const STAR_PALETTE = [
      "rgba(255, 255, 255, ",     // Pure Starlight White
      "rgba(247, 244, 238, ",     // Warm Ivory
      "rgba(238, 225, 202, ",     // Golden Starlight
      "rgba(217, 119, 87, ",      // Anthropic Terracotta Ember
      "rgba(212, 190, 150, ",     // Soft Sand
    ];

    // Build Astra Rotating Spiral Galaxy
    const ARM_COUNT = 3;
    const GALAXY_STAR_COUNT = Math.min(180, Math.floor((width * height) / 9500));
    const spiralStars: SpiralStar[] = [];

    for (let i = 0; i < GALAXY_STAR_COUNT; i++) {
      const arm = i % ARM_COUNT;
      const armRatio = Math.pow(Math.random(), 1.4); // Denser toward center
      const angleOffset = (arm * (Math.PI * 2)) / ARM_COUNT;
      const radialScatter = (Math.random() - 0.5) * 45 * (armRatio + 0.2);
      const z = Math.random() * 0.8 + 0.5;

      const initialDist = armRatio * Math.min(width, height) * 0.42;
      const initialTheta = armRatio * Math.PI * 2.8 + angleOffset;
      const initX = width / 2 + Math.cos(initialTheta) * initialDist;
      const initY = Math.min(height * 0.42, 380) + Math.sin(initialTheta) * (initialDist * 0.65);

      spiralStars.push({
        arm,
        armRatio,
        baseRadius: Math.random() * 1.6 + 0.6,
        radius: initialDist,
        angleOffset,
        radialScatter,
        z,
        x: initX,
        y: initY,
        vx: 0,
        vy: 0,
        color: STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)],
        alpha: Math.random() * 0.55 + 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Ambient background drifting stars
    const AMBIENT_COUNT = Math.min(65, Math.floor((width * height) / 22000));
    const ambientStars: AmbientStar[] = [];
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambientStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.2 + 0.4,
        color: STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)],
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (mouse.prevX > 0) {
        mouse.vx = currentX - mouse.prevX;
        mouse.vy = currentY - mouse.prevY;
      }
      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let rotationAngle = 0;
    let tick = 0;

    const render = () => {
      tick++;
      rotationAngle += 0.0018; // Majestic slow cosmic rotation
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = Math.min(height * 0.38, 360); // Centered around hero title

      // Subtle Galactic Core Glow
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 240);
      coreGrad.addColorStop(0, "rgba(247, 244, 238, 0.045)");
      coreGrad.addColorStop(0.4, "rgba(217, 119, 87, 0.02)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 240, 0, Math.PI * 2);
      ctx.fill();

      // Render Ambient Background Stars
      for (let i = 0; i < ambientStars.length; i++) {
        const s = ambientStars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        const pulse = Math.sin(tick * s.pulseSpeed + s.pulseOffset);
        const currentAlpha = Math.max(0.08, s.alpha + pulse * 0.1);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.fill();
      }

      // Render Spiral Galaxy Stars with Cursor Interaction & Spring-Back Orbit
      for (let i = 0; i < spiralStars.length; i++) {
        const p = spiralStars[i];

        // Theoretical Equilibrium Orbit along logarithmic spiral arm
        const theta = p.armRatio * Math.PI * 2.6 + p.angleOffset + rotationAngle;
        const dist = p.armRatio * Math.min(width, height) * 0.44 + p.radialScatter;
        const targetX = centerX + Math.cos(theta) * dist;
        // Compress Y slightly to create 3D galactic disk inclination (like Astra's angle)
        const targetY = centerY + Math.sin(theta) * (dist * 0.58);

        // Spring force toward orbital equilibrium
        const springK = 0.025;
        const damping = 0.88;
        const ax = (targetX - p.x) * springK;
        const ay = (targetY - p.y) * springK;

        p.vx = (p.vx + ax) * damping;
        p.vy = (p.vy + ay) * damping;

        // Mouse Repulsion & Dispersion Physics
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const mDist = Math.sqrt(dx * dx + dy * dy);

          if (mDist < mouse.radius && mDist > 0) {
            const force = (1 - mDist / mouse.radius) * 2.8;
            p.vx -= (dx / mDist) * force;
            p.vy -= (dy / mDist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Pulse and radius
        const pulse = Math.sin(tick * p.pulseSpeed + p.pulseOffset);
        const radius = Math.max(0.6, p.baseRadius + pulse * 0.4);
        const currentAlpha = Math.max(0.12, p.alpha + pulse * 0.18);

        // Star core
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();

        // Starlight bloom for brighter stars
        if (p.baseRadius > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentAlpha * 0.15})`;
          ctx.fill();
        }

        // Connect Constellation Lines Between Arm Neighbors
        for (let j = i + 1; j < Math.min(i + 7, spiralStars.length); j++) {
          const p2 = spiralStars[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);

          const maxDist = 70;
          if (cDist < maxDist) {
            const lineAlpha = (1 - cDist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(247, 244, 238, ${lineAlpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor when close with warm starlight filament
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 120) {
            const filamentAlpha = (1 - mDist / 120) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(217, 119, 87, ${filamentAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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

export default ConstellationCanvas;
