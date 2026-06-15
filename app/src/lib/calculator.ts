export type Operator = '+' | '-' | '*' | '/'

export function evaluate(operand: number, operator: Operator, current: number): number {
  switch (operator) {
    case '+': return operand + current
    case '-': return operand - current
    case '*': return operand * current
    case '/': return operand / current
  }
}

export function formatResult(value: number): string {
  if (!isFinite(value) || isNaN(value)) return 'Error'
  return parseFloat(value.toPrecision(10)).toString()
}
