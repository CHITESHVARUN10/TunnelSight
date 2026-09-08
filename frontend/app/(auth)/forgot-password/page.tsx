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
      ? "px-2.5 py-1 rounded-sm bg-zinc-800 text-teal-400 border border-zinc-700 font-medium transition-all"
      : "px-2.5 py-1 rounded-sm text-zinc-500 hover:text-zinc-300 transition-all";

  return (
    <div className="bg-[#0c0e11] text-zinc-300 min-h-screen flex flex-col justify-between antialiased selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Minimal Top Header */}
      <header className="w-full h-14 flex items-center justify-between px-6 border-b border-zinc-800/80 bg-[#111317]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
          <Link href="/" className="font-semibold tracking-tight text-white uppercase text-sm font-mono">TunnelSight</Link>
          <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 bg-[#14171c] px-2 py-0.5 rounded">v2.4.1-SEC</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="material-symbols-outlined text-teal-400 text-[14px]">lock</span>
          <span>SECURE RECOVERY GATEWAY // TLS 1.3</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl rounded-sm border border-zinc-800/80 bg-[#111317] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[560px]">
          
          {/* Left Column: Product Identity & Telemetry (5 cols) */}
          <div className="md:w-5/12 p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-800/80 flex flex-col justify-between bg-[#0e1014]">
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
                Evidence-driven analysis for authorized IPsec deployments. Identity recovery operates under cryptographic audit logging and timed authorization tokens.
              </p>

              {/* System Posture Specs Box */}
              <div className="rounded-sm border border-zinc-800 bg-[#14171c] p-4 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>GATEWAY CONDUIT</span>
                  <span className="text-zinc-200">AUTH-SEC-VAULT-04</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>TOKEN ENTROPY</span>
                  <span className="text-teal-400">256-BIT HMAC-SHA384</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>TTL EXPIRATION</span>
                  <span className="text-zinc-200">15 MINUTES / 900 SEC</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>RATE LIMITING</span>
                  <span className="text-zinc-200">3 REQS / IP / HR</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                RECOVERY SERVICE ONLINE
              </span>
              <span>LATENCY: 0.18ms</span>
            </div>
          </div>

          {/* Right Column: Reset Form / States (7 cols) */}
          <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between bg-[#111317]">
            <div>
              {/* State Switcher Header for Demo / Inspection */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">STATE PREVIEW:</span>
                <div className="flex items-center gap-1 bg-[#14171c] p-1 rounded-sm border border-zinc-800 text-[11px] font-mono">
                  <button id="tab-default" className={tabClassName("default")} onClick={() => setState("default")}>Default</button>
                  <button id="tab-invalid" className={tabClassName("invalid")} onClick={() => setState("invalid")}>Invalid Email</button>
                  <button id="tab-notfound" className={tabClassName("notfound")} onClick={() => setState("notfound")}>Not Found</button>
                  <button id="tab-sent" className={tabClassName("sent")} onClick={() => setState("sent")}>Email Sent</button>
                </div>
              </div>

              {/* Form View (Default / Errors) */}
              <div id="reset-form-container" className={recoveryState === "sent" ? "hidden" : undefined}>
                <div className="mb-6 space-y-1.5">
                  <h1 className="font-display-serif text-3xl text-white tracking-tight">Reset Password</h1>
                  <p className="text-xs text-zinc-400 font-mono">
                    Enter your work email to receive password-reset instructions and a timed authorization token.
                  </p>
                </div>

                {/* Error Banner: Invalid */}
                {recoveryState === "invalid" && (
                  <div id="alert-invalid" className="mb-5 p-3 rounded-sm border border-rose-800/50 bg-rose-950/40 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[16px] text-rose-400 mt-0.5 shrink-0">error</span>
                    <div className="text-xs">
                      <div className="font-medium text-rose-400 font-mono uppercase tracking-wide">Invalid Email Format</div>
                      <div className="text-zinc-300 mt-0.5 font-mono text-[11px]">
                        Please provide a valid corporate RFC 5322 work email address (e.g., analyst@enterprise.internal).
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner: Not Found */}
                {recoveryState === "notfound" && (
                  <div id="alert-notfound" className="mb-5 p-3 rounded-sm border border-amber-800/50 bg-amber-950/40 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[16px] text-amber-400 mt-0.5 shrink-0">warning</span>
                    <div className="text-xs">
                      <div className="font-medium text-amber-400 font-mono uppercase tracking-wide">Account Not Found</div>
                      <div className="text-zinc-300 mt-0.5 font-mono text-[11px]">
                        No analyst identity matches this address. Verify your deployment domain or contact your organization&apos;s SecOps administrator.
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <div className="space-y-1.5">
                    <label htmlFor="work-email" className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      Work Email
                    </label>
                    <input 
                      type="email" 
                      id="work-email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@enterprise.internal"
                      required
                      className={`w-full h-9 px-3 bg-[#14171c] border rounded-sm text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none font-mono transition-colors ${
                        recoveryState === "invalid" 
                          ? "border-rose-500 focus:border-rose-500" 
                          : recoveryState === "notfound" 
                          ? "border-amber-500 focus:border-amber-500" 
                          : "border-zinc-800 focus:border-teal-500/50"
                      }`}
                    />
                    <p id="input-helper" className="text-[11px] text-zinc-500 font-mono">
                      Instructions will be dispatched strictly to pre-registered enclave addresses.
                    </p>
                  </div>

                  {/* Primary Action */}
                  <button 
                    type="submit" 
                    className="w-full h-9 bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs font-mono rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm mt-2"
                  >
                    <span>Send Reset Instructions</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>

                  {/* Return Link */}
                  <div className="pt-2 text-center">
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-teal-400 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                      <span>Back to sign in</span>
                    </Link>
                  </div>
                </form>
              </div>

              {/* Email Sent Confirmation View */}
              <div id="sent-confirmation-container" className={recoveryState === "sent" ? "space-y-5" : "hidden"}>
                <div className="w-10 h-10 rounded-sm bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                </div>

                <div className="space-y-1.5">
                  <h1 className="font-display-serif text-3xl text-white tracking-tight">Reset Email Dispatched</h1>
                  <p className="text-xs text-zinc-400 font-mono">
                    We have dispatched cryptographic password reset instructions to:
                  </p>
                </div>
                
                <div className="p-3 rounded-sm bg-[#14171c] border border-zinc-800 font-mono text-xs text-teal-400 font-medium flex items-center justify-between">
                  <span id="sent-target-email">{sentEmail}</span>
                  <span className="text-[10px] text-zinc-500 px-2 py-0.5 rounded bg-[#0e1014] border border-zinc-800">
                    ENCRYPTED DISPATCH
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  The reset token is valid for 15 minutes. If you do not observe this dispatch within 3 minutes, verify your spam quarantine filter or ensure your identity is provisioned in the enterprise directory.
                </p>

                <div className="space-y-3 pt-2">
                  <button 
                    onClick={() => setState("default")}
                    className="w-full h-9 bg-[#14171c] hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-mono text-xs rounded-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Resend Instructions</span>
                  </button>

                  <div className="text-center pt-1">
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-teal-400 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                      <span>Back to sign in</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Indicator Footer */}
            <div className="mt-8 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-teal-400">verified_user</span>
                <span>FIPS 140-3 &amp; Zero-Knowledge Reset Protocol</span>
              </div>
              <div className="text-zinc-500">
                Need emergency bypass? <span className="text-teal-400 hover:underline cursor-pointer">Contact Desk</span>
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
