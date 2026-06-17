# Ruum — Student Housing Made Easy

**Live site:** [ruum-nine.vercel.app](https://ruum-nine.vercel.app)
**Repo:** [github.com/Drew-space/unidel-housing](https://github.com/Drew-space/unidel-housing)

Ruum is a verified student housing marketplace built for students at the University of Delta, Agbor — connecting them directly with housing agents in areas like Owa-Alero, Alihame, and Owo-Yibo, without the usual back-and-forth of walking from street to street looking for available rooms.

## The problem

Finding off-campus housing as a student in Agbor typically means physically walking from one street to the next, asking around, and hoping an agent has something available in your price range. There was no central place to browse listings, see real photos, or know whether the person listing a property was legitimate.

## What it does

Students can browse verified listings, filter by room type, location, or price range, or run a full-text search across listing descriptions. When a listing looks right, they can message the agent directly to follow up. Agents apply to list properties through a KYC verification flow — submitting a selfie, a government-issued ID, and a utility bill — which an admin reviews and approves or rejects (with a reason, and the ability to resubmit) before the agent can post anything. Students can also leave reviews on an agent's public profile and report agents directly, giving the platform a basic trust and accountability layer that didn't exist before.

## How it evolved

Ruum didn't start with KYC. The first version used Clerk for auth and relied on me manually editing a user's role in the Clerk dashboard before they could list a property — there was no real verification process. After getting the app in front of real agents and talking it through with my course advisor, two things became clear: search needed to be more flexible than the original three filters (room type, location, price), and agent verification needed to be a real, built-in flow rather than something I handled by hand behind the scenes. That feedback led to the global search feature and the full KYC system — including an admin dashboard where review queues, listing reports, and agent submissions are all managed in one place. All verification is currently manual by design; there's no automated identity check yet.

## Features

- Property browsing with filters (room type, location, price range) plus full-text global search across listing descriptions
- Agent KYC flow: selfie, government ID, and utility bill submission, with admin approval/rejection and resubmission on rejection
- Admin dashboard for managing the KYC queue, agent accounts, listing reports, and student reviews
- Public agent profile pages showing verified status and student reviews
- In-app messaging between students and agents on a listing
- Reporting system so students can flag problematic agents or listings

## Tech stack

- **Framework:** Next.js (App Router), TypeScript
- **Backend / database:** Convex
- **Auth:** Clerk
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui

## Status

Live and in active use by students and agents. Built and maintained solo, end to end — from schema design through deployment.

## Running locally

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view it. You'll need your own Convex and Clerk environment variables set up — see `.env.example` (or create one) for the required keys.
