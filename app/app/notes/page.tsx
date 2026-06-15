"use client";

import { useNotes } from "@/hooks/use-notes";
import { NoteForm } from "@/components/note-form";
import { NoteList } from "@/components/note-list";

export default function NotesPage() {
  const { notes, addNote, deleteNote, toggleCompleted, toggleImportant } = useNotes();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Notes
        </h1>
        <NoteForm onAdd={addNote} />
        <NoteList
          notes={notes}
          onDelete={deleteNote}
          onToggleCompleted={toggleCompleted}
          onToggleImportant={toggleImportant}
        />
      </main>
    </div>
  );
}
