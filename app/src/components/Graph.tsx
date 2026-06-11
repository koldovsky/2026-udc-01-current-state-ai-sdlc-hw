"use client";

import { useEffect, useRef } from "react";
import {
  type Viewport,
  screenToWorldX,
  tickStep,
  worldToScreenX,
  worldToScreenY,
} from "@/lib/viewport";

export type PlottedExpression = {
  id: string;
  color: string;
  fn: (x: number) => number;
};

type Props = {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  scale: number;
  expressions: PlottedExpression[];
};

const CANVAS_BG = "#fffef5";
const GRID_MINOR = "#e7e3c2";
const GRID_MAJOR = "#c9c393";
const AXIS = "#1a1a1a";
const LABEL = "#1a1a1a";

export default function Graph({
  width,
  height,
  centerX,
  centerY,
  scale,
  expressions,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const v: Viewport = { centerX, centerY, scale, width, height };

    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, v);
    drawAxes(ctx, v);

    for (const expr of expressions) {
      drawFunction(ctx, v, expr);
    }
  }, [width, height, centerX, centerY, scale, expressions]);

  return <canvas ref={canvasRef} className="block rounded-md" />;
}

function drawGrid(ctx: CanvasRenderingContext2D, v: Viewport) {
  const step = tickStep(v.scale);
  const minor = step / 5;

  const xMin = screenToWorldX(v, 0);
  const xMax = screenToWorldX(v, v.width);
  const yMin = -(0 - v.height / 2) / v.scale + v.centerY;
  const yMax = -(v.height - v.height / 2) / v.scale + v.centerY;

  ctx.lineWidth = 1;

  ctx.strokeStyle = GRID_MINOR;
  ctx.beginPath();
  for (let x = Math.ceil(xMin / minor) * minor; x <= xMax; x += minor) {
    const sx = Math.round(worldToScreenX(v, x)) + 0.5;
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, v.height);
  }
  for (let y = Math.ceil(yMax / minor) * minor; y <= yMin; y += minor) {
    const sy = Math.round(worldToScreenY(v, y)) + 0.5;
    ctx.moveTo(0, sy);
    ctx.lineTo(v.width, sy);
  }
  ctx.stroke();

  ctx.strokeStyle = GRID_MAJOR;
  ctx.beginPath();
  for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) {
    const sx = Math.round(worldToScreenX(v, x)) + 0.5;
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, v.height);
  }
  for (let y = Math.ceil(yMax / step) * step; y <= yMin; y += step) {
    const sy = Math.round(worldToScreenY(v, y)) + 0.5;
    ctx.moveTo(0, sy);
    ctx.lineTo(v.width, sy);
  }
  ctx.stroke();
}

function drawAxes(ctx: CanvasRenderingContext2D, v: Viewport) {
  const step = tickStep(v.scale);
  const xMin = screenToWorldX(v, 0);
  const xMax = screenToWorldX(v, v.width);
  const yMin = -(0 - v.height / 2) / v.scale + v.centerY;
  const yMax = -(v.height - v.height / 2) / v.scale + v.centerY;

  const axisY = worldToScreenY(v, 0);
  const axisX = worldToScreenX(v, 0);

  ctx.strokeStyle = AXIS;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, axisY);
  ctx.lineTo(v.width, axisY);
  ctx.moveTo(axisX, 0);
  ctx.lineTo(axisX, v.height);
  ctx.stroke();

  ctx.fillStyle = LABEL;
  ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) {
    if (Math.abs(x) < step / 2) continue;
    const sx = worldToScreenX(v, x);
    const sy = clamp(axisY + 4, 4, v.height - 14);
    ctx.fillText(formatTick(x, step), sx, sy);
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let y = Math.ceil(yMax / step) * step; y <= yMin; y += step) {
    if (Math.abs(y) < step / 2) continue;
    const sy = worldToScreenY(v, y);
    const sx = clamp(axisX - 4, 26, v.width - 4);
    ctx.fillText(formatTick(y, step), sx, sy);
  }
}

function drawFunction(
  ctx: CanvasRenderingContext2D,
  v: Viewport,
  expr: PlottedExpression,
) {
  ctx.strokeStyle = expr.color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  let moved = false;
  let prevY = Number.NaN;
  const yClamp = v.height * 4;

  for (let px = 0; px <= v.width; px++) {
    const xw = screenToWorldX(v, px);
    const yw = expr.fn(xw);
    if (!Number.isFinite(yw)) {
      moved = false;
      prevY = Number.NaN;
      continue;
    }
    const sy = worldToScreenY(v, yw);
    if (sy < -yClamp || sy > yClamp) {
      moved = false;
      prevY = sy;
      continue;
    }
    if (!moved) {
      ctx.moveTo(px, sy);
      moved = true;
    } else if (Number.isFinite(prevY) && Math.abs(sy - prevY) > v.height) {
      ctx.moveTo(px, sy);
    } else {
      ctx.lineTo(px, sy);
    }
    prevY = sy;
  }
  ctx.stroke();
}

function formatTick(n: number, step: number): string {
  const decimals = step >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(step)));
  return n.toFixed(decimals);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
