import type { Operator } from '@/src/lib/calculator'

type KeyPadProps = {
  onDigit: (d: string) => void
  onDecimal: () => void
  onOperator: (op: Operator) => void
  onEquals: () => void
  onPercent: () => void
  onCE: () => void
  onClear: () => void
}

type ButtonDef = {
  label: string
  cols?: number
  variant?: 'operator' | 'utility' | 'default'
  action: () => void
}

export default function KeyPad({ onDigit, onDecimal, onOperator, onEquals, onPercent, onCE, onClear }: KeyPadProps) {
  const BUTTONS: ButtonDef[] = [
    { label: 'C',   variant: 'utility',   action: onClear },
    { label: 'CE',  variant: 'utility',   action: onCE },
    { label: '%',   variant: 'utility',   action: onPercent },
    { label: '÷',   variant: 'operator',  action: () => onOperator('/') },
    { label: '7',   action: () => onDigit('7') },
    { label: '8',   action: () => onDigit('8') },
    { label: '9',   action: () => onDigit('9') },
    { label: '×',   variant: 'operator',  action: () => onOperator('*') },
    { label: '4',   action: () => onDigit('4') },
    { label: '5',   action: () => onDigit('5') },
    { label: '6',   action: () => onDigit('6') },
    { label: '−',   variant: 'operator',  action: () => onOperator('-') },
    { label: '1',   action: () => onDigit('1') },
    { label: '2',   action: () => onDigit('2') },
    { label: '3',   action: () => onDigit('3') },
    { label: '+',   variant: 'operator',  action: () => onOperator('+') },
    { label: '0',   cols: 2,              action: () => onDigit('0') },
    { label: '.',   action: onDecimal },
    { label: '=',   variant: 'operator',  action: onEquals },
  ]

  return (
    <div className="grid grid-cols-4 gap-px bg-black/10 dark:bg-white/10">
      {BUTTONS.map((btn, i) => {
        const base = 'flex items-center justify-center h-14 text-lg font-medium transition-colors active:brightness-75 select-none cursor-pointer'
        const variants = {
          operator: 'bg-amber-400 dark:bg-amber-500 text-zinc-900 font-semibold',
          utility:  'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-semibold',
          default:  'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50',
        }
        const colSpan = btn.cols === 2 ? 'col-span-2 justify-start pl-6' : ''
        const variantClass = variants[btn.variant ?? 'default']

        return (
          <button
            key={i}
            onClick={btn.action}
            className={`${base} ${variantClass} ${colSpan}`}
          >
            {btn.label}
          </button>
        )
      })}
    </div>
  )
}
