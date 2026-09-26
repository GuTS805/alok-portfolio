# Alok Srivastava — Malevolent Shrine portfolio

A Next.js 16.3.5 / React 19.3 portfolio with a server-rendered homepage, five statically generated case studies, and small client components for navigation and interaction. The original shrine artwork and résumé are preserved. The old static `index.html`, its scripts, and the legacy video assets remain available but are not loaded by the redesigned application.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. If another app already uses that port, use `npm run dev -- --port 3001`.

```sh
npm run build
npm start
```

For the verification server used during this implementation:

```sh
npm run build
npm run start -- --port 3200 --hostname 127.0.0.1
```

## What changed

- Preserved **BUILD WITHOUT LIMITS.**, the shrine artwork, crimson identity, and footer statement. Replaced the blocking video sequence with a roughly 2.1-second desktop CSS entrance and a shorter mobile entrance. Navigation and ordinary scrolling remain available throughout.
- **Collapse Domain** uses a guarded 1.5-second charge, thin slash, darkening, and navigation into Selected Work. Escape cancels; reduced motion navigates directly. Its underlying anchor still works without JavaScript.
- Featured **ChainTrace** and **Botvue**, followed by **Hangr**, **NagrikFlow**, and **Closing Bell**. Each uses a genuine application capture and has a `/work/[slug]` case study with source, architecture, tradeoffs, implementation, and evidence. MindMash is no longer in the selected work; the original static version remains untouched.
- Added six directly linked, verified merged changes across AnkiDroid and JoinMarket/Jam. The displayed count comes from the curated content, not a live GitHub counter. Advisory details/counts are intentionally absent because the owner confirmed the disclosures are not public.
- Refined About, the interactive seal, grouped skills, and the return-to-shrine contact section. Retained email, LinkedIn, GitHub, and the résumé download.
- Added active navigation, a mobile modal menu, `Ctrl/Cmd+K` commands, an illustrative crawler comparison, domain atmosphere, pause-motion, and explicitly opt-in soundtrack controls. Audio remains hosted by YouTube and can be stopped immediately. Browser policy and third-party availability may affect playback.
- Added route-specific metadata, canonical URLs based on the repository’s listed production URL, sitemap, robots, original typographic social image, and favicon.

## Edit

| File                            | Purpose                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| `app/page.jsx`                  | Server-rendered homepage sections                                                     |
| `app/work/[slug]/page.jsx`      | Five static case-study routes                                                         |
| `app/data/projects.js`          | Project copy, source links, architecture, and screenshot provenance                   |
| `app/data/site.js`              | Public contact links, skills, verified contributions, disclosure visibility           |
| `app/components/experience.jsx` | Client interaction state, focus handling, navigation, motion, clipboard, and commands |
| `app/components/shared.jsx`     | Responsive pictures, project links, shared slash effect, and footer                   |
| `app/globals.css`               | Responsive design and centralized animation rules                                     |
| `app/layout.jsx`                | Local fonts, metadata, and provider composition                                       |
| `public/projects/`              | Genuine screenshots and responsive WebP versions                                      |
| `public/shrine-*`               | AVIF/WebP sizes derived from the original artwork                                     |
| `public/fonts/`                 | Self-hosted fonts and OFL license notices                                             |

The provider accepts server-rendered children; it does not turn project content into a client-rendered page. Content stays visible if reveal logic fails. Decorative motion pauses when the page is hidden or the hero is offscreen. `prefers-reduced-motion` takes precedence over domain mode.

## Verify

Browser tests require Python, Playwright, and Microsoft Edge:

```sh
python -m pip install playwright
python verify-next.py
python verify-intro.py
```

These target http://127.0.0.1:3200. To use another server in PowerShell:

```powershell
$env:PORTFOLIO_URL = 'http://127.0.0.1:3000'
python verify-next.py
```

The suite checks project routes, direct loads, refresh/history, missing routes, all requested viewport sizes, menu focus/Escape, command navigation, clipboard success/failure, PDF download, audio opt-in, collapse cancellation/repeated clicks, motion preferences, and content without JavaScript. The audio test stubs the external frame and checks control behavior; it does not assert third-party playback.

For optional audits, install the tools into the ignored workspace helper directory:

```sh
npm install --prefix .preview-sources/audit --no-audit --no-fund axe-core lighthouse
python scripts/audit-accessibility.py
node scripts/lighthouse.mjs
python scripts/inspect-portfolio.py
```

Audit reports and browser screenshots are written to `artifacts/` (ignored). Lighthouse measurements are local lab results, not a guarantee of deployed performance. The project has no separately configured lint or typecheck script; the production build performs the framework’s checks.

## Content and asset provenance

See [docs/content-sources.md](docs/content-sources.md). All five screenshots are genuine captures, not generated mockups. The ChainTrace image uses its actual local demo and seeded data. Botvue’s small interactive comparison is explicitly illustrative. Public app screenshots are snapshots, not live telemetry or performance evidence.

The original 2.46 MB shrine PNG remains in `public/`; the page uses responsive AVIF (about 28–122 KB) with WebP fallbacks. Below-the-fold screenshots are lazy-loaded. Fonts are local, subsetted WOFF2 files; there are no runtime font service requests or added animation libraries.

No deployment was performed. To deploy elsewhere, update `site.url` in `app/data/site.js` so canonical URLs and sitemap entries match the real destination.
