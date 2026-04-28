"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

const DEBOUNCE_MS = 250
export const SEARCH_MIN_LENGTH = 2

interface SearchContextValue {
  /** Raw input value, updated on every keystroke. */
  query: string
  setQuery: (value: string) => void
  clear: () => void
  /** Debounced query — what consumers should use to fetch. */
  debouncedQuery: string
  /** Whether `debouncedQuery` is long enough to trigger a search. */
  isActive: boolean
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [query])

  const value = useMemo<SearchContextValue>(() => {
    const trimmed = debouncedQuery.trim()
    return {
      query,
      setQuery,
      clear: () => setQuery(""),
      debouncedQuery: trimmed,
      isActive: trimmed.length >= SEARCH_MIN_LENGTH,
    }
  }, [query, debouncedQuery])

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext)
  if (!ctx) {
    throw new Error("useSearch must be used inside <SearchProvider>")
  }
  return ctx
}
