import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-24">
      <div className="absolute inset-0">
        <img
          src="/BG-INICIO.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-black/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-block rounded-full border border-brand-cream/25 bg-brand-cream/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-cream">
          Nueva Temporada 2026
        </div>

        <h1 className="text-balance text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-brand-cream">
          ELEVÁ TU
          <br />
          NIVEL DE JUEGO
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-brand-cream/85 sm:text-lg">
          El mejor equipamiento deportivo para padel, tenis y tenis de mesa.
          Calidad premium, marcas originales y asesoramiento personalizado.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="black">
            <Link href="/padel">
              Ver catálogo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-brand-cream/40 bg-transparent text-brand-cream hover:bg-brand-cream/10 hover:border-brand-cream/60">
            <Link href="/ofertas">Explorar ofertas</Link>
          </Button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-brand-cream/60"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Explorar
        </span>
        <div className="h-8 w-[2px] overflow-hidden rounded-full bg-brand-cream/20">
          <div className="h-1/2 w-full animate-scroll-indicator rounded-full bg-brand-cream" />
        </div>
      </div>
    </section>
  )
}
