"use client";

import { useState } from "react";

type TokenState = "valid" | "success" | "expired" | "invalid";

export default function ResetPasswordPage() {
  const [tokenState, setTokenState] = useState<TokenState>("valid");
  const [newPassword, setNewPassword] = useState("Kx8!mQ9#vL2p$Zt1");
  const [confirmPassword, setConfirmPassword] = useState("Kx8!mQ9#vL2p$Zt1");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTokenState("success");
  }

  const strength =
    newPassword.length < 8
      ? { label: "WEAK (BELOW THRESHOLD)", className: "text-amber-400 font-semibold" }
      : newPassword.length < 12
        ? { label: "MODERATE", className: "text-amber-200 font-semibold" }
        : { label: "STRONG (CNSA 1.0 COMPLIANT)", className: "text-brand font-semibold" };

  const tokenTabClassName = (s: TokenState) =>
    s === tokenState
      ? "px-2.5 py-1 rounded text-white bg-[#22252a] font-medium transition-colors"
      : "px-2.5 py-1 rounded text-[#727b8e] hover:text-white transition-colors";

  const toggleBtnClassName = (visible: boolean) =>
    visible
      ? "absolute right-3 top-1/2 -translate-y-1/2 text-brand hover:text-white transition-colors"
      : "absolute right-3 top-1/2 -translate-y-1/2 text-[#59606d] hover:text-white transition-colors";
  return (
    <div className="min-h-screen bg-[#0c0e11] text-[#e1e4ea] font-sans antialiased flex flex-col justify-between selection:bg-brand selection:text-black">


  {/* Minimal Global Topbar */}
  <header className="w-full border-b border-[#1a1c1f] px-6 py-4 flex items-center justify-between text-xs font-mono">
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
      <span className="font-semibold tracking-wider text-white uppercase text-sm">TunnelSight</span>
      <span className="text-[#59606d] border border-[#23272e] px-1.5 py-0.5 rounded text-[10px]">v2.4.0-SEC</span>
    </div>
    <div className="flex items-center space-x-6 text-[#727b8e]">
      <div className="flex items-center space-x-2">
        <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="tracking-wide">EPHEMERAL TOKEN AUTH // TLS 1.3</span>
      </div>
      <span className="text-[#3c424e] hidden sm:inline">|</span>
      <span className="hidden sm:inline text-[11px] text-[#59606d]">FIPS 140-3 &amp; RFC 7296 CONFORMANCE</span>
    </div>
  </header>

  {/* Main Centered Authentication Stage */}
  <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
    <div className="w-full max-w-5xl bg-[#111317] border border-[#23272e] rounded-lg shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
      
      {/* Left Column: Security Context & Brand Geometry (5 cols) */}
      <div className="lg:col-span-5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#1e2229] flex flex-col justify-between grid-bg relative">
        <div>
          {/* Terminal Mark */}
          <div className="w-10 h-10 rounded bg-brand/10 border border-brand/30 flex items-center justify-center mb-6">
            <span className="text-brand font-mono font-bold text-base">&gt;_</span>
          </div>

          <h2 className="text-lg font-mono font-semibold tracking-wide text-white uppercase">TunnelSight</h2>
          <p className="text-xs font-mono text-brand mb-4 tracking-wider">IPSEC SECURITY INTELLIGENCE</p>
          
          <p className="text-sm text-[#8c94a4] leading-relaxed mb-8">
            Evidence-driven analysis for authorized IPsec deployments. Secure cryptographic key rotation and token-validated analyst authentication.
          </p>

          {/* Technical Posture Attributes */}
          <div className="border border-[#1e2229] bg-[#0c0e11]/80 rounded p-4 font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between text-[#8c94a4]">
              <span className="text-[#59606d]">TOKEN CONDUIT</span>
              <span className="text-white">HMAC-SHA384-SEC</span>
            </div>
            <div className="flex items-center justify-between text-[#8c94a4]">
              <span className="text-[#59606d]">AUTH ENCLAVE</span>
              <span className="text-[#02c39a]">idp-vault.internal</span>
            </div>
            <div className="flex items-center justify-between text-[#8c94a4]">
              <span className="text-[#59606d]">ENTROPY TARGET</span>
              <span className="text-brand">CNSA 1.0 (128-bit)</span>
            </div>
            <div className="flex items-center justify-between text-[#8c94a4]">
              <span className="text-[#59606d]">AUDIT LOGGING</span>
              <span className="text-white">LEDGER IMMUTABLE</span>
            </div>
          </div>
        </div>

        {/* Left Column Footer Status */}
        <div className="pt-6 mt-6 border-t border-[#1e2229]/80 flex items-center justify-between text-[11px] font-mono text-[#59606d]">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
            <span>VAULT RE-KEY READY</span>
          </div>
          <span>SESSION LATENCY: 0.16ms</span>
        </div>
      </div>

      {/* Right Column: Interactive Reset Password Workspace (7 cols) */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-[#111317]">
        
        {/* Top: State Switcher Bar for Interactive Exploration */}
        <div>
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#1e2229]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#59606d]">TOKEN STATE SIMULATION:</span>
            <div className="inline-flex rounded border border-[#23272e] p-0.5 bg-[#0c0e11] text-[11px] font-mono">
<button id="btn-valid" className={tokenTabClassName("valid")} onClick={() => setTokenState("valid")}>Valid</button>
<button id="btn-success" className={tokenTabClassName("success")} onClick={() => setTokenState("success")}>Success</button>
<button id="btn-expired" className={tokenTabClassName("expired")} onClick={() => setTokenState("expired")}>Expired</button>
<button id="btn-invalid" className={tokenTabClassName("invalid")} onClick={() => setTokenState("invalid")}>Invalid</button>
            </div>
          </div>

{/* STATE 1: VALID RESET TOKEN (PRIMARY INTERFACE) */}
<div id="state-valid" className={tokenState === "valid" ? "space-y-6" : "hidden space-y-6"}>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create a new password</h1>
              <p className="text-sm text-[#8c94a4]">
                Set a high-entropy passphrase to restore access to your analyst workbench.
              </p>
            </div>

            {/* Verified Context Badge */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#16191f] border border-[#222731] rounded text-xs font-mono">
              <div className="flex items-center space-x-2 text-[#9ea7b8]">
                <svg className="w-4 h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"  />
                </svg>
                <span>TARGET IDENTITY:</span>
                <span className="text-white font-semibold">analyst@enterprise.internal</span>
              </div>
              <span className="text-brand text-[11px] bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">TOKEN VALID (08:42 REMAINING)</span>
            </div>

            <form className="space-y-5" onSubmit={handleFormSubmit}>
              {/* New Password */}
              <div>
                <label htmlFor="new-password" className="block text-xs font-mono uppercase tracking-wider text-[#a0a8b7] mb-2">
                  New Password
                </label>
                <div className="relative">
<input 
                    type={showNew ? "text" : "password"} 
                    id="new-password" 
                    placeholder="••••••••••••••••••••"
                    value={newPassword}
                    onInput={(e) => setNewPassword(e.currentTarget.value)}
                    className="w-full bg-[#16191f] border border-[#2a2e38] focus:border-brand focus:ring-1 focus:ring-brand rounded px-3.5 py-2.5 text-sm text-white font-mono placeholder-[#434956] outline-none transition-colors"
                   />
<button type="button" onClick={() => setShowNew((v) => !v)} className={toggleBtnClassName(showNew)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"  />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"  />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-mono uppercase tracking-wider text-[#a0a8b7] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
<input 
                    type={showConfirm ? "text" : "password"} 
                    id="confirm-password" 
                    placeholder="••••••••••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#16191f] border border-[#2a2e38] focus:border-brand focus:ring-1 focus:ring-brand rounded px-3.5 py-2.5 text-sm text-white font-mono placeholder-[#434956] outline-none transition-colors"
                   />
<button type="button" onClick={() => setShowConfirm((v) => !v)} className={toggleBtnClassName(showConfirm)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"  />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"  />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Concise Password Requirements & Strength Indicator */}
              <div className="pt-1 pb-1 space-y-2">
                {/* Strength Segmented Bar */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#727b8e]">STRENGTH SCORE:</span>
                  <span id="strength-label" className={strength.className}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1">
                  <div className="bg-brand rounded-full"></div>
                  <div className="bg-brand rounded-full"></div>
                  <div className="bg-brand rounded-full"></div>
                  <div className="bg-brand rounded-full"></div>
                </div>

                {/* 4 Concise Requirement Indicators */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs font-mono pt-1 text-[#8c94a4]">
                  <div className="flex items-center space-x-1.5 text-brand">
                    <span className="text-xs">✓</span>
                    <span className="text-[#c5cbe0]">Min 12 characters</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-brand">
                    <span className="text-xs">✓</span>
                    <span className="text-[#c5cbe0]">Upper &amp; lowercase</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-brand">
                    <span className="text-xs">✓</span>
                    <span className="text-[#c5cbe0]">At least 1 numeral</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-brand">
                    <span className="text-xs">✓</span>
                    <span className="text-[#c5cbe0]">Special symbol (#$!%*)</span>
                  </div>
                </div>
              </div>

              {/* Primary Action */}
              <button 
                type="submit" 
                className="w-full bg-brand hover:bg-[#028072] text-black font-semibold text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center space-x-2 group focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#111317]"
              >
                <span>Update password</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"  />
                </svg>
              </button>

{/* Secondary Navigation */}
<div className="text-center pt-1">
<a href="#" onClick={(e) => { e.preventDefault(); setTokenState("success"); }} className="text-xs font-mono text-[#727b8e] hover:text-white transition-colors inline-flex items-center space-x-1.5">
                  <span className="text-xs">&larr;</span>
                  <span>Return to sign in</span>
                </a>
              </div>
            </form>
          </div>

{/* STATE 2: SUCCESSFUL RESET */}
<div id="state-success" className={tokenState === "success" ? "space-y-6" : "hidden space-y-6"}>
            <div className="w-12 h-12 rounded bg-brand/10 border border-brand/30 flex items-center justify-center text-brand mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"  />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Password updated</h1>
              <p className="text-sm text-[#8c94a4] leading-relaxed">
                Your credentials have been securely rotated across all enterprise auth enclaves. Prior active web sessions have been terminated.
              </p>
            </div>

            {/* Ledger Audit Confirmation */}
            <div className="border border-[#1e2229] bg-[#0c0e11] rounded p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between text-[#8c94a4]">
                <span className="text-[#59606d]">ROTATION STATUS</span>
                <span className="text-brand font-semibold">SUCCESS // ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-[#8c94a4]">
                <span className="text-[#59606d]">TARGET USER</span>
                <span className="text-white">analyst@enterprise.internal</span>
              </div>
              <div className="flex items-center justify-between text-[#8c94a4]">
                <span className="text-[#59606d]">TIMESTAMP</span>
                <span className="text-[#9da6b8]">2025-05-18T14:48:02.114Z</span>
              </div>
              <div className="flex items-center justify-between text-[#8c94a4]">
                <span className="text-[#59606d]">SESSIONS INVALIDATED</span>
                <span className="text-white">3 active connections pruned</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="button" 
                className="w-full bg-brand hover:bg-[#028072] text-black font-semibold text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center space-x-2"
              >
                <span>Proceed to sign in terminal</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"  />
                </svg>
              </button>
            </div>
          </div>

{/* STATE 3: EXPIRED TOKEN */}
<div id="state-expired" className={tokenState === "expired" ? "space-y-6" : "hidden space-y-6"}>
            <div className="w-12 h-12 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"  />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Reset link expired</h1>
              <p className="text-sm text-[#8c94a4] leading-relaxed">
                Password authorization tokens are cryptographically bounded to a 15-minute TTL to comply with zero-trust policy. This token has expired.
              </p>
            </div>

            <div className="border border-amber-500/20 bg-amber-500/5 rounded p-4 font-mono text-xs space-y-2 text-amber-300/90">
              <div className="flex justify-between">
                <span className="text-amber-400/60">TOKEN LIFESPAN:</span>
                <span>15 MINUTES (EXCEEDED)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400/60">DISPATCH TIME:</span>
                <span>14:12:00 UTC (18m ago)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="button" 
                onClick={() => setTokenState("valid")}
                className="w-full bg-[#1c2026] hover:bg-[#252b34] text-white border border-[#2a303c] font-medium text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center space-x-2"
              >
                <span>Request a new reset link</span>
              </button>
              <div className="text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); setTokenState("valid"); }} className="text-xs font-mono text-[#727b8e] hover:text-white transition-colors inline-flex items-center space-x-1">
                  <span>&larr;</span>
                  <span>Return to sign in</span>
                </a>
              </div>
            </div>
          </div>

{/* STATE 4: INVALID TOKEN */}
<div id="state-invalid" className={tokenState === "invalid" ? "space-y-6" : "hidden space-y-6"}>
            <div className="w-12 h-12 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"  />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Invalid or revoked token</h1>
              <p className="text-sm text-[#8c94a4] leading-relaxed">
                The cryptographic verification token signature could not be verified by the auth vault. It may have been revoked or malformed.
              </p>
            </div>

            <div className="border border-red-500/20 bg-red-500/5 rounded p-4 font-mono text-xs space-y-2 text-red-300/90">
              <div className="flex justify-between">
                <span className="text-red-400/60">AUTH FAULT:</span>
                <span>HMAC_SIGNATURE_MISMATCH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400/60">NONCE INTEGRITY:</span>
                <span>UNRECOGNIZED_DIGEST</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="button" 
                onClick={() => setTokenState("valid")}
                className="w-full bg-[#1c2026] hover:bg-[#252b34] text-white border border-[#2a303c] font-medium text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center space-x-2"
              >
                <span>Request new authorization link</span>
              </button>
              <div className="text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); setTokenState("valid"); }} className="text-xs font-mono text-[#727b8e] hover:text-white transition-colors inline-flex items-center space-x-1">
                  <span>&larr;</span>
                  <span>Return to sign in</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column Footer: Security Guarantee & SecOps Link */}
        <div className="pt-6 mt-6 border-t border-[#1e2229] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#59606d] gap-2">
          <div className="flex items-center space-x-2">
            <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"  />
            </svg>
            <span>FIPS 140-3 &amp; Zero-Knowledge Re-Key</span>
          </div>
          <div className="text-[#727b8e]">
            Compromised token? <a href="#" className="text-brand hover:underline">Revoke identity</a>
          </div>
        </div>

      </div>

    </div>
  </main>

  {/* Global Engineering Footer */}
  <footer className="w-full border-t border-[#1a1c1f] px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#59606d] gap-3">
    <div>
      &copy; 2025 TUNNELSIGHT INC. // CRYPTOGRAPHIC ASSURANCE PROTOCOL
    </div>
    <div className="flex items-center space-x-6 text-[11px]">
      <a href="#" className="hover:text-[#9ea7b8] transition-colors">SECURITY ADVISORY</a>
      <a href="#" className="hover:text-[#9ea7b8] transition-colors">KEY ROTATION POLICY</a>
      <a href="#" className="hover:text-[#9ea7b8] transition-colors">RFC 7296 SPECS</a>
    </div>
  </footer>

  

    </div>
  );
}
