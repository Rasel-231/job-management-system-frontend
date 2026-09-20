# Job Management System — Frontend

A modern web client for a job marketplace built with **Next.js 16 (App Router)** + **Tailwind CSS 3** + **Redux Toolkit**. Users browse jobs, apply, complete multi-step tasks, earn rewards, request withdrawals, verify identity, and open disputes. Admins review submissions, approvals, verifications, and mediate disputes.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 18
- **Styling:** Tailwind CSS 3 with semantic design tokens (`hsl` variables) + custom UI kit
- **State / Data:** Redux Toolkit + RTK Query, axios (interceptor with cookie credentials)
- **Animation:** framer-motion
- **Forms / UX:** react-toastify notifications; AlertDialog/Dialog primitives

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # landing page
│   ├── layout.tsx                # root layout (fonts, metadata, toast container)
│   ├── loading.tsx / error.tsx / not-found.tsx
│   ├── (auth)/                   # login, register (public layout)
│   ├── (user)/dashboard/         # user area (protected layout + sidebar)
│   │   ├── jobs/                 # job market + job detail (server-rendered)
│   │   ├── my-jobs/              # posted jobs + editing
│   │   ├── my-tasks/             # accepted tasks + step submission
│   │   ├── earnings/             # wallet, withdrawals, transaction history
│   │   ├── disputes/             # user disputes
│   │   └── verification/         # identity verification
│   └── (admin)/admin/            # admin area (protected layout + sidebar)
│       ├── jobs/ users/ tasks/   # review & approvals
│       ├── transactions/         # transaction review
│       ├── withdrawals/          # withdrawal approval
│       ├── verifications/        # identity verification review
│       └── disputes/             # dispute mediation
├── components/
│   ├── ui/                       # design-system primitives (button, input, card, badge, dialog, table, icons, …)
│   └── shared/                   # navbar, sidebar, pagination, apply-button, social login, etc.
├── features/                     # feature clients & API slices wire every page:
│   ├── jobs/  tasks/  transactions/  disputes/  verification/  user/  auth/
├── lib/                          # serverFetch, credentials/cookies helpers, formatting
├── redux/                        # store + RTK Query API slices
└── types/                        # shared types (TApiResponse, etc.)
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- Backend running on `http://localhost:5000` (see `../backend/README.md`)

### 2. Install & configure

```bash
npm install
```

The frontend reads the backend origin from the readable cookie `backendUrl` (set by a proxy page) and falls back to `http://localhost:5000` when running locally. Defaults work out of the box for local development.

### 3. Run

```bash
npm run dev     # dev server (turbopack)
npm run build   # production build + type check
npm start       # serve the production build
```

## Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `npm run dev` | Start dev server                     |
| `npm run build` | Production build (next build)     |
| `npm start`   | Serve the production build           |
| `npx tsc --noEmit` | TypeScript type check            |

## Route Map

| Route                     | Access | Purpose                                    |
| ------------------------- | ------ | ------------------------------------------ |
| `/`                       | Public | Landing page                               |
| `/login` `/register`      | Public | Auth (email/password + Google/Facebook)    |
| `/dashboard/jobs`         | User   | Job marketplace with search/filter/like    |
| `/dashboard/jobs/[id]`    | User   | SEO-friendly server-rendered job detail    |
| `/dashboard/my-jobs`      | User   | Posted jobs, edit/delete, status           |
| `/dashboard/my-tasks`     | User   | Accepted tasks, milestone submission       |
| `/dashboard/earnings`     | User   | Wallet balance, withdrawals, history       |
| `/dashboard/disputes`     | User   | Open & track disputes                      |
| `/dashboard/verification` | User   | Identity verification request              |
| `/admin/jobs` … `/admin/disputes` | Admin | Moderation & review pages           |

## Design System

- **Tokens:** brand colors (`--primary: hsl(243 75% 59%)`), surface colors, borders, shadows, radii — defined in `src/styles/globals.css`.
- **Utilities:** `card-shadow` (layered elevation), `animate-grid-fade`, `animate-shimmer`, `animate-float`.
- **Primitives** (`src/components/ui/`): `Button` (with `isLoading` spinner, variants/sizes), `Input`, `Textarea`, `Select`, `Checkbox`, `Table`, `Dialog`, `AlertDialog`, `Card`, `Badge` (default/secondary/destructive/outline/success/warning/info), and an inline SVG `icons.tsx` set (no icon library dependency).

## Backend Contract Notes

- Auth uses **httpOnly cookies** (`accessToken`, `refreshToken`, `role`); every API call goes through the axios interceptor with `withCredentials: true`.
- Response envelope: `{ success, message, meta?, data? }`.
- Key API shapes the frontend depends on (verified against the backend):
  - User warnings: `PATCH /users/:id/warnings` (field `warnings`, plural path).
  - Transaction review: body field `adminNote` (not `note`).
  - Job steps: field name `steps` (array of `{ title, description }`; the UI dialog accepts JSON text and the backend parses it, so `stepsJson` is obsolete).
  - Task `completeStep` / `reviewTask` responses return partial job-bearing task objects — the UI handles missing `job.postedBy`/`job.reward` gracefully.
- Currency is displayed in **taka (৳)** app-wide.

## Notes

- The mobile layout collapses the dashboard sidebar; navigation is still accessible via the top navbar.
- Server-rendered detail routes (`/dashboard/jobs/[id]`) stay SEO-friendly; interactions (apply, like, comment) are client components.