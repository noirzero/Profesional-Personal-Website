// Central constants for the application
// Usage: import { SITE_NAME, MESSAGES_PER_PAGE } from '@/lib/constants'

export const SITE_NAME = 'Your Name'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

// Pagination
export const MESSAGES_PER_PAGE = 10
export const POSTS_PER_PAGE = 10

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
export const RATE_LIMIT_MAX = 10 // max requests per window

// Theme
export const THEME_COLORS = {
  light: '#0ea5a4',
  dark: '#66e0db'
}

// Time formats
export const DATE_FORMAT = 'MMMM d, yyyy'
export const DATETIME_FORMAT = 'MMMM d, yyyy h:mm a'

// Environment checks
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_TEST = process.env.NODE_ENV === 'test'

// API endpoints
export const API_ROUTES = {
  CONTACT: '/api/contact',
  CSRF: '/api/csrf',
  AUTH: '/api/auth',
  MESSAGES: '/api/messages',
  RSS: '/rss'
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  PORTFOLIO: '/portfolio',
  CONTACT: '/contact',
  ADMIN: '/admin',
  SIGNIN: '/signin'
} as const
