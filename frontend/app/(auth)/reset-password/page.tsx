"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

type TokenState = "valid" | "success" | "expired" | "invalid";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [tokenState, setTokenState] = useState<TokenState>("valid");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (newPassword !== confirmPassword) {
      setFormError("Passphrases do not match.");
      return;
    }
    const token = params.get("token") ?? "";
    if (!token) {
      setTokenState("invalid");
      return;
    }
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      setTokenState("success");
    } catch (err) {
      setTokenState("expired");
    }
  }

  const strength =
    newPassword.length < 8
      ? { label: "WEAK (BELOW THRESHOLD)", className: "text-rose-400 font-semibold" }
      : newPassword.length < 12
        ? { label: "MODERATE", className: "text-amber-400 font-semibold" }
        : { label: "STRONG (CNSA 1.0 COMPLIANT)", className: "text-teal-400 font-semibold" };

  return (
    <div className="bg-[#0c0e11] text-zinc-300 min-h-screen flex flex-col justify-between antialiased selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Minimal Topbar */}
      <header className="w-full h-14 border-b border-zinc-800/80 px-6 flex items-center justify-between text-xs font-mono bg-[#111317]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
          <Link href="/" className="font-semibold tracking-tight text-white uppercase text-sm font-mono">TunnelSight</Link>
          <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 bg-[#14171c] px-2 py-0.5 rounded">v2.4.1-SEC</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-teal-400 text-[14px]">lock</span>
            <span className="tracking-wide">EPHEMERAL TOKEN AUTH // TLS 1.3</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-[11px] text-zinc-500">FIPS 140-3 &amp; RFC 7296 CONFORMANCE</span>
        </div>
      </header>

      {/* Main Centered Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-[#111317] border border-zinc-800/80 rounded-sm shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          
          {/* Left Column: Security Context (5 cols) */}
          <div className="lg:col-span-5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col justify-between bg-[#0e1014] relative">
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
                Evidence-driven analysis for authorized IPsec deployments. Secure cryptographic key rotation and token-validated analyst authentication.
              </p>

              {/* Technical Posture Attributes */}
              <div className="border border-zinc-800 bg-[#14171c] rounded-sm p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>TOKEN CONDUIT</span>
                  <span className="text-zinc-200">HMAC-SHA384-SEC</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>AUTH ENCLAVE</span>
                  <span className="text-teal-400">idp-vault.internal</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>ENTROPY TARGET</span>
                  <span className="text-zinc-200">CNSA 1.0 (128-bit)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>AUDIT LOGGING</span>
                  <span className="text-zinc-200">LEDGER IMMUTABLE</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></div>
                <span>VAULT RE-KEY READY</span>
              </div>
              <span>LATENCY: 0.16ms</span>
            </div>
          </div>

          {/* Right Column: Reset Workspace (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-[#111317]">

            <div>
              {/* STATE 1: VALID RESET TOKEN */}
              <div id="state-valid" className={tokenState === "valid" ? "space-y-6" : "hidden"}>
                <div className="space-y-1.5">
                  <h1 className="font-display-serif text-3xl text-white tracking-tight">Create New Password</h1>
                  <p className="text-xs text-zinc-400 font-mono">
                    Set a high-entropy passphrase to restore access to your analyst workbench.
                  </p>
                </div>

                {/* Verified Context Badge */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#14171c] border border-zinc-800 rounded-sm text-xs font-mono">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="material-symbols-outlined text-[16px] text-teal-400">verified_user</span>
                    <span>TARGET:</span>
                    <span className="text-zinc-200 font-medium">analyst@enterprise.internal</span>
                  </div>
                  <span className="text-teal-400 text-[10px] bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded font-mono">
                    TOKEN VALID (08:42 REMAINING)
                  </span>
                </div>

                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="new-password" className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      New Passphrase
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type={showNew ? "text" : "password"} 
                        id="new-password" 
                        placeholder="••••••••••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-9 px-3 pr-9 bg-[#14171c] border border-zinc-800 focus:border-teal-500/50 rounded-sm text-xs text-white font-mono placeholder-zinc-600 outline-none transition-colors"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNew((v) => !v)} 
                        className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">{showNew ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Confirm Passphrase
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type={showConfirm ? "text" : "password"} 
                        id="confirm-password" 
                        placeholder="••••••••••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-9 px-3 pr-9 bg-[#14171c] border border-zinc-800 focus:border-teal-500/50 rounded-sm text-xs text-white font-mono placeholder-zinc-600 outline-none transition-colors"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirm((v) => !v)} 
                        className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">{showConfirm ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Strength Bar */}
                  <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 uppercase text-[10px]">Strength:</span>
                      <span id="strength-label" className={strength.className}>{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1">
                      <div className="bg-teal-400 rounded-full"></div>
                      <div className="bg-teal-400 rounded-full"></div>
                      <div className="bg-teal-400 rounded-full"></div>
                      <div className="bg-teal-400 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-zinc-400">
                      <div className="flex items-center gap-1.5 text-teal-400">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        <span className="text-zinc-300">Min 12 characters</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-400">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        <span className="text-zinc-300">Upper &amp; lowercase</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-400">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        <span className="text-zinc-300">At least 1 numeral</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-400">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        <span className="text-zinc-300">Special symbol (#$!%*)</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action */}
                  {formError !== "" && (
                    <p className="text-[11px] font-mono text-rose-400">{formError}</p>
                  )}
                  <button 
                    type="submit" 
                    className="w-full h-9 bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs font-mono rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
                  >
                    <span>Update Password</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>

                  <div className="text-center pt-1">
                    <Link href="/login" className="text-xs font-mono text-zinc-500 hover:text-teal-400 transition-colors inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                      <span>Return to sign in</span>
                    </Link>
                  </div>
                </form>
              </div>

              {/* STATE 2: SUCCESS */}
              <div id="state-success" className={tokenState === "success" ? "space-y-6" : "hidden"}>
                <div className="w-10 h-10 rounded-sm bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>

                <div className="space-y-1.5">
                  <h1 className="font-display-serif text-3xl text-white tracking-tight">Password Updated</h1>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    Your credentials have been securely rotated across all enterprise auth enclaves. Prior active web sessions have been terminated.
                  </p>
                </div>

                <div className="border border-zinc-800 bg-[#14171c] rounded-sm p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>ROTATION STATUS</span>
                    <span className="text-teal-400 font-semibold">SUCCESS // ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>TARGET USER</span>
                    <span className="text-white">analyst@enterprise.internal</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>TIMESTAMP</span>
                    <span className="text-zinc-300">2026-09-08T14:48:02Z</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>SESSIONS INVALIDATED</span>
                    <span className="text-white">3 active connections pruned</span>
                  </div>
                </div>

                <button 
                  onClick={() => router.push("/login")} 
                  type="button" 
                  className="w-full h-9 bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs font-mono rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Proceed to Sign In Terminal</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* STATE 3: EXPIRED */}
              <div id="state-expired" className={tokenState === "expired" ? "space-y-6" : "hidden"}>
                <div className="w-10 h-10 rounded-sm bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>

                <div className="space-y-1.5">
                  <h1 className="font-display-serif text-3xl text-white tracking-tight">Reset Link Expired</h1>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    Password authorization tokens are cryptographically bounded to a 15-minute TTL to comply with zero-trust policy.
                  </p>
                </div>

                <div className="border border-amber-800/40 bg-amber-950/30 rounded-sm p-4 font-mono text-xs space-y-2 text-amber-300">
                  <div className="flex justify-between">
                    <span className="text-amber-400/70">TOKEN LIFESPAN:</span>
                    <span>15 MINUTES (EXCEEDED)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400/70">DISPATCH TIME:</span>
                    <span>14:12:00 UTC (18m ago)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    type="button" 
                    onClick={() => setTokenState("valid")}
                    className="w-full h-9 bg-[#14171c] hover:bg-zinc-800 text-white border border-zinc-800 font-mono text-xs rounded-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Request New Reset Link</span>
                  </button>
                  <div className="text-center pt-1">
                    <Link href="/login" className="text-xs font-mono text-zinc-500 hover:text-teal-400 transition-colors inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                      <span>Return to sign in</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* STATE 4: INVALID */}
              <div id="state-invalid" className={tokenState === "invalid" ? "space-y-6" : "hidden"}>
                <div className="w-10 h-10 rounded-sm bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                </div>

                <div className="space-y-1.5">
                  <h1 className="font-display-serif text-3xl text-white tracking-tight">Invalid or Revoked Token</h1>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    The cryptographic verification token signature could not be verified by the auth vault. It may have been revoked or malformed.
                  </p>
                </div>

                <div className="border border-rose-800/40 bg-rose-950/30 rounded-sm p-4 font-mono text-xs space-y-2 text-rose-300">
                  <div className="flex justify-between">
                    <span className="text-rose-400/70">AUTH FAULT:</span>
                    <span>HMAC_SIGNATURE_MISMATCH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-400/70">NONCE INTEGRITY:</span>
                    <span>UNRECOGNIZED_DIGEST</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    type="button" 
                    onClick={() => setTokenState("valid")}
                    className="w-full h-9 bg-[#14171c] hover:bg-zinc-800 text-white border border-zinc-800 font-mono text-xs rounded-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Request New Authorization Link</span>
                  </button>
                  <div className="text-center pt-1">
                    <Link href="/login" className="text-xs font-mono text-zinc-500 hover:text-teal-400 transition-colors inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                      <span>Return to sign in</span>
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Security Guarantee Footer */}
            <div className="pt-6 mt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-teal-400">verified_user</span>
                <span>FIPS 140-3 &amp; Zero-Knowledge Re-Key</span>
              </div>
              <div>
                Compromised token? <span className="text-teal-400 hover:underline cursor-pointer">Revoke identity</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Global Bottom Bar */}
      <footer className="w-full py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 border-t border-zinc-800/80 bg-[#0e1014] text-xs font-mono">
        <div>
          © 2025 TUNNELSIGHT INC. // CRYPTOGRAPHIC ASSURANCE PROTOCOL
        </div>
        <div className="flex items-center gap-6 text-[11px]">
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">SECURITY ADVISORY</span>
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">KEY ROTATION POLICY</span>
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">RFC 7296 SPECS</span>
        </div>
      </footer>

    </div>
  );
}
