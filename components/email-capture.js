'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { subscribeAction } from '@/app/(site)/actions'

function Submit({ label, compact }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`shrink-0 rounded-full bg-garnet font-ui font-bold tracking-[0.03em] text-white transition-opacity hover:opacity-90 disabled:opacity-70 ${
        compact ? 'min-h-[46px] px-4 text-[13px]' : 'min-h-[52px] px-6 text-[14px]'
      }`}
    >
      {pending ? 'Adding you…' : label}
    </button>
  )
}

/**
 * One-field email capture — hero, closing band, anywhere. No password; the
 * address goes to the `subscribers` table via the subscribeAction Server Action.
 */
export function EmailCapture({
  source = 'hero',
  cta = 'Get tomorrow’s reading',
  note = 'No password. One reading a day. Unsubscribe any time.',
  compact = false,
  className = '',
}) {
  const [state, action] = useActionState(subscribeAction, null)

  if (state?.ok) {
    return (
      <div
        className={`rounded-2xl border border-violet/40 bg-violet/10 px-5 py-4 text-center ${className}`}
      >
        <p className="font-ui text-[14px] font-bold text-ink-bright">You’re in.</p>
        <p className="mt-1 font-ui text-[12.5px] text-ink-2">
          Your first Scorpio reading lands tomorrow morning.
        </p>
      </div>
    )
  }

  const inputSize = compact ? 'min-h-[46px] px-3.5 text-[13px]' : 'min-h-[52px] px-5 text-[14px]'

  return (
    <div className={className}>
      <form action={action} className="flex flex-col gap-2.5 sm:flex-row">
        <input type="hidden" name="source" value={source} />
        <label htmlFor={`email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className={`flex-1 rounded-full border border-line-2 bg-void font-ui text-ink placeholder:text-ink-4 focus:border-lilac focus:outline-none ${inputSize}`}
        />
        <Submit label={cta} compact={compact} />
      </form>
      {state?.error ? (
        <p className="mt-2 font-ui text-[12px] text-[#f0a9b8]">{state.error}</p>
      ) : note ? (
        <p className="mt-2.5 font-ui text-[12px] text-ink-4">{note}</p>
      ) : null}
    </div>
  )
}
