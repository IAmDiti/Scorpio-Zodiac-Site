import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { postAuthDestination } from '@/lib/auth'
import { SITE_URL } from '@/lib/site'

// Email confirmation link target. Supabase's email template must point here:
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}
export async function GET(request) {
  const url = new URL(request.url)
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')
  const next = url.searchParams.get('next') || '/account'
  const origin = process.env.NEXT_PUBLIC_SITE_URL ? SITE_URL : url.origin

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/login?error=confirm`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/login?error=confirm`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarded')
    .eq('id', data.user.id)
    .maybeSingle()

  return NextResponse.redirect(`${origin}${postAuthDestination(profile, next)}`)
}
