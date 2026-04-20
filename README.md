# Ecomm

A Next.js (App Router) e-commerce app with:
- Firebase Authentication
- Firestore product and cart data
- Admin product management (create/update/delete)
- Customer cart and checkout flow

## Tech Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Firebase (`firebase`, `firebase-admin`)
- Axios (API client)
- Zod + React Hook Form (validation/forms)
- Sonner (toasts)

## Features
- Signup/Login with role (`customer` / `admin`)
- JWT-based API authorization
- Product listing on home page
- Admin dashboard for product CRUD
- Cart page with quantity updates and remove actions
- Checkout endpoint + order creation flow

## Project Structure
Main source code is in `src/`.

- `src/app` → pages and API routes (App Router)
- `src/app/api` → auth, products, cart, checkout handlers
- `src/components` → UI + feature components
- `src/hooks` → reusable client hooks
- `src/services` → frontend service layer for API calls
- `src/lib/firebase` → Firebase client/admin initialization
- `src/schema` → Zod validation schema(s)
- `src/types` → shared TypeScript types
- `src/utils` → shared utility helpers

For full detailed folder documentation, see `Structure.md`.

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `.env` file in project root (or copy from `.env.example`) and fill values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

FIREBASE_WEB_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

JWT_SECRET=
```

Notes:
- `FIREBASE_PRIVATE_KEY` should preserve line breaks (`\n`) as expected by Firebase Admin.
- `JWT_SECRET` must be strong in production.

### 3) Run development server
```bash
npm run dev
```
Open `http://localhost:3000`.

## Scripts
- `npm run dev` → start local dev server
- `npm run build` → production build
- `npm run start` → run production server
- `npm run lint` → run ESLint

## App Routes
- `/` → Product listing
- `/login` → Login page
- `/signup` → Signup page
- `/cart` → User cart page
- `/admin` → Admin product management

## API Routes
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (admin)
- `GET /api/products/:id`
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart`
- `DELETE /api/cart?productId=...`
- `POST /api/checkout`

## Conventions
- Keep page files thin; move logic to hooks/services.
- Put shared UI primitives in `src/components/ui`.
- Put feature-specific UI in `src/components/<feature>`.
- Validate payloads at API boundary using schema(s).

## Production Notes
- Do not commit `.env`.
- Enforce strong Firebase Security Rules.
- Keep admin role assignment restricted to trusted flows only.
- Prefer server-side validation for all privileged actions.
