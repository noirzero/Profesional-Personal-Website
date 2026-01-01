# Code Audit Report

## 🔴 Critical Issues

### 1. **Contact Page Type Error (contact/page.tsx)**
- **Issue**: Line 4 imports `Metadata` but the file is a client component (`'use client'`). Metadata can only be exported from server components.
- **Impact**: Build may fail in strict mode or cause runtime warnings.
- **Fix**: Remove unused `Metadata` import.

### 2. **Admin Page Type Suppression (admin/page.tsx)**
- **Issue**: Line 47 uses `@ts-ignore` to suppress TypeScript errors for `ClientAdminControls`. This hides legitimate type issues.
- **Impact**: Component might receive wrong props or types could silently fail.
- **Fix**: Properly type the dynamic import or use `React.FC` type wrapper.

### 3. **Service Worker Manifest Caching (public/sw.js)**
- **Issue**: Service worker tries to cache `/manifest.json` in install event but manifest.json is not listed in the cache URLs.
- **Impact**: Manifest won't be cached; offline users won't get the app manifest.
- **Fix**: Remove manifest from cache list (it's static and served by CDN).

### 4. **GitHub Actions Lighthouse Workflow (lighthouse.yml)**
- **Issue**: Uses deprecated action `jakejarvis/wait-action@v0.1.14` which doesn't exist.
- **Impact**: Lighthouse CI workflow will fail.
- **Fix**: Use `sleep` command or remove the wait action entirely.

## 🟡 Warnings & Improvements

### 5. **Rate Limiter Memory Leak (contact/route.ts)**
- **Issue**: In-memory rate limiter (`rateMap`) grows unbounded; never removes expired entries.
- **Impact**: Memory leak over time as map accumulates IPs.
- **Fix**: Implement periodic cleanup or use TTL-based cleanup on access.

### 6. **Missing Honeypot Field in Contact Form (contact/page.tsx)**
- **Issue**: Form is missing the honeypot `hp` field defined in the API validation.
- **Impact**: Honeypot protection is ineffective if field isn't present.
- **Fix**: Add hidden honeypot field to form.

### 7. **Blog Post Sorting Edge Case (posts.ts)**
- **Issue**: Posts sorted by `date` string (not parsed). If dates are non-ISO-8601, sorting will fail.
- **Impact**: Blog posts may appear in wrong order if date format is inconsistent.
- **Fix**: Parse dates as `new Date()` for comparison or enforce ISO-8601 format.

### 8. **No Error Handling for Missing Post (blog/[slug]/page.tsx)**
- **Issue**: When post slug doesn't exist, `getPostBySlug` returns `null` but page doesn't handle it.
- **Impact**: Will render `post` as null and cause runtime errors.
- **Fix**: Add 404 handling or `notFound()` redirect.

### 9. **Contact Form Focus Outline Mismatch (contact/page.tsx)**
- **Issue**: Form inputs use hardcoded `focus:ring-2 focus:ring-blue-500` instead of respecting global `.sr-only` and `:focus-visible` styles.
- **Impact**: Inconsistent keyboard navigation styling across the site.
- **Fix**: Remove inline focus styles and let global CSS handle it.

### 10. **Missing CSRF Protection on Contact POST (contact/route.ts)**
- **Issue**: NextAuth provides CSRF middleware, but the contact form doesn't use CSRF tokens.
- **Impact**: Vulnerable to CSRF attacks.
- **Fix**: Add CSRF token to contact form and validate on server.

### 11. **Unused `next-pwa` Dependency (package.json)**
- **Issue**: `next-pwa` entry was attempted but installation failed; still in package.json with try/catch wrapper in config.
- **Impact**: False sense of PWA completeness; manual SW works but inconsistent.
- **Fix**: Remove from package.json since manual SW is in use.

### 12. **Missing Blog Metadata Generation (blog/page.tsx)**
- **Issue**: Blog index doesn't use `generateMetadata`. Meta titles/descriptions are static.
- **Impact**: No dynamic OG tags for social sharing; SEO impact.
- **Fix**: Create `generateMetadata` function for dynamic SEO.

### 13. **Tailwind CSS Unknown Rule Warning (globals.css)**
- **Issue**: IDE reports "Unknown at rule @tailwind" (false positive from CSS linter, not Tailwind).
- **Impact**: IDE warnings clutter the editor; can be silenced.
- **Fix**: Add PostCSS plugin directive to silence the warning.

### 14. **No Validation on Admin API Params (messages/[id]/route.ts)**
- **Issue**: `id` param is not validated; any string is accepted (though Prisma will fail).
- **Impact**: If Prisma validation fails, error message leaks to client.
- **Fix**: Add zod validation for `id` format (UUID/CUID).

### 15. **SignIn Form Alert() for Errors (SignInForm.tsx)**
- **Issue**: Error feedback uses browser `alert()` instead of UI state.
- **Impact**: Poor UX; not accessible; blocks interaction.
- **Fix**: Add error state to component and display inline.

### 16. **No Redirect After Successful Contact Submission (contact/page.tsx)**
- **Issue**: Form is cleared but user stays on page with just a success message.
- **Impact**: No clear indication of completion; user might re-submit.
- **Fix**: Add redirect to thank-you page or a more prominent success state.

### 17. **sendViaSendGrid Error Does Not Persist Message (contact/route.ts)**
- **Issue**: If SendGrid send fails, message is not persisted as fallback.
- **Impact**: Contact message is lost even though user saw success.
- **Fix**: Always persist message to DB, try SendGrid separately.

## 📋 Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical Bugs | 4 | 🔴 Must Fix |
| Warnings | 13 | 🟡 Should Fix |

All issues documented and ready for fixes.
