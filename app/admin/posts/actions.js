'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import {
  createPost,
  updatePost,
  setPostStatus,
  deletePost,
  getPost,
} from '@/lib/admin/posts'

function fields(formData) {
  return {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    body: formData.get('body'),
    cover_url: formData.get('cover_url'),
  }
}

function revalidatePost(slug) {
  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  if (slug) revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')
}

export async function createPostAction(_prev, formData) {
  const user = await requireAdmin()
  let id
  try {
    id = await createPost(fields(formData), user.email)
  } catch (e) {
    return { error: e?.message || 'Could not create the post.' }
  }
  revalidatePost()
  redirect(`/admin/posts/${id}`)
}

export async function updatePostAction(id, _prev, formData) {
  await requireAdmin()
  try {
    await updatePost(id, fields(formData))
  } catch (e) {
    return { error: e?.message || 'Could not save.' }
  }
  const post = await getPost(id)
  revalidatePost(post?.slug)
  return { ok: true, message: 'Saved.' }
}

export async function setStatusAction(id, status) {
  await requireAdmin()
  try {
    await setPostStatus(id, status)
  } catch (e) {
    return { error: e?.message || 'Could not update status.' }
  }
  const post = await getPost(id)
  revalidatePost(post?.slug)
  return { ok: true, message: status === 'published' ? 'Published.' : 'Moved to draft.' }
}

export async function deletePostAction(id) {
  await requireAdmin()
  const post = await getPost(id)
  try {
    await deletePost(id)
  } catch (e) {
    return { error: e?.message || 'Could not delete.' }
  }
  revalidatePost(post?.slug)
  redirect('/admin/posts')
}
