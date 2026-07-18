"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ProjectSparkline from "./ProjectSparkline";

type Project = {
  name: string;
  tagline: string;
  stack: string[];
  points: string[];
};

function seedFromName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return h;
}

export default function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    mx.set(px);
    my.set(py);
    rotateX.set((py / 100 - 0.5) * -4);
    rotateY.set((px / 100 - 0.5) * 4);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const glow = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(240px circle at ${x}% ${y}%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      className="group relative rounded-lg border border-border bg-surface p-7 pb-8 shadow-[var(--shadow)] transition-colors duration-200 hover:border-border-strong"
    >
      <motion.div
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative mb-1.5 flex flex-wrap items-start justify-between gap-4">
        <h3 className="text-[1.28rem] font-semibold tracking-[-0.01em]">
          {project.name}
        </h3>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-accent-2/35 bg-accent-2/12 px-2.5 py-1 font-mono text-[11.5px] text-accent-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          live
        </span>
      </div>
      <div className="relative mb-4 flex items-center justify-between gap-4">
        <p className="text-[13.5px] text-ink-faint">{project.tagline}</p>
        <ProjectSparkline seed={seedFromName(project.name)} />
      </div>
      <div className="relative mb-[18px] flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded border border-border bg-bg-alt px-2.5 py-1 text-[12.5px] text-ink-soft"
          >
            {s}
          </span>
        ))}
      </div>
      <ul className="relative flex flex-col gap-2.5">
        {project.points.map((p) => (
          <li
            key={p}
            className="relative max-w-[68ch] pl-5 text-[14.5px] text-ink-soft before:absolute before:left-0 before:font-bold before:text-accent before:content-['›']"
          >
            {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
