import Script from 'next/script'

/**
 * Plausible — privacy-friendly, cookieless analytics. Loads only when
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set (e.g. "scorpiodaily.com").
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  if (!domain) return null

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  )
}
