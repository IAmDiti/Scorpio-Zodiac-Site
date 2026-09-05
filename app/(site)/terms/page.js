import { Prose } from '@/components/prose'
import { SITE_NAME } from '@/lib/constants'

export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <Prose title="Terms of Service" updated="[DATE]">
      <p className="rounded-xl border border-line bg-surface p-3 font-ui text-[12px] text-ink-4">
        Draft — to be reviewed before launch.
      </p>
      <p>
        By using {SITE_NAME} you agree to these terms. If you do not agree, do not use the site.
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Accounts</h2>
      <p>
        You must be at least 16 to create an account. Keep your login details secure; you are
        responsible for activity under your account.
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Entertainment only</h2>
      <p>
        All content is for entertainment and is not advice of any kind. See our{' '}
        <a href="/disclaimer" className="text-lilac">
          Disclaimer
        </a>
        .
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Paid products</h2>
      <p>
        Paid readings are one-time digital purchases processed by Lemon Squeezy, who act as the
        merchant of record. Because a reading is generated and delivered immediately, purchases are
        non-refundable once the reading has been produced, except where required by law.
      </p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Acceptable use</h2>
      <p>Don&rsquo;t scrape the site, resell the content, or try to break or overload it.</p>
      <h2 className="mt-2 font-display text-[17px] text-ink">Changes</h2>
      <p>We may update these terms; continued use after a change means you accept it.</p>
      <p>Contact: [EMAIL].</p>
    </Prose>
  )
}
