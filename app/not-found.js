import Link from 'next/link'
import { IconArrowRight, IconScorpio } from '@/components/icons'

export const metadata = { title: 'Lost in the dark' }

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[26rem] flex-col items-center justify-center px-5 text-center sm:max-w-lg">
      <IconScorpio className="mb-6 h-12 w-14 text-garnet" />
      <p className="eyebrow mb-3">404</p>
      <h1 className="text-[28px] text-ink-bright">This page slipped into shadow</h1>
      <p className="mt-3 text-ink-2">The link is broken or the page was moved.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-garnet px-5 py-3 font-ui text-[13px] font-bold text-white"
      >
        Back home
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
