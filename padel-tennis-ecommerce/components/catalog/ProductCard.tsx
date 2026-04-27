import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Truck } from "lucide-react"

import ProductBrandLogo from "@/components/catalog/ProductBrandLogo"
import { Button } from "@/components/ui/button"
import {
  creditTotalPrice,
  formatPrice,
  installmentPrice,
  INSTALLMENT_COUNT,
  subcategoryLabel,
} from "@/lib/catalog"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
}

function buildWhatsAppHref(product: Product) {
  const message = `Hola! Me interesa el producto: ${product.name}. ¿Está disponible?`
  return `https://wa.me/543705103672?text=${encodeURIComponent(message)}`
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const finalPrice =
    product.in_offer && product.offer_percent > 0
      ? Math.round(product.price * (1 - product.offer_percent / 100))
      : product.price

  const productHref = `/producto/${product.id}`
  const cuota = installmentPrice(finalPrice)
  const creditTotal = creditTotalPrice(finalPrice)

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-black/10 bg-white transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      {product.in_offer && product.offer_percent > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-brand-black shadow-sm">
          -{product.offer_percent}%
        </span>
      )}

      <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-blue-dark px-3 py-1.5 text-xs font-semibold text-brand-cream shadow-sm">
        <Truck className="h-3.5 w-3.5" />
        Envío gratis
      </span>

      <Link
        href={productHref}
        aria-label={`Ver detalles de ${product.name}`}
        className="focus-ring relative block aspect-square w-full overflow-hidden bg-white"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 border-t border-brand-black/5 p-3">
        <div className="flex h-7 items-center">
          <ProductBrandLogo marca={product.marca} maxHeight={24} />
        </div>

        <Link
          href={productHref}
          className="focus-ring text-left text-sm font-semibold leading-snug text-brand-black line-clamp-2 hover:text-brand-blue-dark min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        <p className="text-xs text-brand-black/55">
          {subcategoryLabel(product.subcategory)}
        </p>

        <div className="mt-auto space-y-1.5">
          {product.in_offer && product.offer_percent > 0 && (
            <p className="text-xs text-brand-black/40 line-through leading-none">
              {formatPrice(creditTotalPrice(product.price))}
            </p>
          )}
          <div>
            <p className="text-xl font-extrabold text-brand-black leading-tight">
              {formatPrice(creditTotal)}
            </p>
            <p className="text-[11px] text-brand-black/75 leading-tight">
              {INSTALLMENT_COUNT} cuotas sin interés de{" "}
              <span className="font-bold text-brand-black">
                {formatPrice(cuota)}
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

          <Button asChild variant="neon" size="sm" className="w-full">
            <a
              href={buildWhatsAppHref(product)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}
