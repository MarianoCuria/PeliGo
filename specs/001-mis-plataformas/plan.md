# Implementation Plan: Mis plataformas

**Branch**: `001-mis-plataformas` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-mis-plataformas/spec.md`

## Summary

Allow the user to choose their streaming services in **Profile**, persist the selection on the device, and **prioritize** that availability on the **title detail page** (P1) and **search** (P2). No backend. Reuse `PLATFORMS_CATALOG` and the existing profile UI; introduce a `user-platforms` module with a TMDB `provider_id` → catalog slug map for reliable matching.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16.1.6 (App Router)

**Primary Dependencies**: Next.js, Tailwind CSS 4, lucide-react, TMDB API client in `src/src/lib/tmdb.ts`

**Storage**: `localStorage` key `peligo_user_platforms` (JSON `string[]` of catalog slugs)

**Testing**: Manual per [quickstart.md](./quickstart.md); no automated tests required unless added in tasks

**Target Platform**: Mobile-first PWA (browser); client components for interactive screens

**Project Type**: Web application (Next.js monolith in `src/`)

**Performance Goals**: Partition + render O(n) per title on client; no extra network calls for user prefs

**Constraints**: No NestJS/Prisma/Redis; no new npm deps; voseo in UI; constitution v1.0.0

**Scale/Scope**: 3 screens (profile, title detail, search); ~5–7 files touched

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Reference: `.specify/memory/constitution.md` (PeliGo v1.0.0)

| Gate | Status | Notes |
|------|--------|-------|
| **AR-first** | ✅ Pass | Only existing AR data; copy in Rioplatense Spanish |
| **Data trust** | ✅ Pass | Conservative partition; map by `provider_id`; no false positives |
| **Mobile speed** | ✅ Pass | Client-only prefs; no server round-trip |
| **YAGNI** | ✅ Pass | localStorage + helper; no state library or backend |
| **Brand/UX** | ✅ Pass | Reuses profile tokens and tiles; dark mode |
| **Spec workflow** | ✅ Pass | Artifacts in `specs/001-mis-plataformas/` |
| **Priority fit** | ✅ Pass | P1 aligned with backlog F17 "Mis plataformas" |

**Post-design re-check**: ✅ All gates still pass. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/001-mis-plataformas/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── user-platforms-storage.md
│   ├── platform-partition.md
│   └── ui-availability-sections.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 — /speckit-tasks (not yet)
```

### Source Code (repository root)

```text
src/
├── package.json
└── src/
    ├── app/
    │   ├── profile/page.tsx           # US1 — wire storage + hook
    │   ├── search/page.tsx            # US3 — P2 indicators
    │   └── title/[id]/TitleDetailClient.tsx  # US2 — sections
    ├── components/
    │   └── PlatformBadge.tsx          # optional highlight prop
    └── lib/
        ├── user-platforms.ts          # NEW — catalog, storage, hook, partition
        ├── tmdb.ts                    # ADD providerId + catalog slug resolve
        └── mock-data.ts               # re-export PLATFORM_CATALOG
```

**Structure Decision**: Single Next.js app under `src/`; feature logic concentrated in `src/src/lib/user-platforms.ts` per constitution path conventions.

## Implementation Phases

### Phase A — Foundation (blocking)

1. Create `src/src/lib/user-platforms.ts`:
   - Move/export `PLATFORM_CATALOG` from mock-data.
   - Storage API + `peligo:user-platforms-changed` event.
   - `useUserPlatforms` hook.
   - `TMDB_PROVIDER_TO_SLUG` map + `resolveCatalogSlug` + `partitionPlatforms`.
2. Extend `NormalizedPlatform` in `tmdb.ts` with optional `providerId: number`.
3. Populate `providerId` in `normalizeProviders`; optionally set canonical slug when mapped.

### Phase B — US1 Profile (P1)

4. Refactor `profile/page.tsx`:
   - Remove hardcoded default `["netflix","amazon","disney"]`.
   - Use `useUserPlatforms` + `PLATFORM_CATALOG`.
   - Persist on toggle.

### Phase C — US2 Title detail (P1)

5. Update `TitleDetailClient.tsx` per [ui-availability-sections.md](./contracts/ui-availability-sections.md):
   - `useUserPlatforms` + `partitionPlatforms`.
   - Collapsible “Otras opciones en Argentina”.
   - CTA when no selection.

### Phase D — US3 Search (P2)

6. Update `search/page.tsx`:
   - Client hook for slugs.
   - “En tu plataforma” pill + badge ordering.

### Phase E — Polish

7. Run `npm run lint` in `src/`.
8. Manual quickstart validation.

## Risk Register

| Risk | Mitigation |
|------|------------|
| TMDB slug ≠ catalog slug | Map by `provider_id` (research R2) |
| Hydration mismatch | Load prefs only after mount in hook |
| Stale search after profile edit | Custom event + hook subscription |

## Complexity Tracking

> No constitution violations.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Generated Artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Quickstart | [quickstart.md](./quickstart.md) |
| Contracts | [contracts/](./contracts/) |

**Next command**: `/speckit-tasks` (or `/speckit-implement` after tasks)
