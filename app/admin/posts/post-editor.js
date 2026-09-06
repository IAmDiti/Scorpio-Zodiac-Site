'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { marked } from 'marked'
import { Field, TextInput, TextArea, SubmitButton, FormMessage, Card } from '@/components/admin/ui'
import { ImagePicker } from '@/components/admin/image-picker'
import { createPostAction, updatePostAction, setStatusAction, deletePostAction } from './actions'

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function PostEditor({ post }) {
  const editing = Boolean(post?.id)
  const action = editing ? updatePostAction.bind(null, post.id) : createPostAction
  const [state, formAction] = useActionState(action, null)

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [slugTouched, setSlugTouched] = useState(editing)
  const [body, setBody] = useState(post?.body || '')
  const [preview, setPreview] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] text-ink-bright">{editing ? 'Edit post' : 'New post'}</h1>
        <Link href="/admin/posts" className="font-ui text-[12px] text-ink-4 hover:text-ink-2">
          ← All posts
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <Card className="flex flex-col gap-4">
          <Field label="Title">
            <TextInput
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slugTouched) setSlug(slugify(e.target.value))
              }}
              required
            />
          </Field>

          <Field label="Slug" hint="The URL is /blog/<slug>. Changing it on a live post breaks old links.">
            <TextInput
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
            />
          </Field>

          <Field label="Excerpt" hint="One or two sentences. Shows on the blog index and as the share description.">
            <TextArea name="excerpt" rows={2} defaultValue={post?.excerpt || ''} />
          </Field>

          <ImagePicker
            name="cover_url"
            label="Cover image"
            prefix="posts"
            defaultValue={post?.cover_url || ''}
          />
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-ui text-[11px] uppercase tracking-[0.06em] text-ink-4">
              Body (Markdown)
            </span>
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="font-ui text-[11px] text-lilac"
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {preview ? (
            <div
              className="post-body min-h-[16rem] rounded-lg border border-line-2 bg-void p-4"
              dangerouslySetInnerHTML={{ __html: marked.parse(body || '_Nothing yet._') }}
            />
          ) : (
            <TextArea
              name="body"
              rows={18}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="font-mono"
            />
          )}
          {/* keep body in the form even while previewing */}
          {preview ? <input type="hidden" name="body" value={body} /> : null}
        </Card>

        <FormMessage state={state} />

        <div className="flex flex-wrap items-center gap-2.5">
          <SubmitButton>{editing ? 'Save' : 'Create draft'}</SubmitButton>
          {editing ? <StatusButtons post={post} /> : null}
        </div>
      </form>

      {editing ? (
        <Card className="flex items-center justify-between border-garnet/30">
          <div>
            <p className="font-ui text-[13px] text-ink-2">Delete this post</p>
            <p className="font-ui text-[11px] text-ink-4">Permanent. The URL will 404.</p>
          </div>
          <form action={deletePostAction.bind(null, post.id)}>
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm('Delete this post permanently?')) e.preventDefault()
              }}
              className="rounded-full border border-garnet/50 px-4 py-2 font-ui text-[12px] font-bold text-[#f0a9b8] hover:bg-garnet/10"
            >
              Delete
            </button>
          </form>
        </Card>
      ) : null}
    </div>
  )
}

function StatusButtons({ post }) {
  const [state, setState] = useState(null)
  const published = post.status === 'published'

  async function toggle() {
    const res = await setStatusAction(post.id, published ? 'draft' : 'published')
    setState(res)
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex min-h-[42px] items-center rounded-full px-5 font-ui text-[13px] font-bold ${
          published
            ? 'border border-line-2 text-ink-2 hover:text-ink'
            : 'bg-violet text-white hover:opacity-90'
        }`}
      >
        {published ? 'Unpublish' : 'Publish'}
      </button>
      {published ? (
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          className="font-ui text-[12px] text-lilac"
        >
          View ↗
        </Link>
      ) : null}
      {state?.error ? (
        <span className="font-ui text-[11px] text-[#f0a9b8]">{state.error}</span>
      ) : state?.message ? (
        <span className="font-ui text-[11px] text-lilac">{state.message}</span>
      ) : null}
    </>
  )
}
