"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"

import CategoryFilters from "@/components/catalog/CategoryFilters"
import CategoryHero from "@/components/catalog/CategoryHero"
import ProductCard from "@/components/catalog/ProductCard"
import { Button } from "@/components/ui/button"
import {
  CATEGORIES,
  OFFERS_CONFIG,
  type CatalogSlug,
  type CategorySlug,
  type SubcategorySlug,
} from "@/lib/catalog"
import {
  getProductsByCategory,
  type Product,
} from "@/lib/products"
import { useCategoryFilters } from "@/hooks/useCategoryFilters"

const PAGE_SIZE = 12
const PAGE_STEP = 8

interface CategoryPageProps {
  category: CatalogSlug
}

const ALL_CATEGORIES: CategorySlug[] = ["padel", "tenis", "tenis-mesa"]

async function loadProducts(category: CatalogSlug): Promise<Product[]> {
  if (category === "ofertas") {
    const lists = await Promise.all(
      ALL_CATEGORIES.map((c) => getProductsByCategory(c))
    )
    return lists.flat().filter((p) => p.in_offer)
  }
  return getProductsByCategory(category)
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setVisibleCount(PAGE_SIZE)
    loadProducts(category)
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category])

  const { filters, update, filtered, brands } = useCategoryFilters(products)

  const config =
    category === "ofertas" ? OFFERS_CONFIG : CATEGORIES[category]

  const subcategories: SubcategorySlug[] =
    category === "ofertas" ? [] : CATEGORIES[category].subcategories

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  return (
    <div className="bg-brand-cream">
      <CategoryHero
        eyebrow={config.heroEyebrow}
        title={config.heroTitle}
        description={config.heroDescription}
      />

      <CategoryFilters
        filters={filters}
        brands={brands}
        subcategories={subcategories}
        onChange={update}
        hideSubcategory={category === "ofertas"}
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-balance text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-brand-black">
            {filters.search
              ? `Resultados para "${filters.search}"`
              : config.heroTitle}
          </h2>
          <p className="text-sm text-brand-black/60">
            {loading
              ? "Cargando…"
              : `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {loading ? (
          <CatalogSkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-black/5">
              <Search className="h-8 w-8 text-brand-black/40" />
            </div>
            <p className="text-base font-semibold text-brand-black">
              No se encontraron productos
            </p>
            <p className="mt-1 text-sm text-brand-black/60">
              Probá ajustando los filtros o la búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="black"
              size="lg"
              onClick={() => setVisibleCount((prev) => prev + PAGE_STEP)}
            >
              Cargar más productos
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

function CatalogSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-brand-black/10 bg-white"
        >
          <div className="aspect-square animate-pulse bg-brand-black/5" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-brand-black/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-brand-black/10" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-brand-black/10" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-brand-black/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
