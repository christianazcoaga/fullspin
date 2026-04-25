"use client"

import { useMemo, useState } from "react"

import {
  PRICE_RANGES,
  type SortKey,
  type SubcategorySlug,
} from "@/lib/catalog"
import type { Product } from "@/lib/products"

export type FilterState = {
  search: string
  subcategory: SubcategorySlug | "all"
  brand: string
  priceRange: string
  sort: SortKey
}

const INITIAL_STATE: FilterState = {
  search: "",
  subcategory: "all",
  brand: "all",
  priceRange: "all",
  sort: "newest",
}

export function useCategoryFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_STATE)

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const reset = () => setFilters(INITIAL_STATE)

  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.marca).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [products]
  )

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    const range = PRICE_RANGES.find((r) => r.value === filters.priceRange)

    const out = products.filter((p) => {
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
        const haystack = `${p.name} ${p.marca} ${p.category} ${p.subcategory}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })

    out.sort((a, b) => {
      // Offers always rise to the top
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

  return {
    filters,
    update,
    reset,
    filtered,
    brands,
  }
}
