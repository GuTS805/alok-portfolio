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
    secondary: "190, 150, 255",
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
    secondary: "255, 205, 110",
  },
];

const CYCLE_MS = 18000;
const TRANSITION_MS = 2200;
const WHEEL_CYCLE_MS = 5200;

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

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

type GalaxyPoint = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  depth: number;
};
type Ember = {
  x: number;
  y: number;
  vy: number;
  drift: number;
  life: number;
  maxLife: number;
  size: number;
};
type Petal = { x: number; y: number; vy: number; sway: number; rot: number };
type Dog = {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  facing: number;
  walk: number;
  state: "wander" | "hunt";
};
type Wisp = { angle: number; radius: number; speed: number; size: number; bob: number };

export default function DomainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [domainIndex, setDomainIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [transitionT, setTransitionT] = useState(0);
  const reducedRef = useRef(false);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false, vx: 0, vy: 0 });

  useEffect(() => {
    let lastX = -9999;
    let lastY = -9999;
    function onMove(e: MouseEvent) {
      const m = mouseRef.current;
      m.vx = e.clientX - (lastX === -9999 ? e.clientX : lastX);
      m.vy = e.clientY - (lastY === -9999 ? e.clientY : lastY);
      lastX = e.clientX;
      lastY = e.clientY;
      m.x = e.clientX;
      m.y = e.clientY;
      m.active = true;
    }
    function onLeave() {
      mouseRef.current.active = false;
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

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
    let dogs: Dog[] = [];
    let wisps: Wisp[] = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scale = Math.sqrt((w * h) / (1280 * 800));

      galaxy = Array.from({ length: Math.round(170 * scale) }, (_, i) => {
        const depth = Math.random();
        return {
          angle: (i / 170) * Math.PI * 2 * 8 + Math.random() * 0.3,
          radius: Math.sqrt(i / 170) * Math.min(w, h) * 0.48,
          speed: (0.00018 + depth * 0.00035) * (Math.random() < 0.5 ? 1 : 1),
          size: 0.5 + depth * 1.8,
          depth,
        };
      });

      embers = Array.from({ length: Math.round(80 * scale) }, () => ({
        x: Math.random() * w,
        y: h + Math.random() * h,
        vy: 0.5 + Math.random() * 1.1,
        drift: Math.random() * Math.PI * 2,
        life: Math.random(),
        maxLife: 0.6 + Math.random() * 0.4,
        size: 1 + Math.random() * 2.6,
      }));

      petals = Array.from({ length: Math.round(16 * scale) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: 0.3 + Math.random() * 0.4,
        sway: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
      }));

      dogs = Array.from({ length: 2 }, (_, i) => ({
        x: w * (0.2 + i * 0.55),
        y: h * 0.93 + i * 20,
        baseY: h * 0.93 + i * 20,
        vx: i === 0 ? 0.55 : -0.55,
        facing: i === 0 ? 1 : -1,
        walk: Math.random() * Math.PI * 2,
        state: "wander" as const,
      }));

      wisps = Array.from({ length: Math.round(10 * scale) }, (_, i) => ({
        angle: (i / 10) * Math.PI * 2,
        radius: Math.min(w, h) * (0.2 + Math.random() * 0.26),
        speed: 0.00015 + Math.random() * 0.0002 * (Math.random() < 0.5 ? -1 : 1),
        size: 14 + Math.random() * 30,
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

    // ---------------- Unlimited Void ----------------
    function drawVoid(time: number, primary: string, secondary: string, alpha: number) {
      const ctx2 = ctx!;
      ctx2.save();
      ctx2.globalAlpha = alpha;
      const cx = w * 0.5;
      const cy = h * 0.42;
      const mouse = mouseRef.current;
      const mdx = mouse.active ? mouse.x - cx : 0;
      const mdy = mouse.active ? mouse.y - cy : 0;

      for (let ring = 1; ring <= 4; ring++) {
        const rt = ((time * 0.00005) + ring / 4) % 1;
        const r = rt * Math.min(w, h) * 0.55;
        ctx2.beginPath();
        ctx2.arc(cx, cy, r, 0, Math.PI * 2);
        ctx2.strokeStyle = `rgba(${primary}, ${(1 - rt) * 0.2})`;
        ctx2.lineWidth = 1;
        ctx2.stroke();
      }

      ctx2.globalCompositeOperation = "lighter";
      for (const p of galaxy) {
        const a = p.angle + time * p.speed;
        let x = cx + Math.cos(a) * p.radius;
        let y = cy + Math.sin(a) * p.radius * 0.72;

        if (mouse.active) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 240) {
            const pull = ((240 - dist) / 240) * 14 * p.depth;
            x += (dx / dist) * pull;
            y += (dy / dist) * pull;
          }
        }

        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.0015 + p.angle * 3));
        const r = p.size * (0.7 + p.depth * 0.8);
        const glow = ctx2.createRadialGradient(x, y, 0, x, y, r * 3);
        const color = p.depth > 0.6 ? secondary : primary;
        glow.addColorStop(0, `rgba(${color}, ${0.75 * twinkle})`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx2.fillStyle = glow;
        ctx2.beginPath();
        ctx2.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx2.fill();
      }

      const coreShift = mouse.active ? { x: mdx * 0.04, y: mdy * 0.04 } : { x: 0, y: 0 };
      const core = ctx2.createRadialGradient(
        cx + coreShift.x,
        cy + coreShift.y,
        0,
        cx + coreShift.x,
        cy + coreShift.y,
        90
      );
      core.addColorStop(0, `rgba(${primary}, 0.45)`);
      core.addColorStop(0.5, `rgba(${secondary}, 0.15)`);
      core.addColorStop(1, `rgba(${primary}, 0)`);
      ctx2.fillStyle = core;
      ctx2.fillRect(cx - 100 + coreShift.x, cy - 100 + coreShift.y, 200, 200);
      ctx2.globalCompositeOperation = "source-over";
      ctx2.restore();
    }

    // ---------------- Malevolent Shrine ----------------
    function drawShrine(time: number, primary: string, secondary: string, alpha: number) {
      const ctx2 = ctx!;
      ctx2.save();
      ctx2.globalAlpha = alpha;

      const glow = ctx2.createRadialGradient(w * 0.5, h, 0, w * 0.5, h, h * 0.8);
      glow.addColorStop(0, `rgba(${primary}, 0.3)`);
      glow.addColorStop(1, `rgba(${primary}, 0)`);
      ctx2.fillStyle = glow;
      ctx2.fillRect(0, 0, w, h);

      const mouse = mouseRef.current;

      ctx2.globalCompositeOperation = "lighter";
      for (const e of embers) {
        e.y -= e.vy;
        e.x += Math.sin(e.drift + e.y * 0.012) * 0.7;

        if (mouse.active) {
          const dx = e.x - mouse.x;
          const dy = e.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 130) {
            const push = ((130 - dist) / 130) * 2.6;
            e.x += (dx / dist) * push;
            e.y += (dy / dist) * push * 0.6;
          }
        }

        e.life += 0.0045;
        if (e.y < -20 || e.life > e.maxLife) {
          e.y = h + 10;
          e.x = Math.random() * w;
          e.life = 0;
        }
        const fade = Math.sin((e.life / e.maxLife) * Math.PI);
        const color = e.size > 2 ? secondary : primary;
        const glowR = e.size * 2.6;
        const eg = ctx2.createRadialGradient(e.x, e.y, 0, e.x, e.y, glowR);
        eg.addColorStop(0, `rgba(${color}, ${0.85 * fade})`);
        eg.addColorStop(1, `rgba(${color}, 0)`);
        ctx2.fillStyle = eg;
        ctx2.beginPath();
        ctx2.arc(e.x, e.y, glowR, 0, Math.PI * 2);
        ctx2.fill();
      }
      ctx2.globalCompositeOperation = "source-over";

      for (const p of petals) {
        p.y += p.vy;
        p.x += Math.sin(p.sway) * 0.4;
        p.sway += 0.02;
        p.rot += 0.01;
        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        ctx2.save();
        ctx2.translate(p.x, p.y);
        ctx2.rotate(p.rot);
        ctx2.fillStyle = `rgba(${secondary}, 0.45)`;
        ctx2.beginPath();
        ctx2.ellipse(0, 0, 4.5, 2.2, 0, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.restore();
      }

      const flashPhase = Math.sin(time * 0.0009);
      if (flashPhase > 0.96) {
        const seedT = Math.floor(time / 1100);
        const rand = Math.abs(Math.sin(seedT * 12.9898)) % 1;
        const sx = w * (0.15 + rand * 0.6);
        const sy = h * (0.08 + ((rand * 7) % 1) * 0.28);
        ctx2.strokeStyle = `rgba(255, 255, 255, 0.85)`;
        ctx2.lineWidth = 2;
        ctx2.beginPath();
        ctx2.moveTo(sx, sy);
        ctx2.lineTo(sx + 190, sy + 270);
        ctx2.stroke();
        ctx2.strokeStyle = `rgba(${secondary}, 0.55)`;
        ctx2.lineWidth = 6;
        ctx2.beginPath();
        ctx2.moveTo(sx, sy);
        ctx2.lineTo(sx + 190, sy + 270);
        ctx2.stroke();
      }
      ctx2.restore();
    }

    // ---------------- Ten Shadows / Mahoraga ----------------
    function drawDog(dog: Dog, primary: string) {
      const ctx2 = ctx!;
      ctx2.save();
      ctx2.translate(dog.x, dog.y);
      ctx2.scale(dog.facing * 1.9, 1.9);

      const eyeGlow = dog.state === "hunt" ? 1 : 0.45;

      // ground contact shadow
      ctx2.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx2.beginPath();
      ctx2.ellipse(0, 14, 26, 5, 0, 0, Math.PI * 2);
      ctx2.fill();

      // violet rim glow behind the silhouette
      ctx2.globalCompositeOperation = "lighter";
      ctx2.fillStyle = `rgba(${primary}, ${dog.state === "hunt" ? 0.3 : 0.16})`;
      ctx2.beginPath();
      ctx2.ellipse(1, -1, 30, 16, 0, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.globalCompositeOperation = "source-over";

      ctx2.fillStyle = "rgba(4, 4, 9, 0.96)";
      ctx2.strokeStyle = "rgba(4, 4, 9, 0.96)";
      ctx2.lineCap = "round";

      // legs
      for (let i = 0; i < 4; i++) {
        const lx = -13 + i * 9;
        const swing = Math.sin(dog.walk + i * (Math.PI / 2)) * 7;
        ctx2.beginPath();
        ctx2.moveTo(lx, 6);
        ctx2.lineTo(lx + swing * 0.4, 20);
        ctx2.lineWidth = 3.5;
        ctx2.stroke();
      }

      // tail
      ctx2.beginPath();
      ctx2.moveTo(-18, -1);
      ctx2.quadraticCurveTo(-32, -10 + Math.sin(dog.walk) * 5, -28, -22);
      ctx2.lineWidth = 4;
      ctx2.stroke();

      // body
      ctx2.beginPath();
      ctx2.ellipse(0, 0, 22, 9, 0, 0, Math.PI * 2);
      ctx2.fill();

      // neck/head
      ctx2.beginPath();
      ctx2.ellipse(22, -7, 10, 6.5, -0.35, 0, Math.PI * 2);
      ctx2.fill();

      // ears
      ctx2.beginPath();
      ctx2.moveTo(27, -13);
      ctx2.lineTo(32, -22);
      ctx2.lineTo(23, -15);
      ctx2.closePath();
      ctx2.fill();

      // glowing eye
      ctx2.globalCompositeOperation = "lighter";
      const eg = ctx2.createRadialGradient(27, -9, 0, 27, -9, 5);
      eg.addColorStop(0, `rgba(${primary}, ${0.9 * eyeGlow})`);
      eg.addColorStop(1, `rgba(${primary}, 0)`);
      ctx2.fillStyle = eg;
      ctx2.beginPath();
      ctx2.arc(27, -9, 5, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.globalCompositeOperation = "source-over";

      ctx2.restore();
    }

    function drawWheel(
      time: number,
      cx: number,
      cy: number,
      primary: string,
      alpha: number
    ) {
      const ctx2 = ctx!;
      const R = Math.min(w, h) * (w > 760 ? 0.15 : 0.12);
      const cyclePos = (time % WHEEL_CYCLE_MS) / WHEEL_CYCLE_MS;
      let burst = 0;
      let flash = 0;
      if (cyclePos > 0.68) {
        const p = clamp((cyclePos - 0.68) / 0.24, 0, 1);
        burst = p * p * Math.PI * 5.5;
        if (cyclePos > 0.9) {
          flash = 1 - clamp((cyclePos - 0.9) / 0.1, 0, 1);
        }
      }

      const mouse = mouseRef.current;
      const tilt = mouse.active ? clamp((mouse.x - cx) / (w * 0.5), -1, 1) : 0;
      const rot = time * 0.00011 + burst;

      const gold = `rgba(${primary}, ${(0.6 + flash * 0.35) * alpha})`;
      const goldDim = `rgba(${primary}, ${0.28 * alpha})`;

      ctx2.save();
      ctx2.translate(cx, cy);
      ctx2.scale(1, 0.8 + tilt * 0.05);
      ctx2.rotate(rot);

      ctx2.lineWidth = 3.5;
      ctx2.strokeStyle = gold;
      ctx2.beginPath();
      ctx2.arc(0, 0, R, 0, Math.PI * 2);
      ctx2.stroke();

      ctx2.lineWidth = 1.2;
      ctx2.strokeStyle = goldDim;
      ctx2.beginPath();
      ctx2.arc(0, 0, R * 0.82, 0, Math.PI * 2);
      ctx2.stroke();
      ctx2.beginPath();
      ctx2.arc(0, 0, R * 0.28, 0, Math.PI * 2);
      ctx2.stroke();

      const spokes = 8;
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2;
        const x1 = Math.cos(a) * R * 0.28;
        const y1 = Math.sin(a) * R * 0.28;
        const x2 = Math.cos(a) * R * 0.82;
        const y2 = Math.sin(a) * R * 0.82;

        ctx2.beginPath();
        ctx2.moveTo(x1, y1);
        ctx2.lineTo(x2, y2);
        ctx2.lineWidth = 2.2;
        ctx2.strokeStyle = gold;
        ctx2.stroke();

        ctx2.save();
        ctx2.translate(Math.cos(a) * R, Math.sin(a) * R);
        ctx2.rotate(a + Math.PI / 2);
        ctx2.beginPath();
        ctx2.moveTo(0, -10);
        ctx2.lineTo(5.5, 5);
        ctx2.lineTo(0, 2);
        ctx2.lineTo(-5.5, 5);
        ctx2.closePath();
        ctx2.fillStyle = gold;
        ctx2.fill();
        ctx2.restore();

        ctx2.beginPath();
        ctx2.arc((x1 + x2) / 2, (y1 + y2) / 2, 2.6, 0, Math.PI * 2);
        ctx2.fillStyle = gold;
        ctx2.fill();
      }

      ctx2.globalCompositeOperation = "lighter";
      const hub = ctx2.createRadialGradient(0, 0, 0, 0, 0, R * 0.32);
      hub.addColorStop(0, `rgba(${primary}, ${(0.55 + flash * 0.45) * alpha})`);
      hub.addColorStop(1, `rgba(${primary}, 0)`);
      ctx2.fillStyle = hub;
      ctx2.beginPath();
      ctx2.arc(0, 0, R * 0.32, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.globalCompositeOperation = "source-over";

      ctx2.restore();

      if (flash > 0.05) {
        ctx2.save();
        ctx2.globalAlpha = flash * 0.4 * alpha;
        ctx2.fillStyle = `rgba(${primary}, 1)`;
        ctx2.beginPath();
        ctx2.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.restore();
      }
    }

    function drawShadows(
      time: number,
      primary: string,
      secondary: string,
      alpha: number
    ) {
      const ctx2 = ctx!;
      ctx2.save();
      ctx2.globalAlpha = alpha;
      const cx = w > 760 ? w - Math.min(w, h) * 0.26 : w * 0.98;
      const cy = w > 760 ? h * 0.24 : h * 0.1;
      const mouse = mouseRef.current;

      for (const wp of wisps) {
        const a = wp.angle + time * wp.speed;
        const bob = Math.sin(time * 0.0006 + wp.bob) * 18;
        const x = cx + Math.cos(a) * wp.radius;
        const y = cy + Math.sin(a) * wp.radius * 0.6 + bob;
        const grad = ctx2.createRadialGradient(x, y, 0, x, y, wp.size);
        grad.addColorStop(0, `rgba(60, 40, 90, 0.4)`);
        grad.addColorStop(1, `rgba(60, 40, 90, 0)`);
        ctx2.fillStyle = grad;
        ctx2.beginPath();
        ctx2.arc(x, y, wp.size, 0, Math.PI * 2);
        ctx2.fill();
      }

      drawWheel(time, cx, cy, secondary, 1);

      for (const dog of dogs) {
        const dx = mouse.active ? mouse.x - dog.x : 0;
        const dy = mouse.active ? mouse.y - dog.y : 0;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.active && dist < 320 && mouse.y > h * 0.5) {
          dog.state = "hunt";
          dog.facing = dx > 0 ? 1 : -1;
          dog.x += Math.sign(dx) * 1.1;
          dog.y += clamp(dy, -1, 1) * 0.4;
        } else {
          dog.state = "wander";
          dog.x += dog.vx;
          dog.y = dog.baseY + Math.sin(time * 0.0008 + dog.x * 0.01) * 6;
          if (dog.x < w * 0.08 || dog.x > w * 0.92) dog.vx *= -1;
          dog.facing = dog.vx > 0 ? 1 : -1;
        }
        dog.walk += dog.state === "hunt" ? 0.35 : 0.18;
        drawDog(dog, primary);
      }

      ctx2.restore();
    }

    function drawDomain(
      id: DomainId,
      time: number,
      primary: string,
      secondary: string,
      alpha: number
    ) {
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

      drawVignette(base, isDark ? 0.5 : 0.72);

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
