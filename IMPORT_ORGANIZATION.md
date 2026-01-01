# 📦 Import Organization Reference

This document shows the recommended import organization patterns for your project.

## Pattern: Client Component with Forms

```tsx
// ✅ GOOD: Well-organized imports

'use client'

// 1. External dependencies
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Types
import type { ContactFormData } from '@/types'

// 3. API/Utils
import { RATE_LIMIT_MAX, API_ROUTES } from '@/lib/constants'

// 4. Components
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'

// Component
export default function ContactForm() {
  // ...
}
```

---

## Pattern: Server Component with Data Fetching

```tsx
// ✅ GOOD: Server component with async data

import { getAllPosts } from '@/lib'
import type { Post } from '@/types'
import { BlogCard } from '@/components/blog/BlogCard'

async function BlogPage() {
  const posts = await getAllPosts()
  
  return (
    <div>
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
```

---

## Pattern: API Route

```ts
// ✅ GOOD: API route with clear organization

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Types
import type { ContactFormData } from '@/types'

// Utils
import { verifyToken } from '@/lib/csrf'
import prisma from '@/lib/prismadb'
import { RATE_LIMIT_MAX } from '@/lib/constants'

// Schemas
import { contactFormSchema } from '@/lib/schemas/contact'

export async function POST(req: Request) {
  // Implementation
}
```

---

## Pattern: Utility/Helper File

```ts
// ✅ GOOD: Organized utility file

import type { Post } from '@/types'
import { DATE_FORMAT } from '@/lib/constants'

export function formatPostDate(date: string): string {
  // Implementation
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  // Implementation
}
```

---

## Import Organization Rules

### 1. **Order of Imports**
```
1. External packages (react, next, third-party)
   ↓
2. Type imports (import type { ... })
   ↓
3. Internal absolute imports (@/...)
   ↓
4. Side effects (CSS, etc.)
```

### 2. **Grouping**
```
// Group related imports together with blank lines
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Post, Message } from '@/types'

import { getAllPosts } from '@/lib'
import { SITE_NAME } from '@/lib/constants'

import { Header } from '@/components/layout'
```

### 3. **Avoid Deep Paths**

```tsx
// ❌ BAD: Too many ../
import Header from '../../../components/Header'
import { getPosts } from '../../../lib/posts'

// ✅ GOOD: Use @/ alias
import { Header } from '@/components/layout'
import { getPosts } from '@/lib'
```

### 4. **Use Index Files**

```tsx
// ❌ AVOID
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'

// ✅ BETTER: Create components/layout/index.ts
// then:
import { Header, Footer, Nav } from '@/components/layout'
```

---

## Example: Before and After

### ❌ BEFORE (Messy)

```tsx
import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { getAllPosts } from '../../lib/posts'
import { authOptions } from '../../lib/auth'
import { posts as allPosts } from '../../data/posts'
import { verifyToken } from '../../lib/csrf'
import type { Post } from '../../types'
import '@/styles/globals.css'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
```

### ✅ AFTER (Organized)

```tsx
// External
import Link from 'next/link'
import React from 'react'
import { getServerSession } from 'next-auth/next'

// Types
import type { Post } from '@/types'

// Internal
import { getAllPosts, verifyToken, authOptions } from '@/lib'
import { Header, Footer } from '@/components/layout'

// Styles
import '@/styles/globals.css'
```

---

## ESLint Rule (Optional)

Add to `.eslintrc.json` to enforce import order:

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "alphabeticalOrder": true,
        "newlinesBetween": "always"
      }
    ]
  }
}
```

---

## Quick Checklist

- [x] Use `@/` for all internal imports
- [x] Group imports by category
- [x] Separate external and internal imports
- [x] Use `import type { }` for type-only imports
- [x] Create index.ts files for easier imports
- [x] Keep imports alphabetized within groups
- [x] No relative paths (no `../..`)

---

**Remember**: Clean imports make code easier to read and maintain! 📦
