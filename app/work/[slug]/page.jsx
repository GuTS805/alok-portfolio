import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../data/projects";
import { site } from "../../data/site";
import { BotvueDemo, Navbar } from "../../components/experience";
import {
  ExternalLink,
  Footer,
  ProjectImage,
  ProjectLinks,
  TechTags,
} from "../../components/shared";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `${site.url}/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | Alok Srivastava`,
      description: project.description,
      url: `${site.url}/work/${project.slug}`,
      images: ["/social-preview.png"],
    },
  };
}
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <Navbar />
      <main id="main" className="case-study">
        <div className="wrap" id="top">
          <Link className="case-back text-link" href="/#work">
            ← ALL SELECTED WORK
          </Link>
          <header className="case-header">
            <p className="eyebrow section-index">
              01 / OVERVIEW — {project.category}
            </p>
            <h1>
              {project.title}
              <em>.</em>
            </h1>
            <p className="case-tagline">{project.tagline}</p>
            <p className="case-description">{project.description}</p>
            <TechTags items={project.technologies} />
            <ProjectLinks project={project} caseStudy={false} />
          </header>
          <ProjectImage project={project} large eager />
          <div className="case-layout">
            <nav className="case-toc" aria-label="Case study contents">
              <p className="mono muted">INSIDE THE PROJECT</p>
              {[
                ["02", "The problem", "problem"],
                ["03", "The solution", "solution"],
                ["04", "Architecture", "architecture"],
                ["05", "Technical challenges", "challenges"],
                ["06", "Implementation", "implementation"],
                ["07", "Results & evidence", "results"],
                ["08", "Project links", "links"],
              ].map(([n, title, id]) => (
                <a href={`#${id}`} key={id}>
                  <small>{n}</small>
                  {title}
                </a>
              ))}
            </nav>
            <div className="case-body">
              <section id="problem">
                <p className="eyebrow section-index">02 / THE PROBLEM</p>
                <h2>Start with the real question.</h2>
                <p>{project.problem}</p>
              </section>
              <section id="solution">
                <p className="eyebrow section-index">03 / THE SOLUTION</p>
                <h2>{project.tagline}</h2>
                <p>{project.solution}</p>
                {project.slug === "botvue" && <BotvueDemo />}
              </section>
              <section id="architecture">
                <p className="eyebrow section-index">04 / ARCHITECTURE</p>
                <h2>How the pieces connect.</h2>
                <ol className="architecture-flow">
                  {project.architecture.map((step, index) => (
                    <li key={step}>
                      <span className="mono">0{index + 1}</span>
                      {step}
                      <b aria-hidden="true">↓</b>
                    </li>
                  ))}
                </ol>
                <p>{project.architectureNote}</p>
                <ExternalLink href={project.docsUrl}>
                  Read the source documentation
                </ExternalLink>
              </section>
              <section id="challenges">
                <p className="eyebrow section-index">
                  05 / TECHNICAL CHALLENGES
                </p>
                <h2>The decisions that matter.</h2>
                {project.challenges.map((challenge) => (
                  <div className="challenge" key={challenge.title}>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.text}</p>
                  </div>
                ))}
              </section>
              <section id="implementation">
                <p className="eyebrow section-index">
                  06 / IMPLEMENTATION DETAILS
                </p>
                <h2>From intent to execution.</h2>
                <ul className="implementation-list">
                  {project.implementation.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </section>
              <section id="results">
                <p className="eyebrow section-index">07 / RESULTS & EVIDENCE</p>
                <h2>Inspect it for yourself.</h2>
                <p>{project.results}</p>
                <p className="evidence-label mono">
                  SOURCE REVIEWED SEPTEMBER 23, 2026
                </p>
              </section>
              <section id="links">
                <p className="eyebrow section-index">08 / PROJECT LINKS</p>
                <h2>Go deeper.</h2>
                <ProjectLinks project={project} caseStudy={false} />
                <ExternalLink href={project.docsUrl}>
                  Documentation
                </ExternalLink>
              </section>
            </div>
          </div>
          <Link className="next-project" href={`/work/${next.slug}`}>
            <span className="eyebrow muted">
              NEXT TECHNIQUE / {next.number}
            </span>
            <span>
              {next.title}
              <em>↗</em>
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
