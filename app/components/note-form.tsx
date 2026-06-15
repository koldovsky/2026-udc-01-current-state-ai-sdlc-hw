"use client";

import { useState } from "react";

type NoteFormProps = {
  onAdd: (title: string) => void;
};

export function NoteForm({ onAdd }: NoteFormProps) {
  const [value, setValue] = useState("");

  const canSubmit = value.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    onAdd(value.trim());
    setValue("");
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
        placeholder="New note..."
        aria-label="New note title"
        className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
      />
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Add
      </button>
    </div>
  );
}
