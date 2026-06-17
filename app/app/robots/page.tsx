import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { robots } from "@/data/robots";
import SearchBar from "@/components/SearchBar";
import type { RobotsPageProps } from "@/types";

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default async function RobotsPage({ searchParams }: RobotsPageProps) {
  const { q } = await searchParams;
  const query = q?.toLowerCase() ?? "";

  const filtered = query
    ? robots.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      )
    : robots;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Robot Catalog</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          LEGO Spike builds by Spike_Doc
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <Suspense>
            <SearchBar defaultValue={q} />
          </Suspense>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            No robots found for &quot;{q}&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((robot) => (
              <Link
                key={robot.id}
                href={`/robots/${robot.id}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={robot.imageUrl}
                    alt={robot.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{robot.name}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[robot.difficulty]}`}
                    >
                      {robot.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {robot.description}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                    Build time: {robot.buildTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
