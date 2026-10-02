import { createClient } from '@/lib/supabase/server'
import HistoryView from '@/components/history/HistoryView'

export const metadata = { title: 'History' }

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: receipts } = await supabase
    .from('receipts')
    .select('*, receipt_items(*)')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false })
    .limit(100)

  return <HistoryView receipts={receipts ?? []} />
}
