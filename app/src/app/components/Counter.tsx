"use client";

import { useState } from "react";

const MIN_COUNT = 0;
const MAX_COUNT = 100;

export default function Counter() {
  const [count, setCount] = useState(MIN_COUNT);

  const decrement = () => setCount((c) => Math.max(MIN_COUNT, c - 1));
  const increment = () => setCount((c) => Math.min(MAX_COUNT, c + 1));
  const reset = () => setCount(MIN_COUNT);

  const atMin = count <= MIN_COUNT;
  const atMax = count >= MAX_COUNT;

  return (
    <section
      aria-label="Counter"
      className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <output
        aria-live="polite"
        className="text-6xl font-semibold tabular-nums text-black dark:text-zinc-50"
      >
        {count}
      </output>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={atMin}
          aria-label="Decrement"
          className="h-12 w-12 rounded-full border border-zinc-300 text-2xl font-medium text-black transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          −
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset"
          className="h-12 rounded-full border border-zinc-300 px-5 text-base font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={increment}
          disabled={atMax}
          aria-label="Increment"
          className="h-12 w-12 rounded-full bg-foreground text-2xl font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#ccc]"
        >
          +
        </button>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Range: {MIN_COUNT}–{MAX_COUNT}
      </p>
    </section>
  );
}
