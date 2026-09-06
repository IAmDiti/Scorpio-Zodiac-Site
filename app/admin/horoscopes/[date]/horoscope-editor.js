'use client'

import { useActionState, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Field, TextInput, TextArea, SubmitButton, FormMessage, Card } from '@/components/admin/ui'
import {
  saveHoroscopeAction,
  regenerateHoroscopeAction,
  deleteHoroscopeAction,
} from '../actions'

const SECTIONS = [
  ['overview', 'Overview'],
  ['love', 'Love'],
  ['career', 'Career'],
  ['wellbeing', 'Wellbeing'],
]

export function HoroscopeEditor({ dateISO, dateLabel, row }) {
  const router = useRouter()
  const save = saveHoroscopeAction.bind(null, dateISO)
  const [state, action] = useActionState(save, null)
  const [regen, setRegen] = useState(null)
  const [pending, startTransition] = useTransition()

  function regenerate() {
    if (!confirm('Regenerate this day with AI? It overwrites the current copy.')) return
    startTransition(async () => {
      const res = await regenerateHoroscopeAction(dateISO)
      setRegen(res)
      if (res?.ok) router.refresh()
    })
  }

  function del() {
    if (!confirm(`Delete the horoscope for ${dateLabel}?`)) return
    startTransition(() => deleteHoroscopeAction(dateISO))
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] text-ink-bright">{dateLabel}</h1>
          <p className="font-ui text-[11px] text-ink-4">
            {row.model} · generated {new Date(row.generated_at).toLocaleString()}
          </p>
        </div>
        <Link href="/admin/horoscopes" className="font-ui text-[12px] text-ink-4 hover:text-ink-2">
          ← All days
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={regenerate}
          disabled={pending}
          className="rounded-full border border-line-2 px-4 py-2 font-ui text-[12px] font-bold text-ink-2 hover:text-ink disabled:opacity-60"
        >
          {pending ? 'Working…' : 'Regenerate with AI'}
        </button>
        <Link href={`/horoscope/${dateISO}`} target="_blank" className="font-ui text-[12px] text-lilac">
          View ↗
        </Link>
        {regen?.error ? (
          <span className="font-ui text-[11px] text-[#f0a9b8]">{regen.error}</span>
        ) : regen?.message ? (
          <span className="font-ui text-[11px] text-lilac">{regen.message}</span>
        ) : null}
      </div>

      <form action={action} className="flex flex-col gap-5">
        <Card className="flex flex-col gap-4">
          <Field label="Headline" hint="Short and evocative — the homepage hero uses this.">
            <TextInput name="headline" defaultValue={row.headline || ''} maxLength={120} />
          </Field>
          {SECTIONS.map(([key, label]) => (
            <Field key={key} label={label}>
              <TextArea name={key} rows={4} defaultValue={row[key] || ''} />
            </Field>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lucky colour">
              <TextInput name="lucky_color" defaultValue={row.lucky_color || ''} />
            </Field>
            <Field label="Lucky number">
              <TextInput name="lucky_number" type="number" min={1} max={99} defaultValue={row.lucky_number || ''} />
            </Field>
          </div>
        </Card>

        <FormMessage state={state} />

        <div className="flex items-center gap-2.5">
          <SubmitButton>Save changes</SubmitButton>
          <button
            type="button"
            onClick={del}
            disabled={pending}
            className="rounded-full border border-garnet/50 px-4 py-2 font-ui text-[12px] font-bold text-[#f0a9b8] hover:bg-garnet/10"
          >
            Delete day
          </button>
        </div>
      </form>

      <p className="font-ui text-[11px] text-ink-4">
        Em dashes and spaced hyphens are stripped on save (house style).
      </p>
    </div>
  )
}
