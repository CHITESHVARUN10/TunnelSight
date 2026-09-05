import Link from "next/link";
export const metadata = { title: "User Profile — Analyst Identity & Settings" };

export default function ProfilePage() {
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span>2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full">
<div className="max-w-4xl mx-auto w-full px-space-xl py-space-2xl flex flex-col gap-space-2xl">
{/* Screen Title & Top Meta */}
<header className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
<div className="flex flex-col gap-space-2xs">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Profile</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Manage your analyst identity, preferences, and account security.</p>
</div>
<div className="flex items-center gap-space-xs self-start bg-surface-container-low px-space-sm py-space-2xs rounded">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Clearance:</span>
<span className="font-code-sm text-code-sm text-primary font-medium">Tier 3 Cryptographic Analyst</span>
</div>
</header>
{/* Top Compact Security Posture Strip */}
<div className="bg-surface-container-lowest px-space-base py-space-xs rounded flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Posture</span>
<span className="font-code-sm text-code-sm text-on-surface font-medium ml-space-2xs">MFA Enforced</span>
<span className="text-outline-variant font-code-sm text-code-sm">·</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Password Healthy (18d)</span>
<span className="text-outline-variant font-code-sm text-code-sm">·</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">3 Active Sessions</span>
<span className="text-outline-variant font-code-sm text-code-sm">·</span>
<span className="font-code-sm text-code-sm text-tertiary">Hardware Token Active</span>
</div>
<span className="font-label-sm text-label-sm text-outline">SEC-POL 2025.1 COMPLIANT</span>
</div>
{/* Section 1: Identity */}
<section className="flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Analyst Identity</h2>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">ID: OP-88241</span>
</div>
<div className="bg-surface-container-low p-space-xl rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-space-xl">
<div className="flex items-start md:items-center gap-space-lg">
<div className="relative flex-shrink-0">
<div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center font-display text-display text-primary">
              JC
            </div>
<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-tertiary"></span>
</div>
<div className="flex flex-col gap-space-2xs">
<div className="flex flex-wrap items-center gap-space-xs">
<span className="font-headline-md text-headline-md text-on-surface font-semibold">Dr. Jonathan Chen</span>
<span className="bg-surface-container-high px-space-xs py-0.5 rounded font-label-sm text-label-sm text-primary uppercase tracking-wide">Verified Staff</span>
<span className="bg-surface-container-high px-space-xs py-0.5 rounded font-code-sm text-code-sm text-tertiary">Active</span>
</div>
<span className="font-body-md text-body-md text-on-surface-variant">Lead Cryptographic Forensic Analyst</span>
<div className="flex flex-wrap items-center gap-space-md mt-space-2xs text-outline font-code-sm text-code-sm">
<span className="text-on-surface font-code-sm">j.chen@tunnelsight.defense.internal</span>
<span className="text-outline-variant">/</span>
<span>Cyber Defense Command · Threat Forensics</span>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-space-sm pt-space-sm md:pt-0">
<button className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
            Edit Profile
          </button>
<span className="font-code-sm text-code-sm text-outline">Last sign-in: Today, 14:02 UTC (FIDO2)</span>
</div>
</div>
</section>
{/* Section 2: Preferences */}
<section className="flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Workbench Preferences</h2>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Analysis Defaults</span>
</div>
<div className="bg-surface-container-low rounded overflow-hidden flex flex-col">
{/* Row 1 */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between px-space-base py-space-md hover:bg-surface-container transition-colors gap-space-xs">
<div className="flex flex-col gap-0.5">
<span className="font-label-md text-label-md text-on-surface">Timezone Base</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Standardized reference frame for chronological event dissection</span>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-base">
<span className="font-code-sm text-code-sm text-primary">UTC (Universal Coordinated Time) [Default for Forensics]</span>
<button className="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors uppercase tracking-wider" type="button">Change</button>
</div>
</div>
{/* Row 2 */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between px-space-base py-space-md hover:bg-surface-container transition-colors gap-space-xs bg-surface-container-lowest">
<div className="flex flex-col gap-0.5">
<span className="font-label-md text-label-md text-on-surface">Timestamp Precision &amp; Format</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Packet delta display and ISO notation standards</span>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-base">
<span className="font-code-sm text-code-sm text-on-surface">YYYY-MM-DD HH:mm:ss.sss (ISO 8601 High-Precision)</span>
<button className="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors uppercase tracking-wider" type="button">Change</button>
</div>
</div>
{/* Row 3 */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between px-space-base py-space-md hover:bg-surface-container transition-colors gap-space-xs">
<div className="flex flex-col gap-0.5">
<span className="font-label-md text-label-md text-on-surface">Default Analysis Landing View</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Primary workspace panel rendered on capture ingest completion</span>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-base">
<span className="font-code-sm text-code-sm text-on-surface">Analysis Results (Summary Verdict &amp; P0 Findings)</span>
<button className="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors uppercase tracking-wider" type="button">Change</button>
</div>
</div>
{/* Row 4 */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between px-space-base py-space-md hover:bg-surface-container transition-colors gap-space-xs bg-surface-container-lowest">
<div className="flex flex-col gap-0.5">
<span className="font-label-md text-label-md text-on-surface">Export Delivery Format</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Cryptographic signature and structure for executive artifacts</span>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-base">
<span className="font-code-sm text-code-sm text-on-surface">PDF (Signed &amp; Ed25519 Fingerprinted)</span>
<button className="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors uppercase tracking-wider" type="button">Change</button>
</div>
</div>
</div>
</section>
{/* Section 3: Security & Authentication */}
<section className="flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Security &amp; Authentication</h2>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Zero-Trust Identity</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
{/* Password & Auth Method */}
<div className="bg-surface-container-low p-space-base rounded flex flex-col justify-between gap-space-base">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-medium">Analyst Password</span>
<span className="font-code-sm text-code-sm text-tertiary">CNSA 1.0 Compliant</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Last changed 18 days ago. Entropy threshold 16+ characters with hardware iteration standard.
            </p>
</div>
<div className="flex items-center justify-between pt-space-xs">
<button className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
              Change Password
            </button>
<span className="font-code-sm text-code-sm text-outline">Rotation due in 72d</span>
</div>
</div>
{/* MFA Enforcement */}
<div className="bg-surface-container-low p-space-base rounded flex flex-col justify-between gap-space-base">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-medium">Multi-Factor Authentication</span>
<span className="bg-surface-container-high px-space-xs py-0.5 rounded font-label-sm text-label-sm text-primary uppercase tracking-wide">Enforced</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              FIDO2 Hardware Key (YubiKey 5C FIPS) registered as primary authenticator. Time-based TOTP fallback active.
            </p>
</div>
<div className="flex items-center justify-between pt-space-xs">
<button className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
              Manage Security Keys
            </button>
<span className="font-code-sm text-code-sm text-tertiary">2 Tokens Registered</span>
</div>
</div>
{/* Active Sessions Block (Spans across) */}
<div className="md:col-span-2 bg-surface-container-low p-space-base rounded flex flex-col sm:flex-row sm:items-center justify-between gap-space-base">
<div className="flex flex-col gap-space-2xs">
<div className="flex items-center gap-space-xs">
<span className="font-label-md text-label-md text-on-surface font-medium">Active Concurrent Sessions</span>
<span className="font-code-sm text-code-sm text-primary">(3 Active)</span>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">
              Current: Workstation DPDK-Forensics-01 Linux x86_64 · Mobile SecOps Pager · Standby Console
            </span>
</div>
<button className="self-start sm:self-auto px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex-shrink-0" type="button">
            Manage Sessions
          </button>
</div>
</div>
</section>
{/* Section 4: Recent Account Activity */}
<section className="flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Recent Security &amp; Ledger Events</h2>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Audit Trail</span>
</div>
<div className="bg-surface-container-low rounded overflow-hidden flex flex-col">
{/* Ledger Entry 1 */}
<div className="flex items-center justify-between px-space-base py-space-sm hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-[16px] text-tertiary">key</span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Signed in via Hardware Key (FIDO2)</span>
<span className="font-code-sm text-code-sm text-outline">Console Session ID: #sess-9941a</span>
</div>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">Today, 14:02 UTC</span>
</div>
{/* Ledger Entry 2 */}
<div className="flex items-center justify-between px-space-base py-space-sm hover:bg-surface-container transition-colors bg-surface-container-lowest">
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-[16px] text-primary">description</span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Generated technical forensic report (weak-vpn-07.pcap)</span>
<span className="font-code-sm text-code-sm text-outline">Export SHA-256 Digest Attached</span>
</div>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">Yesterday, 16:45 UTC</span>
</div>
{/* Ledger Entry 3 */}
<div className="flex items-center justify-between px-space-base py-space-sm hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-[16px] text-outline">tune</span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Updated forensic engine preference preset</span>
<span className="font-code-sm text-code-sm text-outline">Profile: Enterprise-Edge-Audit</span>
</div>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">3 days ago</span>
</div>
{/* Ledger Entry 4 */}
<div className="flex items-center justify-between px-space-base py-space-sm hover:bg-surface-container transition-colors bg-surface-container-lowest">
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-[16px] text-outline">sync</span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Rotated API &amp; Dissection Worker Auth Token</span>
<span className="font-code-sm text-code-sm text-outline">Scope: DPDK Capture Buffers</span>
</div>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">18 days ago</span>
</div>
</div>
<div className="flex justify-end">
<a className="font-code-sm text-code-sm text-primary hover:underline flex items-center gap-space-2xs" href="#">
<span>View Full Audit Log</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</div>
</section>
</div>
</div></main></div>
    </div>
  );
}
