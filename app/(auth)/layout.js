import Link from 'next/link'
import { Constellation } from '@/components/constellation'
import { SITE_NAME } from '@/lib/constants'

export default function AuthLayout({ children }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[26rem] flex-col px-5 py-8 sm:max-w-md sm:justify-center sm:py-12">
      <Link href="/" className="mb-2 flex flex-col items-center">
        <Constellation className="h-14 w-52 opacity-90" />
        <span className="mt-1 flex items-baseline gap-1.5">
          <span className="font-display text-[15px] font-bold tracking-[0.18em] text-ink">
            {SITE_NAME.split(' ')[0].toUpperCase()}
          </span>
          <span className="font-body text-sm italic text-ink-3">
            {SITE_NAME.split(' ')[1]?.toLowerCase()}
          </span>
        </span>
      </Link>
      <div className="flex flex-1 flex-col justify-center sm:flex-none sm:rounded-3xl sm:border sm:border-line sm:bg-surface/40 sm:p-8">
        {children}
      </div>
    </div>
  )
}
