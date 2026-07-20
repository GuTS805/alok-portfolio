"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const SPOKES = Array.from({ length: 8 });
const CENTER = 120;
const RIM_R = 76;
const KNOB_R = 96;
const HUB_R = 27;
const KNOB_SIZE = 15;

function WheelGlyph() {
  return (
    <svg width="220" height="220" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <radialGradient id="wheelBall" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff6da" />
          <stop offset="40%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="#5c3f10" />
        </radialGradient>
        <radialGradient id="wheelRim" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#ffedb0" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="#4a3009" />
        </radialGradient>
      </defs>

      <circle
        cx={CENTER}
        cy={CENTER}
        r={RIM_R}
        stroke="url(#wheelRim)"
        strokeWidth="15"
        fill="none"
      />

      {SPOKES.map((_, i) => {
        const a = (i / SPOKES.length) * Math.PI * 2;
        const x1 = CENTER + Math.cos(a) * HUB_R;
        const y1 = CENTER + Math.sin(a) * HUB_R;
        const x2 = CENTER + Math.cos(a) * KNOB_R;
        const y2 = CENTER + Math.sin(a) * KNOB_R;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#wheelRim)"
            strokeWidth="9"
            strokeLinecap="round"
          />
        );
      })}

      {SPOKES.map((_, i) => {
        const a = (i / SPOKES.length) * Math.PI * 2;
        const x = CENTER + Math.cos(a) * KNOB_R;
        const y = CENTER + Math.sin(a) * KNOB_R;
        return (
          <circle key={i} cx={x} cy={y} r={KNOB_SIZE} fill="url(#wheelBall)" />
        );
      })}

      <circle cx={CENTER} cy={CENTER} r={HUB_R} fill="url(#wheelBall)" />
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
