"use client";

import { useEffect, useRef, useState } from "react";

type Domain = {
  id: string;
  name: string;
  technique: string;
  primary: string;
  secondary: string;
};

const DOMAINS: Domain[] = [
  {
    id: "infinity",
    name: "Gojo Satoru",
    technique: "Infinite Void",
    primary: "79, 216, 255",
    secondary: "139, 124, 246",
  },
  {
    id: "shrine",
    name: "Ryōmen Sukuna",
    technique: "Malevolent Shrine",
    primary: "230, 57, 70",
    secondary: "255, 138, 101",
  },
  {
    id: "shadows",
    name: "Megumi Fushiguro",
    technique: "Ten Shadows",
    primary: "139, 92, 246",
    secondary: "90, 70, 140",
  },
];

const CYCLE_MS = 14000;
const TRANSITION_MS = 1800;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  wander: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpTriplet(a: string, b: string, t: number) {
  const av = a.split(",").map(Number);
  const bv = b.split(",").map(Number);
  return av.map((v, i) => Math.round(lerp(v, bv[i], t))).join(", ");
}

function blendTriplet(base: string, tint: string, amount: number) {
  return lerpTriplet(base, tint, amount);
}

function hexToTriplet(hex: string) {
  const h = hex.trim().replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export default function DomainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [domainIndex, setDomainIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [transitionT, setTransitionT] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let cycleTimeout: ReturnType<typeof setTimeout>;
    let transitionStart = 0;
    let transitionRaf = 0;

    function runTransition() {
      transitionStart = performance.now();
      function step(ts: number) {
        const t = Math.min((ts - transitionStart) / TRANSITION_MS, 1);
        setTransitionT(t);
        if (t < 1) {
          transitionRaf = requestAnimationFrame(step);
        } else {
          setDomainIndex((i) => (i + 1) % DOMAINS.length);
          setNextIndex((i) => (i + 1) % DOMAINS.length);
          setTransitionT(0);
          scheduleCycle();
        }
      }
      transitionRaf = requestAnimationFrame(step);
    }

    function scheduleCycle() {
      cycleTimeout = setTimeout(runTransition, CYCLE_MS);
    }

    scheduleCycle();
    return () => {
      clearTimeout(cycleTimeout);
      cancelAnimationFrame(transitionRaf);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let particles: Particle[] = [];
    let raf = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(70, Math.round((w * h) / 22000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 1.8,
        wander: Math.random() * Math.PI * 2,
      }));
    }

    function draw(current: Domain, next: Domain, t: number, time: number) {
      const primary = lerpTriplet(current.primary, next.primary, t);
      const domainId = t < 0.5 ? current.id : next.id;

      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const baseHex = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg")
        .trim();
      const base = hexToTriplet(baseHex || (isDark ? "#0d0f16" : "#edeff3"));
      const tintAmount = isDark ? 0.16 : 0.1;
      const bgFrom = blendTriplet(base, primary, tintAmount);

      const grad = ctx!.createRadialGradient(
        w * 0.5,
        h * 0.35,
        0,
        w * 0.5,
        h * 0.35,
        Math.max(w, h) * 0.8
      );
      grad.addColorStop(0, `rgb(${bgFrom})`);
      grad.addColorStop(1, `rgb(${base})`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.wander += 0.01;

        if (domainId === "infinity") {
          const cx = w / 2;
          const cy = h / 2;
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const decel = Math.min(dist / 260, 1);
          p.x += (p.vx + (dx / dist) * 0.15) * decel;
          p.y += (p.vy + (dy / dist) * 0.15) * decel;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        } else if (domainId === "shrine") {
          p.x += Math.sin(p.wander) * 0.3;
          p.y += 0.35 + Math.abs(p.vy) * 0.5;
          if (p.y > h) {
            p.y = -10;
            p.x = Math.random() * w;
          }
        } else {
          p.x += p.vx + Math.sin(p.wander * 0.7) * 0.2;
          p.y += p.vy + Math.cos(p.wander * 0.5) * 0.2;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        ctx!.beginPath();
        const radius = domainId === "shadows" ? p.r * 2.4 : p.r;
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${primary}, ${domainId === "shadows" ? 0.35 : 0.55})`;
        ctx!.fill();
      }

      if (domainId === "shrine" && Math.sin(time * 0.0012) > 0.985) {
        ctx!.strokeStyle = `rgba(${primary}, 0.5)`;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        const sx = Math.random() * w;
        const sy = Math.random() * h * 0.4;
        ctx!.moveTo(sx, sy);
        ctx!.lineTo(sx + 160, sy + 220);
        ctx!.stroke();
      }
    }

    function loop(time: number) {
      if (reducedRef.current) {
        draw(DOMAINS[domainIndex], DOMAINS[nextIndex], 0, time);
        return;
      }
      draw(DOMAINS[domainIndex], DOMAINS[nextIndex], transitionT, time);
      raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [domainIndex, nextIndex, transitionT]);

  const active = DOMAINS[domainIndex];

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.4]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-5 left-5 z-30 hidden rounded border border-border bg-surface/80 px-3 py-2 font-mono text-[10.5px] text-ink-faint backdrop-blur-sm sm:block"
      >
        <div className="mb-0.5 uppercase tracking-[0.08em] text-accent">
          domain expansion
        </div>
        <div className="text-ink-soft">{active.technique}</div>
        <div className="text-ink-faint">{active.name}</div>
      </div>
    </>
  );
}
