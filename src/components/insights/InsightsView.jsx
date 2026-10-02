'use client'

import React, { useState } from 'react'

export default function InsightsView({ settings, items, today }) {
  const [tab, setTab] = useState('leaks')

  return (
    <section className="screen active" id="insights" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}>
      <div className="top">
          <div>
            <div className="eyebrow">Money patterns</div>
            <h2>Insights</h2>
          </div>
          <span className="tag">October</span>
        </div>
        
        <div className="tabs">
          <button className={`tab ${tab === 'leaks' ? 'on' : ''}`} onClick={() => setTab('leaks')}>Leaks</button>
          <button className={`tab ${tab === 'categories' ? 'on' : ''}`} onClick={() => setTab('categories')}>Categories</button>
        </div>
        
        {tab === 'leaks' && (
          <>
            <div className="card insight">
              <div className="row mb">
                <h2>Regret Leaks</h2>
                <span className="link">LAST 30 DAYS</span>
              </div>
              <div className="leak">
                <div className="bubble">☕</div>
                <div>
                  <b>Cold coffee</b>
                  <div className="mini">6 purchases · ₹1,080</div>
                </div>
                <div className="amount">₹1,080</div>
              </div>
              <div className="leak">
                <div className="bubble">🍟</div>
                <div>
                  <b>Late-night snacks</b>
                  <div className="mini">5 purchases · ₹760</div>
                </div>
                <div className="amount">₹760</div>
              </div>
              <div className="leak">
                <div className="bubble">🚕</div>
                <div>
                  <b>Short rides</b>
                  <div className="mini">4 purchases · ₹690</div>
                </div>
                <div className="amount">₹690</div>
              </div>
            </div>
            
            <div className="card alert mt">
              <strong>Cut cold coffee for a week → limit date moves to the 27th.</strong>
              <p>That's ₹1,080/month you can redirect without changing your essentials.</p>
            </div>
            
            <div className="section-title">
              <h2>Repeat purchases</h2>
            </div>
            <div className="card item">
              <div className="ico">🥤</div>
              <div>
                <div className="name">Cold Coffee</div>
                <div className="cat">6 times · 30 days</div>
              </div>
              <span className="tag">REPEAT</span>
            </div>
            <div className="card item">
              <div className="ico">🍫</div>
              <div>
                <div className="name">Protein Bar</div>
                <div className="cat">4 times · 30 days</div>
              </div>
              <span className="tag">REPEAT</span>
            </div>
          </>
        )}
    </section>
  )
}
