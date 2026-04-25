import { Award, Shield, Users, Zap } from "lucide-react"

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
  return (
    <section
      className="bg-white py-24"
      aria-labelledby="trust-block-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2
            id="trust-block-heading"
            className="text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-brand-black"
          >
            ¿Por qué elegir Full Spin?
          </h2>
          <p className="mt-3 text-base text-brand-black/70 sm:text-lg">
            Nos apasiona el deporte tanto como a vos. Por eso te ofrecemos lo mejor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-brand-black/10 bg-brand-cream p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
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
