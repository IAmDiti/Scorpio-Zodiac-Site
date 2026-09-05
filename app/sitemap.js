import { allQuizzes, allResultParams } from '@/lib/quizzes/index.js'
import { SIGNS } from '@/lib/astro/zodiac'
import { pairSlug } from '@/lib/constants'
import { SITE_URL } from '@/lib/site'

const base = SITE_URL

export default function sitemap() {
  const lastModified = new Date().toISOString().slice(0, 10)

  const entries = [
    { url: base, priority: 1, changeFrequency: 'daily' },
    { url: `${base}/horoscope`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${base}/compatibility`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/quizzes`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/about-scorpio`, priority: 0.6, changeFrequency: 'yearly' },
    { url: `${base}/privacy`, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${base}/terms`, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${base}/disclaimer`, priority: 0.2, changeFrequency: 'yearly' },
  ]

  for (const sign of SIGNS) {
    entries.push({
      url: `${base}/compatibility/${pairSlug(sign.key)}`,
      priority: 0.7,
      changeFrequency: 'monthly',
    })
  }
  for (const quiz of allQuizzes()) {
    entries.push({ url: `${base}/quiz/${quiz.slug}`, priority: 0.7, changeFrequency: 'monthly' })
  }
  for (const { slug, key } of allResultParams()) {
    entries.push({
      url: `${base}/quiz/${slug}/r/${key}`,
      priority: 0.5,
      changeFrequency: 'monthly',
    })
  }

  return entries.map((e) => ({ ...e, lastModified }))
}
