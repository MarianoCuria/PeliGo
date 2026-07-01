# Contract: Browser notifications (client)

**Version**: 1.0.0  
**Module**: `src/src/lib/notifications.ts`

## API

```typescript
export type NotificationSupport = "supported" | "unsupported";

export function getNotificationSupport(): NotificationSupport;
export function getPermission(): NotificationPermission | "unsupported";
export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported">;
export function showAlertNotification(params: {
  alertId: string;
  title: string;
  body: string;
  url: string; // /title/{titleId}
}): void;
```

## Rules

1. `showAlertNotification` no-ops if permission !== `"granted"` or API unsupported.
2. Use `tag: params.alertId` to replace duplicate notifications.
3. `onclick` / `data.url` → focus window and navigate to title (best-effort in MVP).
4. Icon: `/icon-192.png` from manifest.
5. Copy voseo in `body` templates, e.g. `Ya está en Netflix en tus plataformas`.

## UX contract

- Request permission **after** user taps create alert (contextual), not on first page load.
- If denied, show toast: “Alerta guardada. Te avisamos acá cuando esté disponible.”
