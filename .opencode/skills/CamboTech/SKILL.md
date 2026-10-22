---
name: svc-store
description: Use ONLY when building new features or modifying existing code in the SVC Store e-commerce project. Provides project-specific conventions for React + Next.js, Tailwind + shadcn/ui, folder structure, UI/UX rules, code quality standards, API contracts, and workflow requirements.
---

# SVC Store Project Conventions

This is the SVC Store e-commerce project — React + Next.js, selling computers, computer accessories, and electronics. The project already has an existing structure. You are building one feature at a time, and every feature must match the conventions below so the codebase stays consistent no matter which session built it.

Do not restructure the project, rename folders, change the styling system, or refactor unrelated code unless explicitly asked.

## 1. TECH STACK — DO NOT DEVIATE

- React + Next.js (match existing router: App Router or Pages Router — check first, don't switch).
- Styling: Tailwind CSS + shadcn/ui. If the project isn't on this yet, ask before introducing it.
- Forms/validation: React Hook Form + Zod.
- Server state: TanStack Query. Client/UI state: Zustand or Context (match whichever is already in use).
- Icons: lucide-react.
- Charts (admin only): recharts.
- Language: match existing project (TypeScript or JS) — do not silently migrate.

## 2. FOLDER & NAMING CONVENTIONS

Check the existing folder structure first and follow it. Typical expected layout:

| Path | Purpose |
|------|---------|
| `/app` or `/pages` | routes |
| `/components/ui` | shared, generic components (Button, Card, Modal, Toast, DataTable, Stepper, Input) |
| `/components/[feature]` | feature-specific components (e.g. `/components/cart`, `/components/product`) |
| `/hooks` | reusable logic (useCart, useAuth, useOtp, etc.) |
| `/lib` or `/utils` | helpers, API clients, formatters |
| `/services` or `/api` | API call functions, grouped by domain |
| `/types` | shared TypeScript types/interfaces |
| `/store` | Zustand stores or context providers |

**Naming rules:**
- Component files: PascalCase (e.g., `ProductCard.tsx`)
- Hooks: camelCase starting with `use` (e.g., `useCart.ts`)
- Utility files: camelCase
- Never create a duplicate component if a similar one already exists — reuse and extend it instead.

## 3. UI/UX DESIGN SYSTEM RULES

Apply to every screen, every time, no exceptions:

- Use the shared design tokens already established (colors, spacing, typography). If this is the first feature being built, define these tokens now and reuse them in all future features.
- Every async data view needs: loading skeleton state, empty state (with message/icon), and error state (with retry action). Never leave a blank screen.
- Every user action (add to cart, submit form, delete item, etc.) needs a toast/notification confirming success or explaining failure.
- All interactive elements need visible hover/focus/active states and must be keyboard-accessible.
- Mobile-first responsive layout — test at mobile, tablet, and desktop breakpoints.
- Reuse shared components (Button, Modal, DataTable, Stepper, Input, Badge) instead of writing one-off markup. If a needed shared component doesn't exist yet, build it in `/components/ui` first, then use it.

## 4. CODE QUALITY RULES

- Small, single-responsibility components. If a component exceeds ~150–200 lines, split it.
- Business logic (API calls, calculations, validation) goes in hooks/services — not inline in JSX.
- Type everything (interfaces/types for props, API responses, form schemas).
- Handle loading/error states for every API call — no unhandled promises.
- Add comments only where logic isn't self-explanatory (e.g. KHQR payment status polling, OTP expiry logic).

## 5. API / DATA CONTRACT RULES

- If a real backend endpoint doesn't exist yet, mock it clearly in `/services/[domain].ts` with a comment: `// TODO: replace mock with real API endpoint` — and define the expected request/response shape as a type, so swapping in the real API later is a one-file change.
- Don't hardcode data directly inside components — always go through a service/hook layer.

## 6. WORKFLOW RULES FOR EVERY FEATURE PROMPT

When given a feature to build:

1. First, identify which existing files you'll touch and which new files you'll create — before writing code.
2. Build only the feature requested. Do not touch other features "while you're in there."
3. If the feature depends on a shared component or type that doesn't exist yet, create it in the correct shared folder (`/components/ui`, `/types`, `/hooks`) rather than duplicating logic locally.
4. At the end, give a short summary: files changed/created, new dependencies (if any) and why, and any assumptions made.
5. If something in the existing code conflicts with these rules, stop and ask rather than guessing.
