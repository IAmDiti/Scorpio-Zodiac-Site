import { PagePlaceholder } from '@/components/page-placeholder'

export const metadata = { title: 'My Account' }

export default function AccountPage() {
  return (
    <PagePlaceholder
      eyebrow="My account"
      title="Your profile & history"
      blurb="Sign-in, saved readings, quiz history and birth details arrive with the auth phase."
      phase="Phase 4 (auth + profile)"
    />
  )
}
