# Gemini Context & Rules: Frontend Development (Vanilla Stack)

## 1. Project Overview
* **Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Goal:** Build a performant, maintainable, and semantic frontend without external UI frameworks (React/Vue) or heavy libraries (jQuery/Bootstrap).
* **Philosophy:** Keep it Simple (KISS), Separation of Concerns, Mobile-First.

## 2. HTML Best Practices
* **Semantic Markup:** Always use semantic tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>`) instead of generic `<div>` soup.
* **Accessibility (a11y):**
    * Images must have `alt` attributes.
    * Buttons use `<button>`, links use `<a>`. Do not use `<div>` for clickable elements unless strictly necessary (and then add `role` and `tabindex`).
    * Forms must have labeled inputs (`<label for="...">`).
* **Structure:**
    * Load CSS in `<head>`.
    * Load JavaScript modules at the end of `<body>` or use `defer` in `<head>`.

## 3. CSS Best Practices
* **Methodology:** Use standard CSS. Avoid inline styles.
* **Layout:**
    * Use **Flexbox** for 1D layouts (components, alignment).
    * Use **CSS Grid** for 2D layouts (page structure, complex grids).
    * Avoid `float` for layout.
* **Variables:** Use CSS Variables (`--primary-color`, `--spacing-md`) for global themes (colors, fonts, spacing) to ensure consistency.
* **Responsive Design:**
    * Write **Mobile-First** media queries (`min-width`).
    * Use relative units (`rem`, `em`, `%`) instead of fixed `px` for font sizes and container widths.
* **Naming:** Use clear, descriptive class names (e.g., `.btn-primary` or BEM style `.card__title` if complex).

## 4. JavaScript (Vanilla) Best Practices
* **Modern Syntax (ES6+):**
    * Use `const` and `let`. **Never use `var`.**
    * Use Arrow functions `() => {}` where appropriate (preserve lexical `this`).
    * Use Template Literals `` `Hello ${name}` `` instead of string concatenation.
    * Use Destructuring for objects/arrays.
* **DOM Manipulation:**
    * Use `document.querySelector` and `document.querySelectorAll`.
    * Cache DOM elements in variables to minimize re-querying.
    * Use `classList.add/remove/toggle` for class manipulation.
    * **Performance:** Use `DocumentFragment` when appending multiple elements to avoid repeated reflows.
* **Event Handling:**
    * Use `addEventListener`. **Never use HTML attributes** like `onclick="..."`.
    * Use **Event Delegation** (attach listener to parent) for dynamic lists or tables.
* **Asynchronous Code:**
    * Use `async/await` with `try/catch` blocks for asynchronous operations (Fetch API).
    * Avoid "Callback Hell".
* **Modules:**
    * Write code in ES Modules (`import`/`export`) to separate logic (e.g., `api.js`, `ui.js`, `utils.js`).

## 5. Code Style & formatting
* **Formatting:** 2 spaces indentation. Semicolons are mandatory.
* **Naming Conventions:**
    * Variables/Functions: `camelCase`
    * Constants: `UPPER_SNAKE_CASE`
    * Classes: `PascalCase`
    * CSS Classes: `kebab-case`
* **Comments:** Use JSDoc `/** ... */` for complex functions to explain parameters and return types.

## 6. Example Pattern (Reference)

**JavaScript (component-based thinking):**
```javascript
// src/components/todo.js
export function createTodoItem(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.textContent = text;
  return li;
} 
```

**CSS(Variables):**
```css
:root {
  --color-bg: #ffffff;
  --color-text: #333333;
}
body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```
