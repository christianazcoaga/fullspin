"use client"

import { useRef, useState } from "react"
import { Plus, Upload, X } from "lucide-react"

import {
  removeAdditionalImageAction,
  uploadAdditionalImageAction,
} from "@/app/admin/actions"
import { MAX_ADDITIONAL_IMAGES, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ProductGalleryEditorProps {
  product: Product
}

/**
 * Manages the `additional_images` array for an existing product. Renders
 * thumbnails for each extra image, an "Add" tile while under the cap, and
 * lets the admin remove any extra. Local state is seeded from `product`
 * and updated optimistically — the DB is the source of truth on next load.
 */
export function ProductGalleryEditor({ product }: ProductGalleryEditorProps) {
  const [images, setImages] = useState<string[]>(product.additional_images ?? [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const remaining = MAX_ADDITIONAL_IMAGES - images.length

  const handleAddClick = () => {
    setError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Tiene que ser una imagen.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen supera los 5MB.")
      return
    }

    setBusy(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const result = await uploadAdditionalImageAction(fd, product.id)
      if (result.success && result.additionalImages) {
        setImages(result.additionalImages)
      } else {
        setError(result.error ?? "No se pudo subir la imagen.")
      }
    } catch (err) {
      console.error(err)
      setError("Error inesperado al subir la imagen.")
    } finally {
      setBusy(false)
    }
  }

  const handleRemove = async (url: string) => {
    setBusy(true)
    setError(null)
    try {
      const result = await removeAdditionalImageAction(product.id, url)
      if (result.success && result.additionalImages) {
        setImages(result.additionalImages)
      } else {
        setError(result.error ?? "No se pudo eliminar la imagen.")
      }
    } catch (err) {
      console.error(err)
      setError("Error inesperado al eliminar la imagen.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-black">
          Fotos extras
        </h3>
        <span className="text-[11px] text-brand-black/55">
          {images.length}/{MAX_ADDITIONAL_IMAGES}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((url) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-md border border-brand-black/10 bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Imagen extra del producto"
              className="h-full w-full object-contain"
            />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              disabled={busy}
              aria-label="Eliminar imagen"
              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-black/70 text-brand-cream transition-opacity hover:bg-brand-black focus-visible:opacity-100 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={busy}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-brand-black/20 bg-white text-xs font-medium text-brand-black/60 transition-colors hover:border-brand-blue-dark hover:bg-brand-blue-dark/5 hover:text-brand-blue-dark",
              busy && "cursor-not-allowed opacity-60"
            )}
          >
            {busy ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue-dark border-t-transparent" />
                <span className="text-[10px]">Subiendo...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span className="text-[10px]">Agregar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-xs font-medium text-status-error-fg">{error}</p>
      )}
      {images.length === 0 && !busy && !error && (
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-brand-black/55">
          <Upload className="h-3 w-3" />
          Hasta {MAX_ADDITIONAL_IMAGES} imágenes adicionales (la principal se
          edita arriba).
        </p>
      )}
    </div>
  )
}
