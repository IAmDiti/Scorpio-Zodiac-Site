'use client'

import { useFormStatus } from 'react-dom'

export { fieldClass, labelClass } from '@/components/form-styles'

export function SubmitButton({ children, pendingLabel }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[50px] w-full rounded-full bg-garnet font-ui text-sm font-bold tracking-[0.03em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  )
}

export function FormError({ message }) {
  if (!message) return null
  return (
    <p className="rounded-lg border border-garnet/40 bg-garnet/10 px-3 py-2 font-ui text-[12px] text-[#f0a9b8]">
      {message}
    </p>
  )
}

export function Divider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-line-2" />
      <span className="font-ui text-[11px] text-ink-4">or</span>
      <span className="h-px flex-1 bg-line-2" />
    </div>
  )
}
