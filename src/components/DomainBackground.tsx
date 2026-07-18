"use client";

import { useEffect, useRef, useState } from "react";

type DomainId = "void" | "shrine" | "shadows";

type Domain = {
  id: DomainId;
  name: string;
  technique: string;
  primary: string;
  secondary: string;
};

const DOMAINS: Domain[] = [
  {
    id: "void",
    name: "Gojo Satoru",
    technique: "Unlimited Void",
    primary: "110, 200, 255",
    secondary: "170, 130, 255",
  },
  {
    id: "shrine",
    name: "Ryōmen Sukuna",
    technique: "Malevolent Shrine",
    primary: "255, 106, 61",
    secondary: "255, 200, 90",
  },
  {
    id: "shadows",
    name: "Megumi Fushiguro",
    technique: "Ten Shadows — Mahoraga",
    primary: "150, 110, 255",
    secondary: "70, 50, 120",
  },
];

const CYCLE_MS = 17000;
const TRANSITION_MS = 2200;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpTriplet(a: string, b: string, t: number) {
  const av = a.split(",").map(Number);
  const bv = b.split(",").map(Number);
  return av.map((v, i) => Math.round(lerp(v, bv[i], t))).join(", ");
}

function hexToTriplet(hex: string) {
  const h = hex.trim().replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

type GalaxyPoint = { angle: number; radius: number; speed: number; size: number };
type Ember = { x: number; y: number; vy: number; drift: number; life: number; maxLife: number; size: number };
type Petal = { x: number; y: number; vy: number; sway: number; rot: number };
type ShadowBlob = { angle: number; radius: number; speed: number; size: number; bob: number };

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
    let raf = 0;

    let galaxy: GalaxyPoint[] = [];
    let embers: Ember[] = [];
    let petals: Petal[] = [];
    let blobs: ShadowBlob[] = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scale = Math.sqrt((w * h) / (1280 * 800));

      galaxy = Array.from({ length: Math.round(140 * scale) }, (_, i) => ({
        angle: (i / 140) * Math.PI * 2 * 7 + Math.random() * 0.3,
        radius: Math.sqrt(i / 140) * Math.min(w, h) * 0.46,
        speed: 0.00025 + Math.random() * 0.00015,
        size: 0.6 + Math.random() * 1.6,
      }));

      embers = Array.from({ length: Math.round(70 * scale) }, () => ({
        x: Math.random() * w,
        y: h + Math.random() * h,
        vy: 0.4 + Math.random() * 0.9,
        drift: Math.random() * Math.PI * 2,
        life: Math.random(),
        maxLife: 0.6 + Math.random() * 0.4,
        size: 1 + Math.random() * 2.4,
      }));

      petals = Array.from({ length: Math.round(18 * scale) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: 0.3 + Math.random() * 0.4,
        sway: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
      }));

      blobs = Array.from({ length: Math.round(16 * scale) }, (_, i) => ({
        angle: (i / 16) * Math.PI * 2,
        radius: Math.min(w, h) * (0.15 + Math.random() * 0.28),
        speed: 0.00018 + Math.random() * 0.00022 * (Math.random() < 0.5 ? -1 : 1),
        size: 10 + Math.random() * 26,
        bob: Math.random() * Math.PI * 2,
      }));
    }

    function themeBase() {
      const isDark =
        document.documentElement.getAttribute("data-theme") !== "light";
      const baseHex = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg")
        .trim();
      return {
        isDark,
        base: hexToTriplet(baseHex || (isDark ? "#0d0f16" : "#edeff3")),
      };
    }

    function drawVignette(base: string, strength: number) {
      const cy = h * 0.4;
      const grad = ctx!.createRadialGradient(
        w * 0.5,
        cy,
        0,
        w * 0.5,
        cy,
        Math.max(w * 0.45, 420)
      );
      grad.addColorStop(0, `rgba(${base}, ${strength})`);
      grad.addColorStop(1, `rgba(${base}, 0)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
    }

    function drawVoid(time: number, primary: string, secondary: string, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      const cx = w * 0.5;
      const cy = h * 0.42;

      for (let ring = 1; ring <= 3; ring++) {
        const rt = ((time * 0.00006) + ring / 3) % 1;
        const r = rt * Math.min(w, h) * 0.55;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${primary}, ${(1 - rt) * 0.22})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      for (const p of galaxy) {
        const a = p.angle + time * p.speed;
        const x = cx + Math.cos(a) * p.radius;
        const y = cy + Math.sin(a) * p.radius * 0.72;
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.0015 + p.angle * 3));
        ctx!.beginPath();
        ctx!.arc(x, y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.size > 1.6 ? secondary : primary}, ${0.55 * twinkle})`;
        ctx!.fill();
      }

      const core = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 70);
      core.addColorStop(0, `rgba(${primary}, 0.35)`);
      core.addColorStop(1, `rgba(${primary}, 0)`);
      ctx!.fillStyle = core;
      ctx!.fillRect(cx - 70, cy - 70, 140, 140);
      ctx!.restore();
    }

    function drawShrine(time: number, primary: string, secondary: string, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;

      const glow = ctx!.createRadialGradient(
        w * 0.5,
        h,
        0,
        w * 0.5,
        h,
        h * 0.75
      );
      glow.addColorStop(0, `rgba(${primary}, 0.28)`);
      glow.addColorStop(1, `rgba(${primary}, 0)`);
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, w, h);

      for (const e of embers) {
        e.y -= e.vy;
        e.x += Math.sin(e.drift + e.y * 0.01) * 0.6;
        e.life += 0.004;
        if (e.y < -20 || e.life > e.maxLife) {
          e.y = h + 10;
          e.x = Math.random() * w;
          e.life = 0;
        }
        const fade = Math.sin((e.life / e.maxLife) * Math.PI);
        ctx!.beginPath();
        ctx!.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${e.size > 2 ? secondary : primary}, ${0.7 * fade})`;
        ctx!.fill();
      }

      for (const p of petals) {
        p.y += p.vy;
        p.x += Math.sin(p.sway) * 0.4;
        p.sway += 0.02;
        p.rot += 0.01;
        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.fillStyle = `rgba(${secondary}, 0.45)`;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, 4.5, 2.2, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      const flashPhase = Math.sin(time * 0.0009);
      if (flashPhase > 0.965) {
        const sx = w * (0.15 + Math.random() * 0.6);
        const sy = h * (0.1 + Math.random() * 0.3);
        ctx!.strokeStyle = `rgba(${secondary}, 0.55)`;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(sx, sy);
        ctx!.lineTo(sx + 180, sy + 260);
        ctx!.stroke();
        ctx!.strokeStyle = `rgba(${primary}, 0.35)`;
        ctx!.lineWidth = 5;
        ctx!.beginPath();
        ctx!.moveTo(sx, sy);
        ctx!.lineTo(sx + 180, sy + 260);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawShadows(time: number, primary: string, secondary: string, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      const cx = w * 0.5;
      const cy = h * 0.42;
      const wheelR = Math.min(w, h) * 0.24;
      const rot = time * 0.00018;

      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(rot);
      ctx!.strokeStyle = `rgba(${primary}, 0.4)`;
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.arc(0, 0, wheelR, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(0, 0, wheelR * 0.7, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${primary}, 0.22)`;
      ctx!.stroke();

      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx!.beginPath();
        ctx!.moveTo(Math.cos(a) * wheelR * 0.15, Math.sin(a) * wheelR * 0.15);
        ctx!.lineTo(Math.cos(a) * wheelR, Math.sin(a) * wheelR);
        ctx!.strokeStyle = `rgba(${primary}, 0.3)`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(Math.cos(a) * wheelR, Math.sin(a) * wheelR, 5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${secondary}, 0.5)`;
        ctx!.fill();
      }
      ctx!.restore();

      const core = ctx!.createRadialGradient(cx, cy, 0, cx, cy, wheelR * 0.6);
      core.addColorStop(0, `rgba(${primary}, 0.18)`);
      core.addColorStop(1, `rgba(${primary}, 0)`);
      ctx!.fillStyle = core;
      ctx!.fillRect(cx - wheelR, cy - wheelR, wheelR * 2, wheelR * 2);

      for (const b of blobs) {
        const a = b.angle + time * b.speed;
        const bob = Math.sin(time * 0.0006 + b.bob) * 18;
        const x = cx + Math.cos(a) * b.radius;
        const y = cy + Math.sin(a) * b.radius * 0.6 + bob;
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, b.size);
        grad.addColorStop(0, `rgba(${secondary}, 0.4)`);
        grad.addColorStop(1, `rgba(${secondary}, 0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(x, y, b.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawDomain(id: DomainId, time: number, primary: string, secondary: string, alpha: number) {
      if (alpha <= 0.01) return;
      if (id === "void") drawVoid(time, primary, secondary, alpha);
      else if (id === "shrine") drawShrine(time, primary, secondary, alpha);
      else drawShadows(time, primary, secondary, alpha);
    }

    function frame(time: number) {
      const current = DOMAINS[domainIndex];
      const next = DOMAINS[nextIndex];
      const t = reducedRef.current ? 0 : transitionT;

      const { isDark, base } = themeBase();
      const blendedPrimary = lerpTriplet(current.primary, next.primary, t);
      const tintAmount = isDark ? 0.1 : 0.06;
      const bgTint = lerpTriplet(base, blendedPrimary, tintAmount);

      const grad = ctx!.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `rgb(${bgTint})`);
      grad.addColorStop(1, `rgb(${base})`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      drawDomain(current.id, time, current.primary, current.secondary, 1 - t);
      if (t > 0) drawDomain(next.id, time, next.primary, next.secondary, t);

      drawVignette(base, isDark ? 0.55 : 0.75);

      if (!reducedRef.current) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

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
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
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
