import type { Metadata } from "next"

import CategoryPage from "@/components/catalog/CategoryPage"

export const metadata: Metadata = {
  title: "Ofertas | FullSpin",
  description:
    "Productos en oferta de padel, tenis y tenis de mesa. Descuentos especiales con stock limitado.",
  alternates: { canonical: "https://www.fullspinarg.com/ofertas" },
}

export default function OfertasPage() {
  return <CategoryPage category="ofertas" />
}
