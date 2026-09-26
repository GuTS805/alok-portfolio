import Link from "next/link";
import { site } from "../data/site";

export function ExternalLink({ href, children, className = "text-link" }) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ShrineImage({ className = "", eager = false }) {
  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet="/shrine-640.avif 640w, /shrine-960.avif 960w, /shrine-1536.avif 1536w"
        sizes="100vw"
      />
      <source
        type="image/webp"
        srcSet="/shrine-640.webp 640w, /shrine-960.webp 960w, /shrine-1536.webp 1536w"
        sizes="100vw"
      />
      <img
        src="/shrine-1536.webp"
        alt=""
        width="1536"
        height="1024"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

export function Dismantle() {
  return (
    <span className="dismantle" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function ProjectImage({ project, large = false, eager = false }) {
  const sizes = large
    ? "(max-width: 767px) calc(100vw - 40px), (max-width: 1408px) 90vw, 1120px"
    : project.featured
      ? "(max-width: 767px) calc(100vw - 76px), (max-width: 1408px) 47vw, 660px"
      : "(max-width: 479px) calc(100vw - 42px), (max-width: 767px) calc(50vw - 40px), (max-width: 1408px) 30vw, 400px";
  return (
    <figure className={`product-window ${large ? "product-window-large" : ""}`}>
      <div className="window-bar" aria-hidden="true">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>
          {project.title.toLowerCase().replaceAll(" ", "")} / application
        </span>
        <span>↗</span>
      </div>
      <picture>
        <source
          type="image/webp"
          srcSet={`/projects/${project.image}-720.webp 720w, /projects/${project.image}-1440.webp 1440w`}
          sizes={sizes}
        />
        <img
          src={`/projects/${project.image}-1440.webp`}
          width="1440"
          height="960"
          alt={project.imageAlt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </picture>
      <figcaption>{project.imageCaption}</figcaption>
      <Dismantle />
    </figure>
  );
}

export function TechTags({ items }) {
  return (
    <ul className="tech-tags" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ProjectLinks({ project, caseStudy = true }) {
  return (
    <div className="project-links">
      {caseStudy && (
        <Link className="text-link project-link" href={`/work/${project.slug}`}>
          Explore project <span aria-hidden="true">↗</span>
        </Link>
      )}
      <ExternalLink href={project.githubUrl}>Source code</ExternalLink>
      {project.liveUrl && (
        <ExternalLink href={project.liveUrl}>Live app</ExternalLink>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer wrap">
      <a className="logo" href="/">
        ALOK<span>.</span>
      </a>
      <p>BUILT WITH INTENT. INSPIRED BY CHAOS.</p>
      <div>
        <ExternalLink href={site.github}>GitHub</ExternalLink>
        <a className="text-link" href="#top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
