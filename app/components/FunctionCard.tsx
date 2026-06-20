import type { QlikFunction } from "@/lib/qlik-functions";

export default function FunctionCard({ fn }: { fn: QlikFunction }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 flex flex-col gap-2 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {fn.name}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {fn.category}
        </span>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{fn.description}</p>
      <code className="rounded bg-zinc-50 px-2 py-1 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {fn.example}
      </code>
    </div>
  );
}
