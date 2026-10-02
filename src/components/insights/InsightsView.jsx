'use client'

import React, { useState, useMemo } from 'react'

export default function InsightsView({ settings, items, today }) {
  const [tab, setTab] = useState('leaks')

  // Calculate insights from raw item data
  const insights = useMemo(() => {
    const counts = {}
    items.forEach(item => {
      const key = item.normalized_name || item.name.toLowerCase().trim()
      if (!counts[key]) {
        counts[key] = { 
          name: item.name, 
          count: 0, 
          total: 0, 
          category: item.category 
        }
      }
      counts[key].count += 1
      counts[key].total += item.price
    })

    // Leaks = bought more than 3 times
    const leaks = Object.values(counts)
      .filter(x => x.count >= 3)
      .sort((a, b) => b.total - a.total)

    // Repeats = bought more than 1 time
    const repeats = Object.values(counts)
      .filter(x => x.count > 1 && x.count < 3)
      .sort((a, b) => b.count - a.count)

    // Category breakdown
    const catTotals = {}
    let grandTotal = 0
    let maxPrice = 0
    let biggestItem = null
    const dayCounts = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 }

    items.forEach(item => {
      // Categories
      catTotals[item.category] = (catTotals[item.category] || 0) + item.price
      
      // Total
      grandTotal += item.price

      // Biggest Purchase
      if (item.price > maxPrice) {
        maxPrice = item.price
        biggestItem = item
      }

      // Busiest Day
      if (item.purchased_at) {
        const dayStr = new Date(item.purchased_at).toLocaleDateString('en-US', { weekday: 'short' })
        dayCounts[dayStr] = (dayCounts[dayStr] || 0) + 1
      }
    })

    const categories = Object.entries(catTotals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)

    // Find busiest day
    let busiestDay = 'None'
    let maxDayCount = 0
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count
        busiestDay = day
      }
    })

    // Average daily spend (assuming 30 days window)
    const avgDaily = Math.round(grandTotal / 30)

    return { leaks, repeats, categories, avgDaily, biggestItem, busiestDay, grandTotal }
  }, [items])

  const getEmoji = (cat) => {
    if (cat === 'food') return '🍔'
    if (cat === 'transport') return '🚕'
    if (cat === 'groceries') return '🛒'
    if (cat === 'entertainment') return '🎬'
    return '💳'
  }

  return (
    <section className="screen active" id="insights" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards', paddingBottom: '90px' }}>
      <div className="top">
          <div>
            <div className="eyebrow">Money patterns</div>
            <h2>Insights</h2>
          </div>
          <span className="tag">Last 60 Days</span>
        </div>
        
        <div className="tabs">
          <button className={`tab ${tab === 'leaks' ? 'on' : ''}`} onClick={() => setTab('leaks')}>Leaks</button>
          <button className={`tab ${tab === 'categories' ? 'on' : ''}`} onClick={() => setTab('categories')}>Categories</button>
          <button className={`tab ${tab === 'trends' ? 'on' : ''}`} onClick={() => setTab('trends')}>Trends</button>
        </div>
        
        {tab === 'leaks' && (
          <>
            <div className="card insight">
              <div className="row mb">
                <h2>Regret Leaks</h2>
                <span className="link">HIGH FREQUENCY</span>
              </div>
              
              {insights.leaks.length === 0 && (
                <p style={{ opacity: 0.7, fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>
                  No major spending leaks found yet! Keep scanning.
                </p>
              )}
              
              {insights.leaks.map((leak, i) => (
                <div className="leak" key={i}>
                  <div className="bubble">{getEmoji(leak.category)}</div>
                  <div>
                    <b style={{ textTransform: 'capitalize' }}>{leak.name}</b>
                    <div className="mini">{leak.count} purchases · ₹{leak.total}</div>
                  </div>
                  <div className="amount">₹{leak.total}</div>
                </div>
              ))}
            </div>
            
            {insights.leaks.length > 0 && (
              <div className="card alert mt">
                <strong>Cut out {insights.leaks[0]?.name} for a week!</strong>
                <p>That's ₹{insights.leaks[0]?.total} you can redirect without changing your essentials.</p>
              </div>
            )}
            
            <div className="section-title">
              <h2>Repeat purchases</h2>
            </div>
            
            {insights.repeats.length === 0 && (
              <div className="card" style={{ padding: '16px', textAlign: 'center', opacity: 0.7 }}>
                No repeat purchases detected.
              </div>
            )}

            {insights.repeats.map((repeat, i) => (
              <div className="card item" key={i}>
                <div className="ico">{getEmoji(repeat.category)}</div>
                <div>
                  <div className="name" style={{ textTransform: 'capitalize' }}>{repeat.name}</div>
                  <div className="cat">{repeat.count} times recently</div>
                </div>
                <span className="tag">REPEAT</span>
              </div>
            ))}
          </>
        )}

        {tab === 'categories' && (
          <div className="card" style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '16px', color: 'white' }}>Category Breakdown</h2>
            {insights.categories.length === 0 ? (
              <p style={{ opacity: 0.7, fontSize: '13px', textAlign: 'center' }}>No data to show.</p>
            ) : (
              insights.categories.map((cat, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div className="row" style={{ marginBottom: '6px' }}>
                    <b style={{ textTransform: 'capitalize', color: 'white' }}>{cat.name}</b>
                    <b style={{ color: 'var(--primary)' }}>₹{cat.total}</b>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--card-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(cat.total / insights.categories[0].total) * 100}%`, height: '100%', background: 'var(--primary)' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'trends' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div className="eyebrow" style={{ color: 'var(--primary)' }}>Average Daily Spend</div>
              <h2 style={{ fontSize: '32px', color: 'white', marginTop: '8px' }}>₹{insights.avgDaily}</h2>
              <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>Based on your recent 30-day activity.</p>
            </div>

            <div className="card item" style={{ padding: '20px' }}>
              <div className="ico">📈</div>
              <div>
                <div className="eyebrow">Busiest Day</div>
                <div className="name" style={{ fontSize: '20px', marginTop: '4px' }}>{insights.busiestDay}s</div>
              </div>
            </div>

            {insights.biggestItem && (
              <div className="card alert mt" style={{ background: '#3b2521', borderColor: '#5e3831' }}>
                <strong style={{ color: '#ffb3a7' }}>Biggest Splurge</strong>
                <div className="row" style={{ marginTop: '12px' }}>
                  <div>
                    <b style={{ color: 'white', textTransform: 'capitalize' }}>{insights.biggestItem.name}</b>
                    <div className="mini">{new Date(insights.biggestItem.purchased_at).toLocaleDateString()}</div>
                  </div>
                  <b style={{ color: '#ffb3a7', fontSize: '18px' }}>₹{insights.biggestItem.price}</b>
                </div>
              </div>
            )}
          </div>
        )}
    </section>
  )
}
