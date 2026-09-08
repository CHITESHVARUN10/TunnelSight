"use client";
// Single theme engine: dark (default) <-> light. Persisted in localStorage,
// applied as html.dark / html.light classes. Server renders dark; a tiny
// pre-hydration script in layout.tsx swaps to light before first paint.

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "tunnelsight-theme";

function readStored(): Theme | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", t === "light");
  root.classList.toggle("dark", t !== "light");
  try {
    window.localStorage.setItem(KEY, t);
  } catch {
    /* private mode — theme just won't persist */
  }
  window.dispatchEvent(new CustomEvent("tunnelsight-theme", { detail: t }));
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(readStored() ?? getTheme());
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && (e.newValue === "light" || e.newValue === "dark")) {
        applyTheme(e.newValue);
      }
    };
    window.addEventListener("tunnelsight-theme", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("tunnelsight-theme", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const set = useCallback((t: Theme) => {
    applyTheme(t);
    setTheme(t);
  }, []);
  return [theme, set];
}
