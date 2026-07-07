"use client";

import { FormEvent, useState } from "react";

type Note = {
  id: string;
  text: string;
};

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");

  const trimmedInput = input.trim();
  const canAdd = trimmedInput.length > 0;

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canAdd) {
      return;
    }

    setNotes((prev) => [...prev, { id: crypto.randomUUID(), text: trimmedInput }]);
    setInput("");
  }

  function handleDelete(id: string) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Новая заметка"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
        />
        <button
          type="submit"
          disabled={!canAdd}
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Добавить
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {notes.length === 0 ? (
          <li className="text-sm text-zinc-500 dark:text-zinc-400">Заметок пока нет</li>
        ) : (
          notes.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex-1 break-words text-zinc-900 dark:text-zinc-50">
                {note.text}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(note.id)}
                aria-label={`Удалить заметку: ${note.text}`}
                className="shrink-0 rounded-md px-2 py-1 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                Удалить
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
