import { Cinzel, Spectral, Karla } from 'next/font/google'
import './globals.css'
import { Starfield } from '@/components/starfield'
import { Analytics } from '@/components/analytics'
import { SiteNotice } from '@/components/site-notice'
import { JsonLd } from '@/components/json-ld'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-karla',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Daily Scorpio Horoscope & Compatibility`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    title: `${SITE_NAME} — Daily Scorpio Horoscope & Compatibility`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Daily Scorpio Horoscope`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport = {
  themeColor: '#0b0812',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: siteUrl,
  description: SITE_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon`,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${spectral.variable} ${karla.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-garnet focus:px-4 focus:py-2 focus:font-ui focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <Starfield />
        {children}
        <SiteNotice />
        <Analytics />
        <JsonLd data={orgJsonLd} />
      </body>
    </html>
  )
}
