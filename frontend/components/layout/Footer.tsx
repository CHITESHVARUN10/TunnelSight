"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#090b0e] border-t border-zinc-800/80 overflow-hidden select-none">
      {/* Subtle top ambient gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      {/* Top content grid: Brand info on left, 4 distinct columns on right */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <span className="w-8 h-8 rounded-sm bg-teal-950/40 border border-teal-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.15)] group-hover:border-teal-400 transition-colors">
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
              <span className="text-zinc-400">ENGINE ONLINE</span>
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
                <span className="hover:text-zinc-200 transition-colors cursor-default">RFC 7296 (IKEv2)</span>
                <span className="hover:text-zinc-200 transition-colors cursor-default">RFC 8247 (Ciphers)</span>
                <span className="hover:text-zinc-200 transition-colors cursor-default">NIST SP 800-77r1</span>
                <span className="hover:text-zinc-200 transition-colors cursor-default">CNSA 1.0 Posture</span>
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

      {/* Decorative hairline divider before watermark */}
      <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent mt-4 mb-2" />

      {/* Bottom Sculptural "TunnelSight" Architectural Statement */}
      <div className="relative w-full flex flex-col justify-center items-center pointer-events-none select-none overflow-hidden pt-8 pb-10 md:pb-14">
        {/* Subtle radial ambient lens glow behind typography */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[720px] h-[190px] bg-teal-500/[0.08] blur-[110px] rounded-full pointer-events-none" />

        <span className="font-display-serif font-black tracking-[-0.04em] text-[clamp(4.5rem,14vw,14.5rem)] leading-[0.8] text-center whitespace-nowrap bg-gradient-to-b from-white/[0.22] via-zinc-300/[0.09] to-transparent bg-clip-text text-transparent filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          TunnelSight
        </span>
      </div>
    </footer>
  );
}

export default Footer;
