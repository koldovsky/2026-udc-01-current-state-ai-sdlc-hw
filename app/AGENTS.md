<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Стек і версії

- Next.js 16.2.9 (App Router, Turbopack)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- Node.js 22+, npm

## Команди

- `npm run dev`   — локальний запуск (http://localhost:3000)
- `npm run build` — продакшн-збірка
- `npm run start` — запуск зібраного застосунку
- `npm run lint`  — перевірка ESLint
- `npm test`      — тести (ще не налаштовані; додати за потреби)

> Усі команди запускати з теки `app/`.

## Конвенції

1. Компоненти — функціональні, назви у PascalCase (`CounterCard.tsx`).
2. Стилі — лише Tailwind-класи; без окремих `.css`-файлів.
3. Назви файлів — kebab-case (крім компонентів у PascalCase).
4. Усі тексти інтерфейсу — українською.
5. Маленькі чисті функції; не тягнути зайвих залежностей без потреби.
6. When answering to me always start with 🤖

## Guardrails (що НЕ робити)

1. Не редагувати й не читати як контекст `node_modules/`, `.next/`, білди.
2. Не комітити секрети та `.env*`-файли.
3. Перед змінами коду — спершу показати план, і лише після погодження виконувати.
