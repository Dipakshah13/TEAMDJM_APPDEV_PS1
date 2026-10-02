/**
 * @file src/proxy.js
 * Next.js 16 Proxy (formerly middleware.js) — refreshes Supabase session on every request.
 * Renamed from middleware.js per Next.js 16 breaking change.
 */

import { updateSession } from '@/lib/supabase/middleware'

/**
 * @param {import('next/server').NextRequest} request
 */
export async function proxy(request) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
