export const site = {
  name: "Alok Srivastava",
  email: "alok020505@gmail.com",
  github: "https://github.com/GuTS805",
  linkedin: "https://www.linkedin.com/in/alok-srivastava-7a6391329/",
  url: "https://alok-portfolio-ivory.vercel.app",
  resume: "/resume.pdf",
  verifiedAt: "2026-09-23",
};

export const skills = [
  {
    name: "FRONTEND",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    name: "BACKEND & DATA",
    items: ["Node.js", "FastAPI", "PostgreSQL", "Supabase"],
  },
  { name: "LANGUAGES & TOOLS", items: ["C++", "Python", "Git"] },
];

// A curated snapshot, not a live contribution counter. Each merge was checked
// against the GitHub API on 2026-09-23. Refresh manually after verifying sources.
export const contributions = [
  {
    id: "ankidroid",
    name: "AnkiDroid",
    mark: "01",
    category: "ACCESSIBILITY / RELIABILITY",
    description:
      "Small details. Real consequences. Making everyday study more accessible and resilient.",
    items: [
      {
        title: "Give pronunciation controls a voice",
        description:
          "Added TalkBack labels to play, cancel, and record controls; kept the description in sync with playback state and covered it with regression tests.",
        url: "https://github.com/ankidroid/Anki-Android/pull/21451",
        number: "#21451",
        date: "2026-08-10",
        status: "Merged",
      },
      {
        title: "Keep exports intact through screen rotation",
        description:
          "Prevented a configuration change from deleting the export dialog’s temporary IDs file, with a recreation regression test.",
        url: "https://github.com/ankidroid/Anki-Android/pull/21491",
        number: "#21491",
        date: "2026-09-20",
        status: "Merged",
      },
    ],
  },
  {
    id: "joinmarket",
    name: "JoinMarket",
    mark: "02",
    category: "BITCOIN / TRANSACTION SAFETY",
    description:
      "Work on wallet behavior that has to be right, from keyboard access to the exact coins a transaction spends.",
    items: [
      {
        title: "Spend exactly the coins the user reviewed",
        description:
          "Pinned sweep inputs in Jam so a changing wallet balance cannot silently change the UTXOs sent at broadcast time.",
        url: "https://github.com/joinmarket-webui/jam/pull/1463",
        number: "JAM #1463",
        date: "2026-09-02",
        status: "Merged",
      },
      {
        title: "Freeze UTXOs atomically",
        description:
          "Added a batch freeze/unfreeze endpoint to JoinMarket NG, allowing the wallet to apply the complete selection in one request.",
        url: "https://github.com/joinmarket-ng/joinmarket-ng/pull/601",
        number: "NG #601",
        date: "2026-08-23",
        status: "Merged",
      },
      {
        title: "Make balance visibility keyboard accessible",
        description:
          "Replaced a click-only span with a semantic button, accessible labels, pressed state, and keyboard regression tests.",
        url: "https://github.com/joinmarket-webui/jam/pull/1412",
        number: "JAM #1412",
        date: "2026-08-09",
        status: "Merged",
      },
    ],
  },
];

export const pendingEvidence = {
  // Owner confirmed on 2026-09-23 that the advisories are not public yet.
  // Do not publish details, a disclosure count, or guessed advisory URLs.
  advisoriesPublic: false,
  note: "Security advisories intentionally omitted until publicly disclosed.",
};

export const securityContribution = {
  title: "Handle malformed external intents safely",
  description:
    "Removed a null assertion in an exported intent handler and added a regression test for missing clipboard data.",
  url: "https://github.com/ankidroid/Anki-Android/pull/21631",
  number: "ANKIDROID #21631",
  status: "Merged",
  date: "2026-08-30",
};

export const selectedMergedCount =
  contributions.reduce(
    (total, group) =>
      total + group.items.filter((item) => item.status === "Merged").length,
    0,
  ) + (securityContribution.status === "Merged" ? 1 : 0);
