# PeliGo — Complete UI/UX Mockups

## Design Principles

1. **Mobile-first:** Every screen is designed first for 375px, then adapted.
2. **Minimum noise:** Every element has a purpose. If it doesn't add value, it doesn't go in.
3. **Direct action:** The user must reach their answer in ≤ 3 taps.
4. **Consistency:** Same patterns across the whole app. The user learns once.
5. **Constant feedback:** Every action has an immediate visual response.

---

## Global Navigation

### Bottom Navigation Bar (Mobile)

```
┌─────────────────────────────────────────────┐
│  🏠 Home    🔥 Trends    ❤️ Favs    👤 Profile │
│                                             │
│  Estilo: Ícono + label 11px                 │
│  Activo: ícono rojo + label rojo            │
│  Inactivo: ícono gris + label gris          │
│  Background: #0D0D0D con border-top #2D2D44 │
│  Altura: 60px + safe area bottom            │
└─────────────────────────────────────────────┘
```

### Tabs (4 items):
1. **Home** — Central search + suggestions
2. **Tendencias** (Trending) — Most watched in Argentina
3. **Favoritos** (Favorites) — Watchlist + tracking
4. **Perfil** (Profile) — Settings, alerts, account

### Desktop Navigation
- Horizontal top bar with logo on the left, centered search bar, actions on the right.
- Optional collapsible sidebar for favorites.

---

## Screen 1: Onboarding (3 slides)

### Slide 1 — "Encontrá dónde verlo"
```
┌─────────────────────────┐
│                         │
│    [Ilustración:        │
│     Persona con celular │
│     + íconos streaming  │
│     flotando]           │
│                         │
│  ──────────────────     │
│                         │
│   Encontrá dónde        │
│   verlo                 │
│                         │
│   Buscá cualquier peli  │
│   o serie y sabé al     │
│   toque en qué          │
│   plataforma está.      │
│                         │
│         ● ○ ○           │
│                         │
│   [ Siguiente →  ]      │
│   Saltar                │
└─────────────────────────┘
```

### Slide 2 — "Alertas personalizadas"
```
┌─────────────────────────┐
│                         │
│    [Ilustración:        │
│     Campana con          │
│     notificación +      │
│     poster película]    │
│                         │
│  ──────────────────     │
│                         │
│   No te pierdas nada    │
│                         │
│   Configurá alertas     │
│   cuando un título      │
│   llegue a tu           │
│   plataforma favorita.  │
│                         │
│         ○ ● ○           │
│                         │
│   [ Siguiente →  ]      │
│   Saltar                │
└─────────────────────────┘
```

### Slide 3 — "Empezá ahora"
```
┌─────────────────────────┐
│                         │
│    [Ilustración:        │
│     Logo PeliGo grande  │
│     con glow]           │
│                         │
│  ──────────────────     │
│                         │
│   Listo para buscar     │
│                         │
│   Creá tu cuenta gratis │
│   o empezá a buscar     │
│   directamente.         │
│                         │
│         ○ ○ ●           │
│                         │
│   [ Crear cuenta ]      │
│   [ Explorar sin cuenta]│
└─────────────────────────┘
```

**Specifications:**
- Illustrations: flat style, brand colors
- Transition between slides: horizontal swipe + fade
- Dot indicators: 8px, active `#E63946`, inactive `#2D2D44`
- Skip: ghost button at the top right
- Shown only the first time or after PWA installation

---

## Screen 2: Home (Central Search)

```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │ PeliGo [logo]    🔔    ⚙️   │ │  ← Header: Logo + Alerts + Settings
│ └─────────────────────────────┘ │
│                                 │
│  Buenos días, Martín 👋         │  ← Personalized greeting (if logged in)
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔍 ¿Qué querés ver hoy?    │ │  ← Prominent search bar
│ └─────────────────────────────┘ │
│                                 │
│  Búsquedas recientes            │  ← Section: chips with latest searches
│  [Breaking Bad] [Oppenheimer]   │
│  [The Bear]                     │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  🔥 Tendencias en Argentina    │  ← Section: horizontal carousel
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │poster│ │poster│ │poster│   │
│  │      │ │      │ │      │   │
│  │titulo│ │titulo│ │titulo│   │
│  │plat. │ │plat. │ │plat. │   │
│  └──────┘ └──────┘ └──────┘   │
│                    Ver todo →   │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  🆕 Recién llegados            │  ← Section: 2-column grid
│  ┌──────┐ ┌──────┐             │
│  │      │ │      │             │
│  └──────┘ └──────┘             │
│  ┌──────┐ ┌──────┐             │
│  │      │ │      │             │
│  └──────┘ └──────┘             │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏠     🔥     ❤️     👤     │ │  ← Bottom nav
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Home Specifications:**
- Search bar: height 52px, icon 20px, animated placeholder (typewriter: "Breaking Bad... Succession... Oppenheimer...")
- Greeting: uses the name if logged in, otherwise shows "¿Qué vas a ver hoy?"
- Trending carousel: horizontal scroll, snap to card, card width 140px
- New arrivals grid: 2 columns, gap 12px
- Pull to refresh enabled
- Skeleton loading in all sections

### Home Desktop
- Centered search bar, wider (600px max)
- Trending: carousel of 5-6 visible cards
- Grid: 4-6 columns
- Right sidebar: "Tu watchlist" (Your watchlist) if logged in

---

## Screen 3: Search Results

```
┌─────────────────────────────────┐
│ ← 🔍 [breaking bad          x] │  ← Active search with input
│                                 │
│  Filtros:                       │
│  [Películas] [Series] [Todas]   │  ← Tab filter
│                                 │
│  3 resultados                   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ┌──────┐                    │ │
│ │ │poster│  Breaking Bad      │ │
│ │ │      │  Serie · 2008-2013 │ │
│ │ │      │  ⭐ 9.5            │ │
│ │ │      │                    │ │
│ │ │      │  📺 Netflix        │ │
│ │ │      │  📺 Amazon Prime   │ │
│ │ └──────┘                    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ┌──────┐                    │ │
│ │ │poster│  El Camino:        │ │
│ │ │      │  A Breaking Bad... │ │
│ │ │      │  Película · 2019   │ │
│ │ │      │  ⭐ 7.0            │ │
│ │ │      │                    │ │
│ │ │      │  📺 Netflix        │ │
│ │ └──────┘                    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏠     🔥     ❤️     👤     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Results Specifications:**
- Layout: vertical list, horizontal card (poster + info)
- Poster: 80x120px, radius-md
- Platforms: 24px icons with name, vertical stack
- Availability: green chip "Stream", blue chip "Alquiler" (Rent), orange chip "Compra" (Buy)
- Quality badge: "4K", "HD", etc.
- Tap on a card → Detail screen
- No results: Illustration + "No encontramos eso. ¿Probás con otro nombre?"
- Autocomplete: dropdown below the search with suggestions while typing
- 300ms debounce on the input

---

## Screen 4: Title Detail

```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │        [Backdrop image      │ │  ← Backdrop image with gradient overlay
│ │         con gradient        │ │
│ │         oscuro abajo]       │ │
│ │                             │ │
│ │  ←  Back          ❤️  📤    │ │  ← Buttons over the backdrop
│ │                             │ │
│ │  Breaking Bad               │ │
│ │  ⭐ 9.5  ·  2008-2013      │ │
│ │  Serie · 5 temporadas       │ │
│ └─────────────────────────────┘ │
│                                 │
│  Géneros:                       │
│  [Drama] [Thriller] [Crimen]    │  ← Genre chips
│                                 │
│  ─── Dónde verlo ────────────   │  ← Main section
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📺 Netflix                  │ │
│ │ Stream · Incluido · HD/4K   │ │  ← Platform card
│ │               [ Ver ahora ] │ │  ← Deep link to the platform
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📺 Amazon Prime Video       │ │
│ │ Stream · Incluido · HD      │ │
│ │               [ Ver ahora ] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📺 Apple TV                 │ │
│ │ Compra · $2.499 · HD/4K    │ │
│ │               [ Ver ahora ] │ │
│ └─────────────────────────────┘ │
│                                 │
│  ─── Sinopsis ────────────────  │
│                                 │
│  Un profesor de química con     │
│  cáncer terminal se asocia     │
│  con un ex alumno para...      │
│  [Leer más]                     │
│                                 │
│  ─── Info ─────────────────── │
│                                 │
│  Director: Vince Gilligan       │
│  Reparto: Bryan Cranston,       │
│  Aaron Paul, Anna Gunn...       │
│                                 │
│  ─── Similares ───────────────  │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │      │ │      │ │      │   │  ← Horizontal carousel
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏠     🔥     ❤️     👤     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Detail Specifications:**
- Backdrop: aspect-ratio 16:9, gradient overlay from transparent to `#0D0D0D`
- Favorite button: heart bounce animation on activation
- "Dónde verlo" (Where to watch) section: ALWAYS at the top, it's the core of the app
- Platform cards: 32px logo + name + type + price + quality + CTA
- "Ver ahora" (Watch now) CTA: secondary button that opens the platform's deep link or URL
- Synopsis: truncated to 3 lines with "Leer más" (Read more)
- Similar: same cards as trending
- Share: native share API or modal with copy link
- Desktop: 2-column layout (poster left + info right), full-width backdrop

---

## Screen 5: Trending in Argentina

```
┌─────────────────────────────────┐
│  🔥 Tendencias                  │
│                                 │
│  [Hoy] [Esta semana] [Este mes]│  ← Time tabs
│                                 │
│  [Películas] [Series] [Todo]    │  ← Type tabs
│                                 │
│  1. ┌──────┐                    │
│     │poster│  Título 1          │
│     │      │  Plataforma · ⭐   │
│     └──────┘  🔥 +45% búsq.   │
│                                 │
│  2. ┌──────┐                    │
│     │poster│  Título 2          │
│     │      │  Plataforma · ⭐   │
│     └──────┘                    │
│                                 │
│  3. ┌──────┐                    │
│     │poster│  Título 3          │
│     │      │  Plataforma · ⭐   │
│     └──────┘                    │
│                                 │
│  ... (scroll infinito)          │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏠     🔥     ❤️     👤     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Trending Specifications:**
- Ranking number: large, in `#E63946`, Space Grotesk Bold 28px
- "Trending" badge: chip with a fire icon + percentage increase
- List: infinite scroll with lazy loading
- Skeleton: shimmer on each card while loading
- Pull to refresh
- Desktop: 3-column grid with larger cards

---

## Screen 6: User Profile

```
┌─────────────────────────────────┐
│  ← Mi Perfil                    │
│                                 │
│        ┌──────────┐             │
│        │  Avatar  │             │
│        │   M.R.   │             │  ← Initials or photo
│        └──────────┘             │
│        Martín Rodriguez         │
│        martin@email.com         │
│        [Editar perfil]          │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  📺 Mis plataformas             │  ← Configure which services the user has
│     Netflix ✓  Amazon ✓         │
│     Disney+ ✓  HBO Max ✗        │
│     [Editar]                    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  🔔 Alertas                  →  │
│  ❤️ Favoritos                →  │
│  🌙 Tema: Dark              →  │
│  🌐 Idioma: Español         →  │
│  📱 Instalar app            →  │  ← PWA install prompt
│  ❓ Ayuda                    →  │
│  🚪 Cerrar sesión              │
│                                 │
│  ─────────────────────────────  │
│  PeliGo v1.0.0                  │
│  Hecho con ❤️ en Argentina     │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏠     🔥     ❤️     👤     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Profile Specifications:**
- Avatar: 80x80px, radius-full, initials with a gradient background if there's no photo
- My platforms: Multiple selection of subscribed services (filters results)
- Options list: iOS-like style, with a right chevron
- Dark/light switch: inline toggle
- Language: ES/EN selector
- Install PWA: only visible if not installed (beforeinstallprompt API)

---

## Screen 7: Favorites / Watchlist

```
┌─────────────────────────────────┐
│  ❤️ Mi lista                    │
│                                 │
│  [Favoritos] [Por ver] [Vistos] │  ← Tabs
│                                 │
│  Ordenar: [Recientes ▼]        │
│                                 │
│  ┌──────┐ ┌──────┐             │
│  │poster│ │poster│             │
│  │      │ │      │             │
│  │titulo│ │titulo│             │
│  │❤️ 📺 │ │❤️ 📺 │             │
│  └──────┘ └──────┘             │
│  ┌──────┐ ┌──────┐             │
│  │poster│ │poster│             │
│  │      │ │      │             │
│  │titulo│ │titulo│             │
│  │❤️ 📺 │ │❤️ 📺 │             │
│  └──────┘ └──────┘             │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Estado vacío (si no hay):      │
│  [Ilustración corazón vacío]    │
│  "Todavía no agregaste nada"    │
│  "Buscá algo que te guste"      │
│  [Ir a buscar]                  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏠     🔥     ❤️     👤     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Favorites Specifications:**
- Tabs: Favoritos (❤️), Por ver (pending), Vistos (completed)
- Grid: 2 columns mobile, 4-6 desktop
- Swipe left on a card: delete with confirmation
- Long press: options (move to watched, delete, share)
- Card badge: icon of the platform where it's available
- Sort: recent, A-Z, rating, year
- Without an account: prompt to log in

---

## Screen 8: Configurable Alerts

```
┌─────────────────────────────────┐
│  ← 🔔 Mis Alertas              │
│                                 │
│  Alertas activas (3)            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Dune: Part Three             │ │
│ │ 🔔 Cuando esté en Netflix   │ │
│ │ Creada: 15 feb 2026          │ │
│ │                   [Eliminar] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ The Last of Us S3            │ │
│ │ 🔔 Cuando se estrene        │ │
│ │ Creada: 10 feb 2026          │ │
│ │                   [Eliminar] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Gladiator II                 │ │
│ │ 🔔 Cuando esté en streaming │ │
│ │ Creada: 1 feb 2026           │ │
│ │                   [Eliminar] │ │
│ └─────────────────────────────┘ │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Configuración                  │
│                                 │
│  Push notifications   [ON/OFF]  │
│  Email alerts         [ON/OFF]  │
│  Alertar solo en mis  [ON/OFF]  │
│  plataformas                    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏠     🔥     ❤️     👤     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Alerts Specifications:**
- Alert types: "Cuando se estrene" (When released), "Cuando esté en [plataforma]" (When on [platform]), "Cuando esté en streaming" (When on streaming)
- Created from the detail screen (🔔 "Crear alerta" / Create alert button)
- Push notification via Service Worker
- Alert creation modal: type selector + platform
- Premium: unlimited alerts. Free: maximum 3 active alerts.
- Swipe to delete on mobile

---

## Screen 9: Language Switch (ES/EN)

```
┌─────────────────────────────────┐
│  ← Idioma / Language            │
│                                 │
│  Seleccioná tu idioma           │
│  Select your language           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🇦🇷 Español (Argentina)  ✓ │ │  ← Active radio button
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🇺🇸 English               │ │
│ └─────────────────────────────┘ │
│                                 │
│  El cambio se aplica            │
│  inmediatamente.                │
│                                 │
└─────────────────────────────────┘
```

**Language Specifications:**
- Immediate change without reload (reactive i18n)
- Persisted in localStorage and the user account
- Default: detect from the browser, fallback ES-AR
- Movie titles are always shown in the original language + translation

---

## Desktop Variations

### Home Desktop (> 1024px)
```
┌───────────────────────────────────────────────────────────────┐
│  [Logo PeliGo]    [────── 🔍 Buscar ──────]    🔔  👤 Martín │
│───────────────────────────────────────────────────────────────│
│                                                               │
│              ¿Qué vas a ver hoy?                              │
│        [════════════════ 🔍 Buscá películas... ═══════]       │
│                                                               │
│  🔥 Tendencias en Argentina                        Ver todo → │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │        │ │        │ │        │ │        │ │        │     │
│  │        │ │        │ │        │ │        │ │        │     │
│  │        │ │        │ │        │ │        │ │        │     │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                               │
│  🆕 Recién llegados                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │        │ │        │ │        │ │        │ │        │     │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│  PeliGo · Hecho en Argentina · Términos · Privacidad         │
└───────────────────────────────────────────────────────────────┘
```

### Detail Desktop (> 1024px)
```
┌───────────────────────────────────────────────────────────────┐
│  [Nav bar]                                                    │
│───────────────────────────────────────────────────────────────│
│  ┌────────────────────────────────────────────────────────┐   │
│  │              [Backdrop full width con gradient]         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────┐   Breaking Bad                                  │
│  │          │   ⭐ 9.5 · Serie · 2008-2013 · 5 temporadas    │
│  │  Poster  │   [Drama] [Thriller] [Crimen]                   │
│  │          │                                                 │
│  │          │   ❤️ Favorito   🔔 Alerta   📤 Compartir       │
│  │          │                                                 │
│  │          │   ─── Dónde verlo ─────────────────             │
│  │          │   ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │          │   │ Netflix  │ │ Amazon   │ │ Apple TV │       │
│  │          │   │ Stream   │ │ Stream   │ │ Compra   │       │
│  │          │   │ HD/4K    │ │ HD       │ │ $2.499   │       │
│  └──────────┘   └──────────┘ └──────────┘ └──────────┘       │
│                                                               │
│  Sinopsis                         Info                        │
│  Un profesor de química...        Director: Vince Gilligan    │
│                                   Cast: Bryan Cranston...     │
│                                                               │
│  Similares                                                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                  │
└───────────────────────────────────────────────────────────────┘
```

---

## Micro-interactions & Animations

| Element                    | Animation                                          |
|----------------------------|----------------------------------------------------|
| Search bar focus           | Expands width 10%, border lights up in purple      |
| Typewriter placeholder     | Text changes every 3s with fade                     |
| Card tap                   | Scale 0.97 → 1, 150ms transition                   |
| Card hover (desktop)       | Elevation + subtle gradient border                  |
| Favorite toggle            | Heart: scale bounce 1→1.3→1 + fill color 300ms     |
| Result appears             | Staggered fade in, 50ms delay between items         |
| Pull to refresh            | Rotating spinner + elastic overscroll               |
| Tab switch                 | Animated underline slide to the active tab          |
| Modal open                 | Backdrop fade 200ms + modal slideUp 300ms           |
| Toast                      | SlideDown from top + auto-dismiss with progress bar |
| Skeleton loading           | Shimmer gradient loop 1.5s                          |
| Page transition            | Fade + horizontal/vertical slide depending on context|
| Platform card "Ver ahora"  | Ripple effect on tap                                |
| Detail backdrop scroll     | Subtle parallax on the backdrop (scroll 0.5x speed) |
| Bottom nav item select     | Icon scale bounce 150ms                             |

### Animation Principles:
1. **Duration:** 150-300ms for UI, never more than 500ms.
2. **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` as the default.
3. **Performance:** Only animate `transform` and `opacity` for 60fps.
4. **Reduced motion:** Disable everything except fades if `prefers-reduced-motion`.
5. **Purpose:** Every animation guides the user, it's not decorative.

---

## Responsive Breakpoints

| Breakpoint | Name     | Columns  | Main layout             |
|------------|----------|----------|-------------------------|
| 0-767px    | Mobile   | 4        | Vertical stack, bottom nav |
| 768-1023px | Tablet   | 8        | Wider grid, bottom nav  |
| 1024px+    | Desktop  | 12       | Top nav, optional sidebar |

---

## Special States

### Loading State
- Skeleton screens on all screens (not generic spinners)
- Shimmer effect with an animated gradient
- Keep the layout to avoid content shift

### Empty State
- Custom illustration + message + CTA
- Examples: "Sin favoritos" (No favorites), "Sin resultados" (No results), "Sin alertas" (No alerts)

### Error State
- Error illustration + clear message + retry button
- "Algo salió mal. Reintentá en unos segundos."
- Offline: "Sin conexión. Mostrando datos guardados."

### Offline (PWA)
- Fixed top banner: "Estás sin conexión" with a `#F59E0B` background
- Show cached content (latest searches, favorites)
- Disable new searches
```
