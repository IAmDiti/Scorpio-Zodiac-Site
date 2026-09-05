import { Prose } from '@/components/prose'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: 'Disclaimer',
  description: 'Horoscopes, compatibility readings and quizzes on this site are for entertainment.',
  alternates: { canonical: '/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <Prose title="Disclaimer" updated="[LAST UPDATED DATE]">
      <p>
        Everything on {SITE_NAME} — daily horoscopes, compatibility readings, quizzes and any paid
        birth-chart or relationship reports — is provided{' '}
        <strong>for entertainment purposes only</strong>.
      </p>
      <p>
        Our horoscopes are generated from the real astronomical positions of the Sun, Moon and
        planets, interpreted through the conventions of Western astrology. &ldquo;Accurate&rdquo; on
        this site means grounded in genuine ephemeris data and consistent astrological logic rather
        than generic sun-sign filler. It does not mean scientifically valid or predictive. Astrology
        is not a science, and none of this content is factual or a forecast of real events.
      </p>
      <p>
        Nothing here is medical, psychological, legal, financial or relationship advice. Do not make
        important decisions based on anything you read on this site. If you need support, please
        speak to a qualified professional.
      </p>
      <p>
        By using {SITE_NAME} you acknowledge that you understand and accept this. You must be at
        least 16 years old to create an account.
      </p>
    </Prose>
  )
}
