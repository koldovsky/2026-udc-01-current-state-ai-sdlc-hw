'use client';

import type { SerialStatus } from '@/lib/useSerial';

const BAUD_RATES = [9600, 19200, 38400, 57600, 115200];

const STATUS_STYLE: Record<SerialStatus, { label: string; dot: string; text: string }> = {
  connected: { label: 'Connected', dot: 'bg-accent', text: 'text-accent' },
  connecting: { label: 'Connecting…', dot: 'bg-amber animate-pulse', text: 'text-amber' },
  disconnected: { label: 'Disconnected', dot: 'bg-zinc-500', text: 'text-zinc-400' },
  unsupported: { label: 'Web Serial unsupported', dot: 'bg-red-500', text: 'text-red-400' },
};

export function Controls({
  status,
  error,
  baud,
  onBaudChange,
  onConnect,
  onDisconnect,
  recording,
  onToggleRecord,
  trigger,
  onTriggerChange,
  threshold,
  onThresholdChange,
  onExport,
  onClear,
  canExport,
  rangeMin,
  rangeMax,
  onRangeMinChange,
  onRangeMaxChange,
}: {
  status: SerialStatus;
  error: string | null;
  baud: number;
  onBaudChange: (b: number) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  recording: boolean;
  onToggleRecord: () => void;
  trigger: boolean;
  onTriggerChange: (v: boolean) => void;
  threshold: string;
  onThresholdChange: (v: string) => void;
  onExport: () => void;
  onClear: () => void;
  canExport: boolean;
  rangeMin: string;
  rangeMax: string;
  onRangeMinChange: (v: string) => void;
  onRangeMaxChange: (v: string) => void;
}) {
  const connected = status === 'connected';
  const s = STATUS_STYLE[status];

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 lg:w-72">
      {/* Connection */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
          <span className={s.text}>{s.label}</span>
        </div>

        <label className="flex items-center justify-between text-sm text-zinc-400">
          Baud
          <select
            value={baud}
            disabled={connected || status === 'connecting'}
            onChange={(e) => onBaudChange(Number(e.target.value))}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-sm text-zinc-100 disabled:opacity-50"
          >
            {BAUD_RATES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        {connected ? (
          <button
            onClick={onDisconnect}
            className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={status === 'unsupported' || status === 'connecting'}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Connect
          </button>
        )}

        {error && <p className="font-mono text-xs text-red-400">{error}</p>}
      </div>

      <hr className="border-zinc-800" />

      {/* Recording + trigger */}
      <div className="flex flex-col gap-3">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Recording
        </h2>

        <button
          onClick={onToggleRecord}
          disabled={!connected && !recording}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
            recording
              ? 'bg-amber text-black hover:brightness-110'
              : 'border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40'
          }`}
        >
          {recording ? 'Stop recording' : 'Start recording'}
        </button>

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={trigger}
            onChange={(e) => onTriggerChange(e.target.checked)}
            className="h-4 w-4 accent-amber"
          />
          Trigger mode
        </label>

        <label className="flex items-center justify-between text-sm text-zinc-400">
          Threshold
          <input
            type="number"
            step="any"
            value={threshold}
            onChange={(e) => onThresholdChange(e.target.value)}
            disabled={!trigger}
            className="w-24 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-sm text-zinc-100 disabled:opacity-50"
          />
        </label>
        {trigger && (
          <p className="text-xs text-zinc-500">
            Auto-starts recording when |value| ≥ threshold (in base unit).
          </p>
        )}
      </div>

      <hr className="border-zinc-800" />

      {/* Chart range */}
      <div className="flex flex-col gap-3">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Chart Range
        </h2>
        <label className="flex items-center justify-between text-sm text-zinc-400">
          Min
          <input
            type="number"
            step="any"
            value={rangeMin}
            onChange={(e) => onRangeMinChange(e.target.value)}
            placeholder="auto"
            className="w-24 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-sm text-zinc-100 placeholder:text-zinc-600"
          />
        </label>
        <label className="flex items-center justify-between text-sm text-zinc-400">
          Max
          <input
            type="number"
            step="any"
            value={rangeMax}
            onChange={(e) => onRangeMaxChange(e.target.value)}
            placeholder="auto"
            className="w-24 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-sm text-zinc-100 placeholder:text-zinc-600"
          />
        </label>
        <p className="text-xs text-zinc-500">
          Out-of-range points shown as red dots. Leave blank to auto-scale.
        </p>
      </div>

      <hr className="border-zinc-800" />

      {/* Export + Clear */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onExport}
          disabled={!canExport}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save to CSV
        </button>
        <button
          onClick={onClear}
          disabled={!canExport}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-700 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear data
        </button>
      </div>
    </aside>
  );
}
