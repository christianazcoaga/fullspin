"use client"

import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSearch } from "./SearchProvider"

interface HeaderSearchProps {
  /** Layout: inline (desktop) or full-width (mobile drawer). */
  layout?: "inline" | "full"
  className?: string
}

export default function HeaderSearch({ layout = "inline", className }: HeaderSearchProps) {
  const { query, setQuery, clear } = useSearch()

  return (
    <div
      className={cn(
        "relative",
        layout === "inline" ? "w-full max-w-md" : "w-full",
        className
      )}
    >
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-black/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            className="w-full rounded-lg border border-brand-black/15 bg-white py-2 pl-10 pr-9 text-sm text-brand-black placeholder:text-brand-black/50 focus:border-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-brand-blue-dark/30 transition-colors duration-200"
            style={{ fontSize: "16px" }}
          />
          {query && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={clear}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
