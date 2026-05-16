"use client"

import { Filter, Search, Store, X } from "lucide-react"
import { useMemo, useState } from "react"

import ProductCard from "@/components/catalog/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  PRICE_RANGES,
  SORT_OPTIONS,
  SUBCATEGORY_LABELS,
  categoryLabel,
  subcategoryLabel,
  type CategorySlug,
  type SortKey,
  type SubcategorySlug,
} from "@/lib/catalog"
import type { Product } from "@/lib/products"

interface LocalFilterState {
  search: string
  category: CategorySlug | "all"
  subcategory: SubcategorySlug | "all"
  brand: string
  priceRange: string
  sort: SortKey
}

const INITIAL_STATE: LocalFilterState = {
  search: "",
  category: "all",
  subcategory: "all",
  brand: "all",
  priceRange: "all",
  // Local page defaults to alphabetical: visitors come here to scan the shelf
  // for a specific product, not to discover what's new.
  sort: "name",
}

const CATEGORY_ORDER: Record<string, number> = {
  padel: 0,
  tenis: 1,
  "tenis-mesa": 2,
}

// Lower number = appears first inside its category. Palas/paletas/raquetas
// (the headline product per sport) lead; accesorios always closes last.
const SUBCATEGORY_ORDER: Record<string, number> = {
  palas: 0,
  paletas: 0,
  raquetas: 0,
  pelotas: 1,
  bolsos: 2,
  ropa: 3,
  gomas: 4,
  zapatillas: 5,
  mesas: 6,
  accesorios: 99,
}

type ProductGroup = {
  key: string
  label: string
  products: Product[]
}

function groupByCategoryAndSubcategory(products: Product[]): ProductGroup[] {
  const sorted = [...products].sort((a, b) => {
    const ca = CATEGORY_ORDER[a.category] ?? 99
    const cb = CATEGORY_ORDER[b.category] ?? 99
    if (ca !== cb) return ca - cb
    const sa = SUBCATEGORY_ORDER[a.subcategory] ?? 50
    const sb = SUBCATEGORY_ORDER[b.subcategory] ?? 50
    if (sa !== sb) return sa - sb
    return (a.subcategory ?? "").localeCompare(b.subcategory ?? "", "es")
  })

  const map = new Map<string, ProductGroup>()
  for (const p of sorted) {
    const key = `${p.category}::${p.subcategory ?? "otros"}`
    let group = map.get(key)
    if (!group) {
      group = {
        key,
        label: `${categoryLabel(p.category)} · ${subcategoryLabel(p.subcategory)}`,
        products: [],
      }
      map.set(key, group)
    }
    group.products.push(p)
  }
  return Array.from(map.values())
}

interface FilterControlsProps {
  filters: LocalFilterState
  categories: (CategorySlug | "all")[]
  subcategories: SubcategorySlug[]
  brands: string[]
  onChange: <K extends keyof LocalFilterState>(
    key: K,
    value: LocalFilterState[K]
  ) => void
  layout: "row" | "column"
}

function FilterControls({
  filters,
  categories,
  subcategories,
  brands,
  onChange,
  layout,
}: FilterControlsProps) {
  const triggerClass =
    layout === "row"
      ? "w-full sm:w-44 rounded-lg border-brand-black/15"
      : "w-full rounded-lg border-brand-black/15"

  return (
    <>
      <Select
        value={filters.category}
        onValueChange={(value) => {
          onChange("category", value as LocalFilterState["category"])
          // Reset subcategory when category changes — subcategories shown
          // depend on which category is active.
          onChange("subcategory", "all")
        }}
      >
        <SelectTrigger className={triggerClass} aria-label="Categoría">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories
            .filter((c) => c !== "all")
            .map((c) => (
              <SelectItem key={c} value={c}>
                {categoryLabel(c)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.subcategory}
        onValueChange={(value) =>
          onChange("subcategory", value as LocalFilterState["subcategory"])
        }
        disabled={subcategories.length === 0}
      >
        <SelectTrigger className={triggerClass} aria-label="Subcategoría">
          <SelectValue placeholder="Subcategoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las subcategorías</SelectItem>
          {subcategories.map((sub) => (
            <SelectItem key={sub} value={sub}>
              {SUBCATEGORY_LABELS[sub]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priceRange}
        onValueChange={(value) => onChange("priceRange", value)}
      >
        <SelectTrigger className={triggerClass} aria-label="Precio">
          <SelectValue placeholder="Precio" />
        </SelectTrigger>
        <SelectContent>
          {PRICE_RANGES.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.brand}
        onValueChange={(value) => onChange("brand", value)}
      >
        <SelectTrigger className={triggerClass} aria-label="Marca">
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las marcas</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sort}
        onValueChange={(value) =>
          onChange("sort", value as LocalFilterState["sort"])
        }
      >
        <SelectTrigger className={triggerClass} aria-label="Ordenar por">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

interface LocalProductBrowserProps {
  products: Product[]
}

export default function LocalProductBrowser({
  products,
}: LocalProductBrowserProps) {
  const [filters, setFilters] = useState<LocalFilterState>(INITIAL_STATE)

  const update = <K extends keyof LocalFilterState>(
    key: K,
    value: LocalFilterState[K]
  ) => setFilters((prev) => ({ ...prev, [key]: value }))

  const reset = () => setFilters(INITIAL_STATE)

  // Categories present in the actual local stock — keeps the dropdown honest
  // about what the visitor can find.
  const categories = useMemo<(CategorySlug | "all")[]>(() => {
    const set = new Set<CategorySlug>()
    for (const p of products) {
      if (p.category === "padel" || p.category === "tenis-mesa") {
        set.add(p.category)
      }
    }
    return ["all", ...Array.from(set).sort()]
  }, [products])

  // Subcategories scoped to the selected category (or across all stock when
  // category=all). Filtered to keys present in SUBCATEGORY_LABELS so the
  // dropdown never shows a "raw" slug.
  const subcategories = useMemo<SubcategorySlug[]>(() => {
    const set = new Set<string>()
    for (const p of products) {
      if (filters.category !== "all" && p.category !== filters.category) continue
      if (p.subcategory) set.add(p.subcategory)
    }
    return Array.from(set)
      .filter((s): s is SubcategorySlug => s in SUBCATEGORY_LABELS)
      .sort((a, b) => SUBCATEGORY_LABELS[a].localeCompare(SUBCATEGORY_LABELS[b]))
  }, [products, filters.category])

  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.marca).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [products]
  )

  const isFiltering =
    filters.search.trim() !== "" ||
    filters.category !== "all" ||
    filters.subcategory !== "all" ||
    filters.brand !== "all" ||
    filters.priceRange !== "all" ||
    filters.sort !== INITIAL_STATE.sort

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    const range = PRICE_RANGES.find((r) => r.value === filters.priceRange)

    const out = products.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) {
        return false
      }
      if (filters.subcategory !== "all" && p.subcategory !== filters.subcategory) {
        return false
      }
      if (filters.brand !== "all" && p.marca !== filters.brand) {
        return false
      }
      if (range && range.value !== "all") {
        if (p.price < range.min) return false
        if (range.max !== undefined && p.price > range.max) return false
      }
      if (search) {
        const haystack =
          `${p.name} ${p.marca} ${p.category} ${p.subcategory}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })

    out.sort((a, b) => {
      if (a.in_offer && !b.in_offer) return -1
      if (!a.in_offer && b.in_offer) return 1
      switch (filters.sort) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
      }
    })

    return out
  }, [products, filters])

  const groups = useMemo(
    () => groupByCategoryAndSubcategory(filtered),
    [filtered]
  )

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 border-y border-brand-black/10 bg-brand-cream/95 backdrop-blur supports-[backdrop-filter]:bg-brand-cream/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:gap-4 lg:px-8">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-black/50" />
            <Input
              type="search"
              value={filters.search}
              onChange={(e) => update("search", e.target.value)}
              placeholder="Buscar en el local…"
              aria-label="Buscar"
              className="rounded-lg border-brand-black/15 bg-white pl-10 pr-9 text-sm focus-visible:ring-brand-blue-dark/30"
              style={{ fontSize: "16px" }}
            />
            {filters.search && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => update("search", "")}
                className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-brand-black/50 hover:bg-brand-black/5 hover:text-brand-black"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="hidden lg:flex lg:flex-row lg:gap-3">
            <FilterControls
              filters={filters}
              categories={categories}
              subcategories={subcategories}
              brands={brands}
              onChange={update}
              layout="row"
            />
            {isFiltering && (
              <Button
                variant="ghost"
                onClick={reset}
                className="shrink-0"
                aria-label="Limpiar filtros"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4" />
                  Filtros y orden
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-brand-cream">
                <SheetHeader>
                  <SheetTitle>Filtros y orden</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 py-4">
                  <FilterControls
                    filters={filters}
                    categories={categories}
                    subcategories={subcategories}
                    brands={brands}
                    onChange={update}
                    layout="column"
                  />
                  {isFiltering && (
                    <Button variant="outline" onClick={reset}>
                      <X className="h-4 w-4" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Result count + content */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-base font-semibold text-brand-black">
            {filtered.length}{" "}
            {filtered.length === 1 ? "producto" : "productos"} disponibles
            {isFiltering ? " que coinciden con tu búsqueda" : " en el local"}
          </h2>
          <p className="text-xs text-brand-black/60">
            Coordiná tu visita por WhatsApp para verlos en persona.
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-black/15 bg-white py-16 text-center">
            <Store className="mx-auto mb-4 h-10 w-10 text-brand-black/30" />
            <p className="text-base font-semibold text-brand-black">
              No encontramos productos con esos filtros
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-brand-black/60">
              Probá ajustando la búsqueda o limpiando los filtros.
            </p>
            {isFiltering && (
              <div className="mt-6">
                <Button variant="outline" onClick={reset}>
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        ) : isFiltering ? (
          // Flat grid when filters are active — preserves the user's mental
          // model of "search results".
          <ul className="flex flex-wrap justify-center gap-5">
            {filtered.map((product) => (
              <li
                key={product.id}
                className="flex w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
              >
                <ProductCard product={product} className="w-full" />
              </li>
            ))}
          </ul>
        ) : (
          // Default view: group products by (category, subcategory) sections.
          <div className="space-y-12">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={`group-${group.key}`}>
                <div className="mb-4 flex items-baseline gap-3 border-b border-brand-black/10 pb-2">
                  <h3
                    id={`group-${group.key}`}
                    className="text-lg font-bold tracking-tight text-brand-black sm:text-xl"
                  >
                    {group.label}
                  </h3>
                  <span className="text-xs font-medium text-brand-black/55">
                    {group.products.length}{" "}
                    {group.products.length === 1 ? "producto" : "productos"}
                  </span>
                </div>
                <ul className="flex flex-wrap justify-center gap-5">
                  {group.products.map((product) => (
                    <li
                      key={product.id}
                      className="flex w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
                    >
                      <ProductCard product={product} className="w-full" />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
