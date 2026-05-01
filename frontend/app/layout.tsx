import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const ibmMono = IBM_Plex_Mono({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Carto-Art Clone | Créez votre affiche cartographique",
  description: "Éditeur web pour créer des affiches murales cartographiques personnalisées",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${ibmMono.variable}`}>
      <body className="bg-carto-bg text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}