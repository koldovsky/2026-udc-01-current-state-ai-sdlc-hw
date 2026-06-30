# Process Retrospective: Online Piano

---

## 1. Acceptance Criteria

### Feature: Online Piano (single page)
- [x] Page renders a single piano keyboard with exactly 12 chromatic notes (C through B)
- [x] White keys (C D E F G A B) and black keys (C# D# F# G# A#) are visually distinct
- [x] Black keys appear at the top, overlapping the upper portion of white keys — real piano layout
- [x] Pressing a key plays a tone at the correct frequency for that note
- [x] Releasing a key stops the tone with a short fade-out
- [x] Only one note plays at a time; pressing a new key stops the previous

### Feature: Octave Control
- [x] 7 octave options (1–7) displayed as circular radio buttons in a horizontal row
- [x] Default selected octave is 4 (A4 = 440 Hz)
- [x] Selected octave highlighted in red (border + text + light red background)
- [x] Switching octave changes the pitch of subsequently pressed keys

### Feature: Timbre (Waveform) Selector
- [x] 4 waveform options displayed as rectangular buttons with rounded edges: Sine, Triangle, Square, Sawtooth
- [x] Buttons behave as a radio group (one active at a time)
- [x] Selected waveform highlighted in red; unselected in gray
- [x] Default is Triangle
- [x] Switching timbre changes the sound character of subsequently pressed keys
---

## 2. What Was Done in Each Mode

### Plan Mode — Round 1 (Online Piano + AGENTS.md)
- **Explored** the greenfield project: read `package.json`, all config files, existing `app/` structure
- **Designed** the full piano implementation: file structure, note layout math, Web Audio API approach, octave control design
- **Initial plan** proposed +/− buttons for octave control
- **User adjusted**: changed octave control to radio buttons with red highlight → plan updated before approval

### Implementation Mode — Round 1
- Updated `AGENTS.md` with conventions and guardrails
- Created `app/_lib/types.ts`, `audio.ts`, `hooks/usePiano.ts`
- Created `PianoKey.tsx` + `PianoKey.module.css`, `OctaveControl.tsx`, `Piano.tsx`
- Replaced `app/page.tsx` with the piano page
- Ran `npm run lint` → clean; verified SSR HTML via `curl` → all 12 keys + octave radio group confirmed

### Implementation Mode — Round 2 (settings.json + .ignore)
- Created `.claude/settings.json` with `permissions.deny` for node_modules, .next, out, lock files, .env/env.*
- Created `.ignore` with matching patterns for file-picker exclusion
- Validated with `jq -e '.permissions.deny | length'` → 16 rules, valid JSON
- User's linter simplified the deny list to 6 Read-only rules

### Plan Mode — Round 2 (Real piano layout + Timbre selector)
- **Explored** existing `PianoKey.module.css`, `Piano.tsx`, `audio.ts`, `usePiano.ts` to understand current flat-row layout
- **Designed** absolute-positioning approach: separate white/black rendering passes, pixel offsets computed from white-key width (52px) and black-key width (34px)
- **Designed** timbre selector: 4 Web Audio API waveform types, `Timbre` type, threaded through audio → hook → component
- **Initial plan** styled timbre buttons "like OctaveControl" (circular)
- **User adjusted**: changed to rectangular pill buttons with rounded edges (`rounded-lg`, `px-4 py-1.5`) → plan updated before approval

### Implementation Mode — Round 2
- Added `Timbre` type to `types.ts`
- Updated `audio.ts` signature: `playNote(note, octave, timbre)`
- Updated `usePiano.ts`: added `timbre` state + `changeTimbre` handler
- Created `TimbreControl.tsx` with 4 pill-style radio labels
- Rewrote `PianoKey.tsx`: removed negative margins, added `leftPx` prop, `position: absolute`
- Rewrote `PianoKey.module.css`: all keys `position: absolute; top: 0`, z-index separation
- Rewrote `Piano.tsx`: `WHITE_NOTES` + `BLACK_NOTES` arrays with precomputed `leftPx`, 364×180px relative container
- Ran `npm run lint` → clean; verified SSR HTML → absolute positions confirmed, timbre pills confirmed

---

## 3. Adjustments Made After Plan Review

| Round | Original Plan | User Feedback | What Changed |
|---|---|---|---|
| 1 | Octave control: +/− increment buttons | "radiobutton with red color selection" | Replaced with `<input type="radio">` wrapped in `<label>`, circular pill, selected = red |
| 2 | Timbre control: styled like OctaveControl (circular radio buttons) | "rectangular buttons with rounded edges inside which the waveform is written" | Changed to `rounded-lg px-4 py-1.5` rectangular pills — wider, short-height, text label inside |

