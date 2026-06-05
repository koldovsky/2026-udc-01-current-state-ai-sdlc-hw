'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Filler, Tooltip, Legend);

export interface ChartPoint {
  t: string; // formatted time label
  v: number | null; // normalized value (null = OL -> line gap)
  oor?: boolean; // out-of-range: value outside user-defined min/max window
}

export function RealtimeChart({
  data,
  unit,
  yMin,
  yMax,
}: {
  data: ChartPoint[];
  unit: string;
  yMin?: number;
  yMax?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  // Create the chart once.
  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'value',
            data: [],
            borderColor: '#39ff14',
            backgroundColor: 'rgba(57,255,20,0.08)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2,
            spanGaps: false,
            fill: true,
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        scales: {
          x: {
            ticks: { color: '#71717a', maxTicksLimit: 6, maxRotation: 0 },
            grid: { color: 'rgba(63,63,70,0.4)' },
          },
          y: {
            title: { display: true, text: unit, color: '#a1a1aa' },
            ticks: { color: '#71717a' },
            grid: { color: 'rgba(63,63,70,0.4)' },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
    chartRef.current = chart;
    return () => {
      chart.destroy();
      chartRef.current = null;
    };
    // Create once; the `unit` axis title is kept current by the update effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push new data on every change (cheap: update('none') skips animation).
  // Chart.js is an external mutable system; mutating the instance imperatively
  // is its intended API and exactly what this effect is for.
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const labels: string[] = [];
    const values: (number | null)[] = [];
    const radii: number[] = [];
    const colors: string[] = [];
    for (const d of data) {
      labels.push(d.t);
      values.push(d.v);
      radii.push(d.oor ? 4 : 0);
      colors.push(d.oor ? '#ef4444' : '#39ff14');
    }
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ds = chart.data.datasets[0] as any;
    ds.pointRadius = radii;
    ds.pointBackgroundColor = colors;
    ds.pointBorderColor = colors;
    const yScale = chart.options.scales?.y as Record<string, unknown> | undefined;
    if (yScale) {
      if (typeof yScale.title === 'object' && yScale.title !== null) {
        (yScale.title as Record<string, unknown>).text = unit;
      }
      yScale.min = yMin;
      yScale.max = yMax;
    }
    chart.update('none');
  }, [data, unit, yMin, yMax]);
  /* eslint-enable react-hooks/immutability */

  return (
    <div className="relative h-72 w-full rounded-xl border border-zinc-800 bg-black/40 p-3 sm:h-96">
      <canvas ref={canvasRef} />
    </div>
  );
}
