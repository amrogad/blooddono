# BloodDono

[![CI](https://github.com/amrogad/blooddono/actions/workflows/ci.yml/badge.svg)](https://github.com/amrogad/blooddono/actions/workflows/ci.yml)

A React web app that connects blood donors with the patients who need them. Donors search for matches by blood group and governorate, post and track requests through a role-based dashboard, and everything runs on real Supabase accounts instead of mock data. The whole interface works in English and Arabic, and the layout mirrors to full RTL when you switch.

There's also a [React Native version](https://github.com/amrogad/blooddono-mobile) on the same Supabase backend, so the data lines up across both.

🔗 **Live demo:** [blooddono-two.vercel.app](https://blooddono-two.vercel.app/)

## Highlights

- 🔐 Real authentication with role-based access for admins, donors, and volunteers
- 🛡️ Protected routes that redirect unauthorized roles to a forbidden page
- 🩸 Donor search by blood group and location, with compatibility matching
- 🤖 AI eligibility assistant that can query the donor database, not just answer from a prompt
- 📝 Donation request management through a 3-step create wizard
- 🌐 Full Arabic and English support, with the layout mirroring to RTL on switch
- 🌙 Dark and light mode, system-aware and persisted
- 📱 Responsive across phone, tablet, and desktop

## Demo accounts

The login page has one-click demo logins for all three roles, no signup needed:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@blooddono.demo` | `Demo123!` |
| Donor | `donor@blooddono.demo` | `Demo123!` |
| Volunteer | `volunteer@blooddono.demo` | `Demo123!` |

Each role opens a different dashboard: admins manage users, content, and platform-wide stats; donors see and manage their own requests; volunteers get a scoped coordinator view. Sign in as the donor and open `/dashboard/all-users` to watch the route guard redirect you to the forbidden page.

## Demo walkthrough

Under 3 minutes to see the core loop:

1. Log in with the Donor demo account.
2. Browse open requests, grouped by how soon blood is needed.
3. Open a request to see the patient details and which blood types can safely donate.
4. Post your own request through the 3-step wizard.
5. Go to Find Donors, pick a blood group and governorate, and see who can help.
6. Switch to the Admin or Volunteer demo account to see the other dashboards.
7. Tap ع in the top bar and watch the whole app flip to Arabic and RTL.

## Features

- Search for donors by blood group, governorate, and city
- Blood compatibility matching, so a search for A+ also surfaces the O+ and O- donors who can safely give
- Browse open requests grouped into Today, This week, and Later, with urgency labels
- Post, edit, and manage requests through a role-based dashboard
- Real authentication with Supabase: sign up, log in, and persistent sessions
- Role-aware routing with guards that redirect unauthorized roles to a forbidden page
- AI eligibility assistant at `/assistant`. Ask "How many donors near me could give me blood?" and it calls a `find_compatible_donors` tool that runs a real query against the donor table, then answers from the result. The reply carries a "checked the donor database" marker so you can tell a looked-up answer from a generated one
- Blog section with a content management UI for drafting, publishing, and editing posts
- Community fund page where anyone can contribute, with a running list of donations
- Arabic and English with automatic RTL mirroring, switchable without leaving the page
- Dark and light themes, system-aware and persisted

## Screenshots

The home page in every combination of language and theme:

| English · light | Arabic · light (RTL) |
|---|---|
| <img src="screenshots/home.png" alt="Home page, English, light mode" width="420" /> | <img src="screenshots/home-ar.png" alt="Home page, Arabic, light mode, RTL" width="420" /> |

| English · dark | Arabic · dark (RTL) |
|---|---|
| <img src="screenshots/home-dark.png" alt="Home page, English, dark mode" width="420" /> | <img src="screenshots/home-ar-dark.png" alt="Home page, Arabic, dark mode, RTL" width="420" /> |

A couple more screens, plus the mobile layout:

| Find donors | Admin dashboard |
|---|---|
| <img src="screenshots/search.png" alt="Find donors page" width="420" /> | <img src="screenshots/dashboard.png" alt="Admin dashboard" width="420" /> |

The assistant after a question that needed a database lookup:

<img src="screenshots/assistant.png" alt="AI assistant answering a donor availability question" width="560" />

| Mobile · English | Mobile · Arabic (dark, RTL) |
|---|---|
| <img src="screenshots/mobile.png" alt="Requests on mobile, English" width="230" /> | <img src="screenshots/mobile-ar.png" alt="Requests on mobile, Arabic, dark, RTL" width="230" /> |

## Architecture

```
UI (React + React Router)
        ↓
Redux Toolkit (auth)  ·  React Context (theme + locale)
        ↓
Service layer (Supabase queries and RPCs)
        ↓
Supabase (PostgreSQL · Auth · Storage · Edge Functions)
        ↓
Groq (tool calling back into the donor table)
```

## Built with

- 45+ React components and pages
- 68 automated tests (45 Vitest, 23 Playwright)
- Shared Supabase backend and edge functions with the mobile version
- Deployed on Vercel, green on CI

## Tech stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4 + DaisyUI 5
- React Router 7
- Redux Toolkit + React Redux
- React Hook Form
- react-i18next for Arabic and English with RTL
- SweetAlert2
- React Icons

### Backend (managed service)
- [Supabase](https://supabase.com/) for hosted authentication, PostgreSQL, and storage
- Supabase Edge Functions (Deno) for the eligibility assistant, shared with the mobile app
- [Groq](https://groq.com/) (`openai/gpt-oss-20b`) for the assistant, called server-side so the key never reaches the browser

### Testing
- Vitest + Testing Library (component)
- Playwright (end-to-end)

## Testing

The full pipeline runs on every push through GitHub Actions: lint, build, component tests, then end-to-end.

Component tests use Vitest and Testing Library:

```bash
npm test
```

End-to-end tests use Playwright and cover navigation, auth flows, role-based access, and the Arabic RTL switch:

```bash
npm run test:e2e
```

68 tests in total, including a parity check that every English string has an Arabic translation.

The assistant's answers are checked separately, because a passing test suite says nothing about whether health information is correct. There are 15 fixed eligibility questions with known-correct answers in the mobile repo, run with `npm run eval`. It scores whether the model called the donor lookup when it should have, whether the blood groups it lists match the compatibility rules the rest of the app enforces, and whether every answer carries the not-medical-advice line. It currently passes 15 of 15.

The first run scored 40%. One of those failures was real: the assistant answered that only A+ and O+ can donate to A+, dropping A- and O-. Under-reporting compatible donors is the worst way for this particular app to be wrong. The fix was to stop relying on the model's own knowledge of compatibility and pass it the table, since the app already holds it.

The other failures were the grader's fault, not the model's. It was matching blood groups with an ASCII hyphen while the model wrote "O‑negative" with a non-breaking one, so four correct answers scored as wrong.

## Known limitations and what's next

Things I know are missing or rough, rather than things I'm hoping nobody notices:

- The assistant is question-and-answer only. It can look up donor counts, but it can't post a request, accept one, or change anything on your behalf. Letting it take actions means a confirmation step and a much harder safety story, so it reads rather than writes.
- It never sees donor identities. The lookup returns counts grouped by blood group, so no names or photos leave the backend for the model provider. That also means it can't tell you *who* to contact, only how many people could help. The Find Donors page does that part.
- Answers are capped at 50 a day per account, tracked in Postgres. Groq's free tier also has a tokens-per-minute ceiling, so a burst of questions can briefly fail.
- The public request board shows patient names shortened to a first name and initial for signed-out visitors. Full names appear once you sign in. There's no consent flow around posting someone else's details, which a real deployment would need.
- New requests need a refresh to appear. Supabase Realtime is the obvious fix and isn't wired up yet.
- Payments on the funding page are recorded, not processed. There's no payment provider behind it.
- The eval set covers compatibility rules, tool routing, and safety-critical deferrals. It deliberately avoids questions where the correct answer varies by country, like exact tattoo or travel deferral periods, so the assistant's answers on those are unverified.

## Why I built this

Blood shortages are a logistics problem: patients need specific types, donors are willing, but there's no fast way to connect the two. I wanted something real end to end rather than a toy demo, so it has genuine auth and access control, blood-type compatibility matching, and a fully bilingual Arabic and English interface with RTL.

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

## Deployment

Deployed on [Vercel](https://vercel.com/). `vercel.json` handles the SPA rewrite so client-side routes survive a refresh or a direct link. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project's environment variables.

## Project structure

```
src/
├── auth/            AuthProvider + route guards (PrivateRoute, AdminRoute, MultiRoleRoute)
├── components/      NavBar, RequestCard, BloodRoundel, Pills, LanguageToggle, ThemeToggle, ...
├── layouts/         Root shell + DashboardLayout
├── pages/           home, auth, blogs, search, requests, funding, dashboard (donations + content)
├── providers/       ThemeProvider, LocaleProvider
├── services/        Supabase queries and RPCs (auth, profiles, donations, blogs, funds)
├── redux/           auth slice + store
├── locales/         en.json + ar.json
├── utils/           urgency, blood compatibility, place names, slugs
└── assets/          governorates + cities
```
