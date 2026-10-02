'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SettingsView({ profile, settings }) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  
  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <section className="screen active" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards', paddingBottom: '130px' }}>
      <div className="scan-head">
        <button className="back" onClick={() => router.back()}>‹</button>
        <div>
          <div className="eyebrow">Preferences</div>
          <h2>Settings</h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 20px 0' }}>
        <div className="avatar" style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
          {profile?.display_name ? profile.display_name[0].toUpperCase() : 'JS'}
        </div>
        <div>
          <h2 style={{ fontSize: '24px', letterSpacing: '-1px' }}>{profile?.display_name || 'Jay Shinde'}</h2>
          <div className="eyebrow" style={{ color: '#52623d' }}>{profile?.email || 'shubham@example.com'}</div>
        </div>
      </div>

      <div className="section-title mt" style={{ marginTop: '40px' }}>
        <h2>Account</h2>
      </div>

      <div className="card item" style={{ cursor: 'pointer', transition: 'transform 0.1s' }} onClick={() => showToast('Profile editor coming in v2')} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="ico">👤</div>
        <div>
          <div className="name">Edit Profile</div>
          <div className="cat">Update your name and avatar</div>
        </div>
      </div>

      <div className="card item" style={{ cursor: 'pointer', transition: 'transform 0.1s' }} onClick={() => showToast('Notification preferences saved')} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="ico">🔔</div>
        <div>
          <div className="name">Notifications</div>
          <div className="cat">Manage alerts and daily digests</div>
        </div>
      </div>

      <div className="section-title mt" style={{ marginTop: '30px' }}>
        <h2>System</h2>
      </div>

      <div className="card item" style={{ cursor: 'pointer', transition: 'transform 0.1s' }} onClick={() => showToast('Dark mode toggled')} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="ico">🌙</div>
        <div>
          <div className="name">Theme</div>
          <div className="cat">System default (Auto)</div>
        </div>
      </div>

      <div className="card item mt" style={{ cursor: 'pointer', background: '#ffe5e0', transition: 'transform 0.1s' }} onClick={handleLogout} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="ico" style={{ background: '#ff5555', color: '#fff' }}>🚪</div>
        <div>
          <div className="name" style={{ color: '#ff5555' }}>
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </div>
          <div className="cat" style={{ color: '#ff5555', opacity: 0.8 }}>Sign out of your account</div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <div className={`toast ${toastMsg ? 'show' : ''}`} style={{ zIndex: 100 }}>
        {toastMsg}
      </div>
    </section>
  )
}
