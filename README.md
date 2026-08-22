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

### How the assistant answers

A Supabase Edge Function runs a two-pass function-calling loop against Groq. When a question needs donor numbers, the model calls a `find_compatible_donors` tool that runs a real query instead of guessing. The tool aggregates to counts before returning, so no donor names or photos reach the model provider. That's also why it can tell you how many people could help but not who.

### How the assistant posts a request

It can also fill in a request for you, but it can't submit one. A second tool, `draft_donation_request`, gathers the patient details and returns a draft the app shows as a card. Nothing is written until you press Confirm, and the insert then runs from the browser with your own session, under the same row-level policy as the form. The edge function is never given write access.

The tool is called `draft_` rather than `create_` on purpose: the name is part of the prompt, and a model that thinks it created something tends to say so. The function validates every field before the card sees it, so the blood group is one of the eight and the date is a real day that hasn't passed. The card is built from that validated object rather than from the model's arguments, so whatever the reply says afterwards, the fields you're confirming are clean. A patient's blood group is never filled in from your profile, since you are not the patient; if the model wasn't told it, the draft comes back as a question instead. The tool is only offered to a signed-in donor or admin, the same check the New Request button uses.

### How the assistant is graded

A green test suite says nothing about whether health information is correct, so the assistant is scored separately against 19 fixed questions with known-correct answers. Each case checks whether the model called the lookup when it should have, whether the blood groups it listed match the compatibility rules the rest of the app enforces, and whether the not-medical-advice line survived. The drafting cases add two of their own: that the reply never claims a request exists before you confirm it, and that a message missing the patient's blood group produces a question rather than a draft.

The first run scored 40%, and one failure was real: it answered that only A+ and O+ can donate to A+, silently dropping A- and O-. Under-reporting compatible donors is the worst way for this app to be wrong. The fix was to stop relying on the model's recall and pass it the compatibility table the app already holds.

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
