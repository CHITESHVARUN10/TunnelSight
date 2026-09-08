"use client";
import { useState } from "react";
import { downloadFile, useToast } from "@/lib/mock/toast";
import { AppShell } from "@/components/layout/AppShell";

export default function SettingsPage() {
  const [telemetryOpen, setTelemetryOpen] = useState(false);
  const [confThresh, setConfThresh] = useState(75);
  const [anomalySens, setAnomalySens] = useState(0.65);
  const [temperature, setTemperature] = useState(0.05);
  const toast = useToast();

  const exportConfig = () => {
    downloadFile(
      "engine.yaml",
      "# TunnelSight engine.yaml (production configuration)\nversion: 2.4.1\npipeline:\n  dissection: [zeek, tshark, scapy]\n  pfs_required: true\n  evidence_tiering: strict\n",
      "text/yaml"
    );
    toast({ title: "Config exported", body: "engine.yaml downloaded successfully.", kind: "ok" });
  };

  const verifyHealth = () => toast({ title: "Engine health verified", body: "6/6 engines online · 0 dropped frames · 14ms RPC latency.", kind: "ok" });
  const applyRuntime = () => toast({ title: "Runtime changes applied", body: "Daemon rehash staged (mock, SIGHUP 39420).", kind: "ok" });
  const testEndpoint = () => toast({ title: "RPC endpoint reachable", body: "http://127.0.0.1:8080/v1 · 14ms roundtrip (mock).", kind: "ok" });
  const discardDraft = () => toast({ title: "Draft discarded", body: "Staged changes reverted to v2.4.1 production state.", kind: "info" });
  const commitDaemon = () => toast({ title: "Committed & rehashed", body: "Daemon rehash complete (SIGHUP 39420).", kind: "ok" });

  return (
    <div className="bg-[#0c0e11] text-zinc-300 min-h-screen antialiased selection:bg-teal-500/20 selection:text-teal-300">
      <AppShell active="/settings">
        
        {/* Context Top Rail */}
        <div className="w-full bg-[#111317] border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="text-zinc-400 font-medium">SYSTEM</span>
              <span>/</span>
              <span className="text-teal-400 font-medium tracking-tight">ENGINE CONFIGURATION &amp; POLICIES</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 bg-[#14171c] border border-zinc-800 px-2.5 py-1 rounded-sm text-zinc-400">
                <span className="text-zinc-500 uppercase text-[10px]">Active Config:</span>
                <span className="text-zinc-200">/etc/tunnelsight/engine.yaml</span>
                <span className="text-teal-400 font-medium">(v2.4.1)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[#14171c] border border-zinc-800 px-2.5 py-1 rounded-sm text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DAEMON SYNCHRONIZED</span>
              </span>
              <span className="hidden md:flex items-center gap-1.5 bg-[#14171c] border border-zinc-800 px-2.5 py-1 rounded-sm text-zinc-500">
                <span>COMMITTED:</span>
                <span className="text-zinc-300">24m ago by secadmin-jchen</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
            <div>
              <h1 className="font-display-serif text-2xl sm:text-3xl text-white tracking-tight">
                System &amp; Engine Configuration
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Runtime parameters, protocol dissection engines, inference boundaries, and forensic provenance governance.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button 
                className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 px-3 py-1.5 rounded-sm font-mono text-xs transition-colors" 
                type="button" 
                onClick={exportConfig}
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export Config (.yaml)</span>
              </button>
              <button 
                className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 px-3 py-1.5 rounded-sm font-mono text-xs transition-colors" 
                type="button" 
                onClick={verifyHealth}
              >
                <span className="material-symbols-outlined text-[16px] text-teal-400">health_and_safety</span>
                <span>Verify Engine Health</span>
              </button>
              <button 
                className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-black font-semibold px-3.5 py-1.5 rounded-sm font-mono text-xs transition-colors shadow-sm" 
                type="button" 
                onClick={applyRuntime}
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Apply Runtime Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operational Worksurface */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Section 1: Analysis Engines Health */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-sm p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-400 text-[22px]">memory</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display-serif text-lg text-white">Dissection Engines &amp; Pipeline</h2>
                    <span className="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      6/6 ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Core protocol dissection, hardware acceleration offload, and zero-copy ingestion status</p>
                </div>
              </div>
              <button 
                className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-teal-300 border border-zinc-700/80 px-3 py-1 rounded-sm font-mono text-xs transition-colors" 
                id="btn-toggle-telemetry" 
                type="button" 
                onClick={() => setTelemetryOpen((v) => !v)}
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>{telemetryOpen ? "Hide Diagnostic Sockets" : "View Telemetry & Sockets"}</span>
              </button>
            </div>

            {/* Engines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              
              <div className="bg-[#14171c] border border-zinc-800/80 p-3.5 rounded-sm flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">Zeek / Spicy</div>
                    <div className="text-[11px] font-mono text-zinc-500">Dissection Engine • v3.2.0</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span>CPU 0-1 (Pinned)</span>
                  <span className="text-teal-400">512 MB Pool (0 drops)</span>
                </div>
              </div>

              <div className="bg-[#14171c] border border-zinc-800/80 p-3.5 rounded-sm flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">tshark Lua Engine</div>
                    <div className="text-[11px] font-mono text-zinc-500">Frame Decoder • v4.2.4</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span>IPC-shm-0 (Atomic)</span>
                  <span className="text-zinc-200">1,024 MB Ring</span>
                </div>
              </div>

              <div className="bg-[#14171c] border border-zinc-800/80 p-3.5 rounded-sm flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">Scapy Micro-Dissector</div>
                    <div className="text-[11px] font-mono text-zinc-500">Bit Verification • v2.5.0</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span>DPDK Ring Bypass</span>
                  <span className="text-teal-400">IKEv2 &amp; ESP Target</span>
                </div>
              </div>

              <div className="bg-[#14171c] border border-zinc-800/80 p-3.5 rounded-sm flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">ML Traffic Classifier</div>
                    <div className="text-[11px] font-mono text-zinc-500">ONNX Runtime • v1.17.1</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span>TensorRT / CUDA</span>
                  <span className="text-teal-400 font-medium">0.84 ms / flow</span>
                </div>
              </div>

              <div className="bg-[#14171c] border border-zinc-800/80 p-3.5 rounded-sm flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">Anomaly Detector</div>
                    <div className="text-[11px] font-mono text-zinc-500">IsoForest + Autoenc • v2.1</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span>AVX-512 Vectorized</span>
                  <span className="text-zinc-200">0.03% Anomaly Rate</span>
                </div>
              </div>

              <div className="bg-[#14171c] border border-zinc-800/80 p-3.5 rounded-sm flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">Local Forensic LLM</div>
                    <div className="text-[11px] font-mono text-zinc-500">SecReason-v4.2 • 14.2B</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span>NVIDIA RTX A6000 (32L)</span>
                  <span className="text-teal-400 font-medium">9.4 GB VRAM</span>
                </div>
              </div>

            </div>

            {/* Telemetry Drawer */}
            {telemetryOpen && (
              <div className="bg-[#0e1014] p-3.5 rounded-sm border border-zinc-800 space-y-2" id="drawer-telemetry">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-zinc-500">
                  <span>Pipeline Telemetry &amp; IPC Paths (Diagnostic Mode)</span>
                  <button className="text-zinc-500 hover:text-white" type="button" onClick={() => setTelemetryOpen(false)}>
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 bg-[#14171c] rounded-sm border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Zeek Analyzer Plugin:</span>
                    <span className="text-teal-400 truncate block">zeek-ipsec-analyzer</span>
                  </div>
                  <div className="p-2 bg-[#14171c] rounded-sm border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">tshark Binary &amp; Script:</span>
                    <span className="text-teal-400 truncate block font-mono">/usr/bin/tshark -X lua:ipsec_posture.lua</span>
                  </div>
                  <div className="p-2 bg-[#14171c] rounded-sm border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">LLM Unix Domain Socket:</span>
                    <span className="text-teal-400 truncate block font-mono">/run/tunnelsight/vllm.sock</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: ML Models & Local LLM Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* ML Model Configuration */}
            <div className="bg-[#111317] border border-zinc-800/80 rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[20px]">psychology</span>
                  <h2 className="font-display-serif text-lg text-white">ML Model Configuration</h2>
                </div>
                <span className="text-xs font-mono text-zinc-500">ONNX Runtime 1.17.1</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">Traffic Classification Weights</label>
                  <div className="relative">
                    <select className="w-full bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono py-2 px-3 rounded-sm appearance-none focus:outline-none focus:border-teal-500/50 cursor-pointer">
                      <option>flow-classifier-ensemble-v3.4.onnx (Current Active)</option>
                      <option>xgb-flows-baseline-v2.1.onnx</option>
                      <option>rf-payload-entropy-v1.0.onnx</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-2 text-zinc-500 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mt-1">
                    <span>SHA256: 8f4e2c9a...3d01</span>
                    <span className="text-teal-400">L3/L4 Temporal Features (54 vars)</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">Anomaly Baseline Model</label>
                  <div className="relative">
                    <select className="w-full bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono py-2 px-3 rounded-sm appearance-none focus:outline-none focus:border-teal-500/50 cursor-pointer">
                      <option>isoforest-dispersion-v2.3.bin [Enterprise-Edge-Audit (7d)]</option>
                      <option>isoforest-dispersion-v2.2-datacenter.bin</option>
                      <option>autoencoder-spikegate-v1.8.bin</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-2 text-zinc-500 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400 uppercase text-[10px]">Classification Threshold</span>
                      <span className="font-mono text-teal-400 font-semibold" id="label-conf-thresh">{confThresh.toFixed(1)}%</span>
                    </div>
                    <input 
                      aria-label="Classification Threshold" 
                      className="w-full accent-teal-400 bg-zinc-800 rounded h-1 cursor-pointer" 
                      id="slider-conf-thresh" 
                      max="99" 
                      min="50" 
                      step="0.5" 
                      type="range" 
                      value={confThresh} 
                      onChange={(e) => setConfThresh(Number(e.target.value))} 
                    />
                    <p className="text-[11px] text-zinc-500 leading-tight">Min certainty before flow label commits to metadata.</p>
                  </div>

                  <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400 uppercase text-[10px]">Anomaly Sensitivity</span>
                      <span className="font-mono text-teal-400 font-semibold" id="label-anomaly-sens">{anomalySens.toFixed(2)}</span>
                    </div>
                    <input 
                      aria-label="Anomaly Sensitivity Z-Score" 
                      className="w-full accent-teal-400 bg-zinc-800 rounded h-1 cursor-pointer" 
                      id="slider-anomaly-sens" 
                      max="1.00" 
                      min="0.10" 
                      step="0.01" 
                      type="range" 
                      value={anomalySens} 
                      onChange={(e) => setAnomalySens(Number(e.target.value))} 
                    />
                    <p className="text-[11px] text-zinc-500 leading-tight">Z-score trigger threshold for flagged IKE disruption alerts.</p>
                  </div>
                </div>

                <div className="bg-[#0e1014] border border-zinc-800 p-3 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-teal-400 text-[18px]">verified_user</span>
                    <div>
                      <div className="text-xs text-white font-medium">Feature Extraction Compliance</div>
                      <div className="text-[11px] text-zinc-500 font-mono">Strict Zero-Payload Inspection (Metadata / Headers Only)</div>
                    </div>
                  </div>
                  <span className="bg-teal-950/60 border border-teal-800/50 text-teal-300 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold">
                    LOCKED ON (RFC 7296)
                  </span>
                </div>
              </div>
            </div>

            {/* Local Forensic LLM Engine */}
            <div className="bg-[#111317] border border-zinc-800/80 rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-400 text-[20px]">terminal</span>
                  <h2 className="font-display-serif text-lg text-white">Local Forensic LLM Engine</h2>
                </div>
                <span className="bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                  EVIDENCE-BOUND ONLY
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">RPC Endpoint &amp; Socket</label>
                  <div className="flex items-center gap-2">
                    <input 
                      className="w-full bg-[#14171c] border border-zinc-800 text-zinc-200 text-xs font-mono py-2 px-3 rounded-sm focus:outline-none focus:border-teal-500/50" 
                      type="text" 
                      defaultValue="http://127.0.0.1:8080/v1" 
                    />
                    <button 
                      className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-teal-300 border border-zinc-700 px-3 py-2 rounded-sm text-xs font-mono flex items-center gap-1.5 transition-colors" 
                      type="button" 
                      onClick={testEndpoint}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>Test (14ms)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Model Identifier</span>
                    <div className="text-xs text-teal-400 font-mono truncate">SecReason-v4.2-14B.Q4_K_M</div>
                    <div className="text-[11px] font-mono text-zinc-500">14.2B params • Context: 8,192 tok</div>
                  </div>

                  <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400 uppercase text-[10px]">Sampling Temperature</span>
                      <span className="font-mono text-teal-400 font-semibold" id="label-temperature">{temperature.toFixed(2)}</span>
                    </div>
                    <input 
                      aria-label="Sampling Temperature" 
                      className="w-full accent-teal-400 bg-zinc-800 rounded h-1 cursor-pointer" 
                      id="slider-temperature" 
                      max="0.30" 
                      min="0.00" 
                      step="0.01" 
                      type="range" 
                      value={temperature} 
                      onChange={(e) => setTemperature(Number(e.target.value))} 
                    />
                    <p className="text-[11px] text-zinc-500 leading-tight">Deterministic cryptographic synthesis.</p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1.5">Explanation Policy Governance</label>
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 bg-[#14171c] border border-teal-500/30 p-3 rounded-sm cursor-pointer">
                      <input defaultChecked className="mt-0.5 accent-teal-400" name="llm_policy" type="radio" />
                      <div>
                        <div className="text-xs text-white font-medium">Strict Evidence-Bound Only (Deterministic)</div>
                        <div className="text-[11px] text-zinc-400">Prohibits speculative explanations. Synthesizes ONLY with confirmed byte offsets.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 bg-[#14171c]/60 border border-zinc-800/80 p-3 rounded-sm cursor-pointer">
                      <input className="mt-0.5 accent-teal-400" name="llm_policy" type="radio" />
                      <div>
                        <div className="text-xs text-zinc-300 font-medium">Heuristic Contextual Synthesis</div>
                        <div className="text-[11px] text-zinc-500">Allows probabilistic correlations across peer behavior clusters.</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Evidence Tiering & Provenance */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">verified</span>
                <div>
                  <h2 className="font-display-serif text-lg text-white">Evidence Tiering &amp; Provenance Policy</h2>
                  <p className="text-xs text-zinc-400">Cryptographic verification thresholds and forensic watermarking</p>
                </div>
              </div>
              <div className="bg-[#14171c] border border-zinc-800 px-2.5 py-1 rounded-sm text-xs font-mono text-teal-400">
                Mandatory 3-Tier Proof Hierarchy
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-[#14171c] border border-zinc-800 p-4 rounded-sm flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">Tier 1: CONFIRMED</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 px-1.5 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[12px]">verified</span>100% CERTAINTY
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Deterministic byte offset extraction in IKE_SA_INIT or CREATE_CHILD_SA dissection.</p>
                </div>
                <div className="bg-[#0e1014] p-2.5 rounded-sm border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between"><span>SPI Match:</span><span className="text-teal-400 font-medium">Bit-for-bit Required</span></div>
                  <div className="flex justify-between"><span>Dissection Offset:</span><span className="text-teal-400 font-medium">Mandatory RFC 7296</span></div>
                </div>
              </div>

              <div className="bg-[#14171c] border border-zinc-800 p-4 rounded-sm flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">Tier 2: INFERRED</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-amber-950/60 border border-amber-800/50 text-amber-400 px-1.5 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[12px]">insights</span>≥75% CONFIDENCE
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Statistical ML prediction. Requires visible INFERRED watermark badge in all UI exports.</p>
                </div>
                <div className="bg-[#0e1014] p-2.5 rounded-sm border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between"><span>Watermark:</span><span className="text-amber-400 font-medium">Mandatory Flag</span></div>
                  <div className="flex justify-between"><span>Entropy Limit:</span><span className="text-zinc-200 font-medium">Shannon H &gt; 7.98</span></div>
                </div>
              </div>

              <div className="bg-[#14171c] border border-zinc-800 p-4 rounded-sm flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">Tier 3: UNKNOWN</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-rose-950/60 border border-rose-800/50 text-rose-400 px-1.5 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[12px]">help</span>BLIND SPOT
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Opaque payloads or missing handshakes. Suppressing blind spots is strictly prohibited.</p>
                </div>
                <div className="bg-[#0e1014] p-2.5 rounded-sm border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between"><span>Audit Stance:</span><span className="text-rose-400 font-medium">Explicit Log</span></div>
                  <div className="flex justify-between"><span>Suppression:</span><span className="text-zinc-500 font-medium">Forbidden</span></div>
                </div>
              </div>

            </div>

            <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[11px] font-mono text-zinc-500 uppercase">Active Policy Toggles</span>
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input defaultChecked className="accent-teal-400 rounded" type="checkbox" />
                <span>Require Frame Offset</span>
              </label>
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input defaultChecked className="accent-teal-400 rounded" type="checkbox" />
                <span>Enforce SHA256 Integrity</span>
              </label>
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input defaultChecked className="accent-teal-400 rounded" type="checkbox" />
                <span>Block Hallucinations on Missing Keys</span>
              </label>
            </div>
          </div>

          {/* Section 4: Monitored Interfaces */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">settings_input_component</span>
                <div>
                  <h2 className="font-display-serif text-lg text-white">Monitored Interfaces &amp; Storage Retention</h2>
                  <p className="text-xs text-zinc-400">DPDK zero-copy ring buffers and compliance retention thresholds</p>
                </div>
              </div>
              <div className="text-xs font-mono text-zinc-500">
                Engine: <span className="text-teal-400 font-mono">Parquet + ZSTD-6</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto border border-zinc-800 rounded-sm">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#14171c] text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-2.5 px-3">Interface</th>
                    <th className="py-2.5 px-3">Link State</th>
                    <th className="py-2.5 px-3">Throughput</th>
                    <th className="py-2.5 px-3">Retention</th>
                    <th className="py-2.5 px-3 text-right">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-teal-400">dpdk0 <span className="text-zinc-500 font-normal">(enp3s0f0)</span></td>
                    <td className="py-2.5 px-3 text-emerald-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> 10 GbE Full Duplex
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-200">4.82 Gbps (0.00% drop)</td>
                    <td className="py-2.5 px-3 text-zinc-400">30 Days PCAP / 10-Yr Meta</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 bg-teal-950/60 border border-teal-800/50 text-teal-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">sensors</span>ACTIVE CAPTURE
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/20 transition-colors bg-[#0e1014]/40">
                    <td className="py-2.5 px-3 font-semibold text-zinc-300">dpdk1 <span className="text-zinc-500 font-normal">(enp3s0f1)</span></td>
                    <td className="py-2.5 px-3 text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">pause_circle</span> 10 GbE Standby
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500">0.00 Gbps (Idle)</td>
                    <td className="py-2.5 px-3 text-zinc-400">Failover Mirror</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 bg-zinc-800/60 border border-zinc-700/60 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">sync_alt</span>STANDBY REPLICATION
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-zinc-300">pcap-tap0 <span className="text-zinc-500 font-normal">(Kernel IPC)</span></td>
                    <td className="py-2.5 px-3 text-emerald-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">cached</span> Loopback Synthetic
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-200">124.2 Mbps</td>
                    <td className="py-2.5 px-3 text-zinc-400">Session Lifetime</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">play_circle</span>TESTBED INGEST
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Ring Buffer Allocation</span>
                <div className="text-base font-mono text-white font-semibold">4,096 MB</div>
                <div className="text-[11px] font-mono text-zinc-500">DPDK Hugepages (2MB x 2048)</div>
              </div>
              <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Max Ingest PCAP Size</span>
                <div className="text-base font-mono text-white font-semibold">2,048 MB (2.0 GB)</div>
                <div className="text-[11px] font-mono text-zinc-500">Auto-split on overflow threshold</div>
              </div>
              <div className="bg-[#14171c] border border-zinc-800 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Watchdog Pipeline Timeout</span>
                <div className="text-base font-mono text-white font-semibold">120 seconds</div>
                <div className="text-[11px] font-mono text-zinc-500">Interrupt long-running flows</div>
              </div>
            </div>
          </div>

          {/* Staged Changes Commit Bar */}
          <div className="bg-[#111317] border border-zinc-800/80 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="material-symbols-outlined text-zinc-500 text-[18px]">info</span>
              <span>Changes staged in memory. Commit initiates non-disruptive daemon rehash (<code className="text-teal-400 font-mono">SIGHUP 39420</code>).</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3.5 py-1.5 rounded-sm text-xs font-mono transition-colors" 
                type="button" 
                onClick={discardDraft}
              >
                Discard Draft
              </button>
              <button 
                className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-4 py-1.5 rounded-sm text-xs font-mono transition-colors shadow-sm" 
                type="button" 
                onClick={commitDaemon}
              >
                Commit &amp; Rehash Daemon
              </button>
            </div>
          </div>

        </div>
      </AppShell>
    </div>
  );
}
