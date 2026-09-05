'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { postAuthDestination } from '@/lib/auth'
import { SITE_URL } from '@/lib/site'

const siteUrl = SITE_URL
const UNAVAILABLE = 'Sign-in is unavailable right now. Please try again shortly.'

function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/account'
}

async function profileOnboarded(supabase, userId) {
  const { data } = await supabase
    .from('profiles')
    .select('onboarded')
    .eq('id', userId)
    .maybeSingle()
  return data
}

export async function signInWithGoogle(formData) {
  const next = safeNext(formData.get('next')?.toString())
  let targetUrl
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error || !data?.url) throw error || new Error('no url')
    targetUrl = data.url
  } catch {
    redirect(`/login?next=${encodeURIComponent(next)}&error=oauth`)
  }
  redirect(targetUrl)
}

export async function signUpWithEmail(_prev, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase()
  const confirmEmail = formData.get('confirm_email')?.toString().trim().toLowerCase()
  const password = formData.get('password')?.toString() ?? ''
  const confirmPassword = formData.get('confirm_password')?.toString() ?? ''
  const next = safeNext(formData.get('next')?.toString())
  const marketing = formData.get('marketing_opt_in') === 'on'

  if (!email || password.length < 8) {
    return { error: 'Enter an email and a password of at least 8 characters.' }
  }
  if (confirmEmail !== undefined && confirmEmail !== email) {
    return { error: 'The two email addresses don’t match.' }
  }
  if (confirmPassword !== undefined && confirmPassword !== password) {
    return { error: 'The two passwords don’t match.' }
  }

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return { error: UNAVAILABLE }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { marketing_opt_in: marketing },
      emailRedirectTo: `${siteUrl}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) return { error: error.message }
  if (data.user && !data.session) return { status: 'check-email', email }

  redirect(postAuthDestination(await profileOnboarded(supabase, data.user.id), next))
}

export async function signInWithEmail(_prev, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase()
  const password = formData.get('password')?.toString() ?? ''
  const next = safeNext(formData.get('next')?.toString())

  if (!email || !password) {
    return { error: 'Enter your email and password.' }
  }

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return { error: UNAVAILABLE }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'That email and password don’t match.' }

  redirect(postAuthDestination(await profileOnboarded(supabase, data.user.id), next))
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // already effectively signed out
  }
  redirect('/')
}
