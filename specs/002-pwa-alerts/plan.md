# Implementation Plan: PWA availability alerts

**Branch**: `002-pwa-alerts` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-pwa-alerts/spec.md` — Next.js in `src/`, localStorage + Web Notifications API, integration with mis plataformas (001). No NestJS in the MVP.

## Summary

Allow **creating alerts** from the detail page when a title is not on **my platforms**, persist them on the device, list them in **/alerts**, and **check availability** while using the app to detect the moment the title appears in AR on one of the user's platforms. Native notification via the **Notifications API** (no push server); in-app center if permission is denied. Depends on feature **001** for slugs and matching.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16.1.6 (App Router)

**Primary Dependencies**: Next.js, Tailwind 4, lucide-react, TMDB via `fetchTitle` / `src/src/lib/api.ts`, `platform-match` + `user-platforms` (001)

**Storage**: `localStorage` — `peligo_alerts`, `peligo_alert_events`; reads `peligo_user_platforms`

**Testing**: Manual per [quickstart.md](./quickstart.md)

**Target Platform**: Mobile-first PWA (browser); `manifest.json` exists; **no service worker in MVP**

**Project Type**: Web application under `src/`

**Performance Goals**: ≤5 TMDB fetches per check run with 300ms stagger; checker idle when no active alerts

**Constraints**: No NestJS/Prisma/Redis/VAPID; no new npm deps unless unavoidable; voseo; constitution v1.0.0; MAX_ACTIVE_ALERTS = 3

**Scale/Scope**: ~8–10 files; 1 new route `/alerts`; layout mount for checker

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Reference: `.specify/memory/constitution.md` (v1.0.0)

| Gate | Status | Notes |
|------|--------|-------|
| **AR-first** | ✅ Pass | Checks use existing AR availability pipeline |
| **Data trust** | ✅ Pass | Trigger only on TMDB fetch success; do not invent a match |
| **Mobile speed** | ✅ Pass | Staggered checks; no blocking UI |
| **YAGNI** | ✅ Pass | No backend; local Notifications only |
| **Brand/UX** | ✅ Pass | voseo; Bell/alert patterns |
| **Spec workflow** | ✅ Pass | `specs/002-pwa-alerts/` |
| **Priority fit** | ✅ Pass | P1 retention (F13–F15 backlog) |

**Post-design re-check**: ✅ All gates pass. Research confirms NestJS **not** required for MVP.

## Project Structure

### Documentation (this feature)

```text
specs/002-pwa-alerts/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── alerts-storage.md
│   ├── alert-check-engine.md
│   ├── notifications-permission.md
│   └── ui-alerts.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks (next)
```

### Source Code

```text
src/
└── src/
    ├── app/
    │   ├── layout.tsx                 # mount AlertChecker
    │   ├── alerts/page.tsx            # NEW — Mis alertas
    │   ├── profile/page.tsx           # link /alerts, badge
    │   └── title/[id]/TitleDetailClient.tsx  # CTA create alert
    ├── components/
    │   └── AlertChecker.tsx           # NEW — visibility + interval checks
    └── lib/
        ├── alerts.ts                  # NEW — storage
        ├── alert-checker.ts           # NEW — TMDB + trigger logic
        ├── notifications.ts         # NEW — permission + show
        ├── platform-match.ts        # (001) hasMatchOnUserPlatforms
        └── user-platforms.ts        # (001) getUserPlatformSlugs
```

**Structure Decision**: All alert logic client-side in `src/src/lib`; no new API routes required (reuse `fetchTitle` client → `/api/title/...`).

## Implementation Phases

### Phase A — Foundation (blocking)

1. `alerts.ts` — types, CRUD, events, subscribe, limits, dedupe
2. `notifications.ts` — permission + `showAlertNotification`
3. `alert-checker.ts` — `runAlertChecks` with stagger + transition detection

### Phase B — US1 + US2 (P1) Create + permission

4. Wire `TitleDetailClient` CTA (replace “otra plataforma” copy)
5. Permission prompt on create; toasts / states
6. `canCreateAlert` guards (platforms, already available, limit, duplicate)

### Phase C — US3 (P1) Mis alertas UI

7. `app/alerts/page.tsx` — list, delete, events, empty states
8. `profile/page.tsx` — `href: "/alerts"`, dynamic badge from unread events
9. Optional: home Bell → `/alerts`

### Phase D — US4 (P2) Checker + trigger

10. `AlertChecker.tsx` — mount in layout; visibility + 6h interval
11. Notification `tag` dedupe; navigate on click
12. Manual QA + quickstart dev simulation

### Phase E — Polish

13. `npm run lint`
14. Document honest copy if iOS/Safari limited

## Risk Register

| Risk | Mitigation |
|------|------------|
| TMDB rate limits | Max 5 checks/run, 300ms delay |
| No push when app closed days | Honest copy in spec + alerts page |
| iOS notification limits | In-app events fallback |
| False trigger on bad TMDB data | Require successful fetch; snapshot transition |

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

**Next command**: `/speckit-tasks`
