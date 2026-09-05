'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signInWithEmail } from '@/app/(auth)/actions'
import { SubmitButton, FormError, Divider } from '@/components/auth-fields'
import { fieldClass, labelClass } from '@/components/form-styles'
import { OAuthButton } from '@/components/oauth-button'

export function LoginForm({ next, oauthError }) {
  const [state, action] = useActionState(signInWithEmail, {})

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
            autoComplete="current-password"
            required
            placeholder="Your password"
            className={fieldClass}
          />
        </div>

        <FormError
          message={state?.error || (oauthError ? 'Google sign-in was cancelled.' : null)}
        />

        <SubmitButton pendingLabel="Signing in…">Log in</SubmitButton>
      </form>

      <Divider />
      <OAuthButton next={next} />

      <p className="mt-2 text-center font-ui text-[12px] text-ink-4">
        New here?{' '}
        <Link
          href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="font-bold text-lilac"
        >
          Create a free account
        </Link>
      </p>
    </div>
  )
}
