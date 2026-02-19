## Cambios

- **Fix build**: `PosterCard` acepta `popularity` opcional (favoritos/mock).
- **ESLint**: setState en `useEffect` envuelto en `queueMicrotask` (page, title/[id], trending).
- **Búsqueda**: se muestra total de resultados; `Link` en favoritos en lugar de `<a>`.
- **TMDB**: `apiKey()` no lanza si falta key (build en Vercel).

Listo para merge a `main` y deploy en Vercel.
