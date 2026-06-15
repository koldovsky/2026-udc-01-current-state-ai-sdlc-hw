import { useState } from 'react'
import { evaluate, formatResult, type Operator } from '@/src/lib/calculator'

export type HistoryEntry = { expression: string; id: number }

type CalcState = {
  display: string
  operand: number | null
  operator: Operator | null
  waitingForOperand: boolean
  lastOperator: Operator | null
  lastRhsOperand: number | null
  history: HistoryEntry[]
  idCounter: number
}

const INITIAL_STATE: CalcState = {
  display: '0',
  operand: null,
  operator: null,
  waitingForOperand: false,
  lastOperator: null,
  lastRhsOperand: null,
  history: [],
  idCounter: 0,
}

export function useCalculator() {
  const [state, setState] = useState<CalcState>(INITIAL_STATE)

  function handleDigit(digit: string) {
    setState(s => {
      if (s.waitingForOperand) {
        return { ...s, display: digit, waitingForOperand: false }
      }
      const newDisplay = s.display === '0' && digit !== '.'
        ? digit
        : s.display + digit
      return { ...s, display: newDisplay }
    })
  }

  function handleDecimal() {
    setState(s => {
      if (s.waitingForOperand) {
        return { ...s, display: '0.', waitingForOperand: false }
      }
      if (s.display.includes('.')) return s
      return { ...s, display: s.display + '.' }
    })
  }

  function handleOperator(op: Operator) {
    setState(s => {
      const current = parseFloat(s.display)
      if (s.operator && !s.waitingForOperand) {
        const result = evaluate(s.operand!, s.operator, current)
        const resultStr = formatResult(result)
        return {
          ...s,
          display: resultStr,
          operand: parseFloat(resultStr),
          operator: op,
          waitingForOperand: true,
          lastOperator: null,
          lastRhsOperand: null,
        }
      }
      return {
        ...s,
        operand: current,
        operator: op,
        waitingForOperand: true,
        lastOperator: null,
        lastRhsOperand: null,
      }
    })
  }

  function handleEquals() {
    setState(s => {
      const current = parseFloat(s.display)

      // repeated = re-applies last operator + rhs
      if (s.waitingForOperand && s.lastOperator !== null && s.lastRhsOperand !== null) {
        const result = evaluate(current, s.lastOperator, s.lastRhsOperand)
        const resultStr = formatResult(result)
        const entry: HistoryEntry = {
          expression: `${s.display} ${s.lastOperator} ${s.lastRhsOperand} = ${resultStr}`,
          id: s.idCounter,
        }
        return {
          ...s,
          display: resultStr,
          waitingForOperand: true,
          history: [...s.history, entry].slice(-10),
          idCounter: s.idCounter + 1,
        }
      }

      if (s.operator === null || s.operand === null) return s

      const rhs = current
      const result = evaluate(s.operand, s.operator, rhs)
      const resultStr = formatResult(result)
      const entry: HistoryEntry = {
        expression: `${s.operand} ${s.operator} ${rhs} = ${resultStr}`,
        id: s.idCounter,
      }
      return {
        ...s,
        display: resultStr,
        operand: null,
        operator: null,
        waitingForOperand: true,
        lastOperator: s.operator,
        lastRhsOperand: rhs,
        history: [...s.history, entry].slice(-10),
        idCounter: s.idCounter + 1,
      }
    })
  }

  function handlePercent() {
    setState(s => {
      const value = parseFloat(s.display) / 100
      return { ...s, display: formatResult(value) }
    })
  }

  function handleCE() {
    setState(s => {
      if (s.waitingForOperand) {
        return { ...s, operator: null, waitingForOperand: false }
      }
      const newDisplay = s.display.length > 1 ? s.display.slice(0, -1) : '0'
      return { ...s, display: newDisplay }
    })
  }

  function handleClear() {
    setState(INITIAL_STATE)
  }

  return {
    display: state.display,
    history: state.history,
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handlePercent,
    handleCE,
    handleClear,
  }
}
