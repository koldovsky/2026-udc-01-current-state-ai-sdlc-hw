"use client";

import { useState, useSyncExternalStore } from "react";
import {
  addNote,
  deleteNote,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/notesStore";

const INPUT_ID = "note-text";
const ERROR_ID = "note-text-error";

export default function NotesList() {
  // null означає, що гідратація ще триває і localStorage ще не прочитано.
  const notes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <form
        className="flex flex-col gap-2"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();

          const trimmedText = text.trim();
          if (trimmedText === "") {
            setError("Введіть текст нотатки");
            return;
          }

          addNote(trimmedText);
          setText("");
          setError(null);
        }}
      >
        <label htmlFor={INPUT_ID} className="text-sm font-medium">
          Нова нотатка
        </label>
        <div className="flex gap-2">
          <input
            id={INPUT_ID}
            type="text"
            value={text}
            autoComplete="off"
            aria-invalid={error !== null}
            aria-describedby={error !== null ? ERROR_ID : undefined}
            onChange={(event) => {
              setText(event.target.value);
              setError(null);
            }}
            className="min-w-0 flex-1 rounded-md border border-foreground/20 bg-transparent px-3 py-2 aria-invalid:border-danger"
          />
          <button
            type="submit"
            disabled={notes === null}
            className="rounded-md bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            Додати
          </button>
        </div>
        {error !== null ? (
          <p id={ERROR_ID} role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </form>

      {notes === null ? (
        <p className="text-foreground/60">Завантаження…</p>
      ) : notes.length === 0 ? (
        <p className="text-foreground/60">Нотаток поки немає</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-start justify-between gap-4 rounded-md border border-foreground/15 p-3"
            >
              <span className="min-w-0 break-words">{note.text}</span>
              <button
                type="button"
                aria-label={`Видалити нотатку: ${note.text}`}
                onClick={() => deleteNote(note.id)}
                className="shrink-0 text-sm text-foreground/60 underline transition-colors hover:text-danger"
              >
                Видалити
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
