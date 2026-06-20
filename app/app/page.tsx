"use client";

import { useState } from "react";
import { QLIK_FUNCTIONS } from "@/lib/qlik-functions";
import FunctionCard from "@/components/FunctionCard";
import SearchInput from "@/components/SearchInput";

export default function Home() {
  const [query, setQuery] = useState("");

  const filtered = QLIK_FUNCTIONS.filter((fn) => {
    const q = query.toLowerCase();
    return (
      fn.name.toLowerCase().includes(q) ||
      fn.category.toLowerCase().includes(q) ||
      fn.description.toLowerCase().includes(q)
    );
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Qlik Function Cheat Sheet
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {QLIK_FUNCTIONS.length} functions
        </p>
      </div>

      <SearchInput value={query} onChange={setQuery} />

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          No functions match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((fn) => (
            <FunctionCard key={fn.name} fn={fn} />
          ))}
        </div>
      )}
    </main>
  );
}
