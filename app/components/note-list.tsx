import type { Note } from "@/types/note";
import { NoteItem } from "@/components/note-item";

type NoteListProps = {
  notes: Note[];
  onDelete: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onToggleImportant: (id: string) => void;
};

export function NoteList({ notes, onDelete, onToggleCompleted, onToggleImportant }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-zinc-400 dark:text-zinc-600">
        No notes yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onDelete={onDelete}
          onToggleCompleted={onToggleCompleted}
          onToggleImportant={onToggleImportant}
        />
      ))}
    </ul>
  );
}
