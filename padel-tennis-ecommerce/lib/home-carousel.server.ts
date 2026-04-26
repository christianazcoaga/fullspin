"use server"

import { cookies } from "next/headers"

import { createClient } from "./supabase/server"
import type { CarouselSlide } from "./home-carousel"

export async function getCarouselSlides(): Promise<CarouselSlide[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("home_carousel")
    .select("*")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true })

  if (error) {
    console.error("Error fetching home carousel:", error)
    return []
  }
  return (data ?? []) as CarouselSlide[]
}

export async function createCarouselSlide(input: {
  image_url: string
  alt: string
  display_order?: number
}): Promise<CarouselSlide | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("home_carousel")
    .insert({
      image_url: input.image_url,
      alt: input.alt,
      display_order: input.display_order ?? 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating carousel slide:", error)
    return null
  }
  return data as CarouselSlide
}

export async function updateCarouselSlide(
  id: number,
  patch: Partial<Pick<CarouselSlide, "image_url" | "alt" | "display_order">>
): Promise<CarouselSlide | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("home_carousel")
    .update(patch)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating carousel slide:", error)
    return null
  }
  return data as CarouselSlide
}

export async function deleteCarouselSlide(id: number): Promise<boolean> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("home_carousel").delete().eq("id", id)
  if (error) {
    console.error("Error deleting carousel slide:", error)
    return false
  }
  return true
}
