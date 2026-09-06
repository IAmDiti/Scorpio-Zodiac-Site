'use client'

import Link from 'next/link'
import { useActionState, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Field, TextInput, TextArea, SubmitButton, FormMessage, Card } from '@/components/admin/ui'
import { SCORE_KEYS } from '@/lib/admin/compatibility'
import {
  saveCompatibilityAction,
  regenerateCompatibilityAction,
  deleteCompatibilityAction,
} from '../actions'

const PROSE = [
  ['summary', 'Summary'],
  ['spark', 'Spark'],
  ['friction', 'Friction'],
]

export function CompatEditor({ partnerKey, partnerName, row }) {
  const router = useRouter()
  const save = saveCompatibilityAction.bind(null, partnerKey)
  const [state, action] = useActionState(save, null)
  const [regen, setRegen] = useState(null)
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] text-ink-bright">Scorpio &amp; {partnerName}</h1>
        <Link href="/admin/compatibility" className="font-ui text-[12px] text-ink-4 hover:text-ink-2">
          ← All pairs
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm('Regenerate this pairing with AI? Overwrites the current text and scores.'))
              return
            startTransition(async () => {
              const res = await regenerateCompatibilityAction(partnerKey)
              setRegen(res)
              if (res?.ok) router.refresh()
            })
          }}
          className="rounded-full border border-line-2 px-4 py-2 font-ui text-[12px] font-bold text-ink-2 hover:text-ink disabled:opacity-60"
        >
          {pending ? 'Working…' : 'Regenerate with AI'}
        </button>
        <Link
          href={`/compatibility/scorpio-and-${partnerKey}`}
          target="_blank"
          className="font-ui text-[12px] text-lilac"
        >
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
          <Field label="Headline">
            <TextInput name="headline" defaultValue={row.headline || ''} maxLength={120} />
          </Field>
          {PROSE.map(([key, label]) => (
            <Field key={key} label={label}>
              <TextArea name={key} rows={3} defaultValue={row[key] || ''} />
            </Field>
          ))}
        </Card>

        <Card>
          <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.06em] text-ink-4">
            Scores (0–100)
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SCORE_KEYS.map((k) => (
              <Field key={k} label={k}>
                <TextInput
                  name={`score_${k}`}
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={row.scores?.[k] ?? 0}
                />
              </Field>
            ))}
          </div>
        </Card>

        <FormMessage state={state} />

        <div className="flex items-center gap-2.5">
          <SubmitButton>Save changes</SubmitButton>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Delete the Scorpio & ${partnerName} report?`)) return
              startTransition(() => deleteCompatibilityAction(partnerKey))
            }}
            className="rounded-full border border-garnet/50 px-4 py-2 font-ui text-[12px] font-bold text-[#f0a9b8] hover:bg-garnet/10"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  )
}
