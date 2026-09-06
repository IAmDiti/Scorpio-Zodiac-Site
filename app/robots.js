import { SITE_URL } from '@/lib/site'

const base = SITE_URL

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/onboarding', '/auth/', '/api/', '/admin'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
