"use client"

import type React from "react"
import { useRef, useState } from "react"

import { Upload, Check } from "lucide-react"

import { uploadImageAction } from "@/app/admin/actions"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  product: Product
  onImageUpdated: (newImageUrl: string) => void
}

export function ImageUpload({ product, onImageUpdated }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 5MB.")
      return
    }

    setUploading(true)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const result = await uploadImageAction(formData, product.id)

      if (result.success && result.imageUrl) {
        onImageUpdated(result.imageUrl)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        alert(`Error al subir la imagen.\n\nDetalles: ${result.error}`)
      }
    } catch (error) {
      console.error("Error processing image upload:", error)
      const msg =
        error instanceof Error ? error.message : "Ocurrió un error inesperado."
      alert(`Error al subir la imagen.\n\nDetalles: ${msg}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) handleFileUpload(files[0])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleFileUpload(files[0])
  }

  return (
    <div className="grid grid-cols-[88px_1fr] gap-3">
      {/* Preview thumb */}
      <div className="aspect-square w-full overflow-hidden rounded-md border border-brand-black/10 bg-white">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Drop zone — also clickable, opens the file picker */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        disabled={uploading}
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-3 py-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          dragOver
            ? "border-brand-blue-dark bg-brand-blue-dark/5"
            : "border-brand-black/20 hover:border-brand-blue-dark hover:bg-brand-blue-dark/5"
        )}
      >
        {uploading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-blue-dark border-t-transparent" />
            <p className="text-xs text-brand-black/60">Subiendo...</p>
          </>
        ) : success ? (
          <>
            <Check className="h-5 w-5 text-[hsl(var(--status-success-fg))]" />
            <p className="text-xs font-medium text-[hsl(var(--status-success-fg))]">
              ¡Imagen actualizada!
            </p>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 text-brand-black/50" />
            <p className="text-xs font-medium text-brand-black/70">
              Arrastrá una imagen o hacé click
            </p>
            <p className="text-[10px] text-brand-black/50">PNG/JPG/WEBP · 5MB</p>
          </>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />
    </div>
  )
}
