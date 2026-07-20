"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const SPOKES = Array.from({ length: 8 });
const CENTER = 130;
const RIM_R = 86;
const KNOB_R = 108;
const HUB_R = 32;
const KNOB_SIZE = 18;

function WheelGlyph() {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" aria-hidden="true">
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
        strokeWidth="17"
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
            strokeWidth="11"
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
    const timer = setTimeout(() => setPhase("done"), 2950);
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
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setPhase("done")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: [0.6, 1, 0.97, 1, 0.97, 1, 1, 1, 1.07, 1],
              rotate: [0, 0, 40, 88, 132, 178, 178, 900, 1130, 1080],
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: {
                duration: 2.6,
                times: [0, 0.06, 0.15, 0.24, 0.33, 0.42, 0.5, 0.82, 0.93, 1],
                ease: "easeInOut",
              },
              rotate: {
                duration: 2.6,
                times: [0, 0.06, 0.15, 0.24, 0.33, 0.42, 0.5, 0.82, 0.93, 1],
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
            transition={{ duration: 2.8, times: [0, 0.2, 0.8, 1] }}
          >
            adapting domain expansion
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.95, 0] }}
            transition={{ duration: 2.6, times: [0, 0.9, 0.95, 1] }}
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
