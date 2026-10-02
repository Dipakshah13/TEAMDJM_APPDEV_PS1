# DECISIONS.md — BillBuddy

Log of every deviation from the spec or design decision made during development.

---

## D-001 — UI deferred to Stitch teammate
**Date:** 2026-10-02
**Decision:** All UI components (components/, page JSX, CSS tokens) are being built by the Stitch teammate. Agent focuses exclusively on backend: API routes, server actions, insight engine, demo seed, roast templates, vision provider, Supabase schema, and tests. Placeholder pages will be minimal stubs — just enough for the app to compile without crashing.
**Reason:** Explicit instruction from team.

## D-002 — JavaScript only, no TypeScript
**Date:** 2026-10-02
**Decision:** All logic files are `.js`, React components (when added by Stitch teammate) will be `.jsx`. JSDoc typedefs in `src/lib/models.js` serve as the type documentation layer. Zod validates all runtime data.
**Reason:** Spec §2, §3 rule 0.

## D-003 — Scaffold name workaround
**Date:** 2026-10-02
**Decision:** `create-next-app` doesn't allow capital letters in project name. Created in subdirectory `billbuddy-app` then moved all files to repo root `d:\BillBuddy\`.
**Reason:** npm naming restriction.

## D-004 — Vision model default
**Date:** 2026-10-02
**Decision:** Default `VISION_MODEL=claude-opus-4-5` in `.env.example`. Provider abstraction in `lib/vision/provider.js` allows swapping to any model via env var.
**Reason:** Spec §8 requires provider-swappable extraction.

## D-005 — Demo Mode fallback receipts
**Date:** 2026-10-02
**Decision:** 3 hardcoded mock receipts (grocery, cafe/late-night, fuel) in `lib/vision/mockReceipts.js` used when API fails, times out, or key is missing. Client shows "Demo extraction" badge.
**Reason:** Spec §8.3 — live demo must never break.
