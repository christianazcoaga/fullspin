import { createClient as createBrowserClient } from "./supabase/client"

export type Product = {
  id: number
  name: string
  marca: string
  category: string
  subcategory: string
  price: number
  image: string
  description: string
  in_stock: boolean
  in_offer: boolean
  offer_percent: number
}

// Client-safe functions
export async function getProducts() {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("productos_fullspin")
    .select("*")
    .eq("in_stock", true)
    .order("name", { ascending: true })

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
    .order("name", { ascending: true })

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
    .order("name")

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
    .order("name")

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
    .order("name")

  if (error) {
    console.error("Error searching products:", error)
    return []
  }
  return data
}
