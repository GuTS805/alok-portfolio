import Reveal from "@/components/Reveal";

const entries = [
  <>
    Built and shipped{" "}
    <strong className="text-ink">
      3 full-stack production-oriented applications
    </strong>{" "}
    using modern JavaScript/TypeScript stacks.
  </>,
  <>
    Hands-on with <strong className="text-ink">realtime systems</strong>{" "}
    (WebSockets, Supabase Realtime), authentication, REST APIs, and database
    design.
  </>,
  <>
    Continuously strengthening problem-solving through{" "}
    <strong className="text-ink">Data Structures &amp; Algorithms in C++</strong>,
    alongside System Design and AI/LLM Engineering.
  </>,
];

export default function Achievements() {
  return (
    <section id="achievements" className="border-b border-border py-[60px]">
      <Reveal>
        <div className="mb-[30px] flex items-baseline gap-3.5">
          <span className="font-mono text-xs tracking-[0.06em] text-accent">
            {"//"}
          </span>
          <h2 className="text-2xl font-semibold tracking-[-0.01em]">Log</h2>
          <div className="h-px flex-1 self-center bg-border" />
        </div>

        <div className="flex flex-col">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-4 border-t border-border py-[18px] last:pb-0"
            >
              <span className="pt-0.5 font-mono text-[13px] text-accent">
                &gt;
              </span>
              <p className="max-w-[64ch] text-[15px] text-ink-soft">{entry}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
