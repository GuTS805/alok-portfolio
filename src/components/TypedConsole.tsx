"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  "$ whoami",
  "alok-srivastava — cs undergrad, full-stack dev",
  "$ status --check",
  "3 featured projects · realtime systems · auth · REST APIs",
];

export default function TypedConsole() {
  const [displayLines, setDisplayLines] = useState<string[]>([""]);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia is only available client-side, so this can't move to the initializer without a hydration mismatch
      setDisplayLines(LINES);
      return;
    }

    let li = 0;
    let ci = 0;
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const full = LINES[li];
      if (ci <= full.length) {
        setDisplayLines((prev) => {
          const next = [...prev];
          next[li] = full.slice(0, ci);
          return next;
        });
        ci++;
        timeout = setTimeout(tick, 22 + Math.random() * 28);
      } else {
        li++;
        ci = 0;
        if (li < LINES.length) {
          setDisplayLines((prev) => [...prev, ""]);
          timeout = setTimeout(tick, 380);
        }
      }
    }

    timeout = setTimeout(tick, 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="mb-7 min-h-[44px] font-mono text-[13px] text-accent-2">
      {displayLines.map((line, i) => {
        const isPrompt = i % 2 === 0;
        const isLast = i === displayLines.length - 1;
        const spaceIdx = isPrompt ? line.indexOf(" ") : -1;
        const cmd = spaceIdx === -1 ? line : line.slice(0, spaceIdx);
        const rest = spaceIdx === -1 ? "" : line.slice(spaceIdx);

        return (
          <span key={i} className="block">
            {isPrompt ? (
              <>
                <span className="text-ink-faint">{cmd}</span>
                {rest}
              </>
            ) : (
              line
            )}
            {isLast && (
              <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-[blink_1s_step-end_infinite] bg-accent-2 align-middle" />
            )}
          </span>
        );
      })}
      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
