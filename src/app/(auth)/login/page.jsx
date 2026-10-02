'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Sign In',
}

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  async function handleMagicLink(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setMessage('Check your email for the magic link! ✉️')
    }
  }

  async function handleGuest() {
    setGuestLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.signInAnonymously()
    setGuestLoading(false)

    if (err) {
      setError(err.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-cream">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3 fade-in">
        <div className="w-20 h-20 rounded-2xl bg-forest flex items-center justify-center shadow-lg">
          {/* Fallback logo if image isn't present yet */}
          <span className="text-3xl">🌱</span>
        </div>
        <h1 className="text-3xl font-bold text-forest tracking-tight">BillBuddy</h1>
        <p className="text-center text-muted text-sm max-w-xs leading-relaxed">
          Scan receipts. Stop regretting. Start saving.
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-cream-dark p-6 fade-in"
        style={{ animationDelay: '0.1s' }}
      >
        {/* Guest CTA */}
        <button
          id="btn-continue-guest"
          onClick={handleGuest}
          disabled={guestLoading}
          className="w-full flex items-center justify-center gap-2 bg-forest text-white font-semibold py-4 rounded-xl mb-4 hover:bg-forest-mid disabled:opacity-60 min-h-[44px]"
        >
          {guestLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          Continue as guest
        </button>

        <div className="relative flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-cream-dark" />
          <span className="text-xs text-muted font-medium">or sign in with email</span>
          <div className="flex-1 h-px bg-cream-dark" />
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLink} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-forest mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-cream-dark bg-cream text-forest placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-mint min-h-[44px]"
                required
              />
            </div>
          </div>

          <button
            id="btn-send-magic-link"
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 bg-mint text-white font-semibold py-3 rounded-xl hover:bg-forest-mid disabled:opacity-60 min-h-[44px]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            Send magic link
          </button>
        </form>

        {/* Feedback */}
        {message && (
          <p className="mt-3 text-xs text-center text-success font-medium bg-mint/10 rounded-lg py-2 px-3">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-3 text-xs text-center text-danger font-medium bg-danger/10 rounded-lg py-2 px-3">
            {error}
          </p>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted max-w-xs fade-in" style={{ animationDelay: '0.2s' }}>
        By continuing, you agree that receipts are processed to extract items only — images are never stored.
      </p>
    </main>
  )
}
