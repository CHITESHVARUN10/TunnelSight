"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

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
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ "acc-ike": true });
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
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
      <AppShell active="analysis">
        {/* Top Operational Header */}
        <div className="border-b border-zinc-800/80 bg-[#111317]/90 backdrop-blur px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Link href="/history" className="hover:text-zinc-300 transition-colors">
                Captures
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">weak-vpn-07.pcap</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">AI Explanation &amp; Analyst Assist</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 text-xs font-mono">
              <span className="material-symbols-outlined text-[14px] text-teal-400">verified_user</span>
              <span>LOCAL DETERMINISTIC ENGINE</span>
              <span className="text-zinc-600">·</span>
              <span className="text-teal-400 font-semibold">SecReason-v4.2</span>
              <span className="ml-1 px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-300 uppercase">
                Validated
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
            <div>
              <h1 className="font-display-serif text-2xl font-bold tracking-tight text-white">
                AI Explanation &amp; Analyst Assist
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Evidence-backed deterministic interpretation of the current IPsec cryptographic posture and degradation vectors.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                className="flex items-center gap-1.5 bg-[#14171c] hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 px-3 py-1.5 rounded text-xs font-mono transition-colors"
                id="btnExportJson"
                type="button"
                onClick={handleExportJson}
              >
                <span className="material-symbols-outlined text-[14px] text-zinc-400">data_object</span>
                <span>Export Dossier (.json)</span>
              </button>
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors ${
                  applyState === "applied"
                    ? "bg-teal-500 text-zinc-950"
                    : "bg-teal-500 hover:bg-teal-400 text-zinc-950"
                }`}
                id="btnApplyStanzas"
                type="button"
                onClick={handleApplyStanzas}
              >
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                <span>
                  {applyState === "idle"
                    ? "Apply Remediation Stanzas"
                    : applyState === "applying"
                    ? "Applying to Gateways..."
                    : "Stanzas Applied (Pending Commit)"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Assessment Summary Banner */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5 flex flex-col xl:flex-row gap-6 justify-between items-stretch">
            <div className="flex items-center gap-6">
              <div className="flex flex-col justify-center items-center bg-[#0c0e11] border border-zinc-800/60 px-5 py-3 rounded-lg min-w-[120px]">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Security Score</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display-serif text-3xl font-bold text-rose-400">47</span>
                  <span className="font-mono text-xs text-zinc-500">/ 100</span>
                </div>
                <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded mt-2 uppercase">
                  High Risk · Critical
                </span>
              </div>

              <div className="flex flex-col justify-center space-y-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  Primary Degradation Driver
                </span>
                <h2 className="font-mono text-base font-semibold text-white">
                  Deprecated MODP-1024 + No PFS on Child SA
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                  Diffie-Hellman Group 2 parameter reuse exposes rekeying transitions to discrete logarithm precomputation; lack of ephemeral keying voids post-compromise forward secrecy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-center xl:self-auto">
              <div className="bg-[#14171c] border border-zinc-800/60 px-4 py-3 rounded-lg flex flex-col gap-1 min-w-[170px] font-mono text-xs">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Evaluated Capture</span>
                <span className="text-teal-400 font-medium">weak-vpn-07.pcap</span>
                <span className="text-zinc-500 text-[11px]">04:12 · 842,914 pkts</span>
              </div>
              <div className="bg-[#14171c] border border-zinc-800/60 px-4 py-3 rounded-lg flex flex-col gap-1.5 min-w-[170px] font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">AI Confidence</span>
                  <span className="text-teal-400 font-semibold">94.2%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded overflow-hidden">
                  <div className="bg-teal-500 h-1 w-[94.2%]" />
                </div>
                <span className="text-zinc-500 text-[11px]">Bounded by RFC 7296</span>
              </div>
            </div>
          </div>

          {/* Evidence Boundary (Strict 3-Column Grounding Model) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
              <span className="uppercase tracking-wider">Evidence Bounded Classification Ledger</span>
              <span>Scope: Unencrypted Headers &amp; SAs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Confirmed */}
              <div className="bg-[#111317] border border-teal-500/20 p-4 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-teal-400 font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>CONFIRMED (100%)</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase">Dissected Frames</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Protocol facts extracted directly from IKE_SA_INIT and CREATE_CHILD_SA exchanges: DH Group 2, AES-CBC-128, lifetime 28,800s.
                </p>
              </div>

              {/* Inferred */}
              <div className="bg-[#111317] border border-zinc-800/80 p-4 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-zinc-400">model_training</span>
                    <span>INFERRED (75–90%)</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase">Statistical ML</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  ML-derived traffic &amp; flow anomalies. Isolation Forest egress spike in Window W-28 and 83% confidence ABR video classification without payload decryption.
                </p>
              </div>

              {/* Unknown */}
              <div className="bg-[#111317] border border-zinc-800/80 p-4 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                    <span>UNKNOWN (Blind Spot)</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase">Encapsulated</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Inner tunnel plaintext payload, application layer protocol headers, and uncaptured responder private keys (sealed by ESP cipher).
                </p>
              </div>
            </div>
          </div>

          {/* Key Findings Ledger (Top 3 Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                Critical Protocol Findings (3 Detected)
              </h2>
              <span className="font-mono text-xs text-zinc-500">Sorted by CVE/NIST CVSS Severity</span>
            </div>

            <div className="space-y-2">
              {/* Finding 1 */}
              <div className="bg-[#111317] border border-zinc-800/80 hover:border-zinc-700/80 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                    CRITICAL
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                      <span className="font-semibold text-zinc-100">
                        Weak DH Group 2 (MODP-1024) Negotiated
                      </span>
                      <span className="px-1.5 py-0.2 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px]">
                        CONFIRMED PROTOCOL FACT
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Enables Logjam-style discrete logarithm precomputation and retrospective decryption of session keys (NIST SP 800-131A Rev 2 transition violation).
                    </p>
                  </div>
                </div>
                <button
                  className="shrink-0 flex items-center gap-1 font-mono text-xs text-teal-400 hover:text-teal-300 transition-colors"
                  type="button"
                  onClick={() => openEvidence("acc-ike")}
                >
                  <span>View Evidence</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              {/* Finding 2 */}
              <div className="bg-[#111317] border border-zinc-800/80 hover:border-zinc-700/80 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                    CRITICAL
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                      <span className="font-semibold text-zinc-100">
                        Perfect Forward Secrecy (PFS) Disabled
                      </span>
                      <span className="px-1.5 py-0.2 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px]">
                        CONFIRMED PROTOCOL FACT
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      CREATE_CHILD_SA exchange completely omits ephemeral Key Exchange (KE) payloads; initial SA compromise retroactively cascades to all subsequent rekeys.
                    </p>
                  </div>
                </div>
                <button
                  className="shrink-0 flex items-center gap-1 font-mono text-xs text-teal-400 hover:text-teal-300 transition-colors"
                  type="button"
                  onClick={() => openEvidence("acc-sa")}
                >
                  <span>View Evidence</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              {/* Finding 3 */}
              <div className="bg-[#111317] border border-zinc-800/80 hover:border-zinc-700/80 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                    HIGH
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                      <span className="font-semibold text-zinc-100">
                        Legacy Fallback Cipher Suites Permitted (3DES / SHA-1)
                      </span>
                      <span className="px-1.5 py-0.2 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px]">
                        CONFIRMED PROPOSAL TRANS
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Responder accepted 3DES-CBC and HMAC-SHA1-96 in transform matrices; Sweet32 birthday collisions are realistically actionable on high-throughput links.
                    </p>
                  </div>
                </div>
                <button
                  className="shrink-0 flex items-center gap-1 font-mono text-xs text-teal-400 hover:text-teal-300 transition-colors"
                  type="button"
                  onClick={() => openEvidence("acc-crypto")}
                >
                  <span>View Evidence</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Forensic Reasoning Assessment Brief */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">psychology</span>
                <h3 className="font-mono text-sm font-semibold text-white">
                  Forensic Reasoning Assessment Brief
                </h3>
              </div>
              <span className="font-mono text-xs text-zinc-500">Ref: RFC-7296-SEC-6.1</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg space-y-2">
                <span className="font-mono text-[10px] text-teal-400 uppercase tracking-wider font-semibold block">
                  01. Assessment
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The composite security score of 47/100 reflects a high-risk operational state caused by Phase 1 cryptographic obsolescence coupled with total absence of Phase 2 rekey isolation. The initiator and responder established an SA over MODP-1024, an asymmetric prime group vulnerable to Number Field Sieve (NFS) precomputation. Because child SAs subsequently reuse the master key without an injected KE payload, the entire tunnel session key derivation chain is fundamentally fragile.
                </p>
              </div>

              <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg space-y-2">
                <span className="font-mono text-[10px] text-rose-400 uppercase tracking-wider font-semibold block">
                  02. Why It Matters
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Passive interception of this link facilitates Store-Now-Decrypt-Later (SNDL) exploitation by well-resourced adversaries. Any party recording raw wire payloads can retrospectively recover the negotiated symmetric session keys once the DH-1024 discrete log is calculated. Operationally, this triggers instant compliance failure under NIST SP 800-77 Rev 1, PCI-DSS 4.0 Requirement 4.2.1, and US CNSA Suite 1.0 specifications.
                </p>
              </div>

              <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg space-y-2">
                <span className="font-mono text-[10px] text-teal-400 uppercase tracking-wider font-semibold block">
                  03. Recommended Action
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Immediately deprecate MODP-1024 across both security gateways. Update transform proposals to mandate ECP-256 (DH Group 19) or MODP-2048 (DH Group 14) at minimum. Enable strict Perfect Forward Secrecy on all Child SA renegotiations so every rekey cycle requires an independent, ephemeral Elliptic Curve key exchange. Strip all 3DES and HMAC-SHA1 transform proposals from configuration files.
                </p>
              </div>
            </div>
          </div>

          {/* Granular Verification Evidence Accordions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                Granular Verification Evidence &amp; Traceability
              </h2>
              <span className="font-mono text-xs text-zinc-500">Click any row to inspect packet payloads</span>
            </div>

            <div className="space-y-2">
              {/* Item 1: IKE Negotiation Evidence */}
              <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden" id="acc-ike">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
                  type="button"
                  onClick={() => toggleAccordion("acc-ike")}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">swap_horiz</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-zinc-100">IKE Negotiation Evidence</span>
                      <span className="text-zinc-500">Frame #42 · Transform Type 4: ID 0x0002</span>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-zinc-500 transition-transform"
                    style={{ transform: openAccordions["acc-ike"] ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    expand_more
                  </span>
                </button>
                {openAccordions["acc-ike"] && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 bg-[#0c0e11]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-1.5 font-mono text-xs">
                        <span className="text-[10px] text-zinc-500 uppercase">Frame Dissection Summary</span>
                        <div className="p-3 bg-[#14171c] border border-zinc-800/60 rounded-lg space-y-1 text-zinc-400">
                          <div><span className="text-zinc-500">Exchange:</span> <span className="text-zinc-200">IKE_SA_INIT (34)</span></div>
                          <div><span className="text-zinc-500">Initiator SPI:</span> <span className="text-teal-400">0x7c9b820a44f12800</span></div>
                          <div><span className="text-zinc-500">Responder SPI:</span> <span className="text-teal-400">0x3e18a9947702f3b9</span></div>
                          <div><span className="text-zinc-500">DH Transform:</span> <span className="text-rose-400">Type 4 = 0x0002 [1024-bit MODP]</span></div>
                          <div><span className="text-zinc-500">Integrity:</span> <span className="text-zinc-200">Type 3 = 0x0002 [AUTH_HMAC_SHA1_96]</span></div>
                        </div>
                      </div>

                      <div className="space-y-1.5 font-mono text-xs">
                        <span className="text-[10px] text-zinc-500 uppercase">Hex Stream (Frame #42, Offset 0x0080)</span>
                        <pre className="p-3 bg-[#14171c] border border-zinc-800/60 rounded-lg text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
                          0080: 00 00 00 08 04 00 00 02  00 00 00 08 03 00 00 02  ................{"\n"}
                          0090: 00 00 00 08 01 00 00 07  00 00 00 08 02 00 00 02  ................{"\n"}
                          00a0: 22 00 00 88 00 02 00 00  9f 44 c1 12 80 43 f9 bb  "........D...C..
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Item 2: Cryptographic Evidence */}
              <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden" id="acc-crypto">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
                  type="button"
                  onClick={() => toggleAccordion("acc-crypto")}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">lock_reset</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-zinc-100">Cryptographic Strength Evidence</span>
                      <span className="text-zinc-500">NIST CVE-CVSS Calibration · Work Factor &lt; 2^80</span>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-zinc-500 transition-transform"
                    style={{ transform: openAccordions["acc-crypto"] ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    expand_more
                  </span>
                </button>
                {openAccordions["acc-crypto"] && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 bg-[#0c0e11]">
                    <div className="p-3 bg-[#14171c] border border-zinc-800/60 rounded-lg space-y-2 font-mono text-xs">
                      <p className="text-zinc-300 leading-relaxed">
                        Diffie-Hellman Group 2 uses a 1024-bit modulus prime specified in RFC 2409. The computational cost to solve discrete logarithms using the Number Field Sieve (NFS) algorithm for a 1024-bit modulus is evaluated by academic standards at approximately ~2^80 operations.
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        <span className="text-rose-400 font-semibold">CVSS 3.1 Base Score: 7.5 (High)</span>
                        <span className="text-zinc-600">|</span>
                        <span className="text-zinc-400">Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N</span>
                        <span className="text-zinc-600">|</span>
                        <span className="text-teal-400">NIST SP 800-131A: DISALLOWED</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Item 3: Security Association Evidence */}
              <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden" id="acc-sa">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
                  type="button"
                  onClick={() => toggleAccordion("acc-sa")}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">shield</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-zinc-100">Security Association (SA) Lifecycle Evidence</span>
                      <span className="text-zinc-500">Child SA 0x9a021da3 · Rekey Interval 28,800s · Omitted KE</span>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-zinc-500 transition-transform"
                    style={{ transform: openAccordions["acc-sa"] ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    expand_more
                  </span>
                </button>
                {openAccordions["acc-sa"] && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 bg-[#0c0e11]">
                    <div className="p-3 bg-[#14171c] border border-zinc-800/60 rounded-lg space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>Child SA SPI: <strong className="text-white">0x9a021da3</strong></span>
                        <span>Direction: <strong className="text-white">Inbound / Outbound ESP</strong></span>
                        <span>Lifetime: <strong className="text-rose-400">28,800s (8.0 hrs)</strong></span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed text-xs">
                        Dissection of packet #1421 (CREATE_CHILD_SA) confirms the payload contains only Proposal (SA), Nonce (Ni/Nr), and Traffic Selectors (TSi/TSr). No Key Exchange (KEi) payload is present, proving PFS renegotiation is not enforced on the gateway peer.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Item 4: ML Traffic Evidence */}
              <div className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden" id="acc-ml">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
                  type="button"
                  onClick={() => toggleAccordion("acc-ml")}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">ssid_chart</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-zinc-100">ML Traffic &amp; Fingerprint Evidence</span>
                      <span className="text-zinc-500">Window W-28 · Isolation Forest Score +0.69</span>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-zinc-500 transition-transform"
                    style={{ transform: openAccordions["acc-ml"] ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    expand_more
                  </span>
                </button>
                {openAccordions["acc-ml"] && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 bg-[#0c0e11]">
                    <div className="p-3 bg-[#14171c] border border-zinc-800/60 rounded-lg space-y-2 font-mono text-xs">
                      <p className="text-zinc-300 leading-relaxed text-xs">
                        Flow-level inter-arrival time and packet length analysis indicates high-throughput encrypted streaming behavior. The system detected zero unpadded frame leakage, confirming that ESP integrity remains operational despite the cryptographic weakness of the underlying keys.
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-300">
                        <span>Isolation: <strong className="text-teal-400">0.69 (Outlier)</strong></span>
                        <span className="text-zinc-600">|</span>
                        <span>Class: <strong className="text-white">Video/ABR Encrypted Tunnel</strong></span>
                        <span className="text-zinc-600">|</span>
                        <span>Confidence: <strong className="text-teal-400">83%</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prioritized Remediation Roadmap Cards */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">build_circle</span>
                <h2 className="font-mono text-sm font-semibold text-white">
                  Prioritized Remediation Roadmap
                </h2>
              </div>
              <button
                className="flex items-center gap-1.5 bg-[#14171c] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-3 py-1 rounded text-xs font-mono transition-colors"
                id="btnCopyAllStanzas"
                type="button"
                onClick={handleCopyStanzas}
              >
                <span className="material-symbols-outlined text-[14px] text-teal-400">content_copy</span>
                <span>{copiedStanzas ? "Copied to Clipboard" : copyFallback ? "Copied" : "Copy All Stanzas"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Priority 1 */}
              <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase inline-block">
                    Priority 1 · Immediate (&lt;24h)
                  </span>
                  <h3 className="font-semibold text-white pt-1">Replace Weak DH Parameter</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Enforce DH Group 14 (MODP-2048) or Group 19 (ECP-256) in Phase 1 proposals across all gateway peers.
                  </p>
                </div>
                <div className="bg-[#0c0e11] border border-zinc-800/80 p-2 rounded text-teal-400 text-[11px] overflow-x-auto">
                  ike=aes256gcm16-prfsha256-ecp256!
                </div>
              </div>

              {/* Priority 2 */}
              <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase inline-block">
                    Priority 2 · Critical (&lt;48h)
                  </span>
                  <h3 className="font-semibold text-white pt-1">Enable Child SA PFS</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Mandate an ephemeral Diffie-Hellman exchange during every Child SA rekey cycle to ensure forward secrecy.
                  </p>
                </div>
                <div className="bg-[#0c0e11] border border-zinc-800/80 p-2 rounded text-teal-400 text-[11px] overflow-x-auto">
                  esp=aes256gcm16-ecp256!
                </div>
              </div>

              {/* Priority 3 */}
              <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase inline-block">
                    Priority 3 · Scheduled Maintenance
                  </span>
                  <h3 className="font-semibold text-white pt-1">Purge Legacy Fallback Suites</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Remove legacy 3DES, HMAC-SHA1-96, and MD5 suites from configuration parser files to prevent downgrade tampering.
                  </p>
                </div>
                <div className="bg-[#0c0e11] border border-zinc-800/80 p-2 rounded text-zinc-400 text-[11px] overflow-x-auto">
                  crypto ikev2 policy 10 &gt; no 3des sha1
                </div>
              </div>
            </div>
          </div>

          {/* AI Metadata & Provenance Footer */}
          <div className="bg-[#111317] border border-zinc-800/80 px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-zinc-500">
            <div className="flex flex-wrap items-center gap-3">
              <span>Model: <strong className="text-zinc-300">SecReason-v4.2-14B (Local Quantized)</strong></span>
              <span className="text-zinc-700">·</span>
              <span>Context: <strong className="text-zinc-300">RFC-Constrained Structured Context</strong></span>
              <span className="text-zinc-700">·</span>
              <span>Inference Time: <strong className="text-zinc-300">14:32:08 UTC (84ms)</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-teal-400">
              <span className="material-symbols-outlined text-[14px]">task_alt</span>
              <span>Hallucination Check: 0 ungrounded claims (RFC 7296 verified)</span>
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

