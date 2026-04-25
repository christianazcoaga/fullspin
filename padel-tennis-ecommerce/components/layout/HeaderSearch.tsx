"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Loader2, Search, X } from "lucide-react"

import { searchProducts, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 0 }).replace(/,/g, ".")}`
}

function categoryLabel(category: string) {
  if (category === "padel") return "Padel"
  if (category === "tenis-mesa") return "Tenis de Mesa"
  return "Tenis"
}

interface HeaderSearchProps {
  /** Layout: inline (desktop) or full-width (mobile drawer). */
  layout?: "inline" | "full"
  className?: string
}

export default function HeaderSearch({ layout = "inline", className }: HeaderSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(trimmed)
        setResults(data)
      } catch (err) {
        console.error("Header search failed:", err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Click outside / Escape to close
  useEffect(() => {
    function handlePointer(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handlePointer)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handlePointer)
      document.removeEventListener("keydown", handleKey)
    }
  }, [])

  function goToFullSearch(q: string) {
    if (!q.trim()) return
    router.push(`/buscar?q=${encodeURIComponent(q.trim())}`)
    setOpen(false)
  }

  function handleResultClick(p: Product) {
    router.push(`/producto/${p.id}`)
    setOpen(false)
    setQuery("")
  }

  const showDropdown =
    open && (loading || results.length > 0 || query.trim().length >= 2)

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        layout === "inline" ? "w-full max-w-md" : "w-full",
        className
      )}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          goToFullSearch(query)
        }}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-black/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            className="w-full rounded-lg border border-brand-black/15 bg-white py-2 pl-10 pr-9 text-sm text-brand-black placeholder:text-brand-black/50 focus:border-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-brand-blue-dark/30 transition-colors duration-200"
            style={{ fontSize: "16px" }}
          />
          {query && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => {
                setQuery("")
                setResults([])
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-brand-black/10 bg-white shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-brand-black/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando productos...
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-[60vh] divide-y divide-brand-black/5 overflow-y-auto">
              {results.slice(0, 8).map((p) => {
                const final = p.in_offer
                  ? Math.round(p.price * (1 - p.offer_percent / 100))
                  : p.price
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => handleResultClick(p)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-cream"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-brand-black/10">
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-brand-black">
                          {p.name}
                        </p>
                        <p className="text-xs text-brand-black/60">
                          {p.marca} • {categoryLabel(p.category)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-brand-black">
                          {formatPrice(final)}
                        </p>
                        {p.in_offer && (
                          <p className="text-xs font-medium text-brand-orange">
                            -{p.offer_percent}%
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
              <li>
                <button
                  type="button"
                  onClick={() => goToFullSearch(query)}
                  className="block w-full bg-brand-cream px-4 py-3 text-center text-sm font-semibold text-brand-blue-dark hover:underline"
                >
                  Ver todos los resultados →
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-6 text-center text-sm text-brand-black/60">
              <Search className="mx-auto mb-2 h-8 w-8 text-brand-black/30" />
              No se encontraron productos para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
