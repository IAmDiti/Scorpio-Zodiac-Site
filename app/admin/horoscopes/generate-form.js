'use client'

import { useActionState } from 'react'
import { TextInput, SubmitButton, FormMessage } from '@/components/admin/ui'
import { generateHoroscopeAction } from './actions'

export function GenerateHoroscopeForm({ today }) {
  const [state, action] = useActionState(generateHoroscopeAction, null)

  return (
    <form action={action} className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <TextInput
        name="date"
        type="date"
        defaultValue={today}
        max={today}
        className="sm:w-44"
        required
      />
      <SubmitButton pendingLabel="Generating…">Generate / overwrite</SubmitButton>
      <div className="sm:ml-2">
        <FormMessage state={state} />
      </div>
    </form>
  )
}
