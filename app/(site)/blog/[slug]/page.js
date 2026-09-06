import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/container'
import { JsonLd } from '@/components/json-ld'
import { getPublishedPost } from '@/lib/posts'
import { SITE_NAME } from '@/lib/constants'
import { SITE_URL as siteUrl } from '@/lib/site'

export const revalidate = 300
export const dynamicParams = true

export function generateStaticParams() {
  // Rendered on demand then cached (mirrors /compatibility/[pair]); no DB at build.
  return []
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.published_at || undefined,
      ...(post.cover_url ? { images: [{ url: post.cover_url, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    image: post.cover_url || undefined,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container size="prose" className="py-6 sm:py-10">
        <Link href="/blog" className="font-ui text-[12px] text-ink-4 hover:text-ink-2">
          ← The blog
        </Link>

        <h1 className="mt-4 text-[28px] leading-tight text-ink-bright sm:text-[38px]">
          {post.title}
        </h1>
        {post.published_at ? (
          <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.14em] text-ink-4">
            {new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        ) : null}

        {post.cover_url ? (
          <div className="relative mt-6 aspect-[1200/630] overflow-hidden rounded-2xl border border-line bg-surface-2">
            <Image
              src={post.cover_url}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 42rem, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div
          className="post-body mt-7"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <hr className="my-10 border-line-2" />
        <p className="font-ui text-[12px] text-ink-4">
          For entertainment purposes only.{' '}
          <Link href="/horoscope" className="font-bold text-lilac">
            Read today’s Scorpio horoscope →
          </Link>
        </p>
      </Container>
    </>
  )
}
