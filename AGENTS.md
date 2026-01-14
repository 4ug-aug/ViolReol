# Agent Guidelines for ViolReol

This repository is a **Tauri + React + TypeScript** application using **Vite**, **Tailwind CSS v4**, and **shadcn/ui**.

## 1. Build, Lint, and Test Commands

### Development
- **Web only:** `npm run dev`
- **Desktop (Tauri):** `npm run tauri dev`

### Build
- **Web build:** `npm run build` (Runs `tsc` type checking + `vite build`)
- **Tauri build:** `npm run tauri build`

### Quality Checks
- **Type Checking:** `npx tsc --noEmit`
  *   *Note: There is no strict ESLint configuration currently. Rely on TypeScript compiler strict mode options enabled in `tsconfig.json`.*

### Testing
- **Status:** No testing framework (Vitest/Jest) is currently installed or configured.
- **Action:** If asked to write tests, you must first propose installing and configuring Vitest.

---

## 2. Code Style & Conventions

### Architecture
- **Framework:** React 19 (Functional Components + Hooks).
- **State Management:**
  - Global UI state: **Zustand**.
  - Server state/Data fetching: **TanStack Query**.
- **Routing:** Standard React client-side routing (verify if `react-router` is added if new routes are needed, though not explicitly seen in deps yet).
- **Backend:** Supabase (Client: `@supabase/supabase-js`).

### File Structure & Imports
- **Alias:** Use `@/` for imports from `src/`.
  - Example: `import { Button } from "@/components/ui/button"`
- **Component Location:**
  - Reusable UI components: `src/components/ui/` (shadcn pattern).
  - Feature components: `src/components/<feature>/` or `src/features/<feature>/`.

### Component Implementation
- **Naming:** PascalCase for filenames and component names (e.g., `UserProfile.tsx`).
- **Props:** Use TypeScript interfaces named `[ComponentName]Props`.
- **Exports:** Prefer named exports over default exports for better refactoring support.
  ```tsx
  export function MyComponent({ prop }: MyComponentProps) { ... }
  ```

### Styling (Tailwind CSS)
- **Engine:** Tailwind v4 (`@tailwindcss/vite`).
- **Conditionals:** ALWAYS use the `cn(...)` utility (combines `clsx` and `tailwind-merge`) for conditional class names.
  ```tsx
  // Correct
  <div className={cn("bg-red-500", isActive && "bg-blue-500")} />
  
  // Incorrect
  <div className={`bg-red-500 ${isActive ? "bg-blue-500" : ""}`} />
  ```
- **Shadcn/UI:** Do not reinvent basic components. Check `src/components/ui` first.

### Forms & Validation
- **Library:** `react-hook-form` coupled with `zod`.
- **Validation:** Define schemas using `zod` and infer TypeScript types from them.

### TypeScript
- **Strictness:** `strict: true` is enabled. No `any` types unless absolutely necessary.
- **Async:** Use `async/await` patterns. Handle errors using `try/catch` or React Query's error states.

### Rust / Tauri (src-tauri)
- If modifying the backend (`src-tauri`), follow standard Rust conventions (cargo fmt, clippy).
- Run cargo commands inside `src-tauri` directory.

## 3. Important Rules
- **Dependencies:** Do not install new heavy libraries without user confirmation.
- **Files:** Always verify file existence with `ls` or `read` before modifying.
- **Supabase:** When working with Supabase, check `supabase-schema.sql` (if available) or ask for schema details before writing complex queries.
