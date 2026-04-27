import { createClient as createBrowserClient } from "./supabase/client"

export type Product = {
  id: number
  name: string
  marca: string
  category: string
  subcategory: string
  price: number
  price_usd: number
  image: string
  /** Up to 4 extra image URLs. Together with `image` forms a gallery (max 5). */
  additional_images: string[]
  description: string
  in_stock: boolean
  /** Marked when the product is physically available at the storefront. */
  in_local_stock: boolean
  /** Internal: number of units available at the storefront. Hidden from
   *  customers; controls visibility of the product on `/local` (zero hides). */
  local_stock_count: number
  in_offer: boolean
  offer_percent: number
  coming_soon: boolean
  /** Surfaces the product in the home "Novedades" section. */
  is_novelty: boolean
  created_at: string
}

/** Maximum extra images stored in `additional_images` (gallery cap = MAX_ADDITIONAL_IMAGES + 1). */
export const MAX_ADDITIONAL_IMAGES = 4

// Client-safe functions
export async function getProducts() {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("productos_fullspin")
    .select("*")
    .eq("in_stock", true)
    .eq("coming_soon", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data
}

// Función para el admin que incluye todos los productos (incluso los que no están en stock)
export async function getAllProducts() {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("productos_fullspin")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all products:", error)
    return []
  }
  return data
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("productos_fullspin")
    .select("*")
    .eq("category", category)
    .eq("in_stock", true)
    .eq("coming_soon", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
  return data
}

export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("productos_fullspin")
    .select("*")
    .eq("category", category)
    .eq("subcategory", subcategory)
    .eq("in_stock", true)
    .eq("coming_soon", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products by subcategory:", error)
    return []
  }
  return data
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = createBrowserClient()
  
  // Buscar por nombre, marca y categoría
  const { data, error } = await supabase
    .from("productos_fullspin")
    .select("*")
    .or(`name.ilike.%${query}%,marca.ilike.%${query}%,category.ilike.%${query}%`)
    .eq("in_stock", true)
    .eq("coming_soon", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching products:", error)
    return []
  }
  return data
}
