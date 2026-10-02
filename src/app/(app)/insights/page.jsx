import { createClient } from '@/lib/supabase/server'
import { istDayString, daysAgoUTC } from '@/lib/dates'
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

  return (
    <InsightsView
      settings={settings}
      items={items ?? []}
      today={today}
    />
  )
}
