import { NotesApp } from "@/components/NotesApp";

export default function Home() {
  return (
    <div className="flex flex-1 items-start justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-3xl">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Заметки
        </h1>
        <NotesApp />
      </main>
    </div>
  );
}
