import Reveal from "@/components/Reveal";
import { links } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="py-[60px] pb-0">
      <Reveal>
        <div className="mb-[30px] flex items-baseline gap-3.5">
          <span className="font-mono text-xs tracking-[0.06em] text-accent">
            {"//"}
          </span>
          <h2 className="text-2xl font-semibold tracking-[-0.01em]">
            Contact
          </h2>
          <div className="h-px flex-1 self-center bg-border" />
        </div>

        <div className="rounded-lg border border-border bg-surface px-8 py-[34px] shadow-[var(--shadow)]">
          <div className="mb-1.5 font-mono text-[13px] text-ink-faint">
            $ contact --alok
          </div>
          <h3 className="mb-[22px] font-[family-name:var(--font-display)] text-[1.6rem] font-semibold tracking-[-0.01em]">
            Let&apos;s connect.
          </h3>
          <div className="flex flex-col gap-3 font-mono text-sm">
            <a
              href={links.emailCompose}
              target="_blank"
              rel="noopener"
              className="flex gap-2.5 text-ink-soft transition-colors hover:text-accent"
            >
              <span className="text-ink-faint">email</span> {links.email}
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noopener"
              className="flex gap-2.5 text-ink-soft transition-colors hover:text-accent"
            >
              <span className="text-ink-faint">github</span>{" "}
              {links.githubLabel}
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener"
              className="flex gap-2.5 text-ink-soft transition-colors hover:text-accent"
            >
              <span className="text-ink-faint">linkedin</span>{" "}
              {links.linkedinLabel}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
