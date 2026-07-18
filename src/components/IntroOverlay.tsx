"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const SPOKES = Array.from({ length: 8 });

function WheelGlyph() {
  return (
    <svg width="180" height="180" viewBox="0 0 200 200" aria-hidden="true">
      <circle
        cx="100"
        cy="100"
        r="72"
        stroke="var(--accent)"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="56"
        stroke="var(--accent)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <circle
        cx="100"
        cy="100"
        r="20"
        stroke="var(--accent)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      {SPOKES.map((_, i) => {
        const a = (i / SPOKES.length) * Math.PI * 2;
        const x1 = 100 + Math.cos(a) * 20;
        const y1 = 100 + Math.sin(a) * 20;
        const x2 = 100 + Math.cos(a) * 72;
        const y2 = 100 + Math.sin(a) * 72;
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--accent)"
              strokeWidth="2"
            />
            <circle cx={x2} cy={y2} r="3.5" fill="var(--accent)" />
          </g>
        );
      })}
      <circle cx="100" cy="100" r="18" fill="var(--accent)" opacity="0.55" />
    </svg>
  );
}

export default function IntroOverlay() {
  const [phase, setPhase] = useState<"playing" | "done">("playing");
  const reduced = useSafeReducedMotion();

  useEffect(() => {
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion preference is only known client-side
      setPhase("done");
      return;
    }
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setPhase("done"), 2400);
    function skip() {
      setPhase("done");
    }
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
    };
  }, [reduced]);

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase === "playing" && (
        <motion.div
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setPhase("done")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, 45, 200, 760, 1120] }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              rotate: {
                duration: 1.7,
                times: [0, 0.1, 0.32, 0.82, 1],
                ease: "easeInOut",
              },
            }}
          >
            <WheelGlyph />
          </motion.div>

          <motion.div
            className="mt-7 font-mono text-xs uppercase tracking-[0.25em] text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, times: [0, 0.22, 0.78, 1] }}
          >
            adapting domain expansion
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.9, 0] }}
            transition={{ duration: 1.7, times: [0, 0.78, 0.86, 1] }}
            style={{
              background:
                "radial-gradient(circle at center, var(--accent) 0%, transparent 65%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
