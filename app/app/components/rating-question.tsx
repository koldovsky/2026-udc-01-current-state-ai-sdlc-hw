type Props = {
  question: string;
  value: number | null;
  onChange: (v: number) => void;
  error?: string;
};

export default function RatingQuestion({ question, value, onChange, error }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{question}</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-10 w-10 rounded-lg border text-sm font-semibold transition-colors
              ${
                value === n
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-400"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
        <span>1 — Not at all</span>
        <span>10 — Absolutely</span>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
