import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/layout/BottomNav'
import TopBar from '@/components/layout/TopBar'

/**
 * Signed-in app shell layout.
 * Wraps all protected routes with top bar + bottom nav.
 */
export default async function AppLayout({ children }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile for avatar / display name
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, is_anonymous')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col min-h-dvh bg-cream">
      <TopBar profile={profile} />
      <main className="flex-1 overflow-y-auto pb-safe">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
