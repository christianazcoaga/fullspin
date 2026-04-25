import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Página no encontrada | FullSpin",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="bg-brand-cream py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-black/60">
          404
        </p>
        <h1 className="mt-3 text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-tight tracking-tight text-brand-black">
          No encontramos esta página
        </h1>
        <p className="mt-4 text-base text-brand-black/70">
          El enlace puede estar roto o la página fue movida. Probá desde el
          inicio o buscá un producto.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="black">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/buscar">Buscar productos</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
