'use client';

import { useCallback, useRef, useState } from 'react';
import { DigitalDisplay } from '@/components/DigitalDisplay';
import { RealtimeChart, type ChartPoint } from '@/components/RealtimeChart';
import { Controls } from '@/components/Controls';
import { normalizeReading, type Reading } from '@/lib/parser';
import { useSerial } from '@/lib/useSerial';

const MAX_CHART_POINTS = 300;

export default function Home() {
  const [baud, setBaud] = useState(9600);
  const [current, setCurrent] = useState<Reading | null>(null);
  const [recording, setRecording] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [threshold, setThreshold] = useState('1');
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);
  const [chartUnit, setChartUnit] = useState('');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');

  // Full recorded log, kept for CSV export (mirrors the chart session).
  const recordedRef = useRef<Reading[]>([]);
  const [recordedCount, setRecordedCount] = useState(0);

  // recording can flip mid-batch (trigger), so the loop reads it from a ref;
  // mode/unit persist across batches to detect a session change.
  const recordingRef = useRef(recording);
  const modeRef = useRef<string | null>(null);
  const unitRef = useRef<string>('');

  const setRec = useCallback((v: boolean) => {
    recordingRef.current = v;
    setRecording(v);
  }, []);

  const flushSession = useCallback(() => {
    recordedRef.current = [];
    setRecordedCount(0);
    setChartPoints([]);
  }, []);

  const handleReadings = useCallback(
    (readings: Reading[]) => {
      setCurrent(readings[readings.length - 1]);

      for (const r of readings) {
        const { baseValue, baseUnit } = normalizeReading(r);

        // Mode or base-unit change -> flush the chart/recording session.
        // Skip the flush for transient malformed packets with no unit (e.g. "Resistance: ").
        if (baseUnit !== '' && (modeRef.current !== r.mode || unitRef.current !== baseUnit)) {
          modeRef.current = r.mode;
          unitRef.current = baseUnit;
          setChartUnit(baseUnit);
          flushSession();
        }

        // Trigger: arm recording automatically on threshold crossing.
        if (trigger && !recordingRef.current && baseValue !== null) {
          const th = Number.parseFloat(threshold);
          if (Number.isFinite(th) && Math.abs(baseValue) >= th) setRec(true);
        }

        if (recordingRef.current) {
          recordedRef.current.push(r);
          const rMin = rangeMin !== '' ? Number.parseFloat(rangeMin) : null;
          const rMax = rangeMax !== '' ? Number.parseFloat(rangeMax) : null;
          const oor =
            baseValue !== null &&
            ((rMin !== null && baseValue < rMin) || (rMax !== null && baseValue > rMax));
          // Clamp chart display value to the range boundary so OOR dots render at the axis
          // edge rather than being clipped off-canvas by Chart.js. recordedRef keeps the real value.
          let chartV = baseValue;
          if (oor && baseValue !== null) {
            if (rMax !== null && baseValue > rMax) chartV = rMax;
            else if (rMin !== null && baseValue < rMin) chartV = rMin;
          }
          const point: ChartPoint = { t: new Date(r.ts).toLocaleTimeString(), v: chartV, oor };
          setChartPoints((prev) => {
            const next = prev.length >= MAX_CHART_POINTS ? prev.slice(1) : prev.slice();
            next.push(point);
            return next;
          });
        }
      }

      if (recordingRef.current) setRecordedCount(recordedRef.current.length);
    },
    [flushSession, setRec, trigger, threshold, rangeMin, rangeMax],
  );

  const { status, error, connect, disconnect } = useSerial(handleReadings);

  const handleConnect = useCallback(() => connect(baud), [connect, baud]);
  const handleToggleRecord = useCallback(() => setRec(!recordingRef.current), [setRec]);

  const exportCsv = useCallback(() => {
    const rows: string[] = ['Timestamp,Mode,Value,Unit'];
    for (const r of recordedRef.current) {
      const value = r.value === null ? 'OL' : String(r.value);
      rows.push(`${new Date(r.ts).toISOString()},${r.mode},${value},${r.unit}`);
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multimeter-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex items-baseline justify-between">
        <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100">
          Multimeter<span className="text-accent">·</span>Live
        </h1>
        <p className="font-mono text-xs text-zinc-500">Web Serial · real-time</p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Controls
          status={status}
          error={error}
          baud={baud}
          onBaudChange={setBaud}
          onConnect={handleConnect}
          onDisconnect={disconnect}
          recording={recording}
          onToggleRecord={handleToggleRecord}
          trigger={trigger}
          onTriggerChange={setTrigger}
          threshold={threshold}
          onThresholdChange={setThreshold}
          onExport={exportCsv}
          onClear={flushSession}
          canExport={recordedCount > 0}
          rangeMin={rangeMin}
          rangeMax={rangeMax}
          onRangeMinChange={setRangeMin}
          onRangeMaxChange={setRangeMax}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <DigitalDisplay reading={current} recording={recording} />
          <RealtimeChart
            data={chartPoints}
            unit={chartUnit}
            yMin={rangeMin !== '' ? Number.parseFloat(rangeMin) : undefined}
            yMax={rangeMax !== '' ? Number.parseFloat(rangeMax) : undefined}
          />
          <p className="font-mono text-xs text-zinc-600">
            {recordedCount} samples recorded
            {chartUnit && ` · base unit ${chartUnit}`}
          </p>
        </div>
      </div>
    </main>
  );
}
