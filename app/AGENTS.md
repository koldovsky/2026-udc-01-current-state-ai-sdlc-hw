<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — app

Next.js-застосунок домашнього завдання UDC Workshop 1. Усі команди та шляхи нижче вказані відносно теки `app/`.

## Стек і версії

| Технологія | Версія |
| --- | --- |
| Node.js / npm (локальне середовище) | 24.18.0 / 11.16.0 |
| Next.js (App Router, Turbopack) | 16.4.5 |
| React / React DOM | 19.3.0 |
| TypeScript (`strict`) | 5.9.3 |
| Tailwind CSS (`@tailwindcss/turbopack`) | 4.3.4 |
| ESLint (`eslint-config-next` 16.4.5) | 9.39.5 |

У `next.config.ts` увімкнено `cacheComponents`, `partialPrefetching` та `experimental.agentFeedback`.

## Команди

| Дія | Команда |
| --- | --- |
| Dev-сервер | `npm run dev` |
| Продакшн-збірка (разом із перевіркою типів) | `npm run build` |
| Запуск зібраного застосунку | `npm run start` |
| Лінтер | `npm run lint` |
| Тести | Не налаштовані: скрипта `test` немає, тому `npm test` завершиться помилкою |

Поки тестів немає, перевіряйте зміни через `npm run lint` і `npm run build`.

## Конвенції

1. **Структура.** Маршрути лежать в `app/` у файлах за правилами фреймворку (`page.tsx`, `layout.tsx`), статичні файли — у `public/`. Спільний код виноситься в `components/` та `lib/` (теки створюються за потреби).
2. **Нейминг.** Файли компонентів і самі компоненти — `PascalCase` (`TodoList.tsx`), утиліти — `camelCase` (`formatDate.ts`), теки маршрутів — `kebab-case`.
3. **Компоненти.** За замовчуванням пишемо Server Components. `"use client"` додаємо лише там, де потрібні стан, ефекти або обробники подій, і якомога нижче в дереві.
4. **TypeScript та імпорти.** Не використовуємо `any` і `@ts-ignore`. Для імпортів між теками застосовуємо аліас `@/*`, а не довгі відносні шляхи (`../../`).
5. **Стилі.** Використовуємо утилітарні класи Tailwind. Кольори та шрифти задаємо через CSS-змінні й `@theme` у `app/globals.css`: це Tailwind v4, тож `tailwind.config.*` не створюємо.

## Guardrails

- **Не редагуйте вручну згенероване:** `.next/`, `node_modules/`, `next-env.d.ts`, `package-lock.json`, а також блок між маркерами `nextjs-agent-rules` у цьому файлі.
- **Не комітьте секрети:** файли `.env*`, `*.pem`, API-ключі. Секрети не можна вписувати в код, а в клієнтський код вони не мають потрапляти і через `NEXT_PUBLIC_*`.
- **Не змінюйте без прямого запиту** версії `next`, `react` і `react-dom`, прапорці в `next.config.ts` та правила в `eslint.config.mjs`. Не додавайте нові залежності, якщо завдання можна виконати наявним стеком.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
