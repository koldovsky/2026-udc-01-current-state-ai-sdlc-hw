"use client";

import { useCounter } from "@/hooks/use-counter";

export function Counter() {
  const { value, increment, decrement, reset } = useCounter();

  return (
    <div className="flex flex-col items-center gap-6">
      <p
        aria-live="polite"
        aria-label={`Counter value: ${value}`}
        className="text-6xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50"
      >
        {value}
      </p>
      <div className="flex gap-3">
        <button
          onClick={decrement}
          disabled={value === 0}
          aria-label="Decrement"
          className="rounded-lg border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          −
        </button>
        <button
          onClick={reset}
          aria-label="Reset"
          className="rounded-lg border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
        <button
          onClick={increment}
          aria-label="Increment"
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          +
        </button>
      </div>
    </div>
  );
}
