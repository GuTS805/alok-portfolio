"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let curX = x;
    let curY = y;

    function handleMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
    }

    function animate() {
      curX += (x - curX) * 0.08;
      curY += (y - curY) * 0.08;
      if (el) {
        el.style.transform = `translate(${curX - 220}px, ${curY - 220}px)`;
      }
      raf = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[440px] w-[440px] rounded-full opacity-[0.06] sm:block"
      style={{
        background:
          "radial-gradient(circle, var(--accent-2) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
