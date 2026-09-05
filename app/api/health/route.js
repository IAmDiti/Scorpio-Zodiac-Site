import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Lightweight liveness check for Railway's healthcheck. Does not touch
// the database or any external service on purpose.
export function GET() {
  return NextResponse.json({ ok: true, ts: new Date().toISOString() })
}
