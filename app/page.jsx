import Link from "next/link";
import { projects } from "./data/projects";
import {
  contributions,
  securityContribution,
  selectedMergedCount,
  site,
  skills,
} from "./data/site";
import {
  AtmosphereControls,
  BotvueDemo,
  CollapseDomain,
  CopyEmail,
  Navbar,
} from "./components/experience";
import {
  Dismantle,
  ExternalLink,
  Footer,
  ProjectImage,
  ProjectLinks,
  ShrineImage,
  TechTags,
} from "./components/shared";

export const metadata = { alternates: { canonical: site.url } };

export default function Portfolio() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.name,
            url: site.url,
            sameAs: [site.github, site.linkedin],
            description:
              "Computer science student, full-stack developer, and open-source contributor.",
          }),
        }}
      />
      <Navbar />
      <div className="scroll-progress" aria-hidden="true" />
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="shrine-scene" aria-hidden="true">
            <ShrineImage className="shrine-image" eager />
            <div className="scene-vignette" />
            <div className="shrine-glow" />
            <div className="atmospheric-fog" />
            <div className="embers">
              {Array.from({ length: 18 }, (_, index) => (
                <i key={index} style={{ "--i": index }} />
              ))}
            </div>
          </div>
          <div className="hero-coordinate" aria-hidden="true">
            領域展開<span>DOMAIN EXPANSION</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow hero-identification">
              <span className="status-dot" /> ALOK SRIVASTAVA{" "}
              <span className="label-divider">/</span> DEVELOPER & BUILDER
            </p>
            <h1 id="hero-title">
              <span>
                <b>BUILD</b>
              </span>
              <span>
                <b>WITHOUT</b>
              </span>
              <span>
                <b className="red">LIMITS.</b>
              </span>
            </h1>
            <div className="hero-support">
              <p className="hero-intro">
                <strong>Ideas mean nothing without execution.</strong>
                <br />I build full-stack applications, investigate complex
                <br className="desktop-break" /> systems, and contribute to
                open-source software.
              </p>
              <div className="hero-actions">
                <CollapseDomain />
                <a className="text-link" href="#work">
                  Explore my work <span>↓</span>
                </a>
              </div>
              <p className="hero-status mono">
                FULL-STACK DEVELOPMENT. UNRESTRICTED.
              </p>
            </div>
          </div>
          <div className="shrine-label" aria-hidden="true">
            <span>伏魔御厨子</span>
            <p>MALEVOLENT SHRINE</p>
            <small>CREATION WITHOUT BOUNDARIES</small>
          </div>
          <div className="hero-bottom">
            <span className="availability">
              <i /> OPEN TO ENGINEERING INTERNSHIPS
            </span>
            <span className="hero-edition mono">PORTFOLIO / VOL. 2026</span>
            <AtmosphereControls />
          </div>
          <Dismantle />
          <div className="collapse-veil" aria-hidden="true" />
        </section>
        <div className="manifesto-strip" aria-hidden="true">
          <span>PRECISION IN EVERY LINE.</span>
          <b>✳</b>
          <span>INTENT IN EVERY INTERACTION.</span>
          <b>✳</b>
          <span>NO BOUNDARIES. JUST POSSIBILITIES.</span>
          <b>✳</b>
        </div>
        <section
          id="work"
          className="section wrap"
          aria-labelledby="work-title"
        >
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow section-index">01 / SELECTED TECHNIQUES</p>
              <h2 id="work-title" tabIndex={-1}>
                PROOF OF <em>POWER.</em>
              </h2>
            </div>
            <p>
              Different problems. Different systems.
              <br />
              One obsession with building things well.
            </p>
          </div>
          <div className="featured-projects">
            {projects
              .filter((project) => project.featured)
              .map((project) => (
                <article
                  key={project.slug}
                  className={`featured-project reveal project-${project.slug}`}
                >
                  <div className="featured-copy">
                    <p className="eyebrow technique-label">
                      <span>{project.number} /</span> {project.category}
                    </p>
                    <h3>
                      {project.title}
                      <span>.</span>
                    </h3>
                    <p className="project-tagline">{project.tagline}</p>
                    <p className="project-description">{project.description}</p>
                    <TechTags items={project.technologies} />
                    <ul
                      className="project-focus"
                      aria-label="Engineering focus"
                    >
                      {project.challenges.map((challenge, index) => (
                        <li key={challenge.title}>
                          <span>0{index + 1}</span>
                          {challenge.title}
                        </li>
                      ))}
                    </ul>
                    <ProjectLinks project={project} />
                    <span className="project-watermark" aria-hidden="true">
                      {project.symbol}
                    </span>
                  </div>
                  <div className="featured-preview">
                    <Link
                      className="preview-link"
                      href={`/work/${project.slug}`}
                    >
                      <span className="sr-only">
                        Explore {project.title} case study.{" "}
                      </span>
                      <ProjectImage project={project} />
                    </Link>
                    {project.slug === "botvue" ? (
                      <BotvueDemo />
                    ) : (
                      <div className="trace-caption">
                        <span className="trace-mini" aria-hidden="true">
                          <i />
                          <b />
                          <i />
                          <b />
                          <i />
                        </span>
                        <p>
                          FOLLOW THE CONNECTIONS.
                          <br />
                          <span>QUESTION THE CONCLUSION.</span>
                        </p>
                        <span className="mono">
                          EVIDENCE
                          <br />
                          OVER ASSUMPTION
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
          </div>
          <div className="additional-heading">
            <span className="eyebrow muted">MORE FROM THE DOMAIN</span>
            <span className="mono muted">03 — 05</span>
          </div>
          <div className="project-grid">
            {projects
              .filter((project) => !project.featured)
              .map((project) => (
                <article className="project-card reveal" key={project.slug}>
                  <Link className="preview-link" href={`/work/${project.slug}`}>
                    <span className="sr-only">
                      Explore {project.title} case study.{" "}
                    </span>
                    <ProjectImage project={project} />
                  </Link>
                  <div className="card-copy">
                    <p className="eyebrow technique-label">
                      <span>{project.number} /</span> {project.category}
                    </p>
                    <h3>
                      {project.title}
                      <span className="card-symbol" aria-hidden="true">
                        {project.symbol}
                      </span>
                    </h3>
                    <p>{project.description}</p>
                    <TechTags items={project.technologies} />
                    <ProjectLinks project={project} />
                  </div>
                </article>
              ))}
          </div>
          <p className="work-note mono">
            REAL APPLICATIONS. REAL SOURCE CODE. EACH SCREEN IS A CAPTURED
            SNAPSHOT.
          </p>
        </section>
        <section
          id="about"
          className="about section"
          aria-labelledby="about-title"
        >
          <div className="wrap about-grid">
            <div className="about-seal reveal" aria-hidden="true">
              <span className="seal-top mono">
                DISCIPLINE / CURIOSITY / EXECUTION
              </span>
              <div className="seal-rings">
                <i />
                <i />
                <i />
                <span>創</span>
                <b className="seal-point point-one">＋</b>
                <b className="seal-point point-two">＋</b>
              </div>
              <span className="seal-bottom mono">
                THE MIND BEHIND THE DOMAIN
              </span>
            </div>
            <div className="about-copy reveal">
              <p className="eyebrow section-index">
                02 / THE SORCERER BEHIND THE SCREEN
              </p>
              <h2 id="about-title">
                STAY CURIOUS.
                <br />
                BUILD <em>RELENTLESSLY.</em>
              </h2>
              <p className="about-lead">
                I’m Alok, a computer science student and full-stack developer
                who enjoys building applications, investigating complex systems,
                and contributing to open-source software.
              </p>
              <p>
                My work spans blockchain investigation, web security, real-time
                applications, and contributions to projects including AnkiDroid
                and JoinMarket.
              </p>
              <div className="stats">
                <div>
                  <b>
                    {String(projects.length).padStart(2, "0")}
                    <span>/</span>
                  </b>
                  <span>SELECTED PROJECTS</span>
                </div>
                <a href="#open-source">
                  <b>
                    {String(selectedMergedCount).padStart(2, "0")}
                    <span>/</span>
                  </b>
                  <span>MERGED CHANGES SHOWCASED ↗</span>
                </a>
              </div>
              <div className="about-links">
                <a
                  className="button secondary"
                  href={site.resume}
                  download="Alok-Srivastava-Resume.pdf"
                >
                  DOWNLOAD RÉSUMÉ <span>↓</span>
                </a>
                <ExternalLink href={site.github}>View GitHub</ExternalLink>
              </div>
              <p className="education">
                <span className="red">↳</span> B.Tech · Computer Science &
                Engineering
                <br />
                <span>ABES Engineering College · Expected 2028</span>
              </p>
            </div>
          </div>
        </section>
        <section
          id="open-source"
          className="section wrap open-source"
          aria-labelledby="open-source-title"
        >
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow section-index">03 / BEYOND MY DOMAIN</p>
              <h2 id="open-source-title">
                CODE THAT LIVES
                <br />
                BEYOND MY <em>REPOSITORIES.</em>
              </h2>
            </div>
            <span className="section-kanji" aria-hidden="true">
              共創
            </span>
          </div>
          <p className="section-intro reveal">
            Building my own applications is only part of the journey. I also
            contribute to established open-source projects, working on
            reliability, accessibility, security, and real-world software.
          </p>
          <div className="contribution-layout">
            <aside
              className="contribution-network"
              aria-label="Contribution areas"
            >
              <div className="network-origin">
                ALOK<span>OPEN SOURCE CONTRIBUTOR</span>
              </div>
              <div className="network-branches">
                <a href="#ankidroid">
                  <i />
                  ANKIDROID <span>01</span>
                </a>
                <a href="#joinmarket">
                  <i />
                  JOINMARKET <span>02</span>
                </a>
                <a href="#security">
                  <i />
                  SECURITY RESEARCH <span>03</span>
                </a>
              </div>
              <p className="mono muted">
                INDEPENDENT CONTRIBUTIONS
                <br />
                AUG 2026 — PRESENT
              </p>
            </aside>
            <div className="contribution-timeline">
              {contributions.map((group) => (
                <article
                  id={group.id}
                  key={group.id}
                  className="contribution-group"
                >
                  <div className="contribution-heading">
                    <p className="eyebrow section-index">
                      {group.mark} / {group.category}
                    </p>
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                  </div>
                  {group.items.map((item) => (
                    <a
                      className="contribution-item"
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="contribution-meta">
                        <span className="merged-badge">✓ MERGED</span>
                        <span>{item.number}</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </a>
                  ))}
                </article>
              ))}
              <article
                id="security"
                className="contribution-group security-group"
              >
                <p className="eyebrow section-index">03 / SECURITY RESEARCH</p>
                <h3>Question the assumptions.</h3>
                <p>
                  Investigating trust boundaries is part of how I build. Botvue
                  examines what an automated reader actually receives; my
                  contributions also address failure handling in established
                  software.
                </p>
                <a
                  className="contribution-item"
                  href={securityContribution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contribution-meta">
                    <span className="merged-badge">✓ MERGED FIX</span>
                    <span>{securityContribution.number}</span>
                    <span>↗</span>
                  </div>
                  <h4>{securityContribution.title}</h4>
                  <p>{securityContribution.description}</p>
                </a>
                <Link className="text-link" href="/work/botvue">
                  Explore the crawler-analysis project <span>↗</span>
                </Link>
              </article>
            </div>
          </div>
          <p className="evidence-note mono">
            SELECTED MERGES VERIFIED SEPTEMBER 23, 2026 · FOLLOW EACH LINK FOR
            THE REVIEW AND SOURCE.
          </p>
        </section>
        <section className="arsenal section" aria-labelledby="arsenal-title">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow section-index">04 / THE ARSENAL</p>
                <h2 id="arsenal-title">
                  THE RIGHT TOOL.
                  <br />
                  THE <em>RIGHT INTENT.</em>
                </h2>
              </div>
              <p>
                Tools I use to turn a difficult problem
                <br />
                into something that works.
              </p>
            </div>
            <div className="skills-grid">
              {skills.map((group, index) => (
                <div className="skill-group reveal" key={group.name}>
                  <p className="eyebrow muted">
                    <span className="red">0{index + 1}</span> / {group.name}
                  </p>
                  <ul>
                    {group.items.map((skill) => (
                      <li key={skill}>
                        {skill}
                        <span aria-hidden="true">↗</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="contact section"
          aria-labelledby="contact-title"
        >
          <ShrineImage className="contact-shrine" />
          <div className="contact-shade" aria-hidden="true" />
          <div className="wrap contact-content">
            <p className="eyebrow section-index reveal">
              05 / RETURN TO THE SHRINE
            </p>
            <h2 id="contact-title" className="reveal">
              LET’S MAKE
              <br />
              <em>AN IMPACT.</em>
            </h2>
            <p className="contact-description reveal">
              Have an interesting project, internship opportunity,
              <br />
              or open-source challenge?
              <br />
              <strong>Let’s connect.</strong>
            </p>
            <div className="contact-actions reveal">
              <a className="button primary" href={`mailto:${site.email}`}>
                EMAIL ME <span>↗</span>
              </a>
              <ExternalLink className="button secondary" href={site.linkedin}>
                MESSAGE ON LINKEDIN
              </ExternalLink>
              <ExternalLink href={site.github}>GITHUB</ExternalLink>
            </div>
            <div className="contact-details">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <CopyEmail />
            </div>
            <span className="contact-kanji" aria-hidden="true">
              始めよう
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
