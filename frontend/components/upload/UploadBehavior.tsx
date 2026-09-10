"use client";
// Upload wiring for /analyze: a selected/dropped capture is POSTed to the backend
// immediately, then the browser moves to the pipeline page for the returned id.

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { uploadPcap } from "@/lib/analysis";
import { useToast } from "@/lib/toast";

export function UploadBehavior() {
  const router = useRouter();
  const toast = useToast();
  const busyRef = useRef(false);

  useEffect(() => {
    const input = document.getElementById("pcap-file-input") as HTMLInputElement | null;
    const zone = document.getElementById("drop-zone");
    const trigger = document.getElementById("trigger-select-btn");
    if (!input || !zone) return;

    const openPicker = () => input.click();
    const onDrag = (e: DragEvent) => e.preventDefault();

    const ingest = async (file: File) => {
      if (busyRef.current) return;
      busyRef.current = true;
      toast({ title: "Capture received", body: `${file.name} (${file.size.toLocaleString()} bytes) — running parser and models.`, kind: "info" });
      try {
        const row = await uploadPcap(file);
        router.push(`/analysis/progress?analysis_id=${row.id}`);
      } catch (err) {
        busyRef.current = false;
        toast({ title: "Upload failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
      }
    };

    const onChange = () => {
      if (input.files && input.files[0]) ingest(input.files[0]);
      input.value = "";
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.files[0]) ingest(e.dataTransfer.files[0]);
    };

    trigger?.addEventListener("click", openPicker);
    zone.addEventListener("click", openPicker);
    input.addEventListener("change", onChange);
    zone.addEventListener("drop", onDrop);
    zone.addEventListener("dragover", onDrag);
    return () => {
      trigger?.removeEventListener("click", openPicker);
      zone.removeEventListener("click", openPicker);
      input.removeEventListener("change", onChange);
      zone.removeEventListener("drop", onDrop);
      zone.removeEventListener("dragover", onDrag);
    };
  }, [router, toast]);

  return null;
}
