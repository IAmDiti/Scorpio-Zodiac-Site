const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/onboarding', '/auth/', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
