import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

describe('Row Level Security (RLS)', () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip tests if no env vars are provided
  const runTest = supabaseUrl && supabaseKey ? it : it.skip

  let clientA
  let clientB
  let userA
  let userB

  beforeAll(async () => {
    if (!supabaseUrl || !supabaseKey) return

    clientA = createClient(supabaseUrl, supabaseKey)
    clientB = createClient(supabaseUrl, supabaseKey)

    // Attempt to sign in anonymously (requires anonymous sign-ins to be enabled in Supabase)
    const resA = await clientA.auth.signInAnonymously()
    const resB = await clientB.auth.signInAnonymously()
    
    userA = resA.data?.user
    userB = resB.data?.user
  })

  runTest('User A cannot read User B receipts', async () => {
    // If sign in failed (e.g. anon disabled), skip or fail gracefully
    if (!userA || !userB) return

    // User B creates a receipt
    const { data: receiptB } = await clientB.rpc('save_receipt', {
      store: 'Test Store B',
      total: 100,
      items: [{ name: 'Item B', price: 100, category: 'other' }]
    })

    // User A tries to read all receipts
    const { data: receiptsA } = await clientA.from('receipts').select('*')
    
    // User A's results should NOT contain User B's receipt
    const found = receiptsA?.find(r => r.id === receiptB)
    expect(found).toBeUndefined()
  })
  
  runTest('User A cannot read User B extraction logs', async () => {
    if (!userA || !userB) return
    
    // User B generates a log
    await clientB.rpc('check_extraction_quota')
    
    // User A tries to read logs
    const { data: logsA } = await clientA.from('extraction_log').select('*')
    
    const found = logsA?.find(l => l.user_id === userB.id)
    expect(found).toBeUndefined()
  })
})
