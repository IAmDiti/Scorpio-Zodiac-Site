import { NextResponse } from 'next/server'
import { getAdminUser, isAdmin } from '@/lib/admin/auth'
import { uploadMedia } from '@/lib/admin/media'

// File uploads go through a Route Handler rather than a Server Action so they
// aren't bound by the 1 MB action body limit. Admin is re-checked here — the
// handler is a public POST endpoint like any other.
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const user = await getAdminUser()
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 404 })
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart form data.' }, { status: 400 })
  }

  const file = form.get('file')
  const prefix = (form.get('prefix') || '').toString()

  try {
    const { path, url } = await uploadMedia(file, { prefix })
    return NextResponse.json({ path, url })
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Upload failed.' }, { status: 400 })
  }
}
