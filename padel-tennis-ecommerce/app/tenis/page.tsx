import type { Metadata } from "next"

import CategoryPage from "@/components/catalog/CategoryPage"

export const metadata: Metadata = {
  title: "Tenis | FullSpin",
  description:
    "Raquetas y bolsos de tenis de las mejores marcas, con envíos a toda Argentina y asesoramiento personalizado.",
  alternates: { canonical: "https://www.fullspinarg.com/tenis" },
}

export default function TenisPage() {
  return <CategoryPage category="tenis" />
}
