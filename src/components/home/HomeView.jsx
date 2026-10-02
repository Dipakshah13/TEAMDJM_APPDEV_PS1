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
        
        <div className="card mt" style={{ background: 'linear-gradient(145deg, #fff8e1 0%, #ffecc8 100%)', border: '1px solid #ffdca8', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(255, 152, 0, 0.1)' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '90px', opacity: 0.08, transform: 'rotate(15deg)', pointerEvents: 'none' }}>🔥</div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'linear-gradient(135deg, #ff9800, #ff5722)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)' }}>
              ⏳
            </div>
            <div>
              <strong style={{ color: '#b34700', fontSize: '15px', lineHeight: '1.2', display: 'block', letterSpacing: '-0.3px' }}>
                You&apos;ll hit your limit by the 19th
              </strong>
              <p style={{ color: '#993d00', fontSize: '12.5px', marginTop: '6px', lineHeight: '1.4', opacity: 0.9 }}>
                You&apos;re spending <strong style={{ color: '#cc3300' }}>18% faster</strong> than planned! Try skipping a few small purchases to stretch your budget.
              </p>
            </div>
          </div>
        </div>
        
        <div className="section-title">
          <h2>Recent spends</h2>
          <span className="link" onClick={() => router.push('/history')} style={{ cursor: 'pointer' }}>SEE ALL</span>
        </div>
        
        {items.length === 0 ? (
          <div className="card" style={{ padding: '16px', textAlign: 'center', opacity: 0.7 }}>
            No recent spends yet. Scan a receipt!
          </div>
        ) : (
          items.slice(0, 5).map((item) => (
            <div className="card item" key={item.id}>
              <div className="ico">{item.category === 'food' ? '🍔' : item.category === 'transport' ? '🚕' : item.category === 'groceries' ? '🛒' : '🧾'}</div>
              <div>
                <div className="name">{item.name}</div>
                <div className="cat" style={{ textTransform: 'capitalize' }}>
                  {item.category || 'Other'} · {new Date(item.purchased_at).toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
              </div>
              <div className="price">₹{item.price}</div>
            </div>
          ))
        )}
        
        <div className="card pet mt">
          <div className="eyebrow" style={{ color: '#a9df62' }}>Your budget pet</div>
          <h2 style={{ color: '#fff', marginTop: '5px' }}>Sprout is doing okay.</h2>
          <p>Keep today&apos;s spend under <strong>₹1,240</strong> and Sprout gets a little bigger.</p>
        </div>
    </section>
  )
}
