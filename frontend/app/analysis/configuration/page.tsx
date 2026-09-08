"use client";
import Link from "next/link";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { executiveReportJSON } from "@/lib/mock/analysis";
import { AppShell } from "@/components/layout/AppShell";

export default function VpnConfigurationPage() {
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState("all");
  const [inspectedPkt, setInspectedPkt] = useState("Packet #142");
  const [inspectedExchange, setInspectedExchange] = useState("CREATE_CHILD_SA (Req)");
  const [inspectedSpi, setInspectedSpi] = useState("0x8a91f3c401340b12");

  const selectEvidencePacket = (pktNum: number, exchangeName: string, spi: string) => {
    setInspectedPkt(`Packet #${pktNum}`);
    setInspectedExchange(exchangeName);
    setInspectedSpi(spi);
    toast({
      title: `Selected Frame #${pktNum}`,
      body: `Loaded ${exchangeName} into Protocol Frame Inspector.`,
      kind: "info",
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 font-sans antialiased">
      <AppShell active="/analysis/configuration">
        {/* Top Operational Breadcrumb & Context Header */}
        <div className="border-b border-zinc-800/80 bg-[#111317]/90 backdrop-blur px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <Link href="/history" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                Captures
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="text-teal-400 font-medium">weak-vpn-07.pcap</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">VPN Configuration &amp; Protocol Inspection</span>
            </div>

            {/* Right Controls: View Filter & Actions */}
            <div className="flex items-center gap-2.5">
              <div className="inline-flex rounded-lg border border-zinc-800 bg-[#0c0e11] p-0.5 text-xs font-mono">
                {(["all", "ike", "esp", "sa"] as const).map((filterKey) => {
                  const labels: Record<string, string> = {
                    all: "All Layers",
                    ike: "IKE Control",
                    esp: "ESP Data",
                    sa: "SA Tables",
                  };
                  return (
                    <button
                      key={filterKey}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeFilter === filterKey
                          ? "bg-zinc-800 text-white font-medium"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                      type="button"
                      onClick={() => setActiveFilter(filterKey)}
                    >
                      {labels[filterKey]}
                    </button>
                  );
                })}
              </div>

              <button
                className="h-7 px-3 bg-teal-500 hover:bg-teal-400 text-zinc-950 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                type="button"
                onClick={() => {
                  downloadFile("vpn-configuration-proof.json", executiveReportJSON());
                  toast({ title: "Proof Exported", body: "vpn-configuration-proof.json downloaded.", kind: "ok" });
                }}
              >
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                <span>Export Proof (.json)</span>
              </button>
            </div>
          </div>

          {/* Title & Provenance Strip */}
          <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display-serif text-2xl font-bold tracking-tight text-white">
                  VPN Configuration &amp; Protocol Inspection
                </h1>
                <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-zinc-400 font-mono text-[11px]">
                  RFC 7296 / RFC 4303
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Deterministic forensic extraction of IKEv2 state machines, cryptographic proposals, and active ESP Child SAs.
              </p>
            </div>

            {/* Session Badges */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 flex items-center">
                IKEv2
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 flex items-center">
                ESP Tunnel Mode
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 flex items-center">
                IPv4
              </span>
              <span className="h-6 px-2.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                NAT-T Active (UDP 4500)
              </span>
              <span className="h-6 px-2.5 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-teal-400">verified</span>
                Evidence Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Main Multi-Pane Analytical Workbench */}
        <div className="grid grid-cols-1 2xl:grid-cols-12 min-h-[calc(100vh-140px)] divide-y 2xl:divide-y-0 2xl:divide-x divide-zinc-800/80">
          {/* Primary Content Area (Left 8 Cols on 2xl) */}
          <div className="2xl:col-span-8 p-6 space-y-6">
            {/* SECTION 1: Identity & Security Endpoints Key-Value Matrix */}
            {(activeFilter === "all" || activeFilter === "ike" || activeFilter === "esp") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">hub</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      Tunnel Endpoints &amp; Peer Identity
                    </h2>
                    <span className="font-mono text-xs text-zinc-500">[RFC 7296 §3.8 / §3.5]</span>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    Session Hash: <code className="text-zinc-300">d98f7e21a0c44b91</code>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Initiator Entity */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Initiator (Local Peer)
                      </span>
                      <span className="px-1.5 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px]">
                        SRC_PORT: 500 → 4500
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                      <span className="text-zinc-500">Outer IP:</span>
                      <span className="col-span-2 text-zinc-200 font-medium">198.51.100.1 : 500</span>
                      <span className="text-zinc-500">Post-NAT:</span>
                      <span className="col-span-2 text-teal-400 font-medium">
                        198.51.100.1 : 4500 (UDP Encapsulated)
                      </span>
                      <span className="text-zinc-500">Host ID:</span>
                      <span className="col-span-2 text-zinc-300">branch-edge-gw01.internal</span>
                      <span className="text-zinc-500">ID Type:</span>
                      <span className="col-span-2 text-zinc-300">
                        ID_IPV4_ADDR <span className="text-zinc-500">(0x01)</span>
                      </span>
                    </div>
                  </div>

                  {/* Responder Entity */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Responder (Remote Gateway)
                      </span>
                      <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px]">
                        DST_PORT: 500 → 4500
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                      <span className="text-zinc-500">Outer IP:</span>
                      <span className="col-span-2 text-zinc-200 font-medium">203.0.113.44 : 500</span>
                      <span className="text-zinc-500">Post-NAT:</span>
                      <span className="col-span-2 text-zinc-200 font-medium">203.0.113.44 : 4500 (UDP Floating)</span>
                      <span className="text-zinc-500">FQDN:</span>
                      <span className="col-span-2 text-zinc-300">vpn.chicago-dc.net</span>
                      <span className="text-zinc-500">ID Type:</span>
                      <span className="col-span-2 text-zinc-300">
                        ID_FQDN <span className="text-zinc-500">(0x02)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Encapsulation & Operational Parameters Strip */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="bg-[#0c0e11] border border-zinc-800/60 px-3 py-2 rounded flex items-center justify-between">
                    <span className="text-zinc-500">Network Mode:</span>
                    <span className="text-zinc-200 font-medium">IPsec Tunnel (IPv4 in ESP)</span>
                  </div>
                  <div className="bg-[#0c0e11] border border-zinc-800/60 px-3 py-2 rounded flex items-center justify-between">
                    <span className="text-zinc-500">NAT-T Status:</span>
                    <span className="text-teal-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> DETECTED (RFC 3947)
                    </span>
                  </div>
                  <div className="bg-[#0c0e11] border border-zinc-800/60 px-3 py-2 rounded flex items-center justify-between">
                    <span className="text-zinc-500">Authentication:</span>
                    <span className="text-zinc-200 font-medium">
                      AUTH_PSK <span className="text-zinc-500">(Type 0x02)</span>
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 2: IKEv2 Protocol Handshake & Exchange Table */}
            {(activeFilter === "all" || activeFilter === "ike") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden">
                <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-[#14171c] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">sync_alt</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      IKEv2 Exchange Evidence Log
                    </h2>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                      5 Messages Captured
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Complete Handshake Confirmed
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-[#0c0e11] text-zinc-400 text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-4">Msg #</th>
                        <th className="py-2.5 px-4">Exchange Type</th>
                        <th className="py-2.5 px-4">Timestamp</th>
                        <th className="py-2.5 px-4">SPI / Key Payloads</th>
                        <th className="py-2.5 px-4 text-right">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPkt === "Packet #42" ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(42, "IKE_SA_INIT (Req)", "0x8a91f3c401340b12")}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">01</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-teal-400">arrow_forward</span>
                          <span>IKE_SA_INIT (Req)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#42</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.114</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">8a91f3c4...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">SA, KE (DH Grp 2), Ni, NAT-D</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            OK
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPkt === "Packet #45" ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(45, "IKE_SA_INIT (Resp)", "0x7c2901a8ef11b402")}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">02</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-zinc-400">arrow_back</span>
                          <span>IKE_SA_INIT (Resp)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#45</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.189</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">7c2901a8...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">SA (Transform 1), KE, Nr, NAT-D Mismatch</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            NAT_DETECT
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPkt === "Packet #58" ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(58, "IKE_AUTH (Req)", "0x8a91f3c401340b12")}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">03</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-teal-400">arrow_forward</span>
                          <span>IKE_AUTH (Req)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#58</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.412</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">8a91f3c4...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">
                              Encrypted: SK {"{"} IDi, AUTH(PSK), SA(Child) {"}"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            AUTH_OK
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                          inspectedPkt === "Packet #61" ? "bg-zinc-800/40 border-l-2 border-teal-400" : ""
                        }`}
                        onClick={() => selectEvidencePacket(61, "IKE_AUTH (Resp)", "0x7c2901a8ef11b402")}
                      >
                        <td className="py-2.5 px-4 text-zinc-500 font-medium">04</td>
                        <td className="py-2.5 px-4 font-medium flex items-center gap-1.5 text-zinc-200">
                          <span className="material-symbols-outlined text-[14px] text-zinc-400">arrow_back</span>
                          <span>IKE_AUTH (Resp)</span>
                          <span className="text-[10px] text-teal-400 ml-1">#61</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">00:00:00.490</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">7c2901a8...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 truncate max-w-xs">
                              Encrypted: SK {"{"} IDr, AUTH(PSK), SA(Child) {"}"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
                            ESTABLISHED
                          </span>
                        </td>
                      </tr>

                      <tr
                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors bg-rose-500/5 ${
                          inspectedPkt === "Packet #142" ? "bg-rose-500/10 border-l-2 border-rose-500" : ""
                        }`}
                        onClick={() => selectEvidencePacket(142, "CREATE_CHILD_SA (Req)", "0x8a91f3c401340b12")}
                      >
                        <td className="py-2.5 px-4 text-rose-400 font-bold">05</td>
                        <td className="py-2.5 px-4 font-semibold flex items-center gap-1.5 text-zinc-100">
                          <span className="material-symbols-outlined text-[14px] text-rose-400">warning</span>
                          <span>CREATE_CHILD_SA</span>
                          <span className="text-[10px] text-rose-400 font-bold ml-1">#142</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-300">00:00:02.381</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">8a91f3c4...</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-rose-400 text-xs truncate max-w-xs">
                              Rekey Child SA — Missing KEi (NO PFS)
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                            RISK_DETECTED
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION 3: Negotiated Cryptographic Proposals & Transforms Matrix */}
            {(activeFilter === "all" || activeFilter === "ike" || activeFilter === "esp") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg overflow-hidden">
                <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-[#14171c] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">security_update_good</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      Cryptographic Proposals &amp; Transforms Matrix
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-rose-400 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">report</span> Security Posture: Sub-Optimal
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-[#0c0e11] text-zinc-400 text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-4">Transform Type</th>
                        <th className="py-2.5 px-4">IKE_SA (Control Plane)</th>
                        <th className="py-2.5 px-4">Child SA / ESP (Data Plane)</th>
                        <th className="py-2.5 px-4">Evidence Source</th>
                        <th className="py-2.5 px-4 text-right">Cryptographic Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Encryption (ENCR)</td>
                        <td className="py-2 px-4 text-zinc-300">
                          AES-CBC-128 <span className="text-zinc-500">(128-bit key)</span>
                        </td>
                        <td className="py-2 px-4 text-zinc-300">
                          AES-CBC-128 <span className="text-zinc-500">(IV: 16B)</span>
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(42, "IKE_SA_INIT (Req)", "0x8a91f3c401340b12")}
                          >
                            #42, #58
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px]">
                            Sub-optimal (NIST SP 800-77r1)
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Integrity (INTEG)</td>
                        <td className="py-2 px-4 text-zinc-300">AUTH_HMAC_SHA1_96</td>
                        <td className="py-2 px-4 text-zinc-300">
                          AUTH_HMAC_SHA1_96 <span className="text-zinc-500">(ICV: 12B)</span>
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(42, "IKE_SA_INIT (Req)", "0x8a91f3c401340b12")}
                          >
                            #42, #58
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-medium">
                            Legacy SHA1 (Collision Vector)
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Pseudo-Random (PRF)</td>
                        <td className="py-2 px-4 text-zinc-300">PRF_HMAC_SHA1</td>
                        <td className="py-2 px-4 text-zinc-500">N/A (Data Plane)</td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(45, "IKE_SA_INIT (Resp)", "0x7c2901a8ef11b402")}
                          >
                            #45
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px]">
                            RFC 7296 Compliant
                          </span>
                        </td>
                      </tr>

                      <tr className="bg-rose-500/5 hover:bg-rose-500/10 transition-colors">
                        <td className="py-2 px-4 text-rose-400 font-medium">Diffie-Hellman (D-H)</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-200 font-medium">Group 2</span>
                            <span className="px-1.5 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                              CRITICAL: 1024b MODP
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-500">Child SA:</span>
                            <span className="px-1.5 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                              PFS DISABLED
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(142, "CREATE_CHILD_SA (Req)", "0x8a91f3c401340b12")}
                          >
                            #42 &amp; #142
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                            Vulnerable to Logjam
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2 px-4 text-zinc-200 font-medium">Nonce Entropy</td>
                        <td className="py-2 px-4 text-zinc-300">Ni (32B), Nr (32B)</td>
                        <td className="py-2 px-4 text-zinc-300">Derived via SKEYSEED</td>
                        <td className="py-2 px-4">
                          <span
                            className="text-teal-400 hover:underline cursor-pointer"
                            onClick={() => selectEvidencePacket(42, "IKE_SA_INIT (Req)", "0x8a91f3c401340b12")}
                          >
                            #42, #45
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400 text-[10px]">
                            7.994 b/B (Nominal)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION 4: ESP Security Associations (SA) & Data Plane Telemetry */}
            {(activeFilter === "all" || activeFilter === "esp" || activeFilter === "sa") && (
              <section className="bg-[#111317] border border-zinc-800/80 rounded-lg p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">dns</span>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                      ESP Active Security Associations (SA) &amp; Sequence State
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">UDP Port 4500 Encap</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ingress SA Card */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="text-teal-400 font-bold">INGRESS SA</span>
                          <span className="text-zinc-500">(Responder → Initiator)</span>
                        </div>
                        <span className="font-mono text-xs text-teal-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                          SPI: 0x41f89c02
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-y-2 font-mono text-xs">
                        <span className="text-zinc-500">Lifetime Remaining:</span>
                        <span className="text-zinc-200 text-right">28,800s Hard / 25,920s Soft</span>
                        <span className="text-zinc-500">Volume Transferred:</span>
                        <span className="text-zinc-200 text-right font-medium">421,050 pkts (712.4 MB)</span>
                        <span className="text-zinc-500">Monotonic Sequence:</span>
                        <span className="text-teal-400 text-right font-bold">421,050 (0 drops)</span>
                        <span className="text-zinc-500">Anti-Replay Window:</span>
                        <span className="text-zinc-200 text-right">64 pkts (Strict Bitmap)</span>
                        <span className="text-zinc-500">Frame Evidence:</span>
                        <span className="text-zinc-400 text-right">#68 → #842,109</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-800/60">
                      <div className="flex justify-between font-mono text-[11px] text-zinc-500 mb-1">
                        <span>SEQUENCE CONTINUITY</span>
                        <span className="text-teal-400 font-semibold">100% HEALTH</span>
                      </div>
                      <svg className="w-full h-5 text-teal-400" preserveAspectRatio="none" viewBox="0 0 200 20">
                        <path
                          d="M0,18 L30,16 L60,13 L90,10 L120,8 L150,5 L180,3 L200,1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Egress SA Card */}
                  <div className="bg-[#14171c] border border-zinc-800/60 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="text-zinc-200 font-bold">EGRESS SA</span>
                          <span className="text-zinc-500">(Initiator → Responder)</span>
                        </div>
                        <span className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                          SPI: 0x9a021da3
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-y-2 font-mono text-xs">
                        <span className="text-zinc-500">Lifetime Remaining:</span>
                        <span className="text-zinc-200 text-right">28,800s / 4.00 GB Cap</span>
                        <span className="text-zinc-500">Volume Transferred:</span>
                        <span className="text-zinc-200 text-right font-medium">421,059 pkts (707.6 MB)</span>
                        <span className="text-zinc-500">Monotonic Sequence:</span>
                        <span className="text-teal-400 text-right font-bold">421,059 (0 drops)</span>
                        <span className="text-zinc-500">Anti-Replay Window:</span>
                        <span className="text-zinc-200 text-right">64 pkts (Strict Bitmap)</span>
                        <span className="text-zinc-500">Frame Evidence:</span>
                        <span className="text-zinc-400 text-right">#69 → #842,108</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-800/60">
                      <div className="flex justify-between font-mono text-[11px] text-zinc-500 mb-1">
                        <span>SEQUENCE CONTINUITY</span>
                        <span className="text-teal-400 font-semibold">100% HEALTH</span>
                      </div>
                      <svg className="w-full h-5 text-teal-400" preserveAspectRatio="none" viewBox="0 0 200 20">
                        <path
                          d="M0,18 L25,16 L55,14 L95,11 L130,7 L165,4 L200,1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* SECTION 5: Inline Expandable Packet Dissection Inspector Drawer (Right 4 Cols on 2xl) */}
          <div className="2xl:col-span-4 bg-[#111317] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">find_in_page</span>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  Protocol Frame Inspector
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/10 text-teal-400">
                {inspectedPkt}
              </span>
            </div>

            {/* Active Frame Overview Strip */}
            <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded-lg font-mono text-xs flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Exchange Type:</span>
                <span className="text-zinc-200 font-semibold">{inspectedExchange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Timestamp:</span>
                <span className="text-zinc-300">00:00:02.381 (T+2.267s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Initiator SPI:</span>
                <span className="text-teal-400">{inspectedSpi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Encapsulation:</span>
                <span className="text-zinc-300">UDP:4500 (Non-ESP Marker 0x00000000)</span>
              </div>
            </div>

            {/* Deterministic Protocol Assertion / Proof Box */}
            <div className="bg-rose-500/10 border-l-2 border-rose-500 p-3 rounded-r-lg flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-rose-400 font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">gpp_maybe</span> Deterministic Cryptographic Proof
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Child SA Rekey initiated without <code className="text-teal-400 font-mono">KEi</code> payload at offset{" "}
                <code className="text-teal-400 font-mono">0x0028</code>. The absence of an ephemeral Diffie-Hellman public
                key proves <strong className="text-rose-400 font-semibold">PFS is Disabled</strong>. Past sessions remain
                vulnerable to retrospective decryption if private keys are compromised.
              </p>
            </div>

            {/* Raw Hex & ASCII Dissection Panel */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span className="uppercase">Frame Hex Payload (Byte Dissection)</span>
                <span>16-Byte Chunked</span>
              </div>
              <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded-lg font-mono text-[11px] overflow-x-auto leading-5 select-text">
                <div className="grid grid-cols-12 gap-x-2">
                  <span className="col-span-2 text-zinc-600">0000</span>
                  <span className="col-span-6 text-zinc-200">00 00 00 00 8a 91 f3 c4</span>
                  <span className="col-span-4 text-zinc-500">....4..|</span>

                  <span className="col-span-2 text-zinc-600">0008</span>
                  <span className="col-span-6 text-zinc-200">01 34 0b 12 7c 29 01 a8</span>
                  <span className="col-span-4 text-zinc-500">)..ef11.</span>

                  <span className="col-span-2 text-zinc-600">0010</span>
                  <span className="col-span-6 text-zinc-200">ef 11 b4 02 2e 20 23 20</span>
                  <span className="col-span-4 text-zinc-500">.... # .</span>

                  <span className="col-span-2 text-zinc-600">0018</span>
                  <span className="col-span-6 text-zinc-200">00 00 00 02 00 00 00 9c</span>
                  <span className="col-span-4 text-zinc-500">....\x9c</span>

                  <span className="col-span-2 text-teal-400 font-bold">0020</span>
                  <span className="col-span-6 text-teal-300 font-bold">29 00 00 80 00 00 00 24</span>
                  <span className="col-span-4 text-teal-400">).....$</span>

                  <span className="col-span-2 text-rose-400 font-bold">0028</span>
                  <span className="col-span-6 text-rose-400 font-bold">01 03 04 03 00 00 00 0c</span>
                  <span className="col-span-4 text-rose-400">........</span>

                  <span className="col-span-2 text-zinc-600">0030</span>
                  <span className="col-span-6 text-zinc-200">80 0c 00 80 00 00 00 08</span>
                  <span className="col-span-4 text-zinc-500">........</span>

                  <span className="col-span-2 text-zinc-600">0038</span>
                  <span className="col-span-6 text-zinc-200">03 00 00 02 00 00 00 08</span>
                  <span className="col-span-4 text-zinc-500">........</span>
                </div>
              </div>
            </div>

            {/* Payload Structural Breakdown Tree */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-zinc-500 uppercase">Decoded Payload Hierarchy</span>
              <div className="bg-[#0c0e11] border border-zinc-800/60 p-3 rounded-lg font-mono text-xs flex flex-col gap-1.5 divide-y divide-zinc-800/60">
                <div className="pt-1 flex items-center justify-between text-zinc-300">
                  <span>Non-ESP Marker (4 Bytes)</span>
                  <span className="text-teal-400">0x00000000 [OK]</span>
                </div>
                <div className="pt-1.5 flex items-center justify-between text-zinc-300">
                  <span>IKE Header [HDR] (28 Bytes)</span>
                  <span className="text-zinc-400">Type: CREATE_CHILD_SA (36)</span>
                </div>
                <div className="pt-1.5 flex items-center justify-between text-zinc-300">
                  <span>Security Association [SA]</span>
                  <span className="text-zinc-400">SPI: 0x9a021da3</span>
                </div>
                <div className="pt-1.5 flex items-center justify-between text-rose-400 font-medium">
                  <span>Key Exchange [KEi]</span>
                  <span>ABSENT (PFS Disabled)</span>
                </div>
                <div className="pt-1.5 flex items-center justify-between text-zinc-300">
                  <span>Traffic Selectors [TSi, TSr]</span>
                  <span className="text-zinc-400">0.0.0.0/0 ↔ 0.0.0.0/0</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-3">
              <button
                className="w-full h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
                type="button"
                onClick={() => {
                  downloadFile(
                    "frame-dissection.json",
                    JSON.stringify(
                      {
                        frame: inspectedPkt,
                        exchange: inspectedExchange,
                        spi: inspectedSpi,
                        source: "TunnelSight Forensic Dissector",
                        timestamp: new Date().toISOString(),
                      },
                      null,
                      2
                    )
                  );
                  toast({
                    title: "Frame Exported",
                    body: `${inspectedPkt} dissection downloaded.`,
                    kind: "ok",
                  });
                }}
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export {inspectedPkt} Dissection</span>
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

