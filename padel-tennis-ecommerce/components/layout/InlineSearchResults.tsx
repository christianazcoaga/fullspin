"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"

import ProductCard from "@/components/catalog/ProductCard"
import { Button } from "@/components/ui/button"
import { categoryLabel, SORT_OPTIONS, type SortKey } from "@/lib/catalog"
import { searchProducts, type Product } from "@/lib/products"
import { useSearch } from "./SearchProvider"

const PAGE_SIZE = 12
const PAGE_STEP = 8

export default function InlineSearchResults() {
  const { debouncedQuery, query, clear } = useSearch()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterMarca, setFilterMarca] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortKey>("newest")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    setVisibleCount(PAGE_SIZE)

    if (!debouncedQuery) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    searchProducts(debouncedQuery)
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        console.error("Inline search failed:", err)
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const uniqueMarcas = useMemo(
    () => Array.from(new Set(products.map((p) => p.marca))).sort(),
    [products]
  )
  const uniqueCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  )

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false
      if (filterMarca !== "all" && p.marca !== filterMarca) return false
      return true
    })

    const finalPrice = (p: Product) =>
      p.in_offer && p.offer_percent > 0
        ? p.price * (1 - p.offer_percent / 100)
        : p.price

    return list.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "es")
        case "price-asc":
          return finalPrice(a) - finalPrice(b)
        case "price-desc":
          return finalPrice(b) - finalPrice(a)
        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
      }
    })
  }, [products, filterCategory, filterMarca, sortBy])

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  const selectClass =
    "h-10 rounded-lg border border-brand-black/15 bg-white px-3 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-blue-dark/40 focus:border-brand-blue-dark"

  return (
    <div className="bg-brand-cream">
      <section className="border-b border-brand-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-brand-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-black/70">
            Búsqueda
          </span>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-balance text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-brand-black">
                Resultados para “{query}”
              </h1>
              <p className="mt-1 text-sm text-brand-black/60">
                {loading
                  ? "Buscando productos…"
                  : `${filtered.length} producto${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clear}>
              Cancelar búsqueda
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-black/5 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={selectClass}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>

          <select
            value={filterMarca}
            onChange={(e) => setFilterMarca(e.target.value)}
            className={selectClass}
            aria-label="Filtrar por marca"
          >
            <option value="all">Todas las marcas</option>
            {uniqueMarcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className={`${selectClass} ml-auto`}
            aria-label="Ordenar resultados"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && products.length === 0 ? (
          <SearchSkeletonGrid />
        ) : !loading && filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-black/5">
              <Search className="h-8 w-8 text-brand-black/40" />
            </div>
            <p className="text-base font-semibold text-brand-black">
              No se encontraron productos
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-brand-black/60">
              No encontramos resultados para “{query}”. Probá con otra palabra o
              revisá los filtros.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`flex flex-wrap justify-center gap-5 transition-opacity duration-150 ${loading ? "opacity-60" : "opacity-100"}`}
              aria-busy={loading}
            >
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
                />
              ))}
            </div>

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
          </>
        )}
      </div>
    </div>
  )
}

function SearchSkeletonGrid() {
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
