"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "@/components/motion/Reveal";
import BlurTitle from "@/components/motion/BlurTitle";
import Descramble from "@/components/motion/Descramble";
import TypeLine from "@/components/motion/TypeLine";
import Stat from "@/components/motion/Stat";
import GlowCard from "@/components/motion/GlowCard";
import Magnetic from "@/components/motion/Magnetic";
import StarCTA from "@/components/motion/StarCTA";
import ScrollStory from "@/components/motion/ScrollStory";

const HeroBg = dynamic(() => import("@/components/motion/HeroBg"), { ssr: false });

const PIPELINE_STAGES = [
  {
    n: "01",
    title: "Encrypted Traffic",
    sub: "pcap / tap / zero-copy ring",
    right: <span className="text-secondary">ESP Proto 50</span>,
    rightSub: "MTU: 1420b",
    hot: false,
  },
  {
    n: "02",
    title: "Protocol Evidence",
    sub: "IKEv2 / ESP State Machine",
    right: <span className="text-primary">SPI: 0x9a021da3</span>,
    rightSub: "Seq: 412,981",
    hot: false,
  },
  {
    n: "03",
    title: "Security Assessment",
    sub: "Cryptographic Posture & RFC Scoring",
    right: <span className="text-error font-medium">DH Group 2 [MODP-1024]</span>,
    rightSub: "RFC 8247 Non-Compliant",
    hot: false,
  },
  {
    n: "04",
    title: "ML Intelligence",
    sub: "Cadence, dispersion & burst anomalies",
    right: <span className="text-tertiary">TreeSHAP: +28% Flow Lock</span>,
    rightSub: "Interval Jitter > 120ms",
    hot: false,
  },
  {
    n: "05",
    title: "Actionable Findings",
    sub: "Remediation Policy & CISO Dossier",
    right: (
      <span className="inline-block px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-medium">
        SCORE: 47/100 HIGH RISK
      </span>
    ),
    rightSub: "P0 DH-2 Deprecation Issued",
    hot: true,
  },
];

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

const STANDARDS = [
  "IKEv1 / IKEv2",
  "RFC 7296 (IKEv2)",
  "NIST SP 800-77r1",
  "CNSA 1.0 (NSA Suite B)",
  "PCI-DSS 4.0 §4.2",
  "DPDK Zero-Copy Ingest",
];

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
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
  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<header className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${scrolled ? "glass glow-teal-soft border-outline-variant/40" : "bg-surface/90 backdrop-blur-md border-outline-variant/30"}`}><div className="h-header-height max-w-6xl mx-auto px-space-base flex items-center justify-between"><div className="flex items-center gap-space-lg"><Link className="flex items-center gap-space-xs group" href="/overview"><span className="w-2.5 h-2.5 bg-primary rounded-DEFAULT shadow-[0_0_12px_rgba(89,219,199,0.8)]"></span><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">TunnelSight</span><span className="font-code-sm text-code-sm text-on-surface-variant font-normal">/ IPsecXray</span></Link><nav className="hidden lg:flex items-center gap-space-lg" data-active-classes="text-primary font-headline-sm"><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "capabilities")}>Capabilities</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "capabilities")}>Architecture</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "evidence-model")}>Evidence Model</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "workbench-preview")}>Preview</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Documentation</Link></nav></div><div className="flex items-center gap-space-md"><Link className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-on-surface px-space-sm py-space-xs transition-colors" href="/login">Sign In</Link><Link className="inline-flex items-center justify-center bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm px-space-md py-space-xs rounded-lg transition-colors shadow-sm" href="#" onClick={goAnalyze}>Analyze Capture</Link><div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-header-height bg-surface min-h-screen"><div className="flex flex-col w-full">
{/* Hero Section */}
<section className="w-full bg-surface py-space-3xl px-space-base relative overflow-hidden">
<div className="absolute inset-0" aria-hidden="true"><HeroBg /><div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/80 to-surface" /></div>
<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative">
{/* Left Column: Hero Editorial Content */}
<div className="lg:col-span-6 flex flex-col gap-space-md">
<div className="flex flex-wrap items-center gap-space-xs">
<span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-surface-container-high text-primary glow-teal-soft">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          RFC 7296 &amp; CNSA 1.0 COMPLIANT FORENSIC ENGINE
        </span>
<span className="font-code-sm text-code-sm text-on-surface-variant">/ KERNEL DPDK FAST-PATH</span>
</div>
<div className="flex items-center gap-space-xs">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-widest"><Descramble text="Protocol Inspection Engine" /></span>
<span className="text-outline">/</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Deterministic Cryptographic Telemetry</span>
</div>
<div className="flex flex-col gap-space-2xs">
<h1 className="font-display text-display text-on-surface tracking-tight font-semibold" style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", lineHeight: 1.05 }}>
<BlurTitle text="TunnelSight" delay={110} />
          </h1>
<p className="font-headline-lg text-headline-lg tracking-tight font-medium bg-gradient-to-r from-primary via-teal-bright to-primary bg-clip-text text-transparent text-glow-teal">
            AI-Powered IPsec Security Intelligence
          </p>
</div>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-xl">
          Analyze IPsec deployments, assess cryptographic posture, detect anomalous encrypted traffic, and turn network evidence into actionable security findings.
        </p>
{/* CTA Cluster */}
<div className="flex flex-wrap items-center gap-space-md pt-space-sm">
<Magnetic>
<Link href="#" onClick={goAnalyze} aria-label="Analyze a Capture">
<StarCTA>
<span>Analyze a Capture</span>
<span className="font-code-md text-code-md">→</span>
</StarCTA>
</Link>
</Magnetic>
<Link className="inline-flex items-center justify-center gap-2 glass hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm px-space-lg py-2.5 rounded-lg transition-colors border border-outline-variant/40" href="#workbench-preview">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">terminal</span>
<span>View Platform</span>
</Link>
</div>
{/* Live metric counters */}
<div className="flex flex-wrap items-center gap-space-lg pt-space-md font-code-sm text-code-sm">
<div className="flex flex-col">
<Stat to={1.48} suffix=" Gbps" className="text-headline-md font-headline-md text-primary text-glow-teal" />
<span className="text-outline uppercase tracking-wider">Wire-rate ingest</span>
</div>
<div className="w-px h-8 bg-outline-variant/40" aria-hidden="true" />
<div className="flex flex-col">
<Stat to={1482091} className="text-headline-md font-headline-md text-on-surface" />
<span className="text-outline uppercase tracking-wider">Packets dissected</span>
</div>
<div className="w-px h-8 bg-outline-variant/40" aria-hidden="true" />
<div className="flex flex-col">
<Stat to={47} suffix=" / 100" className="text-headline-md font-headline-md text-error" />
<span className="text-outline uppercase tracking-wider">Demo posture score</span>
</div>
</div>
{/* Micro-Metadata Spec Line */}
<div className="pt-space-xs flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
<span className="text-on-surface-variant">Zero-payload inspection</span>
<span>·</span>
<span className="text-on-surface-variant">Hardware-accelerated DPDK pipeline</span>
<span>·</span>
<span className="text-on-surface-variant">Deterministic provenance</span>
</div>
</div>
{/* Right Column: Telemetry Pipeline Topology */}
<Reveal className="lg:col-span-6" delay={0.15}>
<div className="glass glow-teal rounded-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30 relative overflow-hidden">
<div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden="true" />
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high relative">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="font-code-sm text-code-sm text-on-surface uppercase tracking-wider font-semibold">Active Pipeline Graph</span>
</div>
<span className="font-code-sm text-code-sm text-outline"><Descramble text="CAPTURE_BUFF_09 :: 1.48 Gbps" animateOn="hover" /></span>
</div>
{/* Pipeline Linear Stack */}
<div className="flex flex-col gap-space-xs relative">
{PIPELINE_STAGES.map((stage, i) => (
<div key={stage.n}>
<Reveal delay={0.25 + i * 0.09} distance={16}>
<div className={`${stage.hot ? "bg-surface-container-high glow-teal-soft border border-error/30" : "bg-surface-container/80 border border-transparent"} p-space-sm rounded-lg flex items-center justify-between backdrop-blur-sm`}>
<div className="flex items-center gap-space-sm">
<span className={`font-code-sm text-code-sm ${stage.hot ? "text-error" : "text-outline"}`}>{stage.n}</span>
<div>
<div className={`font-headline-sm text-headline-sm text-on-surface ${stage.hot ? "font-semibold" : ""}`}>{stage.title}</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">{stage.sub}</div>
</div>
</div>
<div className="text-right font-code-sm text-code-sm">
{stage.right}
<div className="text-outline">{stage.rightSub}</div>
</div>
</div>
</Reveal>
{i < PIPELINE_STAGES.length - 1 && (
<div className="flex justify-center py-0.5" aria-hidden="true">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-flow-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
</div>
)}
</div>
))}
</div>
</div>
</Reveal>
</div>
</section>
{/* Standards Marquee Strip */}
<section className="w-full bg-surface-container-low py-space-md px-space-base overflow-hidden border-y border-outline-variant/20">
<div className="max-w-6xl mx-auto flex items-center gap-space-md">
<span className="text-on-surface uppercase tracking-wider text-label-sm font-label-sm font-semibold shrink-0">Engine Conformance:</span>
<div className="overflow-hidden flex-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
<div className="flex w-max items-center gap-space-md text-outline font-code-sm text-code-sm animate-marquee">
{[...STANDARDS, ...STANDARDS].map((s, i) => (
<span key={i} className="flex items-center gap-space-md shrink-0">
<span className={s === "DPDK Zero-Copy Ingest" ? "text-primary font-medium" : "hover:text-primary transition-colors"}>{s}</span>
<span className="text-surface-variant">|</span>
</span>
))}
</div>
</div>
</div>
</section>
{/* Core Capabilities Section */}
<section className="w-full bg-surface py-space-3xl px-space-base" id="capabilities">
<div className="max-w-6xl mx-auto flex flex-col gap-space-xl">
{/* Section Header */}
<Reveal className="flex flex-col gap-space-2xs max-w-2xl">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-wider">Engine Architecture</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Core Diagnostic Capabilities
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          Built strictly for defensive security engineers and network protocol specialists. High-density, deterministic protocol validation across all tunnel lifecycles.
        </p>
</Reveal>
{/* 3 Architectural Capability Modules */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Module 1: IPsec Visibility */}
<Reveal delay={0}>
<GlowCard className="bg-surface-container-low p-space-lg rounded-xl h-full flex flex-col justify-between gap-space-lg border border-outline-variant/20 hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-sm">
<div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-primary glow-teal-soft">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</div>
<div className="flex flex-col gap-1">
<span className="font-code-sm text-code-sm text-outline uppercase tracking-wider">Telemetry Layer 01</span>
<h3 className="font-headline-md text-headline-md text-on-surface">IPsec Visibility</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Identify IKE, ESP, VPN mode, cryptographic parameters, and Security Association characteristics. Dissect key exchange transforms, ephemeral PFS renegotiation health, and replay window posture.
            </p>
</div>
{/* Feature Breakdown Table */}
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm flex flex-col gap-1 text-on-surface-variant">
<div className="flex justify-between py-0.5">
<span>IKEv2 SA Matrix:</span>
<span className="text-primary font-medium">DISSECTED</span>
</div>
<div className="flex justify-between py-0.5">
<span>ESP Replay Sequence:</span>
<span className="text-on-surface">64-bit ESN</span>
</div>
<div className="flex justify-between py-0.5">
<span>NAT-Traversal (RFC 3948):</span>
<span className="text-on-surface">Port 4500 UDP</span>
</div>
</div>
</GlowCard>
</Reveal>
{/* Module 2: Encrypted Traffic Intelligence */}
<Reveal delay={0.1}>
<GlowCard className="bg-surface-container-low p-space-lg rounded-xl h-full flex flex-col justify-between gap-space-lg border border-outline-variant/20 hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-sm">
<div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-primary glow-teal-soft">
<span className="material-symbols-outlined text-[20px]">troubleshoot</span>
</div>
<div className="flex flex-col gap-1">
<span className="font-code-sm text-code-sm text-outline uppercase tracking-wider">Inference Layer 02</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Encrypted Traffic Intelligence</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Use ML to infer traffic patterns and detect anomalous behavior without pretending to decrypt payloads. Statistical isolation forest and timing cadence attribution with verifiable feature provenance.
            </p>
</div>
{/* Feature Breakdown Table */}
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm flex flex-col gap-1 text-on-surface-variant">
<div className="flex justify-between py-0.5">
<span>Inter-Arrival Cadence:</span>
<span className="text-tertiary">STOCHASTIC MODEL</span>
</div>
<div className="flex justify-between py-0.5">
<span>Entropy Profiling:</span>
<span className="text-on-surface">7.994 bits/byte</span>
</div>
<div className="flex justify-between py-0.5">
<span>Burst Asymmetry:</span>
<span className="text-on-surface">1.84x (Upload Bias)</span>
</div>
</div>
</GlowCard>
</Reveal>
{/* Module 3: Security Assessment */}
<Reveal delay={0.2}>
<GlowCard className="bg-surface-container-low p-space-lg rounded-xl h-full flex flex-col justify-between gap-space-lg border border-outline-variant/20 hover:border-primary/40 transition-colors">
<div className="flex flex-col gap-space-sm">
<div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-primary glow-teal-soft">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
</div>
<div className="flex flex-col gap-1">
<span className="font-code-sm text-code-sm text-outline uppercase tracking-wider">Evaluation Layer 03</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Security Assessment</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Produce evidence-backed risk scores, findings, recommendations, and reports. Turn low-level network captures into prioritized remediation patches, executive compliance briefings, and signed forensic artifacts.
            </p>
</div>
{/* Feature Breakdown Table */}
<div className="bg-surface-container-lowest p-space-sm rounded font-code-sm text-code-sm flex flex-col gap-1 text-on-surface-variant">
<div className="flex justify-between py-0.5">
<span>Posture Metric:</span>
<span className="text-error font-medium">RFC 8247 GAP DETECTED</span>
</div>
<div className="flex justify-between py-0.5">
<span>Remediation Generation:</span>
<span className="text-on-surface">strongSwan / Cisco IOS</span>
</div>
<div className="flex justify-between py-0.5">
<span>Audit Export:</span>
<span className="text-on-surface">Signed JSON / PDF</span>
</div>
</div>
</GlowCard>
</Reveal>
</div>
</div>
</section>
{/* Evidence Architecture Philosophy Section */}
<section className="w-full bg-surface-container-lowest py-space-3xl px-space-base relative overflow-hidden" id="evidence-model">
<div className="absolute inset-0 technical-grid opacity-60" aria-hidden="true" />
<div className="max-w-6xl mx-auto flex flex-col gap-space-xl relative">
{/* Section Title & Epistemic Statement */}
<div className="flex flex-col gap-space-2xs max-w-3xl">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-wider"><Descramble text="EVIDENCE ARCHITECTURE" /></span>
<ScrollStory text="Evidence before inference" className="font-display text-on-surface tracking-tight font-semibold" />
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          TunnelSight enforces rigorous epistemic boundaries. We categorically distinguish deterministically captured wire bytes from probabilistic statistical inferences, guaranteeing that compliance reports are grounded in unassailable network proof.
        </p>
</div>
{/* 3 Bounded Provenance Columns */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Column 1: CONFIRMED */}
<Reveal delay={0}>
<GlowCard className="bg-surface-container-low p-space-lg rounded-xl h-full flex flex-col gap-space-md border border-tertiary/20">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-tertiary/10 text-tertiary">
              CONFIRMED
            </span>
<span className="font-code-sm text-code-sm text-outline">Deterministic Wire Data</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Directly supported by protocol evidence. Extracted frame-by-frame from unencrypted IKE handshakes and packet headers (DH groups, ciphers, SA lifetimes, anti-replay drops).
          </p>
<div className="bg-surface-container-lowest p-space-md rounded font-code-sm text-code-sm flex flex-col gap-1.5">
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
<span>IKE_SA_INIT Diffie-Hellman Group 2</span>
</div>
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
<span>AES-CBC-128 / HMAC-SHA1-96 Auth</span>
</div>
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
<span>ESP SPI: 0x9a021da3 / Replay Dropped</span>
</div>
</div>
</GlowCard>
</Reveal>
{/* Column 2: INFERRED */}
<Reveal delay={0.1}>
<GlowCard className="bg-surface-container-low p-space-lg rounded-xl h-full flex flex-col gap-space-md border border-secondary/20">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-surface-container-highest text-secondary">
              INFERRED
            </span>
<span className="font-code-sm text-code-sm text-outline">Statistical Probability</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Derived from ML/statistical analysis. Unsupervised flow dispersion, inter-arrival jitter deviations, and heuristic throughput clustering with confidence intervals.
          </p>
<div className="bg-surface-container-lowest p-space-md rounded font-code-sm text-code-sm flex flex-col gap-1.5">
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Bulk Data Exfiltration (p = 0.89)</span>
</div>
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Command &amp; Control Heartbeat Interval</span>
</div>
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Video Stream Transcode Profile</span>
</div>
</div>
</GlowCard>
</Reveal>
{/* Column 3: UNKNOWN */}
<Reveal delay={0.2}>
<GlowCard className="bg-surface-container-low p-space-lg rounded-xl h-full flex flex-col gap-space-md border border-outline-variant/20">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-surface-container text-outline">
              UNKNOWN
            </span>
<span className="font-code-sm text-code-sm text-outline">Acknowledged Boundary</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Cannot be established from the supplied evidence. Explicitly acknowledged blind spots—inner payload plaintext, application payload data, and uncaptured responder secrets.
          </p>
<div className="bg-surface-container-lowest p-space-md rounded font-code-sm text-code-sm flex flex-col gap-1.5">
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
<span>Inner Layer-7 HTTP/Payload Content</span>
</div>
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
<span>Pre-Shared Key (PSK) Secret Value</span>
</div>
<div className="text-on-surface flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
<span>Internal Subnet Host IP Addressing</span>
</div>
</div>
</GlowCard>
</Reveal>
</div>
</div>
</section>
{/* Product Preview / Workbench Section */}
<section className="w-full bg-surface py-space-3xl px-space-base" id="workbench-preview">
<div className="max-w-6xl mx-auto flex flex-col gap-space-xl">
{/* Section Header */}
<Reveal className="flex flex-col gap-space-2xs max-w-2xl">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-wider">WORKBENCH PREVIEW</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
          Deterministic Forensic Console
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          Built for Tier 3 cryptographic analysts and SecOps teams requiring sub-millisecond precision and deep packet transparency.
        </p>
</Reveal>
{/* High-Fidelity UI Mockup Terminal / Console Window */}
<Reveal delay={0.1}>
<div className="w-full glass glow-teal rounded-xl overflow-hidden flex flex-col border border-outline-variant/30">
{/* Window Chrome / Top Breadcrumb Bar */}
<div className="bg-surface-container-high/80 px-space-md py-2 flex items-center justify-between">
<div className="flex items-center gap-space-md">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
<span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
<span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span>
</div>
<div className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-1.5">
<span className="text-outline">captures</span>
<span className="text-outline">/</span>
<span className="text-on-surface">edge-gw-04-us-east.pcap</span>
<span className="text-outline">/</span>
<span className="text-primary font-medium">SA-0x9a021da3</span>
</div>
</div>
<div className="hidden sm:block font-code-sm text-code-sm">
<TypeLine text={["> dissect --sa 0x9a021da3 --rfc 7296", "> verdict: HIGH RISK · DH-2 deprecated"]} typingSpeed={36} pauseDuration={2600} className="text-primary" />
</div>
<div className="flex items-center gap-space-sm font-code-sm text-code-sm text-outline">
<span className="px-1.5 py-0.5 rounded bg-surface-container text-tertiary">DPDK FAST_INGEST</span>
<span>PACKETS: <Stat to={1482091} duration={2.2} /></span>
</div>
</div>
{/* Main Console Split Panes */}
<div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
{/* Left Console Column: Verdict & Active Finding */}
<div className="lg:col-span-4 bg-surface-container-low/70 p-space-md flex flex-col gap-space-md">
{/* Overall Score Verdict Panel */}
<div className="bg-surface-container p-space-md rounded-lg flex items-center justify-between">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Cryptographic Posture</span>
<div className="font-display text-display text-error font-semibold tracking-tight"><Stat to={47} suffix=" / 100" duration={2} /></div>
<div className="font-code-sm text-code-sm text-error font-medium">HIGH RISK POSTURE</div>
</div>
<div className="text-right">
<span className="px-2 py-1 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold">
                  NON-COMPLIANT
                </span>
<div className="font-code-sm text-code-sm text-outline mt-1">NIST SP 800-77r1</div>
</div>
</div>
{/* Active Finding Focus Card */}
<div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-error">P0 Finding</span>
<span className="px-1.5 py-0.5 rounded text-code-sm font-code-sm bg-tertiary/10 text-tertiary">CONFIRMED</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Weak DH Group 2 (MODP-1024)</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                IKE_SA_INIT negotiation selected Transform ID 2 (1024-bit MODP). Violated RFC 8247 deprecation mandate; vulnerable to logjam discrete-log factorization.
              </p>
{/* Evidence Reference */}
<div className="mt-space-xs p-space-xs rounded bg-surface-container-lowest font-code-sm text-code-sm flex flex-col gap-1 text-outline">
<div className="flex justify-between">
<span>Frame Reference:</span>
<span className="text-on-surface">Packet #14 (IKEv2 SA)</span>
</div>
<div className="flex justify-between">
<span>SPI Initiator:</span>
<span className="text-primary">0xa28f091c4a01</span>
</div>
</div>
</div>
{/* Remediation Generator Snippet */}
<div className="bg-surface-container-lowest p-space-md rounded-lg flex flex-col gap-space-xs">
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
{/* Right Console Column: Interactive Protocol & Hex Inspector */}
<div className="lg:col-span-8 bg-surface-container-lowest/60 flex flex-col">
{/* Table Header Bar */}
<div className="bg-surface-container/80 px-space-md py-1.5 grid grid-cols-12 gap-space-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">
<span className="col-span-2">Time (UTC)</span>
<span className="col-span-2">Source / Dest</span>
<span className="col-span-2">Protocol</span>
<span className="col-span-4">Payload / Exchange</span>
<span className="col-span-2 text-right">Provenance</span>
</div>
{/* Packet Stream Rows */}
<div className="flex flex-col divide-y divide-surface-container font-code-sm text-code-sm">
{PACKET_ROWS.map((row, i) => (
<Reveal key={row.time} delay={0.15 + i * 0.1} distance={12} blur={false}>
<div className={`relative overflow-hidden px-space-md py-2 grid grid-cols-12 gap-space-xs items-center ${row.stripe ? "bg-surface-container/30" : row.live ? "" : "bg-surface-container-high/40"} hover:bg-surface-container transition-colors`}>
{row.live && (
<span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-secondary/15 to-transparent animate-stream-shimmer" aria-hidden="true" />
)}
<span className="col-span-2 text-outline">{row.time}</span>
<span className="col-span-2 text-on-surface truncate">{row.src}</span>
<span className={`col-span-2 ${row.protoClass}`}>{row.proto}</span>
<span className="col-span-4 text-on-surface-variant truncate">{row.payload}</span>
<span className={`col-span-2 text-right ${row.provClass}`}>{row.prov}</span>
</div>
</Reveal>
))}
</div>
{/* Hex Dissection Viewport (Authentic Byte Inspection) */}
<div className="mt-auto p-space-md bg-surface-container-low/70 flex flex-col gap-space-xs">
<div className="flex items-center justify-between font-code-sm text-code-sm text-outline pb-1">
<span>RAW BYTE DISSECTOR :: OFFSET 0x0020 - 0x0050 (KEi Transform Group 2)</span>
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
{/* Final Call to Action Strip */}
<section className="w-full bg-surface-container py-space-3xl px-space-base relative overflow-hidden">
<div className="absolute inset-0 opacity-40" aria-hidden="true"><HeroBg amplitude={0.5} blend={0.7} speed={0.5} /></div>
<div className="absolute inset-0 bg-gradient-to-b from-surface-container via-transparent to-surface-container" aria-hidden="true" />
<Reveal className="max-w-4xl mx-auto flex flex-col items-center text-center gap-space-md relative">
<div className="w-10 h-10 rounded-lg glass glow-teal flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[24px]">terminal</span>
</div>
<h3 className="font-display text-display text-on-surface font-semibold tracking-tight">
<BlurTitle text="Audit your IPsec perimeter in seconds." delay={40} />
      </h3>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        Upload a PCAP capture file or configure an inline DPDK ring tap to evaluate cipher safety, PFS health, and protocol vulnerabilities.
      </p>
<div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
<Magnetic>
<Link href="#" onClick={goAnalyze} aria-label="Analyze a Capture">
<StarCTA>
<span>Analyze a Capture</span>
<span className="font-code-md text-code-md">→</span>
</StarCTA>
</Link>
</Magnetic>
<Link className="inline-flex items-center justify-center gap-2 glass hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm px-space-lg py-3 rounded-lg transition-colors border border-outline-variant/40" href="#">
<span>Read RFC 7296 Specifications</span>
</Link>
</div>
</Reveal>
</section>
</div></main><footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-space-3xl"><div className="max-w-6xl mx-auto px-space-base grid grid-cols-1 md:grid-cols-5 gap-space-xl"><div className="md:col-span-2 flex flex-col gap-space-sm"><div className="flex items-center gap-space-xs"><span className="w-2 h-2 bg-primary rounded-DEFAULT shadow-[0_0_12px_rgba(89,219,199,0.8)]"></span><span className="font-headline-sm text-headline-sm text-on-surface">TunnelSight Observability Engine</span></div><p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">Deterministic protocol diagnostics, deep packet inspection, and cryptographic audit posture for mission-critical IPsec and IKEv2 infrastructures.</p><div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline"><span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span><span>KERNEL ENGINE ONLINE: v4.18.0-FIPS</span></div></div><div className="flex flex-col gap-space-xs"><span className="font-label-md text-label-md uppercase tracking-wider text-outline">Product</span><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "capabilities")}>Capabilities</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "capabilities")}>Architecture</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#" onClick={(e) => scrollTo(e, "evidence-model")}>Evidence Model</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Live Terminal</Link></div><div className="flex flex-col gap-space-xs"><span className="font-label-md text-label-md uppercase tracking-wider text-outline">Documentation</span><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Engine Specifications</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">RFC 7296 Compliance</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">CLI Integration</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">API References</Link></div><div className="flex flex-col gap-space-xs"><span className="font-label-md text-label-md uppercase tracking-wider text-outline">Compliance</span><span className="font-body-sm text-body-sm text-on-surface-variant">NIST SP 800-77</span><span className="font-body-sm text-body-sm text-on-surface-variant">FIPS 140-3 Posture</span><span className="font-body-sm text-body-sm text-on-surface-variant">Air-Gap Validated</span><span className="font-body-sm text-body-sm text-on-surface-variant">SOC 2 Type II</span></div></div><div className="max-w-6xl mx-auto px-space-base mt-space-xl pt-space-lg border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-md text-label-md text-outline"><div>© 2025 TunnelSight Core Systems. High-assurance forensic telemetry.</div><div className="flex items-center gap-space-md"><Link className="hover:text-on-surface transition-colors" href="#">Security Disclosures</Link><Link className="hover:text-on-surface transition-colors" href="#">Cryptographic Standards</Link><Link className="hover:text-on-surface transition-colors" href="#">Terms of Inspection</Link></div></div></footer>
    </div>
  );
}
