import { requireAdmin } from '@/lib/admin/auth'
import { PostEditor } from '../post-editor'

export const metadata = { title: 'New post · Admin' }

export default async function NewPostPage() {
  await requireAdmin()
  return <PostEditor post={null} />
}
