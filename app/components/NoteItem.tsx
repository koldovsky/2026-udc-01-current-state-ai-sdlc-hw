"use client";

import { useState } from "react";
import type { Note } from "@/types/note";

type NoteItemProps = {
  note: Note;
  onUpdate: (id: string, text: string) => boolean;
  onDelete: (id: string) => void;
};

export function NoteItem({ note, onUpdate, onDelete }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(note.text);

  function startEditing() {
    setDraftText(note.text);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftText(note.text);
    setIsEditing(false);
  }

  function saveEditing() {
    if (onUpdate(note.id, draftText)) {
      setIsEditing(false);
      return;
    }

    setDraftText(note.text);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <label htmlFor={`edit-${note.id}`} className="sr-only">
          Редагувати нотатку
        </label>
        <textarea
          id={`edit-${note.id}`}
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          rows={3}
          className="mb-3 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveEditing}
            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Зберегти
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Скасувати
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="flex-1 whitespace-pre-wrap text-zinc-900 dark:text-zinc-50">
        {note.text}
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={startEditing}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Редагувати
        </button>
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Видалити
        </button>
      </div>
    </li>
  );
}
