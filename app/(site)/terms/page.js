import { Prose } from '@/components/prose'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: 'Terms of Service',
  description: `The terms that govern your use of ${SITE_NAME}.`,
  alternates: { canonical: '/terms' },
}

function H({ children }) {
  return <h2 className="mt-4 font-display text-[17px] text-ink sm:text-[19px]">{children}</h2>
}

export default function TermsPage() {
  return (
    <Prose title="Terms of Service" updated="[LAST UPDATED DATE]">
      <p>
        These terms are a contract between you and {SITE_NAME}. By using the site you agree to them.
        If you do not agree, do not use the site.
      </p>

      <H>Who can use {SITE_NAME}</H>
      <p>
        You must be at least 16 years old. You are responsible for keeping your login details secure
        and for everything done through your account.
      </p>

      <H>Entertainment only</H>
      <p>
        Horoscopes, compatibility readings, quizzes and any paid reports are generated from real
        astronomical data interpreted through the conventions of Western astrology. They are
        provided for entertainment and reflection only. They are not advice of any kind — medical,
        psychological, financial, legal or relationship — and are not predictions of real events.
        See our <a href="/disclaimer">Disclaimer</a>.
      </p>

      <H>Paid products</H>
      <p>
        Paid readings are one-time digital purchases. Checkout and payment are handled by Lemon
        Squeezy, which is the seller of record; their buyer terms also apply to your purchase.
        Because a reading is generated and delivered to you immediately, purchases are
        non-refundable once the reading has been produced, except where a refund is required by law.
        Prices are shown at checkout and include applicable taxes.
      </p>

      <H>Acceptable use</H>
      <p>
        Don&rsquo;t scrape or bulk-download the site, resell or redistribute its content, attempt to
        break, overload or gain unauthorised access to it, or use it to harass anyone.
      </p>

      <H>Content and intellectual property</H>
      <p>
        The site, its design, and the text it generates are owned by {SITE_NAME} or its licensors.
        Your personal reading is yours to keep and share for personal, non-commercial use.
      </p>

      <H>Availability and changes</H>
      <p>
        We may change, suspend or discontinue any part of the site at any time. We may also update
        these terms; if we make a material change we will notify signed-in users, and continued use
        after a change means you accept it.
      </p>

      <H>Disclaimers and liability</H>
      <p>
        The site is provided &ldquo;as is&rdquo;. To the fullest extent permitted by law, we exclude
        implied warranties and are not liable for any loss arising from your use of the site or
        reliance on its content. Nothing in these terms limits liability that cannot be limited by
        law (such as for death or personal injury caused by negligence, or fraud).
      </p>

      <H>Termination</H>
      <p>
        You can delete your account at any time. We may suspend or close an account that breaches
        these terms.
      </p>

      <H>Governing law</H>
      <p>
        These terms are governed by the laws of [YOUR JURISDICTION], and the courts of [YOUR
        JURISDICTION] have exclusive jurisdiction, subject to any mandatory consumer-protection
        rights you have where you live.
      </p>

      <H>Contact</H>
      <p>Questions about these terms: [CONTACT EMAIL].</p>
    </Prose>
  )
}
