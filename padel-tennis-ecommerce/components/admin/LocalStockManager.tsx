"use client"

import Image from "next/image"
import { useMemo, useState, useTransition } from "react"
import { AlertCircle, Minus, Plus, Search, Store } from "lucide-react"

import {
  setLocalStockCountAction,
  toggleLocalStockAction,
} from "@/app/admin/local-stock-actions"
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
 * Per-product toggle + unit count for the storefront. Admin marks which
 * products are physically available and how many of each. The /local page
 * hides products with count = 0, so when something sells out the admin
 * just lowers the count and it disappears.
 *
 * Optimistic updates on every interaction; server errors revert.
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

  const stats = useMemo(() => {
    let active = 0
    let units = 0
    let outOfStock = 0
    for (const p of products) {
      if (p.in_local_stock) {
        active++
        units += p.local_stock_count ?? 0
        if ((p.local_stock_count ?? 0) === 0) outOfStock++
      }
    }
    return { active, units, outOfStock }
  }, [products])

  const handleToggle = (id: number, next: boolean) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    const currentCount = product.local_stock_count ?? 0
    // Mirror the server-side rule so the UI stays in sync without waiting
    // for the round-trip (toggle ON guarantees count ≥ 1; OFF resets to 0).
    const nextCount = next ? Math.max(1, currentCount) : 0

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, in_local_stock: next, local_stock_count: nextCount }
          : p
      )
    )
    setError(null)

    startTransition(async () => {
      const r = await toggleLocalStockAction(id, next, currentCount)
      if (!r.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, in_local_stock: !next, local_stock_count: currentCount }
              : p
          )
        )
        setError(r.error ?? "No se pudo guardar el cambio.")
      }
    })
  }

  const handleCountChange = (id: number, next: number) => {
    const safe = Math.max(0, Math.floor(next || 0))
    const product = products.find((p) => p.id === id)
    if (!product) return
    const previous = product.local_stock_count ?? 0
    if (previous === safe) return

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, local_stock_count: safe } : p))
    )
    setError(null)

    startTransition(async () => {
      const r = await setLocalStockCountAction(id, safe)
      if (!r.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, local_stock_count: previous } : p))
        )
        setError(r.error ?? "No se pudo guardar la cantidad.")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-brand-black">Stock en el local</h2>
          <p className="text-xs text-brand-black/60">
            Marcá los productos disponibles en el local y la cantidad de cada
            uno. Si el contador llega a 0, el producto deja de aparecer en{" "}
            <code className="rounded bg-brand-black/5 px-1 text-[10px]">/local</code>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-blue-dark/10 px-2.5 py-1.5 text-brand-blue-dark">
            <Store className="h-3.5 w-3.5" />
            {stats.active} activos
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-black/5 px-2.5 py-1.5 text-brand-black/70">
            {stats.units} unidades
          </span>
          {stats.outOfStock > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[hsl(var(--status-warning))]/15 px-2.5 py-1.5 text-[hsl(var(--status-warning))]">
              <AlertCircle className="h-3.5 w-3.5" />
              {stats.outOfStock} agotados
            </span>
          )}
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
          Sólo activos
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
              <ProductRow
                key={p.id}
                product={p}
                onToggle={handleToggle}
                onCountChange={handleCountChange}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ProductRow({
  product: p,
  onToggle,
  onCountChange,
}: {
  product: Product
  onToggle: (id: number, next: boolean) => void
  onCountChange: (id: number, next: number) => void
}) {
  const isActive = p.in_local_stock
  const count = p.local_stock_count ?? 0
  const isOutOfStock = isActive && count === 0

  return (
    <li
      className={`flex items-center gap-3 px-3 py-2 ${
        isOutOfStock ? "bg-[hsl(var(--status-warning))]/5" : "hover:bg-brand-cream/50"
      }`}
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
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-brand-black">
            {p.name}
          </p>
          {isOutOfStock && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--status-warning))]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--status-warning))]">
              <AlertCircle className="h-3 w-3" />
              Agotado
            </span>
          )}
        </div>
        <p className="truncate text-[11px] text-brand-black/55">
          {p.marca || "—"} · {categoryLabel(p.category)}
        </p>
      </div>

      {/* Count stepper, only meaningful when active */}
      {isActive && (
        <CountStepper
          value={count}
          onChange={(v) => onCountChange(p.id, v)}
          aria-label={`Cantidad de ${p.name} en el local`}
        />
      )}

      <Switch
        checked={p.in_local_stock}
        onCheckedChange={(v) => onToggle(p.id, v)}
        aria-label={
          p.in_local_stock
            ? `Quitar ${p.name} del stock local`
            : `Marcar ${p.name} como en stock local`
        }
      />
    </li>
  )
}

function CountStepper({
  value,
  onChange,
  ...rest
}: {
  value: number
  onChange: (next: number) => void
  "aria-label"?: string
}) {
  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-md border border-brand-black/15 bg-white"
      {...rest}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        aria-label="Restar uno"
        className="flex h-8 w-8 items-center justify-center text-brand-black/70 hover:bg-brand-black/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (!Number.isFinite(n)) return
          onChange(Math.max(0, Math.floor(n)))
        }}
        className="h-8 w-12 border-x border-brand-black/15 bg-white text-center text-sm font-semibold text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-blue-dark [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Sumar uno"
        className="flex h-8 w-8 items-center justify-center text-brand-black/70 hover:bg-brand-black/5"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
