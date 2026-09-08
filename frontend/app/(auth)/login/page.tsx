"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockLogin } from "@/lib/mock/session";
import { DEMO_EMAIL } from "@/lib/mock/flag";
import { useToast } from "@/lib/mock/toast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      const user = mockLogin(String(data.get("email") ?? ""), String(data.get("password") ?? ""));
      toast({ title: `Welcome, ${user.displayName}`, body: "Forensic session initialized.", kind: "ok" });
      router.push("/overview");
    } catch (err) {
      toast({ title: "Sign in failed", body: err instanceof Error ? err.message : "Invalid credentials.", kind: "warn" });
    }
  }

  return (
    <div className="bg-[#0c0e11] text-zinc-300 min-h-screen flex flex-col justify-between antialiased selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Minimal Top Header */}
      <header className="w-full h-14 flex items-center justify-between px-6 border-b border-zinc-800/80 bg-[#111317]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
          <Link href="/" className="font-semibold tracking-tight text-white uppercase text-sm font-mono">TunnelSight</Link>
          <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 bg-[#14171c] px-2 py-0.5 rounded">v2.4.1-SEC</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="material-symbols-outlined text-teal-400 text-[14px]">lock</span>
            FIPS 140-3 &amp; CNSA 1.0 COMPLIANT
          </span>
        </div>
      </header>

      {/* Main Split Container */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-145">
          
          {/* LEFT PANEL: Technical Identity & Operational Telemetry (5 cols) */}
          <div className="lg:col-span-5 bg-[#0e1014] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col justify-between relative">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-mono font-bold text-sm">
                  {'>'}_
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-sm text-white uppercase tracking-wider font-semibold">TunnelSight</span>
                  <span className="text-[10px] font-mono text-teal-400 tracking-widest uppercase">IPsec Security Intelligence</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Evidence-driven analysis for authorized IPsec deployments. High-throughput protocol dissection, state integrity validation, and continuous cryptographic compliance auditing.
              </p>

              {/* Telemetry Node Spec Sheet */}
              <div className="bg-[#14171c] border border-zinc-800/80 p-4 rounded-sm space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-500">
                  <span>KERNEL SUB</span>
                  <span className="text-zinc-200 font-medium">4.18.0-FIPS // ZERO-COPY</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>INGRESS RING</span>
                  <span className="text-teal-400 font-medium">DPDK RX POOL · ACTIVE</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>ENCRYPT SUITE</span>
                  <span className="text-zinc-200 font-medium">AES-256-GCM / SHA-384</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>NODE REF</span>
                  <span className="text-zinc-200 font-medium">sec-gw02.us-east.tier3</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 rounded text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ENGINE: ONLINE (DPDK 22.11)
                </span>
                <span className="px-2 py-0.5 bg-zinc-800/60 text-zinc-400 rounded text-[11px]">
                  LATENCY: 0.24ms
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
                MUTUAL AUTH &amp; FIDO2 / WEBAUTHN ENFORCED
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: Authentication Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#111317]">
            <div className="w-full max-w-md mx-auto space-y-6">
              
              <div className="space-y-1.5">
                <h1 className="font-display-serif text-3xl text-white tracking-tight">Sign In</h1>
                <p className="text-xs text-zinc-400 font-mono">
                  Enter your credentials to access the analytical workbench.
                </p>
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="work-email">
                    Work Email
                  </label>
                  <input 
                    autoComplete="username" 
                    className="w-full h-9 px-3 bg-[#14171c] border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-500/50 transition-colors" 
                    id="work-email" 
                    name="email" 
                    placeholder="analyst@enterprise.internal" 
                    defaultValue={DEMO_EMAIL}
                    required 
                    type="email" 
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="auth-password">
                      Passphrase
                    </label>
                    <Link href="/forgot-password" className="text-[11px] font-mono text-teal-400 hover:text-teal-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <input 
                      autoComplete="current-password" 
                      className="w-full h-9 px-3 pr-10 bg-[#14171c] border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-500/50 transition-colors" 
                      id="auth-password" 
                      name="password" 
                      placeholder="••••••••••••••••" 
                      defaultValue="tunnelsight-demo"
                      required 
                      type={showPassword ? "text" : "password"} 
                    />
                    <button 
                      aria-label="Toggle password visibility" 
                      className="absolute right-2.5 p-1 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none" 
                      type="button" 
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Keep Active Checkbox */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-400 hover:text-zinc-200 transition-colors">
                    <input className="w-3.5 h-3.5 bg-[#14171c] border border-zinc-700 text-teal-400 rounded accent-teal-400 cursor-pointer" type="checkbox" defaultChecked />
                    <span className="text-[11px] font-mono">Keep session active for 12h</span>
                  </label>
                </div>

                {/* Primary Button */}
                <button 
                  className="w-full h-9 bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs font-mono rounded-sm flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm" 
                  type="submit"
                >
                  <span>Sign In to Terminal</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                <p className="pt-2 text-center text-[11px] font-mono text-zinc-500">
                  Prototype demo account: <span className="text-teal-400">{DEMO_EMAIL}</span> · <span className="text-teal-400">tunnelsight-demo</span>
                </p>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="w-full h-[1px] bg-zinc-800"></div>
                <span className="absolute bg-[#111317] px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Enterprise Access
                </span>
              </div>

              {/* Enterprise SSO */}
              <button 
                onClick={() => toast({ title: "Enterprise IdP", body: "SSO is routed to local enclave — use demo account.", kind: "info" })} 
                className="w-full h-9 bg-[#14171c] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-mono rounded-sm flex items-center justify-center gap-2 transition-colors" 
                type="button"
              >
                <span className="material-symbols-outlined text-teal-400 text-[16px]">domain</span>
                <span>Authenticate via Enterprise IdP (SAML / OIDC)</span>
              </button>

              {/* New User Link */}
              <div className="pt-2 text-center text-xs font-mono text-zinc-500">
                <span>Need analyst provisioning?</span>
                <Link href="/register" className="text-teal-400 hover:text-teal-300 font-medium ml-1.5 transition-colors">
                  Create an account
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Global Bottom Bar */}
      <footer className="w-full py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 border-t border-zinc-800/80 bg-[#0e1014] text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            CORE TELEMETRY READY
          </span>
          <span>© 2025 TUNNELSIGHT INC.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">SECURITY ADVISORY</span>
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">HARDWARE TOKENS</span>
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">RFC 7296 SPECS</span>
        </div>
      </footer>

    </div>
  );
}
