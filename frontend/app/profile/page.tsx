"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { me } from "@/lib/auth";

type Profile = {
  display_name: string | null;
  organization: string | null;
  role: string | null;
  timezone: string | null;
};

export default function ProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: "", organization: "", role: "", timezone: "" });
  const [pw, setPw] = useState({ old_password: "", new_password: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await me();
        const p = (await api("/api/profile")) as Profile;
        if (!cancelled) {
          setEmail(u.email);
          setProfile(p);
          setForm({
            display_name: p.display_name ?? "",
            organization: p.organization ?? "",
            role: p.role ?? "",
            timezone: p.timezone ?? "",
          });
        }
      } catch (err) {
        if (!cancelled)
          toast({ title: "Profile unavailable", body: err instanceof Error ? err.message : "Sign in again.", kind: "warn" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const editProfile = () => setEditing((v) => !v);
  const saveProfile = async () => {
    try {
      const p = (await api("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          display_name: form.display_name || undefined,
          organization: form.organization || undefined,
          role: form.role || undefined,
          timezone: form.timezone || undefined,
        }),
      })) as Profile;
      setProfile(p);
      setEditing(false);
      toast({ title: "Profile saved", body: "Identity updated.", kind: "ok" });
    } catch (err) {
      toast({ title: "Save failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };
  const changePreference = () => toast({ title: "Preference staged", body: "Workbench preference change staged (mock).", kind: "info" });
  const changePassword = async () => {
    if (!pw.old_password || !pw.new_password) {
      toast({ title: "Password change", body: "Enter current and new passphrase below.", kind: "info" });
      return;
    }
    try {
      await api("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(pw),
      });
      setPw({ old_password: "", new_password: "" });
      toast({ title: "Password changed", body: "Rotation complete.", kind: "ok" });
    } catch (err) {
      toast({ title: "Password change failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };
  const manageKeys = () => toast({ title: "Security keys", body: "2 FIDO2 tokens registered (mock).", kind: "info" });
  const manageSessions = () => toast({ title: "Sessions", body: "3 active sessions reviewed (mock).", kind: "info" });

  return (
    <div className="bg-[#0c0e11] text-zinc-300 min-h-screen antialiased selection:bg-teal-500/20 selection:text-teal-300">
      <AppShell active="">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div className="flex flex-col gap-1">
              <h1 className="font-display-serif text-3xl sm:text-4xl text-white tracking-tight">Analyst Profile</h1>
              <p className="text-xs font-mono text-zinc-400">Cryptographic identity, role clearance, and workbench telemetry defaults.</p>
            </div>
            <div className="flex items-center gap-2 self-start bg-[#111317] border border-zinc-800 px-3 py-1.5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Clearance:</span>
              <span className="text-xs font-mono text-teal-300 font-medium">Tier 3 Cryptographic Analyst</span>
            </div>
          </header>

          {/* Top Posture Strip */}
          <div className="bg-[#111317] border border-zinc-800/80 px-4 py-3 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="material-symbols-outlined text-[16px] text-teal-400">verified_user</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Security Posture</span>
              <span className="text-zinc-600 font-mono">·</span>
              <span className="font-mono text-zinc-200 font-medium">MFA Enforced</span>
              <span className="text-zinc-600 font-mono">·</span>
              <span className="font-mono text-zinc-400">Password Healthy (18d)</span>
              <span className="text-zinc-600 font-mono">·</span>
              <span className="font-mono text-zinc-400">3 Active Sessions</span>
              <span className="text-zinc-600 font-mono">·</span>
              <span className="font-mono text-teal-400">Hardware Token Active</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              SEC-POL 2025.1 COMPLIANT
            </span>
          </div>

          {/* Section 1: Identity Card */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display-serif text-lg text-white">Identity &amp; Credentials</h2>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">ID: OP-88241</span>
            </div>
            <div className="bg-[#111317] border border-zinc-800/80 p-5 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start md:items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-sm bg-zinc-800/80 border border-zinc-700 flex items-center justify-center font-display-serif text-xl text-teal-300 font-medium">
                    JC
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-teal-400 border-2 border-[#111317]"></span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base text-white font-semibold">
                      {profile?.display_name || email || "Analyst"}
                    </span>
                    <span className="bg-teal-950/60 border border-teal-800/50 text-teal-300 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide">
                      Verified Staff
                    </span>
                    <span className="bg-zinc-800/60 border border-zinc-700/60 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-mono">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">{profile?.role || "Analyst"}</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-zinc-500 font-mono text-xs">
                    <span className="text-zinc-300">{email}</span>
                    <span className="text-zinc-600">/</span>
                    <span>{profile?.organization || "—"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-2">
                <button
                  className="px-3.5 py-1.5 rounded-sm bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 text-xs font-mono transition-colors"
                  type="button"
                  onClick={editProfile}
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
                {editing && (
                  <div className="flex flex-col gap-2 w-full md:w-64">
                    {(["display_name", "organization", "role", "timezone"] as const).map((k) => (
                      <input
                        key={k}
                        value={form[k]}
                        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                        placeholder={k}
                        className="h-8 px-2 bg-[#14171c] border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-teal-500/50"
                      />
                    ))}
                    <button
                      className="px-3 py-1.5 rounded-sm bg-teal-500 hover:bg-teal-400 text-black text-xs font-mono font-semibold"
                      type="button"
                      onClick={saveProfile}
                    >
                      Save
                    </button>
                  </div>
                )}
                <span className="text-[11px] font-mono text-zinc-500">Last sign-in: Today, 14:02 UTC (FIDO2)</span>
              </div>
            </div>
          </section>

          {/* Section 2: Preferences */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display-serif text-lg text-white">Workbench Preferences</h2>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Analysis Defaults</span>
            </div>
            <div className="bg-[#111317] border border-zinc-800/80 rounded-sm divide-y divide-zinc-800/60 text-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-zinc-200">Timezone Base</span>
                  <span className="text-zinc-500 text-[11px]">Standardized reference frame for chronological event dissection</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                  <span className="text-teal-400">UTC (Universal Coordinated Time) [Default for Forensics]</span>
                  <button className="text-zinc-400 hover:text-white uppercase text-[10px] tracking-wider" type="button" onClick={changePreference}>Change</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors gap-2 bg-[#0e1014]/60">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-zinc-200">Timestamp Precision &amp; Format</span>
                  <span className="text-zinc-500 text-[11px]">Packet delta display and ISO notation standards</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                  <span className="text-zinc-300">YYYY-MM-DD HH:mm:ss.sss (ISO 8601 High-Precision)</span>
                  <button className="text-zinc-400 hover:text-white uppercase text-[10px] tracking-wider" type="button" onClick={changePreference}>Change</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-zinc-200">Default Analysis Landing View</span>
                  <span className="text-zinc-500 text-[11px]">Primary workspace panel rendered on capture ingest completion</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                  <span className="text-zinc-300">Analysis Results (Summary Verdict &amp; P0 Findings)</span>
                  <button className="text-zinc-400 hover:text-white uppercase text-[10px] tracking-wider" type="button" onClick={changePreference}>Change</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors gap-2 bg-[#0e1014]/60">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-zinc-200">Export Delivery Format</span>
                  <span className="text-zinc-500 text-[11px]">Cryptographic signature and structure for executive artifacts</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                  <span className="text-zinc-300">PDF (Signed &amp; Ed25519 Fingerprinted)</span>
                  <button className="text-zinc-400 hover:text-white uppercase text-[10px] tracking-wider" type="button" onClick={changePreference}>Change</button>
                </div>
              </div>

            </div>
          </section>

          {/* Section 3: Security & Authentication */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display-serif text-lg text-white">Security &amp; Authentication</h2>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Zero-Trust Identity</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password & Auth */}
              <div className="bg-[#111317] border border-zinc-800/80 p-4 rounded-sm flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">Analyst Password</span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-950/40 border border-teal-800/40 px-1.5 py-0.5 rounded">
                      CNSA 1.0 Compliant
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Last changed 18 days ago. Entropy threshold 16+ characters with hardware iteration standard.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 gap-2">
                  <input
                    type="password"
                    value={pw.old_password}
                    onChange={(e) => setPw({ ...pw, old_password: e.target.value })}
                    placeholder="current passphrase"
                    className="h-8 px-2 bg-[#14171c] border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-teal-500/50 w-36"
                  />
                  <input
                    type="password"
                    value={pw.new_password}
                    onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
                    placeholder="new passphrase (8+)"
                    className="h-8 px-2 bg-[#14171c] border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-teal-500/50 w-36"
                  />
                  <button
                    className="px-3 py-1 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono transition-colors"
                    type="button"
                    onClick={changePassword}
                  >
                    Change Password
                  </button>
                  <span className="text-[11px] font-mono text-zinc-500">Rotation due in 72d</span>
                </div>
              </div>

              {/* MFA */}
              <div className="bg-[#111317] border border-zinc-800/80 p-4 rounded-sm flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">Multi-Factor Authentication</span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-950/40 border border-teal-800/40 px-1.5 py-0.5 rounded uppercase">
                      Enforced
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    FIDO2 Hardware Key (YubiKey 5C FIPS) registered as primary authenticator. Time-based TOTP fallback active.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                  <button
                    className="px-3 py-1 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono transition-colors"
                    type="button"
                    onClick={manageKeys}
                  >
                    Manage Security Keys
                  </button>
                  <span className="text-[11px] font-mono text-teal-400">2 Tokens Registered</span>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="md:col-span-2 bg-[#111317] border border-zinc-800/80 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">Active Concurrent Sessions</span>
                    <span className="text-xs font-mono text-teal-400">(3 Active)</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    Current: Workstation DPDK-Forensics-01 Linux x86_64 · Mobile SecOps Pager · Standby Console
                  </span>
                </div>
                <button
                  className="self-start sm:self-auto px-3.5 py-1.5 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono transition-colors shrink-0"
                  type="button"
                  onClick={manageSessions}
                >
                  Manage Sessions
                </button>
              </div>
            </div>
          </section>

          {/* Section 4: Audit Log */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display-serif text-lg text-white">Recent Security &amp; Ledger Events</h2>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Audit Trail</span>
            </div>
            <div className="bg-[#111317] border border-zinc-800/80 rounded-sm divide-y divide-zinc-800/60 text-xs">
              
              <div className="flex items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[16px] text-teal-400">key</span>
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-medium">Signed in via Hardware Key (FIDO2)</span>
                    <span className="text-zinc-500 font-mono text-[11px]">Console Session ID: #sess-9941a</span>
                  </div>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">Today, 14:02 UTC</span>
              </div>

              <div className="flex items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors bg-[#0e1014]/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[16px] text-teal-400">description</span>
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-medium">Generated technical forensic report (weak-vpn-07.pcap)</span>
                    <span className="text-zinc-500 font-mono text-[11px]">Export SHA-256 Digest Attached</span>
                  </div>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">Yesterday, 16:45 UTC</span>
              </div>

              <div className="flex items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[16px] text-zinc-400">tune</span>
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-medium">Updated forensic engine preference preset</span>
                    <span className="text-zinc-500 font-mono text-[11px]">Profile: Enterprise-Edge-Audit</span>
                  </div>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">3 days ago</span>
              </div>

              <div className="flex items-center justify-between p-3.5 hover:bg-zinc-800/20 transition-colors bg-[#0e1014]/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[16px] text-zinc-400">sync</span>
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-medium">Rotated API &amp; Dissection Worker Auth Token</span>
                    <span className="text-zinc-500 font-mono text-[11px]">Scope: DPDK Capture Buffers</span>
                  </div>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">18 days ago</span>
              </div>

            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => toast({ title: "Audit Trail", body: "Full immutable audit ledger loaded (mock).", kind: "info" })}
                className="text-xs font-mono text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors"
              >
                <span>View Full Audit Log</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </section>

        </div>
      </AppShell>
    </div>
  );
}
