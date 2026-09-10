"use client";
// Real upload flow for /analyze. Keeps the actual File for upload; same DOM ids.

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { apiForm } from "@/lib/api";
import { useToast } from "@/lib/mock/toast";

export const DEMO_SAMPLE = { name: "weak-vpn-07.pcap", sample: true };

export function UploadBehavior() {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<File | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const input = document.getElementById("pcap-file-input") as HTMLInputElement | null;
    const zone = document.getElementById("drop-zone");
    const trigger = document.getElementById("trigger-select-btn");
    const sample = document.getElementById("load-sample-btn");
    if (!input || !zone) return;

    const showStaged = (f: File) => {
      fileRef.current = f;
      toast({ title: "Capture staged", body: `${f.name} (${f.size.toLocaleString()} bytes) ready for ingestion.`, kind: "ok" });
    };
    const openPicker = () => input.click();
    const onChange = () => {
      if (input.files && input.files[0]) showStaged(input.files[0]);
      input.value = "";
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.files[0]) showStaged(e.dataTransfer.files[0]);
    };
    const onDrag = (e: DragEvent) => e.preventDefault();
    const onSample = async () => {
      try {
        const r = await fetch("/demo/weak-vpn-07.pcap");
        const buf = await r.arrayBuffer();
        showStaged(new File([buf], DEMO_SAMPLE.name, { type: "application/octet-stream" }));
      } catch {
        toast({ title: "Sample unavailable", body: "Pick a file instead.", kind: "warn" });
      }
    };

    const proceed = async () => {
      const f = fileRef.current;
      if (!f) {
        toast({ title: "No capture selected", body: "Choose a file or load the sample trace first.", kind: "warn" });
        return;
      }
      if (busyRef.current) return;
      busyRef.current = true;
      try {
        const form = new FormData();
        form.append("file", f, f.name);
        const row = await apiForm("/api/analyze", form);
        router.push(`/analysis/progress?analysis_id=${row.id}`);
      } catch (err) {
        busyRef.current = false;
        toast({ title: "Upload failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
      }
    };

    trigger?.addEventListener("click", openPicker);
    zone.addEventListener("click", openPicker);
    input.addEventListener("change", onChange);
    zone.addEventListener("drop", onDrop);
    zone.addEventListener("dragover", onDrag);
    sample?.addEventListener("click", onSample);
    const btns = Array.from(document.querySelectorAll("button")).filter((b) =>
      (b.textContent ?? "").includes("Proceed to Deep Inspection")
    );
    btns.forEach((b) => b.addEventListener("click", proceed));
    return () => {
      trigger?.removeEventListener("click", openPicker);
      zone.removeEventListener("click", openPicker);
      input.removeEventListener("change", onChange);
      zone.removeEventListener("drop", onDrop);
      zone.removeEventListener("dragover", onDrag);
      sample?.removeEventListener("click", onSample);
      btns.forEach((b) => b.removeEventListener("click", proceed));
    };
  }, [router, toast]);

  return null;
}
