import type { Metadata } from "next"

import CategoryPage from "@/components/catalog/CategoryPage"

export const metadata: Metadata = {
  title: "Tenis de Mesa | FullSpin",
  description:
    "Paletas, gomas, pelotas y accesorios para tenis de mesa. Equipamiento profesional con envíos a toda Argentina.",
  alternates: { canonical: "https://www.fullspinarg.com/tenis-mesa" },
}

export default function TenisMesaPage() {
  return <CategoryPage category="tenis-mesa" />
}
