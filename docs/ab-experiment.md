# Task 4: A/B Експеримент із Промптами

**Задача:** Todo List додаток на Next.js

---

## Промпт A — Базовий

```
create todo list application on nextjs
```

**Результат:**
- Вартість: $0.50
- Час API / wall: 2м 21с / 11м 9с
- Зміни коду: +189 / -60 рядків
- Ітерації (людина): 1
- Токени input: 441 (Haiku) + 373 (Sonnet) = 814 прямих + 34k cache write
- Токени output: 16 (Haiku) + ~7 100 (Sonnet) = ~7 116
- Якість: додаток працює, дизайн гарний

---

## Промпт B — Структурований

```
Role:
You are a senior frontend engineer with deep expertise in Next.js (App Router) and TypeScript.
Your task is to implement a basic Todo List application strictly following the provided criteria,
minimizing redundant files, reasoning steps, and code.

Context:
We are building a client-side prototype of a Todo List application using Next.js. The application
must use LocalStorage for state persistence to avoid any overhead related to setting up databases,
ORMs, or external APIs. The entire UI must be responsive and styled consistently using Tailwind CSS.

Constraints:
1. Use Next.js 14+ (App Router).
2. Do not use any external databases or ORMs. Use client-side LocalStorage only.
3. Components must be functional and clearly separated into Client Components ('use client').
4. Do not create test files, CI/CD configurations, or extra documentation.
5. Styling must use vanilla Tailwind CSS only.

Acceptance Criteria:
1. User can create a new todo item (fields: id, text, completed, createdAt). Text must not be empty.
2. User can toggle the completion status. Completed items must show line-through text.
3. User can delete a todo item.
4. Implement filtering: "All", "Active", "Completed".
5. State automatically synchronizes with LocalStorage, handling Next.js hydration safely.
6. UI includes: header, input form with "Add" button, list with checkboxes and delete buttons,
   filter panel with active tasks counter.

Output Format:
1. Provide the structure of new/modified files as a directory tree.
2. Provide clean, production-ready code without placeholders or omissions.
3. Only minimal technical comments. No lengthy theoretical explanations.
```

**Результат:**
- Вартість: $0.56
- Час API / wall: 2м 45с / 4м 22с
- Зміни коду: +202 / -62 рядки
- Ітерації (людина): 1
- Токени input: 942 (Haiku) + 713 (Sonnet) = 1 655 прямих + 36.5k cache write
- Токени output: 19 (Haiku) + ~9 500 (Sonnet) = ~9 519
- Якість: додаток працює, більше функцій, дизайн не сподобався

---

## Порівняння

| Метрика                    | Промпт A       | Промпт B        |
|----------------------------|----------------|-----------------|
| Вартість                   | $0.50          | $0.56           |
| Час API                    | 2м 21с         | 2м 45с          |
| Час виконання              | 11м 9с         | 4м 22с          |
| Ітерації (людина)          | 1              | 1               |
| Input токени (прямі)       | 814            | 1 655           |
| Output токени              | ~7 116         | ~9 519          |
| Cache write                | 34k            | 36.5k           |
| Cache read                 | 886.3k         | 934.3k          |
| Рядків додано              | +189           | +202            |
| Кількість функцій          | базові         | більше          |
| Дизайн                     | ✓ гарний       | ✗ не сподобався |

---

## Висновки

1. **Час виконання скоротився у 2.5 рази** (11хв → 4хв) завдяки чітким вимогам — агент менше уточнював і не переробляв.
2. **Вартість практично однакова** (+$0.06): структурований промпт довший, але викликає менше ітерацій.
3. **Структурований промпт дає більше функцій**, але не гарантує кращого дизайну — UI/UX-очікування потрібно явно описувати в acceptance criteria.
4. **Практичний висновок:** для знайомих задач базовий промпт дає кращий баланс дизайн/час; структурований промпт виправданий коли важлива точна відповідність вимогам і відтворюваність результату.
