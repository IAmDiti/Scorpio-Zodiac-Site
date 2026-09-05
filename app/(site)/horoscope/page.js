import { PagePlaceholder } from '@/components/page-placeholder'

export const metadata = { title: 'Daily Horoscope' }

export default function HoroscopePage() {
  return (
    <PagePlaceholder
      eyebrow="Daily horoscope"
      title="Scorpio, today"
      blurb="Generated each morning from the real positions of the Sun, Moon and planets — not generic sun-sign filler."
      phase="Phase 3 (horoscope + compatibility)"
    />
  )
}
