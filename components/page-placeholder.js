import Link from 'next/link'
import { IconArrowRight } from '@/components/icons'

/**
 * Temporary stub for routes that arrive in a later build phase.
 * Keeps navigation working and the build green.
 */
export function PagePlaceholder({ eyebrow, title, blurb, phase }) {
  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-10 sm:max-w-2xl sm:px-8 sm:py-16">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h1 className="text-[30px] text-ink-bright sm:text-[42px]">{title}</h1>
      {blurb ? <p className="mt-4 text-ink-2 sm:text-[17px]">{blurb}</p> : null}
      <p className="mt-6 rounded-2xl border border-line bg-surface p-4 font-ui text-[13px] text-ink-3">
        This page is part of {phase}. The homepage and the shared design system are live now.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 font-ui text-[13px] font-bold text-lilac"
      >
        Back home
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
