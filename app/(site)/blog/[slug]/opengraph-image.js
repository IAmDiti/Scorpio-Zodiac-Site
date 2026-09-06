import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og-card'
import { getPublishedPost } from '@/lib/posts'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = OG_ALT

// Fallback share card for posts without a cover image. When a post has a
// cover_url, generateMetadata sets openGraph.images to it and this is unused.
export default async function Image({ params }) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  return new ImageResponse(
    <OgCard eyebrow="The Blog" title={post?.title || 'Scorpio Daily'} subtitle={post?.excerpt} />,
    { ...OG_SIZE }
  )
}
