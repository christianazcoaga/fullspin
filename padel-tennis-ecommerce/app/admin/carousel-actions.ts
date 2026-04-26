"use server"

import { revalidatePath } from "next/cache"

import type { CarouselSlide } from "@/lib/home-carousel"
import {
  createCarouselSlide,
  deleteCarouselSlide,
  updateCarouselSlide,
} from "@/lib/home-carousel.server"
import { deleteProductImage, uploadAssetImage } from "@/lib/storage"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createCarouselSlideAction(
  formData: FormData
): Promise<ActionResult<CarouselSlide>> {
  try {
    const file = formData.get("image") as File | null
    const alt = ((formData.get("alt") as string | null) ?? "").trim()
    const orderRaw = formData.get("display_order") as string | null

    if (!file || file.size === 0) {
      return { success: false, error: "Subí una imagen para el banner." }
    }

    const image_url = await uploadAssetImage(file, "carousel")
    const created = await createCarouselSlide({
      image_url,
      alt,
      display_order: orderRaw ? Number(orderRaw) || 0 : 0,
    })

    if (!created) {
      await deleteProductImage(image_url)
      return { success: false, error: "No se pudo crear el banner." }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, data: created }
  } catch (err) {
    console.error("createCarouselSlideAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}

export async function updateCarouselSlideAction(
  id: number,
  formData: FormData
): Promise<ActionResult<CarouselSlide>> {
  try {
    const file = formData.get("image") as File | null
    const alt = formData.get("alt") as string | null
    const orderRaw = formData.get("display_order") as string | null
    const replaceUrl = formData.get("replace_url") as string | null

    const patch: Partial<Pick<CarouselSlide, "image_url" | "alt" | "display_order">> = {}
    if (alt !== null) patch.alt = alt.trim()
    if (orderRaw !== null && orderRaw !== "") {
      patch.display_order = Number(orderRaw) || 0
    }

    if (file && file.size > 0) {
      const url = await uploadAssetImage(file, "carousel")
      patch.image_url = url
      if (replaceUrl) await deleteProductImage(replaceUrl)
    }

    const updated = await updateCarouselSlide(id, patch)
    if (!updated) return { success: false, error: "No se pudo actualizar el banner." }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, data: updated }
  } catch (err) {
    console.error("updateCarouselSlideAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}

export async function deleteCarouselSlideAction(
  id: number,
  imageUrl: string
): Promise<ActionResult<null>> {
  try {
    const ok = await deleteCarouselSlide(id)
    if (!ok) return { success: false, error: "No se pudo eliminar el banner." }
    if (imageUrl) await deleteProductImage(imageUrl)

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, data: null }
  } catch (err) {
    console.error("deleteCarouselSlideAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}
