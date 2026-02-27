import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar películas y series",
  description:
    "Buscá películas y series y encontrá en qué plataforma verlas en Argentina. PeliGo.",
  openGraph: {
    title: "Buscar | PeliGo",
    description: "Buscá películas y series y encontrá dónde verlas en Argentina.",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
