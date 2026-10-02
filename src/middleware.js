/**
 * @file src/middleware.js
 * Next.js route middleware — refreshes Supabase session on every request.
 */

import { updateSession } from '@/lib/supabase/middleware'

/**
 * @param {import('next/server').NextRequest} request
 */
export async function middleware(request) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
