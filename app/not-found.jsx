import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow section-index">404 / OUTSIDE THE DOMAIN</p>
      <h1>
        NO TRACE
        <br />
        <em>FOUND.</em>
      </h1>
      <p>
        This page doesn’t exist. There’s plenty to explore back in the domain.
      </p>
      <Link href="/" className="button primary">
        RETURN TO THE SHRINE ↗
      </Link>
    </main>
  );
}
