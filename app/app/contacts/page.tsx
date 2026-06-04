import Link from "next/link";
import { contacts } from "@/data/contacts";

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Link
          href="/robots"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to catalog
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Contacts</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Reach out for build support or design questions.
        </p>

        <div className="mt-8 space-y-4">
          {contacts.map((c) => (
            <div
              key={c.email}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{c.name}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{c.role}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{c.note}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <a
                  href={`mailto:${c.email}`}
                  className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  {c.email}
                </a>
                {c.makerworld && (
                  <a
                    href={c.makerworld}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                  >
                    MakerWorld profile
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
