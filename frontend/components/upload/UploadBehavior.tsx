"use client";
// Demo upload flow for /analyze. Wires existing markup by id (no visual changes):
// drop-zone click/drag-drop + Select Capture -> file picker; Load sample trace
// fetches /demo/weak-vpn-07.pcap; selection stored in sessionStorage;
// Proceed to Deep Inspection -> /analysis/progress (warns if nothing selected).

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/lib/mock/toast";

export const DEMO_FILE_KEY = "ts_demo_file";
export const DEMO_SAMPLE = { name: "weak-vpn-07.pcap", size: 24060, sample: true };

export function UploadBehavior() {
  const router = useRouter();
  const toast = useToast();
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);

  useEffect(() => {
    const input = document.getElementById("pcap-file-input") as HTMLInputElement | null;
    const zone = document.getElementById("drop-zone");
    const trigger = document.getElementById("trigger-select-btn");
    const sample = document.getElementById("load-sample-btn");
    if (!input || !zone) return;

    const pick = (f: File | { name: string; size: number }) => {
      const rec = { name: f.name, size: f.size };
      sessionStorage.setItem(DEMO_FILE_KEY, JSON.stringify(rec));
      setFile(rec);
      toast({ title: "Capture staged", body: `${rec.name} (${rec.size.toLocaleString()} bytes) ready for ingestion.`, kind: "ok" });
    };
    const openPicker = () => input.click();
    const onChange = () => {
      if (input.files && input.files[0]) pick(input.files[0]);
      input.value = "";
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.files[0]) pick(e.dataTransfer.files[0]);
    };
    const onDrag = (e: DragEvent) => e.preventDefault();
    const onSample = async () => {
      try {
        const r = await fetch("/demo/weak-vpn-07.pcap");
        const buf = await r.arrayBuffer();
        pick({ name: DEMO_SAMPLE.name, size: buf.byteLength });
      } catch {
        pick(DEMO_SAMPLE);
      }
    };

    trigger?.addEventListener("click", openPicker);
    zone.addEventListener("click", openPicker);
    input.addEventListener("change", onChange);
    zone.addEventListener("drop", onDrop);
    zone.addEventListener("dragover", onDrag);
    sample?.addEventListener("click", onSample);
    return () => {
      trigger?.removeEventListener("click", openPicker);
      zone.removeEventListener("click", openPicker);
      input.removeEventListener("change", onChange);
      zone.removeEventListener("drop", onDrop);
      zone.removeEventListener("dragover", onDrag);
      sample?.removeEventListener("click", onSample);
    };
  }, [toast]);

  const proceed = () => {
    const raw = sessionStorage.getItem(DEMO_FILE_KEY);
    if (!raw) {
      toast({ title: "No capture selected", body: "Choose a file or load the sample trace first.", kind: "warn" });
      return;
    }
    router.push("/analysis/progress");
  };

  return (
    <>
      {file ? (
        <div className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2">
          <button
            onClick={proceed}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-headline-sm text-headline-sm font-semibold text-on-primary shadow-2xl hover:bg-primary-fixed"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            Analyze {file.name} →
          </button>
        </div>
      ) : null}
      <ProceedHook onProceed={proceed} />
    </>
  );
}

// Hooks the in-design "Proceed to Deep Inspection" button (found by label).
function ProceedHook({ onProceed }: { onProceed: () => void }) {
  useEffect(() => {
    const btns = Array.from(document.querySelectorAll("button")).filter((b) =>
      (b.textContent ?? "").includes("Proceed to Deep Inspection")
    );
    const h = () => onProceed();
    btns.forEach((b) => b.addEventListener("click", h));
    return () => btns.forEach((b) => b.removeEventListener("click", h));
  }, [onProceed]);
  return null;
}
