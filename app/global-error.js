'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: '#0b0812',
          color: '#f4eef7',
          fontFamily: 'Georgia, serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24 }}>Something slipped into shadow</h1>
        <p style={{ color: '#a99fb8', fontSize: 15 }}>
          An unexpected error occurred. Try again in a moment.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 8,
            padding: '12px 22px',
            borderRadius: 999,
            border: 'none',
            background: '#c02a4a',
            color: '#fff',
            fontWeight: 700,
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
