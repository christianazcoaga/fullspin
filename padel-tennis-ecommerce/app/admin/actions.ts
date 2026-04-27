"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/products.server"
import type { Product } from "@/lib/products"
import {
  addProductAdditionalImage,
  deleteProductImage,
  removeProductAdditionalImage,
  updateProductImage,
  uploadProductImage,
} from "@/lib/storage"
import { updateConversionRateAndRecalculate } from "@/lib/settings.server"

export async function updateProductAction(productId: number, formData: FormData) {
  try {
    const updates = {
      name: formData.get("name") as string,
      marca: formData.get("marca") as string,
      price: parseFloat(formData.get("price") as string),
      price_usd: parseFloat(formData.get("price_usd") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string,
      in_stock: formData.get("in_stock") === "true",
      in_offer: formData.get("in_offer") === "true",
      offer_percent: Number(formData.get("offer_percent")) || 0,
      coming_soon: formData.get("coming_soon") === "true",
      is_novelty: formData.get("is_novelty") === "true",
      // Note: `in_local_stock` and `local_stock_count` are NOT touched
      // here. They're managed exclusively from the dedicated "Stock local"
      // admin tab via toggleLocalStockAction / setLocalStockCountAction.
    }

    const updatedProduct = await updateProduct(productId, updates)
    if (updatedProduct) {
      revalidatePath("/admin")
      return { success: true, data: updatedProduct }
    }
    return { success: false, error: "Failed to update product." }
  } catch (error) {
    console.error(error)
    return { success: false, error: "An error occurred while updating the product." }
  }
}

export async function deleteProductAction(productId: number, imageUrl: string | null) {
  try {
    if (imageUrl) {
      await deleteProductImage(imageUrl)
    }

    const success = await deleteProduct(productId)
    if (success) {
      revalidatePath("/admin")
      return { success: true }
    }
    return { success: false, error: "Failed to delete product." }
  } catch (error) {
    console.error(error)
    return { success: false, error: "An error occurred while deleting the product." }
  }
}

export async function uploadImageAction(
  formData: FormData,
  productId: number
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const file = formData.get("file") as File
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided." }
    }

    const imageUrl = await uploadProductImage(file, productId)

    // If it's an existing product, update the image URL in the DB
    if (productId !== 0) {
      const updated = await updateProductImage(productId, imageUrl)
      if (!updated) {
        return { success: false, error: "Failed to update product image in database." }
      }
    }

    revalidatePath("/admin")
    return { success: true, imageUrl }
  } catch (error) {
    console.error("Error in uploadImageAction:", error)
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
    return { success: false, error: errorMessage }
  }
}

/**
 * Upload an extra gallery image and append it to the product's
 * `additional_images` array. The DB layer enforces the cap (max 4 extras).
 */
export async function uploadAdditionalImageAction(
  formData: FormData,
  productId: number
): Promise<{
  success: boolean
  imageUrl?: string
  additionalImages?: string[]
  error?: string
}> {
  try {
    if (productId === 0) {
      return {
        success: false,
        error: "Guardá el producto primero antes de agregar fotos extras.",
      }
    }

    const file = formData.get("file") as File
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided." }
    }

    const imageUrl = await uploadProductImage(file, productId)
    const next = await addProductAdditionalImage(productId, imageUrl)

    if (!next) {
      // Append failed (cap reached or DB error) — clean up the orphan upload.
      await deleteProductImage(imageUrl)
      return {
        success: false,
        error:
          "No se pudo agregar la imagen. ¿Llegaste al máximo de 4 fotos extras?",
      }
    }

    revalidatePath("/admin")
    revalidatePath(`/producto/${productId}`)
    return { success: true, imageUrl, additionalImages: next }
  } catch (error) {
    console.error("Error in uploadAdditionalImageAction:", error)
    const msg = error instanceof Error ? error.message : "An unexpected error occurred."
    return { success: false, error: msg }
  }
}

/**
 * Remove a single image from `additional_images` and delete it from storage.
 */
export async function removeAdditionalImageAction(
  productId: number,
  imageUrl: string
): Promise<{ success: boolean; additionalImages?: string[]; error?: string }> {
  try {
    const next = await removeProductAdditionalImage(productId, imageUrl)
    if (!next) {
      return { success: false, error: "Failed to remove image from product." }
    }

    // Best-effort storage cleanup; we don't fail the action if the file
    // is already gone.
    await deleteProductImage(imageUrl)

    revalidatePath("/admin")
    revalidatePath(`/producto/${productId}`)
    return { success: true, additionalImages: next }
  } catch (error) {
    console.error("Error in removeAdditionalImageAction:", error)
    const msg = error instanceof Error ? error.message : "An unexpected error occurred."
    return { success: false, error: msg }
  }
}

// This action is slightly different as it might be called after an image is uploaded separately
export async function createProductAction(
  productData: Omit<Product, "id">
): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    const newProduct = await createProduct(productData);
    if (newProduct) {
      revalidatePath("/admin");
      return { success: true, data: newProduct };
    }
    return { success: false, error: "Failed to create product." };
  } catch (error) {
    console.error(error)
    return { success: false, error: "An error occurred while creating the product." }
  }
}

export async function updateConversionRateAction(newRate: number): Promise<{ 
  success: boolean; 
  updatedCount?: number;
  error?: string 
}> {
  try {
    const result = await updateConversionRateAndRecalculate(newRate)
    if (result.success) {
      revalidatePath("/admin")
      revalidatePath("/padel")
      revalidatePath("/tenis-mesa")
      revalidatePath("/tenis")
      revalidatePath("/ofertas")
    }
    return result
  } catch (error) {
    console.error("Error in updateConversionRateAction:", error)
    return { success: false, error: "Error inesperado al actualizar la tasa de conversión" }
  }
} 