import { createClient } from '@/lib/supabase/server'
import { istDayString, daysAgoUTC } from '@/lib/dates'
import { regretLeaks, repeatPurchases, smallSpendLeaks } from '@/lib/insights'
import InsightsView from '@/components/insights/InsightsView'

export const metadata = { title: 'Insights' }

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = istDayString()
  const windowStart = daysAgoUTC(60, today)

  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: items } = await supabase
    .from('receipt_items')
    .select('*')
    .eq('user_id', user.id)
    .gte('purchased_at', windowStart.toISOString())
    .order('purchased_at', { ascending: false })

  const safeItems = items ?? []
  
  const computedLeaks = regretLeaks({ items: safeItems, settings, today })
  const computedRepeats = repeatPurchases(safeItems, today)
  const computedSmalls = smallSpendLeaks(safeItems, settings?.small_spend_threshold || 100, today)

  return (
    <InsightsView
      settings={settings}
      items={safeItems}
      computedLeaks={computedLeaks}
      computedRepeats={computedRepeats}
      computedSmalls={computedSmalls}
      today={today}
    />
  )
}
