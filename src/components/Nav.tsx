"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Stack" },
  { href: "#projects", label: "Projects" },
  { href: "#achievements", label: "Log" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-0 z-20 border-b border-border bg-bg/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4 px-7 py-3.5">
        <div className="flex items-baseline gap-2 font-mono text-sm tracking-wide">
          <span className="relative inline-flex h-2 w-2 items-center justify-center">
            <span className="absolute h-2 w-2 animate-pulse rounded-full bg-accent-2 shadow-[0_0_0_3px_rgba(52,214,193,0.2)]" />
          </span>
          alok<span className="text-ink-faint">@</span>portfolio
        </div>

        <nav
          ref={navRef}
          className="hidden gap-5 text-[13px] uppercase tracking-[0.08em] text-ink-soft sm:flex"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative pb-[3px] transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 after:content-[''] ${
                active === l.href
                  ? "text-accent after:right-0"
                  : "after:right-full"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </div>
  );
}
