import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { serialize } from 'next-mdx-remote/serialize'

export type Post = {
  slug: string
  title: string
  date: string
  excerpt?: string
  content?: string
  html?: string
  mdx?: any
}

const POSTS_PATH = path.join(process.cwd(), 'src', 'posts')

function readPostFile(filePath: string) {
  const source = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(source)
  const html = marked.parse(content)
  return {
    frontmatter: data as any,
    content,
    html
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_PATH)) return []
  const files = fs.readdirSync(POSTS_PATH).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  const posts = [] as Post[]

  for (const file of files) {
    const fullPath = path.join(POSTS_PATH, file)
    const { frontmatter, html, content } = readPostFile(fullPath)
    const slug = file.replace(/\.mdx?$/, '')
    const post: Post = {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || '',
      excerpt: frontmatter.excerpt || (content ? content.slice(0, 160) : ''),
      content,
      html
    }

    // If MDX file, serialize for server rendering
    if (file.endsWith('.mdx')) {
      try {
        post.mdx = await serialize(content)
      } catch (err) {
        // fallback: leave mdx undefined
        console.warn('MDX serialize failed for', file, err)
      }
    }

    posts.push(post)
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const mdPath = path.join(POSTS_PATH, `${slug}.md`)
  const mdxPath = path.join(POSTS_PATH, `${slug}.mdx`)
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null
  if (!filePath) return null
  const { frontmatter, html, content } = readPostFile(filePath)
  const post: Post = {
    slug,
    title: frontmatter.title || slug,
    date: frontmatter.date || '',
    excerpt: frontmatter.excerpt || (content ? content.slice(0, 160) : ''),
    content,
    html
  }

  if (filePath.endsWith('.mdx')) {
    try {
      post.mdx = await serialize(content)
    } catch (err) {
      console.warn('MDX serialize failed for', slug, err)
    }
  }

  return post
}
