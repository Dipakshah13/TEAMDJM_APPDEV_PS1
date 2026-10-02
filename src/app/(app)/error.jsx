'use client'

import { useEffect } from 'react'

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8 text-center bg-cream text-forest">
      <div className="text-6xl mb-4">🪴</div>
      <h2 className="text-2xl font-bold mb-2">App error.</h2>
      <p className="opacity-80 mb-8 max-w-sm">
        Sorry, something went wrong while loading this screen.
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
