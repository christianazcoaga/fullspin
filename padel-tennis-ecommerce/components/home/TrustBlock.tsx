"use client"

import { Award, Shield, Users, Zap } from "lucide-react"

import { gsap } from "@/lib/gsap"
import { useScrubReveal } from "@/hooks/useScrubReveal"

const FEATURES = [
  {
    icon: Award,
    title: "Calidad premium",
    description:
      "Seleccionamos los mejores productos para garantizar tu máximo rendimiento.",
  },
  {
    icon: Zap,
    title: "Entrega rápida",
    description: "Envíos a todo el país con seguimiento en tiempo real.",
  },
  {
    icon: Users,
    title: "Atención personalizada",
    description:
      "Asesoramiento experto para ayudarte a elegir tu equipamiento ideal.",
  },
  {
    icon: Shield,
    title: "100% originales",
    description:
      "Trabajamos directamente con las mejores marcas del mercado.",
  },
]

export default function TrustBlock() {
  const ref = useScrubReveal<HTMLElement>((scope, tl) => {
    const heading = scope.querySelector("[data-trust='heading']")
    const lede = scope.querySelector("[data-trust='lede']")
    const cards = scope.querySelectorAll("[data-trust='card']")

    if (heading) gsap.set(heading, { y: 24, opacity: 0 })
    if (lede) gsap.set(lede, { y: 16, opacity: 0 })
    if (cards.length) gsap.set(cards, { y: 32, opacity: 0 })

    if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 1 })
    if (lede) tl.to(lede, { y: 0, opacity: 1, duration: 1 }, "<")
    if (cards.length) {
      tl.to(cards, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
      })
    }
  })

  return (
    <section
      ref={ref}
      className="bg-white py-24"
      aria-labelledby="trust-block-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2
            id="trust-block-heading"
            data-trust="heading"
            className="text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-brand-black"
          >
            ¿Por qué elegir Full Spin?
          </h2>
          <p
            data-trust="lede"
            className="mt-3 text-base text-brand-black/70 sm:text-lg"
          >
            Nos apasiona el deporte tanto como a vos. Por eso te ofrecemos lo mejor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              data-trust="card"
              className="rounded-xl border border-brand-black/10 bg-brand-cream p-6 transition-shadow duration-200 hover:shadow-md"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue-dark text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-brand-black">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-black/70">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
