# Feature 'list of notes'. 

## Acceptance criteria
1. Users can create and save new notes in the list.
2. Notes are displayed in chronological order with the most recent at the top.
3. Users can edit and delete existing notes.
4. No persistence across user sessions (notes are not saved).
5. Users can search or filter notes by keywords.

## Plan mode

1. Replace starter home page with a `NotesPage` implementation based on in-memory React state (`useState`), so notes reset on page reload and across sessions.
2. Split UI into co-located App Router components with `PascalCase` names:
   - `app/app/NotesPage.tsx`
   - `app/app/NoteComposer.tsx`
   - `app/app/NotesFilter.tsx`
   - `app/app/NotesList.tsx`
3. Implement feature behavior:
   - Create note (trim text, ignore empty input)
   - Keep newest note at the top
   - Edit and delete existing notes
   - Filter list by keyword (case-insensitive)
4. Apply UI requirement that all labels and action captions are bold italic.
5. Add component-level interaction tests (Vitest + Testing Library) for create/order/edit/delete/filter acceptance criteria.

Applied adjustments to the plan after review:
- add component-level tests for NotesPage interactions
- split into co-located PascalCase components for readability
- in UI labels have to be in bold italic

## Agent mode

Implementation is done.
Build was required to see the feature in the browser. All acceptance criteria are met. Interaction tests are passing.
