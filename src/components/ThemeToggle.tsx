"use client";

import { useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-[14px] text-ink-soft transition-[transform,color,border-color] duration-150 hover:rotate-[20deg] hover:border-accent hover:text-accent"
    >
      {theme === "dark" ? "☀" : "◐"}
    </button>
  );
}
