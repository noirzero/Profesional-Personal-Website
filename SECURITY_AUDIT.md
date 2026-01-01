# Security Audit Report

## 🔴 Critical Issues

### 1. **Vulnerable npm Dependencies** (HIGH)
- **glob** (indirect via next/eslint): Command injection vulnerability
- **next** (14.2.33): Denial of Service with Server Components (incomplete fix)

**Impact**: Attackers could potentially exploit DoS vulnerabilities in Server Components  
**Fix Required**: 
```bash
npm audit fix  # For glob fix
npm audit fix --force  # To upgrade to next 15.x (breaking change)
```

### 2. **XSS Vulnerability in Blog Posts** (HIGH)
**File**: `src/app/blog/[slug]/page.tsx` line 19
```tsx
<div className="prose" dangerouslySetInnerHTML={{ __html: post.html || '' }} />
```
**Issue**: User-provided markdown is rendered as raw HTML without sanitization  
**Impact**: If post files are user-editable or from untrusted source, XSS attacks possible  
**Current Risk**: LOW (posts in your repo are trusted, but vulnerable pattern)  
**Fix**: Use `html-react-parser` or DOMPurify, or render via MDXRemote (safer):
```bash
npm install html-react-parser
```

### 3. **GA Script Injection** (MEDIUM)
**File**: `src/app/layout.tsx` lines 35-37
```tsx
dangerouslySetInnerHTML={{
  __html: `...gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}'...)`
}}
```
**Issue**: While NEXT_PUBLIC_GA_ID should be safe, dynamically injected scripts are risky  
**Impact**: Minimal if GA ID is controlled, but violates security best practices  
**Fix**: Use Next.js Google Analytics package (`@next/third-parties/google`) instead

---

## 🟡 High-Risk Issues

### 4. **Missing Input Validation on API IDs** (MEDIUM)
**File**: `src/app/api/messages/[id]/route.ts`
```tsx
const { id } = params
// No validation that id is valid CUID/UUID before querying
await prisma.message.update({ where: { id }, data: { read: !!read } })
```
**Issue**: No validation on `id` parameter format  
**Impact**: Could cause confusing errors or information leakage in error messages  
**Fix**: Validate CUID format:
```typescript
import { isCuid } from '@paralleldrive/cuid2';
if (!isCuid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
```

### 5. **No CSRF Protection on Contact Form** (MEDIUM)
**File**: `src/app/api/contact/route.ts` and `src/app/contact/page.tsx`
**Issue**: Contact POST endpoint lacks CSRF token validation  
**Impact**: Attackers could submit contact forms on behalf of users  
**Current Mitigation**: NextAuth is in use but contact route is public (not NextAuth-protected)  
**Fix**: Add CSRF token to form and validate on backend (or use SameSite cookie policy)

### 6. **Weak Rate Limiting** (MEDIUM)
**File**: `src/app/api/contact/route.ts` lines 8-11
```typescript
const RATE_LIMIT_MAX = 10 // max requests per window
const rateMap: Map<string, { count: number; firstSeen: number }> = new Map()
```
**Issues**:
- In-memory rate limiter (no persistence across app restarts)
- No cleanup of old entries (memory leak)
- Easy to bypass by rotating IP addresses or using proxies
- Only 10 requests per hour is generous for spam

**Impact**: Spam/DoS vulnerable  
**Fix**: Use Redis-backed rate limiter in production:
```bash
npm install redis ioredis
```

---

## 🟠 Medium-Risk Issues

### 7. **Plaintext Password Comparison** (MEDIUM)
**File**: `src/lib/auth.ts` line 37
```typescript
if (credentials.password === process.env.ADMIN_PASSWORD) {
  return { id: 'dev-admin', name: 'Local Admin' }
}
```
**Issue**: Dev credentials use plain string comparison (no hashing)  
**Impact**: LOW in dev (only local testing), but violates security best practices  
**Mitigation**: This is dev-only and guarded by `NODE_ENV !== 'production'`  
**Recommendation**: For production, use bcrypt even for dev:
```bash
npm install bcryptjs
```

### 8. **No SQL Injection Protection Verification** (MEDIUM)
**File**: `src/lib/posts.ts` and `src/lib/prismadb.ts`
**Status**: ✅ SAFE — Prisma ORM protects against SQL injection via parameterized queries

### 9. **Missing Content Security Policy (CSP)** (MEDIUM)
**Issue**: No CSP headers configured (only basic security headers)  
**File**: `next.config.js`
**Current Headers**:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-XSS-Protection: 1; mode=block
- ❌ Content-Security-Policy: NOT SET
- ❌ Strict-Transport-Security: NOT SET

**Impact**: CSP helps prevent XSS, clickjacking, and injection attacks  
**Fix**: Add to next.config.js:
```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'"
}
```

### 10. **Unencrypted Session Storage** (MEDIUM)
**File**: `src/components/CookieConsent.tsx` and `src/components/ThemeToggle.tsx`
**Issue**: User preferences stored in localStorage (not encrypted)  
**Impact**: Minimal (non-sensitive data), but localStorage is not secure  
**Current Data**: Only consent flag and theme preference (non-sensitive)  
**Status**: Acceptable for current use

---

## 🟢 Low-Risk Issues

### 11. **Missing nextauth.secret in .env** (LOW)
**File**: `.env` (if running without NEXTAUTH_SECRET)
**Issue**: If NEXTAUTH_SECRET not set, NextAuth will warn but still work  
**Impact**: JWT tokens could be guessed  
**Fix**: Ensure `.env.local` has `NEXTAUTH_SECRET=<random-secret-here>`

### 12. **Incomplete Error Handling** (LOW)
**File**: Multiple API routes catch all errors and return generic 404/500  
**Impact**: Could hide bugs or reveal partial stack traces  
**Recommendation**: Add proper error logging to Sentry

### 13. **No Rate Limiting on Auth Endpoints** (LOW)
**File**: `src/app/api/auth/[...nextauth]/route.ts`
**Issue**: NextAuth sign-in endpoint not rate-limited (handled by NextAuth internally)  
**Status**: NextAuth has built-in protections, but verify in production

### 14. **Missing Security.txt** (LOW)
**Issue**: No `/.well-known/security.txt` file for vulnerability disclosures  
**Fix**: Create `public/.well-known/security.txt`:
```
Contact: security@yourdomain.com
Expires: 2026-12-24T00:00:00Z
```

---

## ✅ Security Best Practices Already Implemented

- ✅ Honeypot field in contact form (bot protection)
- ✅ Input validation with zod (contact form)
- ✅ Secrets not logged to console
- ✅ Environment variables properly separated (NEXT_PUBLIC_* vs private)
- ✅ GitHub OAuth (no hardcoded passwords in public code)
- ✅ Dev-only credentials provider (guarded by NODE_ENV check)
- ✅ NextAuth JWT sessions (not server-side sessions)
- ✅ Prisma ORM (SQL injection protected)
- ✅ Trust boundary respected (public vs authenticated endpoints)

---

## 🔐 Deployment Checklist

**Before Production Deploy:**

- [ ] Run `npm audit fix` to patch glob vulnerability
- [ ] Upgrade next to fix Server Components DoS (or accept risk)
- [ ] Add CSRF token to contact form
- [ ] Replace in-memory rate limiter with Redis
- [ ] Add HTTPS enforcement (CSP + HSTS headers)
- [ ] Set NEXTAUTH_SECRET to strong random value
- [ ] Remove ADMIN_PASSWORD from environment (disable dev auth)
- [ ] Configure Sentry DSN for error tracking
- [ ] Set up GitHub OAuth credentials securely
- [ ] Test SendGrid email sending (use production key)
- [ ] Enable HTTPS everywhere (Vercel/host does this)
- [ ] Set up .well-known/security.txt
- [ ] Review all environment variable examples in .env.example

**During Operation:**

- [ ] Monitor contact form submissions for spam
- [ ] Review admin messages regularly
- [ ] Check Sentry error logs daily
- [ ] Monitor rate limiter effectiveness
- [ ] Keep dependencies up to date

---

## Summary

| Category | Count | Risk Level |
|----------|-------|-----------|
| Critical | 1 | 🔴 |
| High | 2 | 🔴 |
| Medium | 5 | 🟡 |
| Low | 6 | 🟢 |

**Overall Risk**: **MEDIUM** (primarily due to npm vulnerabilities, not code logic)

**Safe for Deployment?** 
- ✅ For internal/personal use: YES
- ⚠️ For public with user input: FIX CSP + CSRF first
- ⚠️ For production: Update npm deps + add Redis rate limiter

**Recommendation**: Fix the 3 critical/high items before public launch.
