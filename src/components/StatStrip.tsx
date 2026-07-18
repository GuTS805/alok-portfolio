"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { stats } from "@/lib/data";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

function StatCell({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useSafeReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only skip of the count-up animation
      setDisplay(value);
      return;
    }
    let raf = 0;
    const duration = 900;
    const start = performance.now();
    function step(ts: number) {
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);

  return (
    <div ref={ref} className="bg-surface px-4 py-[18px] text-left">
      <div className="font-mono text-[clamp(1.5rem,4vw,1.9rem)] font-semibold tracking-[-0.01em] text-accent [font-variant-numeric:tabular-nums]">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-[11.5px] uppercase tracking-[0.07em] text-ink-faint">
        {label}
      </div>
    </div>
  );
}

export default function StatStrip() {
  return (
    <div className="mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
      {stats.map((s) => (
        <StatCell key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
      ))}
    </div>
  );
}
