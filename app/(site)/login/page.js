import { PagePlaceholder } from '@/components/page-placeholder'

export const metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <PagePlaceholder
      eyebrow="Welcome back"
      title="Log in"
      blurb="Sign-in arrives in the auth phase."
      phase="Phase 4 (auth + profile)"
    />
  )
}
