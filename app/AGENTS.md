<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — app/

Короткий довідник для агента, що працює в цьому Next.js-проєкті.

## Стек і версії

| Технологія | Версія |
|------------|--------|
| **Next.js** (App Router) | 16.2.10 |
| **React** | 19.2.4 |
| **TypeScript** | ^5 |
| **Tailwind CSS** | ^4 (`@tailwindcss/postcss`) |
| **ESLint** | ^9 (`eslint-config-next` 16.2.10) |

Шрифти: Geist / Geist Mono через `next/font/google`. Стилі підключаються в `app/globals.css` через `@import "tailwindcss"`.

## Команди

Усі команди виконувати з каталогу `app/`:

| Команда | Призначення |
|---------|-------------|
| `npm run dev` | Локальний dev-сервер (Turbopack) |
| `npm run build` | Production-збірка |
| `npm run start` | Запуск зібраного застосунку |
| `npm run lint` | Перевірка коду ESLint |

Окремого скрипта `test` наразі немає — перед PR достатньо `npm run lint` і `npm run build`.

## Конвенції іменування та структури

1. **App Router** — маршрути в `app/`; кожен сегмент — папка з `page.tsx`, за потреби `layout.tsx`, `loading.tsx`, `error.tsx`.
2. **Компоненти** — файли в `PascalCase` (`UserCard.tsx`); експорт за замовчуванням для сторінок і лейаутів, named export для переиспользуваних компонентів.
3. **Імпорти** — аліас `@/*` вказує на корінь проєкту (`app/`, `public/` тощо); пріоритет абсолютних шляхів над глибокими відносними (`../../../`).
4. **Стилі** — Tailwind utility-класи в JSX; глобальні токени й `@theme` — у `app/globals.css`; уникати inline-стилів і окремих CSS-файлів на компонент без потреби.
5. **Server vs Client** — компоненти серверні за замовчуванням; `"use client"` лише там, де потрібні хуки, події або браузерні API.

## Guardrails

1. **Не комітити секрети** — `.env`, API-ключі, токени; не змінювати `.gitignore`, щоб приховати чутливі файли.
2. **Не змінювати без потреби** — `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`; зміни в цих файлах узгоджувати з людиною.
3. **Не тягнути зайве в контекст** — не читати й не індексувати `node_modules/`, `.next/`, `package-lock.json`; не додавати залежності без явного запиту.
