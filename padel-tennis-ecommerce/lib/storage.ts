import { supabase } from "./supabase"

export async function uploadProductImage(file: File, productCode: string): Promise<string | null> {
  try {
    // Crear un nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${productCode}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    // Subir el archivo a Supabase Storage
    const { data, error } = await supabase.storage.from("product-images").upload(filePath, file)

    if (error) {
      console.error("Error uploading image:", error)
      return null
    }

    // Obtener la URL pública de la imagen
    const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(filePath)

    return publicData.publicUrl
  } catch (error) {
    console.error("Error in uploadProductImage:", error)
    return null
  }
}

export async function updateProductImage(productId: number, imageUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("productos_fullspin").update({ image: imageUrl }).eq("id", productId)

    if (error) {
      console.error("Error updating product image:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateProductImage:", error)
    return false
  }
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  try {
    // Extraer el path del archivo de la URL
    const urlParts = imageUrl.split("/")
    const filePath = urlParts.slice(-2).join("/") // products/filename.jpg

    const { error } = await supabase.storage.from("product-images").remove([filePath])

    if (error) {
      console.error("Error deleting image:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteProductImage:", error)
    return false
  }
}
