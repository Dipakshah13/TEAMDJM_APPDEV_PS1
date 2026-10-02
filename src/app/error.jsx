'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8 text-center bg-cream text-forest">
      <div className="text-6xl mb-4">🥴</div>
      <h2 className="text-2xl font-bold mb-2">Oops, something broke.</h2>
      <p className="opacity-80 mb-8 max-w-sm">
        We hit a snag trying to load this page. Sprout is looking into it.
      </p>
      <button
        onClick={() => reset()}
        className="primary px-8"
      >
        Try again
      </button>
    </div>
  )
}
