# Data Model: Mis plataformas

**Feature**: `001-mis-plataformas`  
**Date**: 2026-06-01

## Overview

100% client-side data. There are no server entities or migrations.

```text
PlatformCatalogEntry ──< UserPlatformSelection >── NormalizedPlatform (read-only, from TMDB)
         │                         │
         │                         └── persisted in localStorage
         └── fixed list in code
```

## Entities

### PlatformCatalogEntry

A service the user can declare they pay for.

| Field | Type | Rules |
|-------|------|--------|
| `slug` | `string` | Unique, stable key (`netflix`, `amazon`, …) |
| `name` | `string` | Display name (voseo in the surrounding UI, not in the brand name) |
| `color` | `string` | Hex for the profile tile |

**Source**: `PLATFORMS_CATALOG` (today in `mock-data.ts` → move to a canonical module).

### UserPlatformSelection

The user's preference.

| Field | Type | Rules |
|-------|------|--------|
| `slugs` | `string[]` | Subset de `PlatformCatalogEntry.slug`; order not significant; duplicates forbidden |
| `updatedAt` | `number` (optional) | Unix ms; optional for debugging, not required MVP |

**Storage key**: `peligo_user_platforms`  
**Serialized form**: `JSON.stringify(string[])` — empty array `[]` = no personalization (FR-011).

**Validation**:

- On read: filter unknown slugs (forward-compatible if a service is removed from the catalog).
- On write: only slugs present in catalog.

### NormalizedPlatform (existing)

Availability row from TMDB pipeline (`src/src/lib/tmdb.ts`).

| Field | Type | Notes |
|-------|------|--------|
| `name` | `string` | TMDB provider name |
| `slug` | `string` | **Will add canonical `catalogSlug`** via mapper (see research R2) |
| `logo` | `string` | URL or empty |
| `type` | `"stream" \| "rent" \| "buy"` | |
| `price` | `string?` | ARS when TMDB provides |
| `link` | `string` | Deep link / TMDB link |

**Extension (planned)**: `providerId?: number` OR replace `slug` at normalize time with catalog slug when mappable.

### PlatformPartition (derived, not persisted)

Result of classifying one title’s platforms for display.

| Field | Type |
|-------|------|
| `mine` | `NormalizedPlatform[]` |
| `other` | `NormalizedPlatform[]` |
| `hasUserConfig` | `boolean` — `userSlugs.length > 0` |

**Rules**:

- If `!hasUserConfig`: `mine = []`, `other = all platforms` (UI uses legacy flat list).
- If `hasUserConfig`: each platform goes to `mine` iff `catalogSlug(platform) ∈ userSlugs`, else `other`.
- Same provider in stream+rent counts once per slug in `mine` (dedupe by catalog slug for grouping; show all rows or best row per product decision in UI — prefer show all access types in mine).

## State transitions

```text
[No selection] ──user toggles platform──▶ [≥1 slug selected]
[≥1 slug selected] ──toggle off all──▶ [No selection]  (equivalent to [])
[≥1 slug selected] ──toggle one off──▶ [≥0 slugs]
[Any] ──clear site data──▶ [No selection]
```

## Cross-feature boundaries

| Feature | Interaction |
|---------|-------------|
| Favorites | Independent storage key; no merge |
| Home / Trending | Out of scope — no read of `userSlugs` |
| Alerts (future) | May reuse `userSlugs` later — not in this feature |
