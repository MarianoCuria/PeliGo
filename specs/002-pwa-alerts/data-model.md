# Data Model: PWA Alerts

**Feature**: `002-pwa-alerts`  
**Date**: 2026-06-02

## Storage keys

| Key | Content |
|-----|---------|
| `peligo_alerts` | `StoredAlert[]` |
| `peligo_alert_events` | `AlertEvent[]` (in-app feed, max 20) |
| `peligo_notification_permission` | `"default" \| "granted" \| "denied" \| "unsupported"` (cache of last known) |

Uses existing `peligo_user_platforms` from feature 001 for evaluation slugs.

## Entities

### StoredAlert

| Field | Type | Rules |
|-------|------|--------|
| `id` | `string` | UUID or `alert-{titleId}` |
| `titleId` | `string` | PeliGo id `m-{tmdbId}` / `t-{tmdbId}`; unique among active |
| `tmdbId` | `number` | |
| `type` | `"movie" \| "series"` | |
| `title` | `string` | Display name snapshot |
| `posterPath` | `string` | For list UI |
| `status` | `"active" \| "triggered"` | |
| `createdAt` | `number` | Unix ms |
| `lastCheckedAt` | `number?` | Unix ms |
| `lastHadMatchOnUserPlatforms` | `boolean` | Snapshot at last check |
| `triggeredAt` | `number?` | When transition detected |
| `triggeredPlatformNames` | `string[]?` | Human-readable at trigger |
| `lastNotifiedAt` | `number?` | Dedupe native notifications |

**State transitions**:

```text
[create] → active (lastHadMatch = current match at create time, usually false)
active + check: still no match → active (update lastCheckedAt)
active + check: false→true match → triggered (+ event + optional Notification)
triggered → (no auto revert; user may delete)
[delete] → removed from array
```

### AlertEvent (in-app)

| Field | Type |
|-------|------|
| `id` | `string` |
| `alertId` | `string` |
| `titleId` | `string` |
| `title` | `string` |
| `message` | `string` | e.g. "Ya está en Netflix" |
| `createdAt` | `number` |
| `read` | `boolean` |

### NotificationPermissionState (derived)

Not persisted as source of truth — read from `Notification.permission` when API exists; cache in `peligo_notification_permission` for UI hints only.

## Relationships

```text
UserPlatformSlugs (001) ──used at check time──▶ StoredAlert evaluation
StoredAlert ──1:N──▶ AlertEvent (on trigger)
StoredAlert ──0:1──▶ Native Notification (if granted)
```

## Validation rules

- Cannot create alert if `getUserPlatformSlugs().length === 0`.
- Cannot create if `hasMatchOnUserPlatforms(title.platforms, slugs)` at create time.
- Cannot exceed `MAX_ACTIVE_ALERTS` (3) with `status === "active"`.
- One alert per `titleId` max.

## Dependencies on 001

- `getUserPlatformSlugs`, `hasMatchOnUserPlatforms`, `partitionPlatforms` from `platform-match.ts` / `user-platforms.ts`.
