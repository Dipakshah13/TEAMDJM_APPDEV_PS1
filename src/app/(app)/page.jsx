import { createClient } from '@/lib/supabase/server'
import { istDayString, monthStartUTC } from '@/lib/dates'
import HomeView from '@/components/home/HomeView'

export const metadata = { title: 'Home' }

/**
 * Home page — safe-to-spend, forecast, recent spends, Sprout.
 * Server Component: fetches data, runs insights, passes to HomeView.
 */
export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fetch current month items
  const today = istDayString()
  const monthStart = monthStartUTC(today).toISOString()

  const { data: items } = await supabase
    .from('receipt_items')
    .select('*, receipts(store, source)')
    .eq('user_id', user.id)
    .gte('purchased_at', monthStart)
    .order('purchased_at', { ascending: false })

  // Fetch recent receipts (last 5) for the spends list
  const { data: recentReceipts } = await supabase
    .from('receipts')
    .select('id, store, purchased_at, total, source')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false })
    .limit(5)

  return (
    <HomeView
      settings={settings}
      items={items ?? []}
      recentReceipts={recentReceipts ?? []}
      today={today}
    />
  )
}
