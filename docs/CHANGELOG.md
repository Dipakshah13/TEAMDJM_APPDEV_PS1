# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- **Scan Flow**: Fixed image upload payload (FormData -> JSON Base64).
- **Review Queue**: Implemented "Avoid Regret" swipe feature wired to database.
- **Insights**: Added "Trends" tab (Average spend, busiest day, biggest splurge).
- **Home**: Wired up real database recent spends to replace static placeholders.
- **Auth**: Perfected login layout and mascot integration.

## Not yet built (P1-P11 Roadmap)
- P1: Supabase RLS hardening and constraints.
- P2: Dedicated insights engine (`src/lib/insights/`) with tests.
- P3: True Claude Vision model integration with PDF support and timeouts.
- P4: Complete multi-step scan flow with receipt editing and validation.
- P5: Dynamic Sprout pet states and accurate forecasts on the Home screen.
- P6: Advanced review queue (optimistic updates, undo, drag gestures).
- P7: Full category donut charts and accurate leaky-bucket analytics.
- P8: History editing and manual entry features.
- P9: Complete user settings, onboarding, and robust demo seeding.
- P10/P11: Full accessibility audit, PWA installability, light theme consistency.
