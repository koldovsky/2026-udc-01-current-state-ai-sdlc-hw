---
title: Initialize App Once, Not Per Mount
impact: LOW-MEDIUM
impactDescription: avoids duplicate init in development
tags: initialization, useEffect, app-startup, side-effects
---

## Initialize App Once, Not Per Mount

Do not put app-wide initialization that must run once per app load inside `useEffect([])` of a component. Components can remount and effects will re-run. Use a module-level guard or top-level init in the entry module instead.

**Incorrect (runs twice in dev, re-runs on remount):**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**Correct (once per app load):**

```tsx
'use client'

let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

The `didInit` flag and the `useEffect([])` in `Comp` only work in a Client Component (note the `"use client"` marker). Do not use this module-level mutable flag in server or route-handler modules: on the server, module scope is process-wide shared memory, so `didInit` would leak across requests. See `server-no-shared-module-state` for why mutable module state is unsafe on the server.

Reference: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
