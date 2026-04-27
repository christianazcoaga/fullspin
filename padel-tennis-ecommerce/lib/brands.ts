// Types and constants shared by both server and client code. Server-only
// queries live in `./brands.server.ts`.

export type BrandSport = "padel" | "tenis-mesa"

export type Brand = {
  id: number
  name: string
  logo_url: string | null
  sport: BrandSport
  display_order: number
  created_at: string
}

export const BRAND_SPORTS: BrandSport[] = ["padel", "tenis-mesa"]

export const BRAND_SPORT_LABELS: Record<BrandSport, string> = {
  padel: "Padel",
  "tenis-mesa": "Tenis de Mesa",
}
