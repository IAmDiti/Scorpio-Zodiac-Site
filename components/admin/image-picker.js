'use client'

import { useRef, useState } from 'react'
import { labelClass } from '@/components/admin/ui'

/**
 * A hidden text field named `name` holding an image URL, plus UI to set it:
 * upload a new file (POSTs to /admin/media/upload) or clear it. `prefix`
 * groups uploads into a folder in the media bucket (e.g. "posts", "quizzes").
 */
export function ImagePicker({ name, label = 'Image', defaultValue = '', prefix = '' }) {
  const [url, setUrl] = useState(defaultValue)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  async function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const body = new FormData()
      body.set('file', file)
      if (prefix) body.set('prefix', prefix)
      const res = await fetch('/admin/media/upload', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed.')
      setUrl(data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-start gap-3">
        <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line-2 bg-void">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview only
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-ui text-[11px] text-ink-4">No image</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            disabled={busy}
            className="block w-full font-ui text-[12px] text-ink-3 file:mr-3 file:min-h-[36px] file:cursor-pointer file:rounded-full file:border-0 file:bg-lilac file:px-4 file:font-ui file:text-[12px] file:font-bold file:text-void"
          />
          {url ? (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="self-start font-ui text-[11px] text-ink-4 underline hover:text-ink-2"
            >
              Remove
            </button>
          ) : null}
          {busy ? <span className="font-ui text-[11px] text-ink-4">Uploading…</span> : null}
          {error ? <span className="font-ui text-[11px] text-[#f0a9b8]">{error}</span> : null}
        </div>
      </div>
    </div>
  )
}
