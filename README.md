# PeliGo

**Encontrá dónde verlo.**

PeliGo es una Progressive Web App para Argentina que permite buscar cualquier película o serie y saber al instante en qué plataforma de streaming está disponible. [Demo en vivo](https://peligo.vercel.app/).

---

## Stack implementado (MVP)

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 (App Router, React 19) |
| Datos | TMDB API (proxied vía API Routes de Next.js) |
| Persistencia de usuario | `localStorage` (plataformas elegidas, favoritos, alertas) |
| Deploy | Vercel |
| Testing E2E | Playwright, mock server propio de TMDB, CI en GitHub Actions |

> El MVP prioriza velocidad de entrega sobre infraestructura: no hay backend propio ni base de datos — el estado del usuario vive en el cliente. La carpeta [`docs/architecture`](docs/architecture/04-backend-architecture.md) documenta la visión de arquitectura a más largo plazo (backend modular, Postgres, Redis) pensada para cuando el producto necesite cuentas de usuario reales y sincronización entre dispositivos.

---

## Testing

La suite de e2e (`e2e/`) está pensada para ser determinística y correr en CI sin depender de la API real de TMDB ni de rate limits:

- **Mock server de TMDB** (`e2e/mocks/tmdb-server.mjs`): un servidor HTTP mínimo que responde con la forma real de la API de TMDB, seedeado con un catálogo fijo de títulos de prueba.
- **Page Object Model** (`e2e/pages/`) + **fixtures** (`e2e/fixtures/test.ts`) para mantener los specs legibles y evitar duplicar locators.
- **Seed de `localStorage`** (`e2e/helpers.ts`) para arrancar cada test en un estado conocido (plataformas, favoritos, alertas) sin pasar por la UI.
- **Global setup** (`e2e/setup/global-setup.ts`) que genera un `storageState` reusable (usuario con Netflix ya configurado) para specs que no necesitan repetir el onboarding.
- Cobertura: búsqueda, favoritos, alertas, "mis plataformas".

```bash
npm ci
npx playwright install --with-deps chromium
npm run test:e2e          # headless
npm run test:e2e:ui       # modo interactivo
npm run test:e2e:report   # ver el último reporte HTML
```

CI: [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) corre la suite en cada push/PR contra `main` y sube el reporte de Playwright como artifact.

---

## Documentación del producto

- [`docs/branding/`](docs/branding/01-identidad-visual.md) — identidad visual, paleta, tipografías
- [`docs/mockups/`](docs/mockups/03-mockups-uiux.md) — mockups de UI/UX
- [`docs/architecture/`](docs/architecture/04-backend-architecture.md) — visión de arquitectura a futuro y estructura del MVP
- [`docs/pitch/`](docs/pitch/06-investor-pitch.md) — pitch de producto
- [`specs/`](specs/) — specs, planes y modelos de datos de cada feature (flujo tipo spec-driven development: `spec.md` → `plan.md` → `tasks.md`)

---

## Desarrollo local

```bash
npm install
npm run dev
```

Variables de entorno requeridas (`.env.local`): `TMDB_API_KEY`.

---

*Hecho con amor en Argentina.*
