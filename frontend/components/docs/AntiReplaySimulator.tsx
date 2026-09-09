"use client";

import { useState } from "react";

import { DocPanel, DocWell, DocLabel, DOC_ACTIVE, DOC_IDLE } from "@/components/docs/DocChrome";

export function AntiReplaySimulator() {
  const WINDOW_SIZE = 64;
  const [highestSeq, setHighestSeq] = useState<number>(40);
  const [bitmap, setBitmap] = useState<boolean[]>(() => {
    const b = new Array(64).fill(false);
    // Initialize with scattered received sequence numbers
    [0, 1, 2, 4, 5, 8, 9, 12, 15, 20].forEach((offset) => {
      if (offset < 64) b[offset] = true;
    });
    return b;
  });

  const [lastActionMsg, setLastActionMsg] = useState<{
    text: string;
    type: "ok" | "drop-replay" | "drop-stale" | "slide";
  }>({
    text: "Sliding window initialized. Ready to receive wire sequence numbers.",
    type: "ok",
  });

  const [stats, setStats] = useState({
    accepted: 10,
    replaysDropped: 0,
    staleDropped: 0,
  });

  const leftEdge = Math.max(1, highestSeq - WINDOW_SIZE + 1);
  const rightEdge = highestSeq;

  const receivePacket = (seq: number) => {
    // Case 1: Sequence number is to the right of the window (seq > highestSeq)
    if (seq > highestSeq) {
      const advance = seq - highestSeq;
      const newBitmap = new Array(64).fill(false);

      // Shift existing bits right by advance amount
      for (let i = 0; i < 64; i++) {
        if (i + advance < 64 && bitmap[i]) {
          newBitmap[i + advance] = true;
        }
      }
      // Set the new packet at bit 0
      newBitmap[0] = true;

      setHighestSeq(seq);
      setBitmap(newBitmap);
      setStats((s) => ({ ...s, accepted: s.accepted + 1 }));
      setLastActionMsg({
        text: `Accepted Seq #${seq}. Window slid forward by ${advance} bits (Left: ${Math.max(1, seq - 63)}, Right: ${seq}).`,
        type: "slide",
      });
      return;
    }

    // Case 2: Sequence number is to the left of the window (stale packet)
    if (seq < leftEdge) {
      setStats((s) => ({ ...s, staleDropped: s.staleDropped + 1 }));
      setLastActionMsg({
        text: `DROPPED Seq #${seq}: Packet is too old! Falls to the left of window boundary (${leftEdge}).`,
        type: "drop-stale",
      });
      return;
    }

    // Case 3: Sequence number falls inside the window
    const bitIndex = highestSeq - seq;
    if (bitmap[bitIndex]) {
      // Duplicate packet - replay attack detected!
      setStats((s) => ({ ...s, replaysDropped: s.replaysDropped + 1 }));
      setLastActionMsg({
        text: `REPLAY ATTACK DROPPED Seq #${seq}: Sequence already marked as received in bit register [offset ${bitIndex}]!`,
        type: "drop-replay",
      });
    } else {
      // Valid out-of-order packet filling a previous gap
      const newBitmap = [...bitmap];
      newBitmap[bitIndex] = true;
      setBitmap(newBitmap);
      setStats((s) => ({ ...s, accepted: s.accepted + 1 }));
      setLastActionMsg({
        text: `Accepted Out-of-Order Seq #${seq}. Bit register [offset ${bitIndex}] updated from 0 to 1.`,
        type: "ok",
      });
    }
  };

  const resetWindow = () => {
    setHighestSeq(40);
    const b = new Array(64).fill(false);
    [0, 1, 2, 4, 5, 8, 9, 12, 15, 20].forEach((offset) => {
      if (offset < 64) b[offset] = true;
    });
    setBitmap(b);
    setStats({ accepted: 10, replaysDropped: 0, staleDropped: 0 });
    setLastActionMsg({
      text: "Reset sliding window to initial state.",
      type: "ok",
    });
  };

  return (
    <DocPanel className="w-full overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#b0aea5] uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#d97757]" />
            <span>Interactive Simulator</span>
            <span>·</span>
            <span className="text-[#f7f4ee]">RFC 4303 Anti-Replay Sliding Window</span>
          </div>
          <h4 className="text-[#f7f4ee] font-display-serif text-lg font-bold">
            64-Bit Monotonic Sequence Register
          </h4>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <DocWell className="px-3 py-1 text-[#d8d4c7]">
            <span className="text-[#8c8a82]">WINDOW: </span>
            <span className="text-[#f7f4ee] font-bold">
              [{leftEdge} ... {rightEdge}]
            </span>
          </DocWell>
          <div className={`px-3 py-1 rounded border ${DOC_ACTIVE}`}>
            ✓ {stats.accepted}
          </div>
          <div className={`px-3 py-1 rounded border ${DOC_ACTIVE}`}>
            ✗ {stats.replaysDropped} Replays
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div
        className={`px-4 py-2.5 text-xs font-mono border-b flex items-center gap-2 transition-all ${
          lastActionMsg.type === "drop-replay"
            ? DOC_ACTIVE
            : lastActionMsg.type === "drop-stale"
            ? DOC_ACTIVE
            : lastActionMsg.type === "slide"
            ? "bg-white/[0.06] text-[#f7f4ee] border-white/20"
            : "text-[#b0aea5] border-white/[0.05]"
        }`}
      >
        <span className="material-symbols-outlined text-[16px] shrink-0">
          {lastActionMsg.type === "drop-replay"
            ? "gpp_bad"
            : lastActionMsg.type === "drop-stale"
            ? "history_toggle_off"
            : "verified"}
        </span>
        <span className="truncate">{lastActionMsg.text}</span>
      </div>

      {/* Main Bitmap Visualization Area */}
      <div className="p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-[#8c8a82] mb-2">
            <span>64-Bit Memory Bitmap (Bit 0 = Right Edge, Bit 63 = Left Edge)</span>
            <span className="text-[#b0aea5]">Sage = Packet Arrived · Dark = Unreceived</span>
          </div>

          {/* 64-Bit Matrix Grid */}
          <DocWell className="grid grid-cols-16 sm:grid-cols-32 gap-1 p-3">
            {bitmap.map((isSet, idx) => {
              const seqNum = highestSeq - idx;
              return (
                <div
                  key={idx}
                  title={`Bit ${idx} (Seq #${seqNum}): ${isSet ? "Received" : "Missing"}`}
                  className={`h-7 rounded-sm flex items-center justify-center font-mono text-[9px] cursor-help transition-all border ${
                    isSet ? `${DOC_ACTIVE} font-bold` : DOC_IDLE
                  }`}
                >
                  {isSet ? "1" : "0"}
                </div>
              );
            })}
          </DocWell>
        </div>

        {/* Interactive Injection Action Buttons */}
        <div className="space-y-2">
          <DocLabel className="block">Inject Simulated Wire Packets:</DocLabel>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => receivePacket(highestSeq + 1)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[#f7f4ee] border border-white/20 transition-all flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>Send Valid #{highestSeq + 1}</span>
            </button>

            <button
              onClick={() => receivePacket(highestSeq + 5)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[#f7f4ee] border border-white/20 transition-all flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">fast_forward</span>
              <span>Jump Ahead #{highestSeq + 5}</span>
            </button>

            <button
              onClick={() => receivePacket(highestSeq - 3)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 hover:bg-white/[0.12] ${DOC_ACTIVE}`}
              title="Send sequence number already marked as 1 in window"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">replay</span>
              <span>Simulate Replay Attack (#{highestSeq - 3})</span>
            </button>

            <button
              onClick={() => receivePacket(Math.max(1, leftEdge - 5))}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 hover:bg-white/[0.12] ${DOC_ACTIVE}`}
              title="Send sequence number outside left window edge"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span>Stale Packet (#{Math.max(1, leftEdge - 5)})</span>
            </button>

            <button
              onClick={resetWindow}
              className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#8c8a82] hover:text-[#f7f4ee] border border-white/[0.06] transition-all ml-auto"
              type="button"
            >
              Reset Register
            </button>
          </div>
        </div>
      </div>
    </DocPanel>
  );
}

export default AntiReplaySimulator;
