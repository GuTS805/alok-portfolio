"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { LanguageStat } from "@/lib/github";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "var(--accent-2)",
  JavaScript: "var(--accent)",
  Python: "#6aa9ff",
  HTML: "#ff8a65",
  CSS: "#b48cff",
  PowerShell: "#8aa6c4",
  Dockerfile: "#5fc9a8",
};

export default function LanguageBars({ data }: { data: LanguageStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useSafeReducedMotion();

  return (
    <div ref={ref} className="flex flex-col gap-3">
      {data.map((lang, i) => (
        <div key={lang.name} className="flex items-center gap-3">
          <span className="w-[92px] shrink-0 font-mono text-[12.5px] text-ink-soft">
            {lang.name}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-code-bg">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: LANG_COLORS[lang.name] ?? "var(--accent)",
                width: reduced ? `${lang.percent}%` : undefined,
              }}
              initial={reduced ? undefined : { width: 0 }}
              animate={
                reduced ? undefined : { width: inView ? `${lang.percent}%` : 0 }
              }
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-mono text-[12px] text-ink-faint [font-variant-numeric:tabular-nums]">
            {lang.percent}%
          </span>
        </div>
      ))}
    </div>
  );
}
