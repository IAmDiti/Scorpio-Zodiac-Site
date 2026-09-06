import Script from 'next/script'

/**
 * Google Analytics 4 (gtag.js). Loads when NEXT_PUBLIC_GA_MEASUREMENT_ID is
 * set; defaults to the project's own property so it works out of the box.
 * Set the env var to an empty string to disable.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-MK7C2CQ3Q2'

export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
