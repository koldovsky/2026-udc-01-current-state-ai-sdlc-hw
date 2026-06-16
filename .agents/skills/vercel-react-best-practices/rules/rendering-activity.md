---
title: Use Activity Component for Show/Hide
impact: MEDIUM
impactDescription: preserves state/DOM
tags: rendering, activity, visibility, state-preservation
---

## Use Activity Component for Show/Hide

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.

**Incorrect (conditional render loses state and remounts on toggle):**

```tsx
function Dropdown({ isOpen }: Props) {
  return (
    <div>
      {isOpen && <ExpensiveMenu />}
    </div>
  )
}
```

Unmounting on hide destroys internal state and forces a full remount/re-render each time visibility toggles.

**Correct (preserves state/DOM while hidden):**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Avoids expensive re-renders and state loss when frequently toggling visibility.
