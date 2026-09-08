"use client";
// Theme toggle: floating action (all pages) or inline (landing header).
// Sun/moon swap, persisted via lib/theme, defaults to dark.

import { useTheme } from "@/lib/theme";

export function ThemeToggle({ variant = "floating" }: { variant?: "floating" | "inline" }) {
  const [theme, setTheme] = useTheme();
  const light = theme === "light";
  const onClick = () => setTheme(light ? "dark" : "light");
  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={light ? "Switch to dark theme" : "Switch to light theme"}
        aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
        aria-pressed={light}
        className="p-2 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">{light ? "dark_mode" : "light_mode"}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={light}
      className="theme-toggle-fab glass fixed bottom-6 right-6 z-[80] w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
    >
      <span className="material-symbols-outlined text-[20px]">{light ? "dark_mode" : "light_mode"}</span>
    </button>
  );
}
