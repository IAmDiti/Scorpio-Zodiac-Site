import { Prose } from '@/components/prose'
import { SITE_NAME } from '@/lib/constants'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <Prose title="Privacy Policy" updated="[DATE]">
      <p className="rounded-xl border border-line bg-surface p-3 font-ui text-[12px] text-ink-4">
        Draft — to be reviewed before launch. Fill the bracketed details and have it checked against
        GDPR / your jurisdiction.
      </p>
      <p>
        This policy explains what {SITE_NAME} (&ldquo;we&rdquo;) collects, why, and what choices you
        have. The data controller is [YOUR NAME / COMPANY], [ADDRESS], contactable at [EMAIL].
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">What we collect</h2>
      <p>
        <strong>Account data</strong> you give us: email address, password (stored hashed by our
        auth provider), and optional profile details — display name, birth date, and, only if you
        choose to add them, birth time and place and a partner&rsquo;s sign.
      </p>
      <p>
        <strong>Usage data</strong>: quizzes you complete and readings you save, so we can show your
        history. Basic, privacy-respecting analytics about page visits.
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Processors we use</h2>
      <p>
        Supabase (authentication, database, file storage), Railway (hosting), Anthropic (generates
        horoscope and reading text from planetary data — we do not send your identity), [EMAIL
        PROVIDER] (transactional email), and, for paid products, Lemon Squeezy (checkout and
        payment; we never see your card details).
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Your rights</h2>
      <p>
        You can access, correct, export or delete your data at any time from your account, or by
        emailing [EMAIL]. Marketing email is opt-in and every message has an unsubscribe link.
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Retention</h2>
      <p>
        We keep your account data until you delete your account, after which it is removed within
        [30] days.
      </p>
    </Prose>
  )
}
