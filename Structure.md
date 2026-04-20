# Project Structure

This is a **universal, AI-friendly project structure blueprint**.
Use this file at the start of any project so humans and AI agents can place code consistently.

## Architecture Summary
Use a layered structure:
- **Routing / Entry layer** (`src/app` or framework equivalent)
- **Feature UI layer** (`src/components/<feature>`)
- **Shared UI primitives** (`src/components/ui`)
- **Business logic / services** (`src/services`)
- **Data access / API clients** (`src/api`)
- **Reusable hooks** (`src/hooks`)
- **Validation + types + constants** (`src/schema`, `src/types`, `src/constants`)
- **Infrastructure adapters** (`src/lib`)
- **Utilities** (`src/utils`)

---

## `/` (Project Root)
- **Purpose:** Tooling, configs, scripts, and documentation.
- **Contains:** `package.json`, env templates, formatter/linter config, CI config, root docs.
- **Used by:** Build system, runtime, developers, AI agents.
- **Notes / Conventions:**
  - Keep business logic out of root.
  - Always include `.env.example`.
  - Keep a short `README.md` + this `Structure.md`.

## `/public`
- **Purpose:** Static assets served as-is.
- **Contains:** Images, icons, fonts, social preview assets.
- **Used by:** UI and metadata.
- **Notes / Conventions:** Optimize assets; use meaningful filenames.

## `/src`
- **Purpose:** Main application code.
- **Contains:** App routes, components, logic, utilities.
- **Used by:** Entire runtime.
- **Notes / Conventions:** Prefer absolute imports (alias like `@/*`).

## `/src/app`
- **Purpose:** Route entry points and route-level layout.
- **Contains:** Pages, layouts, route-specific loading/error states, API route handlers (if framework supports).
- **Used by:** Router/runtime.
- **Notes / Conventions:**
  - Keep pages thin.
  - Move reusable logic out to hooks/services/components.

## `/src/app/api`
- **Purpose:** Server API endpoints.
- **Contains:** Feature-based route folders (e.g., `auth`, `users`, `products`, `orders`).
- **Used by:** Frontend service layer and external clients.
- **Notes / Conventions:**
  - Validate input at boundary.
  - Return consistent response shape.
  - Keep auth checks centralized.

## `/src/components`
- **Purpose:** All React/UI components.
- **Contains:** `ui`, feature folders, shared layout components.
- **Used by:** Pages/routes.
- **Notes / Conventions:** Split by responsibility.

## `/src/components/ui`
- **Purpose:** Shared primitive UI components.
- **Contains:** Button, input, modal, card, typography primitives.
- **Used by:** All feature components.
- **Notes / Conventions:**
  - Keep stateless and generic.
  - No feature/business logic.

## `/src/components/<feature>`
- **Purpose:** Feature-specific UI.
- **Contains:** Cards, forms, widgets for one domain.
- **Used by:** Related pages and flows.
- **Notes / Conventions:**
  - Co-locate feature-only subcomponents.
  - Extract reusable parts to `ui` when reused by 2+ features.

## `/src/hooks`
- **Purpose:** Reusable stateful UI logic.
- **Contains:** `useXxx` hooks for auth, forms, filters, fetch orchestration.
- **Used by:** Components/pages.
- **Notes / Conventions:**
  - Hooks compose services; avoid raw transport details if possible.
  - Keep each hook focused.

## `/src/services`
- **Purpose:** Business use-cases and orchestration.
- **Contains:** Domain services (auth, billing, cart, product, etc.).
- **Used by:** Hooks, API routes, server actions.
- **Notes / Conventions:**
  - No UI concerns here.
  - Encapsulate domain rules and workflows.

## `/src/api`
- **Purpose:** Shared network/data client layer.
- **Contains:** Fetch/axios wrappers, request helpers, interceptors.
- **Used by:** Services.
- **Notes / Conventions:**
  - Centralize retries, auth headers, error parsing, timeouts.
  - Keep endpoint strings in `constants/endpoints`.

## `/src/lib`
- **Purpose:** External SDK setup and adapters.
- **Contains:** DB clients, auth providers, cloud SDK config, third-party init.
- **Used by:** Services/routes/pages.
- **Notes / Conventions:**
  - One file per provider/context (e.g., `client.ts`, `server.ts`, `admin.ts`).
  - Do not leak secrets to client-side files.

## `/src/schema`
- **Purpose:** Runtime validation schemas.
- **Contains:** Zod/Yup/Valibot schemas for request/response/forms.
- **Used by:** API boundaries, forms, services.
- **Notes / Conventions:** Validate at every boundary.

## `/src/types`
- **Purpose:** Shared TypeScript types and interfaces.
- **Contains:** Domain types, DTOs, API contracts.
- **Used by:** Whole codebase.
- **Notes / Conventions:**
  - Prefer feature-based type files when project grows.
  - Keep runtime schema and TS types aligned.

## `/src/constants`
- **Purpose:** Static config and app-wide constants.
- **Contains:** Routes, endpoints, messages, enums.
- **Used by:** Services/components/routes.
- **Notes / Conventions:**
  - Avoid magic strings in features.
  - Split files by concern (`routes.ts`, `messages.ts`, `endpoints.ts`).

## `/src/utils`
- **Purpose:** Pure utility helpers.
- **Contains:** Formatting, token helpers, mappers, className helpers.
- **Used by:** Any layer.
- **Notes / Conventions:**
  - Keep framework-agnostic where possible.
  - No side effects unless explicitly named.

## `/tests` (or `src/__tests__`)
- **Purpose:** Automated tests.
- **Contains:** Unit, integration, e2e tests + fixtures.
- **Used by:** CI and local verification.
- **Notes / Conventions:** Mirror source structure for discoverability.

## `/scripts`
- **Purpose:** Automation scripts.
- **Contains:** Seed, migrate, codegen, maintenance scripts.
- **Used by:** Dev workflows and CI.
- **Notes / Conventions:** Scripts must be idempotent and documented.

## `/docs`
- **Purpose:** Internal technical documentation.
- **Contains:** Architecture decisions, API contracts, runbooks.
- **Used by:** Team + AI onboarding.
- **Notes / Conventions:** Keep short and decision-oriented.

---

## Naming Conventions
- Use one casing strategy consistently:
  - Folders/files: `kebab-case` or `camelCase` (pick one and stay consistent)
  - React components: `PascalCase.tsx`
  - Hooks: `useXxx.ts`
  - Services: `xxxService.ts`
  - Schemas: `xxx.schema.ts` or `schema/xxx.ts`
- Dynamic route segments should be explicit (e.g., `[id]`, `[slug]`).

## Dependency Direction Rules
- `components/ui` must not import feature services.
- `components/<feature>` can import hooks/services/types.
- `hooks` can import services/api/utils/types.
- `services` can import api/lib/schema/types/constants.
- `api` should be low-level and never depend on UI.
- `lib` should stay adapter-only.

## AI Working Rules
1. Add new page-level route code in `src/app/<feature>`.
2. Add new API endpoints in `src/app/api/<feature>`.
3. Put reusable request logic in `src/api`.
4. Put domain workflows in `src/services`.
5. Put reusable UI primitives in `src/components/ui`.
6. Put feature-only UI in `src/components/<feature>`.
7. Put reusable state logic in `src/hooks`.
8. Put runtime validation in `src/schema`.
9. Put shared helpers in `src/utils`.
10. Put cross-feature contracts in `src/types`.

## Quick Rules
1. **Where to add new UI components:**
   - Shared primitive: `src/components/ui`
   - Feature-specific: `src/components/<feature>`
2. **Where to add new API routes:**
   - `src/app/api/<feature>/route.ts`
   - Resource-by-id: `src/app/api/<feature>/[id]/route.ts`
3. **Where to add reusable data-fetching logic:**
   - Transport client: `src/api`
   - Business orchestration: `src/services`
4. **Where to place feature-specific vs shared code:**
   - Feature-specific in feature folders.
   - Shared logic in `ui`, `hooks`, `utils`, `types`, `constants`, `lib`.

## Starter Checklist (Before Coding)
- [ ] Define main features/domains.
- [ ] Create folder skeleton for each domain.
- [ ] Configure lint, format, typecheck, test scripts.
- [ ] Add `.env.example` and secret handling rules.
- [ ] Define API response/error format.
- [ ] Define naming rules and stick to them.
- [ ] Keep this `Structure.md` updated when structure changes.
