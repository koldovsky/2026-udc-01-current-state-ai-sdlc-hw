"use client";

import { FormEvent, useState } from "react";

type NoteFormProps = {
  onAdd: (text: string) => boolean;
};

export function NoteForm({ onAdd }: NoteFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onAdd(text)) {
      setText("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label htmlFor="note-input" className="sr-only">
        Текст нотатки
      </label>
      <input
        id="note-input"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Нова нотатка..."
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Додати
      </button>
    </form>
  );
}
