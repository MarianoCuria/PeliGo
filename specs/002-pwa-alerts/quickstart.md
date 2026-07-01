# Quickstart: PWA Alerts

**Feature**: `002-pwa-alerts`

## Prerequisites

```bash
cd src
npm install
# TMDB_API_KEY in .env.local
npm run dev
```

Configure **Mis plataformas** in `/profile` first (feature 001).

## Manual test script

### 1. Permission + create (US1, US2)

1. Open a title **not** on your platforms (search something niche).
2. Tap **“Avisame cuando esté en mis plataformas”**.
3. Accept browser notification permission (or deny to test in-app-only).
4. Confirm toast / state “Alerta activa”.
5. Open `/alerts` — alert listed as **Activa**.

### 2. Blocks (US1)

- Try create without platforms configured → redirect message to profile.
- Try create on title already on your Netflix → blocked message.
- Create 3 alerts, 4th → limit message.

### 3. Trigger (US4) — dev simulation

In DevTools console:

```javascript
// Force snapshot as "no match" then reload after title is on your platform
const alerts = JSON.parse(localStorage.getItem('peligo_alerts')||'[]');
if (alerts[0]) { alerts[0].lastHadMatchOnUserPlatforms = false; alerts[0].status = 'active'; }
localStorage.setItem('peligo_alerts', JSON.stringify(alerts));
```

Reload app or switch tab away/back — checker runs → expect **Disparada** + notification (if granted).

### 4. Delete (US3)

Delete alert from `/alerts` → gone after reload; no new checks for that title.

### 5. Notification click

Click native notification → opens `/title/{id}`.

## Lint

```bash
cd src && npm run lint
```

## Files (implementation reference)

| File | Role |
|------|------|
| `src/src/lib/alerts.ts` | Storage CRUD |
| `src/src/lib/alert-checker.ts` | TMDB check + trigger |
| `src/src/lib/notifications.ts` | Permission + Notification |
| `src/src/components/AlertChecker.tsx` | Background runner |
| `src/src/app/alerts/page.tsx` | UI list |
| `src/src/app/title/[id]/TitleDetailClient.tsx` | CTA |
| `src/src/app/layout.tsx` | Mount AlertChecker |
| `src/src/app/profile/page.tsx` | Link + badge |
