interface NoteComposerProps {
  value: string;
  onChange: (value: string) => void;
  onCreate: () => void;
  createDisabled: boolean;
}

export function NoteComposer({
  value,
  onChange,
  onCreate,
  createDisabled,
}: NoteComposerProps) {
  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <label htmlFor="new-note" className="block font-bold italic">
        New note
      </label>
      <textarea
        id="new-note"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        placeholder="Write your note"
      />
      <button
        type="button"
        onClick={onCreate}
        disabled={createDisabled}
        className="rounded-md bg-zinc-900 px-4 py-2 font-bold italic text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Create note
      </button>
    </section>
  );
}

