import type { Metadata } from "next"

import SobreNosotrosClient from "@/components/sobre-nosotros/SobreNosotrosClient"

export const metadata: Metadata = {
  title: "Sobre nosotros | FullSpin",
  description:
    "Conocé Full Spin: equipamiento deportivo de calidad para padel, tenis y tenis de mesa, con asesoramiento experto y envíos a toda Argentina.",
  alternates: { canonical: "https://www.fullspinarg.com/sobre-nosotros" },
}

export default function SobreNosotrosPage() {
  return <SobreNosotrosClient />
}
