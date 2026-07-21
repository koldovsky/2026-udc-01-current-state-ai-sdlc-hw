import type { Note } from "@/app/NotesPage";

interface NotesListProps {
  notes: Note[];
  editingId: string | null;
  editingDraft: string;
  onEditDraftChange: (value: string) => void;
  onEditStart: (note: Note) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
}

export function NotesList({
  notes,
  editingId,
  editingDraft,
  onEditDraftChange,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
}: NotesListProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-bold italic">Notes</h2>

      {notes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-zinc-600 dark:border-zinc-600 dark:text-zinc-300">
          No notes found.
        </p>
      ) : (
        <ul className="space-y-3" aria-label="Notes list">
          {notes.map((note) => {
            const isEditing = editingId === note.id;

            return (
              <li
                key={note.id}
                className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                {isEditing ? (
                  <textarea
                    aria-label={`Edit note ${note.id}`}
                    value={editingDraft}
                    onChange={(event) => onEditDraftChange(event.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{note.content}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onEditSave(note.id)}
                        disabled={!editingDraft.trim()}
                        className="rounded-md bg-zinc-900 px-3 py-2 font-bold italic text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={onEditCancel}
                        className="rounded-md border border-zinc-300 px-3 py-2 font-bold italic dark:border-zinc-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onEditStart(note)}
                      className="rounded-md border border-zinc-300 px-3 py-2 font-bold italic dark:border-zinc-600"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDelete(note.id)}
                    className="rounded-md border border-red-300 px-3 py-2 font-bold italic text-red-700 dark:border-red-500 dark:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}


