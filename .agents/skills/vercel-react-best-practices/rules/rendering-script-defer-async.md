---
title: Use defer or async on Script Tags
impact: HIGH
impactDescription: eliminates render-blocking
tags: rendering, script, defer, async, performance
---

## Use defer or async on Script Tags

**Impact: HIGH (eliminates render-blocking)**

Script tags without `defer` or `async` block HTML parsing while the script downloads and executes. This delays First Contentful Paint and Time to Interactive.

In Next.js, use `next/script` with the `strategy` prop instead of raw `<script>` tags to avoid render-blocking and SSR hydration issues:

- **`afterInteractive`** (replaces `async`): independent scripts like analytics — use in `page.tsx` or any component
- **`beforeInteractive`** (replaces `defer`): critical scripts that must load early — **root `app/layout.tsx` only** in the App Router
- **`lazyOnload`**: non-critical scripts (chat widgets, social embeds) — loads during browser idle time

**Incorrect (blocks rendering):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        <script src="https://example.com/analytics.js" />
        <script src="/scripts/utils.js" />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

**Correct (non-blocking with next/script):**

`beforeInteractive` belongs in the root layout; page-level scripts use `afterInteractive` (or `lazyOnload` for non-critical scripts).

```tsx
// app/layout.tsx — beforeInteractive is allowed here only
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* DOM-dependent script — defer equivalent */}
        <Script src="/scripts/utils.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}
```

```tsx
// app/page.tsx — afterInteractive for independent scripts
import Script from 'next/script'

export default function Page() {
  return (
    <>
      {/* Independent script — async equivalent */}
      <Script src="https://example.com/analytics.js" strategy="afterInteractive" />
    </>
  )
}
```

```tsx
// app/page.tsx — lazyOnload for non-critical scripts
import Script from 'next/script'

export default function Page() {
  return (
    <>
      {/* Chat widget — load during idle time, after page is fully interactive */}
      <Script src="https://example.com/chat-widget.js" strategy="lazyOnload" />
    </>
  )
}
```

Reference: [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
