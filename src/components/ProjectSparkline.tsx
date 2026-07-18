"use client";

import { useEffect, useRef } from "react";

export default function ProjectSparkline({ seed = 1 }: { seed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const points = 40;
    let phase = seed * 12.3;
    let raf = 0;

    function draw() {
      if (!ctx) return;
      const styles = getComputedStyle(document.documentElement);
      const color = styles.getPropertyValue("--accent-2").trim() || "#34D6C1";

      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const n =
          Math.sin(i * 0.55 + phase) * 0.35 +
          Math.sin(i * 0.19 + phase * 1.7) * 0.25 +
          Math.sin(i * 0.9 + phase * 0.4) * 0.15;
        const y = h / 2 - n * (h / 2 - 3);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.8;
      ctx.stroke();

      phase += 0.045;
      if (!reduced) raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-6 w-16 opacity-70"
    />
  );
}
