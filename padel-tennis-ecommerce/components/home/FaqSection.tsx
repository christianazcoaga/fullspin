import { MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = [
  {
    question: "¿Cómo puedo consultar disponibilidad de productos?",
    answer:
      "Puedes contactarnos directamente por WhatsApp al +54 370 510-3672 o por Instagram @fullspinargentina. Te respondemos en menos de 24 horas con toda la información sobre stock y precios.",
  },
  {
    question: "¿Realizan envíos a todo el país?",
    answer:
      "Sí, realizamos envíos a todo el territorio argentino. Los tiempos de entrega varían según la ubicación, pero generalmente son de 3 a 7 días hábiles. Consultá los costos de envío según tu localidad.",
  },
  {
    question: "¿Los productos son originales?",
    answer:
      "Absolutamente. Todos nuestros productos son 100% originales con garantía oficial de fábrica. Trabajamos directamente con distribuidores autorizados de Adidas, Wilson, Butterfly, DHS y más.",
  },
  {
    question: "¿Pueden asesorarme para elegir el equipamiento adecuado?",
    answer:
      "Por supuesto. Nuestro equipo está especializado en padel, tenis y tenis de mesa. Te ayudamos a elegir el equipamiento ideal según tu nivel, estilo de juego y presupuesto.",
  },
  {
    question: "¿Aceptan diferentes métodos de pago?",
    answer:
      "Sí, aceptamos transferencias bancarias, efectivo y todas las tarjetas de crédito y débito. También ofrecemos pago en cuotas sin interés según el producto y el banco.",
  },
]

const WHATSAPP_HREF = `https://wa.me/543705103672?text=${encodeURIComponent(
  "Hola! Tengo una consulta sobre sus productos."
)}`

export default function FaqSection() {
  return (
    <section
      className="bg-brand-cream py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2
            id="faq-heading"
            className="text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-brand-black"
          >
            Preguntas frecuentes
          </h2>
          <p className="mt-3 text-base text-brand-black/70 sm:text-lg">
            Resolvemos tus dudas para que compres con total confianza.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-3"
        >
          {FAQ.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="overflow-hidden rounded-xl border border-brand-black/10 bg-white px-5 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-brand-black hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-brand-black/70">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-brand-black/70">
            ¿No encontraste la respuesta que buscabas?
          </p>
          <Button asChild variant="neon" size="lg">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Consultar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
