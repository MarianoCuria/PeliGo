export default function SiteFooter() {
  return (
    <footer
      className="text-center text-xs text-[var(--color-text-secondary)] pt-8 pb-4 space-y-2"
      data-testid="site-footer"
    >
      <p>Hecho con ❤️ en Argentina</p>
      <p className="opacity-80">Datos de películas y series.</p>
      <p>© {new Date().getFullYear()} MarianoCuria</p>
    </footer>
  );
}
