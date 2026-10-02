import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/layout/BottomNav'

/**
 * Signed-in app shell layout.
 * Wraps all protected routes with bottom nav.
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
    <div className="flex flex-col min-h-dvh" style={{ background: 'var(--bg)' }}>
      <main className="flex-1 overflow-y-auto pb-safe">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
