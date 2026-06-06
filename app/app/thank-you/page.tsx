import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white px-10 py-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Thank you for your feedback!
          </h1>
          <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Your responses have been recorded. We appreciate you helping us improve.
          </p>
        </div>
        <Link
          href="/"
          className="mt-2 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
