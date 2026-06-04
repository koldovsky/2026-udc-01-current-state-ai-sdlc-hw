import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRobotById } from "@/data/robots";

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default async function RobotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const robot = getRobotById(id);

  if (!robot) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Link
          href="/robots"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to catalog
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="relative h-72 w-full bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={robot.imageUrl}
              alt={robot.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{robot.name}</h1>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${difficultyColors[robot.difficulty]}`}
              >
                {robot.difficulty}
              </span>
            </div>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Build time: {robot.buildTime}
            </p>

            <p className="mt-4 text-zinc-700 dark:text-zinc-300">{robot.description}</p>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Assembly Instructions
              </h2>
              <ol className="mt-4 space-y-3">
                {robot.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-8">
              <Link
                href={`/robots/${robot.id}/parts`}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                View Parts List →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
