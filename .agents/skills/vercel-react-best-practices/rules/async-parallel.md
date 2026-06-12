---
title: Promise.all() for Independent Operations
impact: CRITICAL
impactDescription: 2-10× improvement
tags: async, parallelization, promises, waterfalls
---

## Promise.all() for Independent Operations

When async operations have no interdependencies, execute them concurrently using `Promise.all()`.

**Incorrect (sequential execution, 3 round trips):**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**Correct (parallel execution, 1 round trip):**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

> **Fail-fast warning:** `Promise.all()` rejects as soon as any input promise rejects, and the other results are discarded. Prefer it only when the operations are truly independent *and* you want all-or-nothing fail-fast behavior. When the operations must tolerate partial failure, use `Promise.allSettled()` (inspect each `status`) or wrap each call (`fetchUser()`, `fetchPosts()`, `fetchComments()`) in its own try/catch / per-promise error handling so one failure does not drop the successful results.
