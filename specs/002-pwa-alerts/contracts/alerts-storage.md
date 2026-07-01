# Contract: Alerts storage (client)

**Version**: 1.0.0  
**Module**: `src/src/lib/alerts.ts`

## Constants

- `STORAGE_KEY = "peligo_alerts"`
- `EVENTS_KEY = "peligo_alert_events"`
- `MAX_ACTIVE_ALERTS = 3`
- `MAX_EVENTS = 20`

## Types

```typescript
export type AlertStatus = "active" | "triggered";

export interface StoredAlert {
  id: string;
  titleId: string;
  tmdbId: number;
  type: "movie" | "series";
  title: string;
  posterPath: string;
  status: AlertStatus;
  createdAt: number;
  lastCheckedAt?: number;
  lastHadMatchOnUserPlatforms: boolean;
  triggeredAt?: number;
  triggeredPlatformNames?: string[];
  lastNotifiedAt?: number;
}

export interface AlertEvent {
  id: string;
  alertId: string;
  titleId: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}
```

## API

```typescript
export function getAlerts(): StoredAlert[];
export function getActiveAlerts(): StoredAlert[];
export function getAlertByTitleId(titleId: string): StoredAlert | undefined;
export function canCreateAlert(titleId: string): { ok: boolean; reason?: string };
export function createAlert(input: Omit<StoredAlert, "id" | "status" | "createdAt"> & Partial<...>): StoredAlert | null;
export function deleteAlert(id: string): void;
export function updateAlert(id: string, patch: Partial<StoredAlert>): void;

export function getAlertEvents(): AlertEvent[];
export function addAlertEvent(event: Omit<AlertEvent, "id" | "read">): void;
export function markEventRead(id: string): void;
export function getUnreadEventCount(): number;

export function subscribeAlerts(listener: () => void): () => void;
```

## Events

- Dispatch `peligo:alerts-changed` on any mutation (mirror user-platforms pattern).

## Invariants

- SSR-safe: all reads return `[]` on server.
- `createAlert` returns `null` with reason encoded in `canCreateAlert` when blocked.
