"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => Math.max(0, c - 1));
  const reset = () => setCount(0);

  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Лічильник
      </h1>

      <output className="text-6xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
        {count}
      </output>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={decrement}
          disabled={count === 0}
          className="h-12 w-16 rounded-full bg-zinc-200 text-xl font-medium text-zinc-900 transition-colors hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
        >
          −1
        </button>
        <button
          type="button"
          onClick={increment}
          className="h-12 w-16 rounded-full bg-zinc-900 text-xl font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          +1
        </button>
      </div>

      <button
        type="button"
        onClick={reset}
        className="text-sm font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline dark:hover:text-zinc-50"
      >
        Скинути
      </button>
    </div>
  );
}
