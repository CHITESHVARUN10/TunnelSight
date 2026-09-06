"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockRegister } from "@/lib/mock/session";
import { useToast } from "@/lib/mock/toast";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // Initial meter matches static render (STRONG 4/4); updated on password input per updatePasswordMetrics.
  const [metrics, setMetrics] = useState({
    hasLength: true,
    hasCase: true,
    hasNum: true,
    hasSym: true,
    score: 4,
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (password !== confirm) {
      toast({ title: "Passphrases do not match", body: "Confirm passphrase must equal the passphrase.", kind: "warn" });
      return;
    }
    try {
      const user = mockRegister(
        String(data.get("email") ?? ""),
        password,
        String(data.get("full_name") ?? "")
      );
      toast({ title: "Workspace provisioned", body: `Signed in as ${user.email} (prototype).`, kind: "ok" });
      router.push("/overview");
    } catch (err) {
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
      ? "text-error font-semibold"
      : metrics.score < 4
        ? "text-secondary font-semibold"
        : "text-primary font-semibold";
  const pipClassName = (idx: number) =>
    idx < metrics.score
      ? "bg-primary rounded-full transition-colors"
      : "bg-surface-container-high rounded-full transition-colors";
  const critClassName = (valid: boolean) =>
    valid
      ? "flex items-center gap-space-2xs font-code-sm text-code-sm text-primary"
      : "flex items-center gap-space-2xs font-code-sm text-code-sm text-outline";
  const isMismatch = confirm.length > 0 && password !== confirm;
  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary selection:text-on-primary">
<header className="w-full h-header-height flex items-center justify-between px-space-xl bg-surface-container-low/60 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50"><div className="flex items-center gap-space-sm"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div><span className="font-headline-sm text-headline-sm text-on-surface tracking-wider uppercase font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded">v2.4.0-SEC</span></div><div className="flex items-center gap-space-base"><span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-space-xs"><span className="material-symbols-outlined text-primary text-[14px]">lock</span>FIPS 140-3 COMPLIANT</span></div></header><main className="w-full flex-1 flex flex-col items-center justify-center p-space-base bg-surface relative"><div className="flex flex-col w-full items-center justify-center py-space-xl">
<div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-surface-container-lowest shadow-2xl rounded overflow-hidden">
{/* Left Column: Product Identity & Verification Context */}
<div className="lg:col-span-5 bg-surface-container-low p-space-xl lg:p-space-2xl flex flex-col justify-between relative overflow-hidden">
{/* Subtle Technical Blueprint Grid Accent (CSS Gradient) */}
<div className="absolute inset-0 bg-[linear-gradient(to_right,#33353815_1px,transparent_1px),linear-gradient(to_bottom,#33353815_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
<div className="relative z-10 flex flex-col gap-space-lg">
{/* Identity Badge */}
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-primary shadow-sm">
<span className="font-code-md text-code-md font-semibold tracking-tighter">{'>'}_</span>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold uppercase">TunnelSight</span>
<span className="font-code-sm text-code-sm text-primary tracking-wider uppercase">IPsec Security Intelligence</span>
</div>
</div>
{/* Scope Definition */}
<div className="flex flex-col gap-space-xs">
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Evidence-driven analysis for authorized IPsec deployments. Provision your cryptographic analyst credentials for authorized forensic trace dissection.
          </p>
</div>
{/* Telemetry Parameters Matrix */}
<div className="flex flex-col gap-space-2xs bg-surface-container/60 p-space-md rounded">
<div className="flex items-center justify-between font-code-sm text-code-sm py-space-2xs">
<span className="text-on-surface-variant tracking-wider">AUTH DOMAIN:</span>
<span className="text-on-surface font-medium">idp.internal.tunnelsight.defense</span>
</div>
<div className="flex items-center justify-between font-code-sm text-code-sm py-space-2xs">
<span className="text-on-surface-variant tracking-wider">CLEARANCE LEVEL:</span>
<span className="text-primary font-medium">Tier 2+ Protocol Forensics</span>
</div>
<div className="flex items-center justify-between font-code-sm text-code-sm py-space-2xs">
<span className="text-on-surface-variant tracking-wider">CRYPTO KEYRING:</span>
<span className="text-on-surface font-medium">FIDO2 / Ed25519 Hardware Bound</span>
</div>
<div className="flex items-center justify-between font-code-sm text-code-sm py-space-2xs">
<span className="text-on-surface-variant tracking-wider">ACCESS PROTOCOL:</span>
<span className="text-on-surface font-medium">TLS 1.3 / mTLS Enforced</span>
</div>
</div>
</div>
{/* Left Column Bottom Details */}
<div className="relative z-10 flex flex-col gap-space-md pt-space-xl">
{/* Policy Box */}
<div className="bg-surface-container-high/40 p-space-md rounded flex flex-col gap-space-xs">
<div className="flex items-center gap-space-xs text-on-surface">
<span className="material-symbols-outlined text-[14px] text-primary">policy</span>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface font-semibold">ORGANIZATION ACCESS POLICY</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
            Use of TunnelSight is restricted to authorized network analysis and security assessment. All ingestion sessions, capture traces, and analytical reports are ledger-audited.
          </p>
</div>
{/* System Telemetry Low-profile Status */}
<div className="flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant pt-space-xs">
<div className="flex items-center gap-space-xs">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
<span className="tracking-wider">PROVISIONING ENGINE: READY</span>
</div>
<span className="text-outline">FIPS 140-3 CONFORMANCE</span>
</div>
</div>
</div>
{/* Right Column: Create Account Workspace Form */}
<div className="lg:col-span-7 bg-surface p-space-xl lg:p-space-2xl flex flex-col justify-center">
<div className="w-full max-w-xl mx-auto flex flex-col gap-space-lg">
{/* Form Header */}
<div className="flex flex-col gap-space-2xs">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">Create account</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Enter your credentials to provision analyst workspace access.</p>
</div>
{/* Registration Form */}
<form className="flex flex-col gap-space-md" id="provision-form" onSubmit={onSubmit}>
{/* Row 1: Full Name & Role */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-2xs">
<label className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider" htmlFor="full_name">Full Name</label>
<input className="w-full h-8 px-space-sm bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/60 transition-colors" name="full_name" id="full_name" placeholder="Dr. Jonathan Chen" required type="text" />
</div>
<div className="flex flex-col gap-space-2xs">
<label className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider" htmlFor="assigned_role">Forensic Role</label>
<div className="relative">
<select className="w-full h-8 px-space-sm bg-surface-container-low text-on-surface font-body-md text-body-md rounded appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer" id="assigned_role">
<option value="crypto-analyst">Cryptographic Analyst</option>
<option value="secops-eng">SecOps Engineer (Tier 3)</option>
<option value="net-forensics">Network Forensics Lead</option>
<option value="protocol-auditor">Protocol Integrity Auditor</option>
</select>
<div className="absolute right-space-sm top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant flex items-center">
<span className="material-symbols-outlined text-[16px]">expand_more</span>
</div>
</div>
</div>
</div>
{/* Row 2: Organization */}
<div className="flex flex-col gap-space-2xs">
<label className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider" htmlFor="organization">Organization / Department</label>
<input className="w-full h-8 px-space-sm bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/60 transition-colors" name="organization" id="organization" placeholder="Cyber Defense Command / Tier 3 SOC" required type="text" />
</div>
{/* Row 3: Work Email */}
<div className="flex flex-col gap-space-2xs">
<label className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider" htmlFor="email">Enterprise Identity / Work Email</label>
<div className="relative flex items-center">
<input className="w-full h-8 px-space-sm bg-surface-container-low text-on-surface font-code-sm text-code-sm rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/60 transition-colors" name="email" id="email" placeholder="analyst@enterprise.internal" required type="email" />
<span className="absolute right-space-sm text-outline material-symbols-outlined text-[16px]">alternate_email</span>
</div>
</div>
{/* Row 4: Password & Confirm Password */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-2xs">
<label className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider" htmlFor="password">Passphrase</label>
<div className="relative flex items-center">
<input className="w-full h-8 px-space-sm pr-8 bg-surface-container-low text-on-surface font-code-sm text-code-sm rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/60 transition-colors" name="password" id="password" placeholder="••••••••••••••••" required type={showPassword ? "text" : "password"} value={password} onInput={(e) => { const val = e.currentTarget.value; setPassword(val); updatePasswordMetrics(val); }} />
<button aria-label="Toggle password visibility" className="absolute right-space-xs p-space-2xs text-on-surface-variant hover:text-on-surface transition-colors flex items-center" type="button" onClick={() => setShowPassword((v) => !v)}>
<span className="material-symbols-outlined text-[16px]">{showPassword ? "visibility_off" : "visibility"}</span>
</button>
</div>
</div>
<div className="flex flex-col gap-space-2xs">
<label className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider" htmlFor="confirm_password">Confirm Passphrase</label>
<div className="relative flex items-center">
<input className={`w-full h-8 px-space-sm pr-8 bg-surface-container-low text-on-surface font-code-sm text-code-sm rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/60 transition-colors${isMismatch ? " ring-1 ring-error" : ""}`} name="confirm_password" id="confirm_password" placeholder="••••••••••••••••" required type={showConfirm ? "text" : "password"} value={confirm} onInput={(e) => setConfirm(e.currentTarget.value)} />
<button aria-label="Toggle confirm password visibility" className="absolute right-space-xs p-space-2xs text-on-surface-variant hover:text-on-surface transition-colors flex items-center" type="button" onClick={() => setShowConfirm((v) => !v)}>
<span className="material-symbols-outlined text-[16px]">{showConfirm ? "visibility_off" : "visibility"}</span>
</button>
</div>
</div>
</div>
{/* Password Requirements & Micro Metric Segment */}
<div className="bg-surface-container-lowest/80 p-space-sm rounded flex flex-col gap-space-xs">
<div className="flex items-center justify-between font-code-sm text-code-sm">
<span className="text-on-surface-variant tracking-wider">STRENGTH:</span>
<span className={strengthClassName} id="strength-label">{strengthLabels[metrics.score]}</span>
</div>
{/* Segmented 4-bar indicator */}
<div className="grid grid-cols-4 gap-space-xs h-1">
<div className={pipClassName(0)} id="pip-1"></div>
<div className={pipClassName(1)} id="pip-2"></div>
<div className={pipClassName(2)} id="pip-3"></div>
<div className={pipClassName(3)} id="pip-4"></div>
</div>
{/* Inline Criteria Badges */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs pt-space-2xs">
<div className={critClassName(metrics.hasLength)} id="crit-len">
<span className="material-symbols-outlined text-[12px]">{metrics.hasLength ? "check" : "remove"}</span>
<span>Min 12 chars</span>
</div>
<div className={critClassName(metrics.hasCase)} id="crit-case">
<span className="material-symbols-outlined text-[12px]">{metrics.hasCase ? "check" : "remove"}</span>
<span>Upper & lower</span>
</div>
<div className={critClassName(metrics.hasNum)} id="crit-num">
<span className="material-symbols-outlined text-[12px]">{metrics.hasNum ? "check" : "remove"}</span>
<span>Number</span>
</div>
<div className={critClassName(metrics.hasSym)} id="crit-sym">
<span className="material-symbols-outlined text-[12px]">{metrics.hasSym ? "check" : "remove"}</span>
<span>Special char</span>
</div>
</div>
</div>
{/* Legal & Policy Micro Consent */}
<div className="flex flex-col gap-space-xs">
<p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
              By creating an account, you acknowledge that use of TunnelSight is restricted to authorized network analysis and security assessment.
            </p>
</div>
{/* Primary Submit Action */}
<button className="w-full h-9 bg-primary-container text-surface-container-lowest font-body-md text-body-md font-semibold rounded flex items-center justify-center gap-space-xs hover:bg-primary transition-all active:scale-[0.99] shadow-md mt-space-xs" type="submit">
<span>Create Analyst Account</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
{/* Alternative Auth Pathway */}
<div className="flex items-center justify-center pt-space-xs">
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-space-xs" href="#">
<span>Already have an account?</span>
<span className="text-primary font-medium underline underline-offset-4">Sign in</span>
</a>
</div>
{/* Hardware Token Assurance Notification */}
<div className="bg-surface-container-low/60 px-space-md py-space-xs rounded flex items-center justify-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
<span className="material-symbols-outlined text-[14px] text-tertiary">lock_person</span>
<span className="tracking-tight">Hardware security key (FIDO2/WebAuthn) enrollment required upon initial sign-in.</span>
</div>
</form>
</div>
</div>
</div>
</div>
</main><footer className="w-full py-space-md px-space-xl flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant bg-surface-container-lowest/40 font-code-sm text-code-sm"><div className="flex items-center gap-space-md"><span className="flex items-center gap-space-xs"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>CORE TELEMETRY READY</span><span>© 2024 TUNNELSIGHT INC.</span></div><div className="flex items-center gap-space-base"><a className="hover:text-on-surface transition-colors" href="#">SECURITY ADVISORY</a><a className="hover:text-on-surface transition-colors" href="#">HARDWARE TOKENS</a><a className="hover:text-on-surface transition-colors" href="#">PROTOCOL DOCS</a></div></footer>
    </div>
  );
}
