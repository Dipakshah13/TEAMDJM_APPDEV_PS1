# CHANGELOG.md — BillBuddy

All notable features added to this project. Follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased] — Phase 0

### Added
- Next.js 15 App Router scaffold (JavaScript, Tailwind, `src/` dir, `@/` alias)
- Supabase migration `0001_init.sql`: profiles, user_settings, receipts, receipt_items, extraction_log
- RLS policies on all tables (own-row-only)
- DB triggers: `updated_at`, item `purchased_at` sync, auto profile+settings on signup
- DB functions: `save_receipt()`, `reset_my_data()`, `export_my_data()`
- `@supabase/ssr` auth: magic link + anonymous guest sign-in
- `src/middleware.js` — session refresh on every request
- `lib/money.js` — INR formatting with `Intl.NumberFormat('en-IN')`
- `lib/dates.js` — IST helpers (toIST, timeBucket, buildTimestamp, etc.)
- `lib/models.js` — JSDoc typedefs + CATEGORIES constant
- `lib/flags.js` — feature flag system
- `lib/insights/engine.js` — pure insight functions (safe-to-spend, forecast, repeats, leaks, Sprout)
- Route skeleton: login, home, scan, insights, review, history, settings
- `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/CHANGELOG.md`
- `.env.example`, `.prettierrc`, `vitest.config.js`
