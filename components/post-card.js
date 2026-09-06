import Link from 'next/link'
import Image from 'next/image'

export function PostCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-2"
    >
      <div className="relative aspect-[1200/630] overflow-hidden bg-surface-2">
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_20%_-10%,#2a1740,#0b0812_60%)]" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[17px] leading-snug text-ink-bright sm:text-[19px]">{post.title}</h3>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 font-ui text-[12.5px] text-ink-3">{post.excerpt}</p>
        ) : null}
        {post.published_at ? (
          <p className="mt-3 font-ui text-[11px] text-ink-5">
            {new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
