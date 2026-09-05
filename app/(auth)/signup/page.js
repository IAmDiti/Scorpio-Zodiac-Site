import { redirect } from 'next/navigation'
import { AuthTabs } from '@/components/auth-tabs'
import { SignupForm } from './signup-form'
import { getUser } from '@/lib/auth'

export const metadata = { title: 'Create your free account' }

export default async function SignupPage({ searchParams }) {
  const { next } = await searchParams
  if (await getUser()) redirect(next && next.startsWith('/') ? next : '/account')

  return (
    <div>
      <div className="mb-5 text-center">
        <h1 className="text-[26px] text-ink-bright">Join the dark side</h1>
        <p className="mt-2 font-ui text-[13px] text-ink-3">
          Unlock quiz results, save your readings, keep your history.
        </p>
      </div>
      <AuthTabs active="signup" next={next} />
      <SignupForm next={next} />
    </div>
  )
}
