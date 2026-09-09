"use client";

import { useState } from "react";

import {
  DOC_ACTIVE,
  DOC_IDLE,
  DocLabel,
  DocPanel,
  DocWell,
} from "@/components/docs/DocChrome";

interface HandshakeMessage {
  id: number;
  direction: "left-to-right" | "right-to-left";
  name: string;
  type: string;
  encrypted: boolean;
  latency: string;
  payloads: string[];
  securityNote: string;
}

const IKEV2_MESSAGES: HandshakeMessage[] = [
  {
    id: 1,
    direction: "left-to-right",
    name: "IKE_SA_INIT (Request)",
    type: "Message 1 (UDP 500)",
    encrypted: false,
    latency: "0.0ms",
    payloads: [
      "HDR: SPIi=0x4f9a218bc93ae210, SPIr=0x0000000000000000, Type=34, Flags=Initiator",
      "SA: Proposal 1: ENCR=AES-GCM-256, PRF=HMAC-SHA384, DH=Group 19 (ECP-256)",
      "KE: Initiator DH Public Coordinate (64 bytes NIST P-256 Point)",
      "Ni: Initiator Cryptographic Nonce (32 bytes high entropy)",
      "N(NAT_DETECTION_SOURCE_IP): SHA-1(SPIi | SPIr | IPi | Porti)",
      "N(NAT_DETECTION_DESTINATION_IP): SHA-1(SPIi | SPIr | IPr | Portr)",
    ],
    securityNote: "Cleartext exchange negotiating crypto algorithms and generating shared Diffie-Hellman secret without exposing gateway identity.",
  },
  {
    id: 2,
    direction: "right-to-left",
    name: "IKE_SA_INIT (Response)",
    type: "Message 2 (UDP 500)",
    encrypted: false,
    latency: "+21.4ms",
    payloads: [
      "HDR: SPIi=0x4f9a218bc93ae210, SPIr=0x92f8a104bcde2130, Type=34, Flags=Response",
      "SA: Selected Proposal: AES-GCM-256 + HMAC-SHA384 + DH Group 19",
      "KE: Responder DH Public Coordinate (64 bytes NIST P-256 Point)",
      "Nr: Responder Cryptographic Nonce (32 bytes high entropy)",
      "CERTREQ: Acceptable CA Trust Anchors (X.509 Subject Key Identifiers)",
    ],
    securityNote: "Shared Diffie-Hellman secret SKEYSEED is derived immediately upon arrival. All subsequent messages are encrypted with AES-256-GCM.",
  },
  {
    id: 3,
    direction: "left-to-right",
    name: "IKE_AUTH (Request)",
    type: "Message 3 (UDP 500 / 4500)",
    encrypted: true,
    latency: "+42.1ms",
    payloads: [
      "HDR: Encrypted Payload Flag Set (SK)",
      "IDi: Initiator Identity: fqdn:gw01.corp.internal",
      "CERT: X.509 Gateway Certificate (ECDSA P-384 / SHA-384)",
      "AUTH: Signature computed over First Message bytes via SKEYSEED",
      "SA2: First Child SA Negotiation (ESP AES-256-GCM + PFS)",
      "TSi: Traffic Selector: 10.100.0.0/16 (Corp Subnet)",
      "TSr: Traffic Selector: 10.200.0.0/16 (Branch Subnet)",
    ],
    securityNote: "Identity protection guaranteed: Initiator identity and certificates are encrypted inside SK envelope, immune to passive wire eavesdropping.",
  },
  {
    id: 4,
    direction: "right-to-left",
    name: "IKE_AUTH (Response)",
    type: "Message 4 (UDP 500 / 4500)",
    encrypted: true,
    latency: "+63.8ms",
    payloads: [
      "HDR: Encrypted Payload Flag Set (SK)",
      "IDr: Responder Identity: fqdn:gw04.branch.internal",
      "CERT: X.509 Gateway Certificate (ECDSA P-384)",
      "AUTH: Responder Digital Signature verification",
      "SA2: Confirmed Child SA (Inbound SPI: 0x8a92f01c, Outbound SPI: 0x3f9b2011)",
      "TSi / TSr: Confirmed Policy Selectors",
    ],
    securityNote: "Handshake completed in only 2 round-trips! Bidirectional ESP tunnel is now fully established and operational.",
  },
];

const IKEV1_MESSAGES: HandshakeMessage[] = [
  {
    id: 1,
    direction: "left-to-right",
    name: "Main Mode Message 1",
    type: "Phase 1 (UDP 500)",
    encrypted: false,
    latency: "0.0ms",
    payloads: ["HDR", "SA: Offers cipher suites (Often legacy 3DES or SHA-1)"],
    securityNote: "IKEv1 requires 6 total messages just for Phase 1, followed by 3 more for Phase 2 Quick Mode.",
  },
  {
    id: 2,
    direction: "right-to-left",
    name: "Main Mode Message 2",
    type: "Phase 1 (UDP 500)",
    encrypted: false,
    latency: "+25.1ms",
    payloads: ["HDR", "SA: Responder matches single transform"],
    securityNote: "Cleartext negotiation of security policies.",
  },
  {
    id: 3,
    direction: "left-to-right",
    name: "Main Mode Message 3",
    type: "Phase 1 (UDP 500)",
    encrypted: false,
    latency: "+50.2ms",
    payloads: ["HDR", "KE: Initiator Key Exchange", "Ni: Nonce"],
    securityNote: "Transmits public key parameters across wire in cleartext.",
  },
  {
    id: 4,
    direction: "right-to-left",
    name: "Main Mode Message 4",
    type: "Phase 1 (UDP 500)",
    encrypted: false,
    latency: "+75.4ms",
    payloads: ["HDR", "KE: Responder Key Exchange", "Nr: Nonce"],
    securityNote: "Key generation complete. Messages 5 and 6 will authenticate identities.",
  },
  {
    id: 5,
    direction: "left-to-right",
    name: "Main Mode Message 5",
    type: "Phase 1 (UDP 500)",
    encrypted: true,
    latency: "+100.8ms",
    payloads: ["HDR*", "ID: Initiator Identity", "HASH / SIG: Authentication"],
    securityNote: "Identity sent under Phase 1 encryption, but vulnerable if weak PSK or aggressive mode is used.",
  },
  {
    id: 6,
    direction: "right-to-left",
    name: "Main Mode Message 6",
    type: "Phase 1 (UDP 500)",
    encrypted: true,
    latency: "+126.3ms",
    payloads: ["HDR*", "ID: Responder Identity", "HASH / SIG: Authentication"],
    securityNote: "Phase 1 IKE SA established. An additional 3 Quick Mode packets are still required to transmit ESP data!",
  },
];

export function HandshakeSequenceDiagram() {
  const [protocolMode, setProtocolMode] = useState<"ikev2" | "ikev1">("ikev2");
  const [selectedMessageId, setSelectedMessageId] = useState<number>(1);
  const [simulateCookieDefense, setSimulateCookieDefense] = useState(false);

  const messages = protocolMode === "ikev2" ? IKEV2_MESSAGES : IKEV1_MESSAGES;
  const activeMsg = messages.find((m) => m.id === selectedMessageId) || messages[0];

  return (
    <DocPanel className="w-full overflow-hidden font-sans">
      {/* Header controls */}
      <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#d97757]" />
            <span>Interactive State Machine</span>
            <span>·</span>
            <span className="text-[#f7f4ee]">Wire Handshake Sequence</span>
          </div>
          <h4 className="text-[#f7f4ee] font-display-serif text-lg font-bold">
            IKEv2 (4 Packets) vs IKEv1 (6+3 Packets)
          </h4>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 select-none">
          <DocWell className="p-1 flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => {
                setProtocolMode("ikev2");
                setSelectedMessageId(1);
              }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                protocolMode === "ikev2"
                  ? "bg-white/[0.08] text-[#f7f4ee] border border-white/30 font-semibold"
                  : "text-[#8c8a82] hover:text-[#f7f4ee]"
              }`}
              type="button"
            >
              IKEv2 Modern (RFC 7296)
            </button>
            <button
              onClick={() => {
                setProtocolMode("ikev1");
                setSelectedMessageId(1);
              }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                protocolMode === "ikev1"
                  ? "bg-white/[0.08] text-[#f7f4ee] border border-white/30 font-semibold"
                  : "text-[#8c8a82] hover:text-[#f7f4ee]"
              }`}
              type="button"
            >
              IKEv1 Legacy (RFC 2409)
            </button>
          </DocWell>

          {protocolMode === "ikev2" && (
            <button
              onClick={() => setSimulateCookieDefense(!simulateCookieDefense)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                simulateCookieDefense
                  ? `${DOC_ACTIVE} font-semibold`
                  : "bg-white/[0.03] text-[#8c8a82] hover:text-[#f7f4ee] border-white/[0.06]"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">security</span>
              <span>DoS Cookie: {simulateCookieDefense ? "ON" : "OFF"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Sequence Diagram Gateway Columns */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2 font-mono text-xs text-[#d8d4c7]">
            <DocWell className="flex items-center gap-2 p-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#d97757]" />
              <div>
                <div className="font-semibold text-[#f7f4ee]">Initiator Gateway</div>
                <div className="text-[10px] text-[#8c8a82]">192.0.2.14 (Corp Edge)</div>
              </div>
            </DocWell>

            <span className="text-[10px] text-[#8c8a82] uppercase tracking-wider">
              {protocolMode === "ikev2" ? "2 Round Trips (42ms)" : "3 Round Trips (75ms)"}
            </span>

            <DocWell className="flex items-center gap-2 p-2">
              <div className="text-right">
                <div className="font-semibold text-[#f7f4ee]">Responder Gateway</div>
                <div className="text-[10px] text-[#8c8a82]">198.51.100.8 (Branch Edge)</div>
              </div>
              <span className="w-2.5 h-2.5 rounded-sm bg-[#788c5d]" />
            </DocWell>
          </div>

          {/* Wire Flight Lines */}
          <div className="space-y-2.5 relative pt-2">
            {messages.map((msg) => {
              const isSelected = msg.id === activeMsg.id;
              const isLeftToRight = msg.direction === "left-to-right";

              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? `${DOC_ACTIVE} ring-1 ring-white/10`
                      : `${DOC_IDLE} hover:border-white/[0.12]`
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#b0aea5]">{msg.type}</span>
                    <span className="text-[#8c8a82]">{msg.latency}</span>
                  </div>

                  {/* Flight arrow track */}
                  <div className="relative flex items-center justify-between py-1">
                    <span className={`text-[10px] font-mono ${isLeftToRight ? "text-[#d97757] font-bold" : "text-[#6b6963]"}`}>
                      [INIT]
                    </span>

                    {/* Animated arrow bar */}
                    <div className="flex-1 mx-3 h-0.5 bg-white/[0.08] relative flex items-center">
                      <div
                        className={`h-0.5 bg-gradient-to-r ${
                          msg.encrypted
                            ? "from-[#788c5d] to-[#a3b888]"
                            : "from-[#d97757] to-[#e4a08c]"
                        } w-full`}
                      />
                      <span
                        className={`material-symbols-outlined text-[14px] absolute ${
                          isLeftToRight ? "right-0 text-[#d97757]" : "left-0 text-[#788c5d] rotate-180"
                        }`}
                      >
                        arrow_right_alt
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono ${!isLeftToRight ? "text-[#788c5d] font-bold" : "text-[#6b6963]"}`}>
                      [RESP]
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="font-semibold text-[#f7f4ee] font-display-serif">{msg.name}</span>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      {msg.encrypted ? (
                        <span className="text-[#b4cca0] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">lock</span>
                          <span>Encrypted (SK)</span>
                        </span>
                      ) : (
                        <span className="text-[#e4b373] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">lock_open</span>
                          <span>Plaintext Wire</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message Payload Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <DocWell className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <DocLabel>
                Packet Payload Dissector
              </DocLabel>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                activeMsg.encrypted
                  ? DOC_ACTIVE
                  : "bg-white/[0.06] text-[#f7f4ee] border-white/20"
              }`}>
                {activeMsg.encrypted ? "AES-256-GCM Envelope" : "Cleartext Payload"}
              </span>
            </div>

            <h5 className="text-[#f7f4ee] font-display-serif font-bold text-base">
              {activeMsg.name}
            </h5>

            <p className="text-xs text-[#d8d4c7] leading-relaxed font-sans">
              {activeMsg.securityNote}
            </p>

            <div className="space-y-1.5 pt-2">
              <DocLabel className="block">
                Encapsulated Payloads:
              </DocLabel>
              <div className="space-y-1 font-mono text-xs">
                {activeMsg.payloads.map((p, i) => (
                  <div
                    key={i}
                    className="p-2 rounded text-[#d8d4c7] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {simulateCookieDefense && protocolMode === "ikev2" && (
              <div className="p-3 rounded bg-white/[0.06] border border-white/25 text-xs text-[#e4b373] space-y-1 font-sans">
                <div className="font-semibold text-[#f7f4ee] font-mono text-[11px] uppercase">
                  DoS Cookie Mechanism Active:
                </div>
                <p className="text-[11px] leading-relaxed text-[#d8d4c7]">
                  The Responder gateway rejected the unverified half-open SA and replied with <code className="font-mono text-[#f7f4ee]">COOKIE: 0x7c49e2...</code>. Zero state memory was allocated. Initiator must resend <code className="font-mono text-[#f7f4ee]">IKE_SA_INIT</code> with this cookie to prove IP ownership!
                </p>
              </div>
            )}
          </DocWell>
        </div>
      </div>
    </DocPanel>
  );
}

export default HandshakeSequenceDiagram;
