'use client'

import { useCalculator } from '@/src/hooks/useCalculator'
import Display from '@/src/components/Display'
import KeyPad from '@/src/components/KeyPad'

export default function Calculator() {
  const {
    display, history,
    handleDigit, handleDecimal, handleOperator,
    handleEquals, handlePercent, handleCE, handleClear,
  } = useCalculator()

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10">
      <Display value={display} history={history} />
      <KeyPad
        onDigit={handleDigit}
        onDecimal={handleDecimal}
        onOperator={handleOperator}
        onEquals={handleEquals}
        onPercent={handlePercent}
        onCE={handleCE}
        onClear={handleClear}
      />
    </div>
  )
}
