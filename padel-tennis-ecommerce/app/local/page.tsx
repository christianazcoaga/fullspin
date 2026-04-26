import type { Metadata } from "next"
import { ArrowRight, MapPin, MessageCircle, Store } from "lucide-react"

import ProductCard from "@/components/catalog/ProductCard"
import { Button } from "@/components/ui/button"
import { getLocalStockProducts } from "@/lib/products.server"

const SITE_URL = "https://www.fullspinarg.com"
const WHATSAPP_HREF = `https://wa.me/543705103672?text=${encodeURIComponent(
  "Hola! Quería consultar qué productos tienen disponibles para retirar en el local."
)}`

// Storefront location. Hard-coded here because it's the only place we render
// it; if it shows up anywhere else later, lift to lib/store.ts.
const STORE_ADDRESS = "Salta 185, Formosa Capital, Argentina"
const STORE_MAPS_QUERY = encodeURIComponent("Salta 185 Formosa, Argentina")
// `output=embed` produces an iframe-friendly map without needing an API key.
const STORE_MAP_EMBED_URL = `https://www.google.com/maps?q=${STORE_MAPS_QUERY}&z=16&output=embed`
const STORE_MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${STORE_MAPS_QUERY}`

export const metadata: Metadata = {
  title: "Stock disponible en el local | FullSpin",
  description:
    "Productos que tenemos físicamente en el local de Full Spin para retirar hoy mismo. Consultanos por WhatsApp.",
  alternates: { canonical: `${SITE_URL}/local` },
}

// Re-render at most once an hour so admin toggles surface without redeploys.
export const revalidate = 3600

export default async function LocalPage() {
  // No category limit, no per-section cap — show all products marked as
  // physically available at the storefront.
  const products = await getLocalStockProducts(undefined, 200)

  return (
    <div className="bg-brand-cream">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue-dark/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue-dark">
              <Store className="h-3.5 w-3.5" />
              En el local
            </span>
            <h1 className="mt-4 text-balance text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-brand-black">
              Disponible para retirar hoy
            </h1>
            <p className="mt-4 text-balance text-base text-brand-black/70 sm:text-lg">
              Estos son los productos que tenemos físicamente en el local de
              Full Spin. Acercate a verlos en persona o consultanos por
              WhatsApp para reservarlos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="neon" size="lg">
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#como-llegar">
                  <MapPin className="h-5 w-5" />
                  Cómo llegar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map / address */}
      <section
        id="como-llegar"
        className="border-y border-brand-black/10 bg-white"
        aria-labelledby="como-llegar-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            {/* Address card */}
            <div className="flex flex-col justify-center">
              <h2
                id="como-llegar-heading"
                className="text-balance text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight tracking-tight text-brand-black"
              >
                Cómo llegar
              </h2>
              <p className="mt-3 text-base text-brand-black/70 sm:text-lg">
                Visitanos en nuestro local de Formosa para ver los productos en
                persona y probarlos.
              </p>

              <div className="mt-6 space-y-3 rounded-xl border border-brand-black/10 bg-brand-cream p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue-dark text-brand-cream">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-black/55">
                      Dirección
                    </p>
                    <p className="text-base font-semibold text-brand-black">
                      {STORE_ADDRESS}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="black">
                  <a
                    href={STORE_MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en Google Maps
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Coordinar visita
                  </a>
                </Button>
              </div>
            </div>

            {/* Embedded map */}
            <div className="overflow-hidden rounded-2xl border border-brand-black/10 bg-brand-cream shadow-sm">
              <iframe
                src={STORE_MAP_EMBED_URL}
                title={`Ubicación del local de Full Spin: ${STORE_ADDRESS}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 sm:h-[400px] lg:h-full lg:min-h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-black/15 bg-white p-10 text-center">
              <Store className="mx-auto mb-4 h-10 w-10 text-brand-black/30" />
              <h2 className="text-lg font-bold text-brand-black">
                Estamos actualizando el stock del local
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-brand-black/70">
                Por el momento no hay productos cargados como disponibles en
                el local. Escribinos por WhatsApp y te contamos qué tenemos
                en este momento.
              </p>
              <div className="mt-6">
                <Button asChild variant="black">
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Consultar disponibilidad
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-base font-semibold text-brand-black">
                  {products.length}{" "}
                  {products.length === 1 ? "producto" : "productos"} en el local
                </h2>
              </div>
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
