'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { saveReceipt } from '@/features/scan/actions'
import { compressReceiptImage } from '@/lib/image'
import { getRoast } from '@/lib/roast'
import { Loader2 } from 'lucide-react'

export default function ScanFlow() {
  const router = useRouter()
  const [step, setStep] = useState('scan')
  const [loading, setLoading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  
  // Memoize roast so it doesn't flicker on every keystroke
  const roastMessage = useMemo(() => {
    if (!extractedData || !extractedData.store) return null
    
    // Find highest priced item
    let topItem = 'that item'
    if (items.length > 0) {
      const highest = items.reduce((prev, current) => (prev.price > current.price) ? prev : current)
      topItem = highest.name || 'that item'
    }
    
    return getRoast({
      store: extractedData.store,
      topItem: topItem,
      itemCount: items.length,
      category: items[0]?.category || 'misc',
      total: total,
      regretCount: 0 // We don't have regrets yet for a new bill
    }, 'roast')
  }, [extractedData?.store, items.length, total])

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
  
  const handleManualEntry = () => {
    setStep('confirm')
    setExtractedData({
      store: '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      confidence: 1
    })
    setItems([{ name: '', category: 'food', price: 0 }])
    setTotal(0)
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    if (field === 'price') {
      newItems[index][field] = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
    } else {
      newItems[index][field] = value
    }
    setItems(newItems)
    
    const newTotal = newItems.reduce((acc, curr) => acc + (curr.price || 0), 0)
    setTotal(newTotal)
  }
  
  const handleAddItem = () => {
    setItems([...items, { name: '', category: 'misc', price: 0 }])
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="drop" htmlFor="camera" style={{ cursor: 'pointer' }}>
              <div className="scan-icon">📷</div>
              <h2>Snap receipt</h2>
              <p>Take a photo with your camera right now.</p>
              <span className="primary" style={{ display: 'inline-block', marginTop: '12px' }}>Open Camera</span>
            </label>
            
            <label className="drop" htmlFor="file" style={{ padding: '24px', cursor: 'pointer', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
              <h2>Upload file</h2>
              <div className="mini" style={{ marginTop: '4px' }}>JPG, PNG or PDF · up to 10 MB</div>
            </label>
          </div>

          <input accept="image/*" capture="environment" id="camera" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          <input accept="image/*,.pdf" id="file" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          
          <button 
            className="secondary mt" 
            onClick={handleManualEntry}
            style={{ width: '100%', padding: '16px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            ⌨️ Type manually instead
          </button>
          
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
                      <input 
                        type="time"
                        value={extractedData?.time || ''}
                        onChange={(e) => setExtractedData({...extractedData, time: e.target.value})}
                        style={{ background: 'transparent', border: 'none', color: '#888', width: '80px' }}
                      />
                    </div>
                  </div>
                  <span className="tag">{Math.round((extractedData?.confidence || 1) * 100)}% confident</span>
                </div>
                
                {roastMessage && extractedData?.store && (
                  <div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,142,83,0.1))', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #ff6b6b', marginBottom: '16px', fontSize: '13px', fontStyle: 'italic', color: '#ffc9c9' }}>
                    🔥 "{roastMessage}"
                  </div>
                )}
                
                <div id="editRows" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {items.map((item, i) => (
                    <div className="edit-row" key={i}>
                      <input 
                        style={{ width: '40%', fontSize: '12px', fontWeight: 750, background: 'transparent', border: 'none', color: '#fff' }} 
                        value={item.name} 
                        placeholder="Item name"
                        onChange={(e) => handleItemChange(i, 'name', e.target.value)}
                      />
                      <input 
                        value={item.category} 
                        placeholder="Category"
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
                
                <button onClick={handleAddItem} style={{ width: '100%', padding: '8px', background: 'transparent', color: '#a9df62', border: '1px dashed #a9df62', borderRadius: '6px', fontSize: '12px', marginTop: '8px', cursor: 'pointer' }}>
                  + Add another item
                </button>
                
                <div className="row" style={{ paddingTop: '12px', borderTop: '1px solid var(--line)', marginTop: '16px' }}>
                  <b>Total</b>
                  <b>₹{total}</b>
                </div>
                
                <button 
                  className="primary save" 
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}
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
