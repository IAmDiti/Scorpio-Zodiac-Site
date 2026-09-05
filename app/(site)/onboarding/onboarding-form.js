'use client'

import { useActionState } from 'react'
import { completeOnboarding, skipOnboarding } from '@/app/(site)/account/actions'
import { SubmitButton, FormError } from '@/components/auth-fields'
import { fieldClass, labelClass } from '@/components/form-styles'
import { SignSelect } from '@/components/sign-select'

export function OnboardingForm({ next, defaults }) {
  const [state, action] = useActionState(completeOnboarding, {})

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next || '/account'} />

      <div>
        <label htmlFor="display_name" className={labelClass}>
          What should we call you?
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          maxLength={60}
          defaultValue={defaults?.display_name || ''}
          placeholder="First name or a handle"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="birth_date" className={labelClass}>
          Your birth date
        </label>
        <input
          id="birth_date"
          name="birth_date"
          type="date"
          defaultValue={defaults?.birth_date || ''}
          className={fieldClass}
        />
        <p className="mt-1.5 font-ui text-[11px] text-ink-4">
          Sets your Sun sign. Add a birth time and place later for full readings.
        </p>
      </div>

      <div>
        <label htmlFor="partner_sign" className={labelClass}>
          A partner or crush&rsquo;s sign (optional)
        </label>
        <SignSelect defaultValue={defaults?.partner_sign || ''} />
      </div>

      <FormError message={state?.error} />

      <SubmitButton pendingLabel="Saving…">Enter</SubmitButton>

      <button
        type="submit"
        formAction={skipOnboarding}
        className="font-ui text-[12px] text-ink-4 underline-offset-2 hover:text-ink-3 hover:underline"
      >
        Skip for now
      </button>
    </form>
  )
}
