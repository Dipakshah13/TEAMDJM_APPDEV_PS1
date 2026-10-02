'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function HomeView({ settings, items, recentReceipts, today }) {
  const router = useRouter()
  // We can calculate left this month etc if we want, but let's use the static Stitch design for now
  // with some dynamic data plugged in.
  
  return (
    <section className="screen active" id="home" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}>
        <div className="top">
          <div className="brand">BillBuddy</div>
          <button className="avatar" style={{ border: 'none', cursor: 'pointer' }} onClick={() => router.push('/settings')}>JS</button>
        </div>
        
        <div className="eyebrow">October 2026 · 2nd week</div>
        <h1>Your money,<br/>without the guilt.</h1>
        
        <div className="card safe">
          <div className="eyebrow" style={{ color: '#52623d' }}>Safe to spend today</div>
          <div className="num">₹1,240</div>
          <small>per day · ₹8,680 left this month</small>
          <div className="progress mt">
            <span style={{ width: '63%' }}></span>
          </div>
          <div className="row mt" style={{ fontSize: '11px', fontWeight: 750, color: '#52623d' }}>
            <span>₹15,320 spent</span>
            <span>₹24,000 budget</span>
          </div>
        </div>
        
        <div className="card alert mt">
          <strong>⚠️ At this pace, you'll hit your limit on the 19th.</strong>
          <p>You're spending 18% faster than your monthly plan. Small changes now can move that date.</p>
        </div>
        
        <div className="section-title">
          <h2>Recent spends</h2>
          <span className="link" onClick={() => router.push('/history')} style={{ cursor: 'pointer' }}>SEE ALL</span>
        </div>
        
        {/* Iterate over items or use static for now */}
        <div className="card item">
          <div className="ico">☕</div>
          <div>
            <div className="name">Cold Coffee</div>
            <div className="cat">Food &amp; drinks · today</div>
          </div>
          <div className="price">₹180</div>
        </div>
        
        <div className="card item">
          <div className="ico">🛒</div>
          <div>
            <div className="name">Oats + Bananas</div>
            <div className="cat">Groceries · yesterday</div>
          </div>
          <div className="price">₹265</div>
        </div>
        
        <div className="card item">
          <div className="ico">🚕</div>
          <div>
            <div className="name">Uber</div>
            <div className="cat">Transport · yesterday</div>
          </div>
          <div className="price">₹214</div>
        </div>
        
        <div className="card pet mt">
          <div className="eyebrow" style={{ color: '#a9df62' }}>Your budget pet</div>
          <h2 style={{ color: '#fff', marginTop: '5px' }}>Sprout is doing okay.</h2>
          <p>Keep today's spend under <strong>₹1,240</strong> and Sprout gets a little bigger.</p>
        </div>
    </section>
  )
}
