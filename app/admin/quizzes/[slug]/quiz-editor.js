'use client'

import Link from 'next/link'
import { useActionState, useMemo, useState, useTransition } from 'react'
import {
  Field,
  TextInput,
  TextArea,
  Select,
  SubmitButton,
  FormMessage,
  Card,
} from '@/components/admin/ui'
import { ImagePicker } from '@/components/admin/image-picker'
import { saveQuizAction, deleteQuizAction } from '../actions'

function summarize(text) {
  try {
    const def = JSON.parse(text)
    const results = Object.keys(def.results || {})
    return {
      ok: true,
      scoring: def.scoring,
      questions: Array.isArray(def.questions) ? def.questions.length : 0,
      results,
    }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

export function QuizEditor({ row, bundled }) {
  const save = saveQuizAction.bind(null, row.slug)
  const [state, action] = useActionState(save, null)
  const [pending, startTransition] = useTransition()

  const [definition, setDefinition] = useState(JSON.stringify(row.definition, null, 2))
  const summary = useMemo(() => summarize(definition), [definition])

  function loadBundled() {
    if (!bundled) return
    if (!confirm('Replace the editor contents with the original bundled version?')) return
    setDefinition(JSON.stringify(bundled, null, 2))
  }

  function prettyPrint() {
    const s = summarize(definition)
    if (s.ok) setDefinition(JSON.stringify(JSON.parse(definition), null, 2))
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] text-ink-bright">{row.definition?.title || row.slug}</h1>
          <p className="font-ui text-[11px] text-ink-4">/quiz/{row.slug}</p>
        </div>
        <Link href="/admin/quizzes" className="font-ui text-[12px] text-ink-4 hover:text-ink-2">
          ← All quizzes
        </Link>
      </div>

      <form action={action} className="flex flex-col gap-5">
        <Card className="grid gap-4 sm:grid-cols-2">
          <ImagePicker
            name="image_url"
            label="Thumbnail"
            prefix="quizzes"
            defaultValue={row.image_url || ''}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <Select name="status" defaultValue={row.status}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </Select>
            </Field>
            <Field label="Sort order" hint="Lower shows first.">
              <TextInput name="sort_order" type="number" defaultValue={row.sort_order ?? 99} />
            </Field>
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-ui text-[11px] uppercase tracking-[0.06em] text-ink-4">
              Definition (JSON): questions, options, results, bands
            </span>
            <div className="flex gap-3 font-ui text-[11px]">
              <button type="button" onClick={prettyPrint} className="text-lilac">
                Tidy
              </button>
              {bundled ? (
                <button type="button" onClick={loadBundled} className="text-lilac">
                  Load bundled version
                </button>
              ) : null}
            </div>
          </div>

          <TextArea
            name="definition"
            rows={22}
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className="font-mono !text-[12px]"
            spellCheck={false}
          />

          <div className="font-ui text-[11px]">
            {summary.ok ? (
              <span className="text-ink-4">
                {summary.scoring} · {summary.questions} question(s) · results:{' '}
                {summary.results.join(', ') || '—'}
              </span>
            ) : (
              <span className="text-[#f0a9b8]">Invalid JSON: {summary.error}</span>
            )}
          </div>
        </Card>

        <FormMessage state={state} />
        {state?.problems?.length ? (
          <ul className="list-disc rounded-lg border border-garnet/40 bg-garnet/10 px-6 py-3 font-ui text-[12px] text-[#f0a9b8]">
            {state.problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-2.5">
          <SubmitButton disabled={!summary.ok}>Save quiz</SubmitButton>
          <Link href={`/quiz/${row.slug}`} target="_blank" className="font-ui text-[12px] text-lilac">
            View ↗
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Delete the "${row.slug}" quiz? Existing results keep their slug.`)) return
              startTransition(() => deleteQuizAction(row.slug))
            }}
            className="ml-auto rounded-full border border-garnet/50 px-4 py-2 font-ui text-[12px] font-bold text-[#f0a9b8] hover:bg-garnet/10"
          >
            Delete quiz
          </button>
        </div>
      </form>
    </div>
  )
}
