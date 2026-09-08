"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/motion/Reveal";
import Descramble from "@/components/motion/Descramble";
import TypeLine from "@/components/motion/TypeLine";
import Stat from "@/components/motion/Stat";
import ScrollStory from "@/components/motion/ScrollStory";
import { LineReveal } from "@/components/motion/Parallax";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/lib/theme";
import { Footer } from "@/components/layout/Footer";

const HeroBg = dynamic(() => import("@/components/motion/HeroBg"), { ssr: false });

const PACKET_ROWS = [
  {
    time: "14:02:19.412",
    src: "192.0.2.14:500",
    proto: "IKEv2 SA_INIT",
    protoClass: "text-primary font-medium",
    payload: "HDR, SAi1, KEi, Ni (Group 2 selected)",
    prov: "CONFIRMED",
    provClass: "text-tertiary",
    stripe: true,
  },
  {
    time: "14:02:19.428",
    src: "198.51.100.8:500",
    proto: "IKEv2 SA_INIT",
    protoClass: "text-primary font-medium",
    payload: "HDR, SAr1, KEr, Nr, CERTREQ",
    prov: "CONFIRMED",
    provClass: "text-tertiary",
    stripe: false,
  },
  {
    time: "14:02:19.489",
    src: "192.0.2.14:4500",
    proto: "IKEv2 SA_AUTH",
    protoClass: "text-primary font-medium",
    payload: "HDR, SK {IDi, AUTH, SA2, TSi, TSr}",
    prov: "CONFIRMED",
    provClass: "text-tertiary",
    stripe: true,
  },
  {
    time: "14:02:19.510",
    src: "192.0.2.14:4500",
    proto: "ESP (50)",
    protoClass: "text-secondary font-medium",
    payload: "SPI: 0x9a021da3 · Len: 1420b · Continuous Burst",
    prov: "INFERRED",
    provClass: "text-secondary",
    stripe: false,
    live: true,
  },
];

const CONFORMANCE = [
  "RFC 7296 (IKEv2)",
  "RFC 8247",
  "NIST SP 800-77r1",
  "CNSA 1.0",
  "PCI-DSS 4.0 §4.2",
  "DPDK zero-copy ingest",
];

export default function LandingPage() {
  const router = useRouter();
  const [theme] = useTheme();
  const light = theme === "light";
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  /* Layered hero parallax: grid drifts slowest (far), aurora mid,
     product card rises against the scroll (near). Transform-only. */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yFar = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 190]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const goAnalyze = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/analyze");
  };
  const previewRows = PACKET_ROWS.slice(0, 3);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <div className="landing-grain" aria-hidden="true" />
      <header className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${scrolled ? "bg-surface/85 backdrop-blur-md border-hairline" : "bg-transparent border-transparent"}`}>
        <div className="h-header-height max-w-6xl mx-auto px-space-base flex items-center justify-between">
          <div className="flex items-center gap-space-lg">
            <Link className="flex items-center gap-space-xs group" href="/overview">
              <span className="w-2.5 h-2.5 bg-primary rounded-DEFAULT shadow-logo"></span>
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">TunnelSight</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-normal">/ IPsecXray</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-lg" data-active-classes="text-primary font-headline-sm">
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "capabilities")}>Capabilities</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "evidence-model")}>Evidence Model</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "workbench-preview")}>Preview</Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Documentation</Link>
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <ThemeToggle variant="inline" />
            <Link className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-on-surface px-space-sm py-space-xs transition-colors" href="/login">Sign In</Link>
            <Link href="#" onClick={goAnalyze} className="inline-flex items-center justify-center bg-primary hover:bg-teal-bright text-on-primary font-semibold text-[13px] px-4 py-2 rounded transition-colors">
              Analyze a capture
            </Link>
          </div>
        </div>
      </header>

      {/* ============ HERO — layered, lit, parallax ============ */}
      <div ref={heroRef} className="relative">
        <section className="relative overflow-hidden">
          {/* far layer: survey grid, drifts slowest */}
          <motion.div style={{ y: yFar }} className="absolute inset-0 will-change-transform" aria-hidden="true">
            <div className="absolute inset-0 technical-grid opacity-70" />
          </motion.div>
          {/* mid layer: teal aurora wash + crown light */}
          <motion.div style={{ y: yMid }} className="absolute inset-0 will-change-transform" aria-hidden="true">
            <HeroBg
              key={theme}
              amplitude={light ? 0.5 : 0.9}
              blend={0.55}
              speed={0.5}
              className="hero-aurora"
              colorStops={light ? ["#00a896", "#00796c", "#cfe9e2"] : undefined}
            />
            <div className="absolute inset-0 landing-beam" />
          </motion.div>
          {/* near layer: vignette + fade into the page body */}
          <div className="absolute inset-0 landing-vignette pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-surface pointer-events-none" aria-hidden="true" />

          <motion.div style={{ opacity: heroFade }} className="relative max-w-6xl mx-auto px-space-base pt-36 md:pt-44 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              {/* Editorial column */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center gap-space-sm font-code-sm text-code-sm">
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    LIVE DISSECTION — edge-gw-04 · 1,482,091 packets
                  </span>
                  <span className="text-outline">/</span>
                  <span className="text-on-surface-variant uppercase tracking-widest">RFC 7296 · CNSA 1.0</span>
                </div>
                <h1 className="font-display-serif hero-display text-on-surface font-medium" style={{ fontSize: "clamp(3rem, 7vw, 5.25rem)" }}>
                  <LineReveal
                    items={[
                      "The encrypted tunnel,",
                      <>
                        held up to the <em className="italic text-primary">light.</em>
                      </>,
                    ]}
                  />
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed max-w-xl" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
                  TunnelSight reads IKEv2 handshakes frame by frame — cipher, DH group, SA lifetime —
                  and proves what is weak before anything is inferred. Packet #14 chose MODP-1024.
                  We can point at the bytes.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
                  <Link href="#" onClick={goAnalyze} aria-label="Analyze a Capture" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-teal-bright text-on-primary font-semibold text-[15px] px-7 py-3.5 rounded transition-colors">
                    <span>Analyze a capture</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest" href="#" onClick={(e) => scrollTo(e, "workbench-preview")}>
                    See the dissection ↓
                  </Link>
                </div>
                <p className="font-code-sm text-code-sm text-outline">Demo capture included · No account needed</p>
              </div>

              {/* Product column — tilted console, rises against scroll */}
              <motion.div style={{ y: cardY }} className="lg:col-span-5 perspective-1200 hidden lg:block will-change-transform relative">
                <div className="tilt-card preserve-3d relative rounded border border-hairline bg-surface-container-low/90 shadow-lift overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden="true" />
                  <div className="px-space-md py-2.5 flex items-center justify-between border-b border-hairline">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
                    </div>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">edge-gw-04-us-east.pcap</span>
                    <span className="font-code-sm text-code-sm text-tertiary">● LIVE</span>
                  </div>
                  <div className="p-space-md flex flex-col gap-space-md">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="font-code-sm text-code-sm text-outline uppercase tracking-widest">Posture</div>
                        <div className="font-display-serif text-error tabular" style={{ fontSize: "2.75rem", lineHeight: 1 }}>
                          <Stat to={47} suffix=" / 100" duration={2} />
                        </div>
                      </div>
                      <div className="text-right flex flex-col gap-1 items-end">
                        <span className="px-2 py-1 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold">NON-COMPLIANT</span>
                        <span className="font-code-sm text-code-sm text-outline">NIST SP 800-77r1</span>
                      </div>
                    </div>
                    <div className="hairline-t pt-space-sm flex flex-col gap-1">
                      <span className="font-code-sm text-code-sm text-error uppercase tracking-widest">P0 · Weak DH Group 2 (MODP-1024)</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">IKE_SA_INIT selected Transform ID 2 — RFC 8247 deprecated.</span>
                    </div>
                    <div className="flex flex-col divide-y divide-hairline font-code-sm text-code-sm border-t border-hairline">
                      {previewRows.map((row) => (
                        <div key={row.time} className="py-1.5 grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-3 text-outline">{row.time}</span>
                          <span className={`col-span-3 ${row.protoClass}`}>{row.proto}</span>
                          <span className="col-span-6 text-on-surface-variant truncate">{row.payload}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* floating evidence chip — forward plane beside the card, clear of the verdict */}
                <div className="absolute left-8 -bottom-4 rounded border border-primary/40 bg-surface-container-lowest/95 px-3 py-1.5 font-code-sm text-code-sm text-primary shadow-lift-sm whitespace-nowrap">
                  MODP-1024 · packet #14
                </div>
              </motion.div>
            </div>

            {/* Proof strip — hairline, tabular, no cards */}
            <div className="hairline-t mt-16 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-space-lg">
              <div className="flex flex-col gap-1">
                <span className="font-display-serif tabular text-on-surface" style={{ fontSize: "2rem", lineHeight: 1.1 }}>
                  <Stat to={1.48} suffix=" Gbps" />
                </span>
                <span className="font-code-sm text-code-sm text-outline uppercase tracking-widest">Wire-rate ingest · DPDK</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display-serif tabular text-on-surface" style={{ fontSize: "2rem", lineHeight: 1.1 }}>
                  <Stat to={1482091} />
                </span>
                <span className="font-code-sm text-code-sm text-outline uppercase tracking-widest">Packets dissected · frame by frame</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display-serif tabular text-error" style={{ fontSize: "2rem", lineHeight: 1.1 }}>
                  <Stat to={47} suffix=" / 100" />
                </span>
                <span className="font-code-sm text-code-sm text-outline uppercase tracking-widest">Demo posture · DH-2 confirmed</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* ============ CONFORMANCE — static hairline, no marquee ============ */}
      <section className="w-full border-y border-hairline bg-surface-container-lowest/60">
        <div className="max-w-6xl mx-auto px-space-base py-space-md flex flex-wrap items-center gap-x-space-md gap-y-2 font-code-sm text-code-sm">
          <span className="text-outline uppercase tracking-widest shrink-0">Conformance</span>
          {CONFORMANCE.map((s, i) => (
            <span key={s} className="flex items-center gap-space-md shrink-0">
              {i > 0 && <span className="text-outline/50" aria-hidden="true">·</span>}
              <span className={s === "DPDK zero-copy ingest" ? "text-primary" : "text-on-surface-variant"}>{s}</span>
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1.5 text-tertiary shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            KERNEL ENGINE v4.18.0-FIPS
          </span>
        </div>
      </section>

      {/* ============ CAPABILITIES — asymmetric bento, hairlines ============ */}
      <section className="w-full bg-surface py-space-3xl px-space-base" id="capabilities">
        <div className="max-w-6xl mx-auto flex flex-col gap-space-xl">
          <Reveal className="flex flex-col gap-space-sm max-w-2xl" distance={20} blur={false}>
            <span className="font-code-sm text-code-sm text-primary uppercase tracking-widest">Engine architecture</span>
            <h2 className="font-display-serif section-display text-on-surface font-medium" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Three layers. One verdict.
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed" style={{ fontSize: "1rem", lineHeight: 1.65 }}>
              For defensive engineers who read handshakes, not headlines. Deterministic protocol
              validation across every tunnel lifecycle — then, and only then, inference.
            </p>
          </Reveal>
          <Reveal distance={20} blur={false}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-px bg-hairline border border-hairline rounded overflow-hidden">
              {/* large cell */}
              <div className="md:col-span-4 bg-surface p-space-xl flex flex-col gap-space-md">
                <span className="font-code-sm text-code-sm text-outline">01</span>
                <h3 className="font-display-serif text-on-surface font-medium" style={{ fontSize: "1.75rem", lineHeight: 1.15 }}>IPsec visibility</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  IKE, ESP, VPN mode, cryptographic parameters, SA characteristics — key-exchange
                  transforms, PFS renegotiation health, replay-window posture, dissected live.
                </p>
                <div className="grid grid-cols-3 gap-space-md hairline-t pt-space-md font-code-sm text-code-sm">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-outline uppercase tracking-widest">IKEv2 SA matrix</span>
                    <span className="text-primary font-medium">DISSECTED</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-outline uppercase tracking-widest">ESP replay</span>
                    <span className="text-on-surface">64-bit ESN</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-outline uppercase tracking-widest">NAT-T · RFC 3948</span>
                    <span className="text-on-surface">Port 4500 UDP</span>
                  </div>
                </div>
              </div>
              {/* narrow cell */}
              <div className="md:col-span-2 bg-surface-container-low p-space-xl flex flex-col gap-space-md">
                <span className="font-code-sm text-code-sm text-outline">02</span>
                <h3 className="font-display-serif text-on-surface font-medium" style={{ fontSize: "1.5rem", lineHeight: 1.2 }}>Encrypted traffic intelligence</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Isolation-forest timing and dispersion analysis — without pretending to decrypt.
                  Every score carries feature provenance.
                </p>
                <div className="hairline-t pt-space-md font-code-sm text-code-sm text-on-surface-variant flex flex-col gap-1.5">
                  <div className="flex justify-between"><span>Cadence</span><span className="text-tertiary">STOCHASTIC</span></div>
                  <div className="flex justify-between"><span>Entropy</span><span className="text-on-surface">7.994 bits/byte</span></div>
                  <div className="flex justify-between"><span>Burst asymmetry</span><span className="text-on-surface">1.84× upload bias</span></div>
                </div>
              </div>
              {/* full-width horizontal cell */}
              <div className="md:col-span-6 bg-surface-container-lowest p-space-xl flex flex-col md:flex-row md:items-center gap-space-lg">
                <div className="flex flex-col gap-space-sm md:max-w-sm">
                  <span className="font-code-sm text-code-sm text-outline">03</span>
                  <h3 className="font-display-serif text-on-surface font-medium" style={{ fontSize: "1.5rem", lineHeight: 1.2 }}>Security assessment</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Captures become patches, briefings, and signed artifacts — prioritized, remediated, exportable.
                  </p>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-space-md font-code-sm text-code-sm">
                  <div className="flex flex-col gap-0.5 border-l border-hairline pl-space-md">
                    <span className="text-outline uppercase tracking-widest">Posture metric</span>
                    <span className="text-error font-medium">RFC 8247 GAP</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-hairline pl-space-md">
                    <span className="text-outline uppercase tracking-widest">Remediation</span>
                    <span className="text-on-surface">strongSwan / Cisco IOS</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-hairline pl-space-md">
                    <span className="text-outline uppercase tracking-widest">Audit export</span>
                    <span className="text-on-surface">Signed JSON / PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ EVIDENCE — sticky statement + hairline rows ============ */}
      <section className="w-full bg-surface-container-lowest py-space-3xl px-space-base relative overflow-hidden" id="evidence-model">
        <div className="absolute inset-0 technical-grid opacity-50" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" aria-hidden="true" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl relative">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 flex flex-col gap-space-sm">
              <span className="font-code-sm text-code-sm text-primary uppercase tracking-widest"><Descramble text="EVIDENCE ARCHITECTURE" /></span>
              <ScrollStory text="Evidence before inference." className="font-display-serif section-display text-on-surface font-medium" />
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed" style={{ lineHeight: 1.65 }}>
                Wire bytes and statistical guesses live on opposite sides of a wall. Reports cite
                only what the capture proves — the rest is labeled, bounded, and shown its limits.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col divide-y divide-hairline border-y border-hairline">
            <Reveal distance={16} blur={false}>
              <div className="py-space-lg flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-tertiary/10 text-tertiary">Confirmed</span>
                  <span className="font-code-sm text-code-sm text-outline">Deterministic wire data</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Frame-by-frame from unencrypted IKE handshakes and headers — DH groups, ciphers,
                  SA lifetimes, anti-replay drops.
                </p>
                <div className="font-code-sm text-code-sm text-on-surface flex flex-col gap-1">
                  <span>· IKE_SA_INIT Diffie-Hellman Group 2</span>
                  <span>· AES-CBC-128 / HMAC-SHA1-96</span>
                  <span>· ESP SPI 0x9a021da3 / replay dropped</span>
                </div>
              </div>
            </Reveal>
            <Reveal distance={16} blur={false}>
              <div className="py-space-lg flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-surface-container-highest text-secondary">Inferred</span>
                  <span className="font-code-sm text-code-sm text-outline">Statistical probability</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  ML and dispersion analysis with confidence intervals — always labeled with its p-value, never filed as fact.
                </p>
                <div className="font-code-sm text-code-sm text-on-surface flex flex-col gap-1">
                  <span>· Bulk exfiltration pattern (p = 0.89)</span>
                  <span>· C2 heartbeat interval deviation</span>
                  <span>· Video transcode profile</span>
                </div>
              </div>
            </Reveal>
            <Reveal distance={16} blur={false}>
              <div className="py-space-lg flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-surface-container text-outline">Unknown</span>
                  <span className="font-code-sm text-code-sm text-outline">Acknowledged boundary</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  What the capture cannot establish — inner payloads, PSK secrets, internal
                  addressing. Stated plainly, in every report.
                </p>
                <div className="font-code-sm text-code-sm text-on-surface flex flex-col gap-1">
                  <span>· Inner Layer-7 payload content</span>
                  <span>· Pre-shared key secret value</span>
                  <span>· Internal subnet host addressing</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ WORKBENCH — the console, under a light ============ */}
      <section className="w-full bg-surface py-space-3xl px-space-base" id="workbench-preview">
        <div className="max-w-6xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-space-md">
            <Reveal className="flex flex-col gap-space-sm max-w-2xl" distance={20} blur={false}>
              <span className="font-code-sm text-code-sm text-primary uppercase tracking-widest">Workbench preview</span>
              <h2 className="font-display-serif section-display text-on-surface font-medium" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                The forensic console.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Sub-millisecond precision for Tier-3 analysts — every verdict traceable to a frame.
              </p>
            </Reveal>
            <Link href="#" onClick={goAnalyze} className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest shrink-0">
              Open live terminal →
            </Link>
          </div>
          <Reveal distance={20} blur={false}>
            <div className="w-full rounded border border-hairline bg-surface-container-low overflow-hidden flex flex-col shadow-lift">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" aria-hidden="true" />
              <div className="bg-surface-container-high/80 px-space-md py-2 flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
                  </div>
                  <div className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-1.5 truncate">
                    <span className="text-outline">captures</span>
                    <span className="text-outline">/</span>
                    <span className="text-on-surface">edge-gw-04-us-east.pcap</span>
                    <span className="text-outline">/</span>
                    <span className="text-primary font-medium">SA-0x9a021da3</span>
                  </div>
                </div>
                <div className="hidden sm:block font-code-sm text-code-sm shrink-0">
                  <TypeLine text={["> dissect --sa 0x9a021da3 --rfc 7296", "> verdict: HIGH RISK · DH-2 deprecated"]} typingSpeed={36} pauseDuration={2600} className="text-primary" />
                </div>
                <div className="hidden md:flex items-center gap-space-sm font-code-sm text-code-sm text-outline shrink-0">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container text-tertiary">DPDK FAST_INGEST</span>
                  <span>PACKETS: <Stat to={1482091} duration={2.2} /></span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                <div className="lg:col-span-4 bg-surface-container-low/70 p-space-md flex flex-col gap-space-md border-r border-hairline">
                  <div className="bg-surface-container p-space-md rounded flex items-center justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Cryptographic Posture</span>
                      <div className="font-display-serif text-error tabular" style={{ fontSize: "2.5rem", lineHeight: 1.1 }}><Stat to={47} suffix=" / 100" duration={2} /></div>
                      <div className="font-code-sm text-code-sm text-error font-medium">HIGH RISK POSTURE</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold">NON-COMPLIANT</span>
                      <div className="font-code-sm text-code-sm text-outline mt-1">NIST SP 800-77r1</div>
                    </div>
                  </div>
                  <div className="bg-surface-container p-space-md rounded flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-error">P0 Finding</span>
                      <span className="px-1.5 py-0.5 rounded text-code-sm font-code-sm bg-tertiary/10 text-tertiary">CONFIRMED</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">Weak DH Group 2 (MODP-1024)</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                      IKE_SA_INIT negotiation selected Transform ID 2 (1024-bit MODP). Violated RFC 8247 deprecation mandate; vulnerable to logjam discrete-log factorization.
                    </p>
                    <div className="mt-space-xs p-space-xs rounded bg-surface-container-lowest font-code-sm text-code-sm flex flex-col gap-1 text-outline">
                      <div className="flex justify-between"><span>Frame Reference:</span><span className="text-on-surface">Packet #14 (IKEv2 SA)</span></div>
                      <div className="flex justify-between"><span>SPI Initiator:</span><span className="text-primary">0xa28f091c4a01</span></div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-space-md rounded flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-code-sm text-code-sm text-primary font-medium">REMEDIATION CLI PATCH</span>
                      <span className="font-code-sm text-code-sm text-outline">strongSwan</span>
                    </div>
                    <pre className="font-code-sm text-code-sm text-on-surface-variant overflow-x-auto p-1 leading-snug"><code># Update ipsec.conf ike transform
- ike = aes128-sha1-modp1024!
+ ike = aes256gcm16-prfsha384-ecp384!
# Enforce Perfect Forward Secrecy
+ esp = aes256gcm16-ecp384!</code></pre>
                  </div>
                </div>
                <div className="lg:col-span-8 bg-surface-container-lowest/60 flex flex-col">
                  <div className="bg-surface-container/80 px-space-md py-1.5 grid grid-cols-12 gap-space-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    <span className="col-span-2">Time (UTC)</span>
                    <span className="col-span-2">Source / Dest</span>
                    <span className="col-span-2">Protocol</span>
                    <span className="col-span-4">Payload / Exchange</span>
                    <span className="col-span-2 text-right">Provenance</span>
                  </div>
                  <div className="flex flex-col divide-y divide-surface-container font-code-sm text-code-sm">
                    {PACKET_ROWS.map((row) => (
                      <div key={row.time} className={`relative overflow-hidden px-space-md py-2 grid grid-cols-12 gap-space-xs items-center ${row.stripe ? "bg-surface-container/30" : ""} hover:bg-surface-container transition-colors`}>
                        {row.live && (
                          <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-secondary/15 to-transparent animate-stream-shimmer" aria-hidden="true" />
                        )}
                        <span className="col-span-2 text-outline">{row.time}</span>
                        <span className="col-span-2 text-on-surface truncate">{row.src}</span>
                        <span className={`col-span-2 ${row.protoClass}`}>{row.proto}</span>
                        <span className="col-span-4 text-on-surface-variant truncate">{row.payload}</span>
                        <span className={`col-span-2 text-right ${row.provClass}`}>{row.prov}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto p-space-md bg-surface-container-low/70 flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between font-code-sm text-code-sm text-outline pb-1">
                      <span>RAW BYTE DISSECTOR :: OFFSET 0x0020 – 0x0050 (KEi Transform Group 2)</span>
                      <span className="text-primary"><Descramble text="MATCH: MODP-1024" animateOn="hover" /></span>
                    </div>
                    <div className="p-space-sm bg-surface-container-lowest rounded font-code-sm text-code-sm leading-relaxed overflow-x-auto">
                      <div className="flex gap-4">
                        <span className="text-outline select-none">00000020</span>
                        <span className="text-on-surface">00 00 00 24  02 00 00 00  <mark className="bg-error-container text-on-error-container px-0.5 rounded">00 04 00 02</mark>  00 00 00 08</span>
                        <span className="text-outline select-none">|...$........|</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-outline select-none">00000030</span>
                        <span className="text-on-surface">03 00 00 02  00 00 00 08  04 00 00 05  00 00 00 08</span>
                        <span className="text-outline select-none">|............|</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-outline select-none">00000040</span>
                        <span className="text-on-surface">00 00 00 04  d2 e1 b4 8a  3f 10 aa 99  88 c1 20 01</span>
                        <span className="text-outline select-none">|........?.....|</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL — quiet, one action ============ */}
      <section className="w-full bg-surface-container-lowest py-space-3xl px-space-base relative overflow-hidden">
        <div className="absolute inset-0 landing-beam opacity-60" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" aria-hidden="true" />
        <Reveal className="max-w-3xl mx-auto flex flex-col items-center text-center gap-space-md relative" distance={20} blur={false}>
          <span className="font-code-sm text-code-sm text-primary uppercase tracking-widest">Begin the audit</span>
          <h3 className="font-display-serif section-display text-on-surface font-medium" style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}>
            Point it at a capture.
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            A PCAP file or a DPDK ring tap. Cipher safety, PFS health, and protocol
            truth — in seconds, with the bytes to back it.
          </p>
          <div className="flex flex-col items-center gap-space-sm pt-space-xs">
            <Link href="#" onClick={goAnalyze} aria-label="Analyze a Capture" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-teal-bright text-on-primary font-semibold text-[15px] px-8 py-3.5 rounded transition-colors">
              <span>Analyze a capture</span>
              <span aria-hidden="true">→</span>
            </Link>
            <span className="font-code-sm text-code-sm text-outline">Demo capture included · No account needed</span>
          </div>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <Footer />
    </div>
  );
}
