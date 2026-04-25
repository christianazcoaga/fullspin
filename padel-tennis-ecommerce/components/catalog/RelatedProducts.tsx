import ProductCard from "@/components/catalog/ProductCard"
import type { Product } from "@/lib/products"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-brand-black/10 bg-brand-cream py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="related-heading"
          className="mb-8 text-balance text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-brand-black"
        >
          Productos relacionados
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
