"use server"

import { revalidatePath } from "next/cache"

import { updateProduct } from "@/lib/products.server"

/**
 * Toggle whether a product is physically available at the storefront.
 * Lives in its own action so the regular product update form never has to
 * carry / overwrite this field.
 */
export async function toggleLocalStockAction(
  productId: number,
  inLocalStock: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const updated = await updateProduct(productId, { in_local_stock: inLocalStock })
    if (!updated) {
      return { success: false, error: "No se pudo actualizar el stock en local." }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("toggleLocalStockAction:", err)
    const msg = err instanceof Error ? err.message : "Error inesperado."
    return { success: false, error: msg }
  }
}
