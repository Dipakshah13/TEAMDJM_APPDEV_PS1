'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SettingsView({ profile, settings }) {
  const router = useRouter()
  const [activeView, setActiveView] = useState('main')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [theme, setTheme] = useState('Auto')
  
  // Profile Form State
  const [name, setName] = useState(profile?.display_name || '')
  const [isSaving, setIsSaving] = useState(false)

  // Notifications State
  const [notifyDaily, setNotifyDaily] = useState(true)
  const [notifyAlerts, setNotifyAlerts] = useState(true)

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

  const handleSaveProfile = async () => {
    setIsSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name })
        .eq('id', user.id)
        
      if (!error) {
        showToast('Profile updated successfully!')
        setActiveView('main')
        router.refresh()
      } else {
        showToast('Error updating profile')
      }
    }
    setIsSaving(false)
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'Auto' ? 'Dark' : theme === 'Dark' ? 'Light' : 'Auto'
    setTheme(nextTheme)
    
    if (nextTheme === 'Dark') {
      document.body.style.setProperty('--bg', '#191916')
      document.body.style.setProperty('--ink', '#f0f0eb')
      document.body.style.setProperty('--line', '#2d2d2a')
    } else if (nextTheme === 'Light') {
      document.body.style.setProperty('--bg', '#e9e9e2')
      document.body.style.setProperty('--ink', '#222')
      document.body.style.setProperty('--line', '#dcdcd5')
    } else {
      // Auto - remove inline styles
      document.body.style.removeProperty('--bg')
      document.body.style.removeProperty('--ink')
      document.body.style.removeProperty('--line')
    }
  }

  if (activeView === 'edit_profile') {
    return (
      <section className="screen active" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards', paddingBottom: '130px' }}>
        <div className="scan-head">
          <button className="back" onClick={() => setActiveView('main')}>‹</button>
          <div>
            <div className="eyebrow">Account</div>
            <h2>Edit Profile</h2>
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="card">
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#777', textTransform: 'uppercase' }}>Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '10px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)', fontSize: '16px' }}
            />
            <button 
              onClick={handleSaveProfile}
              style={{ width: '100%', padding: '14px', marginTop: '20px', borderRadius: '12px', background: 'var(--ink)', color: 'var(--bg)', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer' }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (activeView === 'notifications') {
    return (
      <section className="screen active" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards', paddingBottom: '130px' }}>
        <div className="scan-head">
          <button className="back" onClick={() => setActiveView('main')}>‹</button>
          <div>
            <div className="eyebrow">System</div>
            <h2>Notifications</h2>
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <strong style={{ display: 'block' }}>Daily Digests</strong>
                <small style={{ color: '#777' }}>Get a summary of your spending every evening.</small>
              </div>
              <input type="checkbox" checked={notifyDaily} onChange={() => setNotifyDaily(!notifyDaily)} style={{ transform: 'scale(1.5)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block' }}>Overspend Alerts</strong>
                <small style={{ color: '#777' }}>Warn me when I'm spending too fast.</small>
              </div>
              <input type="checkbox" checked={notifyAlerts} onChange={() => setNotifyAlerts(!notifyAlerts)} style={{ transform: 'scale(1.5)' }} />
            </div>
          </div>
        </div>
      </section>
    )
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

      <div className="card item" style={{ cursor: 'pointer', transition: 'transform 0.1s' }} onClick={() => setActiveView('edit_profile')} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="ico">👤</div>
        <div>
          <div className="name">Edit Profile</div>
          <div className="cat">Update your name and avatar</div>
        </div>
      </div>

      <div className="card item" style={{ cursor: 'pointer', transition: 'transform 0.1s' }} onClick={() => setActiveView('notifications')} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="ico">🔔</div>
        <div>
          <div className="name">Notifications</div>
          <div className="cat">Manage alerts and daily digests</div>
        </div>
      </div>

      <div className="section-title mt" style={{ marginTop: '30px' }}>
        <h2>System</h2>
      </div>

      <div className="card item" style={{ cursor: 'pointer', transition: 'transform 0.1s' }} onClick={toggleTheme} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="ico">🌙</div>
        <div>
          <div className="name">Theme</div>
          <div className="cat">{theme} Mode</div>
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
