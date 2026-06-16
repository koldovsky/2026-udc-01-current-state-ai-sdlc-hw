import { NotesApp } from "@/components/NotesApp";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Нотатки
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Додавайте, редагуйте та видаляйте нотатки. Дані зберігаються локально
            у браузері.
          </p>
        </header>
        <NotesApp />
      </main>
    </div>
  );
}
