import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getPost } from '@/lib/admin/posts'
import { PostEditor } from '../post-editor'

export const metadata = { title: 'Edit post · Admin' }

export default async function EditPostPage({ params }) {
  await requireAdmin()
  const { id } = await params

  let post
  try {
    post = await getPost(id)
  } catch {
    notFound()
  }
  if (!post) notFound()

  return <PostEditor post={post} />
}
