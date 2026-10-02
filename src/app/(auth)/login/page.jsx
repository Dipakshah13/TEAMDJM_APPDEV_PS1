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
    <div className="bg-[#0b2b1d] min-h-dvh flex justify-center w-full relative overflow-hidden">
      
      {/* Background Decor Shapes (similar to the green swooshes in the design) */}
      <div className="absolute top-[-10%] left-[-15%] w-[40%] h-[30%] bg-[#69F0AE] opacity-10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[40%] h-[30%] bg-[#69F0AE] opacity-10 rounded-full blur-[100px]" />
      
      {/* Top Left Swoosh */}
      <svg className="absolute top-0 left-0 w-32 h-32 opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,0 L0,50 Q40,40 50,0 Z" fill="#69F0AE" />
      </svg>
      {/* Bottom Right Swoosh */}
      <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M100,100 L100,50 Q60,60 50,100 Z" fill="#69F0AE" />
      </svg>

      {/* Main Container - restricts width to look exactly like a mobile phone */}
      <main className="w-full max-w-[390px] mx-auto min-h-dvh flex flex-col items-center justify-between px-6 py-12 relative z-10 shadow-2xl bg-[#0b2b1d] shadow-[#00000040]">
        
        <div className="w-full flex flex-col items-center flex-1 pt-4">
          
          {/* Header (BillBuddy Logo & Tagline) */}
          <div className="text-center w-full flex flex-col items-center">
            {/* Custom stylized logo text */}
            <div className="relative mb-3">
              <h1 
                className="text-[52px] leading-none font-black text-[#69F0AE] tracking-tighter"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  transform: 'rotate(-3deg) scaleY(1.1)' 
                }}
              >
                <span className="text-white">Bill</span>Buddy
              </h1>
            </div>
            
            <p 
              className="text-white text-[19px] leading-tight font-medium" 
              style={{ 
                fontFamily: 'Georgia, serif', 
                fontStyle: 'italic', 
                transform: 'rotate(-2deg)' 
              }}
            >
              Your money,<br/>without the guilt.
            </p>
          </div>

          {/* Mascot Image - Uses the one I just generated and saved as mascot.jpg! */}
          <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center my-6">
            <img 
              src="/mascot.jpg" 
              alt="BillBuddy Mascot" 
              className="w-full h-full object-contain drop-shadow-2xl rounded-3xl"
              style={{ maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' }}
            />
          </div>

          {/* Features Row */}
          {!showEmailForm && (
            <div className="flex w-full justify-between items-start mb-6 px-1 gap-1">
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#15422d] border border-[#235e43] flex items-center justify-center text-[#69F0AE] shadow-inner">
                  <Camera size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] text-white/90 font-semibold leading-tight">Scan<br/>receipts</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#15422d] border border-[#235e43] flex items-center justify-center text-[#69F0AE] shadow-inner">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] text-white/90 font-semibold leading-tight">Track<br/>spending</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#15422d] border border-[#235e43] flex items-center justify-center text-[#69F0AE] shadow-inner">
                  <BarChart2 size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] text-white/90 font-semibold leading-tight">Get smart<br/>insights</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#15422d] border border-[#235e43] flex items-center justify-center text-[#69F0AE] shadow-inner">
                  <Smile size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] text-white/90 font-semibold leading-tight">Avoid<br/>regret</span>
              </div>
            </div>
          )}
        </div>

        {/* Auth Buttons / Form */}
        <div className="w-full flex flex-col gap-3 z-10 mt-auto pb-4">
          {!showEmailForm ? (
            <>
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full bg-[#69F0AE] text-[#0b2b1d] font-bold py-4 rounded-full flex items-center justify-center gap-3 text-[16px] hover:bg-white transition-transform active:scale-[0.98] shadow-lg"
              >
                {googleLoading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 48 48">
                    <path fill="#0b2b1d" d="M43.6 20H24v8h11.3C33.6 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-transparent border border-white text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 text-[16px] hover:bg-white/10 transition-transform active:scale-[0.98]"
              >
                <Mail size={22} />
                Continue with Email
              </button>
            </>
          ) : (
            <div className="bg-[#15422d] p-6 rounded-[28px] border border-[#235e43] shadow-2xl fade-in w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-bold">Email Sign In</h2>
                <button onClick={() => setShowEmailForm(false)} className="text-white/60 hover:text-white text-sm font-semibold">
                  Cancel
                </button>
              </div>
              
              <div className="flex rounded-xl bg-[#0b2b1d] p-1 mb-5">
                <button
                  onClick={() => { setMode('login'); resetFeedback() }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'login' ? 'bg-[#69F0AE] text-[#0b2b1d]' : 'text-white/60 hover:text-white'}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setMode('signup'); resetFeedback() }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'signup' ? 'bg-[#69F0AE] text-[#0b2b1d]' : 'text-white/60 hover:text-white'}`}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#69F0AE]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0b2b1d] border border-[#235e43] text-white placeholder:text-white/40 text-[15px] focus:outline-none focus:border-[#69F0AE] transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#69F0AE]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min 6 chars' : 'Password'}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-[#0b2b1d] border border-[#235e43] text-white placeholder:text-white/40 text-[15px] focus:outline-none focus:border-[#69F0AE] transition-colors"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69F0AE] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password}
                  className="w-full flex items-center justify-center gap-2 bg-[#69F0AE] text-[#0b2b1d] font-bold py-3.5 rounded-2xl hover:bg-white disabled:opacity-50 transition-colors mt-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              {message && <p className="mt-3 text-[11px] text-center text-[#69F0AE] font-semibold">{message}</p>}
              {error && <p className="mt-3 text-[11px] text-center text-red-400 font-semibold">{error}</p>}
            </div>
          )}

          <p className="mt-4 text-center text-[10px] text-white/50 leading-relaxed font-medium px-4">
            By continuing, you agree to our <br/>
            <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </main>
    </div>
  )
}
