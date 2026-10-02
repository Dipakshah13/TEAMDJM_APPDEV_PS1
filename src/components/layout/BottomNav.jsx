'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, RotateCcw, Plus } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/insights', label: 'Insights', icon: BarChart2 },
  { href: '/review', label: 'Review', icon: RotateCcw },
]

/**
 * Bottom navigation bar with center FAB for Scan.
 * Presentational: no data fetching, no Supabase calls.
 */
export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-dark"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-2 pb-1">
        {/* Home */}
        <NavLink href="/" label="Home" icon={Home} active={pathname === '/'} />

        {/* Insights */}
        <NavLink
          href="/insights"
          label="Insights"
          icon={BarChart2}
          active={pathname.startsWith('/insights')}
        />

        {/* Center FAB — Scan */}
        <div className="flex flex-col items-center">
          <Link
            href="/scan"
            id="nav-scan-fab"
            aria-label="Scan receipt"
            className="
              -mt-6 w-14 h-14 rounded-full bg-forest text-white
              flex items-center justify-center shadow-lg
              hover:bg-forest-mid focus-visible:outline-2 focus-visible:outline-mint
              active:scale-95 transition-all
            "
          >
            <Plus size={28} strokeWidth={2.5} />
          </Link>
          <span className="text-[10px] text-muted mt-1 font-medium">Scan</span>
        </div>

        {/* Review */}
        <NavLink
          href="/review"
          label="Review"
          icon={RotateCcw}
          active={pathname.startsWith('/review')}
        />

        {/* History via Home → Settings fallback placeholder */}
        <NavLink
          href="/history"
          label="History"
          icon={() => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h18"/>
              <path d="M3 9h18"/>
              <path d="M3 15h18"/>
              <path d="M3 21h18"/>
            </svg>
          )}
          active={pathname.startsWith('/history')}
        />
      </div>
    </nav>
  )
}

/**
 * @param {{ href: string, label: string, icon: import('lucide-react').LucideIcon, active: boolean }} props
 */
function NavLink({ href, label, icon: Icon, active }) {
  return (
    <Link
      href={href}
      id={`nav-${label.toLowerCase()}`}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`
        flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px]
        justify-center rounded-xl px-2 transition-colors
        ${active ? 'text-forest' : 'text-muted hover:text-forest-mid'}
      `}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] font-medium ${active ? 'text-forest' : 'text-muted'}`}>
        {label}
      </span>
    </Link>
  )
}
