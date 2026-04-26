"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { gsap, prefersReducedMotion } from "@/lib/gsap"
import { onPreloaderDone } from "@/lib/preloader-state"

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const reduced = prefersReducedMotion()

    // Pre-set the entrance state synchronously so we never flash the
    // final frame before the timeline kicks in. gsap.set works even
    // before the preloader-done callback fires.
    if (!reduced) {
      gsap.set(
        [
          "[data-hero='eyebrow']",
          "[data-hero='title']",
          "[data-hero='lede']",
          "[data-hero='cta']",
          "[data-hero='hint']",
        ],
        { opacity: 0, y: 24 }
      )
      gsap.set("[data-hero='bg']", { scale: 1.08 })
    }

    const ctxs: gsap.Context[] = []

    const off = onPreloaderDone(() => {
      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(
            [
              "[data-hero='eyebrow']",
              "[data-hero='title']",
              "[data-hero='lede']",
              "[data-hero='cta']",
              "[data-hero='hint']",
            ],
            { opacity: 1, y: 0 }
          )
          gsap.set("[data-hero='bg']", { scale: 1 })
          return
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        // Subtle ken-burns settle on the background photo while the
        // foreground enters.
        tl.to(
          "[data-hero='bg']",
          { scale: 1, duration: 2.4, ease: "power2.out" },
          0
        )

        tl.to(
          "[data-hero='eyebrow']",
          { opacity: 1, y: 0, duration: 0.6 },
          0.05
        )
        tl.to(
          "[data-hero='title']",
          { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" },
          0.18
        )
        tl.to(
          "[data-hero='lede']",
          { opacity: 1, y: 0, duration: 0.6 },
          0.42
        )
        tl.to(
          "[data-hero='cta']",
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "back.out(1.4)" },
          0.6
        )
        tl.to(
          "[data-hero='hint']",
          { opacity: 1, y: 0, duration: 0.5 },
          0.95
        )
      }, sectionRef)

      ctxs.push(ctx)
    })

    return () => {
      off()
      ctxs.forEach((c) => c.revert())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-24"
    >
      <div className="absolute inset-0">
        <Image
          ref={bgRef}
          data-hero="bg"
          src="/BG-INICIO.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div
          data-hero="eyebrow"
          className="mb-6 inline-block rounded-full border border-brand-cream/25 bg-brand-cream/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-cream"
        >
          Nueva Temporada 2026
        </div>

        <h1
          data-hero="title"
          className="text-balance text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-brand-cream"
        >
          ELEVÁ TU
          <br />
          NIVEL DE JUEGO
        </h1>

        <p
          data-hero="lede"
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-brand-cream/85 sm:text-lg"
        >
          El mejor equipamiento deportivo para padel, tenis y tenis de mesa.
          Calidad premium, marcas originales y asesoramiento personalizado.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="black" data-hero="cta">
            <Link href="/padel">
              Ver catálogo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            data-hero="cta"
            className="border-brand-cream/40 bg-transparent text-brand-cream hover:bg-brand-cream/10 hover:border-brand-cream/60"
          >
            <Link href="/ofertas">Explorar ofertas</Link>
          </Button>
        </div>
      </div>

      <div
        data-hero="hint"
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
