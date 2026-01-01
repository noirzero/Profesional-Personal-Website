// Type definitions for the application
// Usage: import type { Post, Message } from '@/types'

// Blog post type
export type Post = {
  slug: string
  title: string
  date: string
  excerpt?: string
  content?: string
  html?: string
  mdx?: any
}

// Contact/Message type
export type Message = {
  id: string
  name?: string | null
  email: string
  message: string
  ip?: string | null
  createdAt: Date
  read: boolean
}

// Contact form submission
export type ContactFormData = {
  name?: string
  email: string
  message: string
  hp?: string
  csrf?: string
}

// API response types
export type ApiResponse<T = unknown> = {
  ok: boolean
  error?: string
  data?: T
  details?: Record<string, unknown>
}

export type ApiError = {
  error: string
  details?: Record<string, unknown>
  status?: number
}

// Project/Portfolio type
export type Project = {
  id: string
  title: string
  description: string
  image?: string
  url?: string
  github?: string
  tags: string[]
}

// User session type (for NextAuth)
export type Session = {
  user?: {
    email?: string | null
    image?: string | null
    name?: string | null
  }
  expires: string
}
