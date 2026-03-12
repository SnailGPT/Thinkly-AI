"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="h-8 w-8 rounded-full border border-border bg-muted" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 items-center justify-between rounded-full border border-border bg-surface/80 px-1 text-xs text-muted-foreground hover:bg-muted transition-colors gap-1.5"
      aria-label="Toggle theme"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          !isDark ? "bg-blue-500 text-white" : "text-muted-foreground"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          isDark ? "bg-slate-900 text-yellow-300" : "text-muted-foreground"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

