import Link from "next/link";
import { notFound } from "next/navigation";
import { getRobotById } from "@/data/robots";

const materialColors: Record<string, string> = {
  PLA: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PETG: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  TPU: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export default async function PartsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const robot = getRobotById(id);

  if (!robot) notFound();

  const totalParts = robot.parts.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Link
          href={`/robots/${robot.id}`}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to {robot.name}
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Parts List — {robot.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {robot.parts.length} unique parts · {totalParts} total pieces
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Part
                </th>
                <th className="px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                  Qty
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Material
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">
                  Print Time
                </th>
              </tr>
            </thead>
            <tbody>
              {robot.parts.map((part, i) => (
                <tr
                  key={part.id}
                  className={`border-b border-zinc-100 last:border-0 dark:border-zinc-800 ${
                    i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-800/20"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    {part.name}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-700 dark:text-zinc-300">
                    {part.quantity}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        materialColors[part.material] ?? "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {part.material}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400">
                    {part.printTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
