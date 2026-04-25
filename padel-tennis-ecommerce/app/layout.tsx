import type { Metadata } from 'next'
import { Hanken_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import Preloader from "@/components/Preloader"
import SiteChrome from "@/components/layout/SiteChrome"

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
        url: '/fullspin-logo.png',
        width: 400,
        height: 400,
        alt: 'Logo FullSpin',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  icons: {
    icon: '/fullspin-logo.png',
    apple: '/fullspin-logo.png',
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${hankenGrotesk.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Preloader />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  )
}
