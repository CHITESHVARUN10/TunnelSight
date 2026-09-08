"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#07080b] border-t border-zinc-800/80 overflow-hidden select-none">
      {/* Subtle top ambient gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      {/* Top content grid: Brand info on left, 4 distinct columns on right */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <span className="w-8 h-8 rounded-sm bg-teal-950/50 border border-teal-500/50 flex items-center justify-center shadow-[0_0_18px_rgba(20,184,166,0.2)] group-hover:border-teal-400 transition-colors">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">security</span>
              </span>
              <div className="flex flex-col">
                <span className="font-display-serif text-lg text-white font-bold tracking-tight group-hover:text-teal-300 transition-colors">
                  TunnelSight
                </span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  IPsec Observability &amp; Audit
                </span>
              </div>
            </Link>

            <p className="font-sans text-xs text-zinc-400 leading-relaxed max-w-sm">
              Deterministic protocol diagnostics, deep packet decapsulation, and cryptographic compliance posture for mission-critical IPsec infrastructures.
            </p>

            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 mt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-zinc-300 font-medium">ENGINE ONLINE</span>
              <span className="text-zinc-700">·</span>
              <span>FIPS 140-3 CONFORMANT</span>
            </div>

            <span className="font-mono text-[11px] text-zinc-600 mt-2">
              &copy; 2025 TunnelSight Engineering. All rights reserved.
            </span>
          </div>

          {/* 4 Categorized Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Operations */}
            <div className="flex flex-col gap-3 font-mono">
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Operations
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-sans">
                <Link href="/overview" className="hover:text-teal-400 transition-colors">Overview</Link>
                <Link href="/analyze" className="hover:text-teal-400 transition-colors">Analyze PCAP</Link>
                <Link href="/docs" className="hover:text-teal-400 transition-colors font-medium text-teal-400/90">Documentation Hub</Link>
                <Link href="/analysis/live" className="hover:text-teal-400 transition-colors">Live Monitoring</Link>
                <Link href="/analysis/findings" className="hover:text-teal-400 transition-colors">Findings Matrix</Link>
                <Link href="/analysis/traffic" className="hover:text-teal-400 transition-colors">Traffic Intelligence</Link>
              </div>
            </div>

            {/* Column 2: Standards */}
            <div className="flex flex-col gap-3 font-mono">
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Standards
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-sans">
                <Link href="/docs#standards" className="hover:text-teal-400 transition-colors">RFC 7296 (IKEv2)</Link>
                <Link href="/docs#standards" className="hover:text-teal-400 transition-colors">RFC 8247 (Ciphers)</Link>
                <Link href="/docs#standards" className="hover:text-teal-400 transition-colors">NIST SP 800-77r1</Link>
                <Link href="/docs#standards" className="hover:text-teal-400 transition-colors">CNSA 1.0 Posture</Link>
                <span className="hover:text-zinc-200 transition-colors cursor-default">FIPS 140-3 Testing</span>
              </div>
            </div>

            {/* Column 3: Governance */}
            <div className="flex flex-col gap-3 font-mono">
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Governance
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-sans">
                <span className="hover:text-zinc-200 transition-colors cursor-default">Zero Speculation SLA</span>
                <span className="hover:text-zinc-200 transition-colors cursor-default">Data Sovereignty</span>
                <span className="hover:text-zinc-200 transition-colors cursor-default">Security Advisories</span>
                <span className="hover:text-zinc-200 transition-colors cursor-default">Privacy Policy</span>
                <span className="hover:text-zinc-200 transition-colors cursor-default">Terms of Service</span>
              </div>
            </div>

            {/* Column 4: Platform */}
            <div className="flex flex-col gap-3 font-mono">
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Platform
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-sans">
                <Link href="/register" className="hover:text-teal-400 transition-colors">Sign Up</Link>
                <Link href="/login" className="hover:text-teal-400 transition-colors">Analyst Login</Link>
                <Link href="/dataset" className="hover:text-teal-400 transition-colors">Testbed Console</Link>
                <Link href="/settings" className="hover:text-teal-400 transition-colors">Engine Settings</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radiant Horizontal Horizon Beam */}
      <div className="relative w-full">
        <div className="w-full max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent shadow-[0_0_20px_rgba(20,184,166,0.5)]" />
      </div>

      {/* ============ SCULPTURAL "TUNNELSIGHT" AURORA HORIZON STATEMENT ============ */}
      <div className="relative w-full flex flex-col justify-center items-center pointer-events-none select-none overflow-hidden pt-10 pb-12 md:pb-20">
        {/* Layer 1: Deep Ethereal Aurora Light Curtain (Teal Core + Royal Violet Corona) */}
        <div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[840px] md:w-[1100px] h-[280px] md:h-[340px] pointer-events-none opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 80%, rgba(20, 184, 166, 0.28) 0%, rgba(99, 102, 241, 0.20) 45%, rgba(139, 92, 246, 0.10) 70%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />

        {/* Layer 2: Vivid Cyan/Emerald Upward Horizon Bloom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[580px] md:w-[750px] h-[160px] pointer-events-none opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 55% 40% at 50% 100%, rgba(45, 212, 191, 0.35) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 85%)",
            filter: "blur(40px)",
          }}
        />

        {/* Layer 3: Architectural Subline */}
        <div className="flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-teal-400/70 mb-3 z-10">
          <span className="w-6 h-px bg-gradient-to-r from-transparent to-teal-400/60" />
          <span>Cryptographic Intelligence &amp; Protocol Observability</span>
          <span className="w-6 h-px bg-gradient-to-l from-transparent to-teal-400/60" />
        </div>

        {/* Layer 4: Sculpted Typographic Centerpiece */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="font-display-serif font-black tracking-[-0.04em] text-[clamp(4.8rem,15vw,15.5rem)] leading-[0.75] text-center whitespace-nowrap bg-gradient-to-b from-white/95 via-zinc-200/50 to-transparent bg-clip-text text-transparent filter drop-shadow-[0_0_40px_rgba(20,184,166,0.35)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            TunnelSight
          </span>
        </div>

        {/* Layer 5: Ground Perspective Baseline Hairline */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent" />
      </div>
    </footer>
  );
}

export default Footer;
