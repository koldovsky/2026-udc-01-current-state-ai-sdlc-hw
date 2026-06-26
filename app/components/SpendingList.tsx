import type { SpendingEntry } from "@/lib/types";

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type SpendingListProps = {
  entries: SpendingEntry[];
};

export default function SpendingList({ entries }: SpendingListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-10 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No spendings logged yet.
      </div>
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((entry) => (
        <li
          key={entry.id}
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {entry.category}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {dateFormatter.format(new Date(entry.createdAt))}
            </span>
          </div>
          <span className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {amountFormatter.format(entry.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
