'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsView({ profile, settings }) {
  const router = useRouter()
  return (
    <section className="screen active" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}>
      <div className="scan-head">
          <button className="back" onClick={() => router.push('/')}>‹</button>
          <div>
            <div className="eyebrow">Preferences</div>
            <h2>Settings</h2>
          </div>
        </div>
        <div className="card" style={{ padding: '16px', marginTop: '20px' }}>
          <p className="mini">Coming soon.</p>
        </div>
    </section>
  )
}
