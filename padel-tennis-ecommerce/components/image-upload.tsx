"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Check } from "lucide-react"
import { uploadProductImage, updateProductImage } from "@/lib/storage"
import type { Product } from "@/lib/products"

interface ImageUploadProps {
  product: Product
  onImageUpdated: (newImageUrl: string) => void
}

export function ImageUpload({ product, onImageUpdated }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("El archivo es demasiado grande. Máximo 5MB.")
      return
    }

    setUploading(true)
    setSuccess(false)

    try {
      // Subir imagen a Supabase Storage
      const imageUrl = await uploadProductImage(file, product.code)

      if (imageUrl) {
        // Actualizar el producto en la base de datos
        const updated = await updateProductImage(product.id, imageUrl)

        if (updated) {
          onImageUpdated(imageUrl)
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        } else {
          alert("Error al actualizar el producto")
        }
      } else {
        alert("Error al subir la imagen")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar la imagen")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Actualizar Imagen</CardTitle>
        <p className="text-sm text-gray-600">{product.name}</p>
        <p className="text-xs text-gray-500">Código: {product.code}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vista previa de imagen actual */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Zona de drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          ) : success ? (
            <div className="space-y-2">
              <Check className="h-8 w-8 text-green-500 mx-auto" />
              <p className="text-sm text-green-600">¡Imagen actualizada!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">Arrastra una imagen aquí o haz clic para seleccionar</p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 5MB</p>
            </div>
          )}
        </div>

        {/* Input de archivo */}
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="cursor-pointer"
        />

        {/* Botón alternativo */}
        <Button
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          disabled={uploading}
          className="w-full"
          variant="outline"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar Imagen
        </Button>
      </CardContent>
    </Card>
  )
}
