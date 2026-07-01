# Contract: Alert check engine

**Version**: 1.0.0  
**Module**: `src/src/lib/alert-checker.ts`

## Purpose

Periodically (and on demand) re-fetch availability for **active** alerts and detect `lastHadMatchOnUserPlatforms: false` → current match **true**.

## Input / output

```typescript
export interface CheckResult {
  alertId: string;
  triggered: boolean;
  error?: string;
}

export async function checkSingleAlert(
  alert: StoredAlert,
  userSlugs: string[]
): Promise<CheckResult>;

export async function runAlertChecks(options?: {
  maxAlerts?: number; // default 5 per run
  delayMs?: number;  // stagger between TMDB calls, default 300
}): Promise<CheckResult[]>;
```

## Algorithm (per alert)

1. Load `userSlugs` from `getUserPlatformSlugs()`; if empty, skip.
2. `fetchTitle(alert.tmdbId, alert.type)` via existing `src/src/lib/api.ts`.
3. On fetch error → skip update (do not trigger); log for dev.
4. `nowMatch = hasMatchOnUserPlatforms(title.platforms, userSlugs)`.
5. If `!alert.lastHadMatchOnUserPlatforms && nowMatch`:
   - Set `status: "triggered"`, `triggeredAt`, `triggeredPlatformNames` from `partitionPlatforms(...).mine`.
   - `addAlertEvent` + call `showAlertNotification` if allowed.
   - Set `lastNotifiedAt` if notification shown.
6. Else: update `lastHadMatchOnUserPlatforms = nowMatch`, `lastCheckedAt = now`.

## Dedupe notification

- Do not show native notification if `lastNotifiedAt` within same calendar day for same alert (optional) OR use `Notification` `tag: alert.id` (preferred).

## Rate limiting

- Max 5 alerts checked per `runAlertChecks` invocation; oldest `lastCheckedAt` first.
- Minimum 300ms between TMDB fetches.

## Trigger sites

- `AlertChecker` component: mount, visibility visible, interval 6h while mounted.
