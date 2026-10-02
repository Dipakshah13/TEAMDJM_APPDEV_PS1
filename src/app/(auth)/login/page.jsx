'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  function resetFeedback() {
    setError(null)
    setMessage(null)
  }

  // ── Email + Password ──────────────────────────────────────────────────────
  async function handleEmailAuth(e) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    resetFeedback()

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      setLoading(false)
      if (err) return setError(err.message)
      setMessage('Account created! Check your email to confirm, or sign in if confirmation is off.')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      setLoading(false)
      if (err) return setError(err.message)
      router.push('/')
      router.refresh()
    }
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────
  async function handleGoogle() {
    setGoogleLoading(true)
    resetFeedback()
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) {
      setGoogleLoading(false)
      setError(err.message)
    }
    // On success, browser redirects — no need to setGoogleLoading(false)
  }

  // ── Anonymous guest ───────────────────────────────────────────────────────
  async function handleGuest() {
    setGuestLoading(true)
    resetFeedback()
    const { error: err } = await supabase.auth.signInAnonymously()
    setGuestLoading(false)
    if (err) return setError(err.message)
    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-cream">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3 fade-in">
        <div className="w-20 h-20 rounded-2xl bg-forest flex items-center justify-center shadow-lg">
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
        {/* Google OAuth */}
        <button
          id="btn-google-signin"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-cream-dark bg-white text-forest font-semibold py-3 rounded-xl mb-3 hover:bg-cream disabled:opacity-60 min-h-[44px] transition-colors"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            /* Google G icon */
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.7 39.6 16.4 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C41.1 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
          )}
          Continue with Google
        </button>

        {/* Guest */}
        <button
          id="btn-continue-guest"
          onClick={handleGuest}
          disabled={guestLoading}
          className="w-full flex items-center justify-center gap-2 bg-cream border border-cream-dark text-forest font-semibold py-3 rounded-xl mb-4 hover:bg-cream-dark disabled:opacity-60 min-h-[44px] transition-colors"
        >
          {guestLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          Continue as guest
        </button>

        <div className="relative flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-cream-dark" />
          <span className="text-xs text-muted font-medium">or use email</span>
          <div className="flex-1 h-px bg-cream-dark" />
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl border border-cream-dark overflow-hidden mb-4">
          <button
            id="btn-mode-login"
            onClick={() => { setMode('login'); resetFeedback() }}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-forest text-white' : 'text-muted hover:bg-cream'}`}
          >
            Sign in
          </button>
          <button
            id="btn-mode-signup"
            onClick={() => { setMode('signup'); resetFeedback() }}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-forest text-white' : 'text-muted hover:bg-cream'}`}
          >
            Sign up
          </button>
        </div>

        {/* Email + Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-forest mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-forest mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full pl-9 pr-10 py-3 rounded-xl border border-cream-dark bg-cream text-forest placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-mint min-h-[44px]"
                required
                minLength={6}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-forest min-w-[24px] min-h-[24px] flex items-center justify-center"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            id="btn-email-submit"
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full flex items-center justify-center gap-2 bg-mint text-white font-semibold py-3 rounded-xl hover:bg-forest-mid disabled:opacity-60 min-h-[44px] transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            {mode === 'signup' ? 'Create account' : 'Sign in'}
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
