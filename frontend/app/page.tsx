import Link from "next/link";
export const metadata = { title: "TunnelSight — AI-Powered IPsec Security Intelligence" };

export default function LandingPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30"><div className="h-header-height max-w-7xl mx-auto px-space-base flex items-center justify-between"><div className="flex items-center gap-space-lg"><Link className="flex items-center gap-space-xs group" href="/overview"><span className="w-2.5 h-2.5 bg-primary rounded-DEFAULT"></span><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">TunnelSight</span><span className="font-code-sm text-code-sm text-on-surface-variant font-normal">/ IPsecXray</span></Link><nav className="hidden lg:flex items-center gap-space-lg" data-active-classes="text-primary font-headline-sm"><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Capabilities</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Architecture</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Evidence Model</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Preview</Link><Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Documentation</Link></nav></div><div className="flex items-center gap-space-md"><Link className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-on-surface px-space-sm py-space-xs transition-colors" href="/login">Sign In</Link><Link className="inline-flex items-center justify-center bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm px-space-md py-space-xs rounded-lg transition-colors shadow-sm" href="#">Analyze Capture</Link><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-header-height bg-surface min-h-screen"><div className="flex flex-col w-full">
{/* Top Technical Anchor Bar */}
<section className="w-full bg-surface-container-lowest py-space-xs px-space-base">
<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm font-code-sm text-code-sm text-on-surface-variant">
<div className="flex items-center gap-space-sm">
<span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-surface-container-high text-primary">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          RFC 7296 &amp; CNSA 1.0 COMPLIANT FORENSIC ENGINE
        </span>
<span className="text-outline">·</span>
<span className="text-on-surface-variant">KERNEL DPDK FAST-PATH: 100GbE WIRE-RATE</span>
</div>
<div className="flex items-center gap-space-md text-outline">
<span>FIPS 140-3 CAVP CERTIFIED</span>
<span>SHA-256 MANIFEST VERIFIED</span>
</div>
</div>
</section>
{/* Hero Section */}
<section className="w-full bg-surface py-space-2xl px-space-base relative overflow-hidden">
<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
{/* Left Column: Hero Editorial Content */}
<div className="lg:col-span-6 flex flex-col gap-space-md">
<div className="flex items-center gap-space-xs">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-widest">Protocol Inspection Engine</span>
<span className="text-outline">/</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Deterministic Cryptographic Telemetry</span>
</div>
<div className="flex flex-col gap-space-2xs">
<h1 className="font-display text-display text-on-surface tracking-tight font-semibold">
            TunnelSight
          </h1>
<p className="font-headline-lg text-headline-lg text-primary tracking-tight font-medium">
            AI-Powered IPsec Security Intelligence
          </p>
</div>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-xl">
          Analyze IPsec deployments, assess cryptographic posture, detect anomalous encrypted traffic, and turn network evidence into actionable security findings.
        </p>
{/* CTA Cluster */}
<div className="flex flex-wrap items-center gap-space-md pt-space-sm">
<Link className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm px-space-lg py-2.5 rounded-lg transition-colors shadow-sm" href="#">
<span>Analyze a Capture</span>
<span className="font-code-md text-code-md">→</span>
</Link>
<a className="inline-flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm px-space-lg py-2.5 rounded-lg transition-colors" href="#workbench-preview">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">terminal</span>
<span>View Platform</span>
</a>
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
<div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-code-sm text-code-sm text-on-surface uppercase tracking-wider font-semibold">Active Pipeline Graph</span>
</div>
<span className="font-code-sm text-code-sm text-outline">CAPTURE_BUFF_09 :: 1.48 Gbps</span>
</div>
{/* Pipeline Linear Stack */}
<div className="flex flex-col gap-space-xs">
{/* Stage 1 */}
<div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="font-code-sm text-code-sm text-outline">01</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Encrypted Traffic</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">pcap / tap / zero-copy ring</div>
</div>
</div>
<div className="text-right font-code-sm text-code-sm">
<span className="text-secondary">ESP Proto 50</span>
<div className="text-outline">MTU: 1420b</div>
</div>
</div>
{/* Connector Arrow */}
<div className="flex justify-center -my-1 text-outline">
<span className="material-symbols-outlined text-[14px]">arrow_downward</span>
</div>
{/* Stage 2 */}
<div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="font-code-sm text-code-sm text-outline">02</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Protocol Evidence</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">IKEv2 / ESP State Machine</div>
</div>
</div>
<div className="text-right font-code-sm text-code-sm">
<span className="text-primary">SPI: 0x9a021da3</span>
<div className="text-outline">Seq: 412,981</div>
</div>
</div>
{/* Connector Arrow */}
<div className="flex justify-center -my-1 text-outline">
<span className="material-symbols-outlined text-[14px]">arrow_downward</span>
</div>
{/* Stage 3 */}
<div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="font-code-sm text-code-sm text-outline">03</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Security Assessment</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">Cryptographic Posture &amp; RFC Scoring</div>
</div>
</div>
<div className="text-right font-code-sm text-code-sm">
<span className="text-error font-medium">DH Group 2 [MODP-1024]</span>
<div className="text-outline">RFC 8247 Non-Compliant</div>
</div>
</div>
{/* Connector Arrow */}
<div className="flex justify-center -my-1 text-outline">
<span className="material-symbols-outlined text-[14px]">arrow_downward</span>
</div>
{/* Stage 4 */}
<div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="font-code-sm text-code-sm text-outline">04</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">ML Intelligence</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">Cadence, dispersion &amp; burst anomalies</div>
</div>
</div>
<div className="text-right font-code-sm text-code-sm">
<span className="text-tertiary">TreeSHAP: +28% Flow Lock</span>
<div className="text-outline">Interval Jitter &gt; 120ms</div>
</div>
</div>
{/* Connector Arrow */}
<div className="flex justify-center -my-1 text-outline">
<span className="material-symbols-outlined text-[14px]">arrow_downward</span>
</div>
{/* Stage 5 */}
<div className="bg-surface-container-high p-space-sm rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="font-code-sm text-code-sm text-error">05</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold">Actionable Findings</div>
<div className="font-code-sm text-code-sm text-on-surface-variant">Remediation Policy &amp; CISO Dossier</div>
</div>
</div>
<div className="text-right font-code-sm text-code-sm">
<span className="inline-block px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-medium">SCORE: 47/100 HIGH RISK</span>
<div className="text-outline">P0 DH-2 Deprecation Issued</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Standards & Specifications Strip */}
<section className="w-full bg-surface-container-low py-space-md px-space-base">
<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-md text-outline font-code-sm text-code-sm">
<span className="text-on-surface uppercase tracking-wider text-label-sm font-label-sm font-semibold">Engine Conformance:</span>
<span className="hover:text-primary transition-colors">IKEv1 / IKEv2</span>
<span className="text-surface-variant">|</span>
<span className="hover:text-primary transition-colors">RFC 7296 (IKEv2)</span>
<span className="text-surface-variant">|</span>
<span className="hover:text-primary transition-colors">NIST SP 800-77r1</span>
<span className="text-surface-variant">|</span>
<span className="hover:text-primary transition-colors">CNSA 1.0 (NSA Suite B)</span>
<span className="text-surface-variant">|</span>
<span className="hover:text-primary transition-colors">PCI-DSS 4.0 §4.2</span>
<span className="text-surface-variant">|</span>
<span className="text-primary font-medium">DPDK Zero-Copy Ingest</span>
</div>
</section>
{/* Core Capabilities Section */}
<section className="w-full bg-surface py-space-2xl px-space-base" id="capabilities">
<div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
{/* Section Header */}
<div className="flex flex-col gap-space-2xs max-w-2xl">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-wider">Engine Architecture</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Core Diagnostic Capabilities
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          Built strictly for defensive security engineers and network protocol specialists. High-density, deterministic protocol validation across all tunnel lifecycles.
        </p>
</div>
{/* 3 Architectural Capability Modules */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Module 1: IPsec Visibility */}
<div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between gap-space-lg">
<div className="flex flex-col gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
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
</div>
{/* Module 2: Encrypted Traffic Intelligence */}
<div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between gap-space-lg">
<div className="flex flex-col gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
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
</div>
{/* Module 3: Security Assessment */}
<div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between gap-space-lg">
<div className="flex flex-col gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
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
</div>
</div>
</div>
</section>
{/* Evidence Architecture Philosophy Section */}
<section className="w-full bg-surface-container-lowest py-space-2xl px-space-base" id="evidence-model">
<div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
{/* Section Title & Epistemic Statement */}
<div className="flex flex-col gap-space-2xs max-w-3xl">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-wider">EVIDENCE ARCHITECTURE</span>
<h2 className="font-display text-display text-on-surface tracking-tight font-semibold">
          Evidence before inference
        </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          TunnelSight enforces rigorous epistemic boundaries. We categorically distinguish deterministically captured wire bytes from probabilistic statistical inferences, guaranteeing that compliance reports are grounded in unassailable network proof.
        </p>
</div>
{/* 3 Bounded Provenance Columns */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Column 1: CONFIRMED */}
<div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-md">
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
</div>
{/* Column 2: INFERRED */}
<div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-md">
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
</div>
{/* Column 3: UNKNOWN */}
<div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-md">
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
</div>
</div>
</div>
</section>
{/* Product Preview / Workbench Section */}
<section className="w-full bg-surface py-space-2xl px-space-base" id="workbench-preview">
<div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
{/* Section Header */}
<div className="flex flex-col gap-space-2xs max-w-2xl">
<span className="font-code-sm text-code-sm text-primary uppercase tracking-wider">WORKBENCH PREVIEW</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
          Deterministic Forensic Console
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          Built for Tier 3 cryptographic analysts and SecOps teams requiring sub-millisecond precision and deep packet transparency.
        </p>
</div>
{/* High-Fidelity UI Mockup Terminal / Console Window */}
<div className="w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col">
{/* Window Chrome / Top Breadcrumb Bar */}
<div className="bg-surface-container-high px-space-md py-2 flex items-center justify-between">
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
<div className="flex items-center gap-space-sm font-code-sm text-code-sm text-outline">
<span className="px-1.5 py-0.5 rounded bg-surface-container text-tertiary">DPDK FAST_INGEST</span>
<span>PACKETS: 1,482,091</span>
</div>
</div>
{/* Main Console Split Panes */}
<div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
{/* Left Console Column: Verdict & Active Finding */}
<div className="lg:col-span-4 bg-surface-container-low p-space-md flex flex-col gap-space-md">
{/* Overall Score Verdict Panel */}
<div className="bg-surface-container p-space-md rounded-lg flex items-center justify-between">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Cryptographic Posture</span>
<div className="font-display text-display text-error font-semibold tracking-tight">47 / 100</div>
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
<div className="lg:col-span-8 bg-surface-container-lowest flex flex-col">
{/* Table Header Bar */}
<div className="bg-surface-container px-space-md py-1.5 grid grid-cols-12 gap-space-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">
<span className="col-span-2">Time (UTC)</span>
<span className="col-span-2">Source / Dest</span>
<span className="col-span-2">Protocol</span>
<span className="col-span-4">Payload / Exchange</span>
<span className="col-span-2 text-right">Provenance</span>
</div>
{/* Packet Stream Rows */}
<div className="flex flex-col divide-y divide-surface-container font-code-sm text-code-sm">
{/* Row 1 */}
<div className="px-space-md py-2 grid grid-cols-12 gap-space-xs items-center bg-surface-container/30 hover:bg-surface-container transition-colors">
<span className="col-span-2 text-outline">14:02:19.412</span>
<span className="col-span-2 text-on-surface truncate">192.0.2.14:500</span>
<span className="col-span-2 text-primary font-medium">IKEv2 SA_INIT</span>
<span className="col-span-4 text-on-surface-variant truncate">HDR, SAi1, KEi, Ni (Group 2 selected)</span>
<span className="col-span-2 text-right text-tertiary">CONFIRMED</span>
</div>
{/* Row 2 */}
<div className="px-space-md py-2 grid grid-cols-12 gap-space-xs items-center bg-surface-container-high/40 hover:bg-surface-container transition-colors">
<span className="col-span-2 text-outline">14:02:19.428</span>
<span className="col-span-2 text-on-surface truncate">198.51.100.8:500</span>
<span className="col-span-2 text-primary font-medium">IKEv2 SA_INIT</span>
<span className="col-span-4 text-on-surface-variant truncate">HDR, SAr1, KEr, Nr, CERTREQ</span>
<span className="col-span-2 text-right text-tertiary">CONFIRMED</span>
</div>
{/* Row 3 */}
<div className="px-space-md py-2 grid grid-cols-12 gap-space-xs items-center bg-surface-container/30 hover:bg-surface-container transition-colors">
<span className="col-span-2 text-outline">14:02:19.489</span>
<span className="col-span-2 text-on-surface truncate">192.0.2.14:4500</span>
<span className="col-span-2 text-primary font-medium">IKEv2 SA_AUTH</span>
<span className="col-span-4 text-on-surface-variant truncate">HDR, SK {"{"}IDi, AUTH, SA2, TSi, TSr{"}"}</span>
<span className="col-span-2 text-right text-tertiary">CONFIRMED</span>
</div>
{/* Row 4 (ESP Stream Analysis) */}
<div className="px-space-md py-2 grid grid-cols-12 gap-space-xs items-center hover:bg-surface-container transition-colors">
<span className="col-span-2 text-outline">14:02:19.510</span>
<span className="col-span-2 text-on-surface truncate">192.0.2.14:4500</span>
<span className="col-span-2 text-secondary font-medium">ESP (50)</span>
<span className="col-span-4 text-on-surface-variant truncate">SPI: 0x9a021da3 · Len: 1420b · Continuous Burst</span>
<span className="col-span-2 text-right text-secondary">INFERRED</span>
</div>
</div>
{/* Hex Dissection Viewport (Authentic Byte Inspection) */}
<div className="mt-auto p-space-md bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between font-code-sm text-code-sm text-outline pb-1">
<span>RAW BYTE DISSECTOR :: OFFSET 0x0020 - 0x0050 (KEi Transform Group 2)</span>
<span className="text-primary">MATCH: MODP-1024</span>
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
</div>
</section>
{/* Final Call to Action Strip */}
<section className="w-full bg-surface-container py-space-2xl px-space-base">
<div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-space-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[24px]">terminal</span>
</div>
<h3 className="font-display text-display text-on-surface font-semibold tracking-tight">
        Audit your IPsec perimeter in seconds.
      </h3>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        Upload a PCAP capture file or configure an inline DPDK ring tap to evaluate cipher safety, PFS health, and protocol vulnerabilities.
      </p>
<div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
<Link className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm px-space-xl py-3 rounded-lg transition-colors shadow-sm" href="#">
<span>Analyze a Capture</span>
<span className="font-code-md text-code-md">→</span>
</Link>
<Link className="inline-flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm px-space-lg py-3 rounded-lg transition-colors" href="#">
<span>Read RFC 7296 Specifications</span>
</Link>
</div>
</div>
</section>
</div></main><footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-space-2xl"><div className="max-w-7xl mx-auto px-space-base grid grid-cols-1 md:grid-cols-5 gap-space-xl"><div className="md:col-span-2 flex flex-col gap-space-sm"><div className="flex items-center gap-space-xs"><span className="w-2 h-2 bg-primary rounded-DEFAULT"></span><span className="font-headline-sm text-headline-sm text-on-surface">TunnelSight Observability Engine</span></div><p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">Deterministic protocol diagnostics, deep packet inspection, and cryptographic audit posture for mission-critical IPsec and IKEv2 infrastructures.</p><div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline"><span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary"></span><span>KERNEL ENGINE ONLINE: v4.18.0-FIPS</span></div></div><div className="flex flex-col gap-space-xs"><span className="font-label-md text-label-md uppercase tracking-wider text-outline">Product</span><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Capabilities</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Architecture</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Evidence Model</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Live Terminal</Link></div><div className="flex flex-col gap-space-xs"><span className="font-label-md text-label-md uppercase tracking-wider text-outline">Documentation</span><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Engine Specifications</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">RFC 7296 Compliance</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">CLI Integration</Link><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">API References</Link></div><div className="flex flex-col gap-space-xs"><span className="font-label-md text-label-md uppercase tracking-wider text-outline">Compliance</span><span className="font-body-sm text-body-sm text-on-surface-variant">NIST SP 800-77</span><span className="font-body-sm text-body-sm text-on-surface-variant">FIPS 140-3 Posture</span><span className="font-body-sm text-body-sm text-on-surface-variant">Air-Gap Validated</span><span className="font-body-sm text-body-sm text-on-surface-variant">SOC 2 Type II</span></div></div><div className="max-w-7xl mx-auto px-space-base mt-space-xl pt-space-lg border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-md text-label-md text-outline"><div>© 2025 TunnelSight Core Systems. High-assurance forensic telemetry.</div><div className="flex items-center gap-space-md"><Link className="hover:text-on-surface transition-colors" href="#">Security Disclosures</Link><Link className="hover:text-on-surface transition-colors" href="#">Cryptographic Standards</Link><Link className="hover:text-on-surface transition-colors" href="#">Terms of Inspection</Link></div></div></footer>
    </div>
  );
}
