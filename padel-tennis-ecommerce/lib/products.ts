import { supabase } from "./supabase"

export type Product = {
  id: number
  name: string
  category: string
  subcategory: string
  price: number
  image: string
  description: string
  in_stock: boolean
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("productos_fullspin").select("*").eq("in_stock", true).order("name")

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
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

  return data || []
}

export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
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

  return data || []
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("productos_fullspin")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,code.ilike.%${query}%`)
    .eq("in_stock", true)
    .order("name")

  if (error) {
    console.error("Error searching products:", error)
    return []
  }

  return data || []
}
