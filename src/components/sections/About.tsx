import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <section id="about" className="border-b border-border py-[60px]">
      <Reveal>
        <div className="mb-[30px] flex items-baseline gap-3.5">
          <span className="font-mono text-xs tracking-[0.06em] text-accent">
            {"//"}
          </span>
          <h2 className="text-2xl font-semibold tracking-[-0.01em]">About</h2>
          <div className="h-px flex-1 self-center bg-border" />
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow)]">
          <div className="flex items-center gap-2 border-b border-border bg-code-bg px-[18px] py-2.5 font-mono text-[12.5px] text-ink-soft">
            README.md
          </div>
          <div className="flex flex-col gap-3.5 px-7 py-6">
            <p className="max-w-[62ch] text-[1.02rem] text-ink-soft">
              I&apos;m a Computer Science undergraduate and full-stack
              developer focused on{" "}
              <strong className="text-ink">
                Next.js, TypeScript, React, and Supabase
              </strong>
              , backed by strong DSA fundamentals in C++. I like building
              software that behaves like a living system — realtime chat,
              live matchmaking, instant sync — not just static pages.
            </p>
            <p className="max-w-[62ch] text-[1.02rem] text-ink-soft">
              I&apos;ve shipped{" "}
              <strong className="text-ink">
                three production-oriented applications
              </strong>{" "}
              end to end: authentication, database design, REST APIs, and
              realtime infrastructure (WebSockets, Supabase Realtime).
              I&apos;m currently deepening my systems design and AI/LLM
              engineering skills while looking for a software engineering
              internship where I can contribute to a real team.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
