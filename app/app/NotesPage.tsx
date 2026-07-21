"use client";

import { useMemo, useState } from "react";
import { NoteComposer } from "@/app/NoteComposer";
import { NotesFilter } from "@/app/NotesFilter";
import { NotesList } from "@/app/NotesList";

export interface Note {
  id: string;
  content: string;
  createdAt: number;
}

function createNoteId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState("");

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return notes;
    }

    return notes.filter((note) =>
      note.content.toLowerCase().includes(normalizedQuery),
    );
  }, [notes, query]);

  const handleCreate = () => {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const newNote: Note = {
      id: createNoteId(),
      content: trimmed,
      createdAt: Date.now(),
    };

    setNotes((previousNotes) => [newNote, ...previousNotes]);
    setDraft("");
  };

  const handleDelete = (id: string) => {
    setNotes((previousNotes) => previousNotes.filter((note) => note.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setEditingDraft("");
    }
  };

  const handleEditStart = (note: Note) => {
    setEditingId(note.id);
    setEditingDraft(note.content);
  };

  const handleEditSave = (id: string) => {
    const trimmed = editingDraft.trim();

    if (!trimmed) {
      return;
    }

    setNotes((previousNotes) =>
      previousNotes.map((note) => {
        if (note.id !== id) {
          return note;
        }

        return {
          ...note,
          content: trimmed,
        };
      }),
    );

    setEditingId(null);
    setEditingDraft("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingDraft("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold italic">Notes List</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Create, edit, delete, and filter notes in this session.
          </p>
        </header>

        <NoteComposer
          value={draft}
          onChange={setDraft}
          onCreate={handleCreate}
          createDisabled={!draft.trim()}
        />

        <NotesFilter value={query} onChange={setQuery} />

        <NotesList
          notes={filteredNotes}
          editingId={editingId}
          editingDraft={editingDraft}
          onEditDraftChange={setEditingDraft}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}


