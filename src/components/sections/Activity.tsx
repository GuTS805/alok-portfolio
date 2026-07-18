import Reveal from "@/components/Reveal";
import LanguageBars from "@/components/LanguageBars";
import { getLanguageStats } from "@/lib/github";
import { links } from "@/lib/data";

export default async function Activity() {
  const stats = await getLanguageStats();

  return (
    <section id="activity" className="border-b border-border py-[60px]">
      <Reveal>
        <div className="mb-[30px] flex items-baseline gap-3.5">
          <span className="font-mono text-xs tracking-[0.06em] text-accent">
            {"//"}
          </span>
          <h2 className="text-2xl font-semibold tracking-[-0.01em]">
            Activity
          </h2>
          <div className="h-px flex-1 self-center bg-border" />
        </div>

        <div className="rounded-lg border border-border bg-surface px-7 py-6 shadow-[var(--shadow)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[12.5px] text-ink-faint">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
              live from github.com/{links.githubLabel.split("/")[1]}
            </div>
            <span className="font-mono text-[11.5px] uppercase tracking-[0.07em] text-ink-faint">
              by bytes written
            </span>
          </div>
          <LanguageBars data={stats} />
        </div>
      </Reveal>
    </section>
  );
}
