import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { postAuthDestination } from '@/lib/auth'
import { SITE_URL } from '@/lib/site'

// OAuth (and magic-link) redirect target: exchange the code for a session,
// then send the user on to onboarding or where they were headed.
export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/account'
  const origin = process.env.NEXT_PUBLIC_SITE_URL ? SITE_URL : url.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/login?error=oauth`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarded')
    .eq('id', data.user.id)
    .maybeSingle()

  return NextResponse.redirect(`${origin}${postAuthDestination(profile, next)}`)
}
