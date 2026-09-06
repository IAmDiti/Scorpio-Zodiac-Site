'use client'

import { useFormStatus } from 'react-dom'

// Small shared building blocks for the admin forms. The visual language matches
// the public site (see app/globals.css @theme tokens and components/form-styles.js).

export const inputClass =
  'min-h-[44px] w-full rounded-lg border border-line-2 bg-void px-3 font-ui text-[13px] text-ink placeholder:text-ink-4 focus:border-lilac focus:outline-none'

export const labelClass =
  'mb-1.5 block font-ui text-[11px] uppercase tracking-[0.06em] text-ink-4'

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label ? <span className={labelClass}>{label}</span> : null}
      {children}
      {hint ? <span className="mt-1 block font-ui text-[11px] text-ink-4">{hint}</span> : null}
    </label>
  )
}

export function TextInput(props) {
  return <input {...props} className={`${inputClass} ${props.className || ''}`} />
}

export function TextArea({ rows = 6, className = '', ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`w-full rounded-lg border border-line-2 bg-void px-3 py-2.5 font-ui text-[13px] leading-relaxed text-ink placeholder:text-ink-4 focus:border-lilac focus:outline-none ${className}`}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select {...props} className={`${inputClass} ${className}`}>
      {children}
    </select>
  )
}

export function SubmitButton({ children, pendingLabel = 'Saving…', tone = 'primary', ...props }) {
  const { pending } = useFormStatus()
  const tones = {
    primary: 'bg-garnet text-white hover:opacity-90',
    ghost: 'border border-line-2 text-ink-2 hover:text-ink',
    danger: 'border border-garnet/50 text-[#f0a9b8] hover:bg-garnet/10',
  }
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      {...props}
      className={`inline-flex min-h-[42px] items-center justify-center rounded-full px-5 font-ui text-[13px] font-bold transition-opacity disabled:opacity-60 ${tones[tone]} ${props.className || ''}`}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}

export function FormMessage({ state }) {
  if (!state) return null
  if (state.error) {
    return (
      <p className="rounded-lg border border-garnet/40 bg-garnet/10 px-3 py-2 font-ui text-[12px] text-[#f0a9b8]">
        {state.error}
      </p>
    )
  }
  if (state.ok || state.message) {
    return (
      <p className="rounded-lg border border-violet/40 bg-violet/10 px-3 py-2 font-ui text-[12px] text-lilac">
        {state.message || 'Saved.'}
      </p>
    )
  }
  return null
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}
