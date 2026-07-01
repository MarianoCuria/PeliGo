# Contract: Alerts UI

**Version**: 1.0.0

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/alerts` | `src/src/app/alerts/page.tsx` | Mis alertas list + unread events |
| Title detail | `TitleDetailClient.tsx` | Create alert CTA |
| Profile | `profile/page.tsx` | Link “Alertas” → `/alerts`, badge = unread count |

## Title detail CTA

- Label: **“Avisame cuando esté en mis plataformas”**
- Disabled + tooltip if: no user platforms → link to `/profile`
- Disabled if: already on user platforms → message “Ya está en tus plataformas”
- If alert exists for title: show “Alerta activa” + link to `/alerts`
- On success: optional permission prompt, then a confirmation toast

## Alerts page

Sections:

1. **Avisos recientes** (unread `AlertEvent` items)
2. **Mis alertas** — cards with poster, title, status badge, delete button
3. Empty state: voseo + CTA buscar / ir a tendencias
4. Permission banner if denied: explain in-app-only mode

## Layout integration

- `src/src/components/AlertChecker.tsx` — client-only, mounted in `layout.tsx` inside body (no UI).
- Home bell button → `/alerts` (optional P2)

## Copy (voseo)

- Permission: “¿Querés que te avisemos cuando esté en tus plataformas?”
- Limit: “Tenés el máximo de 3 alertas activas. Eliminá una para agregar otra.”
