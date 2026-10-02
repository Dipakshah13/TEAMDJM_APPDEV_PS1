'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function HistoryView({ receipts }) {
  const router = useRouter()
  return (
    <div className="app">
      <section className="screen active">
        <div className="scan-head">
          <button className="back" onClick={() => router.push('/')}>‹</button>
          <div>
            <div className="eyebrow">Past records</div>
            <h2>History</h2>
          </div>
        </div>
        <div className="card" style={{ padding: '16px', marginTop: '20px' }}>
          <p className="mini">Coming soon.</p>
        </div>
      </section>
    </div>
  )
}
