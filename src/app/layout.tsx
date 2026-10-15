import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AlertChecker from "@/components/AlertChecker";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { SITE_URL } from "@/lib/site";

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
};


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    siteName: "PeliGo",
    title: "PeliGo — Encontrá dónde verlo",
    description: "Buscá películas y series, encontrá en qué plataforma verlas en Argentina.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PeliGo — Encontrá dónde verlo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PeliGo — Encontrá dónde verlo",
    description: "Buscá películas y series, encontrá en qué plataforma verlas en Argentina.",
    images: ["/og.png"],
  },
  icons: {
    apple: "/apple-touch-icon.png",
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
        <AlertChecker />
        <ServiceWorkerRegister />
        <Analytics />
        <BottomNav />
      </body>
    </html>
  );
}
