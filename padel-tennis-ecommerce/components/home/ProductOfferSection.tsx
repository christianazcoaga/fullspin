"use client"

import Link from "next/link"
import { ArrowRight, MessageCircle, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import OptimizedImage from "@/components/OptimizedImage"
import ProductBrandLogo from "@/components/catalog/ProductBrandLogo"
import { gsap } from "@/lib/gsap"
import {
  creditTotalPrice,
  formatPrice,
  installmentPrice,
  INSTALLMENT_COUNT,
} from "@/lib/catalog"
import type { Product } from "@/lib/products"
import { useScrubReveal } from "@/hooks/useScrubReveal"

interface ProductOfferSectionProps {
  title: string
  subtitle: string
  products: Product[]
  categoryLink: string
  categoryName: string
  isLoading?: boolean
  isComingSoon?: boolean
}

function buildWhatsAppHref(product: Product, isComingSoon: boolean) {
  const message = isComingSoon
    ? `Hola! Quiero consultar sobre la ${product.name} de ${product.marca} que estará disponible próximamente.`
    : `Hola! Me interesa la ${product.name} de ${product.marca}. ¿Tienen stock disponible?`
  return `https://wa.me/543705103672?text=${encodeURIComponent(message)}`
}

export function ProductOfferSection({
  title,
  subtitle,
  products,
  categoryLink,
  categoryName,
  isLoading = false,
  isComingSoon = false,
}: ProductOfferSectionProps) {
  const ref = useScrubReveal<HTMLElement>((scope, tl) => {
    const heading = scope.querySelector("[data-offer='heading']")
    const lede = scope.querySelector("[data-offer='lede']")
    const cards = scope.querySelectorAll("[data-offer='card']")

    if (heading) gsap.set(heading, { y: 24, opacity: 0 })
    if (lede) gsap.set(lede, { y: 16, opacity: 0 })
    if (cards.length) gsap.set(cards, { y: 30, opacity: 0 })

    if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 1 })
    if (lede) tl.to(lede, { y: 0, opacity: 1, duration: 1 }, "<")
    if (cards.length) {
      tl.to(cards, { y: 0, opacity: 1, stagger: 0.08, duration: 1 })
    }
  })

  return (
    <section ref={ref} className="bg-brand-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2
            data-offer="heading"
            className="text-balance text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-brand-black"
          >
            {title}
          </h2>
          <p
            data-offer="lede"
            className="mx-auto mt-3 max-w-2xl text-base text-brand-black/70 sm:text-lg"
          >
            {subtitle}
          </p>
        </div>

        {isLoading || products.length > 0 ? (
          // Mobile: horizontal swipe (each card 78% wide so the next one
          // peeks, snap to start). sm+: flex-wrap with justify-center so
          // a partial last row centers instead of left-aligning.
          <div
            className="
              -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 snap-x snap-mandatory
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none
            "
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col shrink-0 w-[78%] snap-start sm:w-[calc((100%-1.25rem)/2)] sm:shrink lg:w-[calc((100%-3.75rem)/4)]"
                  >
                    <SkeletonCard />
                  </div>
                ))
              : products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col shrink-0 w-[78%] snap-start sm:w-[calc((100%-1.25rem)/2)] sm:shrink lg:w-[calc((100%-3.75rem)/4)]"
                  >
                    <OfferCard
                      product={product}
                      isComingSoon={isComingSoon}
                    />
                  </div>
                ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="mb-4 text-base text-brand-black/70">
              No hay ofertas de {categoryName.toLowerCase()} disponibles en este
              momento.
            </p>
            <Button asChild variant="black">
              <Link href={categoryLink}>
                Ver productos de {categoryName}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function OfferCard({
  product,
  isComingSoon,
}: {
  product: Product
  isComingSoon: boolean
}) {
  const finalPrice =
    product.offer_percent > 0
      ? Math.round(product.price * (1 - product.offer_percent / 100))
      : product.price

  const productHref = `/producto/${product.id}`

  return (
    <article
      data-offer="card"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-black/10 bg-white transition-shadow duration-200 hover:shadow-md"
    >
      <Link
        href={productHref}
        aria-label={`Ver detalles de ${product.name}`}
        className="relative block aspect-square w-full overflow-hidden bg-white"
      >
        {!isComingSoon && product.offer_percent > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-brand-black shadow-sm">
            -{product.offer_percent}%
          </span>
        )}
        {!isComingSoon && (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-blue-dark px-3 py-1.5 text-xs font-semibold text-brand-cream shadow-sm">
            <Truck className="h-3.5 w-3.5" />
            Envío gratis
          </span>
        )}
        <OptimizedImage
          src={product.image}
          alt={product.name}
          width={320}
          height={320}
          className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 border-t border-brand-black/5 p-3">
        <Link
          href={productHref}
          className="text-left text-sm font-semibold leading-snug text-brand-black line-clamp-2 hover:text-brand-blue-dark min-h-[2.5rem]"
        >
          {product.name}
        </Link>
        {product.marca && (
          <div className="flex h-9 items-center">
            <ProductBrandLogo marca={product.marca} maxHeight={32} />
          </div>
        )}

        <div className="mt-auto space-y-1.5">
          {isComingSoon ? (
            <span className="inline-flex w-full items-center justify-center rounded-lg bg-brand-blue-light/20 px-3 py-2 text-sm font-semibold text-brand-blue-dark">
              Próximamente
            </span>
          ) : (
            <>
              {product.offer_percent > 0 && (
                <p className="text-xs text-brand-black/40 line-through leading-none">
                  {formatPrice(creditTotalPrice(product.price))}
                </p>
              )}
              <div>
                <p className="text-xl font-extrabold text-brand-black leading-tight">
                  {formatPrice(creditTotalPrice(finalPrice))}
                </p>
                <p className="text-[11px] text-brand-black/75 leading-tight">
                  {INSTALLMENT_COUNT} cuotas sin interés de{" "}
                  <span className="font-bold text-brand-black">
                    {formatPrice(installmentPrice(finalPrice))}
                  </span>
                </p>
              </div>
              <div className="rounded-md bg-brand-blue-dark/5 px-2 py-1.5">
                <p className="text-xl font-extrabold text-brand-blue-dark leading-tight">
                  {formatPrice(finalPrice)}
                </p>
                <p className="text-[11px] text-brand-black/60 leading-tight">
                  con transferencia o efectivo
                </p>
              </div>
            </>
          )}

          <Button asChild variant="neon" size="sm" className="w-full">
            <a
              href={buildWhatsAppHref(product, isComingSoon)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              {isComingSoon ? "Consultar disponibilidad" : "Consultar stock"}
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-brand-black/10 bg-white">
      <div className="aspect-square animate-pulse bg-brand-black/5" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-brand-black/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-brand-black/10" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-brand-black/10" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-brand-black/10" />
      </div>
    </div>
  )
}

function SkeletonCards() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-brand-black/10 bg-white"
        >
          <div className="aspect-square animate-pulse bg-brand-black/5" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-brand-black/10" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-brand-black/10" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-brand-black/10" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-brand-black/10" />
          </div>
        </div>
      ))}
    </>
  )
}
