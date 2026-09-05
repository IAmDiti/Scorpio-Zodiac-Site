import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

/**
 * Refreshes the Supabase auth session on every request and keeps the
 * auth cookies in sync between the request and the response.
 */
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })

  // Before Supabase env vars are configured, do nothing (keeps the site up).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not run code between createServerClient and getUser().
  await supabase.auth.getUser()

  return supabaseResponse
}
