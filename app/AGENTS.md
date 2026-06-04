<!-- BEGIN:nextjs-agent-rules -->
# Multimeter·Live — Web Serial Real-Time Dashboard

A Next.js/React client-side application for visualizing real-time multimeter data over Web Serial API. Displays live readings, trend charts, configurable trigger modes, and CSV export.

## Architecture Notes

- **Client-only**: All data processing happens in the browser; no server-side fetching required
- **Web Serial API**: Communicates directly with connected USB multimeters
- **Real-time updates**: Streaming parser handles fragmented serial packets without buffering delays
- **No async waterfalls**: Data flows through independent state channels (current reading, chart points, session metadata)
- **Memoization**: Component tree uses refs for transient state; callbacks are stabilized to preserve memo boundaries
<!-- END:nextjs-agent-rules -->

## Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.2.7 |
| React | 19.2.4 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| ESLint | ^9 |
| Node.js | ^20 |

Router: **App Router** (uses `app/` directory conventions).

## Commands

```sh
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server (requires build first)
npm run start

# Lint
npm run lint
```

## Performance Optimizations (Vercel React Best Practices)

Applied four key optimizations following the Vercel React guidelines:

### 1. Chart.js Bundle Optimization (Rule 2.1 - CRITICAL)
- **Before**: `import { Chart } from 'chart.js/auto'` bundled all controllers, scales, elements (~120 kB min+gzip)
- **After**: Selective tree-shaking with named imports + explicit `Chart.register()`
  - Only imports: `CategoryScale`, `LinearScale`, `LineController`, `LineElement`, `PointElement`, `Filler`, `Tooltip`, `Legend`
  - Saves ~50-70% of chart.js bundle size

### 2. Combined Array Iteration (Rule 7.6 - LOW-MEDIUM)
- **Before**: Two `.map()` passes over chart data array on every update (up to 300 points)
- **After**: Single `for` loop combining labels and values extraction
- **Impact**: Reduces iteration overhead by 50% during high-frequency redraws

### 3. Stable Callback Props (Rule 5.5 - MEDIUM)
- **Before**: Inline arrow functions `onConnect={() => connect(baud)}` recreated on every parent render
- **After**: `useCallback`-memoized handlers: `handleConnect` and `handleToggleRecord`
- **Impact**: Preserves callback identity across re-renders; enables downstream component memoization

### 4. Hoisted Regex Literals (Rule 7.10 - LOW-MEDIUM)
- **Before**: Three regex patterns `/L/i`, `/[0-9]/`, `/[^0-9.+-]/g` recreated per packet in `parseMeasurement()`
- **After**: Module-level constants `RE_OVERLOAD`, `RE_DIGIT`, `RE_NON_NUM`
- **Impact**: Eliminates micro-allocations in the hot parser path; clarifies intent

## Component Tree

```
Home (main orchestrator, Web Serial lifecycle)
├── Controls (connection, recording, trigger, export UI)
├── DigitalDisplay (current reading display)
└── RealtimeChart (chart.js line chart, streaming updates)

Hooks:
├── useSerial (Web Serial lifecycle, read loop, packet buffering)
├── parser (stateful, handles chunked serial stream)
└── All components consume shared state via closure
```
