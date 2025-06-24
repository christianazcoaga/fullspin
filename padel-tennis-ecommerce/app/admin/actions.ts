"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/products.server"
import type { Product } from "@/lib/products"
import { deleteProductImage, uploadProductImage, updateProductImage } from "@/lib/storage"

export async function updateProductAction(productId: number, formData: FormData) {
  try {
    const updates = {
      name: formData.get("name") as string,
      marca: formData.get("marca") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string,
      in_stock: formData.get("in_stock") === "true",
      in_offer: formData.get("in_offer") === "true",
      offer_percent: Number(formData.get("offer_percent")) || 0,
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