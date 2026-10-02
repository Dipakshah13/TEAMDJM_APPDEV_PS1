'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function HistoryView({ receipts }) {
  const router = useRouter()
  return (
    <section className="screen active" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}>
      <div className="scan-head">
          <button className="back" onClick={() => router.back()}>‹</button>
          <div>
            <div className="eyebrow">Past records</div>
            <h2>History</h2>
          </div>
      </div>
      
      <div style={{ marginTop: '20px', paddingBottom: '80px' }}>
        {receipts.length === 0 ? (
          <div className="card" style={{ padding: '24px', textAlign: 'center', opacity: 0.7 }}>
            No receipts found.
          </div>
        ) : (
          receipts.map(receipt => (
            <div className="card" key={receipt.id} style={{ marginBottom: '16px', padding: '16px' }}>
              <div className="row" style={{ marginBottom: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', color: '#fff', margin: 0 }}>{receipt.store}</h3>
                  <div className="mini" style={{ marginTop: '4px' }}>
                    {new Date(receipt.purchased_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <b style={{ color: 'var(--primary)', fontSize: '16px' }}>₹{receipt.total}</b>
                  <div className="mini" style={{ marginTop: '4px', textTransform: 'capitalize' }}>
                    {receipt.source}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {receipt.receipt_items.map(item => (
                  <div key={item.id} className="row" style={{ fontSize: '12px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {item.name} <span style={{ opacity: 0.5 }}>({item.category})</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
