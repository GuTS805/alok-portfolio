// Descriptions and architecture checked against public source on 2026-09-23.
// Screenshots are actual running applications; their data is a captured snapshot.
export const projects = [
  {
    slug: "chaintrace",
    title: "ChainTrace",
    number: "01",
    symbol: "追",
    featured: true,
    category: "BLOCKCHAIN FORENSICS",
    tagline: "Follow the trail. Understand the evidence.",
    description:
      "A cryptocurrency investigation platform for tracing wallets, exploring transaction relationships, and identifying potential exchange connections with explainable evidence.",
    technologies: ["Python", "FastAPI", "Next.js", "XGBoost", "React Flow"],
    githubUrl: "https://github.com/GuTS805/Chaintrace",
    docsUrl: "https://github.com/GuTS805/Chaintrace/blob/main/RUNBOOK.md",
    image: "chaintrace",
    imageAlt:
      "ChainTrace application showing its investigation workspace and wallet attribution tools",
    imageCaption: "LOCAL APPLICATION · SEEDED DEMO DATA",
    problem:
      "An unfamiliar wallet address is only a starting point. An investigator needs to follow its connections, distinguish plausible exchange links from weak evidence, and explain how a conclusion was reached.",
    solution:
      "Search a wallet, inspect its transaction graph, review attribution signals and risk separately, then attach findings to a case and export a report. The engine can return insufficient evidence or ambiguity instead of forcing a match.",
    architecture: [
      "Next.js / React Flow",
      "Authenticated FastAPI",
      "SQL graph traversal",
      "Heuristics + XGBoost",
      "Evidence / case report",
    ],
    architectureNote:
      "SQLAlchemy provides the data layer. The local demo uses SQLite; PostgreSQL is supported. Redis caching degrades gracefully. Attribution is based on signals and a calibrated classifier, with no LLM in the attribution path.",
    challenges: [
      {
        title: "Bound the investigation",
        text: "Recursive SQL traversal has explicit depth, node, value, and time limits. Pruning reasons travel with the result so an incomplete graph is never presented as exhaustive.",
      },
      {
        title: "Keep confidence honest",
        text: "Insufficient evidence and competing plausible candidates are distinct outcomes. Model calibration is evaluated on the repository’s synthetic distribution; that is not a real-world accuracy guarantee.",
      },
      {
        title: "Separate identity from risk",
        text: "A likely exchange connection and a risk assessment answer different questions. The application keeps their evidence and outputs separate.",
      },
    ],
    implementation: [
      "Forward and reverse graph traversal support deposit-sweep signals.",
      "Ethereum and Tron providers feed a common import and attribution pipeline.",
      "Officer authentication and audit records protect investigation endpoints.",
      "Server-generated PDF reports include attribution evidence and a graph snapshot.",
    ],
    results:
      "The repository supplies reproducible offline scenarios for exchange linkage, ambiguous attribution, and insufficient evidence, along with real-chain replay snapshots. The screenshot here is captured from the local application; no independent accuracy benchmark is claimed.",
  },
  {
    slug: "botvue",
    title: "Botvue",
    number: "02",
    symbol: "眼",
    featured: true,
    category: "WEB SECURITY / CRAWLER ANALYSIS",
    tagline: "One URL. Two very different stories.",
    description:
      "A web analysis tool that compares responses served to human browsers and automated crawlers, revealing content divergence hidden behind successful HTTP responses.",
    technologies: ["Python", "FastAPI", "Hedera", "TypeScript"],
    githubUrl: "https://github.com/GuTS805/Botvue",
    liveUrl: "https://botvue.onrender.com",
    docsUrl: "https://github.com/GuTS805/Botvue#readme",
    image: "botvue",
    imageAlt:
      "Botvue live web interface for comparing responses delivered to browsers and AI crawlers",
    imageCaption: "LIVE APPLICATION · CAPTURED SEPTEMBER 2026",
    problem:
      "An HTTP 200 response does not guarantee that a crawler received the article a person sees. Empty challenges and substituted bodies can look like successful reads to an automated agent.",
    solution:
      "Fetch a URL under browser, Googlebot, and AI-crawler identities; compare status, content, and hashes; return a verdict with evidence. The public archive exposes recorded findings for rechecking.",
    architecture: [
      "Browser / agent",
      "FastAPI gateway",
      "Multi-agent fetch",
      "Diff + classify",
      "Evidence / Hedera",
    ],
    architectureNote:
      "HTTP and MCP adapters reuse the same checking service. Paid agent checks use a Hedera testnet payment flow; settlement is cross-checked against a public mirror node. The free browser path has separate limits.",
    challenges: [
      {
        title: "Distinguish refusal from deception",
        text: "An explicit 4xx tells the caller access failed. Botvue treats a success-looking response with missing content differently from an honest refusal.",
      },
      {
        title: "Make observations reproducible",
        text: "Response hashes, recorded bodies, and an evidence manifest preserve what was observed. Scheduled rescans track changes; a past observation is not a permanent claim about a publisher.",
      },
      {
        title: "Share behavior across interfaces",
        text: "The MCP server and HTTP gateway call a common service instead of maintaining competing versions of the scanner.",
      },
    ],
    implementation: [
      "Compare response-body SHA-256 hashes, word ratios, and HTTP status codes.",
      "Classify soft-blocked, substituted, refused, and clean responses.",
      "Expose a searchable evidence archive and change records.",
      "Anchor selected findings to a public Hedera Consensus Service topic.",
    ],
    results:
      "A live application, evidence archive, recorded response fixtures, and verification commands are available in the repository. The small comparison on this portfolio is explicitly illustrative and does not run a live scan.",
  },
  {
    slug: "hangr",
    title: "Hangr",
    number: "03",
    symbol: "繋",
    featured: false,
    category: "SOCIAL / GEOLOCATION",
    tagline: "Real connections. Right around the corner.",
    description:
      "A location-based social application that helps people discover nearby communities and connect through shared interests.",
    technologies: ["Next.js", "TypeScript", "Supabase", "Leaflet"],
    githubUrl: "https://github.com/GuTS805/hangr",
    liveUrl: "https://hangr-ruby.vercel.app",
    docsUrl: "https://github.com/GuTS805/hangr/tree/main/spontaneous-meetup",
    image: "hangr",
    imageAlt: "Hangr application’s public welcome and discovery interface",
    imageCaption: "PUBLIC APPLICATION · NO PRIVATE USER DATA",
    problem:
      "People can share a neighborhood without an easy way to discover one another’s interests or find a nearby community.",
    solution:
      "Combine location-based discovery, community feeds, onboarding, and realtime conversations in a web application. Maps provide a spatial entry point into local connections.",
    architecture: [
      "Next.js interface",
      "Leaflet map",
      "Supabase auth / data",
      "Realtime conversations",
    ],
    architectureNote:
      "Next.js handles the interface and application routes, Leaflet supplies the map, and Supabase provides authentication, PostgreSQL, storage, and realtime services. Database policies constrain writes to the authenticated user. The screenshot shows the public entry screen.",
    challenges: [
      {
        title: "Let users interact without granting ownership",
        text: "A post’s owner-only update policy also prevented other people from liking it. A dedicated database function checks the authenticated user and toggles only that user’s like, instead of opening up arbitrary post updates.",
      },
      {
        title: "Enforce ownership beyond the interface",
        text: "Message deletion policies compare the caller with the message author. Upload and deletion rules restrict post-image writes to the user’s own storage folder, keeping these checks in the data layer.",
      },
    ],
    implementation: [
      "Leaflet-based discovery and location markers.",
      "Supabase authentication, PostgreSQL data, and realtime channels.",
      "Onboarding, community feeds, and a Ping interaction described in the supplied résumé.",
    ],
    results:
      "Public source and a live entry point are available. Database migrations document ownership policies and the post-like correction. The public screenshot avoids private conversations; no adoption, latency, or performance benchmark is claimed.",
  },
  {
    slug: "nagrikflow",
    title: "NagrikFlow",
    number: "04",
    symbol: "民",
    featured: false,
    category: "CIVIC / PUBLIC SERVICES",
    tagline: "Know what happens before you apply.",
    description:
      "A citizen-side journey simulator for checking eligibility, preparing documents, and understanding a public-service process before applying.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vitest"],
    githubUrl: "https://github.com/GuTS805/NagrikFlow",
    liveUrl: "https://nagrikflow-five.vercel.app",
    docsUrl: "https://github.com/GuTS805/NagrikFlow#readme",
    image: "nagrikflow",
    imageAlt:
      "NagrikFlow application showing its public-service journey planning interface",
    imageCaption: "LIVE APPLICATION · PASSPORT RENEWAL MVP",
    problem:
      "Starting a public-service application without understanding eligibility or documentation can leave an applicant unprepared for the steps ahead.",
    solution:
      "Preview an application journey before visiting the real portal. The MVP focuses on Indian Passport Renewal, with eligibility questions, document preparation, inconsistency checks, and a process timeline.",
    architecture: [
      "Service content EN / HI",
      "Pure eligibility rules",
      "Journey state",
      "Local storage",
      "Action plan",
    ],
    architectureNote:
      "A client-side Next.js application. Deterministic rules power eligibility, risk detection, and timelines; there is no backend, database, paid API, or runtime LLM dependency.",
    challenges: [
      {
        title: "Make rules inspectable",
        text: "Eligibility and document checks live in pure logic modules rather than generated runtime advice. Service questions, documents, and bilingual content are separated from the UI.",
      },
      {
        title: "Keep the boundary clear",
        text: "The application simulates a journey; it does not submit government applications or guarantee an outcome. Progress persists locally in the visitor’s browser.",
      },
    ],
    implementation: [
      "English and Hindi service content.",
      "Dedicated eligibility, document, risk, timeline, and action-plan modules.",
      "LocalStorage-backed journey state.",
      "Vitest is included in the project’s testing stack.",
    ],
    results:
      "A public repository and live application are available. Coverage and completion-rate metrics are not asserted. Service guidance should be checked against the relevant official portal before use.",
  },
  {
    slug: "closing-bell",
    title: "Closing Bell",
    number: "05",
    symbol: "鐘",
    featured: false,
    category: "WEB3 / PRICE DISCOVERY",
    tagline: "The quote isn’t the whole price.",
    description:
      "Compare tokenized-stock quotes with underlying equity reference prices, separate wrapper premiums from pool impact, and explore on-chain settlement guards.",
    technologies: ["Next.js", "TypeScript", "Solana", "Pyth"],
    githubUrl: "https://github.com/GuTS805/Closing-Bell",
    liveUrl: "https://closing-bell-eight.vercel.app",
    docsUrl: "https://github.com/GuTS805/Closing-Bell#readme",
    image: "closing-bell",
    imageAlt:
      "Closing Bell live application comparing tokenized-stock prices and underlying equity reference prices",
    imageCaption: "LIVE APPLICATION · PRICES ARE A CAPTURED SNAPSHOT",
    problem:
      "A pool quote describes a tokenized stock within its market. It does not necessarily show the difference between the wrapper’s price and the equity it tracks.",
    solution:
      "Compare pool prices with equity references and show the components separately. A Solana guard additionally checks a configured price band at settlement and can reject a fill outside it.",
    architecture: [
      "Next.js application",
      "Jupiter pool quotes",
      "Pyth equity reference",
      "Cost breakdown",
      "Solana settlement guard",
    ],
    architectureNote:
      "Read-only price and position endpoints are separate from transaction-building and devnet proof actions. The portfolio screenshot does not execute a transaction or connect a wallet.",
    challenges: [
      {
        title: "Separate different costs",
        text: "Pool impact and wrapper premium are different measurements. The product compares both against the equity reference rather than treating every difference as a fee.",
      },
      {
        title: "Respect changing evidence",
        text: "The repository documents oracle age, spread filtering, and finite measurement windows. A snapshot cannot establish a universal premium or explain its cause.",
      },
      {
        title: "Enforce a bound at settlement",
        text: "The program checks the executed fill against an oracle band. The repository’s proof flow uses devnet to demonstrate rejection outside the configured band.",
      },
    ],
    implementation: [
      "Jupiter pool quotes and Pyth equity references feed a cost breakdown.",
      "A calculator accepts ticker and trade-size inputs.",
      "Read-only position lookup keeps signing separate from portfolio inspection.",
      "Documented sampling and replay scripts make observations inspectable.",
    ],
    results:
      "The public app includes a calculator, findings, and a devnet proof page. Repository measurements are tied to specific observation windows; this portfolio does not claim those values are current or universal.",
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
