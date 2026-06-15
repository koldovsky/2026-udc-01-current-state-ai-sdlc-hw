"use client";

import type { Note } from "@/types/note";

type NoteItemProps = {
  note: Note;
  onDelete: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onToggleImportant: (id: string) => void;
};

export function NoteItem({ note, onDelete, onToggleCompleted, onToggleImportant }: NoteItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <button
        onClick={() => onToggleImportant(note.id)}
        aria-label={note.important ? "Unmark as important" : "Mark as important"}
        className="shrink-0 p-1 text-lg leading-none text-zinc-400 transition-colors hover:text-yellow-500 dark:text-zinc-600 dark:hover:text-yellow-400"
      >
        {note.important ? "★" : "☆"}
      </button>

      <span
        className={`flex-1 text-sm ${
          note.completed
            ? "text-zinc-400 line-through dark:text-zinc-600"
            : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {note.title}
      </span>

      <button
        onClick={() => onToggleCompleted(note.id)}
        aria-label={note.completed ? "Mark as incomplete" : "Mark as completed"}
        className="shrink-0 p-1 text-sm leading-none text-zinc-400 transition-colors hover:text-green-500 dark:text-zinc-600 dark:hover:text-green-400"
      >
        {note.completed ? "✓" : "○"}
      </button>

      <button
        onClick={() => onDelete(note.id)}
        aria-label="Delete note"
        className="shrink-0 p-1 text-sm leading-none text-zinc-400 transition-colors hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400"
      >
        ✕
      </button>
    </li>
  );
}
