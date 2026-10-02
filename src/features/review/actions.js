'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(itemId, isWorthIt) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  // If isWorthIt = true, regret = false (it was worth it)
  // If isWorthIt = false, regret = true (it was a regret)
  const isRegret = !isWorthIt

  const { error } = await supabase
    .from('receipt_items')
    .update({ 
      regret: isRegret, 
      regret_at: new Date().toISOString() 
    })
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to submit review:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/review')
  revalidatePath('/insights')
  
  return { success: true }
}
