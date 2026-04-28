import type { Metadata } from 'next'
import { Hanken_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import Preloader from "@/components/Preloader"
import SiteChrome from "@/components/layout/SiteChrome"
import { BrandLogosProvider } from "@/components/layout/BrandLogosProvider"
import { getAllBrands } from "@/lib/brands.server"

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-hanken',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fullspinarg.com'),
  title: 'FullSpin',
  description: 'FullSpin - El mejor equipamiento deportivo',
  generator: 'v0.dev',
  openGraph: {
    title: 'FullSpin',
    description: 'FullSpin - El mejor equipamiento deportivo',
    url: 'https://www.fullspinarg.com/',
    siteName: 'FullSpin',
    images: [
      {
        // Brand-blue-dark canvas with the new white wordmark, sized 1200x630
        // (the dimensions WhatsApp / Twitter / FB scrapers expect). Generated
        // by scripts/generate-og-image.mjs from public/images/LOGOS/FullSpin-Web-01.svg.
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Full Spin — Equipamiento deportivo',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FullSpin',
    description: 'FullSpin - El mejor equipamiento deportivo',
    images: ['/og-image.png'],
  },
  icons: {
    // app/icon.svg is auto-served by Next's file convention at /icon.svg,
    // but declaring it here too forces Next to emit the matching
    // <link rel="icon"> tag — when metadata.icons exists with any field,
    // the auto-emit for unspecified fields is suppressed.
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/og-image.png', type: 'image/png' }, // raster fallback
    ],
    apple: '/og-image.png',
  },
  manifest: "/manifest.json",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const brands = await getAllBrands()
  const brandLogos: Record<string, string> = {}
  for (const b of brands) {
    if (b.logo_url) brandLogos[b.name] = b.logo_url
  }

  return (
    <html lang="es" className={`${hankenGrotesk.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Preloader />
        <BrandLogosProvider logos={brandLogos}>
          <SiteChrome>{children}</SiteChrome>
        </BrandLogosProvider>
        <Analytics />
      </body>
    </html>
  )
}
