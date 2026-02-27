import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://peligo.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PeliGo — Encontrá dónde verlo",
    template: "%s | PeliGo",
  },
  description:
    "Buscá películas y series, encontrá en qué plataforma verlas en Argentina. Streaming, alquiler y compra. Hecho en Argentina.",
  keywords: ["películas", "series", "streaming", "Argentina", "dónde ver", "Netflix", "Disney", "Prime"],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "PeliGo",
    title: "PeliGo — Encontrá dónde verlo",
    description: "Buscá películas y series, encontrá en qué plataforma verlas en Argentina.",
    // Añadí public/og.png (1200x630) para mejorar la vista en redes.
  },
  twitter: {
    card: "summary_large_image",
    title: "PeliGo — Encontrá dónde verlo",
    description: "Buscá películas y series, encontrá en qué plataforma verlas en Argentina.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PeliGo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <main className="min-h-screen pb-20 max-w-[1200px] mx-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
