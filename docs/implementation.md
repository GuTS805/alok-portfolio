# Portfolio redesign handoff

## Implemented

The existing Next.js application now follows the supplied Malevolent Shrine brief: original artwork, solid crimson LIMITS., a short nonblocking entrance, meaningful Collapse Domain navigation, floating command bar, featured ChainTrace/Botvue showcases, three supporting projects, five dedicated case studies, refined About, six verified merged changes, categorized skills, and a return-to-shrine contact section.

Every project has an actual application capture and working source link. Four have verified live app addresses. ChainTrace instead links to its repository and documented local demo. The contribution presentation combines independent engineering experience and open-source work without inventing employment.

Interaction details:

- Hero: sequential masked headline, shrine fade/scale, directional overlay, small desktop pointer movement, subtle scroll offset, embers, and brief bottom divider. Desktop entrance is approximately 2.1 seconds; mobile is approximately 1.15 seconds with four embers and static shrine illumination.
- Collapse Domain: charge at 0–250 ms, thin Dismantle cuts at 250–600 ms, fade at 600–950 ms, Work navigation/focus at 950 ms, cleanup at 1500 ms. Repeat clicks cannot stack; Escape cancels. Ordinary anchor navigation is the fallback.
- Projects: small rise, border emphasis, image scale, shared one-time slash, and an explicitly illustrative Botvue response comparison. Case studies use ordinary Next.js navigation, with direct URLs and browser history.
- About and contributions: stationary character with counter-rotating hover rings; contribution nodes and line progression reveal on entry. Mobile uses the simple vertical timeline.
- Navigation: current-section indicator, mobile modal with explicit focus containment/restoration, and keyboard command palette. Ctrl/Cmd+K avoids text inputs; arrows select commands, Escape closes.
- Preferences: pause motion, optional persisted domain atmosphere, separate opt-in/stop soundtrack, reduced-motion priority, offscreen/hidden-page decorative pauses.
- Contact: real mailto and social links; copy confirmation only follows successful clipboard access, with an honest fallback on failure.

## Significant files

- `app/page.jsx`, `app/globals.css`, `app/layout.jsx`
- `app/components/experience.jsx`, `app/components/shared.jsx`
- `app/data/projects.js`, `app/data/site.js`
- `app/work/[slug]/page.jsx`, `app/not-found.jsx`
- `app/icon.svg`, `app/sitemap.js`, `app/robots.js`
- `public/projects/`, `public/fonts/`, `public/shrine-*`, `public/social-preview.png`
- `verify-next.py`, `verify-intro.py`, `scripts/verify-portfolio.py`, `scripts/audit-accessibility.py`, `scripts/lighthouse.mjs`
- `README.md`, `docs/content-sources.md`

Legacy static files, intro components, and supplied artwork/video are preserved; they are not part of the new runtime entry point. Helper repositories and raw research are isolated under ignored directories. No new runtime dependencies or animation frameworks were added.

## Verification

Actual production-build and browser outcomes are saved in `artifacts/functional-verification.json`, `artifacts/motion-verification.json`, and `artifacts/accessibility.json`.

The integration suite covers:

- All five project routes, direct loading, refresh, forward/back, and unknown-route 404.
- All requested sizes: 320×568, 375×812, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080.
- Every section’s horizontal overflow, image loading, mobile navigation, focus, Escape, commands, PDF download, contact destinations, clipboard success/failure, motion, audio opt-in, transition cancellation, and JavaScript-disabled content.
- No browser JavaScript errors in the passing functional run.

The automated axe scan covers the homepage, all five case studies, and the open mobile menu. Automated checks complement, rather than replace, keyboard and visual inspection.

Lighthouse JSON/HTML reports are in `artifacts/lighthouse-mobile.*` and `artifacts/lighthouse-desktop.*`. They measure a local production server using Lighthouse’s mobile/desktop profiles. Results vary with the machine and run; they are not deployed field metrics. No unmeasured project benchmarks or adoption claims are presented.

The project had no separate lint/typecheck scripts. `npm run build` is the configured production check. Audio verification intercepts the YouTube iframe and tests controls; actual third-party playback is not guaranteed or asserted.

Final local measurements (24 September 2026):

| Lighthouse category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 83 | 99 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |

Mobile measured FCP 1.3 s, LCP 3.5 s, total blocking time 340 ms, and CLS 0. Desktop measured FCP 0.4 s, LCP 0.9 s, total blocking time 10 ms, and CLS 0. The mobile performance target of 90 is not consistently achieved; the latest score above is the reported result. Remaining opportunities include main-thread JavaScript work and render dependencies.

The production build and full functional suite passed. Axe reported zero violations across the homepage, five case studies, and mobile menu. After the final font and mobile entrance adjustments, the seven-size layout inspection again found no horizontal overflow or JavaScript errors, and the focused entrance, transition cancellation, and reduced-motion checks passed. Desktop and 320-pixel mobile hero captures were visually inspected.

## Content boundaries and remaining inputs

- The owner confirmed advisory disclosures are not public. They are intentionally excluded, with no placeholder disclosure links or advisory counter.
- The supplied résumé still contains its original claims unless a revision is explicitly approved. The website’s independently authored content does not repeat them.
- Hangr’s capture is its public entry screen. No authenticated personal data is used.
- No canonical-domain placeholder: the existing repository’s listed Vercel domain is used. Update `site.url` before deploying under another domain.
- No deployment or publication was performed.

Run `npm install`, then `npm run dev`. For production, `npm run build` then `npm start`. Full setup and audit commands are in `README.md`.
