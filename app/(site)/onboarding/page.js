import { redirect } from 'next/navigation'
import { OnboardingForm } from './onboarding-form'
import { getSession } from '@/lib/auth'

export const metadata = { title: 'Welcome' }

export default async function OnboardingPage({ searchParams }) {
  const { next } = await searchParams
  const { user, profile } = await getSession()

  if (!user) redirect(`/login?next=${encodeURIComponent('/onboarding')}`)
  if (profile?.onboarded) redirect(next && next.startsWith('/') ? next : '/account')

  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-10">
      <p className="eyebrow mb-2">Almost in</p>
      <h1 className="text-[28px] text-ink-bright">A couple of quick things</h1>
      <p className="mt-3 text-[15px] text-ink-2">
        None of this is required, and you can change it anytime from your account.
      </p>
      <div className="mt-6">
        <OnboardingForm next={next} defaults={profile} />
      </div>
    </div>
  )
}
