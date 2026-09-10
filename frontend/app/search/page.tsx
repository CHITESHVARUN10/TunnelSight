"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import { AppShell } from "@/components/layout/AppShell";
import { downloadReportPdf } from "@/lib/analysis";
import {
  SEARCH_SCOPES,
  firstResultPath,
  searchBackend,
  type SearchResponse,
  type SearchScope,
} from "@/lib/search";
import { SearchResults } from "@/components/search/SearchResults";

export default function SearchOverlayPage() {
  const [query, setQuery] = useState("");
  const [activeScope, setActiveScope] = useState<SearchScope>("all");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  const dismiss = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/overview");
    }
  };

  // Debounced live search
  useEffect(() => {
    let dead = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await searchBackend(query, activeScope);
        if (!dead) {
          setData(res);
          setFetchError(null);
        }
      } catch (err) {
        if (!dead) setFetchError(err instanceof Error ? err.message : "Search failed.");
      } finally {
        if (!dead) setLoading(false);
      }
    }, 250);
    return () => {
      dead = true;
      clearTimeout(t);
    };
  }, [query, activeScope]);

  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.focus();
      try {
        el.setSelectionRange(el.value.length, el.value.length);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  const handleDownloadReport = async (id: string, filename: string) => {
    try {
      await downloadReportPdf(id, filename);
      toast({ title: "PDF report downloaded", body: `${filename} report saved.`, kind: "ok" });
    } catch (err) {
      toast({ title: "PDF export failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e11] text-zinc-100 antialiased selection:bg-teal-500/20 selection:text-teal-200">
      <AppShell active="/search">
        <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
          {/* Global Modal Layer Overlay */}
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md"
            id="palette-backdrop"
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest("#command-modal")) dismiss();
            }}
          >
              {/* Command Palette Container */}
              <div
                className="w-full max-w-3xl bg-[#111317] border border-zinc-800 rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all"
                id="command-modal"
              >
                {/* Top Search Input */}
                <div className="p-4 bg-[#14171c] border-b border-zinc-800/80 space-y-3">
                  <div className="flex items-center gap-3 bg-[#0c0e11] border border-zinc-800/80 rounded px-3.5 py-2.5">
                    <span className="material-symbols-outlined text-teal-400 text-xl select-none">search</span>
                    <input
                      autoFocus
                      ref={inputRef}
                      className="w-full bg-transparent border-0 p-0 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none tracking-tight"
                      id="search-input"
                      placeholder="Search captures, tunnels, SPI (0x...), RFC findings, reports…"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const first = firstResultPath(data);
                          if (first) router.push(first);
                        }
                      }}
                    />
                    <div className="flex items-center gap-1.5 select-none font-mono">
                      {query && (
                        <button
                          className="flex items-center justify-center w-5 h-5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                          id="clear-search-btn"
                          title="Clear query"
                          onClick={handleClear}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                      <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded uppercase font-semibold">
                        ESC
                      </span>
                    </div>
                  </div>

                  {/* Scope Filter Chips (live counts) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto select-none font-mono text-xs">
                    {SEARCH_SCOPES.map((scope) => (
                      <button
                        key={scope.id}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                          activeScope === scope.id
                            ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium"
                            : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                        }`}
                        onClick={() => setActiveScope(scope.id)}
                        type="button"
                      >
                        <span>{scope.label}</span>
                        <span className="text-[10px] text-zinc-500">{data?.counts[scope.id] ?? 0}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Ledger Body */}
                <div className="max-h-[520px] overflow-y-auto p-4 font-mono text-xs" id="results-container">
                  {fetchError ? (
                    <div className="p-2 text-rose-400">{fetchError}</div>
                  ) : (
                    <SearchResults
                      data={data}
                      query={query}
                      loading={loading}
                      scope={activeScope}
                      onOpen={(path) => router.push(path)}
                      onDownloadReport={handleDownloadReport}
                    />
                  )}
                </div>

                {/* Footer Bar */}
                <div className="bg-[#0f1115] border-t border-zinc-800/80 px-4 py-2.5 flex items-center justify-between select-none font-mono text-xs text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">↑</kbd>
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">↵</kbd>
                      <span>Open top result</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd>
                      <span>Dismiss</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    <span>{loading ? "Searching…" : `${data?.total ?? 0} results`}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </AppShell>
    </div>
  );
}
