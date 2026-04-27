// Single source of truth for catalog metadata used by the catalog pages
// (/padel, /tenis-mesa, /ofertas) and by the home page.

export type CategorySlug = "padel" | "tenis-mesa"
export type CatalogSlug = CategorySlug | "ofertas"

export type SubcategorySlug =
  | "palas"
  | "paletas"
  | "pelotas"
  | "bolsos"
  | "ropa"
  | "accesorios"
  | "gomas"
  // legacy slugs kept for type compatibility — not in current inventory
  | "raquetas"
  | "zapatillas"
  | "mesas"

export type CategoryConfig = {
  slug: CategorySlug
  label: string
  /** Heading displayed at the top of the category page. */
  heroTitle: string
  /** Tagline shown under the heading. */
  heroDescription: string
  /** Pill text shown above the heading. */
  heroEyebrow: string
  /** Subcategories shown in the filters dropdown. */
  subcategories: SubcategorySlug[]
}

// Subcategories listed match what actually exists in productos_fullspin —
// validated against the live DB on 2026-04-25. If new ones appear in
// inventory, add them here so the filter dropdown picks them up.
export const CATEGORIES: Record<CategorySlug, CategoryConfig> = {
  padel: {
    slug: "padel",
    label: "Padel",
    heroEyebrow: "Catálogo Padel",
    heroTitle: "Equipamiento de padel",
    heroDescription:
      "Somos especialistas en padel en Argentina. Las mejores marcas, envíos a todo el país.",
    subcategories: ["palas", "bolsos", "pelotas", "ropa", "accesorios"],
  },
  "tenis-mesa": {
    slug: "tenis-mesa",
    label: "Tenis de Mesa",
    heroEyebrow: "Catálogo Tenis de Mesa",
    heroTitle: "Equipamiento de tenis de mesa",
    heroDescription:
      "Paletas, gomas, pelotas y accesorios para todos los niveles.",
    subcategories: ["paletas", "gomas", "pelotas", "ropa", "accesorios"],
  },
}

export const OFFERS_CONFIG = {
  slug: "ofertas" as const,
  label: "Ofertas",
  heroEyebrow: "Descuentos especiales",
  heroTitle: "Ofertas",
  heroDescription:
    "Productos con descuento en padel y tenis de mesa. Stock limitado.",
}

export const SUBCATEGORY_LABELS: Record<SubcategorySlug, string> = {
  palas: "Palas",
  paletas: "Paletas",
  raquetas: "Raquetas",
  zapatillas: "Zapatillas",
  pelotas: "Pelotas",
  bolsos: "Bolsos",
  ropa: "Ropa",
  accesorios: "Accesorios",
  gomas: "Gomas",
  mesas: "Mesas",
}

export type BrandLogo = {
  src: string
  alt: string
  width: number
  height: number
}

// Brands actually present in productos_fullspin as of 2026-04-25:
// Adidas (67), Wilson (48), Butterfly (43), DHS (10), Nox (2), Nassau (1).
// Logos for brands that do not (yet) ship in inventory are kept around
// because they are referenced by the home BrandLogosCarousel — adding
// them here is harmless (BRAND_LOGOS is a registry, not an enum).
export const BRAND_LOGOS: Record<string, BrandLogo> = {
  Adidas: { src: "/optimized/adidas-logo.webp", alt: "Adidas", width: 60, height: 24 },
  Wilson: { src: "/optimized/wilson-logo.webp", alt: "Wilson", width: 80, height: 24 },
  Butterfly: { src: "/optimized/butterfly-logo.webp", alt: "Butterfly", width: 80, height: 24 },
  DHS: { src: "/optimized/dhs-logo.webp", alt: "DHS", width: 80, height: 24 },
  // Nox / Nassau: no logo asset yet; ProductCard falls back to plain text.
  // Head / Bullpadel / Babolat / Dunlop / Sanwei: not in inventory but
  // referenced from the home BrandLogosCarousel.
  Head: { src: "/optimized/head-logo.webp", alt: "Head", width: 80, height: 24 },
  Bullpadel: { src: "/optimized/bullpadel-logo.webp", alt: "Bullpadel", width: 90, height: 24 },
  Babolat: { src: "/babolat-logo.png", alt: "Babolat", width: 80, height: 24 },
  Dunlop: { src: "/optimized/dunlop-logo.webp", alt: "Dunlop", width: 80, height: 24 },
  Sanwei: { src: "/optimized/sanwei-logo.webp", alt: "Sanwei", width: 80, height: 24 },
}

export type PriceRange = {
  value: string
  label: string
  min: number
  max?: number
}

export const PRICE_RANGES: PriceRange[] = [
  { value: "all", label: "Todos los precios", min: 0 },
  { value: "0-50000", label: "Hasta $50.000", min: 0, max: 50000 },
  { value: "50000-100000", label: "$50.000 - $100.000", min: 50000, max: 100000 },
  { value: "100000-200000", label: "$100.000 - $200.000", min: 100000, max: 200000 },
  { value: "200000-999999", label: "Más de $200.000", min: 200000 },
]

export type SortKey = "newest" | "name" | "price-asc" | "price-desc"

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "name", label: "Nombre A-Z" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
]

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 0 }).replace(/,/g, ".")}`
}

// Pricing rules:
// - `product.price` in the DB is the cash / bank-transfer price (the cheaper
//   number — no surcharge).
// - The HEADLINE price shown in the UI is the credit-card total: cash + 25%,
//   payable in 3 cuotas sin interés. The cash price is shown below as the
//   discounted alternative.
export const INSTALLMENT_SURCHARGE = 0.25
export const INSTALLMENT_COUNT = 3

/** Total payable in 3 installments — cash price + 25% surcharge. */
export function creditTotalPrice(cashPrice: number): number {
  return Math.round(cashPrice * (1 + INSTALLMENT_SURCHARGE))
}

/** Per-installment amount for the 3 cuotas option. Rounded to whole pesos. */
export function installmentPrice(cashPrice: number): number {
  return Math.round((cashPrice * (1 + INSTALLMENT_SURCHARGE)) / INSTALLMENT_COUNT)
}

export function categoryLabel(category: string): string {
  if (category === "padel") return "Padel"
  if (category === "tenis-mesa") return "Tenis de Mesa"
  return category
}

export function subcategoryLabel(subcategory: string): string {
  return SUBCATEGORY_LABELS[subcategory as SubcategorySlug] ?? subcategory
}
