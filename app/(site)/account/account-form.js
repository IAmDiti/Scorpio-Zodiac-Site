'use client'

import { useActionState, useState } from 'react'
import { saveProfile } from '@/app/(site)/account/actions'
import { SubmitButton, FormError } from '@/components/auth-fields'
import { fieldClass, labelClass } from '@/components/form-styles'
import { SignSelect } from '@/components/sign-select'
import { SIGNS } from '@/lib/astro/zodiac'

const signName = (key) => SIGNS.find((s) => s.key === key)?.name

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-void/60 px-4 py-3">
      <span className="font-ui text-[12.5px] text-ink-3">{label}</span>
      <span className={`font-ui text-[12.5px] ${value ? 'text-ink' : 'text-ink-4'}`}>
        {value || 'Not set'}
      </span>
    </div>
  )
}

export function AccountForm({ profile }) {
  const [editing, setEditing] = useState(false)
  const [state, action] = useActionState(async (prev, formData) => {
    const result = await saveProfile(prev, formData)
    if (result?.ok) setEditing(false)
    return result
  }, {})

  if (!editing) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-[18px]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px]">Your details</h2>
          <button
            onClick={() => setEditing(true)}
            className="font-ui text-[12px] font-bold text-lilac"
          >
            Edit
          </button>
        </div>
        <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
          <Row label="Display name" value={profile.display_name} />
          <Row label="Birth date" value={profile.birth_date} />
          <Row label="Birth time" value={profile.birth_time} />
          <Row label="Birth place" value={profile.birth_place} />
          <Row label="Partner's sign" value={signName(profile.partner_sign)} />
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="rounded-2xl border border-line bg-surface p-[18px]">
      <h2 className="mb-4 text-[15px]">Edit your details</h2>
      <div className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="display_name" className={labelClass}>
            Display name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            maxLength={60}
            defaultValue={profile.display_name || ''}
            className={fieldClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="birth_date" className={labelClass}>
              Birth date
            </label>
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              defaultValue={profile.birth_date || ''}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="birth_time" className={labelClass}>
              Birth time
            </label>
            <input
              id="birth_time"
              name="birth_time"
              type="time"
              defaultValue={profile.birth_time || ''}
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="birth_place" className={labelClass}>
            Birth place
          </label>
          <input
            id="birth_place"
            name="birth_place"
            type="text"
            maxLength={120}
            placeholder="City, country"
            defaultValue={profile.birth_place || ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="partner_sign" className={labelClass}>
            Partner&rsquo;s sign
          </label>
          <SignSelect defaultValue={profile.partner_sign || ''} />
        </div>
        <label className="flex items-start gap-2.5 font-ui text-[12px] text-ink-3">
          <input
            type="checkbox"
            name="marketing_opt_in"
            defaultChecked={!!profile.marketing_opt_in}
            className="mt-0.5 accent-garnet"
          />
          Email me a short Scorpio reading each morning.
        </label>

        <FormError message={state?.error} />

        <div className="flex gap-2.5">
          <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="min-h-[50px] shrink-0 rounded-full border border-line-2 px-5 font-ui text-[13px] text-ink-3"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
