import Link from "next/link";

import { NoteList } from "@/app/notes/NoteList";

export const metadata = {
  title: "Notes",
};

export default function NotesPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 py-16 px-6 sm:px-10">
        <header className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Notes
          </h1>
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Home
          </Link>
        </header>

        <NoteList />
      </main>
    </div>
  );
}
