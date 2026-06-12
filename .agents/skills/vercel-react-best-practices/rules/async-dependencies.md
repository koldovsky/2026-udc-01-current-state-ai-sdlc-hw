---
title: Dependency-Based Parallelization
impact: CRITICAL
impactDescription: 2-10× improvement
tags: async, parallelization, dependencies, better-all
---

## Dependency-Based Parallelization

For operations with partial dependencies, start each task at the earliest possible moment so independent work is not blocked. Prefer native promises for this; reach for a helper library only when you genuinely need DAG-like parallelism.

**Incorrect (profile waits for config unnecessarily):**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**Correct (config and profile run in parallel, no extra dependencies):**

We create all the promises first, then `await Promise.all()` at the end so each task starts as soon as its dependencies are ready.

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

**Optional (DAG-like parallelism with `better-all`):**

> `better-all` is a third-party dependency. Use it only when you need DAG-like parallelism that is awkward to express with native promises, and the team accepts the added dependency.

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

Reference: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)
