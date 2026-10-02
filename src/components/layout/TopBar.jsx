'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'

/**
 * Top bar shown in the signed-in app shell.
 * Presentational — receives profile as a prop.
 *
 * @param {{ profile: { display_name: string|null, avatar_url: string|null, is_anonymous: boolean }|null }} props
 */
export default function TopBar({ profile }) {
  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : 'G'

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-cream-dark px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Logo / wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🌱</span>
          <span className="font-bold text-forest text-lg tracking-tight">BillBuddy</span>
        </div>

        {/* Avatar → Settings */}
        <Link
          href="/settings"
          id="nav-settings"
          aria-label="Open settings"
          className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold hover:bg-forest-mid min-w-[44px] min-h-[44px] transition-colors"
        >
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? 'Avatar'}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </Link>
      </div>
    </header>
  )
}
