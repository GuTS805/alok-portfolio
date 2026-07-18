import Reveal from "@/components/Reveal";
import RadarChart from "@/components/RadarChart";
import { skillGroups } from "@/lib/data";

const radarAxes = [
  { label: "Languages", value: 6 },
  { label: "Frontend", value: 6 },
  { label: "Backend", value: 4 },
  { label: "Databases", value: 4 },
  { label: "Auth/Tools", value: 7 },
  { label: "AI & APIs", value: 3 },
];

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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col justify-center rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow)]">
            <RadarChart axes={radarAxes} max={7} />
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.07em] text-ink-faint">
              tools per category
            </p>
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
        </div>
      </Reveal>
    </section>
  );
}
