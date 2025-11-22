import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

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
        url: '/fullspin-logo.png', // Ruta desde /public
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
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
