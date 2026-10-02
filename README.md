# BillBuddy

BillBuddy is a smart receipt tracker that helps you manage your spending by scanning receipts and providing actionable insights.

## Setup
1. Clone the repo
2. Run `npm install`
3. Set up your `.env.local` based on `.env.example`
4. Set up Supabase:
   - Create a new Supabase project
   - Enable Anonymous sign-ins in Authentication > Providers
   - Enable Google provider
   - Run the migrations in `supabase/migrations/`
5. Run `npm run dev`

## Tech Stack
- Next.js 16 (App Router)
- Supabase (Auth, Postgres DB, RPCs)
- Tailwind CSS 4
- Zod (Validation)
- Vitest (Testing)
