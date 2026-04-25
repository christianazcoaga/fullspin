"use client"

import { useEffect } from "react"
import { ArrowRight, MessageCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"

const WHATSAPP_NUMBER = "543705103672"

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 0 }).replace(/,/g, ".")}`
}

function categoryLabel(category: string) {
  if (category === "padel") return "Padel"
  if (category === "tenis-mesa") return "Tenis de Mesa"
  return "Tenis"
}

function buildWhatsAppUrl(product: Product) {
  const message = product.coming_soon
    ? `Hola! Quiero consultar sobre la ${product.name} de ${product.marca} que estará disponible próximamente.`
    : `Hola! Me interesa la ${product.name} de ${product.marca}. ¿Tienen stock disponible?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

interface ProductQuickViewProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export default function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  // Lock body scroll while open + close on Escape
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKey)
    }
  }, [open, onClose])

  if (!open || !product) return null

  const finalPrice =
    product.in_offer && product.offer_percent > 0
      ? Math.round(product.price * (1 - product.offer_percent / 100))
      : product.price
  const savings = product.price - finalPrice

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-black/10 bg-white p-4 rounded-t-2xl">
          <h2 id="quick-view-title" className="text-xl font-bold text-brand-black">
            Detalles del producto
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream hover:bg-brand-black/5 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-brand-black" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square flex items-center justify-center rounded-2xl bg-white border border-brand-black/10 p-8">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full max-w-sm object-contain"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-brand-black">{product.name}</h3>
                <p className="mt-1 text-base font-medium text-brand-black/70">
                  {product.marca}
                </p>
                <p className="mt-1 text-sm text-brand-black/60">
                  {categoryLabel(product.category)}
                  {product.subcategory && ` • ${product.subcategory}`}
                </p>
              </div>

              {product.description && (
                <div>
                  <h4 className="mb-2 text-base font-semibold text-brand-black">
                    Descripción
                  </h4>
                  <p className="text-sm leading-relaxed text-brand-black/70">
                    {product.description}
                  </p>
                </div>
              )}

              {product.coming_soon ? (
                <div className="rounded-xl bg-brand-blue-light/15 p-6 text-center">
                  <span className="inline-flex items-center justify-center rounded-lg bg-brand-blue-dark px-6 py-3 text-lg font-bold text-white">
                    Próximamente
                  </span>
                  <p className="mt-3 text-sm text-brand-black/70">
                    Este producto estará disponible muy pronto
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-brand-cream p-6">
                  {product.in_offer && product.offer_percent > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-brand-black/40 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-brand-black">
                          -{product.offer_percent}%
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-brand-black">
                        {formatPrice(finalPrice)}
                      </div>
                      <p className="text-sm font-medium text-brand-black/70">
                        Ahorrás {formatPrice(savings)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-brand-black">
                      {formatPrice(product.price)}
                    </div>
                  )}
                </div>
              )}

              <Button asChild variant="neon" size="lg" className="w-full">
                <a
                  href={buildWhatsAppUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
