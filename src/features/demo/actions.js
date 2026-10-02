'use server'

import { createClient } from '@/lib/supabase/server'
import { generateDemoData } from './seed'
import { saveReceipt } from '../scan/actions'
import { revalidatePath } from 'next/cache'

/**
 * Reset all user data by calling the reset_my_data RPC.
 * @param {boolean} demoOnly - If true, only deletes demo data.
 */
export async function resetUserData(demoOnly = true) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.rpc('reset_my_data', { demo_only: demoOnly })
    
    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Reset data error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Seed the user's account with realistic demo data.
 * Clears existing demo data first to prevent duplication.
 */
export async function seedDemoData() {
  try {
    // 1. Clear old demo data first
    await resetUserData(true)

    // 2. Generate and insert new demo data
    const receipts = generateDemoData()
    
    for (const receipt of receipts) {
      // Create a mock payload with full info. We need to save the regret state too.
      // We use the same saveReceipt action for consistency.
      const res = await saveReceipt(receipt, 'demo')
      
      if (!res.success) {
        console.error('Failed to save demo receipt:', res.error)
      } else if (res.receiptId) {
        // If the seed items had 'regret' set to true/false, we need to manually 
        // update them because saveReceipt doesn't accept 'regret' on initial insert
        // (regret is normally added during the Review phase).
        const itemsWithRegret = receipt.items.filter(i => i.regret !== undefined)
        
        if (itemsWithRegret.length > 0) {
          const supabase = await createClient()
          
          for (const item of itemsWithRegret) {
            // Find the inserted item id by normalized name and receipt_id
            const { data: insertedItem } = await supabase
              .from('receipt_items')
              .select('id')
              .eq('receipt_id', res.receiptId)
              .eq('normalized_name', item.normalized_name)
              .single()
              
            if (insertedItem) {
              await supabase
                .from('receipt_items')
                .update({ 
                  regret: item.regret, 
                  regret_at: new Date().toISOString() 
                })
                .eq('id', insertedItem.id)
            }
          }
        }
      }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Seed demo data error:', error)
    return { success: false, error: error.message }
  }
}
