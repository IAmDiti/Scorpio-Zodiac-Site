'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUpWithEmail } from '@/app/(auth)/actions'
import { SubmitButton, FormError, Divider } from '@/components/auth-fields'
import { fieldClass, labelClass } from '@/components/form-styles'
import { OAuthButton } from '@/components/oauth-button'

export function SignupForm({ next }) {
  const [state, action] = useActionState(signUpWithEmail, {})

  if (state?.status === 'check-email') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <h2 className="text-[19px] text-ink-bright">Check your inbox</h2>
        <p className="mt-3 text-sm text-ink-2">
          We sent a confirmation link to <span className="text-ink">{state.email}</span>. Click it
          to finish creating your account.
        </p>
        <Link href="/login" className="mt-5 inline-block font-ui text-[13px] font-bold text-lilac">
          Back to log in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3.5">
      <form action={action} className="flex flex-col gap-3.5">
        <input type="hidden" name="next" value={next || '/account'} />

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@email.com"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className={fieldClass}
          />
        </div>

        <label className="flex items-start gap-2.5 font-ui text-[12px] text-ink-3">
          <input type="checkbox" name="marketing_opt_in" className="mt-0.5 accent-garnet" />
          Send me a short Scorpio reading each morning. Unsubscribe anytime.
        </label>

        <FormError message={state?.error} />

        <SubmitButton pendingLabel="Creating…">Create free account</SubmitButton>
      </form>

      <Divider />
      <OAuthButton next={next} />

      <p className="mt-2 text-center font-ui text-[11px] leading-relaxed text-ink-4">
        By continuing you agree to our{' '}
        <Link href="/terms" className="text-lilac">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-lilac">
          Privacy Policy
        </Link>
        . Horoscopes are for entertainment only.
      </p>
    </div>
  )
}
