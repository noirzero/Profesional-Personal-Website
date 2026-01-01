import { getAllPosts } from '@/lib/posts'

function buildRss(items: { title: string; slug: string; date: string; excerpt?: string }[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourname.com'
  const feedItems = items
    .map(
      (it) => `
    <item>
      <title>${escapeHtml(it.title)}</title>
      <link>${siteUrl}/blog/${it.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${it.slug}</guid>
      <pubDate>${new Date(it.date).toUTCString()}</pubDate>
      <description>${escapeHtml(it.excerpt || '')}</description>
    </item>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Your Name — Blog</title>
      <link>${siteUrl}</link>
      <description>Latest posts</description>
      ${feedItems}
    </channel>
  </rss>`
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

export async function GET() {
  const posts = await getAllPosts()
  const items = posts.map((p) => ({ title: p.title, slug: p.slug, date: p.date, excerpt: p.excerpt }))
  const xml = buildRss(items)
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
