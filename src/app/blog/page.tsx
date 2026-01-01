import type { Metadata } from 'next'
import Link from 'next/link'

import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog — Your Name',
  description: 'Articles and notes.'
}

export default async function Blog() {
  const posts = await getAllPosts()

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Blog</h2>
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="border rounded p-4 hover:bg-slate-50 transition-colors">
              <Link href={`/blog/${p.slug}`} className="font-medium text-slate-900 hover:text-blue-600">{p.title}</Link>
              <p className="text-sm text-slate-600">{p.excerpt}</p>
              <p className="text-xs text-slate-500 mt-2">{p.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
