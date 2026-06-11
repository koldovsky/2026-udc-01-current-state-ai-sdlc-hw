export type Viewport = {
  centerX: number;
  centerY: number;
  scale: number;
  width: number;
  height: number;
};

export function worldToScreenX(v: Viewport, x: number): number {
  return v.width / 2 + (x - v.centerX) * v.scale;
}

export function worldToScreenY(v: Viewport, y: number): number {
  return v.height / 2 - (y - v.centerY) * v.scale;
}

export function screenToWorldX(v: Viewport, sx: number): number {
  return (sx - v.width / 2) / v.scale + v.centerX;
}

export function screenToWorldY(v: Viewport, sy: number): number {
  return -(sy - v.height / 2) / v.scale + v.centerY;
}

export function tickStep(scale: number): number {
  const pxPerUnit = scale;
  const target = 60;
  const raw = target / pxPerUnit;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  const nice = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return nice * pow;
}
