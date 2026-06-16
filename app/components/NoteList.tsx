"use client";

import type { Note } from "@/types/note";
import { NoteItem } from "@/components/NoteItem";

type NoteListProps = {
  notes: Note[];
  onUpdate: (id: string, text: string) => boolean;
  onDelete: (id: string) => void;
};

export function NoteList({ notes, onUpdate, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Нотаток ще немає. Додайте першу вище.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
