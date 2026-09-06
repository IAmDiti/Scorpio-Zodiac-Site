import { Prose } from '@/components/prose'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} collects, uses and protects your personal data.`,
  alternates: { canonical: '/privacy' },
}

function H({ children }) {
  return <h2 className="mt-4 font-display text-[17px] text-ink sm:text-[19px]">{children}</h2>
}

export default function PrivacyPage() {
  return (
    <Prose title="Privacy Policy" updated="[LAST UPDATED DATE]">
      <p>
        This policy explains what personal data {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects, why, and what rights you have. It is written to meet the UK GDPR and EU GDPR.
      </p>

      <H>Who we are</H>
      <p>
        The data controller is <strong>[YOUR NAME OR COMPANY]</strong>, [ADDRESS / COUNTRY]. For any
        privacy question or request, contact us at <strong>[PRIVACY CONTACT EMAIL]</strong>.
      </p>

      <H>What we collect and why</H>
      <p>
        <strong>Account data</strong> — your email address and a password (stored only as a salted
        hash by our authentication provider). Legal basis: performance of a contract (providing your
        account).
      </p>
      <p>
        <strong>Profile data you choose to add</strong> — display name, birth date, and optionally
        birth time, birth place and a partner&rsquo;s star sign. We use these to personalise
        readings. Legal basis: your consent, which you can withdraw at any time by clearing the
        fields.
      </p>
      <p>
        <strong>Activity data</strong> — quizzes you complete, readings you save, and your result
        history, so we can show them back to you. Legal basis: performance of a contract.
      </p>
      <p>
        <strong>Analytics</strong> — we use Plausible Analytics, which is cookieless and does not
        collect personal data or build cross-site profiles, and Google Analytics 4, which sets
        cookies to measure page views, referrers and aggregate usage. Legal basis: our legitimate
        interest in understanding site usage.
      </p>

      <H>Cookies and local storage</H>
      <p>
        We use only what is strictly necessary: a session cookie that keeps you signed in, and
        browser local storage that temporarily holds your in-progress quiz answers so they survive
        sign-up. Google Analytics also sets measurement cookies. We do not use advertising cookies.
      </p>

      <H>Who we share data with</H>
      <p>We use these processors, each under a data-processing agreement:</p>
      <p>
        Supabase (authentication, database, file storage); Railway (application hosting); Google
        (Analytics); Anthropic
        (generates horoscope and reading text from planetary data — your identity is not sent);
        [EMAIL PROVIDER] (sends confirmation and account emails); and, if you buy a paid reading,
        Lemon Squeezy, which acts as the seller of record and handles payment — we never receive
        your card details.
      </p>
      <p>We never sell your personal data.</p>

      <H>International transfers</H>
      <p>
        Some processors are based outside the UK/EEA (for example in the United States). Where that
        is the case, transfers are covered by the UK International Data Transfer Addendum or the EU
        Standard Contractual Clauses.
      </p>

      <H>How long we keep it</H>
      <p>
        We keep your account and profile data until you delete your account, after which it is
        erased within [30] days. Aggregate analytics contains no personal data and is kept
        indefinitely.
      </p>

      <H>Your rights</H>
      <p>
        You can access, correct, export, restrict or delete your personal data, and object to
        processing based on legitimate interests. Most of this you can do yourself from your
        account; for anything else, email [PRIVACY CONTACT EMAIL] and we will respond within one
        month. You can also complain to your data protection authority (in the UK, the ICO).
      </p>

      <H>Children</H>
      <p>
        {SITE_NAME} is not intended for anyone under 16. We do not knowingly collect data from
        children.
      </p>

      <H>Changes</H>
      <p>
        We will update this page if our practices change and revise the date at the top. Material
        changes will be flagged to signed-in users by email.
      </p>
    </Prose>
  )
}
