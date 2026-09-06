import { NextResponse } from 'next/server'
import { getAdminUser, isAdmin } from '@/lib/admin/auth'
import { deleteMedia } from '@/lib/admin/media'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const user = await getAdminUser()
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 404 })
  }

  const form = await request.formData()
  try {
    await deleteMedia(form.get('path')?.toString())
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Delete failed.' }, { status: 400 })
  }
}
