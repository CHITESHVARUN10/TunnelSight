"use client";
// Shared header behavior for all app pages. Pages tag their (visually
// untouched) header buttons with data-action; this component delegates:
//   search -> /search, analyze -> /analyze, live -> /analysis/live,
//   profile -> /profile, export -> snapshot download + toast,
//   notifications -> dropdown panel.
// Mounted once in the auth/app layout segment via AppShell.

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockLogout } from "@/lib/mock/session";
import { downloadFile, useToast } from "@/lib/mock/toast";

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
      if (action === "search") router.push("/search");
      else if (action === "analyze") router.push("/analyze");
      else if (action === "live") router.push("/analysis/live");
      else if (action === "profile") router.push("/profile");
      else if (action === "export") {
        downloadFile(
          "tunnelsight-snapshot.json",
          JSON.stringify({ page: pathname, exported: new Date().toISOString(), source: "prototype mock" }, null, 2)
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

  if (!notesOpen) return null;
  return (
    <div className="fixed right-4 top-header-height z-[90] w-80 rounded-lg border border-surface-container-highest bg-surface-container-lowest p-2 shadow-2xl">
      <div className="px-2 py-1 font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
        Notifications
      </div>
      {[
        { icon: "warning", title: "PFS disabled on weak-vpn-07", body: "Child SA rekey omitted ephemeral exchange." },
        { icon: "insights", title: "Egress spike in W-28", body: "4.8x burst anomaly vs baseline." },
        { icon: "verified", title: "Engine v2.4.1-rc3 online", body: "DPDK Ring 0 · 0.02ms." },
      ].map((n) => (
        <div key={n.title} className="flex gap-2 rounded p-2 hover:bg-surface-container">
          <span className="material-symbols-outlined text-[18px] text-primary">{n.icon}</span>
          <div>
            <div className="font-body-md text-body-md font-medium text-on-surface">{n.title}</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">{n.body}</div>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          mockLogout();
          setNotesOpen(false);
          toast({ title: "Signed out", body: "Mock session cleared (prototype).", kind: "info" });
          router.push("/login");
        }}
        className="mt-1 flex w-full items-center gap-2 rounded p-2 text-left hover:bg-surface-container"
      >
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">logout</span>
        <span className="font-body-md text-body-md font-medium text-on-surface">Sign out</span>
      </button>
    </div>
  );
}
