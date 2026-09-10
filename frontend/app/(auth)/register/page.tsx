"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/auth";
import { mockRegister } from "@/lib/mock/session";
import { useToast } from "@/lib/mock/toast";

const ALLOW_MOCK_FALLBACK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [metrics, setMetrics] = useState({
    hasLength: false,
    hasCase: false,
    hasNum: false,
    hasSym: false,
    score: 0,
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (password !== confirm) {
      toast({ title: "Passphrases do not match", body: "Confirm passphrase must equal the passphrase.", kind: "warn" });
      return;
    }
    const email = String(data.get("email") ?? "");
    const displayName = String(data.get("full_name") ?? "");
    try {
      await register(email, password);
      await login(email, password);
      try {
        const { api } = await import("@/lib/api");
        await api("/api/profile", {
          method: "PATCH",
          body: JSON.stringify({
            display_name: displayName || undefined,
            organization: String(data.get("organization") ?? "") || undefined,
            role: String(data.get("assigned_role") ?? "") || undefined,
          }),
        });
      } catch {
        // profile enrichment is best-effort; session is already live
      }
      toast({ title: "Workspace provisioned", body: `Signed in as ${email}.`, kind: "ok" });
      router.push("/overview");
    } catch (err) {
      if (ALLOW_MOCK_FALLBACK && err instanceof Error && !/^4\d\d/.test(err.message)) {
        try {
          const user = mockRegister(email, password, displayName);
          toast({ title: "Workspace provisioned", body: `Offline demo as ${user.email}.`, kind: "warn" });
          router.push("/overview");
          return;
        } catch {
          // fall through to real error toast
        }
      }
      toast({ title: "Registration failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  }

  function updatePasswordMetrics(val: string) {
    const hasLength = val.length >= 12;
    const hasCase = /[A-Z]/.test(val) && /[a-z]/.test(val);
    const hasNum = /[0-9]/.test(val);
    const hasSym = /[^A-Za-z0-9]/.test(val);
    let score = 0;
    if (hasLength) score++;
    if (hasCase) score++;
    if (hasNum) score++;
    if (hasSym) score++;
    setMetrics({ hasLength, hasCase, hasNum, hasSym, score });
  }

  const strengthLabels = [
    "INSUFFICIENT (0/4)",
    "WEAK (1/4)",
    "FAIR (2/4)",
    "GOOD (3/4)",
    "STRONG (4/4)",
  ];

  const strengthClassName =
    metrics.score < 2
      ? "text-rose-400 font-semibold"
      : metrics.score < 4
        ? "text-amber-400 font-semibold"
        : "text-teal-400 font-semibold";

  const pipClassName = (idx: number) =>
    idx < metrics.score
      ? "bg-teal-400 rounded-full transition-colors"
      : "bg-zinc-800 rounded-full transition-colors";

  const critClassName = (valid: boolean) =>
    valid
      ? "flex items-center gap-1.5 font-mono text-[11px] text-teal-400"
      : "flex items-center gap-1.5 font-mono text-[11px] text-zinc-500";

  const isMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="bg-[#0c0e11] text-zinc-300 min-h-screen flex flex-col justify-between antialiased selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Top Bar */}
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
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden min-h-[640px]">
          
          {/* Left Column: Product Identity & Verification Context (5 cols) */}
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
                Evidence-driven analysis for authorized IPsec deployments. Provision your cryptographic analyst credentials for authorized forensic trace dissection.
              </p>

              {/* Telemetry Parameters Matrix */}
              <div className="flex flex-col gap-2 bg-[#14171c] border border-zinc-800/80 p-4 rounded-sm font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>AUTH DOMAIN:</span>
                  <span className="text-zinc-200 font-medium">idp.internal.tunnelsight.defense</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>CLEARANCE LEVEL:</span>
                  <span className="text-teal-400 font-medium">Tier 2+ Protocol Forensics</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>CRYPTO KEYRING:</span>
                  <span className="text-zinc-200 font-medium">FIDO2 / Ed25519 Hardware Bound</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>ACCESS PROTOCOL:</span>
                  <span className="text-zinc-200 font-medium">TLS 1.3 / mTLS Enforced</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-3">
              <div className="bg-[#14171c]/60 border border-zinc-800/60 p-3 rounded-sm space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-mono">
                  <span className="material-symbols-outlined text-[14px] text-teal-400">policy</span>
                  <span className="uppercase text-[10px] tracking-wider font-semibold">ORGANIZATION ACCESS POLICY</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Use of TunnelSight is restricted to authorized network analysis. All ingestion sessions, capture traces, and analytical reports are ledger-audited.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  <span>PROVISIONING ENGINE: READY</span>
                </div>
                <span>FIPS 140-3 CONFORMANCE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Create Account Workspace Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#111317] p-8 sm:p-12 flex flex-col justify-center">
            <div className="w-full max-w-xl mx-auto space-y-6">
              
              <div className="space-y-1.5">
                <h1 className="font-display-serif text-3xl text-white tracking-tight">Create Account</h1>
                <p className="text-xs text-zinc-400 font-mono">
                  Enter your credentials to provision analyst workspace access.
                </p>
              </div>

              <form className="space-y-4" id="provision-form" onSubmit={onSubmit}>
                
                {/* Row 1: Full Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="full_name">
                      Full Name
                    </label>
                    <input 
                      className="w-full h-9 px-3 bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono rounded-sm focus:outline-none focus:border-teal-500/50 placeholder:text-zinc-600 transition-colors" 
                      name="full_name" 
                      id="full_name" 
                      placeholder="Dr. Jonathan Chen" 
                      required 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="assigned_role">
                      Forensic Role
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full h-9 px-3 bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono rounded-sm appearance-none focus:outline-none focus:border-teal-500/50 cursor-pointer" 
                        id="assigned_role"
                      >
                        <option value="crypto-analyst">Cryptographic Analyst</option>
                        <option value="secops-eng">SecOps Engineer (Tier 3)</option>
                        <option value="net-forensics">Network Forensics Lead</option>
                        <option value="protocol-auditor">Protocol Integrity Auditor</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-zinc-500 pointer-events-none text-[16px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="organization">
                    Organization / Department
                  </label>
                  <input 
                    className="w-full h-9 px-3 bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono rounded-sm focus:outline-none focus:border-teal-500/50 placeholder:text-zinc-600 transition-colors" 
                    name="organization" 
                    id="organization" 
                    placeholder="Cyber Defense Command / Tier 3 SOC" 
                    required 
                    type="text" 
                  />
                </div>

                {/* Work Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="email">
                    Enterprise Identity / Work Email
                  </label>
                  <input 
                    className="w-full h-9 px-3 bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono rounded-sm focus:outline-none focus:border-teal-500/50 placeholder:text-zinc-600 transition-colors" 
                    name="email" 
                    id="email" 
                    placeholder="analyst@enterprise.internal" 
                    required 
                    type="email" 
                  />
                </div>

                {/* Passphrase & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="password">
                      Passphrase
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        className="w-full h-9 px-3 pr-9 bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono rounded-sm focus:outline-none focus:border-teal-500/50 placeholder:text-zinc-600 transition-colors" 
                        name="password" 
                        id="password" 
                        placeholder="••••••••••••••••" 
                        required 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onInput={(e) => { const val = e.currentTarget.value; setPassword(val); updatePasswordMetrics(val); }} 
                      />
                      <button 
                        aria-label="Toggle password visibility" 
                        className="absolute right-2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors flex items-center" 
                        type="button" 
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        <span className="material-symbols-outlined text-[16px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider" htmlFor="confirm_password">
                      Confirm Passphrase
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        className={`w-full h-9 px-3 pr-9 bg-[#14171c] border text-zinc-200 text-xs font-mono rounded-sm focus:outline-none placeholder:text-zinc-600 transition-colors ${
                          isMismatch ? "border-rose-500 focus:border-rose-500" : "border-zinc-800 focus:border-teal-500/50"
                        }`} 
                        name="confirm_password" 
                        id="confirm_password" 
                        placeholder="••••••••••••••••" 
                        required 
                        type={showConfirm ? "text" : "password"} 
                        value={confirm} 
                        onInput={(e) => setConfirm(e.currentTarget.value)} 
                      />
                      <button 
                        aria-label="Toggle confirm password visibility" 
                        className="absolute right-2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors flex items-center" 
                        type="button" 
                        onClick={() => setShowConfirm((v) => !v)}
                      >
                        <span className="material-symbols-outlined text-[16px]">{showConfirm ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-500 uppercase text-[10px]">Strength Score:</span>
                    <span className={strengthClassName} id="strength-label">{strengthLabels[metrics.score]}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1">
                    <div className={pipClassName(0)} id="pip-1"></div>
                    <div className={pipClassName(1)} id="pip-2"></div>
                    <div className={pipClassName(2)} id="pip-3"></div>
                    <div className={pipClassName(3)} id="pip-4"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className={critClassName(metrics.hasLength)} id="crit-len">
                      <span className="material-symbols-outlined text-[12px]">{metrics.hasLength ? "check" : "remove"}</span>
                      <span>Min 12 chars</span>
                    </div>
                    <div className={critClassName(metrics.hasCase)} id="crit-case">
                      <span className="material-symbols-outlined text-[12px]">{metrics.hasCase ? "check" : "remove"}</span>
                      <span>Upper &amp; lower</span>
                    </div>
                    <div className={critClassName(metrics.hasNum)} id="crit-num">
                      <span className="material-symbols-outlined text-[12px]">{metrics.hasNum ? "check" : "remove"}</span>
                      <span>Numeral</span>
                    </div>
                    <div className={critClassName(metrics.hasSym)} id="crit-sym">
                      <span className="material-symbols-outlined text-[12px]">{metrics.hasSym ? "check" : "remove"}</span>
                      <span>Special char</span>
                    </div>
                  </div>
                </div>

                {/* Primary Button */}
                <button 
                  className="w-full h-9 bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs font-mono rounded-sm flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm" 
                  type="submit"
                >
                  <span>Create Analyst Account</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                {/* Link to login */}
                <div className="flex items-center justify-center pt-1 text-xs font-mono text-zinc-500">
                  <span>Already have an account?</span>
                  <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium ml-1.5 transition-colors">
                    Sign in
                  </Link>
                </div>

                {/* Hardware Token Assurance */}
                <div className="bg-[#0e1014] border border-zinc-800 px-3 py-2 rounded-sm flex items-center justify-center gap-2 text-zinc-500 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-teal-400">lock_person</span>
                  <span>Hardware security key (FIDO2/WebAuthn) enrollment required upon initial sign-in.</span>
                </div>

              </form>
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
