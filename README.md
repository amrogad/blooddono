# BloodDono

Blood donation platform built with React, Vite, Tailwind CSS, and Supabase.

Donors and recipients can search for matches by blood group and location, post donation requests, and manage them through a role-based dashboard. Auth, profiles, and access control run on Supabase with real accounts, not mock data.

🔗 **Live demo:** [blooddono-two.vercel.app](https://blooddono-two.vercel.app/)

## Try it yourself

The login page has one-click **Demo logins** for all three roles, no signup needed:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@blooddono.demo` | `Demo123!` |
| Donor | `donor@blooddono.demo` | `Demo123!` |
| Volunteer | `volunteer@blooddono.demo` | `Demo123!` |

Each role gets a different dashboard: admin covers user/content management and platform-wide stats, donors see their own donation requests, and volunteers get a scoped view. Try `/dashboard/all-users` as the donor account to see the route guard kick in and redirect to `/forbidden`.

## Features

- Search for donors by blood group, governorate, and city
- View, create, and manage blood donation requests
- Real authentication with Supabase (sign up, log in, persistent sessions)
- Role-based dashboard (admin, donor, volunteer) with protected, role-aware routes
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

## Tech stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4 + DaisyUI 5
- React Router 7
- Redux Toolkit + React Redux
- React Hook Form
- SweetAlert2
- React Icons

### Backend (managed service)
- [Supabase](https://supabase.com/) (hosted authentication and database)

### Testing
- Playwright (end-to-end)
- Vitest + Testing Library (component)

## Getting started

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

## Testing

End-to-end tests use [Playwright](https://playwright.dev/) and cover navigation, auth flows (including demo logins), and role-based access control.

```bash
npm run test:e2e
```

This starts the dev server automatically and runs the suite against Chromium.

Component tests use Vitest and Testing Library:

```bash
npm test
```

## Deployment

Deployed on [Vercel](https://vercel.com/). `vercel.json` handles the SPA rewrite so client-side routes work on refresh and direct links. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.
