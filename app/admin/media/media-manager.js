'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

function prettySize(bytes) {
  if (!bytes) return ''
  const kb = bytes / 1024
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`
}

export function MediaManager({ items }) {
  const router = useRouter()
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)

  async function upload(files) {
    if (!files?.length) return
    setBusy(true)
    setError(null)
    try {
      for (const file of files) {
        const body = new FormData()
        body.set('file', file)
        const res = await fetch('/admin/media/upload', { method: 'POST', body })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed.')
      }
      router.refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function copy(url) {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(url)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      /* ignore */
    }
  }

  async function remove(path) {
    if (!confirm('Delete this image? Anything using its URL will break.')) return
    const body = new FormData()
    body.set('path', path)
    // Small enough to go through the upload route's sibling action via fetch to a
    // dedicated endpoint would be nicer, but reuse the Server Action form instead:
    const res = await fetch('/admin/media/delete', { method: 'POST', body })
    if (res.ok) router.refresh()
    else setError('Could not delete.')
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          upload([...e.dataTransfer.files])
        }}
        className="rounded-2xl border border-dashed border-line-2 bg-surface p-6 text-center"
      >
        <p className="font-ui text-[13px] text-ink-3">Drop images here, or</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => upload([...e.target.files])}
          disabled={busy}
          className="mt-2 block w-full font-ui text-[12px] text-ink-3 file:mr-3 file:min-h-[38px] file:cursor-pointer file:rounded-full file:border-0 file:bg-lilac file:px-4 file:font-bold file:text-void"
        />
        {busy ? <p className="mt-2 font-ui text-[12px] text-ink-4">Uploading…</p> : null}
        {error ? <p className="mt-2 font-ui text-[12px] text-[#f0a9b8]">{error}</p> : null}
      </div>

      {items.length === 0 ? (
        <p className="font-ui text-[13px] text-ink-4">No images yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <li key={it.path} className="overflow-hidden rounded-xl border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
              <img src={it.url} alt="" className="h-28 w-full object-cover" />
              <div className="flex flex-col gap-1.5 p-2.5">
                <p className="truncate font-ui text-[11px] text-ink-3" title={it.name}>
                  {it.name}
                </p>
                <p className="font-ui text-[10px] text-ink-5">{prettySize(it.size)}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copy(it.url)}
                    className="rounded-full border border-line-2 px-2.5 py-1 font-ui text-[10px] text-ink-2 hover:text-ink"
                  >
                    {copied === it.url ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(it.path)}
                    className="rounded-full border border-garnet/40 px-2.5 py-1 font-ui text-[10px] text-[#f0a9b8] hover:bg-garnet/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
