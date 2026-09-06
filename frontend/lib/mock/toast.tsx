"use client";
// Global toaster + file-download helper for mock actions.

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type Toast = { id: number; title: string; body?: string; kind: "ok" | "info" | "warn" };

const ToastCtx = createContext<(t: Omit<Toast, "id">) => void>(() => {});

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = nextId++;
    setToasts((ts) => [...ts, { ...t, id }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="min-w-64 max-w-96 rounded-lg border border-surface-container-highest bg-surface-container px-4 py-3 shadow-2xl"
          >
            <div className={`font-label-md text-label-md font-semibold ${t.kind === "ok" ? "text-primary" : t.kind === "warn" ? "text-error" : "text-on-surface"}`}>
              {t.title}
            </div>
            {t.body ? <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{t.body}</div> : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}

export function downloadFile(filename: string, content: string, mime = "application/json"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
