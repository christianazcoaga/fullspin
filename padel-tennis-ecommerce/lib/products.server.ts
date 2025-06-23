"use server"

import { createClient } from "./supabase/server"
import { cookies } from "next/headers"
import type { Product } from "./products"

// Server-only functions (used by Server Actions)
export async function updateProduct(productId: number, updates: Partial<Product>) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("productos_fullspin")
    .update(updates)
    .eq("id", productId)
    .select()
    .single()
  
  if (error) {
    console.error("Error updating product:", error)
    return null
  }

  return data
}

export async function createProduct(
  newProduct: Omit<Product, "id">
): Promise<Product | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("productos_fullspin").insert(newProduct).select().single()

  if (error) {
    console.error("Error creating product:", error)
    return null
  }

  return data
}

export async function deleteProduct(productId: number): Promise<boolean> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("productos_fullspin").delete().eq("id", productId)

  if (error) {
    console.error("Error deleting product:", error)
    return false
  }

  return true
} 