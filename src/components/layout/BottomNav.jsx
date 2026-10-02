'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()
  
  // Hide bottom nav on certain pages if needed, e.g., the scan page
  if (pathname === '/scan') return null;

  return (
    <>
      <Link href="/scan" className="fab" style={{ textDecoration: 'none', display: 'grid', placeItems: 'center' }}>
        +
      </Link>
      
      <nav className="bottom">
        <NavLink href="/" label="Home" icon="⌂" active={pathname === '/'} />
        <NavLink href="/insights" label="Insights" icon="◔" active={pathname.startsWith('/insights')} />
        <NavLink href="/review" label="Review" icon="♡" active={pathname.startsWith('/review')} />
      </nav>
    </>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      className={`nav ${active ? 'active' : ''}`}
      style={{ textDecoration: 'none' }}
    >
      <b>{icon}</b>
      {label}
    </Link>
  )
}
