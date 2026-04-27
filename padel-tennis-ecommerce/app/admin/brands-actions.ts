"use server"

import { revalidatePath } from "next/cache"

import type { Brand, BrandSport } from "@/lib/brands"
import { createBrand, deleteBrand, updateBrand } from "@/lib/brands.server"
import { deleteProductImage, uploadAssetImage } from "@/lib/storage"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createBrandAction(formData: FormData): Promise<
  ActionResult<Brand>
> {
  try {
    const name = (formData.get("name") as string | null)?.trim()
    const sport = formData.get("sport") as BrandSport | null
    const orderRaw = formData.get("display_order") as string | null
    const file = formData.get("logo") as File | null

    if (!name) return { success: false, error: "Falta el nombre de la marca." }
    if (!sport || !["padel", "tenis-mesa"].includes(sport)) {
      return { success: false, error: "Deporte inválido." }
    }

    let logo_url: string | null = null
    if (file && file.size > 0) {
      logo_url = await uploadAssetImage(file, "brands")
    }

    const created = await createBrand({
      name,
      logo_url,
      sport,
      display_order: orderRaw ? Number(orderRaw) || 0 : 0,
    })
    if (!created) {
      // If we uploaded a logo but the row insert failed, clean it up.
      if (logo_url) await deleteProductImage(logo_url)
      return { success: false, error: "No se pudo crear la marca." }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, data: created }
  } catch (err) {
    console.error("createBrandAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}

export async function updateBrandAction(
  id: number,
  formData: FormData
): Promise<ActionResult<Brand>> {
  try {
    const name = (formData.get("name") as string | null)?.trim()
    const sport = formData.get("sport") as BrandSport | null
    const orderRaw = formData.get("display_order") as string | null
    const file = formData.get("logo") as File | null
    const replaceUrl = formData.get("replace_url") as string | null

    const patch: Partial<Pick<Brand, "name" | "sport" | "display_order" | "logo_url">> = {}
    if (name) patch.name = name
    if (sport && ["padel", "tenis-mesa"].includes(sport)) patch.sport = sport
    if (orderRaw !== null && orderRaw !== "") patch.display_order = Number(orderRaw) || 0

    if (file && file.size > 0) {
      const url = await uploadAssetImage(file, "brands")
      patch.logo_url = url
      // Best-effort delete of the old logo (if it lived in our storage).
      if (replaceUrl) await deleteProductImage(replaceUrl)
    }

    const updated = await updateBrand(id, patch)
    if (!updated) return { success: false, error: "No se pudo actualizar la marca." }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, data: updated }
  } catch (err) {
    console.error("updateBrandAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}

export async function deleteBrandAction(
  id: number,
  logoUrl: string | null
): Promise<ActionResult<null>> {
  try {
    const ok = await deleteBrand(id)
    if (!ok) return { success: false, error: "No se pudo eliminar la marca." }
    if (logoUrl) await deleteProductImage(logoUrl)

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, data: null }
  } catch (err) {
    console.error("deleteBrandAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}
