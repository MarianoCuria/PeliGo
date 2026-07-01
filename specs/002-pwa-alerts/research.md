# Research: PWA availability alerts

**Feature**: `002-pwa-alerts`  
**Date**: 2026-06-02

## R1: Persistence without a backend

**Decision**: `localStorage` key `peligo_alerts` — JSON array of alert records; mirror pattern from `peligo_favorites` and `peligo_user_platforms`.

**Rationale**: Spec FR-003/FR-014; no accounts; same-device MVP.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| IndexedDB | Overkill for &lt;10 small records |
| Backend + Web Push (VAPID) | Out of MVP scope; requires server and subscription storage |
| sessionStorage | Does not survive reload |

## R2: Detecting "arrived on my platforms"

**Decision**: Client-side checker compares **current** availability (TMDB AR via existing `fetchTitle`) with a per-alert snapshot `lastHadMatchOnUserPlatforms: boolean`. Trigger only on transition `false → true` using `hasMatchOnUserPlatforms` + current `getUserPlatformSlugs()` from feature 001.

**Rationale**: Matches FR-009; reuses proven partition logic; evaluates against **current** user platform selection per spec edge case.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Server cron every 6h | Violates MVP no-backend |
| Poll TMDB on interval without snapshot | Cannot detect transition; would fire immediately or never correctly |
| Alert on any platform in AR | Violates spec (only “mis plataformas”) |

## R3: When to run the checker (MVP)

**Decision**:

1. On app load / route change (client layout mount).
2. On `document.visibilitychange` → `visible`.
3. Optional interval while app is focused: every **6 hours** (config constant), max **5** active alerts checked per run with staggered delay to respect TMDB.

**Rationale**: Honest MVP per spec assumption ("when reopening the PWA"); no false promise of 24/7 push without server.

**Alternatives considered**:

| Alternative | Rejected for MVP |
|-------------|------------------|
| Service Worker `periodicSync` | Limited browser support; add in Phase 2 enhancement |
| Push from server | Requires backend |

**Phase 2 enhancement (documented, not MVP)**: Minimal `public/sw.js` + registration for periodic background check when installed PWA on Chromium.

## R4: Native notifications

**Decision**: Browser **Notifications API** only — `Notification.requestPermission()` + `new Notification(title, { body, icon, tag, data })`. No Web Push protocol (no VAPID, no push subscription).

**Rationale**: Works when PeliGo triggers notification **from an open or recently active** client session after check; satisfies FR-006 without server. `tag` per alert id prevents duplicate banners (FR / SC-005).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Web Push + service worker push event | Needs backend to send payloads |
| Email (Resend) | Out of scope |

**iOS/Safari**: Degrade to in-app only; detect `!("Notification" in window)` or permission `denied` and show copy in UI.

## R5: In-app center

**Decision**: New route `/alerts` (“Mis alertas”) + in-app feed `peligo_alert_events` (last N events in localStorage) for users who deny push.

**Rationale**: FR-007; profile menu already has “Alertas” placeholder (`href: "#"`).

## R6: Limit and duplicates

**Decision**: `MAX_ACTIVE_ALERTS = 3`; dedupe by `titleId` (e.g. `m-550`).

**Rationale**: Spec FR-011/FR-012; pitch free tier.

## R7: Detail page integration

**Decision**: Replace placeholder button copy in `TitleDetailClient` with working CTA: “Avisame cuando esté en mis plataformas”; disable if already on user platforms or alert exists.

**Rationale**: Spec assumption; button already exists with Bell icon.

## R8: PWA manifest

**Decision**: Reuse existing `public/manifest.json`; no new deps. Optional later: register SW in separate spec slice.

**Rationale**: Constitution YAGNI; manifest already linked in layout metadata.
