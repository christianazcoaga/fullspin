import type { Metadata } from "next"

import CategoryPage from "@/components/catalog/CategoryPage"

export const metadata: Metadata = {
  title: "Padel | FullSpin",
  description:
    "Equipamiento de padel: palas, pelotas, bolsos, ropa y accesorios de las mejores marcas. Envíos a toda Argentina.",
  alternates: { canonical: "https://www.fullspinarg.com/padel" },
}

export default function PadelPage() {
  return <CategoryPage category="padel" />
}
