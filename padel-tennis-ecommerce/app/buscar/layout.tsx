import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buscar productos | FullSpin",
  description:
    "Resultados de búsqueda en el catálogo de Full Spin: padel, tenis y tenis de mesa.",
  // Search result pages are personalised per query and should not pollute
  // the search index.
  robots: { index: false, follow: true },
}

export default function BuscarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
