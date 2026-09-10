"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";
import {
  getSimulateOptions,
  runSimulation,
  type Analysis,
  type SimulateOptions,
} from "@/lib/analysis";

const DEFAULTS = { encryption: "aes-256-gcm", integrity: "hmac-sha2-256", dh_group: "19" };

function Field({
  id,
  label,
  hint,
  value,
  options,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  options: Record<string, string>;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 min-w-0">
      <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider font-semibold">
        {label}
      </span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-container-low border border-hairline rounded px-3 py-2.5 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary/60 disabled:opacity-50 cursor-pointer"
      >
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
      <span className="font-body-sm text-body-sm text-outline">{hint}</span>
    </label>
  );
}

export default function SimulatePage() {
  const router = useRouter();
  const toast = useToast();
  const [options, setOptions] = useState<SimulateOptions | null>(null);
  const [encryption, setEncryption] = useState(DEFAULTS.encryption);
  const [integrity, setIntegrity] = useState(DEFAULTS.integrity);
  const [dhGroup, setDhGroup] = useState(DEFAULTS.dh_group);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const opts = await getSimulateOptions();
        if (!dead) {
          setOptions(opts);
          if (!opts.encryption[DEFAULTS.encryption]) setEncryption(Object.keys(opts.encryption)[0]);
          if (!opts.integrity[DEFAULTS.integrity]) setIntegrity(Object.keys(opts.integrity)[0]);
          if (!opts.dh_group[DEFAULTS.dh_group]) setDhGroup(Object.keys(opts.dh_group)[0]);
        }
      } catch (err) {
        if (!dead) setError(err instanceof Error ? err.message : "Could not load options.");
      }
    })();
    return () => {
      dead = true;
    };
  }, []);

  async function onRun() {
    setRunning(true);
    setError(null);
    try {
      const row: Analysis = await runSimulation({ encryption, integrity, dh_group: dhGroup });
      toast({ title: "Simulation complete", body: `${row.filename} analyzed.`, kind: "ok" });
      router.push(`/analysis/results?analysis_id=${row.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Simulation failed.";
      setError(msg);
      toast({ title: "Simulation failed", body: msg, kind: "warn" });
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased">
      <AppShell active="/simulate" innerClassName="flex flex-col w-full pb-space-2xl">
        {/* Top Sub-Nav Telemetry Banner */}
        <div className="px-space-base py-space-xs bg-surface-container-low border-b border-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs font-code-sm text-code-sm">
            <span className="text-outline">FORENSICS</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-medium">SIMULATE_SUITE</span>
            <span className="ml-space-sm px-space-xs py-0.5 rounded bg-surface-container-highest font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
              Interactive
            </span>
          </div>
          <div className="flex items-center gap-space-md font-code-sm text-code-sm text-outline">
            <span>RFC 7296 / RFC 4303 / SP 800-77r1</span>
            <span className="text-outline-variant">•</span>
            <span>Synthetic PCAP Generator</span>
          </div>
        </div>

        <div className="p-space-xl max-w-7xl w-full mx-auto flex flex-col gap-space-xl">
          {/* Header */}
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
              Simulate Configuration
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-2xl">
              Pick an IPsec suite and TunnelSight synthesizes an IKEv2 handshake plus ESP traffic,
              then runs the full pipeline — parser, rule engine, ML — and persists the result like
              any uploaded capture. Weak suites raise real findings.
            </p>
          </div>

          {/* Config Card */}
          <div className="bg-surface-container-lowest border border-hairline rounded p-space-xl shadow-lift flex flex-col gap-space-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <Field
                id="sim-encryption"
                label="Encryption"
                hint="IKEv2 transform type 1"
                value={encryption}
                options={options?.encryption ?? { [encryption]: encryption }}
                disabled={running || !options}
                onChange={setEncryption}
              />
              <Field
                id="sim-integrity"
                label="Integrity"
                hint="IKEv2 transform type 3 · AEAD ciphers carry it built-in"
                value={integrity}
                options={options?.integrity ?? { [integrity]: integrity }}
                disabled={running || !options}
                onChange={setIntegrity}
              />
              <Field
                id="sim-dh"
                label="DH Group"
                hint="IKEv2 transform type 4"
                value={dhGroup}
                options={options?.dh_group ?? { [dhGroup]: dhGroup }}
                disabled={running || !options}
                onChange={setDhGroup}
              />
            </div>

            {error && (
              <div className="rounded border border-error/40 bg-error/10 px-3 py-2 font-code-sm text-code-sm text-error">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-space-sm pt-space-xs border-t border-hairline/60">
              <button
                type="button"
                onClick={onRun}
                disabled={running || !options}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded font-code-sm text-code-sm font-semibold transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">{running ? "progress_activity" : "science"}</span>
                <span>{running ? "Synthesizing + Analyzing…" : "Run Simulation"}</span>
              </button>
              <span className="font-code-sm text-code-sm text-outline">
                {running
                  ? "Building PCAP → parser → rules → ML. You will land on the results page."
                  : "Result is saved to History and opens in Results."}
              </span>
            </div>
          </div>

          {/* Suite Preview */}
          <div className="bg-surface-container-low border border-hairline rounded p-space-md font-code-sm text-code-sm text-on-surface-variant flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-outline uppercase tracking-wider">Proposed suite</span>
            <span className="text-primary font-semibold">
              {options?.encryption[encryption] ?? encryption} / {options?.integrity[integrity] ?? integrity} /{" "}
              {options?.dh_group[dhGroup] ?? `Group ${dhGroup}`}
            </span>
          </div>
        </div>
      </AppShell>
    </div>
  );
}
