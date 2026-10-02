import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8 text-center bg-cream text-forest">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="opacity-80 mb-8 max-w-sm">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link href="/" className="primary px-8 inline-block" style={{ textDecoration: 'none' }}>
        Go back home
      </Link>
    </div>
  )
}
