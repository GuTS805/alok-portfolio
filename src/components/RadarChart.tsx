"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type Axis = { label: string; value: number };

const SIZE = 340;
const CENTER = SIZE / 2;
const RADIUS = 88;
const RINGS = [0.25, 0.5, 0.75, 1];

function point(angle: number, r: number) {
  return [
    CENTER + r * Math.cos(angle - Math.PI / 2),
    CENTER + r * Math.sin(angle - Math.PI / 2),
  ];
}

export default function RadarChart({
  axes,
  max,
}: {
  axes: Axis[];
  max: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useSafeReducedMotion();
  const step = (Math.PI * 2) / axes.length;

  const dataPoints = axes.map((a, i) => point(i * step, (a.value / max) * RADIUS));
  const dataPath =
    dataPoints.map(([x, y]) => `${x},${y}`).join(" ") + ` ${dataPoints[0].join(",")}`;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-auto w-full max-w-[300px]"
      role="img"
      aria-label="Radar chart of skill category breadth"
    >
      {RINGS.map((r) => {
        const ringPoints = axes
          .map((_, i) => point(i * step, r * RADIUS).join(","))
          .join(" ");
        return (
          <polygon
            key={r}
            points={ringPoints}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
        );
      })}

      {axes.map((a, i) => {
        const [x, y] = point(i * step, RADIUS);
        return (
          <line
            key={a.label}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth={1}
          />
        );
      })}

      <motion.polygon
        points={dataPath}
        fill="color-mix(in srgb, var(--accent) 16%, transparent)"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={reduced ? undefined : { opacity: 0, scale: 0.7 }}
        animate={
          reduced ? undefined : { opacity: inView ? 1 : 0, scale: inView ? 1 : 0.7 }
        }
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} fill="var(--accent)" />
      ))}

      {axes.map((a, i) => {
        const [x, y] = point(i * step, RADIUS + 28);
        const anchor = Math.abs(x - CENTER) < 4 ? "middle" : x > CENTER ? "start" : "end";
        return (
          <text
            key={a.label}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-ink-faint font-mono text-[10px] uppercase tracking-[0.06em]"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
