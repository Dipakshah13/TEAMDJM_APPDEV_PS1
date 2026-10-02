'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { istDayString, buildTimestamp } from '@/lib/dates'

/**
 * Save an extracted receipt to the database.
 * @param {import('@/lib/models').ExtractedReceipt} data
 * @param {string} source - 'scan', 'manual', or 'demo'
 * @returns {Promise<{ success: boolean, receiptId?: string, error?: string }>}
 */
export async function saveReceipt(data, source = 'scan') {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Prepare payload for the save_receipt RPC function
    // Date formatting: If date isn't provided, use today's date
    const todayStr = istDayString()
    const receiptDate = data.date || todayStr
    const receiptTime = data.time || '12:00' // Default to noon if no time

    // Combine date and time to ISO string for timestamptz securely using timezone lib
    const purchasedAt = buildTimestamp(receiptDate, receiptTime)

    const payload = {
      store: data.store || 'Unknown Store',
      total: data.total || 0,
      confidence: data.confidence || 1,
      source,
      purchased_at: purchasedAt,
      items: data.items.map(item => ({
        name: item.name,
        normalized_name: item.normalized_name,
        price: item.price,
        category: item.category,
        time_known: !!data.time // True if the receipt had a time, false otherwise
      }))
    }

    // Call the PostgreSQL function
    const { data: receiptId, error: rpcError } = await supabase
      .rpc('save_receipt', { payload })

    if (rpcError) {
      console.error('RPC Error saving receipt:', rpcError)
      return { success: false, error: rpcError.message }
    }

    // Revalidate paths that show receipt data
    revalidatePath('/')
    revalidatePath('/history')
    revalidatePath('/insights')

    return { success: true, receiptId }
  } catch (error) {
    console.error('Failed to save receipt:', error)
    return { success: false, error: error.message }
  }
}
