'use client'

import { useState } from 'react'
import { IconShare } from '@/components/icons'

export function QuizShare({ path, text }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = typeof window !== 'undefined' ? new URL(path, window.location.origin).href : path
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text, url })
        return
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-garnet font-ui text-[13px] font-bold text-white transition-opacity hover:opacity-90"
    >
      <IconShare className="h-4 w-4" />
      {copied ? 'Link copied' : 'Share your result'}
    </button>
  )
}
