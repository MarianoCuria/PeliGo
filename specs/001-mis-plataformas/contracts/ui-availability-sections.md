# Contract: Title detail availability UI

**Version**: 1.0.0  
**Component**: `src/src/app/title/[id]/TitleDetailClient.tsx`

## Modes

| Mode | Condition | UI |
|------|-----------|-----|
| `legacy` | `userSlugs.length === 0` | Current flat list + optional CTA link to `/profile` |
| `personalized` | `userSlugs.length > 0` | Sectioned layout below |

## Personalized layout

### Section A — “En tus plataformas”

- Visible when `mine.length > 0`.
- Lists all platforms in `mine` with existing row UI (logo, name, type, price, CTA).
- Always expanded.

### Section B — Empty mine message

- Visible when `mine.length === 0` && `other.length > 0`.
- Copy (voseo): e.g. “No está en tus plataformas” + short hint to expand the “Otras opciones en Argentina” section.

### Section C — “Otras opciones en Argentina”

- Visible when `other.length > 0`.
- **Collapsed by default** when `mine.length > 0`.
- **Expanded by default** when `mine.length === 0` && `other.length > 0` (user must see how to watch).
- Toggle: chevron / button; accessible `aria-expanded`.

### Section D — No availability in AR

- Unchanged from current empty state when `platforms.length === 0`.

## Copy requirements (voseo)

- Section titles and CTAs MUST use voseo.
- Do not claim “gratis” unless `type === stream` and data supports it.

## Search results (P2)

**Component**: `src/src/app/search/page.tsx`

- If `partitionPlatforms(title.platforms, userSlugs).mine.length > 0`:
  - Show badge: **“En tu plataforma”** (or similar) on card.
  - Render platform badges: mine slugs first, then others, `slice(0, 3)` total unchanged.
