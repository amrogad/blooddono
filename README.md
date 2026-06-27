# BloodDono

A blood donation portfolio project, it's built with React, Vite, Tailwind CSS, and Supabase.

Donors and recipients can search for matches by blood group and location, post and manage donation requests, and get a role-based dashboard once they log in. Auth, profiles, and access control are backed by a real Supabase project (Postgres + Row Level Security), not mock data — so the admin/donor/volunteer experiences you see are driven by actual roles stored in the database.

🔗 **Live demo:** [blooddono-two.vercel.app](https://blooddono-two.vercel.app/)

## Try it yourself

The login page has one-click **Demo logins** for all three roles — no signup needed:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@blooddono.demo` | `Demo123!` |
| Donor | `donor@blooddono.demo` | `Demo123!` |
| Volunteer | `volunteer@blooddono.demo` | `Demo123!` |

Each role sees a different dashboard — admin gets user/content management and platform-wide stats, donors get their own donation requests, and volunteers get a scoped-down view. Try `/dashboard/all-users` as the donor account to see the route guard kick in and redirect to `/forbidden`.

## Features

- Search for donors by blood group, governorate, and city
- View, create, and manage blood donation requests
- Real authentication with Supabase (sign up, log in, persistent sessions)
- Role-based dashboard (admin, donor, volunteer) backed by Postgres + Row Level Security
- Route guards that redirect unauthorized roles to a `/forbidden` page
- Blog section with a content management UI
- Donation/funding page
- Responsive layout with Tailwind CSS + DaisyUI

## Screenshots

| Home | Login (Demo logins) |
|---|---|
| ![Home page](screenshots/home.png) | ![Login page with demo account buttons](screenshots/login.png) |

| Search Donors | Donation Requests |
|---|---|
| ![Search donors page](screenshots/search.png) | ![Donation requests page](screenshots/donation-requests.png) |

| Admin Dashboard | Donor Dashboard |
|---|---|
| ![Admin dashboard](screenshots/dashboard.png) | ![Donor dashboard](screenshots/dashboard-donor.png) |

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS 4 + DaisyUI 5
- React Router 7
- Redux Toolkit + React Redux
- React Hook Form
- SweetAlert2
- React Icons

**Backend**
- [Supabase](https://supabase.com/) — Postgres database, authentication, and Row Level Security

**Testing**
- Playwright (end-to-end)

## Getting Started

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase project's URL and anon key:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then start the dev server:

```bash
npm run dev
```

Runs at `http://localhost:5173`.

## Backend Setup

If you want to run this against your own Supabase project (rather than just using the live demo above):

1. Create a new Supabase project and copy its URL + anon key into `.env`.
2. Run **STEPs 1–5** of `supabase/schema.sql` in the Supabase SQL editor. These create the tables (`profiles`, `blood_donation_requests`, `blogs`, `funds`), enable Row Level Security, add the helper functions (`is_admin`, `search_donors`, the admin role/status RPCs), and create the `avatars` and `blog-images` storage buckets. Column-level grants let a user update their own profile fields but never their own `role` — that's set server-side only.
3. Seed the three demo accounts:
   ```bash
   node --env-file=.env scripts/seed-demo-accounts.mjs
   ```
4. Run **STEP 6** of `supabase/schema.sql`. It promotes the admin and volunteer demo accounts to their roles (the donor keeps the default), makes the donor searchable, and seeds demo donation requests, blogs, and funding records so the app isn't empty.

## Testing

End-to-end tests use [Playwright](https://playwright.dev/) and cover navigation, authentication (including the demo logins), and role-based access control.

```bash
npm run test:e2e
```

This starts the dev server automatically and runs the suite against Chromium.

## Deployment

Deployed on [Vercel](https://vercel.com/) — `vercel.json` handles the SPA rewrite so client-side routes work on refresh and direct links. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.
