import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getQuizRow, seedDefinitionFor } from '@/lib/admin/quizzes'
import { QuizEditor } from './quiz-editor'

export const metadata = { title: 'Edit quiz · Admin' }

export default async function EditQuizPage({ params }) {
  await requireAdmin()
  const { slug } = await params

  let row
  try {
    row = await getQuizRow(slug)
  } catch {
    notFound()
  }
  if (!row) notFound()

  return <QuizEditor row={row} bundled={seedDefinitionFor(slug)} />
}
