"use client"

import { createContext, useContext, type ReactNode } from "react"

// Map of brand name → logo_url, fed from the DB at the layout level so any
// product card can render the up-to-date logo without re-fetching.
type BrandLogoMap = Record<string, string>

const BrandLogosContext = createContext<BrandLogoMap>({})

export function BrandLogosProvider({
  logos,
  children,
}: {
  logos: BrandLogoMap
  children: ReactNode
}) {
  return (
    <BrandLogosContext.Provider value={logos}>
      {children}
    </BrandLogosContext.Provider>
  )
}

export function useBrandLogo(marca: string | null | undefined): string | null {
  const map = useContext(BrandLogosContext)
  if (!marca) return null
  return map[marca] ?? null
}
