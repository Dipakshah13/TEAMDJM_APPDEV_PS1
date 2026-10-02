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
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              className="btn primary" 
              onClick={async () => {
                const { seedDemoData } = await import('@/features/demo/actions')
                await seedDemoData()
                alert('Demo data seeded! Check the Home and Insights tabs.')
              }}
            >
              Seed Demo Data
            </button>
            <button 
              className="btn secondary outline" 
              onClick={async () => {
                const { resetUserData } = await import('@/features/demo/actions')
                await resetUserData(false)
                alert('All data reset!')
              }}
            >
              Reset All Data
            </button>
          </div>
        </div>
    </section>
  )
}
