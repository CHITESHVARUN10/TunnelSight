"use client";
// Shared header behavior for all app pages. Pages tag their header buttons
// with data-action; this component delegates:
//   search -> triggers GlobalSearchModal overlay on top of current screen
//   analyze -> /analyze, live -> /analysis/live, profile -> /profile
//   export -> snapshot download + toast
//   notifications -> dropdown panel
// Mounted once globally in layout.tsx.

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/auth";
import { downloadFile, useToast } from "@/lib/toast";
import { GlobalSearchModal } from "@/components/modals/GlobalSearchModal";

export function HeaderBehavior() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    setNotesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href="#"]');
      if (anchor) {
        e.preventDefault();
        toast({ title: "Reference link", body: "External reference — not part of the prototype demo.", kind: "info" });
        return;
      }
      const el = (e.target as HTMLElement).closest("[data-action]");
      if (!el || !(el instanceof HTMLElement)) return;
      const action = el.dataset.action;
      if (action === "search") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("tunnelsight:open-search"));
      } else if (action === "analyze") router.push("/analyze");
      else if (action === "live") router.push("/analysis/live");
      else if (action === "profile") router.push("/profile");
      else if (action === "export") {
        downloadFile(
          "tunnelsight-snapshot.json",
          JSON.stringify({ page: pathname, exported: new Date().toISOString() }, null, 2)
        );
        toast({ title: "Snapshot exported", body: "tunnelsight-snapshot.json downloaded.", kind: "ok" });
      } else if (action === "notifications") setNotesOpen((v) => !v);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, pathname, toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <GlobalSearchModal />
      {notesOpen && (
        <div className="fixed right-4 top-16 z-[95] w-84 rounded-sm border border-zinc-800 bg-[#111317] p-2.5 shadow-2xl font-mono text-xs text-zinc-300 animate-in fade-in">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-800/80 mb-1 flex items-center justify-between">
            <span>System Notifications</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          </div>
          {[
            { icon: "warning", color: "text-amber-400", title: "PFS disabled on weak-vpn-07", body: "Child SA rekey omitted ephemeral exchange." },
            { icon: "insights", color: "text-rose-400", title: "Egress spike in W-28", body: "4.8x burst anomaly vs baseline." },
            { icon: "verified", color: "text-teal-400", title: "Engine v2.4.1 online", body: "DPDK Ring 0 · 0.02ms latency." },
          ].map((n) => (
            <div key={n.title} className="flex gap-2.5 rounded-sm p-2 hover:bg-[#14171c] transition-colors cursor-pointer">
              <span className={`material-symbols-outlined text-[18px] ${n.color} shrink-0 mt-0.5`}>{n.icon}</span>
              <div>
                <div className="text-zinc-200 font-medium text-xs leading-tight">{n.title}</div>
                <div className="text-zinc-500 text-[11px] mt-0.5 leading-snug">{n.body}</div>
              </div>
            </div>
          ))}
          <button
            onClick={async () => {
              try {
                await logout();
              } catch {
              }
              setNotesOpen(false);
              toast({ title: "Signed out", body: "Session ended.", kind: "info" });
              router.push("/login");
            }}
            className="mt-1 pt-1 border-t border-zinc-800/80 flex w-full items-center gap-2 rounded-sm p-2 text-left hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span className="font-medium text-xs">Sign out</span>
          </button>
        </div>
      )}
    </>
  );
}
