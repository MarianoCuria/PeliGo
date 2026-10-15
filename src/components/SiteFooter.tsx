export default function SiteFooter() {
  return (
    <footer
      className="text-center text-xs text-[var(--color-text-secondary)] pt-8 pb-4 space-y-2"
      data-testid="site-footer"
    >
      <p>Hecho con ❤️ en Argentina</p>
      <p className="max-w-md mx-auto leading-relaxed opacity-80">
        Datos de películas y series de{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          TMDB
        </a>
        . Disponibilidad en plataformas provista por{" "}
        <a
          href="https://www.justwatch.com/ar"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          JustWatch
        </a>
        . Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.
      </p>
      <p>© {new Date().getFullYear()} MarianoCuria</p>
    </footer>
  );
}
