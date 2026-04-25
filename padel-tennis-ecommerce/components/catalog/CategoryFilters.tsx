"use client"

import { Filter, Search, X } from "lucide-react"

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
  type SubcategorySlug,
} from "@/lib/catalog"
import type { FilterState } from "@/hooks/useCategoryFilters"

interface CategoryFiltersProps {
  filters: FilterState
  brands: string[]
  subcategories: SubcategorySlug[]
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  /** Hide the subcategory select (used on /ofertas). */
  hideSubcategory?: boolean
}

function FilterControls({
  filters,
  brands,
  subcategories,
  onChange,
  hideSubcategory,
  layout,
}: CategoryFiltersProps & { layout: "row" | "column" }) {
  const triggerClass =
    layout === "row"
      ? "w-full sm:w-44 rounded-lg border-brand-black/15"
      : "w-full rounded-lg border-brand-black/15"

  return (
    <>
      {!hideSubcategory && (
        <Select
          value={filters.subcategory}
          onValueChange={(value) =>
            onChange("subcategory", value as FilterState["subcategory"])
          }
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
      )}

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
          onChange("sort", value as FilterState["sort"])
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

export default function CategoryFilters(props: CategoryFiltersProps) {
  const { filters, onChange } = props

  return (
    <div className="sticky top-16 z-30 border-b border-brand-black/10 bg-brand-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:gap-4 lg:px-8">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-black/50" />
          <Input
            type="search"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Buscar productos…"
            aria-label="Buscar"
            className="rounded-lg border-brand-black/15 bg-white pl-10 pr-9 text-sm focus-visible:ring-brand-blue-dark/30"
            style={{ fontSize: "16px" }}
          />
          {filters.search && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => onChange("search", "")}
              className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-brand-black/50 hover:bg-brand-black/5 hover:text-brand-black"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="hidden lg:flex lg:flex-row lg:gap-3">
          <FilterControls {...props} layout="row" />
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
                <FilterControls {...props} layout="column" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
