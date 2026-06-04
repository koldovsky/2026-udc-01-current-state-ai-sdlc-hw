import type { Reading } from '@/lib/parser';

const MODE_LABEL: Record<Reading['mode'], string> = {
  VOLTAGE: 'VOLTAGE',
  CURRENT: 'CURRENT',
  RESISTANCE: 'RESISTANCE',
  CONTINUITY: 'CONTINUITY',
  DIODE: 'DIODE',
  CAPACITANCE: 'CAPACITANCE',
};

export function DigitalDisplay({
  reading,
  recording,
}: {
  reading: Reading | null;
  recording: boolean;
}) {
  const display = reading?.display ?? '----';
  const unit = reading?.unit ?? '';
  const mode = reading ? MODE_LABEL[reading.mode] : 'NO SIGNAL';
  const isOL = display === 'OL';

  const valueColor = isOL
    ? 'text-zinc-600'
    : recording
      ? 'text-amber'
      : 'text-accent';

  return (
    <section className="relative rounded-xl border border-zinc-800 bg-black/60 p-6 shadow-inner">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-md bg-zinc-800/80 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-zinc-300">
          {mode}
        </span>
        {recording && (
          <span className="flex items-center gap-2 font-mono text-xs font-semibold text-amber">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber" />
            REC
          </span>
        )}
      </div>

      <div className="flex items-end justify-center gap-3 py-4">
        <span
          className={`font-mono text-7xl font-bold leading-none tabular-nums drop-shadow-[0_0_12px_rgba(57,255,20,0.35)] ${valueColor}`}
        >
          {display}
        </span>
        <span className="pb-1 font-mono text-2xl font-semibold text-zinc-400">{unit}</span>
      </div>
    </section>
  );
}
