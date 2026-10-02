'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Lock, Camera, Sparkles, BarChart2, Smile, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [showEmailForm, setShowEmailForm] = useState(false)
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-between px-6 py-12 bg-forest overflow-x-hidden relative" style={{ backgroundColor: '#0f3d2a' }}>
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[50%] bg-mint/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] bg-mint/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center z-10 w-full flex-1 pt-6">
        
        {/* Header */}
        <div className="text-center mb-2 w-full">
          {/* We use styled text to mimic the BillBuddy logo. Once you have the SVG, swap it here! */}
          <h1 
            className="text-5xl font-black text-mint tracking-tighter" 
            style={{ fontFamily: '"Arial Black", Impact, sans-serif', transform: 'rotate(-2deg)' }}
          >
            Bill<span className="text-white">Buddy</span>
          </h1>
          <p className="text-white/90 text-[22px] font-medium mt-4 tracking-tight" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', transform: 'rotate(-2deg)' }}>
            Your money, <br/> without the guilt.
          </p>
        </div>

        {/* Mascot Image */}
        <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center my-4">
          <img 
            src="/mascot.png" 
            alt="BillBuddy Mascot" 
            className="w-full h-full object-contain drop-shadow-2xl z-10"
            onError={(e) => {
              // Hide broken image and show fallback box
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback box if mascot.png is missing from public folder */}
          <div className="hidden absolute inset-0 bg-white/5 rounded-3xl items-center justify-center border border-white/10 backdrop-blur-sm z-0">
            <span className="text-white/50 text-sm font-medium text-center px-4">
              [Save your mascot image as public/mascot.png]
            </span>
          </div>
        </div>

        {/* Features Row */}
        {!showEmailForm && (
          <div className="flex w-full justify-between items-start my-4 px-1 gap-2">
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-mint">
                <Camera size={20} />
              </div>
              <span className="text-[11px] text-white/90 font-medium leading-tight">Scan<br/>receipts</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-mint">
                <Sparkles size={20} />
              </div>
              <span className="text-[11px] text-white/90 font-medium leading-tight">Track<br/>spending</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-mint">
                <BarChart2 size={20} />
              </div>
              <span className="text-[11px] text-white/90 font-medium leading-tight">Get smart<br/>insights</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-mint">
                <Smile size={20} />
              </div>
              <span className="text-[11px] text-white/90 font-medium leading-tight">Avoid<br/>regret</span>
            </div>
          </div>
        )}
      </div>

      {/* Auth Buttons / Form */}
      <div className="w-full max-w-sm flex flex-col gap-4 z-10 w-full mt-auto pb-4">
        {!showEmailForm ? (
          <>
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full bg-mint text-[#0f3d2a] font-bold py-[18px] rounded-full flex items-center justify-center gap-3 text-[17px] hover:bg-mint-light transition-transform active:scale-[0.98]"
            >
              {googleLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <svg width="22" height="22" viewBox="0 0 48 48">
                  <path fill="#0f3d2a" d="M43.6 20H24v8h11.3C33.6 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
                </svg>
              )}
              Continue with Google
            </button>

            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full bg-transparent border-[1.5px] border-white/50 text-white font-bold py-[18px] rounded-full flex items-center justify-center gap-3 text-[17px] hover:bg-white/10 transition-transform active:scale-[0.98]"
            >
              <Mail size={22} />
              Continue with Email
            </button>
          </>
        ) : (
          <div className="bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20 fade-in shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Email Sign In</h2>
              <button onClick={() => setShowEmailForm(false)} className="text-white/60 hover:text-white text-sm">
                Cancel
              </button>
            </div>
            
            <div className="flex rounded-xl bg-black/20 p-1 overflow-hidden mb-6">
              <button
                onClick={() => { setMode('login'); resetFeedback() }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${mode === 'login' ? 'bg-mint text-[#0f3d2a]' : 'text-white/60 hover:text-white'}`}
              >
                Sign in
              </button>
              <button
                onClick={() => { setMode('signup'); resetFeedback() }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${mode === 'signup' ? 'bg-mint text-[#0f3d2a]' : 'text-white/60 hover:text-white'}`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/40 text-[15px] focus:outline-none focus:border-mint focus:bg-black/40 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min 6 characters' : 'Password'}
                    className="w-full pl-11 pr-12 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/40 text-[15px] focus:outline-none focus:border-mint focus:bg-black/40 transition-colors"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="w-full flex items-center justify-center gap-2 bg-mint text-[#0f3d2a] font-bold py-4 rounded-2xl hover:bg-mint-light disabled:opacity-50 transition-colors mt-2 text-[16px]"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {message && <p className="mt-4 text-xs text-center text-mint font-medium">{message}</p>}
            {error && <p className="mt-4 text-xs text-center text-red-300 font-medium">{error}</p>}
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-white/60 px-4 leading-relaxed font-medium">
          By continuing, you agree to our <br/>
          <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>
        </p>
      </div>
    </main>
  )
}
