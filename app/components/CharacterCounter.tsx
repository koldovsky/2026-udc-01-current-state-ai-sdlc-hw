'use client'

import { useState } from 'react'

const MAX_LENGTH = 100

export default function CharacterCounter() {
  const [text, setText] = useState('')

  const charCount = text.length
  const isOverLimit = charCount > MAX_LENGTH

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value)
  }

  function handleClear() {
    setText('')
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h1 className="mb-6 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Character Counter
      </h1>

      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Start typing…"
          className={`w-full rounded-lg border px-4 py-3 text-base outline-none transition-colors focus:ring-2 dark:bg-zinc-800 dark:text-zinc-50 ${
            isOverLimit
              ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-900'
              : 'border-zinc-300 focus:ring-zinc-200 dark:border-zinc-600 dark:focus:ring-zinc-700'
          }`}
        />
        <p
          className={`mt-1.5 text-sm ${
            isOverLimit
              ? 'font-semibold text-red-600 dark:text-red-400'
              : 'text-zinc-600 dark:text-zinc-300'
          }`}
        >
          {charCount} / {MAX_LENGTH}
        </p>
      </div>

      <button
        onClick={handleClear}
        disabled={text === ''}
        className={`w-full rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition-colors dark:border-zinc-600 dark:text-zinc-300 ${
          text === ''
            ? 'cursor-not-allowed opacity-40'
            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
        }`}
      >
        Clear
      </button>
    </div>
  )
}
