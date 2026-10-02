import { createClient } from '@/lib/supabase/server'
import ReviewView from '@/components/review/ReviewView'

export const metadata = { title: 'Review Queue' }

export default async function ReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Items not yet swiped (regret = null)
  const { data: items } = await supabase
    .from('receipt_items')
    .select('*, receipts(store)')
    .eq('user_id', user.id)
    .is('regret', null)
    .order('purchased_at', { ascending: false })
    .limit(50)

  return <ReviewView items={items ?? []} />
}
