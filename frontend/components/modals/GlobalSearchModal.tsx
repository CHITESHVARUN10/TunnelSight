"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { downloadFile, useToast } from "@/lib/toast";
import { downloadReportPdf } from "@/lib/analysis";
import {
  SEARCH_SCOPES,
  firstResultPath,
  searchBackend,
  type SearchResponse,
  type SearchScope,
} from "@/lib/search";
import { SearchResults } from "@/components/search/SearchResults";

export function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeScope, setActiveScope] = useState<SearchScope>("all");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  // Listen for global open events and keyboard shortcuts
  useEffect(() => {
    function handleOpenSearch() {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K or Ctrl+K opens/toggles search modal
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) setTimeout(() => inputRef.current?.focus(), 50);
          return next;
        });
      }

      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    window.addEventListener("tunnelsight:open-search", handleOpenSearch);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("tunnelsight:open-search", handleOpenSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced live search
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, query, activeScope]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleDownloadReport = async (id: string, filename: string) => {
    setIsOpen(false);
    try {
      await downloadReportPdf(id, filename);
      toast({ title: "PDF report downloaded", body: `${filename} report saved.`, kind: "ok" });
    } catch (err) {
      toast({ title: "PDF export failed", body: err instanceof Error ? err.message : "Try again.", kind: "warn" });
    }
  };

  const downloadSearchExport = () => {
    if (!data) return;
    downloadFile(
      `tunnelsight-search-${Date.now()}.json`,
      JSON.stringify({ q: data.q, total: data.total, counts: data.counts, groups: data.groups }, null, 2),
      "application/json"
    );
    toast({ title: "Search export downloaded", body: `${data.total} results exported.`, kind: "ok" });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-14 md:pt-20 px-4 bg-black/80 backdrop-blur-md select-none transition-all duration-150 animate-in fade-in"
      id="global-search-backdrop"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("#global-search-container")) {
          handleClose();
        }
      }}
    >
      <div
        id="global-search-container"
        className="w-full max-w-3xl bg-[#111317] border border-zinc-800/90 rounded-sm shadow-2xl flex flex-col overflow-hidden text-zinc-200 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Global Technical Search"
      >
        {/* Search Header Input */}
        <div className="p-4 bg-[#14171c] border-b border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-3 bg-[#0c0e11] border border-zinc-800 rounded-sm px-3.5 py-2.5">
            <span className="material-symbols-outlined text-teal-400 text-xl select-none">search</span>
            <input
              autoFocus
              ref={inputRef}
              className="w-full bg-transparent border-0 p-0 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none tracking-tight"
              id="global-search-input"
              placeholder="Search captures, tunnels, SPI (0x...), RFC findings, reports…"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const first = firstResultPath(data);
                  if (first) navigateTo(first);
                }
              }}
            />
            <div className="flex items-center gap-2 select-none font-mono">
              {query && (
                <button
                  className="flex items-center justify-center w-5 h-5 rounded-sm hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                  title="Clear query"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
              <span className="text-[10px] text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.5 rounded-sm uppercase font-semibold">
                ESC
              </span>
            </div>
          </div>

          {/* Scope Filter Chips (live counts) */}
          <div className="flex items-center gap-1.5 overflow-x-auto select-none font-mono text-xs scrollbar-none">
            {SEARCH_SCOPES.map((scope) => {
              const count = data?.counts[scope.id] ?? 0;
              return (
                <button
                  key={scope.id}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-sm transition-colors text-xs ${
                    activeScope === scope.id
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/40 font-medium"
                      : "bg-[#0c0e11] text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                  }`}
                  onClick={() => setActiveScope(scope.id)}
                  type="button"
                >
                  <span>{scope.label}</span>
                  <span className="text-[10px] text-zinc-500">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Ledger Body */}
        <div className="max-h-[500px] overflow-y-auto p-4 font-mono text-xs">
          {fetchError ? (
            <div className="p-2 text-rose-400">{fetchError}</div>
          ) : (
            <SearchResults
              data={data}
              query={query}
              loading={loading}
              scope={activeScope}
              onOpen={navigateTo}
              onDownloadReport={handleDownloadReport}
            />
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-[#0f1115] border-t border-zinc-800/80 px-4 py-2.5 flex items-center justify-between select-none font-mono text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-sm text-[10px]">ESC</kbd>
              <span>Dismiss</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-sm text-[10px]">↵</kbd>
              <span>Open top result</span>
            </span>
            <button
              className="flex items-center gap-1 hover:text-zinc-300 transition-colors"
              onClick={downloadSearchExport}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>Export JSON</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span>{loading ? "Searching…" : `${data?.total ?? 0} results`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
