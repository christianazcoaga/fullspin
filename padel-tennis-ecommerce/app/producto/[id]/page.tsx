import { ArrowRight, MessageCircle } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import ProductBrandLogo from "@/components/catalog/ProductBrandLogo"
import RelatedProducts from "@/components/catalog/RelatedProducts"
import { Button } from "@/components/ui/button"
import {
  categoryLabel,
  formatPrice,
  subcategoryLabel,
} from "@/lib/catalog"
import {
  getProductById,
  getRelatedProducts,
} from "@/lib/products.server"
import type { Product } from "@/lib/products"

const SITE_URL = "https://www.fullspinarg.com"
const WHATSAPP_NUMBER = "543705103672"

// Re-render the PDP at most once per hour so admin price/offer edits
// surface without a full redeploy.
export const revalidate = 3600

type RouteParams = { id: string }

function buildWhatsAppHref(product: Product) {
  const message = product.coming_soon
    ? `Hola! Quiero consultar sobre la ${product.name} de ${product.marca} que estará disponible próximamente.`
    : `Hola! Me interesa la ${product.name} de ${product.marca}. ¿Tienen stock disponible?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return { title: "Producto no encontrado | FullSpin" }

  const product = await getProductById(numericId)
  if (!product) return { title: "Producto no encontrado | FullSpin" }

  const titleBase = `${product.name}${product.marca ? ` — ${product.marca}` : ""} | FullSpin`
  const description =
    product.description ||
    `${product.name}${product.marca ? ` de ${product.marca}` : ""} disponible en FullSpin Argentina.`

  return {
    title: titleBase,
    description,
    alternates: {
      canonical: `${SITE_URL}/producto/${product.id}`,
    },
    openGraph: {
      title: titleBase,
      description,
      url: `${SITE_URL}/producto/${product.id}`,
      type: "website",
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: titleBase,
      description,
      images: product.image ? [product.image] : undefined,
    },
  }
}

function categoryHref(category: string) {
  if (category === "padel") return "/padel"
  if (category === "tenis") return "/tenis"
  if (category === "tenis-mesa") return "/tenis-mesa"
  return "/"
}

function buildJsonLd(product: Product) {
  const finalPrice =
    product.in_offer && product.offer_percent > 0
      ? Math.round(product.price * (1 - product.offer_percent / 100))
      : product.price

  const availability = !product.in_stock
    ? "https://schema.org/OutOfStock"
    : product.coming_soon
    ? "https://schema.org/PreOrder"
    : "https://schema.org/InStock"

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.image ? [product.image] : undefined,
    brand: product.marca
      ? { "@type": "Brand", name: product.marca }
      : undefined,
    sku: String(product.id),
    category: categoryLabel(product.category),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/producto/${product.id}`,
      priceCurrency: "ARS",
      price: finalPrice,
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) notFound()

  const product = await getProductById(numericId)
  if (!product) notFound()

  const related = await getRelatedProducts(product.id, product.category, 4)

  const finalPrice =
    product.in_offer && product.offer_percent > 0
      ? Math.round(product.price * (1 - product.offer_percent / 100))
      : product.price
  const savings = product.price - finalPrice

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON.stringify is safe; data comes from Supabase
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(product)) }}
      />

      <div className="bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-black/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brand-black">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={categoryHref(product.category)}
                  className="hover:text-brand-black"
                >
                  {categoryLabel(product.category)}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-brand-black" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-brand-black/10 bg-white">
              {product.in_offer && product.offer_percent > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-brand-black shadow-sm">
                  -{product.offer_percent}% OFF
                </span>
              )}
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full max-w-[80%] object-contain p-6"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex h-7 items-center">
                <ProductBrandLogo marca={product.marca} maxHeight={28} />
              </div>

              <div>
                <h1 className="text-balance text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-brand-black">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-brand-black/60">
                  {categoryLabel(product.category)}
                  {product.subcategory && ` • ${subcategoryLabel(product.subcategory)}`}
                </p>
              </div>

              {product.coming_soon ? (
                <div className="rounded-xl bg-brand-blue-light/15 p-5">
                  <span className="inline-flex items-center justify-center rounded-lg bg-brand-blue-dark px-4 py-2 text-sm font-bold text-white">
                    Próximamente
                  </span>
                  <p className="mt-3 text-sm text-brand-black/70">
                    Este producto estará disponible muy pronto. Consultanos por
                    WhatsApp para reservarlo.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-white p-5 ring-1 ring-brand-black/10">
                  {product.in_offer && product.offer_percent > 0 ? (
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-base text-brand-black/40 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-brand-black">
                          -{product.offer_percent}%
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-brand-black">
                        {formatPrice(finalPrice)}
                      </p>
                      {savings > 0 && (
                        <p className="text-sm text-brand-black/70">
                          Ahorrás {formatPrice(savings)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-brand-black">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
              )}

              {product.description && (
                <div>
                  <h2 className="mb-2 text-base font-semibold text-brand-black">
                    Descripción
                  </h2>
                  <p className="text-sm leading-relaxed text-brand-black/75">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mt-2">
                <Button asChild variant="neon" size="lg" className="w-full sm:w-auto">
                  <a
                    href={buildWhatsAppHref(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Consultar por WhatsApp
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                {!product.in_stock && !product.coming_soon && (
                  <p className="mt-3 text-xs text-status-warning">
                    Este producto no está en stock en este momento.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts products={related} />
      </div>
    </>
  )
}
