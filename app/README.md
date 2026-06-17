# Shopping List App

A simple and efficient shopping list application built with Next.js, React, and Tailwind CSS. Manage your shopping items with add, remove, and clear functionality. Your items are automatically saved to localStorage.

## Features

- ✅ **Add Items** — Type an item and click "Add" or press Enter to add it to your list
- ✅ **Remove Items** — Delete individual items from the list
- ✅ **Clear All** — Remove all items at once
- ✅ **Persistent Storage** — Items are automatically saved to localStorage and restored on page reload

## Tech Stack

- **Framework:** Next.js 15.x with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.x
- **Runtime:** React 19

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

### Testing

```bash
npm run test
```

## Project Structure

- `app/page.tsx` — Main page
- `app/components/ShoppingList.tsx` — Shopping list component
- `app/globals.css` — Global styles and Tailwind configuration

## Development Guidelines

Refer to [AGENTS.md](./AGENTS.md) for:
- Code conventions and naming standards
- File structure guidelines
- TypeScript and styling best practices
- When in doubt, follow the conventions documented there

## Deployment

Deploy to [Vercel](https://vercel.com) for free:

```bash
npm install -g vercel
vercel
```

Check [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
