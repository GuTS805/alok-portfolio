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
              I&apos;m Alok Srivastava, a Computer Science undergraduate
              passionate about building modern, user-focused web
              applications. I enjoy transforming ideas into scalable,
              real-world products using technologies like{" "}
              <strong className="text-ink">
                Next.js, React, TypeScript, Node.js, and MongoDB
              </strong>
              .
            </p>
            <p className="max-w-[62ch] text-[1.02rem] text-ink-soft">
              I&apos;m currently strengthening my problem-solving skills
              through Data Structures &amp; Algorithms while continuously
              exploring full-stack development, real-time systems, and
              AI-powered applications. I enjoy tackling challenging projects
              that push me to learn new technologies and improve my
              engineering skills.
            </p>
            <p className="max-w-[62ch] text-[1.02rem] text-ink-soft">
              My goal is to grow into a software engineer who builds
              impactful, high-quality products with clean code, intuitive
              user experiences, and scalable architecture.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
