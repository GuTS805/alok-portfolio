# Content provenance — 2026-09-23

## Identity and artwork

Name, intentionally published email, LinkedIn, education, and résumé come from the existing portfolio and supplied résumé. GitHub identity: https://github.com/GuTS805. The GitHub repository metadata for `GuTS805/alok-portfolio` lists https://alok-portfolio-ivory.vercel.app as its homepage; that is the canonical base. No deployment was performed during this redesign.

`public/malevolent-shrine.png` is the original artwork. AVIF/WebP derivatives preserve that image. The legacy video and invocation artwork are retained but are not loaded. The favicon and social card are original typographic branding, with no anime character art.

## Projects

| Project      | Documentation reviewed                                                                                                 | Capture                                                                                                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChainTrace   | https://github.com/GuTS805/Chaintrace and `RUNBOOK.md`                                                                 | Ran the repository locally with SQLite, its included model, seeded scenarios, and demo officer. Captured the wallet investigation for the bundled `ransomware_to_exchange` fixture. Values in this screenshot are synthetic demo results, not accuracy claims. |
| Botvue       | https://github.com/GuTS805/Botvue                                                                                      | https://botvue.onrender.com after its Render service woke up. The current app uses a Python/FastAPI gateway; the old portfolio’s Next.js/The Graph description was not retained.                                                                               |
| Hangr        | https://github.com/GuTS805/hangr; `spontaneous-meetup/supabase/schema.sql`, `migration_rls_fixes.sql`; existing résumé | https://hangr-ruby.vercel.app/auth. Public entry screen; no account created, no private conversations captured. Dedicated direct-message UI includes mock data, so no end-to-end production-chat verification is asserted.                                     |
| NagrikFlow   | https://github.com/GuTS805/NagrikFlow                                                                                  | https://nagrikflow-five.vercel.app. Passport renewal simulation, not a government submission portal.                                                                                                                                                           |
| Closing Bell | https://github.com/GuTS805/Closing-Bell                                                                                | https://closing-bell-eight.vercel.app. No wallet connected and no transaction executed. Prices are a capture-time snapshot; no universal premium is claimed.                                                                                                   |

`scripts/research.py` retrieves public source metadata and README snapshots. `scripts/capture-products.py` and `scripts/capture-featured.py` record screenshots; the latter requires the isolated local ChainTrace demo. These are authoring tools, not production dependencies. Downloaded source and research are ignored via `.gitignore`.

## Selected contributions

Merge status was checked against GitHub’s public API (`pull_request.merged_at`) on 2026-09-23:

- AnkiDroid #21451 — TalkBack labels for pronunciation controls; merged 2026-08-10. https://github.com/ankidroid/Anki-Android/pull/21451
- AnkiDroid #21491 — export IDs survive configuration changes; merged 2026-09-20. https://github.com/ankidroid/Anki-Android/pull/21491
- Jam #1463 — pin exact sweep inputs; merged 2026-09-02. https://github.com/joinmarket-webui/jam/pull/1463
- JoinMarket NG #601 — atomic UTXO batch freeze/unfreeze; merged 2026-08-23. https://github.com/joinmarket-ng/joinmarket-ng/pull/601
- Jam #1412 — accessible balance-visibility button; merged 2026-08-09. https://github.com/joinmarket-webui/jam/pull/1412
- AnkiDroid #21631 — safely handle missing external-intent data; merged 2026-08-30. https://github.com/ankidroid/Anki-Android/pull/21631

The website counts these six selected entries. This is neither a lifetime contribution count nor a live API counter. It makes no runtime GitHub requests; update this snapshot manually after checking the linked evidence.

The owner confirmed the security advisories are not public yet. Their details, IDs, guessed URLs, and published-advisory counts are intentionally excluded. This is not a missing public-project placeholder.

## Limitations

- Case studies summarize inspected documentation/source; they do not assert independently reproduced project benchmarks, production adoption, or employment.
- ChainTrace has no verified public deployment link, so the page offers its source and local-demo runbook instead of a dead live-demo button.
- Hangr’s public screenshot is its entry screen, not a private map/account capture.
- The supplied résumé is an existing image-based PDF. Its original content is retained unless the owner authorizes a revised public copy.
- External project services, LinkedIn, GitHub, and YouTube remain controlled by their respective hosts.
