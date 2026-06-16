"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

type Note = { id: string; text: string; createdAt: number };

const STORAGE_KEY = "udc-notes-v1";
const MAX_LEN = 200;
const ERROR_ID = "note-input-error";
const EMPTY: Note[] = [];

function parse(raw: string): Note[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    return data.filter(
      (n): n is Note =>
        !!n &&
        typeof n === "object" &&
        typeof (n as Note).id === "string" &&
        typeof (n as Note).text === "string" &&
        typeof (n as Note).createdAt === "number",
    );
  } catch {
    return EMPTY;
  }
}

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedNotes: Note[] = EMPTY;

function getSnapshot(): Note[] {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedNotes = raw ? parse(raw) : EMPTY;
  }
  return cachedNotes;
}

function getServerSnapshot(): Note[] {
  return EMPTY;
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

function writeNotes(next: Note[]): void {
  cachedNotes = next;
  cachedRaw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  listeners.forEach((l) => l());
}

export function NoteList() {
  const notes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const [oldestFirst, setOldestFirst] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedNotes = oldestFirst
    ? [...notes].sort((a, b) => a.createdAt - b.createdAt)
    : [...notes].sort((a, b) => b.createdAt - a.createdAt);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      setError("Note can't be empty.");
      return;
    }
    writeNotes([
      { id: crypto.randomUUID(), text, createdAt: Date.now() },
      ...notes,
    ]);
    setDraft("");
    setError(null);
    setAnnounce("Note added");
    inputRef.current?.focus();
  }

  function onDelete(id: string) {
    writeNotes(notes.filter((n) => n.id !== id));
    setAnnounce("Note deleted");
  }

  function onClearAll() {
    if (!window.confirm("Clear all notes?")) return;
    writeNotes([]);
    setAnnounce("All notes cleared");
  }

  return (
    <section className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-2" noValidate>
        <label htmlFor="note-input" className="sr-only">
          New note
        </label>
        <div className="flex gap-2">
          <input
            id="note-input"
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Write a note…"
            maxLength={MAX_LEN}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? ERROR_ID : undefined}
            className="h-10 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:ring-white/20"
          />
          <button
            type="submit"
            className="h-10 rounded-md bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Add
          </button>
        </div>
        {error ? (
          <p
            id={ERROR_ID}
            role="alert"
            aria-live="polite"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No notes yet.
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {notes.length === 1 ? "1 note" : `${notes.length} notes`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={oldestFirst}
                onClick={() => setOldestFirst((prev) => !prev)}
                className="shrink-0 rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus:ring-white/20"
              >
                {oldestFirst ? "Oldest first" : "Newest first"}
              </button>
              <button
                type="button"
                onClick={onClearAll}
                className="shrink-0 rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus:ring-white/20"
              >
                Clear all
              </button>
            </div>
          </div>
          <ul className="flex flex-col">
            {sortedNotes.map((note) => (
              <li
                key={note.id}
                className="flex items-center justify-between gap-3 border-b border-zinc-100 py-2 last:border-b-0 dark:border-zinc-900"
              >
                <span className="break-words text-sm text-black dark:text-zinc-50">
                  {note.text}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(note.id)}
                  aria-label={`Delete note: ${note.text.slice(0, 60)}`}
                  className="shrink-0 rounded-md px-2 py-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus:ring-white/20"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </section>
  );
}
