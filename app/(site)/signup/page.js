import { PagePlaceholder } from '@/components/page-placeholder'

export const metadata = { title: 'Create your free account' }

export default function SignupPage() {
  return (
    <PagePlaceholder
      eyebrow="Free forever"
      title="Create your account"
      blurb="Email + password and Google sign-in, plus the quiz-result unlock flow, land in the auth phase."
      phase="Phase 4 (auth + profile)"
    />
  )
}
