"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Graph, { type PlottedExpression } from "@/components/Graph";
import { compileExpression } from "@/lib/expression";

type Row = {
  id: string;
  src: string;
  color: string;
};

const PALETTE = ["#1d3fa8", "#b3157a", "#1a7f4e", "#a8580a"];

const INITIAL_ROWS: Row[] = [
  { id: "r1", src: "sin(x)", color: PALETTE[0] },
  { id: "r2", src: "0.1*x^2 - 2", color: PALETTE[1] },
];

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 420;
const INITIAL_SCALE = VIEW_WIDTH / 20;
const ZOOM_STEP = 1.5;

let rowSeq = INITIAL_ROWS.length;
const nextRowId = () => `r${++rowSeq}`;

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export default function Calculator() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  const compiled = useMemo(
    () =>
      rows.map((row) => ({
        row,
        result: compileExpression(row.src),
      })),
    [rows],
  );

  const plotted: PlottedExpression[] = compiled
    .filter((c) => c.result.ok)
    .map((c) => ({
      id: c.row.id,
      color: c.row.color,
      fn: (c.result as { ok: true; fn: (x: number) => number }).fn,
    }));

  const updateSrc = (id: string, src: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, src } : r)));

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const addRow = () => {
    if (rows.length >= 3) return;
    const used = new Set(rows.map((r) => r.color));
    const color = PALETTE.find((c) => !used.has(c)) ?? PALETTE[0];
    setRows((prev) => [...prev, { id: nextRowId(), src: "", color }]);
  };

  const zoomIn = () => setScale((s) => s * ZOOM_STEP);
  const zoomOut = () => setScale((s) => s / ZOOM_STEP);
  const reset = () => {
    setScale(INITIAL_SCALE);
    setCenterX(0);
    setCenterY(0);
  };

  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const graphWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = graphWrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const factor = Math.exp(-e.deltaY * 0.0015);
      setScale((prevScale) => {
        const nextScale = clamp(prevScale * factor, 1, 1e6);
        const k = nextScale / prevScale;
        setCenterX((cx) => cx + (sx - VIEW_WIDTH / 2) * (1 - 1 / k) / prevScale);
        setCenterY((cy) => cy - (sy - VIEW_HEIGHT / 2) * (1 - 1 / k) / prevScale);
        return nextScale;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setCenterX((cx) => cx - dx / scale);
    setCenterY((cy) => cy + dy / scale);
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border-2 border-neutral-900 bg-white/90 p-4 shadow-[4px_4px_0_0_#1a1a1a]">
        <div className="flex flex-col gap-2">
          {compiled.map(({ row, result }) => (
            <div key={row.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full border border-neutral-900"
                  style={{ backgroundColor: row.color }}
                />
                <span className="font-mono text-sm text-neutral-700">y =</span>
                <input
                  className="flex-1 rounded border border-neutral-900 bg-white px-2 py-1 font-mono text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900"
                  value={row.src}
                  onChange={(e) => updateSrc(row.id, e.target.value)}
                  placeholder="e.g. sin(x) + 0.5*x^2"
                  spellCheck={false}
                  aria-label={`expression ${row.id}`}
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1}
                  className="rounded border border-neutral-900 bg-white px-2 py-1 text-sm text-neutral-900 disabled:opacity-30"
                  aria-label={`remove ${row.id}`}
                >
                  ×
                </button>
              </div>
              {!result.ok && row.src.trim() !== "" && (
                <p className="ml-6 font-mono text-xs text-red-700">
                  error: {result.error}
                </p>
              )}
            </div>
          ))}

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={addRow}
              disabled={rows.length >= 3}
              className="rounded border border-neutral-900 bg-white px-3 py-1 text-sm font-medium text-neutral-900 disabled:opacity-40"
            >
              + add expression
            </button>
            <span className="grow" />
            <button
              type="button"
              onClick={zoomOut}
              className="rounded border border-neutral-900 bg-white px-3 py-1 text-sm font-medium text-neutral-900"
            >
              zoom −
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="rounded border border-neutral-900 bg-white px-3 py-1 text-sm font-medium text-neutral-900"
            >
              zoom +
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded border border-neutral-900 bg-white px-3 py-1 text-sm font-medium text-neutral-900"
            >
              reset
            </button>
          </div>
        </div>
      </section>

      <section className="self-start rounded-lg border-2 border-neutral-900 bg-white/90 p-3 shadow-[4px_4px_0_0_#1a1a1a]">
        <div
          ref={graphWrapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <Graph
            width={VIEW_WIDTH}
            height={VIEW_HEIGHT}
            centerX={centerX}
            centerY={centerY}
            scale={scale}
            expressions={plotted}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-neutral-700">
          scale: {scale.toFixed(1)} px/unit · center: ({centerX.toFixed(1)},{" "}
          {centerY.toFixed(1)})
        </p>
      </section>
    </div>
  );
}
