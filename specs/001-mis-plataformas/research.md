# Research: Mis plataformas

**Feature**: `001-mis-plataformas`  
**Date**: 2026-06-01

## R1: On-device persistence (MVP)

**Decision**: `localStorage` with key `peligo_user_platforms`, an array of `slug` strings (same pattern as `peligo_favorites` in `src/src/lib/favorites.ts`).

**Rationale**:

- The spec requires persistence without a backend; favorites already use this pattern.
- Only slugs from the curated catalog — minimal payload, no PII.
- SSR-safe: read/write only in `"use client"` or `typeof window !== "undefined"`.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|-------------------|
| `sessionStorage` | Does not satisfy FR-003 (persist across visits). |
| IndexedDB | Over-engineering for an array of strings. |
| Cookie | Unnecessary with no server reading the preference. |
| Backend / account | Out of scope of the spec. |

## R2: Catalog ↔ TMDB providers matching

**Decision**: A central `TMDB_PROVIDER_ID → catalog slug` map in `src/src/lib/user-platforms.ts`, applied when normalizing or partitioning `NormalizedPlatform[]`. Fallback: normalize `provider_name` with an alias table; if there is no match → always "other options" (never a false positive).

**Rationale**:

- Today `tmdb.ts` uses `slugify(provider_name)` → slugs like `amazon-prime-video`, `disney-plus`, which **do not match** the catalog (`amazon`, `disney`).
- TMDB exposes a stable `provider_id` — more reliable than strings.
- Constitution: prefer not to fabricate matches; false negatives in "your platforms" are acceptable; false positives are not.

**Relevant TMDB IDs for AR (initial reference)**:

| provider_id | Typical TMDB name | Catalog slug |
|-------------|-------------------|--------------|
| 8 | Netflix | `netflix` |
| 119 | Amazon Prime Video | `amazon` |
| 337 | Disney Plus | `disney` |
| 384 | HBO Max / Max | `hbo` |
| 531 | Paramount Plus | `paramount` |
| 350 | Apple TV | `apple` |
| 619 | Star Plus | `star` |
| 11 | Mubi | `mubi` |
| 283 | Crunchyroll | `crunchyroll` |

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|-------------------|
| Change only `slugify` in the catalog | Breaks the profile UI and does not cover TMDB renames. |
| Match by name substring | Risk of false positives (constitution). |
| Duplicate the catalog in TMDB normalize | Mixes concerns; profile should keep using `PLATFORMS_CATALOG`. |

**Follow-up**: Extend `normalizeProviders` to include `providerId` in `NormalizedPlatform` (optional field) or resolve the canonical slug at normalize time — see `contracts/platform-partition.md`.

## R3: Reactive client state

**Decision**: A `user-platforms.ts` module + a `useUserPlatforms()` hook that:

- Hydrates from `localStorage` on mount.
- Exposes `slugs`, `toggle`, `setSlugs`, `hasPlatforms`, `isOnUserPlatform(platform)`.
- Emits a custom `storage` event (`peligo:user-platforms-changed`) to sync tabs and re-render without excessive prop drilling.

**Rationale**:

- Profile, detail page, and search are client components; no API route required.
- The search page must re-read preferences when returning from the profile (custom event or shared hook).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|-------------------|
| Global React Context | Acceptable, but a hook + event is enough for 3 screens. |
| Zustand / Jotai | New dependency — violates YAGNI. |
| Server Component + cookies | Requires middleware/backend — out of the MVP. |

## R4: Title detail UI — collapsible sections

**Decision**: In `TitleDetailClient.tsx`, when `userSlugs.length > 0`:

1. Partition `title.platforms` → `{ mine, other }`.
2. Render the **"En tus plataformas"** block expanded if `mine.length > 0`.
3. If `mine.length === 0` and `other.length > 0` → honest message + **"Otras opciones en Argentina"** accordion (collapsed by default if there were previous matches on other visits; if there was never a mine, show others expanded or collapsed per spec — **collapsed by default when mine > 0**; when mine === 0, expand "others" so as not to hide the only way to watch the title).
4. No platforms configured → current UI + CTA banner to `/profile`.

**Rationale**: Aligned with FR-004–FR-007 and the "only on other platforms" edge case.

## R5: Search UI (P2)

**Decision**: On the result card, if `platforms` intersects `userSlugs` → "En tu plataforma" pill + sort badges (user first, max 3 total as today).

**Rationale**: Scoped change in `search/page.tsx`; reuses the `partitionPlatforms` helper.

## R6: Single catalog

**Decision**: Move `PLATFORMS_CATALOG` from `mock-data.ts` to `user-platforms.ts` (or `platforms-catalog.ts`) and re-export from mock-data if compatibility is needed. Profile imports from the canonical module.

**Rationale**: Avoids drift between profile and matcher; mock-data is left for title fixtures.
