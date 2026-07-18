import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="border-b border-border py-[60px]">
      <Reveal>
        <div className="mb-[30px] flex items-baseline gap-3.5">
          <span className="font-mono text-xs tracking-[0.06em] text-accent">
            {"//"}
          </span>
          <h2 className="text-2xl font-semibold tracking-[-0.01em]">
            Projects
          </h2>
          <div className="h-px flex-1 self-center bg-border" />
        </div>
      </Reveal>

      <div className="flex flex-col gap-5">
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
