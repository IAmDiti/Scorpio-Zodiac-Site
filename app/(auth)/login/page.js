import { redirect } from 'next/navigation'
import { AuthTabs } from '@/components/auth-tabs'
import { LoginForm } from './login-form'
import { getUser } from '@/lib/auth'

export const metadata = { title: 'Log in' }

export default async function LoginPage({ searchParams }) {
  const { next, error } = await searchParams
  if (await getUser()) redirect(next && next.startsWith('/') ? next : '/account')

  return (
    <div>
      <div className="mb-5 text-center">
        <h1 className="text-[26px] text-ink-bright">Welcome back</h1>
        <p className="mt-2 font-ui text-[13px] text-ink-3">
          Your readings and quiz history are waiting.
        </p>
      </div>
      <AuthTabs active="login" next={next} />
      <LoginForm next={next} oauthError={error === 'oauth'} />
    </div>
  )
}
