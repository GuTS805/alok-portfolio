import NetworkCanvas from "@/components/NetworkCanvas";
import TypedConsole from "@/components/TypedConsole";
import StatStrip from "@/components/StatStrip";
import { links } from "@/lib/data";

export default function Hero() {
  return (
    <section className="hero-shell relative overflow-hidden py-[76px]">
      <NetworkCanvas />
      <div className="relative z-[1]">
        <TypedConsole />

        <h1 className="mb-3.5 font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-balance">
          Alok Srivastava
        </h1>

        <p className="mb-6 max-w-[58ch] text-[clamp(1rem,2.2vw,1.2rem)] text-ink-soft text-balance">
          Full-stack web developer and CS undergraduate who ships{" "}
          <strong className="font-semibold text-ink">
            realtime, production-oriented
          </strong>{" "}
          software — from live coding battles to hyperlocal social feeds —
          with Next.js, TypeScript, and Supabase.
        </p>

        <div className="mb-8 flex flex-wrap gap-2.5">
          <span className="rounded border border-border-strong bg-surface px-2.5 py-1.5 font-mono text-[12.5px] text-ink-soft">
            B.Tech CSE · ABES Engineering College
          </span>
          <span className="rounded border border-border-strong bg-surface px-2.5 py-1.5 font-mono text-[12.5px] text-ink-soft">
            Expected 2028
          </span>
          <span className="rounded border border-border-strong bg-surface px-2.5 py-1.5 font-mono text-[12.5px] text-ink-soft">
            Seeking SWE Internship
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={links.emailCompose}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded bg-accent px-5 py-[11px] text-sm font-semibold text-accent-ink transition-transform duration-150 hover:-translate-y-px"
          >
            Email me
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded border border-border-strong px-5 py-[11px] text-sm font-semibold transition-colors duration-150 hover:border-accent hover:text-accent"
          >
            GitHub ↗
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded border border-border-strong px-5 py-[11px] text-sm font-semibold transition-colors duration-150 hover:border-accent hover:text-accent"
          >
            LinkedIn ↗
          </a>
        </div>

        <StatStrip />
      </div>
    </section>
  );
}
