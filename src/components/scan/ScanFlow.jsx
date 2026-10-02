'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ScanFlow() {
  const router = useRouter()
  const [step, setStep] = useState('scan')

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      setStep('confirm')
    }
  }

  return (
    <>
      {step === 'scan' && (
        <section className="screen active" id="scan" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}>
          <div className="scan-head">
            <button className="back" onClick={() => router.push('/')}>‹</button>
            <div>
              <div className="eyebrow">New expense</div>
              <h2>Scan receipt</h2>
            </div>
          </div>
          
          <label className="drop" htmlFor="file">
            <div className="scan-icon">📷</div>
            <h2>Snap or upload</h2>
            <p>BillBuddy will read every product, price and category — then you can confirm before anything is saved.</p>
            <span className="primary">Choose receipt</span>
            <div className="mini" style={{ marginTop: '12px' }}>JPG, PNG or PDF · up to 10 MB</div>
          </label>
          <input accept="image/*,.pdf" id="file" type="file" onChange={handleFileChange} />
          
          <div className="card" style={{ padding: '16px', marginTop: '14px' }}>
            <b>✨ Tip</b>
            <div className="mini" style={{ marginTop: '5px' }}>Place the whole receipt inside the frame and avoid glare.</div>
          </div>
        </section>
      )}

      {step === 'confirm' && (
        <section className="screen active" id="confirm" style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}>
          <div className="scan-head">
            <button className="back" onClick={() => setStep('scan')}>‹</button>
            <div>
              <div className="eyebrow">AI extraction</div>
              <h2>Check your receipt</h2>
            </div>
          </div>
          
          <div className="card confirm-card">
            <div className="receipt-top row">
              <div>
                <b>FreshMart</b>
                <div className="mini">Today · 6:42 PM</div>
              </div>
              <span className="tag">94% confident</span>
            </div>
            
            <div id="editRows">
              {[['Oats','Groceries','₹220'],['Bananas','Groceries','₹95'],['Protein Bar','Snacks','₹120'],['Cold Coffee','Food & drinks','₹180'],['Soap','Household','₹230']].map((x, i) => (
                <div className="edit-row" key={i}>
                  <div style={{ width: '33%', fontSize: '12px', fontWeight: 750 }}>{x[0]}</div>
                  <input defaultValue={x[1]} />
                  <input defaultValue={x[2]} style={{ maxWidth: '75px' }} />
                </div>
              ))}
            </div>
            
            <div className="row" style={{ paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
              <b>Total</b>
              <b>₹845</b>
            </div>
            
            <button className="primary save" onClick={() => router.push('/review')}>Confirm &amp; review</button>
          </div>
        </section>
      )}
    </>
  )
}
