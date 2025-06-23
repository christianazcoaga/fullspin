import { createClient } from "./supabase/server"
import { cookies } from "next/headers"
import { Product } from "./products"

const BUCKET_NAME = "images"

export async function uploadProductImage(file: File, productId: number | string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!file) {
    throw new Error("No file provided for upload.")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${productId}-${Date.now()}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading file:", uploadError)
    throw uploadError
  }

  // Generar una URL firmada con una validez larga (ej. 10 años)
  const { data, error: signError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10) // 10 años en segundos

  if (signError) {
    throw signError
  }

  return data.signedUrl
}

export async function updateProductImage(productId: number, imageUrl: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("productos_fullspin")
    .update({ image: imageUrl })
    .eq("id", productId)
    .select()
    .single()

  if (error) {
    console.error("Error updating product image URL in database:", error)
    return null
  }
  return data
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!imageUrl) return true // No image to delete

  try {
    const urlParts = new URL(imageUrl)
    const pathWithBucket = urlParts.pathname
    // Extraer el path del archivo desde la URL, que es todo lo que viene después del nombre del bucket
    // Ejemplo: /storage/v1/object/public/images/products/123.png -> products/123.png
    const filePath = pathWithBucket.substring(pathWithBucket.indexOf(BUCKET_NAME) + BUCKET_NAME.length + 1)
    
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      console.error("Error deleting image from storage:", error)
      // No devolvemos false aquí para permitir que la eliminación del producto continúe
      // si la imagen no se encuentra, lo cual puede pasar.
    }
    return true
  } catch (error) {
    console.error("Invalid URL or error parsing image URL for deletion:", error)
    return false
  }
}
