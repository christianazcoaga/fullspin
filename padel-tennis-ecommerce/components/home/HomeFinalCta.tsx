import { Instagram, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

const WHATSAPP_HREF = `https://wa.me/543705103672?text=${encodeURIComponent(
  "Hola! Me gustaría obtener más información sobre sus productos."
)}`
const INSTAGRAM_HREF = "https://www.instagram.com/fullspinargentina/"

export default function HomeFinalCta() {
  return (
    <section
      className="bg-brand-black py-20"
      aria-labelledby="home-final-cta-heading"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="home-final-cta-heading"
          className="text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-brand-cream"
        >
          ¿Listo para mejorar tu juego?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-brand-cream/80 sm:text-lg">
          Contactanos por WhatsApp y te ayudamos a encontrar el equipamiento
          perfecto para vos.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="neon">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Contactar por WhatsApp
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
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
