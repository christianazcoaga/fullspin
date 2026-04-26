"use server"

import { cookies } from "next/headers"

import { createClient } from "./supabase/server"
import type { Brand, BrandSport } from "./brands"

/** Read all brands ordered by sport then display_order. */
export async function getAllBrands(): Promise<Brand[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("sport", { ascending: true })
    .order("display_order", { ascending: true })
    .order("id", { ascending: true })

  if (error) {
    console.error("Error fetching brands:", error)
    return []
  }
  return (data ?? []) as Brand[]
}

export async function createBrand(input: {
  name: string
  logo_url: string | null
  sport: BrandSport
  display_order?: number
}): Promise<Brand | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("brands")
    .insert({
      name: input.name,
      logo_url: input.logo_url,
      sport: input.sport,
      display_order: input.display_order ?? 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating brand:", error)
    return null
  }
  return data as Brand
}

export async function updateBrand(
  id: number,
  patch: Partial<Pick<Brand, "name" | "logo_url" | "sport" | "display_order">>
): Promise<Brand | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("brands")
    .update(patch)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating brand:", error)
    return null
  }
  return data as Brand
}

export async function deleteBrand(id: number): Promise<boolean> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("brands").delete().eq("id", id)
  if (error) {
    console.error("Error deleting brand:", error)
    return false
  }
  return true
}
