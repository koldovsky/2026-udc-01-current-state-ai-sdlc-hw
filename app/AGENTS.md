<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Next.js App

Короткий контекст для Agentic IDE при роботі з цим проєктом.

## Стек і версії

| Технологія | Версія |
|---|---|
| Node.js | 22+ (рекомендовано для домашнього завдання) |
| Next.js (App Router) | 16.2.9 |
| React / React DOM | 19.2.4 |
| TypeScript | 5.x (`strict: true`) |
| Tailwind CSS | 4.x (`@tailwindcss/postcss`) |
| ESLint | 9.x (`eslint-config-next`) |

Структура: **App Router** — маршрути й layout у теці `app/app/`, статика в `public/`, глобальні стилі в `app/globals.css`.

## Команди

Усі команди запускати з теки `app/`:

npm run dev      # локальний dev-сервер (http://localhost:3000)
npm run build    # production-збірка
npm run start    # запуск зібраного застосунку
npm run lint     # ESLint (статична перевірка)

(No test runner yet — add `vitest` only if a feature needs it.)

Перед PR: `npm run build` і `npm run lint` мають проходити без помилок.

## Конвенції

1. **Структура App Router** — нові сторінки й layout-и додавати в `app/app/` (`page.tsx`, `layout.tsx`, вкладені сегменти). Спільні UI-компоненти — у `app/components/` (створити за потреби).
2. **Імпорти** — alias `@/*` вказує на корінь проєкту (`app/`). Приклад: `import { Foo } from "@/components/Foo"`.
3. **Нейминг** — React-компоненти в PascalCase (`UserCard.tsx`); файли маршрутів — lowercase за конвенцією Next.js (`page.tsx`, `layout.tsx`); хуки з префіксом `use`.
4. **Стиль і UI** — Tailwind utility-класи в JSX; глобальні токени/тема — у `globals.css`. Зображення через `next/image`, шрифти через `next/font`.
5. **TypeScript** — явні типи для props і API; `export default` для page/layout; уникати `any`, дотримуватись правил ESLint (`core-web-vitals` + `typescript`).

## Guardrails

- **НЕ чіпати** `node_modules/`, `package-lock.json`, `.next/`, `next-env.d.ts` — не редагувати вручну й не комітити артефакти збірки.
- **НЕ комітити** секрети: `.env`, `.env*.local`, ключі API, токени. Конфігурацію Next.js (`next.config.ts`) змінювати лише за явної потреби.
- **НЕ покладатися** на застарілі знання про Next.js — перед змінами API читати актуальну документацію в `node_modules/next/dist/docs/` і дотримуватись deprecation notices.
