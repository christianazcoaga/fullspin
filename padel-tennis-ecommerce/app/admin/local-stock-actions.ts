"use server"

import { revalidatePath } from "next/cache"

import { updateProduct } from "@/lib/products.server"

/**
 * Toggle whether a product is physically available at the storefront.
 * Lives in its own action so the regular product update form never has to
 * carry / overwrite this field.
 *
 * UX guarantees enforced server-side:
 * - Turning ON: bumps count to at least 1 (a product flagged "in local"
 *   with count=0 would be invisible on /local; the toggle defaulting to 0
 *   would make the switch look broken).
 * - Turning OFF: resets count to 0 so a future re-toggle starts clean.
 */
export async function toggleLocalStockAction(
  productId: number,
  inLocalStock: boolean,
  currentCount: number = 0
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const nextCount = inLocalStock
      ? Math.max(1, Math.floor(currentCount) || 0)
      : 0

    const updated = await updateProduct(productId, {
      in_local_stock: inLocalStock,
      local_stock_count: nextCount,
    })
    if (!updated) {
      return { success: false, error: "No se pudo actualizar el stock en local." }
    }

    revalidatePath("/admin")
    revalidatePath("/local")
    return { success: true, count: nextCount }
  } catch (err) {
    console.error("toggleLocalStockAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}

/**
 * Set the physical-unit count for a product. Negative values are clamped
 * to 0; non-finite values are rejected. The `/local` page hides products
 * with count = 0 even if `in_local_stock` is still true.
 */
export async function setLocalStockCountAction(
  productId: number,
  count: number
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    if (!Number.isFinite(count)) {
      return { success: false, error: "Cantidad inválida." }
    }
    const safe = Math.max(0, Math.floor(count))

    const updated = await updateProduct(productId, { local_stock_count: safe })
    if (!updated) {
      return { success: false, error: "No se pudo actualizar la cantidad." }
    }

    revalidatePath("/admin")
    revalidatePath("/local")
    return { success: true, count: safe }
  } catch (err) {
    console.error("setLocalStockCountAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}
