"use client";

import Link from "next/link";
import { useState } from "react";

type RecoveryState = "default" | "invalid" | "notfound" | "sent";

export default function ForgotPasswordPage() {
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("default");
  const [email, setEmail] = useState("analyst@enterprise.internal");
  const [sentEmail, setSentEmail] = useState("analyst@enterprise.internal");

  function setState(state: RecoveryState) {
    if (state === "default") {
      setEmail("analyst@enterprise.internal");
    } else if (state === "invalid") {
      setEmail("analyst_invalid_format");
    } else if (state === "notfound") {
      setEmail("unknown.agent@external.net");
    }
    setRecoveryState(state);
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSentEmail(email || "analyst@enterprise.internal");
    setRecoveryState("sent");
  }

  const tabClassName = (s: RecoveryState) =>
    s === recoveryState
      ? "px-2.5 py-1 rounded bg-brand-surface text-brand-teal border border-brand-teal/40 transition-all font-semibold"
      : "px-2.5 py-1 rounded text-neutral-400 hover:text-neutral-200 transition-all";
  return (
    <div className="h-full font-sans text-neutral-200 antialiased flex flex-col justify-between selection:bg-[#00a896]/30 selection:text-white">


  {/* Top Global Security Bar */}
  <header className="w-full px-6 py-4 flex items-center justify-between border-b border-brand-border-subtle/80 bg-brand-surface-lowest">
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse"></div>
      <span className="text-sm font-semibold tracking-wider font-mono text-neutral-100">TUNNELSIGHT</span>
      <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-surface-low text-neutral-400 border border-brand-border-subtle">v2.4.0-SEC</span>
    </div>
    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
      <svg className="w-3.5 h-3.5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"  />
      </svg>
      <span>SECURE RECOVERY GATEWAY // TLS 1.3</span>
    </div>
  </header>

  {/* Main Recovery Container */}
  <main className="flex-1 flex items-center justify-center p-6">
    <div className="w-full max-w-5xl rounded-lg border border-brand-border bg-brand-surface overflow-hidden shadow-2xl flex flex-col md:flex-row">

      {/* Left Column: Product Identity & Telemetry Posture */}
      <div className="md:w-5/12 p-8 md:p-10 border-b md:border-b-0 md:border-r border-brand-border flex flex-col justify-between relative bg-grid-pattern bg-brand-surface-lowest/70">
        <div>
          {/* Icon + Monogram */}
          <div className="w-10 h-10 rounded bg-brand-teal flex items-center justify-center text-brand-surface-lowest font-mono font-bold text-lg mb-6 shadow-sm">
            &gt;_
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white font-mono">TUNNELSIGHT</h2>
          <p className="text-xs font-mono text-brand-teal tracking-wider uppercase mb-4">IPSEC SECURITY INTELLIGENCE</p>

          <p className="text-sm text-neutral-400 leading-relaxed font-sans mb-8">
            Evidence-driven analysis for authorized IPsec deployments. Identity recovery operates under cryptographic audit logging and timed authorization tokens.
          </p>

          {/* System Posture Specs Box */}
          <div className="rounded border border-brand-border-subtle bg-brand-surface-low/60 p-4 font-mono text-xs space-y-2.5">
            <div className="flex justify-between items-center text-neutral-400">
              <span className="text-neutral-500">GATEWAY CONDUIT</span>
              <span className="text-neutral-200">AUTH-SEC-VAULT-04</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span className="text-neutral-500">TOKEN ENTROPY</span>
              <span className="text-brand-teal">256-BIT HMAC-SHA384</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span className="text-neutral-500">TTL EXPIRATION</span>
              <span className="text-neutral-200">15 MINUTES / 900 SEC</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span className="text-neutral-500">RATE LIMITING</span>
              <span className="text-neutral-200">3 REQS / IP / HR</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-brand-border-subtle/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
            RECOVERY SERVICE ONLINE
          </span>
          <span>LATENCY: 0.18ms</span>
        </div>
      </div>

      {/* Right Column: Interactive Password Reset State & Form */}
      <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between bg-brand-surface">
        <div>
          {/* State Switcher Header for Reviewing States (Subtle, Clean) */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-brand-border-subtle">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">RECOVERY STATE PREVIEW:</span>
            <div className="flex items-center gap-1.5 bg-brand-surface-low p-1 rounded border border-brand-border-subtle text-xs font-mono">
<button id="tab-default" className={tabClassName("default")} onClick={() => setState("default")}>Default</button>
<button id="tab-invalid" className={tabClassName("invalid")} onClick={() => setState("invalid")}>Invalid Email</button>
<button id="tab-notfound" className={tabClassName("notfound")} onClick={() => setState("notfound")}>Not Found</button>
<button id="tab-sent" className={tabClassName("sent")} onClick={() => setState("sent")}>Email Sent</button>
            </div>
          </div>

{/* Form View (Default / Errors) */}
<div id="reset-form-container" className={recoveryState === "sent" ? "hidden" : undefined}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white">Reset your password</h1>
              <p className="text-sm text-neutral-400 mt-1.5 font-sans">
                Enter your work email to receive password-reset instructions and a timed one-time authorization token.
              </p>
            </div>

            {/* Error Banners (Conditional) */}
            <div id="alert-invalid" className={`${recoveryState === "invalid" ? "" : "hidden "}mb-5 p-3.5 rounded border border-brand-danger/40 bg-brand-danger-dim flex items-start gap-3`}>
              <svg className="w-4 h-4 text-brand-danger mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"  />
              </svg>
              <div className="text-xs">
                <div className="font-medium text-brand-danger font-mono uppercase tracking-wide">Invalid Email Format</div>
                <div className="text-neutral-300 mt-0.5">Please provide a valid corporate RFC 5322 work email address (e.g., <code className="font-mono text-neutral-200">analyst@enterprise.internal</code>).</div>
              </div>
            </div>

            <div id="alert-notfound" className={`${recoveryState === "notfound" ? "" : "hidden "}mb-5 p-3.5 rounded border border-amber-500/40 bg-amber-500/10 flex items-start gap-3`}>
              <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"  />
              </svg>
              <div className="text-xs">
                <div className="font-medium text-amber-400 font-mono uppercase tracking-wide">Account Not Found</div>
                <div className="text-neutral-300 mt-0.5">No analyst identity matches this address. Verify your deployment domain or contact your organization's SecOps administrator.</div>
              </div>
            </div>

{/* Form Element */}
<form className="space-y-5" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="work-email" className="block text-xs font-mono font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  Work Email
                </label>
                <div className="relative">
<input 
                    type="email" 
                    id="work-email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@enterprise.internal"
                    required
                    className={`w-full px-3.5 py-2.5 bg-brand-surface-low border border-brand-border rounded text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal font-mono transition-colors${recoveryState === "invalid" ? " border-brand-danger" : ""}${recoveryState === "notfound" ? " border-amber-500" : ""}`}
                   />
<div id="input-error-icon" className={`${recoveryState === "invalid" ? "" : "hidden "}absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}>
                    <svg className="h-4 w-4 text-brand-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"  />
                    </svg>
                  </div>
                </div>
                <p id="input-helper" className="text-xs text-neutral-500 mt-1.5 font-mono">
                  Instructions will be dispatched strictly to pre-registered enclave addresses.
                </p>
              </div>

              {/* Primary Action */}
              <button 
                type="submit" 
                className="w-full py-2.5 px-4 bg-brand-teal hover:bg-brand-teal-hover text-brand-surface-lowest font-medium font-sans text-sm rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm font-semibold"
              >
                <span>Send reset instructions</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"  />
                </svg>
              </button>

              {/* Secondary Action */}
              <div className="pt-2 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-brand-teal transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"  />
                  </svg>
                  <span>Back to sign in</span>
                </Link>
              </div>
            </form>
          </div>

{/* Email Sent Confirmation View (Clean State) */}
<div id="sent-confirmation-container" className={recoveryState === "sent" ? undefined : "hidden"}>
            <div className="w-10 h-10 rounded bg-brand-success-dim border border-brand-success/30 flex items-center justify-center text-brand-success mb-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"  />
              </svg>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">Reset email dispatched</h1>
            <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
              We have dispatched cryptographic password reset instructions to:
            </p>
            
            <div className="my-4 p-3 rounded bg-brand-surface-low border border-brand-border font-mono text-sm text-brand-teal font-medium flex items-center justify-between">
              <span id="sent-target-email">{sentEmail}</span>
              <span className="text-[11px] text-neutral-400 px-2 py-0.5 rounded bg-brand-surface-lowest border border-brand-border-subtle">ENCRYPTED DISPATCH</span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-6">
              The reset token is valid for 15 minutes. If you do not observe this dispatch within 3 minutes, verify your spam quarantine filter or ensure your identity is provisioned in the enterprise directory.
            </p>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => setState("default")}
                className="w-full py-2.5 px-4 bg-brand-surface-low hover:bg-brand-surface-container border border-brand-border text-neutral-200 font-sans text-sm rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Resend instructions</span>
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-brand-teal transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"  />
                  </svg>
                  <span>Back to sign in</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Policy Indicator Footer */}
        <div className="mt-8 pt-5 border-t border-brand-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"  />
            </svg>
            <span>FIPS 140-3 & Zero-Knowledge Reset Protocol</span>
          </div>
          <div className="text-neutral-500 hover:text-neutral-400 cursor-default">
            Need emergency SecOps bypass? <span className="text-brand-teal underline decoration-dotted cursor-pointer">Contact Desk</span>
          </div>
        </div>
      </div>

    </div>
  </main>

  {/* Global Footer Bar */}
  <footer className="w-full px-6 py-3 border-t border-brand-border-subtle bg-brand-surface-lowest flex items-center justify-between text-[11px] font-mono text-neutral-500">
    <div>
      © 2025 TUNNELSIGHT INC. // CRYPTOGRAPHIC ASSURANCE PROTOCOL
    </div>
    <div className="flex items-center gap-6">
      <a href="#" className="hover:text-neutral-400 transition-colors">SECURITY ADVISORY</a>
      <a href="#" className="hover:text-neutral-400 transition-colors">KEY ROTATION POLICY</a>
      <a href="#" className="hover:text-neutral-400 transition-colors">RFC 7296 SPECS</a>
    </div>
  </footer>

  {/* State Toggle Handler Script */}
  

    </div>
  );
}
