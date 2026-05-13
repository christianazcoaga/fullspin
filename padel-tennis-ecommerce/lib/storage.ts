import sharp from "sharp"
import { createClient } from "./supabase/server"
import { cookies } from "next/headers"
import { MAX_ADDITIONAL_IMAGES } from "./products"

const BUCKET_NAME = "images"

// Product image normalization: detect non-white bbox, recanvas to a square
// white background with a fixed relative padding, then resize to a uniform
// output size. Guarantees every product photo occupies a consistent share of
// the card area in the grid. Keep these in sync with
// scripts/fix-product-image-framing.mjs.
const NORMALIZE_PADDING = 0.08
const NORMALIZE_OUTPUT_SIZE = 1000
const WHITE_THRESHOLD = 238

async function normalizeProductImageBuffer(input: Buffer): Promise<Buffer> {
  const flattened = sharp(input).flatten({ background: "#ffffff" })
  const { data, info } = await flattened
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info

  let minX = w
  let minY = h
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * channels
      if (
        data[i] < WHITE_THRESHOLD ||
        data[i + 1] < WHITE_THRESHOLD ||
        data[i + 2] < WHITE_THRESHOLD
      ) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) {
    // Blank image — return a webp-encoded copy at the target size rather than fail.
    return sharp(input)
      .flatten({ background: "#ffffff" })
      .resize(NORMALIZE_OUTPUT_SIZE, NORMALIZE_OUTPUT_SIZE, {
        fit: "contain",
        background: "#ffffff",
      })
      .webp({ quality: 88 })
      .toBuffer()
  }

  const bboxW = maxX - minX + 1
  const bboxH = maxY - minY + 1
  const longBbox = Math.max(bboxW, bboxH)
  const canvas = Math.round(longBbox / (1 - 2 * NORMALIZE_PADDING))
  const padTop = Math.round((canvas - bboxH) / 2)
  const padLeft = Math.round((canvas - bboxW) / 2)
  const padBottom = canvas - bboxH - padTop
  const padRight = canvas - bboxW - padLeft

  // sharp applies `extend` after `resize` regardless of call order, so we
  // materialize extract+extend to a buffer first, then resize separately.
  const padded = await sharp(input)
    .flatten({ background: "#ffffff" })
    .extract({ left: minX, top: minY, width: bboxW, height: bboxH })
    .extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: "#ffffff",
    })
    .toBuffer()

  return sharp(padded)
    .resize(NORMALIZE_OUTPUT_SIZE, NORMALIZE_OUTPUT_SIZE, {
      fit: "contain",
      background: "#ffffff",
    })
    .webp({ quality: 88 })
    .toBuffer()
}

export async function uploadProductImage(file: File, productId: number | string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!file) {
    throw new Error("No file provided for upload.")
  }

  const original = Buffer.from(await file.arrayBuffer())
  let normalized: Buffer
  try {
    normalized = await normalizeProductImageBuffer(original)
  } catch (err) {
    console.error("Image normalization failed, uploading original:", err)
    normalized = original
  }
  const fileExt = normalized === original ? (file.name.split(".").pop() ?? "bin") : "webp"
  const contentType = normalized === original ? file.type || "application/octet-stream" : "image/webp"
  const fileName = `${productId}-${Date.now()}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, normalized, { contentType })

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

/**
 * Upload an arbitrary asset (brand logo, carousel banner, …) to a given
 * subfolder of the images bucket. Returns a long-lived signed URL.
 */
export async function uploadAssetImage(
  file: File,
  folder: "brands" | "carousel"
): Promise<string> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!file) {
    throw new Error("No file provided for upload.")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading asset:", uploadError)
    throw uploadError
  }

  const { data, error: signError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10)

  if (signError) {
    throw signError
  }

  return data.signedUrl
}

/**
 * Append an image URL to a product's `additional_images` array. Caps the
 * array at MAX_ADDITIONAL_IMAGES; returns the new array on success.
 */
export async function addProductAdditionalImage(
  productId: number,
  imageUrl: string
): Promise<string[] | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Read current array first so we can enforce the cap server-side.
  const { data: row, error: readError } = await supabase
    .from("productos_fullspin")
    .select("additional_images")
    .eq("id", productId)
    .single()

  if (readError || !row) {
    console.error("Error reading additional_images:", readError)
    return null
  }

  const current: string[] = Array.isArray(row.additional_images)
    ? row.additional_images
    : []

  if (current.length >= MAX_ADDITIONAL_IMAGES) {
    return null
  }

  const next = [...current, imageUrl]

  const { data, error } = await supabase
    .from("productos_fullspin")
    .update({ additional_images: next })
    .eq("id", productId)
    .select("additional_images")
    .single()

  if (error || !data) {
    console.error("Error updating additional_images:", error)
    return null
  }

  return data.additional_images
}

/**
 * Remove a single URL from `additional_images`. Returns the new array on success.
 * Storage cleanup is the caller's responsibility (so we can compose with
 * `deleteProductImage`).
 */
export async function removeProductAdditionalImage(
  productId: number,
  imageUrl: string
): Promise<string[] | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: row, error: readError } = await supabase
    .from("productos_fullspin")
    .select("additional_images")
    .eq("id", productId)
    .single()

  if (readError || !row) {
    console.error("Error reading additional_images:", readError)
    return null
  }

  const current: string[] = Array.isArray(row.additional_images)
    ? row.additional_images
    : []
  const next = current.filter((url) => url !== imageUrl)

  const { data, error } = await supabase
    .from("productos_fullspin")
    .update({ additional_images: next })
    .eq("id", productId)
    .select("additional_images")
    .single()

  if (error || !data) {
    console.error("Error removing from additional_images:", error)
    return null
  }

  return data.additional_images
}
