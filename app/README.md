# Notes List App

Small Next.js App Router app implementing a session-only notes list.

## Feature

- Create notes
- Newest notes appear first
- Edit and delete notes
- Search notes by keyword
- No persistence across sessions

## Commands

```bash
npm run dev
npm run test
npm run lint
```

## Key files

- `app/app/page.tsx` - route entry point
- `app/app/NotesPage.tsx` - notes state and feature logic
- `app/app/NoteComposer.tsx` - create form UI
- `app/app/NotesFilter.tsx` - filter UI
- `app/app/NotesList.tsx` - notes list + edit/delete UI
- `app/example.test.ts` - component-level interaction tests
