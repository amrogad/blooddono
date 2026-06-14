# BloodDono

A frontend project for a blood donation platform, built with React, Vite, Tailwind CSS, and DaisyUI.

It's a full frontend — donor search, donation requests, a role-based dashboard, and a small blog/content section, all wired up with routing, forms, and validation. There's no backend; everything runs on local sample data, so you can clone it and click around right away.

## Features

- Search for donors by blood group, governorate, and city
- View and create blood donation requests
- Role-based dashboard (admin, donor, volunteer)
- Blog section with a content management UI
- Donation/funding page
- Responsive layout with Tailwind CSS + DaisyUI

## Screenshots

| Home | Search Donors |
|---|---|
| ![Home page](screenshots/home.png) | ![Search donors page](screenshots/search.png) |

| Donation Requests | Dashboard |
|---|---|
| ![Donation requests page](screenshots/donation-requests.png) | ![Dashboard](screenshots/dashboard.png) |

## Tech Stack

- React 19
- Vite
- Tailwind CSS 4 + DaisyUI 5
- React Router 7
- Redux Toolkit + React Redux
- React Hook Form
- SweetAlert2
- React Icons

## Getting Started

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Testing

End-to-end tests use [Playwright](https://playwright.dev/) and cover navigation, image loading, and the Redux-backed auth/logout flow.

```bash
npm run test:e2e
```

This starts the dev server automatically and runs the suite against Chromium.

## Notes

This is frontend-only — login and register are there for the flow, but every page runs on a demo user and sample data instead of a real backend.
