'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toggleSavedAction } from '@/app/(site)/account/actions'
import { IconHeart } from '@/components/icons'

export function SaveButton({ kind, refKey, label, redirectTo }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    let active = true
    createClient()
      .from('saved_items')
      .select('id')
      .eq('kind', kind)
      .eq('ref', refKey)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setSaved(!!data)
      })
    return () => {
      active = false
    }
  }, [kind, refKey])

  function onClick() {
    startTransition(async () => {
      const res = await toggleSavedAction({ kind, ref: refKey, label })
      if (res?.needsAuth) {
        router.push(`/signup?next=${encodeURIComponent(redirectTo)}`)
        return
      }
      if (typeof res?.saved === 'boolean') setSaved(res.saved)
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full font-ui text-[13px] font-bold transition-colors disabled:opacity-60 ${
        saved ? 'bg-garnet/15 text-[#f0a9b8]' : 'bg-garnet text-white hover:opacity-90'
      }`}
    >
      <IconHeart className="h-4 w-4" style={saved ? { fill: 'currentColor' } : undefined} />
      {saved ? 'Saved' : 'Save reading'}
    </button>
  )
}
