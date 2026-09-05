import { updateSession } from '@/lib/supabase/middleware'

// Next.js 16 "proxy" convention (formerly middleware.js).
export async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run on every path except static assets and images.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
