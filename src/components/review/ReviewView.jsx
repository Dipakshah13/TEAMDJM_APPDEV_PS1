'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewView({ items }) {
  const router = useRouter()
  // Mock data if no items exist yet
  const displayItems = items?.length > 0 ? items : [
    { name: 'Protein Bar', category: 'Snacks', price: 120, receipts: { store: 'FreshMart' } },
    { name: 'Cold Coffee', category: 'Food & drinks', price: 180, receipts: { store: 'Cafe' } },
    { name: 'Uber', category: 'Transport', price: 214, receipts: { store: 'Uber' } }
  ]
  
  const [idx, setIdx] = useState(0)
  const [swipeState, setSwipeState] = useState(null)
  
  if (idx >= displayItems.length) {
    return (
      <div className="app flex items-center justify-center p-8">
        <div className="card text-center w-full py-12">
          <h2>All caught up! 🎉</h2>
          <p className="text-muted mt-2">No more receipts to review.</p>
          <button className="primary mt-6 px-6" onClick={() => router.push('/')}>Go Home</button>
        </div>
      </div>
    )
  }

  const currentItem = displayItems[idx]

  const handleSwipe = (isWorthIt) => {
    setSwipeState(isWorthIt ? 'right' : 'left')
    setTimeout(() => {
      setIdx(prev => prev + 1)
      setSwipeState(null)
    }, 300)
  }

  let cardTransform = ''
  let cardOpacity = 1
  if (swipeState === 'right') {
    cardTransform = 'translateX(120%) rotate(15deg)'
    cardOpacity = 0
  } else if (swipeState === 'left') {
    cardTransform = 'translateX(-120%) rotate(-15deg)'
    cardOpacity = 0
  }

  return (
    <div className="app">
      <section className="screen active" id="swipe">
        <div className="top">
          <div>
            <div className="eyebrow">Make it honest</div>
            <h2>Worth it or regret?</h2>
          </div>
          <span className="tag">{displayItems.length - idx} items left</span>
        </div>
        
        <p className="mini" style={{ fontSize: '13px', lineHeight: 1.5 }}>
          Swipe right if you'd buy it again. Swipe left if it feels like a leak.
        </p>
        
        <div className="swipe-zone">
          <div 
            className="swipe-card"
            style={{
              transform: cardTransform,
              opacity: cardOpacity,
              transition: swipeState ? 'transform 0.3s ease, opacity 0.3s ease' : 'none'
            }}
          >
            <div>
              <span className="tag">{currentItem.category}</span>
              <h2>{currentItem.name}</h2>
              <div className="big-price">₹{currentItem.price}</div>
              <p className="mini">{currentItem.receipts?.store} · today</p>
            </div>
            <div>
              <div className="mini">YOUR VERDICT</div>
              <div style={{ fontSize: '20px', fontWeight: 850, marginTop: '5px' }}>How do you feel?</div>
            </div>
          </div>
        </div>
        
        <div className="swipe-actions">
          <button className="round no" onClick={() => handleSwipe(false)}>←</button>
          <button className="round yes" onClick={() => handleSwipe(true)}>→</button>
        </div>
      </section>
    </div>
  )
}
