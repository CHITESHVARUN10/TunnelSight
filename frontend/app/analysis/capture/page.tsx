"use client";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import { downloadReportPdf, getAnalysis } from "@/lib/analysis";
import { AppShell } from "@/components/layout/AppShell";

export default function CaptureDrawerPage() {
  const router = useRouter();
  const params = useSearchParams();
  const analysisId = params.get("analysis_id");
  const toast = useToast();
  const [filename, setFilename] = useState("—");

  useEffect(() => {
    if (!analysisId) return;
    let dead = false;
    (async () => {
      try {
        const a = await getAnalysis(analysisId);
        if (!dead) setFilename(a.filename);
      } catch {
        // leave the placeholder name
      }
    })();
    return () => {
      dead = true;
    };
  }, [analysisId]);

  const openFullAnalysis = () =>
    router.push(analysisId ? `/analysis/results?analysis_id=${analysisId}` : "/analysis/results");

  const generateReport = async () => {
    if (analysisId) {
      try {
        await downloadReportPdf(analysisId, filename);
        toast({ title: "Report generated", body: `${filename} PDF report downloaded.`, kind: "ok" });
        return;
      } catch (err) {
        toast({ title: "Report failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
        return;
      }
    }
    downloadFile("capture-metadata.json", JSON.stringify({ capture: filename, generated: new Date().toISOString() }, null, 2), "application/json");
    toast({ title: "No capture selected", body: "Exported capture metadata instead.", kind: "info" });
  };

  return (
    <div className="bg-[#0c0e11] font-sans text-sm text-zinc-300 antialiased">
      <AppShell active="">
        <div className="p-8 text-sm">
          Capture: <span className="font-mono text-zinc-100">{filename}</span>
        </div>
        <div className="flex gap-3 px-8 pb-8">
          <button
            className="rounded bg-teal-500 px-4 py-2 font-mono text-xs font-semibold text-black hover:bg-teal-400"
            type="button"
            onClick={openFullAnalysis}
          >
            Open Full Analysis
          </button>
          <button
            className="rounded border border-zinc-700 px-4 py-2 font-mono text-xs text-zinc-200 hover:bg-zinc-800"
            type="button"
            onClick={generateReport}
          >
            Generate Report
          </button>
          <Link className="font-mono text-xs text-zinc-400 underline self-center" href="/history">
            Back to history
          </Link>
        </div>
      </AppShell>
    </div>
  );
}
