# Quickstart: Mis plataformas (dev validation)

**Feature**: `001-mis-plataformas`

## Prerequisites

```bash
cd src
npm install
# .env.local with TMDB_API_KEY
npm run dev
```

App: http://localhost:3000 (or next available port).

## Manual test script

### 1. Configuration (US1)

1. Open `/profile`.
2. Confirm no platforms pre-selected (or clear `localStorage` key `peligo_user_platforms` in DevTools).
3. Select Netflix + Disney+.
4. Reload page → selection persists.
5. Deselect Netflix → only Disney+ remains after reload.

### 2. Title detail (US2)

1. With Netflix selected, search a title known on Netflix in AR (e.g. popular series).
2. Open title detail.
3. Expect **“En tus plataformas”** with Netflix if TMDB maps correctly.
4. Expect **“Otras opciones en Argentina”** collapsed if other providers exist.
5. Clear all platforms in profile → detail shows flat list + CTA to configure.

### 3. Search (US3 / P2)

1. With Disney+ selected, search title on Disney+.
2. Result card shows **“En tu plataforma”** (or highlighted Disney+ badge).
3. Change selection in profile → return to search → indicators update.

### 4. Edge cases

| Case | Expected |
|------|----------|
| `localStorage` cleared | No crash; behaves as legacy |
| Title only on non-user platforms | Honest “not on your platforms” + expand others |
| TMDB provider unmapped | Appears under “otras”, never under “tus” |

## DevTools

```javascript
// Read selection
JSON.parse(localStorage.getItem('peligo_user_platforms') || '[]')

// Reset
localStorage.removeItem('peligo_user_platforms')
```

## Lint

```bash
cd src && npm run lint
```

## Files touched (implementation reference)

| File | Purpose |
|------|---------|
| `src/src/lib/user-platforms.ts` | Storage, hook, partition, TMDB map |
| `src/src/lib/tmdb.ts` | `providerId` on normalize (optional field) |
| `src/src/app/profile/page.tsx` | Wire persistence |
| `src/src/app/title/[id]/TitleDetailClient.tsx` | Sectioned availability |
| `src/src/app/search/page.tsx` | P2 badges |
| `src/src/lib/mock-data.ts` | Re-export catalog or remove duplicate |
