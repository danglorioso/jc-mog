import { NextResponse } from "next/server";
import { REPOS } from "@/lib/repos";

async function getCommitCount(owner: string, repo: string): Promise<number> {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers, next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const linkHeader = res.headers.get("Link");
  if (linkHeader) {
    const lastMatch = linkHeader.match(/<[^>]+[?&]page=(\d+)>;\s*rel="last"/);
    if (lastMatch) return parseInt(lastMatch[1], 10);
  }

  // Single page = 1 commit (or 0 if empty - API returns 204 for empty)
  const data = await res.json();
  return Array.isArray(data) ? (data.length ? 1 : 0) : 0;
}

export async function GET() {
  const results = await Promise.allSettled(
    REPOS.map(async (fullName) => {
      const [owner, repo] = fullName.split("/");
      const count = await getCommitCount(owner, repo);
      return { repo: fullName, name: repo, commits: count };
    })
  );

  const data = results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : {
          repo: REPOS[i],
          name: REPOS[i].split("/").pop() ?? "error",
          commits: 0,
        }
  );

  return NextResponse.json(data);
}
