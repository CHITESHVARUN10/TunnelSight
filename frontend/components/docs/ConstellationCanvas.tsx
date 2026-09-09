"use client";

import { useEffect, useRef, type CSSProperties, type MutableRefObject } from "react";

interface Star {
  // spiral state
  armRatio: number;
  angleOffset: number;
  radialScatter: number;
  depth: number;
  // gutter state (fixed viewport slots for the whole page)
  gx: number;
  gy: number;
  driftSpeed: number;
  driftPhase: number;
  // core cluster stars ignore the spiral and sit at center
  core: boolean;
  coreX: number;
  coreY: number;
  dust: boolean;
  dustX: number;
  dustY: number;
  x: number;
  y: number;
  // Cursor displacement from home — smoothed toward a target while the
  // cursor is near, decaying monotonically once it leaves (no velocity
  // state, so overshoot/bounce is impossible by construction)
  ox: number;
  oy: number;
  hero: boolean;
  baseRadius: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  twinkleAmp: number;
  // Assembly personality: personal low-pass rate toward the scroll target
  // (core lands first, outer dust streams in last) + current eased value
  settle: number;
  dd: number;
}

/* Fixed full-viewport galaxy for /docs with a scroll state-machine.
   disperseRef 0 → centered face-on spiral disc (slow rotation).
   disperseRef → 1 → formation migrates into fixed left/right gutter
   constellations that persist for the whole page; gutter stars drift
   vertically and breathe instead of rotating. Scrolling back up reforms
   the spiral. Cursor physics is disrupt-and-reform: the pointer pushes
   stars off their homes via a smoothed displacement offset that decays
   monotonically once the cursor leaves — never velocity, never bounce.
   Brightness comes from star density plus one core glow sprite; no
   per-star glow discs anywhere. */
export function ConstellationCanvas({
  className = "",
  style,
  disperseRef,
}: {
  className?: string;
  style?: CSSProperties;
  disperseRef?: MutableRefObject<number>;
}) {
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
    const measure = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    measure();

    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    const ARM_COUNT = 3;
    let stars: Star[] = [];
    let heroCount = 0;

    // Fixed seed so the formation reads centered every load — no random
    // right-side clump. Rotation drifts RIGIDLY and very slowly (same rate
    // for every star): the arms turn as one solid wheel, so the shape and
    // its brightness balance can never shear into an off-center smear no
    // matter how long you stare. Twinkle, breathing, cursor and scroll
    // give it further life; the shape itself only stately turns.
    // (Declared before build(): seeds bake this angle in.)
    let rotation = -0.6;
    const ROTATION_RATE = 0.00004;

    // ---- Glow sprite sheet (research-backed fast path) ----
    // Each star look is painted ONCE into a small offscreen canvas; every
    // frame is then just drawImage pixel-copies — an order of magnitude
    // cheaper than per-star createRadialGradient/arc calls. One sprite per
    // palette color plus a tight white hot-core dot.
    const SPRITE_PX = 64;
    const makeGlowSprite = (rgb: string) => {
      const c = document.createElement("canvas");
      c.width = SPRITE_PX;
      c.height = SPRITE_PX;
      const g = c.getContext("2d");
      if (!g) return c;
      const grad = g.createRadialGradient(
        SPRITE_PX / 2, SPRITE_PX / 2, 0,
        SPRITE_PX / 2, SPRITE_PX / 2, SPRITE_PX / 2,
      );
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.22, `rgba(${rgb},0.65)`);
      grad.addColorStop(0.5, `rgba(${rgb},0.18)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
      return c;
    };
    const dotSprite = (() => {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 32;
      const g = c.getContext("2d");
      if (!g) return c;
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(255,255,255,0.7)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
      return c;
    })();
    const spriteCache = new Map<string, HTMLCanvasElement>();
    const spriteFor = (rgb: string) => {
      let s = spriteCache.get(rgb);
      if (!s) {
        s = makeGlowSprite(rgb);
        spriteCache.set(rgb, s);
      }
      return s;
    };

    // Single source of truth for the formation center: the hero headline's
    // optical center while visible, viewport fallback otherwise. Used
    // identically at seed time and every frame, so the disc cannot drift.
    // GALAXY_SHIFT_X nudges the whole constellation sideways as a fraction
    // of viewport width (negative = left). Small left bias by design.
    const GALAXY_SHIFT_X = -0.1;
    const anchor = () => {
      let ax = W / 2 + W * GALAXY_SHIFT_X;
      let ay = H * 0.4;
      const hl = document.getElementById("docs-headline");
      if (hl) {
        const r = hl.getBoundingClientRect();
        if (r.bottom > 0 && r.top < H && r.width > 0) {
          ax = r.left + r.width / 2 + W * GALAXY_SHIFT_X;
          ay = r.top + r.height / 2;
        }
      }
      ax = Math.max(W * 0.3, Math.min(W * 0.6, ax));
      ay = Math.max(80, Math.min(H * 0.62, ay));
      return { ax, ay };
    };
    // Face-on disc radius: fits the hero with arms peeking around the text
    const discR = () => Math.min(Math.min(W, H) * 0.44, W * 0.32, 420);

    // Per-arm bright-star budgets — dealt evenly so visual mass cannot
    // clump on one arm no matter how Math.random falls.
    let brightPerArm = [0, 0, 0];

    const build = () => {
      const count = Math.max(500, Math.min(1100, Math.floor((W * H) / 1800)));
      const { ax, ay } = anchor();
      const R = discR();
      const minDim = Math.min(W, H);
      stars = [];
      heroCount = 0;
      brightPerArm = [0, 0, 0];
      let left = true;
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const core = roll < 0.13;
        const dust = !core && roll > 0.7;
        const arm = i % ARM_COUNT;
        let armRatio = Math.pow(Math.random(), 1.1);
        const depth = 0.3 + Math.random() * 0.7;
        // w2 formation geometry (the good one): smooth size ramp, wide
        // symmetric arm jitter, slight vertical squash for the tilted look
        let baseRadius = core
          ? 0.6 + 1.2 * Math.random()
          : dust
            ? 0.3 + 0.7 * Math.pow(Math.random(), 2)
            : 0.6 + 2.4 * Math.pow(Math.random(), 2.5);
        // Brightness balance: a bright knot is only admitted if its arm is
        // not already ahead of the dimmest arm — forces even visual mass.
        const wantsBright = !core && !dust && baseRadius > 1.8;
        if (wantsBright) {
          const minBright = Math.min(...brightPerArm);
          if (brightPerArm[arm] > minBright + 1) {
            baseRadius = 0.9 + Math.random() * 0.7; // demote to mid grain
          } else {
            brightPerArm[arm]++;
          }
        }
        // Heroes at 45°-separated symmetric angles with matched radii, so
        // the eight sparkles ring the disc instead of clustering.
        let angleOffset = arm * ((Math.PI * 2) / ARM_COUNT);
        let hero =
          !core &&
          !dust &&
          baseRadius > 2.3 &&
          armRatio > 0.3 &&
          armRatio < 0.7 &&
          heroCount < 8;
        if (hero) {
          angleOffset = heroCount * (Math.PI / 4) + 0.35;
          armRatio = 0.38 + (heroCount % 2) * 0.18;
          heroCount++;
        }

        // Gutter slots mirrored around the ANCHOR (not the viewport), so
        // both sides travel the same distance and land in symmetric bands.
        // The old absolute 2-13% / 87-98% bands sent right-bound stars on a
        // far longer journey once the formation shifted left.
        left = !left;
        const side = left ? -1 : 1;
        const gx = Math.max(
          W * 0.02,
          Math.min(W * 0.98, ax + side * W * (0.3 + Math.random() * 0.08)),
        );
        const theta = armRatio * Math.PI * 2.6 + angleOffset + rotation;
        const dist = armRatio * minDim * 0.46;
        const gy = Math.random() * H;

        // Cool-majority palette pushed toward white; ember rare on arms only
        const r = Math.random();
        const color =
          !dust && !core && r > 0.965
            ? "217, 119, 87"
            : r < 0.4
              ? "235, 242, 255"
              : r < 0.65
                ? "214, 228, 255"
                : r < 0.82
                  ? "247, 244, 238"
                  : r < 0.95
                    ? "238, 225, 202"
                    : "232, 205, 160";

        stars.push({
          armRatio,
          angleOffset,
          // w2 arm width: loose enough to read as a spiral band
          radialScatter: (Math.random() - 0.5) * 16 * (armRatio * 0.7 + 0.3),
          depth,
          gx,
          gy,
          driftSpeed: 0.05 + Math.random() * 0.12,
          driftPhase: Math.random() * H,
          core,
          coreX: gauss() * minDim * 0.055,
          coreY: gauss() * minDim * 0.045,
          dust,
          dustX: Math.random() * W,
          dustY: Math.random() * H,
          // Astra assembly: born dispersed (gutters / dust field), streams
          // to the formation via settle→dd→de. Reduced-motion stays
          // assembled (single frame, no travel).
          x: reduced
            ? ax + Math.cos(theta) * dist
            : core
              ? ax + gauss() * minDim * 0.055 * 7
              : dust
                ? Math.random() * W
                : gx,
          y: reduced
            ? ay + Math.sin(theta) * dist * 0.58
            : core
              ? ay + gauss() * minDim * 0.045 * 7
              : dust
                ? Math.random() * H
                : gy,
          ox: 0,
          oy: 0,
          hero,
          baseRadius,
          color,
          alpha: core
            ? 0.8 + Math.random() * 0.2
            : dust
              ? 0.16 + Math.random() * 0.16
              : Math.max(
                  0.5,
                  (0.55 + Math.random() * 0.45) *
                    (0.65 + depth * 0.35) *
                    (0.7 + armRatio * 0.5),
                ),
          twinkleSpeed: 0.003 + Math.random() * 0.009,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleAmp: baseRadius < 0.9 ? 0.15 : 0.13,
          // Core snaps home in ~1s, arms stream in behind, outer dust
          // lands last (~3s) — the staggered Astra assembly, not a block
          settle: core
            ? 0.05 + Math.random() * 0.02
            : dust
              ? 0.018 + Math.random() * 0.01
              : 0.03 + Math.random() * 0.015,
          dd: reduced ? 0 : 1,
        });
      }
      // BRIGHTNESS-weighted centroid: the eye follows light, not the mean.
      // Weight ≈ luminosity (alpha × radius²). Gate <2% on both axes.
      if (stars.length > 0) {
        let mx = 0;
        let my = 0;
        let wsum = 0;
        for (const s of stars) {
          if (s.dust) continue;
          const w = s.alpha * s.baseRadius * s.baseRadius;
          mx += s.x * w;
          my += s.y * w;
          wsum += w;
        }
        if (wsum > 0) {
          const dxPct = (((mx / wsum - ax) / W) * 100).toFixed(2);
          const dyPct = (((my / wsum - ay) / H) * 100).toFixed(2);
          console.debug(`[galaxy] light-centroid offset: x ${dxPct}% / y ${dyPct}% (anchor ${Math.round(ax)},${Math.round(ay)})`);
        }
      }
    };
    build();

    // Disrupt-and-reform cursor: the pointer sets a displacement TARGET per
    // star (position, never velocity); each frame the offset eases toward
    // its target and the target itself is zero once the cursor leaves, so
    // the return is a monotonic decay — reform, not bounce. Smoothed cursor
    // + frame-decayed speed make slow hovers dent and fast flicks ripple
    // with identical code everywhere on the canvas (no dead zones).
    const mouse = {
      x: -9999,
      y: -9999,
      sx: -9999,
      sy: -9999,
      speed: 0,
      active: false,
    };
    const RADIUS = 230;

    const feed = (cx: number, cy: number) => {
      const px = mouse.x === -9999 ? cx : mouse.x;
      const py = mouse.y === -9999 ? cy : mouse.y;
      const inst = Math.hypot(cx - px, cy - py);
      mouse.x = cx;
      mouse.y = cy;
      // Smoothed speed drives the transient ripple scale; capped
      mouse.speed = Math.min(40, mouse.speed * 0.7 + inst * 0.3);
      if (!mouse.active) {
        mouse.sx = cx;
        mouse.sy = cy;
      }
      mouse.active = true;
    };
    const onMove = (e: MouseEvent) => feed(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      feed(t.clientX, t.clientY);
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.speed = 0;
    };

    let tick = Math.floor(Math.random() * 1000);
    let raf = 0;

    const frame = () => {
      tick++;
      const target = disperseRef ? disperseRef.current : 0;
      if (!reduced) rotation += ROTATION_RATE * (1 - target); // rigid turn; rests in gutter mode
      ctx.clearRect(0, 0, W, H);

      // Same anchor the seeds used — the disc cannot wander
      const { ax: cx, ay: cy } = anchor();
      const R = discR();
      const minDim = Math.min(W, H);

      if (mouse.active) {
        mouse.sx += (mouse.x - mouse.sx) * 0.35;
        mouse.sy += (mouse.y - mouse.sy) * 0.35;
        mouse.speed *= 0.92;
      }

      // Astra heart: one cheap glow sprite behind the core stars, plus a
      // tight white clip for the g042-style core blowout. drawImage-free
      // gradients here run once per frame total, not per star.
      if (target < 0.9) {
        const gr = R * 0.68;
        const glowA = 0.24 * (1 - target);
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
        glow.addColorStop(0, `rgba(200, 214, 255,${glowA.toFixed(3)})`);
        glow.addColorStop(0.4, `rgba(170, 190, 255,${(glowA * 0.4).toFixed(3)})`);
        glow.addColorStop(1, "rgba(170, 190, 255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(cx - gr, cy - gr, gr * 2, gr * 2);
        const gr2 = R * 0.28;
        const glowA2 = 0.1 * (1 - target);
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr2);
        core.addColorStop(0, `rgba(255, 255, 255,${glowA2.toFixed(3)})`);
        core.addColorStop(1, "rgba(255, 255, 255,0)");
        ctx.fillStyle = core;
        ctx.fillRect(cx - gr2, cy - gr2, gr2 * 2, gr2 * 2);
      }

      // Tracks the current composite op so we only switch when needed
      let compMode = "source-over";
      // Legible-first guard: soften the void directly behind the headline
      // so hover voids don't punch the text out. Cached per frame.
      let hlL = 0;
      let hlR = 0;
      let hlT = 0;
      let hlB = 0;
      const hlEl = document.getElementById("docs-headline");
      if (hlEl) {
        const hr = hlEl.getBoundingClientRect();
        if (hr.width > 0 && hr.bottom > 0 && hr.top < H) {
          hlL = hr.left;
          hlR = hr.right;
          hlT = hr.top;
          hlB = hr.bottom;
        }
      }
      for (const p of stars) {
        // Personal chase toward the scroll target at the star's own rate,
        // then smoothstep easing: slow departure, decisive arrival. Every
        // star flies its own path on its own schedule — a stream, not a
        // block. Core ~1s, arms ~2s, dust ~3s on scroll-up reform.
        p.dd += (target - p.dd) * p.settle;
        const de = p.dd * p.dd * (3 - 2 * p.dd);
        let tx: number;
        let ty: number;
        if (p.core) {
          // Core cluster rides the center, then dissolves outward with the break
          const spread = 1 + de * 6;
          tx = cx + p.coreX * spread;
          ty = cy + p.coreY * spread;
        } else if (p.dust) {
          tx = p.dustX;
          ty = p.dustY;
        } else {
          const theta = p.armRatio * Math.PI * 2.6 + p.angleOffset + rotation;
          // w2 tilted-spiral geometry
          const dist = p.armRatio * minDim * 0.46 + p.radialScatter;
          const sx = cx + Math.cos(theta) * dist;
          const sy = cy + Math.sin(theta) * dist * 0.58;
          // Gutter slot with slow vertical drift (wraps) once dispersed
          const drift = (((tick * p.driftSpeed + p.driftPhase) % (H + 80)) + H + 80) % (H + 80) - 40;
          tx = sx + (p.gx - sx) * de;
          ty = sy + (p.gy + (drift - p.gy) * de - sy) * de;
        }
        // Disrupt-and-reform: ease the offset toward its target. Target is
        // nonzero only while the cursor is near; otherwise it is exactly
        // zero, so the star glides home with no overshoot, ever.
        // flare tracks the same proximity: stars near the cursor don't just
        // part, they brighten — then relax back with the return.
        let flare = 0;
        if (mouse.active) {
          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.01) {
            // Astra feather: smoothstep^1 — hard void near the cursor,
            // soft scatter to the rim. Exactly zero at the rim.
            const fall = 1 - dist / RADIUS;
            const feather = fall * fall * (3 - 2 * fall);
            flare = feather;
            const ripple = 1 + Math.min(1, mouse.speed / 24) * 0.3;
            let depthScale = p.dust ? 0.4 : 0.35 + p.depth * 0.65;
            // Astra color behavior: blue dust throws farthest, dense white
            // cores persist.
            if (p.dust || p.color === "214, 228, 255" || p.color === "235, 242, 255") {
              depthScale *= 1.3;
            } else if (p.core || p.baseRadius > 1.8) {
              depthScale *= 0.7;
            }
            let strength = 70 * depthScale * ripple;
            // Legible-first: halve the push behind the headline.
            if (tx > hlL && tx < hlR && ty > hlT && ty < hlB) {
              strength *= 0.45;
            }
            const tOx = (dx / dist) * strength * feather;
            const tOy = (dy / dist) * strength * feather;
            p.ox += (tOx - p.ox) * 0.38;
            p.oy += (tOy - p.oy) * 0.38;
          } else {
            p.ox *= 0.965;
            p.oy *= 0.965;
          }
        } else {
          p.ox *= 0.965;
          p.oy *= 0.965;
        }

        // Home tracked exactly — rotation drift never lags or sloshes
        p.x = tx + p.ox;
        p.y = ty + p.oy;

        const tw = Math.sin(tick * p.twinkleSpeed + p.twinklePhase);
        // Gutter breathing: slow alpha swell distinct from twinkle
        const breathe = de > 0.01 && !p.dust ? 1 + 0.22 * de * Math.sin(tick * 0.008 + p.driftPhase) : 1;
        const a = Math.max(0.03, (p.alpha + tw * p.twinkleAmp) * breathe * (1 + 0.28 * flare));
        const r = Math.max(0.3, p.baseRadius + tw * 0.1);

        // Every star glows: blit its pre-rendered glow sprite, sized by the
        // star's own radius so brightness varies star to star. Brighter
        // stars composite additively (Astra bloom); faint dust stays
        // source-over so the navy never goes milky.
        const bright = p.hero || p.baseRadius > 1.4;
        if (bright && compMode !== "lighter") {
          ctx.globalCompositeOperation = "lighter";
          compMode = "lighter";
        } else if (!bright && compMode !== "source-over") {
          ctx.globalCompositeOperation = "source-over";
          compMode = "source-over";
        }
        const glowSize = r * 7 * (1 + 0.15 * flare);
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(spriteFor(p.color), p.x - glowSize / 2, p.y - glowSize / 2, glowSize, glowSize);
        // Hot core dot on brighter stars — the white sparkle pop
        if (p.baseRadius > 1.1 || p.hero) {
          const dotSize = r * 2.2;
          ctx.drawImage(dotSprite, p.x - dotSize / 2, p.y - dotSize / 2, dotSize, dotSize);
        }
        ctx.globalAlpha = 1;

        if (p.hero) {
          // Cross sparkle, heroes only
          const L = r * 7;
          ctx.strokeStyle = `rgba(${p.color},${(a * 0.7).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - L, p.y);
          ctx.lineTo(p.x + L, p.y);
          ctx.moveTo(p.x, p.y - L);
          ctx.lineTo(p.x, p.y + L);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      measure();
      build();
      if (reduced) frame();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", () => {
      mouse.active = mouse.x !== -9999;
    });
    window.addEventListener("blur", onLeave);
    window.addEventListener("resize", onResize);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [disperseRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export default ConstellationCanvas;
