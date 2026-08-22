# BloodDono

A React web app that connects blood donors with the patients who need them, matched by blood-type compatibility and city. Donors browse open requests, post their own through a 3-step wizard, and search for compatible donors near a hospital. Everything runs on real accounts against a Supabase backend, in English or Arabic with the layout mirroring to full RTL.

[Live demo](https://blooddono-two.vercel.app/) · [Mobile app](https://github.com/amrogad/blooddono-mobile)

## Why I built this

When someone needs blood, families end up posting in group chats and hoping the right person sees it in time. The matching problem itself is small and well defined: blood type, location, how soon. Nobody had put it in one place. I wanted to build something real end to end rather than a CRUD demo, which meant genuine auth, access control that actually blocks people, and an Arabic interface that wasn't an afterthought.

## Highlights

- Blood compatibility matching, so a search for an A+ patient also surfaces the O+ and O- donors who can safely give
- An AI eligibility assistant that queries the donor database through tool calling, marks which answers came from a real lookup, and can draft a request for you to confirm
- Role-based access for admins, donors, and volunteers, enforced by route guards
- Full Arabic and English with the layout mirroring to RTL, switchable without a reload
- Shares one Supabase backend and the same edge functions with the React Native app, so the data lines up across both

## Demo

Sign in with one click from the login page, no signup needed:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@blooddono.demo` | `Demo123!` |
| Donor | `donor@blooddono.demo` | `Demo123!` |
| Volunteer | `volunteer@blooddono.demo` | `Demo123!` |

Under 3 minutes to see the core loop:

1. Open the chat bubble in the corner and ask "who can donate to A+?". No account needed.
2. Log in with the Donor demo account.
3. Browse open requests, grouped by how soon blood is needed.
4. Go to Find Donors, pick a blood type and city, and watch compatible types come back alongside exact matches.
5. Post your own request through the 3-step wizard.
6. Open `/dashboard/all-users` as the donor and get redirected to the forbidden page.
7. Tap ع in the top bar and watch the whole app flip to Arabic and RTL.

## Screenshots

| Home | Find donors |
|---|---|
| <img src="screenshots/home.png" alt="Home page" width="420" /> | <img src="screenshots/search.png" alt="Find donors page showing compatible blood types" width="420" /> |

| AI assistant | Arabic · dark · RTL |
|---|---|
| <img src="screenshots/assistant.png" alt="AI assistant answering a donor availability question" width="420" /> | <img src="screenshots/home-ar-dark.png" alt="Home page in Arabic, dark mode, right to left" width="420" /> |

| Assistant drafting a request to confirm |
|---|
| <img src="screenshots/assistant-draft.png" alt="The assistant showing a drafted blood request as a card with a Confirm and post button" width="420" /> |

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

## Engineering

[![CI](https://github.com/amrogad/blooddono/actions/workflows/ci.yml/badge.svg)](https://github.com/amrogad/blooddono/actions/workflows/ci.yml)

- Role-based access control for three roles, enforced by route guards that redirect rather than hide links, so editing the URL by hand doesn't get you in
- Two database-backed AI tool calls: the assistant's donor lookup runs a real query against the donor table, and its request drafting returns a validated draft that only a human confirmation turns into a row
- 84 automated tests. 59 Vitest and Testing Library component tests, 25 Playwright end-to-end covering navigation, auth, role-based access, and the Arabic switch, including a parity check that every English string has an Arabic translation
- Lint, build, component tests and end-to-end on every push through GitHub Actions, deployed on Vercel
- Arabic and RTL from one component tree, using logical properties (`start`/`end`) instead of left and right, so mirroring is a direction change rather than a second stylesheet
- One Supabase project and one set of edge functions shared with the React Native app, so a request posted on either shows up on the other

### How the assistant works

The assistant uses Groq function calling through a Supabase Edge Function. It can query real donor availability using blood-type compatibility and city, while only sending aggregated counts to the model — never donor names or photos.

It can also turn a conversation into a **validated donation request draft**. The assistant never submits it: you review the details and confirm it in the website, where the final insert runs under your normal permissions.

### How it's tested

The assistant has a separate 19-case eval covering tool usage, blood-type compatibility, safety responses, and request drafting. An initial 40% score exposed a real compatibility mistake, so I moved the compatibility rules out of the model's memory and into the same source of truth used by the product.

## Known limitations

- The assistant drafts a request but can't submit one, and it can't accept a request on your behalf at all. Accepting commits you to showing up somewhere, which needs more than a confirmation card.
- The draft card is read-only. Fixing a typo means telling the assistant, or opening the draft in the full form.
- It never sees donor identities, so it can tell you how many people could help but not who. Find Donors does that part.
- New requests need a refresh to appear. Supabase Realtime is the obvious fix and isn't wired up.
- Payments on the funding page are recorded, not processed. There's no payment provider behind it.
- The eval set covers compatibility rules, tool routing, and safety-critical deferrals. It avoids questions whose correct answer varies by country, like exact tattoo or travel deferral periods, so answers there are unverified.
- Answers are capped per day: 50 for a signed-in account, 10 for a signed-out visitor metered on a hash of their address. Groq's free tier also has a tokens-per-minute ceiling, so a burst of questions can briefly fail.

## Getting started

```bash
npm install
cp .env.example .env   # add your Supabase URL and anon key
npm run dev            # http://localhost:5173
```

```bash
npm test           # component tests
npm run test:e2e   # end-to-end
```

## Tech stack

Frontend: React 19, Vite, Tailwind CSS 4, DaisyUI 5, React Router 7, Redux Toolkit, React Hook Form, react-i18next.

Backend, as a managed service: Supabase for hosted auth, PostgreSQL and storage, Supabase Edge Functions (Deno) for the assistant, and Groq (`openai/gpt-oss-20b`) called server-side so the key never reaches the browser.

Testing: Vitest, Testing Library, Playwright.

Deployment: Vercel, with `vercel.json` handling the SPA rewrite so client-side routes survive a refresh.
