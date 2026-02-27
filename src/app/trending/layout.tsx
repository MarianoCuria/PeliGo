import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tendencias — Películas y series en Argentina",
  description:
    "Películas y series en tendencia en Argentina. Descubrí qué ver hoy y esta semana en streaming.",
  openGraph: {
    title: "Tendencias | PeliGo",
    description: "Películas y series en tendencia en Argentina. Descubrí qué ver en streaming.",
  },
};

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
