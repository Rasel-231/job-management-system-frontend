"use client";

import { useEffect, useState } from "react";
import { Icon } from "../ui/icons";

// Adds/removes the `dark` class on <html> and persists the choice. The initial
// class is applied pre-hydration by an inline script in the root layout, so
// this only needs to stay in sync once mounted.
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // storage unavailable — theme still applies for this session
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!mounted}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground disabled:opacity-0"
    >
      <Icon name={dark ? "moon" : "sun"} className="h-4 w-4" />
    </button>
  );
}