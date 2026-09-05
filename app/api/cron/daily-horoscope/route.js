import { NextResponse } from 'next/server'
import { ensureHoroscope, generateHoroscope, storeHoroscope } from '@/lib/horoscope'
import { todayISO, isValidDateISO } from '@/lib/dates'

export const dynamic = 'force-dynamic'

function authorized(request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  const qs = new URL(request.url).searchParams.get('secret')
  return auth === `Bearer ${secret}` || qs === secret
}

async function handle(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const date = url.searchParams.get('date') || todayISO()
  const force = url.searchParams.get('force') === '1'

  if (!isValidDateISO(date)) {
    return NextResponse.json({ error: 'invalid date' }, { status: 400 })
  }

  try {
    let row
    if (force) {
      row = await generateHoroscope(date)
      await storeHoroscope(row, { overwrite: true })
    } else {
      row = await ensureHoroscope(date)
    }
    return NextResponse.json({
      ok: true,
      date,
      model: row.model,
      generated_at: row.generated_at,
    })
  } catch (e) {
    console.error('daily-horoscope cron failed', e)
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
