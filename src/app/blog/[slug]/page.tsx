import { getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import DOMPurify from 'dompurify'
import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params: { slug } }: Props): Promise<Metadata> {
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const title = post.title
  const description = post.excerpt || 'Read this blog post'
  const url = `${siteUrl}/blog/${slug}`

  return {
    title: `${title} | My Blog`,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: ['You']
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

export default async function PostPage({ params: { slug } }: Props) {
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  // Sanitize HTML content to prevent XSS
  const sanitizedHtml = post.html ? DOMPurify.sanitize(post.html) : ''

  return (
    <article className="py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
      <p className="text-sm text-slate-500 mb-6">{post.date}</p>
      {post.mdx ? (
        <MDXRemote source={post.mdx} />
      ) : (
        <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      )}
    </article>
  )
}
