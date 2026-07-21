interface NotesFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesFilter({ value, onChange }: NotesFilterProps) {
  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <label htmlFor="search-notes" className="block font-bold italic">
        Search notes
      </label>
      <input
        id="search-notes"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        placeholder="Filter by keyword"
      />
    </section>
  );
}

