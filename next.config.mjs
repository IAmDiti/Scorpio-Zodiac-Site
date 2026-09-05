import { withSentryConfig } from '@sentry/nextjs/config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Turbopack doesn't walk up to the home directory
  // (a stray lockfile lives in C:\Users\Diti).
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  devIndicators: false,
  poweredByHeader: false,
  compress: true,
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ]
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

// Error monitoring is opt-in: only wrap the build when a DSN is configured,
// so local and CI builds stay clean.
const config = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      widenClientFileUpload: true,
      tunnelRoute: '/monitoring',
    })
  : nextConfig

export default config
