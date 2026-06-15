import type { HistoryEntry } from '@/src/hooks/useCalculator'

type DisplayProps = {
  value: string
  history: HistoryEntry[]
}

export default function Display({ value, history }: DisplayProps) {
  return (
    <div className="bg-zinc-200 dark:bg-zinc-800">
      <div className="text-right text-4xl font-mono px-4 pt-4 pb-2 min-h-[5rem] text-zinc-900 dark:text-zinc-50 truncate">
        {value}
      </div>
      <div className="max-h-24 overflow-y-auto px-4 pb-3 flex flex-col gap-0.5">
        {history.map(entry => (
          <p key={entry.id} className="text-xs text-right font-mono text-zinc-500 dark:text-zinc-400">
            {entry.expression}
          </p>
        ))}
      </div>
    </div>
  )
}
