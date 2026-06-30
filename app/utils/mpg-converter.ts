const CONVERSION_FACTOR = (3.78541178 * 100) / 1.60934

export function mpgToL100km(mpg: number): number {
  if (mpg <= 0) return NaN
  const raw = CONVERSION_FACTOR / mpg
  return Math.round(raw * 100) / 100
}
