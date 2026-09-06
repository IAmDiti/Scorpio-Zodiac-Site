import { Container } from '@/components/container'
import { PostCard } from '@/components/post-card'
import { listPublishedPosts } from '@/lib/posts'

export const revalidate = 300

export const metadata = {
  title: 'The Scorpio Daily Blog',
  description:
    'Essays and field notes on Scorpio, astrology and the sky, from the team behind Scorpio Daily. For entertainment purposes only.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'The Scorpio Daily Blog', type: 'website' },
}

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts()

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <div className="sm:mx-auto sm:max-w-2xl sm:text-center">
        <p className="eyebrow mb-2 text-eyebrow">Read</p>
        <h1 className="text-[30px] text-ink-bright sm:text-[42px]">The blog</h1>
        <p className="mt-2 text-[14px] text-ink-3 sm:text-[16px]">
          Longer thoughts on the sign, the sky, and everything Scorpio.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="mx-auto mt-10 max-w-md text-center font-ui text-[13px] text-ink-4">
          Nothing published yet. Check back soon.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </Container>
  )
}
