"use client"

import Image from "next/image"
import { useMemo, useState, useTransition } from "react"
import { Search, Store } from "lucide-react"

import { toggleLocalStockAction } from "@/app/admin/local-stock-actions"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { categoryLabel } from "@/lib/catalog"
import type { Product } from "@/lib/products"

interface LocalStockManagerProps {
  initialProducts: Product[]
}

const CATEGORY_FILTERS: { value: "all" | "padel" | "tenis" | "tenis-mesa"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "padel", label: "Padel" },
  { value: "tenis", label: "Tenis" },
  { value: "tenis-mesa", label: "Tenis de Mesa" },
]

/**
 * Per-product toggle for the "in physical store" flag. The rest of the
 * product attributes are NOT editable here — this view is intentionally
 * focused on a single decision: ¿está disponible en el local?
 *
 * Optimistic update: the switch flips instantly and the server call
 * happens in a transition. If the server reports an error, the toggle
 * reverts and a message is shown.
 */
export default function LocalStockManager({ initialProducts }: LocalStockManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<typeof CATEGORY_FILTERS[number]["value"]>("all")
  const [showOnlyInLocal, setShowOnlyInLocal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false
      if (showOnlyInLocal && !p.in_local_stock) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        (p.marca ?? "").toLowerCase().includes(q)
      )
    })
  }, [products, search, category, showOnlyInLocal])

  const inLocalCount = useMemo(
    () => products.filter((p) => p.in_local_stock).length,
    [products]
  )

  const handleToggle = (id: number, next: boolean) => {
    // Optimistic update.
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, in_local_stock: next } : p))
    )
    setError(null)

    startTransition(async () => {
      const r = await toggleLocalStockAction(id, next)
      if (!r.success) {
        // Revert on failure.
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, in_local_stock: !next } : p))
        )
        setError(r.error ?? "No se pudo guardar el cambio.")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-brand-black">Stock en el local</h2>
          <p className="text-xs text-brand-black/60">
            Marcá los productos disponibles físicamente en el local. Aparecen
            destacados en la home como "Disponibles para retirar".
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md bg-brand-blue-dark/10 px-3 py-1.5 text-xs font-semibold text-brand-blue-dark">
          <Store className="h-3.5 w-3.5" />
          {inLocalCount} en el local
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-black/40" />
          <Input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as typeof CATEGORY_FILTERS[number]["value"])
          }
          className="rounded-md border border-brand-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-dark"
        >
          {CATEGORY_FILTERS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-brand-black/10 bg-white px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={showOnlyInLocal}
            onChange={(e) => setShowOnlyInLocal(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-brand-blue-dark"
          />
          Sólo en el local
        </label>
      </div>

      {error && (
        <p className="text-xs font-medium text-status-error-fg">{error}</p>
      )}

      {/* Product list */}
      <div className="overflow-hidden rounded-lg border border-brand-black/10 bg-white">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-brand-black/55">
            Ningún producto coincide con el filtro.
          </p>
        ) : (
          <ul className="divide-y divide-brand-black/5">
            {filtered.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-brand-cream/50"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-brand-cream">
                  <Image
                    src={p.image || "/placeholder.svg"}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-black">
                    {p.name}
                  </p>
                  <p className="truncate text-[11px] text-brand-black/55">
                    {p.marca || "—"} · {categoryLabel(p.category)}
                  </p>
                </div>
                <Switch
                  checked={p.in_local_stock}
                  onCheckedChange={(v) => handleToggle(p.id, v)}
                  aria-label={
                    p.in_local_stock
                      ? `Quitar ${p.name} del stock local`
                      : `Marcar ${p.name} como en stock local`
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
