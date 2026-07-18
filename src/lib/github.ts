const USERNAME = "GuTS805";

// Snapshot taken directly from the GitHub API — used only if a live
// fetch fails (rate limit, offline build), so the section never breaks.
const FALLBACK_BYTES: Record<string, number> = {
  TypeScript: 864031,
  JavaScript: 251001,
  HTML: 62674,
  Python: 61436,
  CSS: 59490,
  PowerShell: 9721,
  Dockerfile: 1083,
};

export type LanguageStat = {
  name: string;
  percent: number;
};

function finalize(totals: Map<string, number>): LanguageStat[] {
  const sum = [...totals.values()].reduce((a, b) => a + b, 0);
  if (sum === 0) return [];
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      percent: Math.round((bytes / sum) * 1000) / 10,
    }));
}

type Repo = { name: string; fork: boolean };

export async function getLanguageStats(): Promise<LanguageStat[]> {
  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!reposRes.ok) throw new Error("repos fetch failed");
    const repos: Repo[] = await reposRes.json();
    const owned = repos.filter((r) => !r.fork);

    const totals = new Map<string, number>();
    for (const repo of owned) {
      const langRes = await fetch(
        `https://api.github.com/repos/${USERNAME}/${repo.name}/languages`,
        { next: { revalidate: 3600 } }
      );
      if (!langRes.ok) continue;
      const langs: Record<string, number> = await langRes.json();
      for (const [lang, bytes] of Object.entries(langs)) {
        totals.set(lang, (totals.get(lang) ?? 0) + bytes);
      }
    }

    const result = finalize(totals);
    if (result.length === 0) throw new Error("no language data");
    return result;
  } catch {
    return finalize(new Map(Object.entries(FALLBACK_BYTES)));
  }
}
