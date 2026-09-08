"use client";

import { useState } from "react";

interface DHGroupData {
  group: number;
  name: string;
  type: string;
  bitLength: number;
  effectiveSecurityBits: number;
  crackTimeEstimate: string;
  verdict: "FORBIDDEN" | "DEPRECATED" | "MINIMUM" | "RECOMMENDED" | "HIGH_ASSURANCE";
  verdictColor: string;
  nfsFormula: string;
  rfcStatus: string;
  notes: string;
}

const DH_GROUPS: DHGroupData[] = [
  {
    group: 1,
    name: "Group 1",
    type: "MODP (Modular Exponentiation)",
    bitLength: 768,
    effectiveSecurityBits: 68,
    crackTimeEstimate: "~18 hours on 50 cloud GPUs",
    verdict: "FORBIDDEN",
    verdictColor: "bg-[#c75450]/20 text-[#f08a85] border-[#c75450]/40",
    nfsFormula: "L_p[1/3, 1.923] ≈ 2^68 operations",
    rfcStatus: "RFC 8247: MUST NOT USE",
    notes: "Factored publicly in academic research. Complete loss of confidentiality on encrypted IPsec sessions.",
  },
  {
    group: 2,
    name: "Group 2",
    type: "MODP (Modular Exponentiation)",
    bitLength: 1024,
    effectiveSecurityBits: 80,
    crackTimeEstimate: "~30 days on state-level cluster",
    verdict: "FORBIDDEN",
    verdictColor: "bg-[#c75450]/20 text-[#f08a85] border-[#c75450]/40",
    nfsFormula: "L_p[1/3, 1.923] ≈ 2^80 operations",
    rfcStatus: "RFC 8247: MUST NOT USE (Logjam Attack)",
    notes: "Vulnerable to precomputation sieve attacks where a single precomputed matrix breaks thousands of VPN gateways.",
  },
  {
    group: 5,
    name: "Group 5",
    type: "MODP (Modular Exponentiation)",
    bitLength: 1536,
    effectiveSecurityBits: 96,
    crackTimeEstimate: "~25 years on modern supercomputer",
    verdict: "DEPRECATED",
    verdictColor: "bg-[#d49a4f]/20 text-[#e4b373] border-[#d49a4f]/40",
    nfsFormula: "L_p[1/3, 1.923] ≈ 2^96 operations",
    rfcStatus: "RFC 8247: SHOULD NOT USE",
    notes: "Insufficient security margin for enterprise data requiring confidentiality retention beyond 2026.",
  },
  {
    group: 14,
    name: "Group 14",
    type: "MODP (Modular Exponentiation)",
    bitLength: 2048,
    effectiveSecurityBits: 112,
    crackTimeEstimate: "> 100,000 years with classical hardware",
    verdict: "MINIMUM",
    verdictColor: "bg-[#c2b59b]/20 text-[#e2dacb] border-[#c2b59b]/40",
    nfsFormula: "L_p[1/3, 1.923] ≈ 2^112 operations",
    rfcStatus: "RFC 8247: MINIMUM ACCEPTABLE",
    notes: "The bare minimum acceptable legacy group. High computational overhead on gateway CPUs compared to elliptic curves.",
  },
  {
    group: 19,
    name: "Group 19",
    type: "ECP (NIST Elliptic Curve P-256)",
    bitLength: 256,
    effectiveSecurityBits: 128,
    crackTimeEstimate: "> 10^18 years (Pollard's Rho: 2^128 ops)",
    verdict: "RECOMMENDED",
    verdictColor: "bg-[#788c5d]/25 text-[#b4cca0] border-[#788c5d]/50",
    nfsFormula: "O(√n) Pollard's Rho ≈ 2^128 operations",
    rfcStatus: "RFC 8247: RECOMMENDED (Standard)",
    notes: "Optimal performance and cryptographic security. Fast handshake computation with minimal wire payload overhead (64-byte keys).",
  },
  {
    group: 20,
    name: "Group 20",
    type: "ECP (NIST Elliptic Curve P-384)",
    bitLength: 384,
    effectiveSecurityBits: 192,
    crackTimeEstimate: "> 10^35 years (Exceeds Universe Lifetime)",
    verdict: "HIGH_ASSURANCE",
    verdictColor: "bg-[#4e8760]/25 text-[#96d9a8] border-[#4e8760]/50",
    nfsFormula: "O(√n) Pollard's Rho ≈ 2^192 operations",
    rfcStatus: "NIST CNSA 1.0 MANDATORY",
    notes: "Federal standard for classified military and high-assurance financial IPsec infrastructures requiring Post-Quantum transition.",
  },
];

const BENCHMARK_COMPARISON = [
  { group: "Group 1 (MODP-768)", bits: "68 bits", time: "18 hours", rfc: "MUST NOT", overhead: "1.0x", recommended: false },
  { group: "Group 2 (MODP-1024)", bits: "80 bits", time: "30 days", rfc: "MUST NOT", overhead: "1.4x", recommended: false },
  { group: "Group 5 (MODP-1536)", bits: "96 bits", time: "25 years", rfc: "SHOULD NOT", overhead: "2.3x", recommended: false },
  { group: "Group 14 (MODP-2048)", bits: "112 bits", time: "> 100k yrs", rfc: "MINIMUM", overhead: "4.8x", recommended: false },
  { group: "Group 19 (ECP-256)", bits: "128 bits", time: "> 10^18 yrs", rfc: "RECOMMENDED", overhead: "0.4x (Fastest)", recommended: true },
  { group: "Group 20 (ECP-384)", bits: "192 bits", time: "> 10^35 yrs", rfc: "CNSA 1.0", overhead: "0.9x", recommended: false },
];

export function DiffieHellmanLattice() {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(4); // Default Group 19
  const group = DH_GROUPS[selectedGroupIdx];

  return (
    <div className="w-full bg-[#0c0d10] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl font-sans">
      {/* Header */}
      <div className="p-4 bg-[#101216] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#d97757]" />
            <span>Interactive Cryptanalysis</span>
            <span>·</span>
            <span className="text-[#f7f4ee]">NFS Complexity &amp; Bit Deprecation</span>
          </div>
          <h4 className="text-[#f7f4ee] font-display-serif text-lg font-bold">
            Diffie-Hellman Security Margin &amp; Factorization
          </h4>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded bg-[#07080a] border border-white/[0.08] text-[#d8d4c7]">
          Selected: <strong className="text-[#f7f4ee]">{group.name} ({group.bitLength}-bit)</strong>
        </span>
      </div>

      {/* Main Interactive Lattice Body */}
      <div className="p-6 space-y-6">
        {/* Group Selector Pills */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider block">
            Select Diffie-Hellman Transform Group:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
            {DH_GROUPS.map((g, idx) => {
              const isSelected = idx === selectedGroupIdx;
              return (
                <button
                  key={g.group}
                  onClick={() => setSelectedGroupIdx(idx)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isSelected
                      ? "bg-white/[0.08] border-white/40 text-[#f7f4ee] font-bold shadow-sm ring-1 ring-white/20"
                      : "bg-[#07080a] border-white/[0.05] text-[#b0aea5] hover:text-[#f7f4ee] hover:border-white/[0.12]"
                  }`}
                  type="button"
                >
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-[10px] text-[#8c8a82] font-normal">{g.bitLength}b {g.type.includes("ECP") ? "EC" : "MODP"}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cryptographic Bit-Strength Gauge */}
        <div className="p-5 rounded-lg bg-[#07080a] border border-white/[0.06] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold text-[#f7f4ee] font-display-serif">{group.name}: {group.type}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${group.verdictColor}`}>
                  {group.verdict}
                </span>
              </div>
              <div className="text-xs font-mono text-[#b0aea5] mt-1">{group.rfcStatus}</div>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs text-[#8c8a82]">Effective Symmetric Strength</div>
              <div className="text-2xl font-bold text-[#f7f4ee]">{group.effectiveSecurityBits} Bits</div>
            </div>
          </div>

          {/* Progress Bar Meter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between font-mono text-[10px] text-[#8c8a82]">
              <span>0 bits (Trivial)</span>
              <span>112 bits (Legacy Min)</span>
              <span>128 bits (RFC Recommended)</span>
              <span>192 bits (CNSA 1.0)</span>
            </div>
            <div className="w-full bg-[#14161a] h-2 rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  group.effectiveSecurityBits < 112
                    ? "bg-[#c75450]"
                    : group.effectiveSecurityBits === 112
                    ? "bg-[#d49a4f]"
                    : "bg-gradient-to-r from-[#d97757] via-[#c2b59b] to-[#788c5d]"
                }`}
                style={{ width: `${Math.min(100, (group.effectiveSecurityBits / 192) * 100)}%` }}
              />
            </div>
          </div>

          {/* Mathematical & Real-World Complexity Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
            <div className="p-3.5 rounded bg-[#101216] border border-white/[0.05] space-y-1.5">
              <div className="text-[10px] text-[#8c8a82] uppercase tracking-wider">Estimated Precomputation Attack Time</div>
              <div className="text-[#f7f4ee] font-semibold text-sm">{group.crackTimeEstimate}</div>
            </div>

            <div className="p-3.5 rounded bg-[#101216] border border-white/[0.05] space-y-1.5">
              <div className="text-[10px] text-[#8c8a82] uppercase tracking-wider">General Number Field Sieve (NFS) Formula</div>
              <div className="text-[#f7f4ee] font-serif italic text-sm font-medium tracking-wide">
                {group.nfsFormula}
              </div>
            </div>
          </div>

          <p className="text-xs text-[#d8d4c7] leading-relaxed font-sans pt-1">
            <strong className="text-[#f7f4ee] font-medium">Auditor Advisory: </strong>{group.notes}
          </p>
        </div>

        {/* Anthropic-Style Scientific Benchmark Comparison Table */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider">
              NIST SP 800-77 &amp; RFC 8247 Cryptanalysis Matrix
            </span>
            <span className="text-[10px] font-mono text-[#8c8a82]">Hardware: Dual Intel Xeon Platinum (DPDK Core 0)</span>
          </div>

          <div className="overflow-x-auto border border-white/[0.08] rounded-lg bg-[#07080a]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#101216] text-[#8c8a82] text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-medium">Transform Group</th>
                  <th className="p-3 font-medium">Security Margin</th>
                  <th className="p-3 font-medium">Factorization Feasibility</th>
                  <th className="p-3 font-medium">RFC 8247 Status</th>
                  <th className="p-3 font-medium text-right">Rekey Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {BENCHMARK_COMPARISON.map((row) => (
                  <tr
                    key={row.group}
                    className={`transition-colors ${
                      row.recommended
                        ? "bg-[#788c5d]/10 text-[#f7f4ee] font-medium"
                        : "hover:bg-white/[0.02] text-[#b0aea5]"
                    }`}
                  >
                    <td className="p-3 flex items-center gap-2">
                      {row.recommended && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#788c5d]" />
                      )}
                      <span>{row.group}</span>
                    </td>
                    <td className="p-3 text-[#d8d4c7]">{row.bits}</td>
                    <td className="p-3">{row.time}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                          row.rfc === "MUST NOT"
                            ? "bg-[#c75450]/20 text-[#f08a85] border-[#c75450]/30"
                            : row.rfc === "SHOULD NOT"
                            ? "bg-[#d49a4f]/20 text-[#e4b373] border-[#d49a4f]/30"
                            : row.rfc === "MINIMUM"
                            ? "bg-[#c2b59b]/20 text-[#e2dacb] border-[#c2b59b]/30"
                            : "bg-[#788c5d]/25 text-[#b4cca0] border-[#788c5d]/40"
                        }`}
                      >
                        {row.rfc}
                      </span>
                    </td>
                    <td className="p-3 text-right text-[#d8d4c7]">{row.overhead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiffieHellmanLattice;
