import Reveal from "@/components/Reveal";
import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="border-b border-border py-[60px]">
      <Reveal>
        <div className="mb-[30px] flex items-baseline gap-3.5">
          <span className="font-mono text-xs tracking-[0.06em] text-accent">
            {"//"}
          </span>
          <h2 className="text-2xl font-semibold tracking-[-0.01em]">Stack</h2>
          <div className="h-px flex-1 self-center bg-border" />
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.label} className="bg-surface px-[22px] py-[18px]">
              <div className="mb-2.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-[7px]">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded border border-border bg-code-bg px-2.5 py-1 text-[12.5px] text-ink-soft"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
