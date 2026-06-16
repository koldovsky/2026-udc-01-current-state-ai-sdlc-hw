"use client";

import { NoteForm } from "@/components/NoteForm";
import { NoteList } from "@/components/NoteList";
import { useNotes } from "@/hooks/useNotes";

export function NotesApp() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();

  return (
    <div className="flex w-full flex-col gap-8">
      <NoteForm onAdd={addNote} />
      <NoteList notes={notes} onUpdate={updateNote} onDelete={deleteNote} />
    </div>
  );
}
