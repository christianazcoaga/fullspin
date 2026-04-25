"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import {
  Shield,
  Zap,
  MessageCircle,
  Heart,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

import { gsap, prefersReducedMotion } from "@/lib/gsap"
import { Button } from "@/components/ui/button"

// Local helper that applies the shared scrub config to an externally-owned
// ref. Mirrors `hooks/useScrubReveal.ts` (which owns its own ref); kept local
// because each section here already declares its own ref at the top of the
// component for the worm/parallax effects.
function useScrubReveal<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  build: (scope: T, tl: gsap.core.Timeline) => void
) {
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return

    const scope = ref.current
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        scrub: 1.5,
        trigger: scope,
        start: "top 85%",
        end: "top 25%",
      },
    })

    build(scope, tl)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const STATS = [
  { value: "100+", label: "Productos" },
  { value: "5+", label: "Marcas Premium" },
  { value: "24/7", label: "Atención WhatsApp" },
  { value: "100%", label: "Productos Originales" },
]

const SERVICES = [
  {
    icon: Zap,
    title: "Entrega Rápida",
    desc: "Consultá disponibilidad y tiempos de entrega por WhatsApp.",
  },
  {
    icon: MessageCircle,
    title: "Atención Personalizada",
    desc: "Te asesoramos para elegir el equipamiento ideal para tu nivel.",
  },
  {
    icon: Shield,
    title: "Productos Originales",
    desc: "Trabajamos directamente con distribuidores oficiales.",
  },
]

const WHATSAPP_HREF = `https://wa.me/543705103672?text=${encodeURIComponent(
  "Hola! Me gustaría obtener más información sobre sus productos."
)}`

export default function SobreNosotrosClient() {
  const introRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const mvRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const wormPathRef = useRef<SVGPathElement>(null)

  // Worm draw-on animation tied to scroll position
  useEffect(() => {
    const path = wormPathRef.current
    if (!path || prefersReducedMotion()) return

    const tl = gsap.timeline({
      scrollTrigger: {
        scrub: 1.5,
        trigger: ".scroll-trigger-ready__worm-wrap",
        start: "top 85%",
        end: "bottom 60%",
      },
    })

    tl.from(path, { drawSVG: "0%", duration: 1, ease: "none" })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  // Intro text + quality card
  useScrubReveal(introRef, (scope, tl) => {
    const text = scope.querySelector("[data-sn='intro-text']")
    const card = scope.querySelector("[data-sn='intro-card']")
    if (text) gsap.set(text, { x: -40, opacity: 0 })
    if (card) gsap.set(card, { x: 40, opacity: 0 })
    if (text) tl.to(text, { x: 0, opacity: 1, duration: 1 })
    if (card) tl.to(card, { x: 0, opacity: 1, duration: 1 }, "<")
  })

  // Stats — staggered scrub
  useScrubReveal(statsRef, (scope, tl) => {
    const stats = scope.querySelectorAll("[data-sn='stat']")
    if (!stats.length) return
    gsap.set(stats, { y: 30, opacity: 0 })
    tl.to(stats, { y: 0, opacity: 1, stagger: 0.15, duration: 1 })
  })

  // Services
  useScrubReveal(servicesRef, (scope, tl) => {
    const items = scope.querySelectorAll("[data-sn='service']")
    if (!items.length) return
    gsap.set(items, { y: 40, opacity: 0 })
    tl.to(items, { y: 0, opacity: 1, stagger: 0.2, duration: 1 })
  })

  // Mission / Vision
  useScrubReveal(mvRef, (scope, tl) => {
    const cards = scope.querySelectorAll("[data-sn='mv']")
    if (!cards.length) return
    gsap.set(cards, { scale: 0.95, opacity: 0 })
    tl.to(cards, { scale: 1, opacity: 1, stagger: 0.2, duration: 1 })
  })

  // CTA
  useScrubReveal(ctaRef, (scope, tl) => {
    const content = scope.querySelector("[data-sn='cta-content']")
    if (!content) return
    gsap.set(content, { y: 30, opacity: 0 })
    tl.to(content, { y: 0, opacity: 1, duration: 1 })
  })

  return (
    <div className="bg-brand-cream">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="scroll-trigger-ready__worm-wrap relative overflow-hidden pt-20 pb-28">
        {/* Decorative worm path — drawn on scroll */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 560"
        >
          <path
            ref={wormPathRef}
            d="M-40,280 C80,140 200,420 360,280 C520,140 640,420 800,280 C960,140 1080,420 1240,280 C1360,180 1420,320 1480,280"
            fill="none"
            stroke="hsl(var(--brand-blue-dark))"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.18"
          />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-brand-black">
            Sobre{" "}
            <span className="relative inline-block text-brand-blue-dark">
              Nosotros
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-brand-blue-dark"
              />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-balance text-lg text-brand-black/70 sm:text-xl">
            Somos una tienda argentina especialistas en{" "}
            <strong className="font-semibold text-brand-black">Padel</strong>,{" "}
            <strong className="font-semibold text-brand-black">
              Tenis de Mesa
            </strong>{" "}
            y{" "}
            <strong className="font-semibold text-brand-black">Tenis</strong>.
            Envíos a todo el país.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="black">
              <Link href="/padel">
                Padel
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenis-mesa">Tenis de Mesa</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenis">Tenis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Intro + Quality card ───────────────────────────────────── */}
      <section ref={introRef} className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div data-sn="intro-text" className="space-y-5">
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-brand-black">
                FullSpin — Tu Tienda de Confianza
              </h2>
              <p className="text-base leading-relaxed text-brand-black/70 sm:text-lg">
                En FullSpin somos apasionados del deporte y nos dedicamos a
                brindar el mejor equipamiento deportivo para jugadores de todos
                los niveles. Con años de experiencia en el sector, entendemos
                las necesidades específicas de cada deportista.
              </p>
              <p className="text-base leading-relaxed text-brand-black/70 sm:text-lg">
                Trabajamos con las mejores marcas del mercado como Wilson,
                Adidas, Head, Babolat y Bullpadel para garantizar productos de
                máxima calidad.
              </p>
              <p className="text-base leading-relaxed text-brand-black/70 sm:text-lg">
                Desde palas profesionales hasta accesorios especializados, cada
                producto en nuestro catálogo ha sido cuidadosamente seleccionado
                para ofrecerte la mejor experiencia de compra y rendimiento en
                la cancha.
              </p>
            </div>

            {/* Quality card */}
            <div
              data-sn="intro-card"
              className="relative flex h-72 flex-col items-center justify-center gap-4 rounded-2xl bg-brand-blue-dark p-8 text-brand-cream"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-cream/20">
                <Shield className="h-8 w-8 text-brand-cream" />
              </div>
              <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cream/20">
                <CheckCircle className="h-5 w-5 text-brand-cream" />
              </div>
              <h3 className="text-2xl font-semibold">Calidad Garantizada</h3>
              <p className="max-w-xs text-center text-brand-cream/80">
                Todos nuestros productos son originales y cuentan con garantía
                oficial de fábrica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-brand-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                data-sn="stat"
                className="rounded-xl border border-brand-black/10 bg-white p-6 text-center transition-shadow duration-200 hover:shadow-md"
              >
                <p className="text-4xl font-extrabold text-brand-blue-dark">
                  {value}
                </p>
                <p className="mt-1 text-sm font-medium text-brand-black/70">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────── */}
      <section ref={servicesRef} className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-brand-black">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                data-sn="service"
                className="rounded-xl border border-brand-black/10 bg-brand-cream p-6 text-center transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-blue-dark text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-brand-black">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-black/70">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Misión & Visión ───────────────────────────────────────── */}
      <section ref={mvRef} className="bg-brand-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div
              data-sn="mv"
              className="rounded-2xl border border-brand-black/10 bg-white p-8 transition-shadow duration-200 hover:shadow-md"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-dark text-white">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-brand-black">
                  Nuestra Misión
                </h3>
              </div>
              <p className="leading-relaxed text-brand-black/70">
                Proporcionar a los jugadores el mejor equipamiento deportivo,
                combinando calidad, variedad y un servicio excepcional. Queremos
                ser tu aliado en cada partido y ayudarte a alcanzar tu máximo
                potencial en la cancha.
              </p>
            </div>

            <div
              data-sn="mv"
              className="rounded-2xl border border-brand-black/10 bg-white p-8 transition-shadow duration-200 hover:shadow-md"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-dark text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-brand-black">
                  Nuestra Visión
                </h3>
              </div>
              <p className="leading-relaxed text-brand-black/70">
                Ser la tienda de referencia en equipamiento deportivo,
                reconocida por la calidad de nuestros productos, la
                confiabilidad de nuestro servicio y nuestro compromiso con el
                crecimiento de los deportes que amamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────────────── */}
      <section ref={ctaRef} className="bg-brand-black py-20">
        <div
          data-sn="cta-content"
          className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-brand-cream">
            ¿Tenés alguna pregunta?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-cream/80 sm:text-lg">
            Estamos acá para ayudarte. Contactanos por WhatsApp y te asesoramos
            en todo lo que necesités.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="neon">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
