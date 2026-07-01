---
description: "Task list for Mis plataformas feature implementation"
---

# Tasks: Mis plataformas

**Input**: Design documents from `specs/001-mis-plataformas/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual validation per quickstart.md (no automated tests in spec)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

**Purpose**: Confirm context and contracts before coding

- [x] T001 Review feature contracts in `specs/001-mis-plataformas/contracts/` (storage, partition, UI sections)
- [x] T002 Confirm dev environment: `cd src && npm install` and `TMDB_API_KEY` in `src/.env.local`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared module and TMDB mapping — MUST complete before US1/US2/US3 UI work

**⚠️ CRITICAL**: No user story UI work until this phase is complete

**Independent Test**: Import `partitionPlatforms` and `getUserPlatformSlugs` from `src/src/lib/user-platforms.ts` in a client component; toggle storage in DevTools and verify partition splits correctly for sample platforms.

- [x] T003 Create `src/src/lib/user-platforms.ts` with `PLATFORM_CATALOG`, `STORAGE_KEY`, `getUserPlatformSlugs`, `setUserPlatformSlugs`, `toggleUserPlatform`, and `peligo:user-platforms-changed` event per `specs/001-mis-plataformas/contracts/user-platforms-storage.md`
- [x] T004 [P] Implement `TMDB_PROVIDER_TO_SLUG`, `resolveCatalogSlug`, and `partitionPlatforms` in `src/src/lib/user-platforms.ts` per `specs/001-mis-plataformas/contracts/platform-partition.md`
- [x] T005 Add optional `providerId: number` to `NormalizedPlatform` and populate it in `normalizeProviders` in `src/src/lib/tmdb.ts`
- [x] T006 [P] When `providerId` maps to catalog slug, set canonical `slug` on `NormalizedPlatform` during normalize in `src/src/lib/tmdb.ts`
- [x] T007 Move `PLATFORMS_CATALOG` to `src/src/lib/user-platforms.ts` as `PLATFORM_CATALOG` and re-export from `src/src/lib/mock-data.ts` for backward compatibility
- [x] T008 Implement `useUserPlatforms` hook with SSR-safe hydration and `storage` / custom event subscription in `src/src/lib/user-platforms.ts`

**Checkpoint**: Foundation ready — user story phases can begin

---

## Phase 3: User Story 1 — Configure my services (Priority: P1) 🎯 MVP entry

**Goal**: Profile persists the platform selection on the device without hardcoded defaults

**Independent Test**: Open `/profile`, select Netflix + Disney+, reload browser, confirm both remain selected; deselect one and reload again

### Implementation for User Story 1

- [x] T009 [US1] Replace hardcoded `useState` defaults in `src/src/app/profile/page.tsx` with `useUserPlatforms` and `PLATFORM_CATALOG`
- [x] T010 [US1] Wire `togglePlatform` to `toggleUserPlatform` with immediate persistence in `src/src/app/profile/page.tsx`
- [x] T011 [US1] Ensure new users see zero platforms selected (no pre-checked Netflix/Amazon/Disney) in `src/src/app/profile/page.tsx`

**Checkpoint**: US1 complete — profile selection persists across sessions

---

## Phase 4: User Story 2 — See "where to watch it" on my platforms first (Priority: P1)

**Goal**: Title detail page groups availability into "En tus plataformas" vs "Otras opciones en Argentina"

**Independent Test**: With Netflix selected, open a title on Netflix in AR; see Netflix in primary section; other providers in collapsed secondary section

**Depends on**: Phase 2 complete; US1 recommended so test data exists (can also set `localStorage` manually)

### Implementation for User Story 2

- [x] T012 [US2] Integrate `useUserPlatforms` and `partitionPlatforms` in `src/src/app/title/[id]/TitleDetailClient.tsx`
- [x] T013 [US2] Render expanded “En tus plataformas” section when `mine.length > 0` in `src/src/app/title/[id]/TitleDetailClient.tsx`
- [x] T014 [US2] Render honest empty-mine message when `mine.length === 0` and `other.length > 0` in `src/src/app/title/[id]/TitleDetailClient.tsx`
- [x] T015 [US2] Add collapsible “Otras opciones en Argentina” (collapsed when mine > 0, expanded when mine === 0) in `src/src/app/title/[id]/TitleDetailClient.tsx` per `specs/001-mis-plataformas/contracts/ui-availability-sections.md`
- [x] T016 [US2] Preserve legacy flat list + CTA link to `/profile` when `userSlugs.length === 0` in `src/src/app/title/[id]/TitleDetailClient.tsx`

**Checkpoint**: US2 complete — title detail personalized for configured users

---

## Phase 5: User Story 3 — Search results aligned (Priority: P2)

**Goal**: Search cards show "En tu plataforma" and prioritize the user's badges

**Independent Test**: With Disney+ selected, search a Disney+ title; card shows indicator; change profile selection and confirm search updates

**Depends on**: Phase 2 complete; US1 for easiest manual setup

### Implementation for User Story 3

- [x] T017 [US3] Add `useUserPlatforms` to `src/src/app/search/page.tsx` (ensure client-side subscription to preference changes)
- [x] T018 [US3] Show “En tu plataforma” pill on result cards when `partitionPlatforms(...).mine.length > 0` in `src/src/app/search/page.tsx`
- [x] T019 [US3] Sort platform badges (user platforms first, then others, max 3) on search result cards in `src/src/app/search/page.tsx`

**Checkpoint**: US3 complete — search reflects user platforms

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Lint and manual QA across all stories

- [x] T020 [P] Run `cd src && npm run lint` and fix issues in touched files
- [ ] T021 Execute full manual checklist in `specs/001-mis-plataformas/quickstart.md` (US1, US2, US3, edge cases)
- [x] T022 [P] Optional: add `highlight` prop to `src/src/components/PlatformBadge.tsx` for user-platform badges if needed for US3 visual emphasis

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: Depends on Foundational (T003–T008)
- **US2 (Phase 4)**: Depends on Foundational; US1 optional for testing but not code-dependent
- **US3 (Phase 5)**: Depends on Foundational; US1 optional for testing
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

```text
Phase 2 (Foundation)
    ├── US1 Profile (P1)
    ├── US2 Title detail (P1) — parallel with US1 after Phase 2
    └── US3 Search (P2) — after Phase 2; best after US1 for QA
```

### Within Each User Story

- Foundation module before any page changes
- US2/US3 consume `partitionPlatforms` only after T004–T006 complete
- Do not skip US1 before demoing full P1 value (US2 is the core payoff)

### Parallel Opportunities

- **Phase 2**: T004 ∥ T005 ∥ T007 (different concerns in tmdb vs user-platforms vs mock-data) after T003 exists
- **After Phase 2**: US1 and US2 can proceed in parallel (different files: profile vs TitleDetailClient)
- **Phase 6**: T020 ∥ T022

---

## Parallel Example: Foundational

```bash
# After T003 creates user-platforms.ts:
# Parallel: partition logic, tmdb providerId, mock-data re-export
T004 partitionPlatforms in src/src/lib/user-platforms.ts
T005 providerId in src/src/lib/tmdb.ts
T007 re-export in src/src/lib/mock-data.ts
# Then sequential:
T006 canonical slug in tmdb.ts
T008 useUserPlatforms hook
```

---

## Parallel Example: User Stories after Foundation

```bash
# Developer A:
T009–T011  src/src/app/profile/page.tsx

# Developer B (simultaneously):
T012–T016  src/src/app/title/[id]/TitleDetailClient.tsx
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1–2
2. Complete Phase 3 (US1)
3. **STOP and VALIDATE**: Profile persistence per quickstart §1
4. Demo: user can save platforms (foundation for rest)

### Recommended P1 delivery (US1 + US2)

1. Foundation → US1 → US2
2. **VALIDATE**: Configure Netflix → open title on Netflix → see “En tus plataformas”
3. Ship — core product differentiator without search changes

### Full feature (US1 + US2 + US3)

1. Add Phase 5 (search indicators)
2. Run Phase 6 polish

---

## Notes

- Constitution v1.0.0: voseo, no backend, conservative TMDB matching
- If `provider_id` missing on a platform row, it MUST land in `other` only
- Home and trending pages are explicitly out of scope
