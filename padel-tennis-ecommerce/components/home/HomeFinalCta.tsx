"use client"

import { Instagram, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { gsap } from "@/lib/gsap"
import { useScrubReveal } from "@/hooks/useScrubReveal"

const WHATSAPP_HREF = `https://wa.me/543705103672?text=${encodeURIComponent(
  "Hola! Me gustaría obtener más información sobre sus productos."
)}`
const INSTAGRAM_HREF = "https://www.instagram.com/fullspinargentina/"

export default function HomeFinalCta() {
  const ref = useScrubReveal<HTMLElement>((scope, tl) => {
    const heading = scope.querySelector("[data-cta='heading']")
    const lede = scope.querySelector("[data-cta='lede']")
    const buttons = scope.querySelectorAll("[data-cta='button']")

    if (heading) gsap.set(heading, { scale: 0.92, opacity: 0 })
    if (lede) gsap.set(lede, { y: 16, opacity: 0 })
    if (buttons.length) gsap.set(buttons, { y: 24, opacity: 0 })

    if (heading) tl.to(heading, { scale: 1, opacity: 1, duration: 1 })
    if (lede) tl.to(lede, { y: 0, opacity: 1, duration: 1 }, "<")
    if (buttons.length) {
      tl.to(buttons, { y: 0, opacity: 1, stagger: 0.1, duration: 1 })
    }
  })

  return (
    <section
      ref={ref}
      className="bg-brand-black py-20"
      aria-labelledby="home-final-cta-heading"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="home-final-cta-heading"
          data-cta="heading"
          className="text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-brand-cream"
        >
          ¿Listo para mejorar tu juego?
        </h2>
        <p
          data-cta="lede"
          className="mx-auto mt-4 max-w-2xl text-base text-brand-cream/80 sm:text-lg"
        >
          Contactanos por WhatsApp y te ayudamos a encontrar el equipamiento
          perfecto para vos.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="neon" data-cta="button">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Contactar por WhatsApp
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            data-cta="button"
            className="border-brand-cream/40 bg-transparent text-brand-cream hover:bg-brand-cream/10 hover:border-brand-cream/60"
          >
            <a href={INSTAGRAM_HREF} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
              Seguinos en Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
