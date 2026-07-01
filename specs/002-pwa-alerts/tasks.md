---
description: "Task list for Alertas PWA feature implementation"
---

# Tasks: PWA availability alerts

**Input**: Design documents from `specs/002-pwa-alerts/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, feature **001-mis-plataformas** deployed

**Tests**: Manual validation per quickstart.md

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

**Purpose**: Confirm contracts and the dependency on mis plataformas (001)

- [x] T001 Review contracts in `specs/002-pwa-alerts/contracts/` (storage, checker, notifications, UI)
- [x] T002 Verify feature 001 is available: `getUserPlatformSlugs`, `hasMatchOnUserPlatforms` in `src/src/lib/user-platforms.ts` and `src/src/lib/platform-match.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core lib modules — MUST complete before user story UI

**⚠️ CRITICAL**: No user story work until this phase is complete

**Independent Test**: In DevTools, call storage helpers after importing from client module; create mock alert in `peligo_alerts` and read back.

- [x] T003 Create `src/src/lib/alerts.ts` with `StoredAlert`, `AlertEvent`, CRUD, `MAX_ACTIVE_ALERTS=3`, dedupe by `titleId`, `peligo:alerts-changed` event per `specs/002-pwa-alerts/contracts/alerts-storage.md`
- [x] T004 [P] Create `src/src/lib/notifications.ts` with `getNotificationSupport`, `requestNotificationPermission`, `showAlertNotification` (tag dedupe) per `specs/002-pwa-alerts/contracts/notifications-permission.md`
- [x] T005 Create `src/src/lib/alert-checker.ts` with `checkSingleAlert`, `runAlertChecks` (stagger 300ms, max 5/run, false→true transition) per `specs/002-pwa-alerts/contracts/alert-check-engine.md`
- [x] T006 [P] Add `useAlerts()` hook in `src/src/lib/alerts.ts` (or `src/src/lib/use-alerts.ts`) with SSR-safe hydration and subscribe pattern mirroring `use-user-platforms.ts`

**Checkpoint**: Foundation ready — user story phases can begin

---

## Phase 3: User Story 1 — Create alert from title (Priority: P1) 🎯 MVP entry

**Goal**: Working CTA on the detail page; save the alert on the device with validations

**Independent Test**: No match on mis plataformas → create alert → it appears in the `localStorage` key `peligo_alerts`; blocks if already available or with no configured platforms

### Implementation for User Story 1

- [x] T007 [US1] Implement `canCreateAlert(titleId, platforms, userSlugs)` guards in `src/src/lib/alerts.ts` (no platforms, already on user platforms, duplicate, limit 3)
- [x] T008 [US1] Wire create-alert handler in `src/src/app/title/[id]/TitleDetailClient.tsx` — label “Avisame cuando esté en mis plataformas” per `specs/002-pwa-alerts/contracts/ui-alerts.md`
- [x] T009 [US1] Show states in `TitleDetailClient.tsx`: disabled + link to `/profile` if no platforms; “Ya está en tus plataformas” if match; “Alerta activa” if exists
- [x] T010 [US1] On successful create, persist snapshot `lastHadMatchOnUserPlatforms` from current availability in `src/src/lib/alerts.ts`

**Checkpoint**: US1 complete — alerts creatable from title detail

---

## Phase 4: User Story 2 — Notification permission (Priority: P1)

**Goal**: Request contextual permission; degrade to in-app if denied

**Independent Test**: Create alert → permission prompt → grant/deny → alert still saved; granted path can show test notification via dev helper

### Implementation for User Story 2

- [x] T011 [US2] After create in `TitleDetailClient.tsx`, call `requestNotificationPermission()` with voseo explainer copy before or after save
- [x] T012 [US2] Show inline feedback in `TitleDetailClient.tsx`: granted vs denied toasts (“Alerta guardada…”) per spec FR-007
- [x] T013 [US2] On `showAlertNotification` trigger path in `src/src/lib/alert-checker.ts`, no-op gracefully when permission not granted (no silent errors)

**Checkpoint**: US2 complete — permission flow integrated

---

## Phase 5: User Story 3 — View and manage my alerts (Priority: P1)

**Goal**: `/alerts` screen with list, delete, in-app events, and links from the profile

**Independent Test**: Open `/alerts`, see active alerts, delete one, reload — gone; profile “Alertas” navigates here

### Implementation for User Story 3

- [x] T014 [US3] Create `src/src/app/alerts/page.tsx` — list alerts, status badges, delete, empty state, voseo copy per `specs/002-pwa-alerts/contracts/ui-alerts.md`
- [x] T015 [US3] Add “Avisos recientes” section in `src/src/app/alerts/page.tsx` using `getAlertEvents()` / mark read
- [x] T016 [US3] Update `src/src/app/profile/page.tsx` — menu “Alertas” `href: "/alerts"`, dynamic badge from `getUnreadEventCount()` (replace hardcoded `"3"`)
- [x] T017 [P] [US3] Link home bell in `src/src/app/HomeClient.tsx` to `/alerts` (optional polish in same story)

**Checkpoint**: US3 complete — full alerts management UI

---

## Phase 6: User Story 4 — Fire alert on availability change (Priority: P2)

**Goal**: Checker in the layout detects the transition and fires a notification + in-app event

**Independent Test**: DevTools reset `lastHadMatchOnUserPlatforms` → reload app → alert becomes triggered + event/notification

### Implementation for User Story 4

- [x] T018 [US4] Create `src/src/components/AlertChecker.tsx` — run `runAlertChecks` on mount, `visibilitychange` visible, 6h interval while mounted
- [x] T019 [US4] Mount `AlertChecker` in `src/src/app/layout.tsx` (client wrapper; no UI)
- [x] T020 [US4] On trigger in `src/src/lib/alert-checker.ts`, call `addAlertEvent`, `showAlertNotification` with platform names from `partitionPlatforms(...).mine`
- [x] T021 [US4] Notification click navigates to `/title/{titleId}` in `src/src/lib/notifications.ts` (focus + `window.location` or router event)

**Checkpoint**: US4 complete — end-to-end alert firing

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Lint, QA, edge-case copy

- [x] T022 [P] Run `cd src && npm run lint` and fix touched files
- [x] T023 Execute manual checklist in `specs/002-pwa-alerts/quickstart.md` (all user stories + limit/duplicate/offline notes)
- [x] T024 [P] Add permission-denied / unsupported banner on `src/src/app/alerts/page.tsx` for iOS/Safari limitations (honest copy, no false push promises)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup + 001 — **BLOCKS** all user stories
- **US1 (Phase 3)**: Depends on T003–T006
- **US2 (Phase 4)**: Depends on T004 + US1 create flow (T008–T010)
- **US3 (Phase 5)**: Depends on T003 (storage); can parallel US2 after US1
- **US4 (Phase 6)**: Depends on T005 + T004 + alerts with active status
- **Polish (Phase 7)**: After desired stories complete

### User Story Dependencies

```text
Phase 2 (Foundation)
    ├── US1 Create from title (P1)
    ├── US2 Permission (P1) — after US1 create wired
    ├── US3 /alerts UI (P1) — parallel after Phase 2
    └── US4 Checker (P2) — after US1+storage; best after US3 for QA
```

### Parallel Opportunities

- **Phase 2**: T004 ∥ T006 after T003 started; T005 after T003
- **After US1**: US3 (`alerts/page.tsx`) ∥ US2 permission polish (different files)
- **Phase 7**: T022 ∥ T024

---

## Parallel Example: Foundation

```bash
T003 alerts.ts (core)
T004 notifications.ts  # parallel
T006 useAlerts hook     # parallel after T003 skeleton
T005 alert-checker.ts   # after T003
```

---

## Parallel Example: After US1

```bash
# Developer A:
T011–T013  permission flow (TitleDetailClient)

# Developer B:
T014–T016  alerts page + profile link
```

---

## Implementation Strategy

### MVP First (US1 + US3 minimal)

1. Phase 1–2
2. Phase 3 (US1) — create + persist
3. Phase 5 (US3) — list/delete only
4. **VALIDATE**: Create alert → see in `/alerts` → delete

### Recommended P1 delivery (US1 + US2 + US3)

1. Add Phase 4 permission flow
2. Ship without background checker (US4) — alerts saved but manual check only

### Full feature (all stories)

1. Phase 6 (US4) checker + notifications on trigger
2. Phase 7 polish + quickstart QA

---

## Notes

- Constitution v1.0.0: no NestJS, no VAPID, honest AR data
- Checker runs client-side only; no real-time push with app closed for days
- Reuse `fetchTitle` from `src/src/lib/api.ts` — no new API routes
