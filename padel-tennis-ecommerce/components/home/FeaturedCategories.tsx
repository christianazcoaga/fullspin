import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type CategoryLogo = { src: string; alt: string }
type CategoryCard = {
  title: string
  description: string
  href: string
  bg: string
  image?: string
  logos: CategoryLogo[]
}

const CATEGORIES: CategoryCard[] = [
  {
    title: "PADEL",
    description: "Palas, zapatillas, pelotas y accesorios para dominar la pista.",
    href: "/padel",
    bg: "bg-brand-blue-dark",
    logos: [
      { src: "/optimized/adidas-logo.webp", alt: "Adidas" },
      { src: "/optimized/wilson-logo.webp", alt: "Wilson" },
    ],
  },
  {
    title: "TENIS DE MESA",
    description: "Maderas, gomas, mesas y todo lo necesario para tu juego.",
    href: "/tenis-mesa",
    bg: "bg-brand-black",
    logos: [
      { src: "/optimized/butterfly-logo.webp", alt: "Butterfly" },
      { src: "/optimized/dhs-logo.webp", alt: "DHS" },
    ],
  },
  {
    title: "TENIS",
    description: "Raquetas, cuerdas, indumentaria y calzado de primer nivel.",
    href: "/tenis",
    bg: "bg-brand-blue-light",
    logos: [
      { src: "/optimized/wilson-logo.webp", alt: "Wilson" },
      { src: "/optimized/head-logo.webp", alt: "Head" },
    ],
  },
]

export default function FeaturedCategories() {
  return (
    <section
      id="categorias"
      className="bg-brand-cream py-24"
      aria-labelledby="featured-categories-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2
              id="featured-categories-heading"
              className="text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-brand-black"
            >
              Nuestras categorías
            </h2>
            <p className="mt-3 text-base text-brand-black/70 sm:text-lg">
              Encontrá el equipamiento perfecto para tu deporte favorito.
            </p>
          </div>
          <Link
            href="/padel"
            className="hidden items-center gap-2 text-sm font-semibold text-brand-blue-dark hover:underline md:inline-flex"
          >
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative flex h-[400px] flex-col justify-end overflow-hidden rounded-xl ${cat.bg} p-8 text-brand-cream transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-brand-cream/80">
                  {cat.description}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  {cat.logos.map((logo) => (
                    <span
                      key={logo.alt}
                      className="inline-flex items-center justify-center rounded-md bg-white px-2.5 py-1.5 shadow-sm"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={60}
                        height={24}
                        className="h-5 w-auto object-contain"
                      />
                    </span>
                  ))}
                </div>
                <div className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-neon text-brand-black transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/padel"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-brand-blue-dark hover:underline md:hidden"
        >
          Ver todo el catálogo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
