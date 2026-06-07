type Props = {
  question: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
};

export default function CheckboxQuestion({ question, options, value, onChange, error }: Props) {
  function toggle(option: string) {
    onChange(
      value.includes(option) ? value.filter((o) => o !== option) : [...value, option]
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{option}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
