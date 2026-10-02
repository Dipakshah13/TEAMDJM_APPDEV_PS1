# ARCHITECTURE.md — BillBuddy

## Layer Rules (must be enforced in every PR)

```
┌──────────────────────────────────────────────────────────┐
│  app/ pages                                              │
│  • Server Components: call features/ to get data         │
│  • Run lib/insights/ functions on data                   │
│  • Pass results down as props to components/             │
└───────────────────┬──────────────────────────────────────┘
                    │ props only
┌───────────────────▼──────────────────────────────────────┐
│  components/  (Stitch teammate owns this)                │
│  • PRESENTATIONAL ONLY                                   │
│  • No Supabase, no lib/insights, no fetch                │
│  • Data in via props, actions out via callbacks          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  features/  (server actions + data fetching)             │
│  • One folder per domain: auth, scan, review, etc.       │
│  • Calls Supabase (RLS enforced)                         │
│  • May call lib/insights for derived data                │
│  • Returns plain objects (not JSX)                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  lib/insights/  (pure functions)                         │
│  • No React, no Supabase, no Date.now()                  │
│  • All functions accept `today: Date` as param           │
│  • 100% unit-testable with Vitest                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  lib/  (utilities)                                       │
│  • money.js  — INR formatting                            │
│  • dates.js  — IST helpers (wraps date-fns-tz)           │
│  • models.js — JSDoc typedefs + CATEGORIES               │
│  • flags.js  — feature toggles                           │
│  • roast.js  — template roasts (offline-safe)            │
│  • image.js  — client-side compression                   │
│  • vision/provider.js — swap AI provider via env         │
└──────────────────────────────────────────────────────────┘
```

## Import rules
- `components/` MUST NOT import from `lib/insights/`, `lib/supabase/`, or `features/`
- `lib/insights/` MUST NOT import from `react`, `next`, `@supabase/*`
- `app/api/` routes MUST NOT expose `ANTHROPIC_API_KEY` or service-role key to responses

## Money
- All prices stored as `numeric(12,2)` in Postgres
- Always use `formatINR()` from `lib/money.js` for display
- Never do floating-point arithmetic directly on prices — use `round2()`

## Dates
- All timestamps stored as `timestamptz` (UTC) in Postgres
- Always convert to IST via `toIST()` before display or insight calculation
- Never call `new Date()` inside `lib/insights/` — receive `today` as param

## Security
- RLS on every table — verified by `tests/rls.test.js`
- No secrets in client bundle — enforced by `NEXT_PUBLIC_` prefix rule
- Receipt images never stored — downscale → extract → discard
