"use client";

import { useState } from "react";
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
      toast({ title: `Welcome, ${user.displayName}`, body: "Mock session started (prototype).", kind: "ok" });
      router.push("/overview");
    } catch (err) {
      toast({ title: "Sign in failed", body: err instanceof Error ? err.message : "Invalid credentials.", kind: "warn" });
    }
  }
  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary selection:text-on-primary">
<header className="w-full h-header-height flex items-center justify-between px-space-xl bg-surface-container-low/60 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50"><div className="flex items-center gap-space-sm"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div><span className="font-headline-sm text-headline-sm text-on-surface tracking-wider uppercase font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded">v2.4.0-SEC</span></div><div className="flex items-center gap-space-base"><span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-space-xs"><span className="material-symbols-outlined text-primary text-[14px]">lock</span>FIPS 140-3 COMPLIANT</span></div></header><main className="w-full flex-1 flex flex-col items-center justify-center p-space-base bg-surface relative"><div className="flex flex-col w-full items-center justify-center py-space-xl">
<div className="w-full max-w-5xl bg-surface-container-lowest rounded shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
{/* LEFT PANEL: Technical Identity & Operational Telemetry */}
<div className="lg:col-span-5 bg-surface-container-low p-space-2xl flex flex-col justify-between relative overflow-hidden">
{/* Faint Architectural Coordinate Grid Overlay */}
<svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern height="28" id="sec-grid" patternUnits="userSpaceOnUse" width="28">
<path className="text-on-surface-variant" d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.75"></path>
</pattern>
</defs>
<rect fill="url(#sec-grid)" height="100%" width="100%"></rect>
</svg>
{/* Top Branding Block */}
<div className="relative z-10 flex flex-col gap-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 bg-primary-container text-on-primary-container flex items-center justify-center rounded">
<span className="font-code-md text-code-md font-bold tracking-tighter">{'>'}_</span>
</div>
<div className="flex flex-col">
<span className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">TunnelSight</span>
<span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">IPsec Security Intelligence</span>
</div>
</div>
<div className="space-y-space-xs mt-space-md">
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Evidence-driven analysis for authorized IPsec deployments. High-throughput protocol dissection, state integrity validation, and continuous cryptographic compliance auditing.
          </p>
</div>
{/* Telemetry / Node Metadata Spec Sheet */}
<div className="bg-surface-container p-space-md rounded space-y-space-xs font-code-sm text-code-sm">
<div className="flex justify-between text-on-surface-variant">
<span className="text-secondary">KERNEL SUB</span>
<span className="text-on-surface font-medium">4.18.0-FIPS // ZERO-COPY</span>
</div>
<div className="flex justify-between text-on-surface-variant">
<span className="text-secondary">INGRESS RING</span>
<span className="text-primary font-medium">DPDK RX POOL · ACTIVE</span>
</div>
<div className="flex justify-between text-on-surface-variant">
<span className="text-secondary">ENCRYPT SUITE</span>
<span className="text-on-surface font-medium">AES-256-GCM / SHA-384</span>
</div>
<div className="flex justify-between text-on-surface-variant">
<span className="text-secondary">NODE REF</span>
<span className="text-on-surface font-medium">sec-gw02.us-east.tier3</span>
</div>
</div>
</div>
{/* Bottom System Status & Compliance Attestation */}
<div className="relative z-10 mt-space-2xl pt-space-base space-y-space-sm">
<div className="flex items-center gap-space-xs">
<span className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs bg-surface-container text-tertiary font-code-sm text-code-sm rounded">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            ENGINE: ONLINE (DPDK 22.11)
          </span>
<span className="inline-flex items-center px-space-xs py-space-2xs bg-surface-container text-on-surface-variant font-code-sm text-code-sm rounded">
            LATENCY: 0.24ms
          </span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
          FIPS 140-3 & CNSA 1.0 COMPLIANT ARCHITECTURE
        </p>
</div>
</div>
{/* RIGHT PANEL: Authentication Form */}
<div className="lg:col-span-7 bg-surface-container p-space-2xl flex flex-col justify-center">
<div className="w-full max-w-md mx-auto space-y-space-lg">
{/* Header */}
<div className="space-y-space-2xs">
<h1 className="font-headline-lg text-headline-lg text-on-surface">Sign in</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Enter your credentials to access the analytical workbench.
          </p>
</div>
{/* Form Elements */}
<form className="space-y-space-md" onSubmit={onSubmit}>
{/* Email Field */}
<div className="space-y-space-xs">
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider" htmlFor="work-email">
              Work Email
            </label>
<div className="relative">
<input autoComplete="username" className="w-full h-8 px-space-sm bg-surface-container-lowest text-on-surface font-code-sm text-code-sm rounded placeholder:text-on-secondary-container focus:outline-none focus:bg-surface-container-high transition-colors" id="work-email" name="email" placeholder="analyst@enterprise.internal" required type="email" />
</div>
</div>
{/* Password Field */}
<div className="space-y-space-xs">
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider" htmlFor="auth-password">
              Password
            </label>
<div className="relative flex items-center">
<input autoComplete="current-password" className="w-full h-8 px-space-sm pr-space-xl bg-surface-container-lowest text-on-surface font-code-sm text-code-sm rounded placeholder:text-on-secondary-container focus:outline-none focus:bg-surface-container-high transition-colors" id="auth-password" name="password" placeholder="••••••••••••••••" required type={showPassword ? "text" : "password"} />
<button aria-label="Toggle password visibility" className="absolute right-space-xs p-space-2xs text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none" id="toggle-password-btn" type="button" onClick={() => setShowPassword((v) => !v)}>
<span className="material-symbols-outlined text-[16px]" id="toggle-icon">{showPassword ? "visibility_off" : "visibility"}</span>
</button>
</div>
</div>
{/* Options Row */}
<div className="flex items-center justify-between font-label-md text-label-md pt-space-2xs">
<label className="flex items-center gap-space-xs cursor-pointer select-none text-on-surface-variant hover:text-on-surface transition-colors">
<input className="w-3.5 h-3.5 bg-surface-container-lowest text-primary rounded focus:ring-0 focus:outline-none accent-[#00a896]" type="checkbox" />
<span>Keep session active for 12h</span>
</label>
<a className="text-primary hover:text-primary-fixed transition-colors" href="#">Forgot password?</a>
</div>
{/* Primary Submit */}
<button className="w-full h-8 bg-primary-container hover:bg-[#14b8a6] text-on-primary-container font-headline-sm text-headline-sm font-semibold rounded flex items-center justify-center gap-space-xs transition-colors mt-space-sm shadow-sm" type="submit">
<span>Sign In to Terminal</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
<p className="pt-1 text-center font-code-sm text-code-sm text-outline">
Prototype demo account — email <span className="text-primary">{DEMO_EMAIL}</span> · password <span className="text-primary">tunnelsight-demo</span>
</p>
</form>
{/* Divider */}
<div className="relative flex items-center justify-center py-space-xs">
<div className="w-full h-[1px] bg-secondary-container"></div>
<span className="absolute bg-surface-container px-space-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Enterprise Access
          </span>
</div>
{/* Enterprise SSO Button */}
<div>
<button onClick={() => toast({ title: "Enterprise IdP", body: "SSO is out of scope for the prototype — use the demo account.", kind: "info" })} className="w-full h-8 bg-surface-container-low hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-medium rounded flex items-center justify-center gap-space-sm transition-colors" type="button">
<span className="material-symbols-outlined text-primary text-[16px]">domain</span>
<span>Authenticate via Enterprise IdP (SAML 2.0 / OIDC)</span>
</button>
</div>
{/* Security Guarantee & Request Access Footer */}
<div className="pt-space-sm space-y-space-sm">
<div className="flex items-center justify-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
<span className="material-symbols-outlined text-[14px] text-tertiary">verified_user</span>
<span>TLS 1.3 · Mutual Auth & FIDO2 / WebAuthn supported</span>
</div>
<div className="text-center font-body-sm text-body-sm text-on-surface-variant">
<span>Unauthorized deployment?</span>
<a className="text-primary hover:text-primary-fixed font-medium ml-space-xs transition-colors" href="#">Request access token</a>
</div>
</div>
</div>
</div>
</div>
</div>
</main><footer className="w-full py-space-md px-space-xl flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant bg-surface-container-lowest/40 font-code-sm text-code-sm"><div className="flex items-center gap-space-md"><span className="flex items-center gap-space-xs"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>CORE TELEMETRY READY</span><span>© 2024 TUNNELSIGHT INC.</span></div><div className="flex items-center gap-space-base"><a className="hover:text-on-surface transition-colors" href="#">SECURITY ADVISORY</a><a className="hover:text-on-surface transition-colors" href="#">HARDWARE TOKENS</a><a className="hover:text-on-surface transition-colors" href="#">PROTOCOL DOCS</a></div></footer>
    </div>
  );
}
