import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'FullSpin',
  description: 'FullSpin - El mejor equipamiento deportivo',
  generator: 'v0.dev',
  openGraph: {
    title: 'FullSpin',
    description: 'FullSpin - El mejor equipamiento deportivo',
    url: 'https://fullspin-padel.vercel.app',
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
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
