'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveReceipt } from '@/features/scan/actions'
import { compressReceiptImage } from '@/lib/image'
import { Loader2 } from 'lucide-react'

export default function ScanFlow() {
  const router = useRouter()
  const [step, setStep] = useState('scan')
  const [loading, setLoading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  
  const handleFileChange = async (e) => {
    if (e.target.files?.length > 0) {
      setStep('confirm')
      setLoading(true)
      setError(null)
      
      const file = e.target.files[0]
      let compressedFile
      try {
        compressedFile = await compressReceiptImage(file)
      } catch (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1]
        
        try {
          const res = await fetch('/api/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, mediaType: compressedFile.type })
          })
          
          const json = await res.json()
          if (!res.ok) throw new Error(json.error || 'Failed to extract')
          
          setExtractedData(json.data)
          setItems(json.data.items || [])
          setTotal(json.data.total || 0)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(compressedFile)
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    if (field === 'price') {
      newItems[index][field] = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
    } else {
      newItems[index][field] = value
    }
    setItems(newItems)
    
    // Recalculate total
    const newTotal = newItems.reduce((acc, curr) => acc + (curr.price || 0), 0)
    setTotal(newTotal)
  }

  const handleConfirm = async () => {
    setLoading(true)
    const finalData = {
      ...extractedData,
      items,
      total
    }
    
    const result = await saveReceipt(finalData)
    setLoading(false)
    
    if (result.success) {
      router.push('/')
      router.refresh()
    } else {
      setError(result.error)
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
            {loading && !extractedData ? (
              <div style={{ padding: '40px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <Loader2 size={32} className="animate-spin text-mint" />
                <p style={{ color: '#fff' }}>Analyzing receipt...</p>
              </div>
            ) : error ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: '#ff6b6b' }}>
                <p>⚠️ {error}</p>
                <button className="primary mt" onClick={() => setStep('scan')}>Try again</button>
              </div>
            ) : (
              <>
                <div className="receipt-top row">
                  <div style={{ flex: 1 }}>
                    <input 
                      value={extractedData?.store || ''} 
                      onChange={(e) => setExtractedData({...extractedData, store: e.target.value})}
                      style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 'bold', width: '100%', marginBottom: '4px' }}
                      placeholder="Store Name"
                    />
                    <div className="mini" style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="date"
                        value={extractedData?.date || ''}
                        onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                        style={{ background: 'transparent', border: 'none', color: '#888' }}
                      />
                      <span>· {extractedData?.time || ''}</span>
                    </div>
                  </div>
                  <span className="tag">{Math.round((extractedData?.confidence || 1) * 100)}% confident</span>
                </div>
                
                <div id="editRows" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {items.map((item, i) => (
                    <div className="edit-row" key={i}>
                      <input 
                        style={{ width: '40%', fontSize: '12px', fontWeight: 750, background: 'transparent', border: 'none', color: '#fff' }} 
                        value={item.name} 
                        onChange={(e) => handleItemChange(i, 'name', e.target.value)}
                      />
                      <input 
                        value={item.category} 
                        onChange={(e) => handleItemChange(i, 'category', e.target.value)}
                      />
                      <input 
                        value={`₹${item.price}`} 
                        onChange={(e) => handleItemChange(i, 'price', e.target.value)}
                        style={{ maxWidth: '75px', textAlign: 'right' }} 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="row" style={{ paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <b>Total</b>
                  <b>₹{total}</b>
                </div>
                
                <button 
                  className="primary save" 
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Confirm &amp; save
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </>
  )
}
