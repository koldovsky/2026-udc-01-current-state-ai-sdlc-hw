'use client'

import { useState } from 'react'

type Result = 'even' | 'odd'

function isValidInteger(value: string): boolean {
  return /^-?\d+$/.test(value.trim())
}

export default function EvenOddChecker() {
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const hasError = inputValue.trim() !== '' && !isValidInteger(inputValue)
  const isDisabled = inputValue.trim() === '' || hasError

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
    setResult(null)
  }

  function handleCheck() {
    const num = parseInt(inputValue.trim(), 10)
    setResult(num % 2 === 0 ? 'even' : 'odd')
  }

  function handleClear() {
    setInputValue('')
    setResult(null)
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h1 className="mb-6 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Even / Odd Checker
      </h1>

      <div className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter an integer…"
          className={`w-full rounded-lg border px-4 py-3 text-base outline-none transition-colors focus:ring-2 dark:bg-zinc-800 dark:text-zinc-50 ${
            hasError
              ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-900'
              : 'border-zinc-300 focus:ring-zinc-200 dark:border-zinc-600 dark:focus:ring-zinc-700'
          }`}
        />
        {hasError && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            Please enter a whole integer
          </p>
        )}
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={handleCheck}
          disabled={isDisabled}
          className={`flex-1 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors ${
            isDisabled
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-zinc-700 dark:hover:bg-zinc-200'
          }`}
        >
          Check
        </button>
        <button
          onClick={handleClear}
          className="flex-1 rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>

      {result !== null && (
        <div
          className={`rounded-xl border px-6 py-4 text-center text-lg font-semibold ${
            result === 'even'
              ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300'
              : 'border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-700 dark:bg-pink-950 dark:text-pink-300'
          }`}
        >
          {result === 'even' ? 'Even' : 'Odd'}
        </div>
      )}
    </div>
  )
}
