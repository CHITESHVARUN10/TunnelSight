"use client";

import Link from "next/link";

type Accent = "teal" | "ember";
type Tone = "auto" | "dark";

const ACCENT: Record<Accent, { text: string; hover: string; beam: string; dot: string }> = {
  teal: {
    text: "text-primary",
    hover: "hover:text-primary",
    beam: "via-primary/60",
    dot: "bg-primary",
  },
  ember: {
    text: "text-[#d97757]",
    hover: "hover:text-[#d97757]",
    beam: "via-[#d97757]/60",
    dot: "bg-[#d97757]",
  },
};

/* Editorial end-card shared by landing and docs. Tone "auto" follows the
   site theme via semantic tokens; tone "dark" pins terminal-dark treatment
   for pages that are always dark (e.g. /docs). */
export function Footer({ accent = "teal", tone = "auto" }: { accent?: Accent; tone?: Tone }) {
  const a = ACCENT[accent];
  const dark = tone === "dark";

  const shell = dark
    ? "bg-[#05070d] border-white/[0.06] text-zinc-400"
    : "bg-surface border-hairline text-on-surface-variant";
  const heading = dark ? "text-zinc-200" : "text-on-surface";
  const body = dark ? "text-zinc-400" : "text-on-surface-variant";
  const faint = dark ? "text-zinc-600" : "text-outline";
  const wordmark = dark ? "text-white/[0.92]" : "text-on-surface";
  const baseline = dark ? "via-zinc-800/80" : "via-outline-variant";

  return (
    <footer className={`relative w-full border-t overflow-hidden select-none ${shell}`}>
      {/* Top ambient hairline */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${a.beam} to-transparent`} />

      {/* Top content grid: brand + 3 link columns */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & status */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <span
                className={`w-8 h-8 rounded-sm border flex items-center justify-center transition-colors ${a.text} ${
                  dark ? "bg-white/[0.03] border-white/10" : "bg-primary/10 border-primary/25"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">security</span>
              </span>
              <div className="flex flex-col">
                <span className={`font-display-serif text-lg font-bold tracking-tight ${heading}`}>
                  TunnelSight
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-wider ${faint}`}>
                  IPsec Observability &amp; Audit
                </span>
              </div>
            </Link>

            <p className={`font-sans text-xs leading-relaxed max-w-sm ${body}`}>
              Deterministic protocol diagnostics, deep packet decapsulation, and cryptographic compliance posture for mission-critical IPsec infrastructures.
            </p>

            <div className={`flex items-center gap-2 font-mono text-[11px] mt-1 ${faint}`}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className={heading}>ENGINE ONLINE</span>
              <span aria-hidden="true">·</span>
              <span>FIPS 140-3 CONFORMANT</span>
            </div>

            <span className={`font-mono text-[11px] mt-2 ${faint}`}>
              &copy; 2026 TunnelSight Engineering. All rights reserved.
            </span>
          </div>

          {/* 3 link columns — every entry resolves to a real destination */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <nav className="flex flex-col gap-3" aria-label="Operations">
              <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${heading}`}>
                Operations
              </span>
              <div className={`flex flex-col gap-2.5 text-xs font-sans ${body}`}>
                <Link href="/overview" className={a.hover}>Overview</Link>
                <Link href="/analyze" className={a.hover}>Analyze PCAP</Link>
                <Link href="/docs" className={a.hover}>Documentation Hub</Link>
                <Link href="/analysis/live" className={a.hover}>Live Monitoring</Link>
                <Link href="/analysis/findings" className={a.hover}>Findings Matrix</Link>
                <Link href="/analysis/traffic" className={a.hover}>Traffic Intelligence</Link>
              </div>
            </nav>

            <nav className="flex flex-col gap-3" aria-label="Standards">
              <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${heading}`}>
                Standards
              </span>
              <div className={`flex flex-col gap-2.5 text-xs font-sans ${body}`}>
                <Link href="/docs#chapter-2" className={a.hover}>RFC 7296 (IKEv2)</Link>
                <Link href="/docs#chapter-3" className={a.hover}>RFC 8247 (Ciphers)</Link>
                <Link href="/docs#chapter-5" className={a.hover}>NIST SP 800-77r1</Link>
                <Link href="/docs#chapter-5" className={a.hover}>CNSA 1.0 Posture</Link>
                <Link href="/docs#chapter-3" className={a.hover}>FIPS 140-3 Testing</Link>
              </div>
            </nav>

            <nav className="flex flex-col gap-3" aria-label="Platform">
              <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${heading}`}>
                Platform
              </span>
              <div className={`flex flex-col gap-2.5 text-xs font-sans ${body}`}>
                <Link href="/register" className={a.hover}>Sign Up</Link>
                <Link href="/login" className={a.hover}>Analyst Login</Link>
                <Link href="/dataset" className={a.hover}>Testbed Console</Link>
                <Link href="/settings" className={a.hover}>Engine Settings</Link>
                <Link href="/analysis/reports" className={a.hover}>Audit Reports</Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Horizon beam — the single light source */}
      <div className="relative w-full">
        <div className={`w-full max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent ${a.beam} to-transparent`} />
      </div>

      {/* Sculptural wordmark statement */}
      <div className="relative w-full flex flex-col justify-center items-center pointer-events-none select-none overflow-hidden pt-10 pb-20 md:pb-28">
        <div className={`flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase mb-3 z-10 ${a.text}`}>
          <span className={`w-6 h-px bg-gradient-to-r from-transparent ${a.beam}`} />
          <span>Cryptographic Intelligence &amp; Protocol Observability</span>
          <span className={`w-6 h-px bg-gradient-to-l from-transparent ${a.beam}`} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <span
            className={`font-display-serif font-black tracking-[-0.04em] text-[clamp(4.8rem,15vw,15.5rem)] leading-[0.75] text-center whitespace-nowrap ${wordmark}`}
          >
            TunnelSight
          </span>
        </div>

        <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${baseline} to-transparent`} />
      </div>
    </footer>
  );
}

export default Footer;
