---
title: Use Activity Component for Show/Hide
impact: MEDIUM
impactDescription: preserves state/DOM
tags: rendering, activity, visibility, state-preservation
---

## Use Activity Component for Show/Hide

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility. The Activity component keeps a component mounted and preserves its internal state while hiding it visually.

**How Activity works:**

- **`mode="visible"`**: The component is fully rendered and interactive
- **`mode="hidden"`**: The component remains mounted and preserves its DOM/state, but is hidden from view (typically using CSS `display: none` or similar)

This prevents state loss and expensive re-initialization when components toggle visibility.

**Problem without Activity (state loss):**

```tsx
function FormModal({ isOpen }: Props) {
  return isOpen ? <ExpensiveForm /> : null
}
```

When `isOpen` toggles, the entire form component unmounts and remounts, losing:
- Input field values and focus state
- Form validation state
- Scroll position within the form
- Any other internal state

**Solution with Activity (state preserved):**

```tsx
import { Activity } from 'react'

function FormModal({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveForm />
    </Activity>
  )
}
```

The form stays mounted, preserves all internal state, and only toggles visibility.

**When to use Activity:**

✅ **Good use cases:**
- Dropdowns/menus with form state
- Modals with multi-step forms
- Collapsible panels with expensive computations
- Tabs that remember scroll position
- Any component with internal state that's expensive to reinitialize

❌ **When NOT to use Activity:**
- Simple UI elements (headings, static text)
- Components that perform initialization side effects on mount
- When you explicitly want fresh state on each open
- High-performance situations where keeping DOM improves memory usage

**Example (dropdown with input state):**

```tsx
import { Activity } from 'react'

function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Search</button>
      <Activity mode={isOpen ? 'visible' : 'hidden'}>
        <SearchForm />
      </Activity>
    </div>
  )
}
```

Without Activity, toggling the dropdown would clear the search input; with Activity, the input state persists.
