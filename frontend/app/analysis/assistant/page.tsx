"use client";
import Link from "next/link";
import { useRef, useState } from "react";

const REMEDIATION_STANZAS = `# TunnelSight Remediation Stanzas for weak-vpn-07.pcap
# Enforce DH Group 19 (ECP-256) & PFS on Child SA
conn weak-vpn-07-hardened
    keyexchange=ikev2
    ike=aes256gcm16-prfsha256-ecp256!
    esp=aes256gcm16-ecp256!
    rekey=yes
    reauth=no
    auto=start`;

export default function AssistantPage() {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const [copiedStanzas, setCopiedStanzas] = useState(false);
  const [copyFallback, setCopyFallback] = useState(false);
  const [applyState, setApplyState] = useState<"idle" | "applying" | "applied">("idle");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleAccordion = (id: string) =>
    setOpenAccordions((s) => ({ ...s, [id]: !s[id] }));
  const openEvidence = (id: string) => {
    setOpenAccordions((s) => ({ ...s, [id]: true }));
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const handleCopyStanzas = () => {
    navigator.clipboard.writeText(REMEDIATION_STANZAS).then(() => {
      setCopiedStanzas(true);
      setCopyFallback(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedStanzas(false), 2000);
    }).catch(() => {
      setCopyFallback(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopyFallback(false), 2000);
    });
  };
  const handleExportJson = () => {
    const dossier = {
      capture: "weak-vpn-07.pcap",
      score: 47,
      risk: "HIGH_RISK_CRITICAL_DEGRADATION",
      model: "SecReason-v4.2-14B",
      findings: [
        { id: "F-01", title: "Weak DH Group 2", evidence: "Frame #42 MODP-1024", status: "CONFIRMED" },
        { id: "F-02", title: "PFS Disabled", evidence: "Frame #1421 Omitted KEi", status: "CONFIRMED" },
        { id: "F-03", title: "Legacy 3DES/SHA-1 Fallback", evidence: "IKE SA Transform proposals", status: "CONFIRMED" },
      ],
      inference_timestamp: "2025-05-18T14:32:08Z",
    };
    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "weak-vpn-07-explanation-dossier.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleApplyStanzas = () => {
    setApplyState("applying");
    if (applyTimer.current) clearTimeout(applyTimer.current);
    applyTimer.current = setTimeout(() => setApplyState("applied"), 700);
  };
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<aside className="fixed left-0 top-0 h-full w-sidebar-expanded bg-surface-container-lowest z-50 flex flex-col justify-between select-none"><div className="flex flex-col"><div className="h-header-height px-space-base flex items-center gap-space-sm bg-surface-container-lowest"><span className="material-symbols-outlined text-primary text-[20px]">security</span><div className="flex items-baseline gap-space-2xs"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">TunnelSight</span><span className="font-code-sm text-code-sm text-outline">/</span><span className="font-code-sm text-code-sm text-on-surface-variant font-medium">IPsecXray</span></div></div><div className="px-space-base py-space-xs bg-surface-container-low"><div className="flex items-center justify-between text-outline"><span className="font-label-sm text-label-sm uppercase tracking-wider">Operational Posture</span><span className="font-code-sm text-code-sm text-primary">v2.4.1-rc3</span></div></div><nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><Link aria-current="page" className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors bg-primary-container text-on-primary-container font-semibold" href="/overview"><span className="material-symbols-outlined text-[18px]">dashboard</span><span className="font-body-md text-body-md">Overview</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analyze"><span className="material-symbols-outlined text-[18px]">file_open</span><span className="font-body-md text-body-md">Analyze PCAP</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/live"><span className="material-symbols-outlined text-[18px]">pulse_alert</span><span className="font-body-md text-body-md">Live Analysis</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/configuration"><span className="material-symbols-outlined text-[18px]">settings_ethernet</span><span className="font-body-md text-body-md">VPN Configurations</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/traffic"><span className="material-symbols-outlined text-[18px]">insights</span><span className="font-body-md text-body-md">Traffic Intelligence</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/findings"><span className="material-symbols-outlined text-[18px]">policy</span><span className="font-body-md text-body-md">Findings</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/analysis/reports"><span className="material-symbols-outlined text-[18px]">assignment</span><span className="font-body-md text-body-md">Reports</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/dataset"><span className="material-symbols-outlined text-[18px]">dataset</span><span className="font-body-md text-body-md">Dataset / Testbed</span></Link><Link className="flex items-center gap-space-md px-space-md py-space-xs rounded transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface" href="/settings"><span className="material-symbols-outlined text-[18px]">tune</span><span className="font-body-md text-body-md">Settings</span></Link></nav></div><div className="p-space-sm bg-surface-container-lowest"><div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs"><div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-outline uppercase">Pipeline</span><span className="text-tertiary font-code-sm text-code-sm">ONLINE</span></div><div className="w-full bg-surface-container-highest h-1 rounded"><div className="bg-primary-container h-1 rounded w-3/4"></div></div><div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant"><span className="truncate">DPDK Core 0-3</span><span className="text-on-surface">0.02ms</span></div></div></div></aside><div className="pl-sidebar-expanded"><header className="fixed top-0 left-sidebar-expanded right-0 h-header-height bg-surface-container-lowest z-40 flex items-center justify-between px-space-base select-none"><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded"><span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span><span className="font-code-sm text-code-sm text-on-surface font-medium">ENGINE ONLINE</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-on-surface-variant">DPDK RX: READY</span><span className="text-outline-variant font-code-sm text-code-sm">|</span><span className="font-code-sm text-code-sm text-tertiary">ML WORKERS: 4/4 ACTIVE</span></div><div className="hidden xl:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded"><span className="font-label-sm text-label-sm text-outline uppercase">Profile</span><span className="font-code-sm text-code-sm text-primary font-medium">Enterprise-Edge-Audit</span></div></div><div className="flex items-center gap-space-md"><div className="hidden 2xl:flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant"><span className="text-outline">UTC</span><span>2025-05-18 14:32:09</span><span className="text-outline-variant">|</span><span className="text-outline">Buffer:</span><span className="text-tertiary">98.4% Free</span></div><button data-action="search" className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-code-sm text-code-sm">Search packets/SPI/tunnels</span><kbd className="bg-surface-container-highest px-space-xs rounded font-code-sm text-code-sm text-outline">⌘K</kbd></button><div className="flex items-center gap-space-xs"><button data-action="export" className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Quick Export" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button><button data-action="notifications" className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Notification Feed" type="button"><span className="material-symbols-outlined text-[18px]">notifications</span><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span></button></div><div className="h-4 w-px bg-surface-container-highest mx-space-2xs"></div><div data-action="profile" role="button" tabIndex={0} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main className="relative pt-header-height w-full bg-background min-h-screen"><div className="flex flex-col w-full">
<div className="px-space-xl py-space-lg flex flex-col gap-space-lg max-w-[1520px] mx-auto w-full">
{/* 1. Sub-navigation & Engine Status Pill */}
<div className="flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
<span className="hover:text-on-surface cursor-pointer transition-colors">Captures</span>
<span className="text-outline-variant">/</span>
<span className="text-primary font-medium">weak-vpn-07.pcap</span>
<span className="text-outline-variant">/</span>
<span className="text-on-surface font-semibold">AI Explanation &amp; Analyst Assist</span>
</div>
<div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-2xs rounded-lg">
<span className="material-symbols-outlined text-[14px] text-tertiary">verified_user</span>
<span className="font-code-sm text-code-sm text-on-surface tracking-tight font-medium">
          LOCAL REASONING ENGINE — DETERMINISTIC
        </span>
<span className="text-outline-variant font-code-sm text-code-sm">·</span>
<span className="font-code-sm text-code-sm text-primary font-semibold">SecReason-v4.2</span>
<span className="ml-space-2xs bg-surface-container-high px-space-xs py-space-2xs rounded font-label-sm text-label-sm text-tertiary uppercase">
          PROVENANCE VALIDATED
        </span>
</div>
</div>
{/* 2. Header & Quick Actions */}
<div className="flex flex-wrap items-end justify-between gap-space-md">
<div className="flex flex-col gap-space-2xs">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
          AI Explanation &amp; Analyst Assist
        </h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Evidence-backed deterministic interpretation of the current IPsec cryptographic posture and degradation vectors.
        </p>
</div>
<div className="flex items-center gap-space-sm">
<button className="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-bright text-on-surface px-space-md py-space-xs rounded-lg transition-colors font-code-sm text-code-sm shadow-sm" id="btnExportJson" type="button" onClick={handleExportJson}>
<span className="material-symbols-outlined text-[16px] text-secondary">data_object</span>
<span>Export Explanation Dossier (.json)</span>
</button>
<button className={applyState === "applied" ? "flex items-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary-container px-space-md py-space-xs rounded-lg transition-colors font-body-md text-body-md font-semibold shadow-sm bg-tertiary text-on-tertiary" : "flex items-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary-container px-space-md py-space-xs rounded-lg transition-colors font-body-md text-body-md font-semibold shadow-sm"} id="btnApplyStanzas" type="button" onClick={handleApplyStanzas}>
{applyState === "idle" ? (<><span className="material-symbols-outlined text-[16px]">terminal</span><span>Apply Remediation Stanzas</span></>) : applyState === "applying" ? "Applying to Gateways..." : "Stanzas Applied (Pending Commit)"}
</button>
</div>
</div>
{/* 3. Assessment Summary Banner */}
<div className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col xl:flex-row gap-space-lg justify-between items-stretch">
<div className="flex items-center gap-space-lg">
<div className="flex flex-col justify-center items-center bg-surface-container-lowest px-space-xl py-space-md rounded-lg min-w-[130px]">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Security Score</span>
<div className="flex items-baseline gap-space-2xs mt-space-2xs">
<span className="font-display text-display font-semibold text-error">47</span>
<span className="font-code-sm text-code-sm text-outline">/ 100</span>
</div>
<span className="bg-error-container/30 text-error font-label-sm text-label-sm px-space-xs py-space-2xs rounded mt-space-xs uppercase tracking-wide">
            High Risk · Critical
          </span>
</div>
<div className="flex flex-col justify-center gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Primary Degradation Driver</span>
</div>
<p className="font-headline-md text-headline-md text-on-surface font-semibold">
            Deprecated MODP-1024 + No PFS on Child SA
          </p>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
            Diffie-Hellman Group 2 parameter reuse exposes rekeying transitions to discrete logarithm precomputation; lack of ephemeral keying voids post-compromise security.
          </p>
</div>
</div>
<div className="flex flex-wrap sm:flex-nowrap items-center gap-space-md self-center xl:self-auto xl:pl-space-lg xl:border-l-0">
<div className="bg-surface-container px-space-md py-space-sm rounded-lg flex flex-col gap-space-2xs min-w-[170px]">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Evaluated Capture</span>
<span className="font-code-sm text-code-sm text-primary font-medium">weak-vpn-07.pcap</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">04:12 · 842,914 pkts</span>
</div>
<div className="bg-surface-container px-space-md py-space-sm rounded-lg flex flex-col gap-space-2xs min-w-[170px]">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">AI Confidence</span>
<span className="font-code-sm text-code-sm text-tertiary font-semibold">94.2%</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden">
<div className="bg-tertiary h-1 w-[94.2%]"></div>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">Bounded by RFC 7296</span>
</div>
</div>
</div>
{/* 4. Evidence Boundary (Strict 3-Column Grounding Model) */}
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
          Evidence Bounded Classification Ledger
        </span>
<span className="font-code-sm text-code-sm text-outline">Deterministic Scope: Unencrypted Headers &amp; SAs</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
{/* Confirmed */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs relative overflow-hidden">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
<span className="font-code-sm text-code-sm text-tertiary font-semibold">CONFIRMED (100%)</span>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase">Dissected Frames</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
            Protocol facts extracted directly from IKE_SA_INIT and CREATE_CHILD_SA frame exchanges: DH Group 2, AES-CBC-128, lifetime 28,800s.
          </p>
</div>
{/* Inferred */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs relative overflow-hidden">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">model_training</span>
<span className="font-code-sm text-code-sm text-primary font-semibold">INFERRED (75–90%)</span>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase">Statistical ML</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
            ML-derived traffic &amp; flow anomalies. Isolation Forest egress spike in Window W-28 and 83% confidence ABR video classification without payload decryption.
          </p>
</div>
{/* Unknown */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs relative overflow-hidden">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[18px]">visibility_off</span>
<span className="font-code-sm text-code-sm text-secondary font-semibold">UNKNOWN (Blind Spot)</span>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase">Encapsulated</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
            Inner tunnel plaintext payload, application layer protocol headers, and uncaptured responder private keys (securely sealed by ESP cipher).
          </p>
</div>
</div>
</div>
{/* 5. Key Findings Ledger (Top 3 Minimalist Cards) */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">
          Critical Protocol Findings (3 Detected)
        </h2>
<span className="font-code-sm text-code-sm text-on-surface-variant">Sorted by CVE/NIST CVSS Severity</span>
</div>
<div className="flex flex-col gap-space-xs">
{/* Finding 1 */}
<div className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md transition-colors">
<div className="flex items-start gap-space-md min-w-0">
<div className="bg-error-container/20 text-error px-space-xs py-space-2xs rounded font-label-sm text-label-sm uppercase font-semibold shrink-0">
              CRITICAL
            </div>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                  Weak DH Group 2 (MODP-1024) Negotiated
                </span>
<span className="bg-tertiary-container/20 text-tertiary font-code-sm text-code-sm px-space-xs py-space-2xs rounded">
                  CONFIRMED PROTOCOL FACT
                </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Enables Logjam-style discrete logarithm precomputation and retrospective decryption of session keys (NIST SP 800-131A Rev 2 transition violation).
              </p>
</div>
</div>
<button className="evidence-trigger shrink-0 flex items-center gap-space-2xs font-code-sm text-code-sm text-primary hover:text-primary-fixed transition-colors" data-target="acc-ike" type="button" onClick={() => openEvidence("acc-ike")}>
<span>View Evidence</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/* Finding 2 */}
<div className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md transition-colors">
<div className="flex items-start gap-space-md min-w-0">
<div className="bg-error-container/20 text-error px-space-xs py-space-2xs rounded font-label-sm text-label-sm uppercase font-semibold shrink-0">
              CRITICAL
            </div>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                  Perfect Forward Secrecy (PFS) Disabled
                </span>
<span className="bg-tertiary-container/20 text-tertiary font-code-sm text-code-sm px-space-xs py-space-2xs rounded">
                  CONFIRMED PROTOCOL FACT
                </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                CREATE_CHILD_SA exchange completely omits ephemeral Key Exchange (KE) payloads; initial SA compromise retroactively cascades to all subsequent rekeys.
              </p>
</div>
</div>
<button className="evidence-trigger shrink-0 flex items-center gap-space-2xs font-code-sm text-code-sm text-primary hover:text-primary-fixed transition-colors" data-target="acc-sa" type="button" onClick={() => openEvidence("acc-sa")}>
<span>View Evidence</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/* Finding 3 */}
<div className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md transition-colors">
<div className="flex items-start gap-space-md min-w-0">
<div className="bg-secondary-container/50 text-secondary-fixed px-space-xs py-space-2xs rounded font-label-sm text-label-sm uppercase font-semibold shrink-0">
              HIGH
            </div>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                  Legacy Fallback Cipher Suites Permitted (3DES / SHA-1)
                </span>
<span className="bg-tertiary-container/20 text-tertiary font-code-sm text-code-sm px-space-xs py-space-2xs rounded">
                  CONFIRMED PROPOSAL TRANS
                </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Responder accepted 3DES-CBC and HMAC-SHA1-96 in transform matrices; Sweet32 birthday collisions are realistically actionable on high-throughput links.
              </p>
</div>
</div>
<button className="evidence-trigger shrink-0 flex items-center gap-space-2xs font-code-sm text-code-sm text-primary hover:text-primary-fixed transition-colors" data-target="acc-crypto" type="button" onClick={() => openEvidence("acc-crypto")}>
<span>View Evidence</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</div>
{/* 6. AI Assessment Brief */}
<div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md shadow-sm relative">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
<span className="font-headline-md text-headline-md text-on-surface font-semibold">
            Forensic Reasoning Assessment Brief
          </span>
</div>
<span className="font-code-sm text-code-sm text-outline">Ref: RFC-7296-SEC-6.1</span>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
{/* Subsection 1 */}
<div className="flex flex-col gap-space-xs bg-surface-container p-space-md rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">01. Assessment</span>
</div>
<p className="font-body-md text-body-md text-on-surface leading-relaxed">
            The composite security score of 47/100 reflects a high-risk operational state caused by Phase 1 cryptographic obsolescence coupled with total absence of Phase 2 rekey isolation. The initiator and responder established an SA over MODP-1024, an asymmetric prime group vulnerable to Number Field Sieve (NFS) precomputation. Because child SAs subsequently reuse the master key without an injected KE payload, the entire tunnel session key derivation chain is fundamentally fragile.
          </p>
</div>
{/* Subsection 2 */}
<div className="flex flex-col gap-space-xs bg-surface-container p-space-md rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm text-error uppercase tracking-wider font-semibold">02. Why It Matters</span>
</div>
<p className="font-body-md text-body-md text-on-surface leading-relaxed">
            Passive interception of this link facilitates Store-Now-Decrypt-Later (SNDL) exploitation by well-resourced adversaries. Any party recording raw wire payloads can retrospectively recover the negotiated symmetric session keys once the DH-1024 discrete log is calculated. Operationally, this triggers instant compliance failure under NIST SP 800-77 Rev 1, PCI-DSS 4.0 Requirement 4.2.1, and US CNSA Suite 1.0 specifications.
          </p>
</div>
{/* Subsection 3 */}
<div className="flex flex-col gap-space-xs bg-surface-container p-space-md rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-semibold">03. Recommended Action</span>
</div>
<p className="font-body-md text-body-md text-on-surface leading-relaxed">
            Immediately deprecate MODP-1024 across both security gateways. Update transform proposals to mandate ECP-256 (DH Group 19) or MODP-2048 (DH Group 14) at minimum. Enable strict Perfect Forward Secrecy on all Child SA renegotiations so every rekey cycle requires an independent, ephemeral Elliptic Curve key exchange. Strip all 3DES and HMAC-SHA1 transform proposals from configuration files.
          </p>
</div>
</div>
</div>
{/* 7. Supporting Evidence Accordions (Progressive Disclosure) */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">
          Granular Verification Evidence &amp; Traceability
        </h2>
<span className="font-code-sm text-code-sm text-on-surface-variant">Click row to toggle protocol packet inspection</span>
</div>
<div className="flex flex-col gap-space-xs" id="accordionContainer">
{/* Item 1: IKE Negotiation Evidence */}
<div className="accordion-item bg-surface-container-low rounded-lg overflow-hidden transition-all" id="acc-ike">
<button className="accordion-header w-full px-space-md py-space-sm flex items-center justify-between text-left hover:bg-surface-container" type="button" onClick={() => toggleAccordion("acc-ike")}>
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-primary text-[20px]">swap_horiz</span>
<div className="flex items-center gap-space-sm">
<span className="font-headline-sm text-headline-sm text-on-surface">IKE Negotiation Evidence</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Frame #42 · Transform Type 4: ID 0x0002</span>
</div>
</div>
<span className="material-symbols-outlined accordion-icon text-outline transition-transform" style={{ transform: openAccordions["acc-ike"] ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
</button>
<div className={openAccordions["acc-ike"] ? "accordion-body px-space-md pb-space-md pt-space-xs bg-surface-container-lowest" : "accordion-body hidden px-space-md pb-space-md pt-space-xs bg-surface-container-lowest"}>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-xs font-code-sm text-code-sm">
<span className="font-label-sm text-label-sm text-outline uppercase">Frame Dissection Summary</span>
<div className="p-space-sm bg-surface-container rounded text-on-surface-variant flex flex-col gap-space-2xs">
<div><span className="text-outline">Exchange Type:</span> <span className="text-on-surface">IKE_SA_INIT (34)</span></div>
<div><span className="text-outline">Initiator SPI:</span> <span className="text-on-surface font-semibold">0x7c9b820a44f12800</span></div>
<div><span className="text-outline">Responder SPI:</span> <span className="text-on-surface font-semibold">0x3e18a9947702f3b9</span></div>
<div><span className="text-outline">Payload SA Transform:</span> <span className="text-error font-medium">Type 4 (DH Group) = 0x0002 [1024-bit MODP]</span></div>
<div><span className="text-outline">Integrity Transform:</span> <span className="text-on-surface">Type 3 (AUTH) = 0x0002 [AUTH_HMAC_SHA1_96]</span></div>
</div>
</div>
<div className="flex flex-col gap-space-xs font-code-sm text-code-sm">
<span className="font-label-sm text-label-sm text-outline uppercase">Hex Stream Slice (Frame #42, Offset 0x0080)</span>
<pre className="p-space-sm bg-surface-container rounded text-on-surface-variant overflow-x-auto leading-tight"><code>0080: 00 00 00 08 04 00 00 02  00 00 00 08 03 00 00 02  ................
0090: 00 00 00 08 01 00 00 07  00 00 00 08 02 00 00 02  ................
00a0: 22 00 00 88 00 02 00 00  9f 44 c1 12 80 43 f9 bb  "........D...C..</code></pre>
</div>
</div>
</div>
</div>
{/* Item 2: Cryptographic Evidence */}
<div className="accordion-item bg-surface-container-low rounded-lg overflow-hidden transition-all" id="acc-crypto">
<button className="accordion-header w-full px-space-md py-space-sm flex items-center justify-between text-left hover:bg-surface-container" type="button" onClick={() => toggleAccordion("acc-crypto")}>
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
<div className="flex items-center gap-space-sm">
<span className="font-headline-sm text-headline-sm text-on-surface">Cryptographic Strength Evidence</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">NIST CVE-CVSS Calibration · Work Factor &lt; 2^80</span>
</div>
</div>
<span className="material-symbols-outlined accordion-icon text-outline transition-transform" style={{ transform: openAccordions["acc-crypto"] ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
</button>
<div className={openAccordions["acc-crypto"] ? "accordion-body px-space-md pb-space-md pt-space-xs bg-surface-container-lowest" : "accordion-body hidden px-space-md pb-space-md pt-space-xs bg-surface-container-lowest"}>
<div className="p-space-sm bg-surface-container rounded font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-space-xs">
<p>
                Diffie-Hellman Group 2 uses a 1024-bit modulus prime specified in RFC 2409. The computational cost to solve discrete logarithms using the Number Field Sieve (NFS) algorithm for a 1024-bit modulus is evaluated by academic cryptography standards at approximately ~2^80 operations.
              </p>
<div className="flex items-center gap-space-md font-code-sm text-code-sm pt-space-2xs text-on-surface">
<span className="text-error font-semibold">CVSS 3.1 Base Score: 7.5 (High)</span>
<span className="text-outline">|</span>
<span>Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N</span>
<span className="text-outline">|</span>
<span className="text-primary">Policy NIST SP 800-131A: DISALLOWED</span>
</div>
</div>
</div>
</div>
{/* Item 3: Security Association Evidence */}
<div className="accordion-item bg-surface-container-low rounded-lg overflow-hidden transition-all" id="acc-sa">
<button className="accordion-header w-full px-space-md py-space-sm flex items-center justify-between text-left hover:bg-surface-container" type="button" onClick={() => toggleAccordion("acc-sa")}>
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-primary text-[20px]">shield</span>
<div className="flex items-center gap-space-sm">
<span className="font-headline-sm text-headline-sm text-on-surface">Security Association (SA) Lifecycle Evidence</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Child SA 0x9a021da3 · Rekey Interval 28,800s · Omitted KE</span>
</div>
</div>
<span className="material-symbols-outlined accordion-icon text-outline transition-transform" style={{ transform: openAccordions["acc-sa"] ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
</button>
<div className={openAccordions["acc-sa"] ? "accordion-body px-space-md pb-space-md pt-space-xs bg-surface-container-lowest" : "accordion-body hidden px-space-md pb-space-md pt-space-xs bg-surface-container-lowest"}>
<div className="p-space-sm bg-surface-container rounded font-code-sm text-code-sm text-on-surface-variant flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span>Child SA SPI: <strong className="text-on-surface">0x9a021da3</strong></span>
<span>Direction: <strong className="text-on-surface">Inbound / Outbound ESP</strong></span>
<span>Lifetime Hard Cap: <strong className="text-error">28,800 sec (8.0 hrs)</strong></span>
</div>
<p className="font-body-sm text-body-sm pt-space-2xs">
                Dissection of packet #1421 (CREATE_CHILD_SA) confirms the payload contains only Proposal (SA), Nonce (Ni/Nr), and Traffic Selectors (TSi/TSr). No Key Exchange (KEi) payload is present, proving PFS renegotiation is not enforced on the gateway peer.
              </p>
</div>
</div>
</div>
{/* Item 4: ML Traffic Evidence */}
<div className="accordion-item bg-surface-container-low rounded-lg overflow-hidden transition-all" id="acc-ml">
<button className="accordion-header w-full px-space-md py-space-sm flex items-center justify-between text-left hover:bg-surface-container" type="button" onClick={() => toggleAccordion("acc-ml")}>
<div className="flex items-center gap-space-md">
<span className="material-symbols-outlined text-primary text-[20px]">ssid_chart</span>
<div className="flex items-center gap-space-sm">
<span className="font-headline-sm text-headline-sm text-on-surface">ML Traffic &amp; Fingerprint Evidence</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Window W-28 · Isolation Forest Score +0.69 · Zero Padding Leak</span>
</div>
</div>
<span className="material-symbols-outlined accordion-icon text-outline transition-transform" style={{ transform: openAccordions["acc-ml"] ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
</button>
<div className={openAccordions["acc-ml"] ? "accordion-body px-space-md pb-space-md pt-space-xs bg-surface-container-lowest" : "accordion-body hidden px-space-md pb-space-md pt-space-xs bg-surface-container-lowest"}>
<div className="p-space-sm bg-surface-container rounded font-code-sm text-code-sm text-on-surface-variant flex flex-col gap-space-xs">
<p className="font-body-sm text-body-sm">
                Flow-level inter-arrival time and packet length analysis indicates high-throughput encrypted streaming behavior. The system detected zero unpadded frame leakage, confirming that ESP integrity remains operational despite the cryptographic weakness of the underlying keys.
              </p>
<div className="flex items-center gap-space-md text-on-surface pt-space-2xs">
<span>Isolation Score: <strong className="text-tertiary font-semibold">0.69 (Outlier Detected)</strong></span>
<span className="text-outline">|</span>
<span>Class: <strong className="text-primary font-semibold">Video/ABR Encrypted Tunnel</strong></span>
<span className="text-outline">|</span>
<span>Confidence: <strong className="text-tertiary">83%</strong></span>
</div>
</div>
</div>
</div>
</div>
</div>
{/* 8. Prioritized Remediation Roadmap */}
<div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md shadow-sm">
<div className="flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-tertiary text-[20px]">build_circle</span>
<h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
            Prioritized Remediation Roadmap
          </h2>
</div>
<button className="flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface px-space-md py-space-xs rounded-lg transition-colors font-code-sm text-code-sm" id="btnCopyAllStanzas" type="button" onClick={handleCopyStanzas}>
<span className="material-symbols-outlined text-[16px] text-primary">content_copy</span>
<span id="copyBtnLabel">{copiedStanzas ? "Copied to Clipboard!" : copyFallback ? "Copied!" : "Copy All Remediation Stanzas"}</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
{/* Priority 1 */}
<div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between gap-space-sm">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="bg-error-container/30 text-error font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase">
                Priority 1 · Immediate (&lt;24h)
              </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-space-2xs">
              Replace Weak DH Parameter
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Enforce DH Group 14 (MODP-2048) or Group 19 (ECP-256) in Phase 1 proposals across all gateway peers.
            </p>
</div>
<div className="bg-surface-container-lowest p-space-xs rounded font-code-sm text-code-sm text-primary overflow-x-auto">
            ike=aes256gcm16-prfsha256-ecp256!
          </div>
</div>
{/* Priority 2 */}
<div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between gap-space-sm">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="bg-error-container/30 text-error font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase">
                Priority 2 · Critical (&lt;48h)
              </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-space-2xs">
              Enable Child SA PFS
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Mandate an ephemeral Diffie-Hellman exchange during every Child SA rekey cycle to ensure forward secrecy.
            </p>
</div>
<div className="bg-surface-container-lowest p-space-xs rounded font-code-sm text-code-sm text-primary overflow-x-auto">
            esp=aes256gcm16-ecp256!
          </div>
</div>
{/* Priority 3 */}
<div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between gap-space-sm">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="bg-surface-container-highest text-secondary font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold uppercase">
                Priority 3 · Scheduled Maintenance
              </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-space-2xs">
              Purge Legacy Fallback Suites
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Remove legacy 3DES, HMAC-SHA1-96, and MD5 suites from configuration parser files to prevent downgrade tampering.
            </p>
</div>
<div className="bg-surface-container-lowest p-space-xs rounded font-code-sm text-code-sm text-on-surface-variant overflow-x-auto">
            crypto ikev2 policy 10 &gt; no 3des sha1
          </div>
</div>
</div>
</div>
{/* 9. AI Metadata & Provenance Footer */}
<div className="bg-surface-container-lowest px-space-md py-space-sm rounded-lg flex flex-wrap items-center justify-between gap-space-sm font-code-sm text-code-sm text-outline">
<div className="flex flex-wrap items-center gap-space-sm">
<span>Model: <strong className="text-on-surface-variant font-medium">SecReason-v4.2-14B (Local Deterministic Quantized)</strong></span>
<span className="text-outline-variant">·</span>
<span>Context: <strong className="text-on-surface-variant font-medium">RFC-Constrained Structured Context</strong></span>
<span className="text-outline-variant">·</span>
<span>Inference Time: <strong className="text-on-surface-variant font-medium">14:32:08 UTC (84ms)</strong></span>
</div>
<div className="flex items-center gap-space-xs text-tertiary">
<span className="material-symbols-outlined text-[14px]">task_alt</span>
<span>Hallucination Check: 0 ungrounded claims (RFC 7296 verified)</span>
</div>
</div>
</div>

</div></main></div>
    </div>
  );
}
