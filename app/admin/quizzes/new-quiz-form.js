'use client'

import { useActionState } from 'react'
import { Field, TextInput, SubmitButton, FormMessage } from '@/components/admin/ui'
import { createQuizAction } from './actions'

export function NewQuizForm() {
  const [state, action] = useActionState(createQuizAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <Field label="Title">
        <TextInput name="title" placeholder="e.g. Which Scorpio villain era are you in?" required />
      </Field>
      <Field label="Slug" hint="Optional. Defaults to a slug of the title. Becomes /quiz/<slug>.">
        <TextInput name="slug" placeholder="auto" />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Creating…">Create draft quiz</SubmitButton>
    </form>
  )
}
