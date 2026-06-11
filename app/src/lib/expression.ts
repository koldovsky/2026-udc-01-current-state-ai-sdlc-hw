import { compile, type EvalFunction } from "mathjs";

export type CompiledExpression =
  | { ok: true; fn: (x: number) => number }
  | { ok: false; error: string };

export function compileExpression(src: string): CompiledExpression {
  const trimmed = src.trim();
  if (!trimmed) return { ok: false, error: "empty expression" };

  let node: EvalFunction;
  try {
    node = compile(trimmed);
  } catch (err) {
    return { ok: false, error: messageOf(err) };
  }

  const fn = (x: number): number => {
    try {
      const y = node.evaluate({ x });
      return typeof y === "number" ? y : Number.NaN;
    } catch {
      return Number.NaN;
    }
  };

  try {
    const probe = node.evaluate({ x: 0 });
    if (typeof probe !== "number" && !Number.isNaN(probe)) {
      return { ok: false, error: "expression must evaluate to a number" };
    }
  } catch (err) {
    return { ok: false, error: messageOf(err) };
  }

  return { ok: true, fn };
}

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "invalid expression";
}
