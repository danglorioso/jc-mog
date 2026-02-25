"use client";

import { useEffect, useState, useMemo } from "react";

type RepoData = { repo: string; name: string; commits: number };

export default function Home() {
  const [data, setData] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/commits")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.commits - a.commits),
    [data]
  );
  const maxCommits = Math.max(...data.map((d) => d.commits), 1);

  return (
    <div className="pt-12 sm:pt-16">
      <h1 className="text-3xl font-bold text-off-white mb-2">
        Which JumboCode team is the best???
      </h1>
      <p className="text-subtext mb-16">Compare the total number of commits between JumboCode teams.</p>

      {loading && <p className="text-subtext"></p>}
      {error && <p className="text-red-500">Failed to load: {error}</p>}

      {!loading && !error && sortedData.length > 0 && (
        <div className="space-y-5">
          {sortedData.map(({ name, commits }) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-36 text-sm font-medium text-off-white">
                {name}
              </span>
              <div className="flex-1 flex items-center gap-3">
                <div
                  className="h-10 rounded-sm min-w-[4px] transition-all bg-brand"
                  style={{
                    width: `${Math.max((commits / maxCommits) * 100, 2)}%`,
                  }}
                />
                <span className="text-sm font-medium text-subtext tabular-nums w-12">
                  {commits}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && sortedData.length === 0 && (
        <p className="text-subtext">
          No repositories configured. Edit{" "}
          <code className="bg-gray-800 text-brand px-2 py-0.5 rounded">
            lib/repos.ts
          </code>{" "}
          to add teams.
        </p>
      )}
    </div>
  );
}
