"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { createProductAction } from "@/app/admin/actions"

interface ProductCreateFormProps {
  onProductCreated: (newProduct: Product) => void
}

const categories = ["padel", "tenis-mesa"]
const subcategories: { [key: string]: string[] } = {
  padel: ["palas", "zapatillas", "pelotas", "bolsos", "ropa", "accesorios"],
  "tenis-mesa": ["paletas", "gomas", "pelotas", "mesas", "ropa", "accesorios"],
}

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "padel",
  subcategory: "palas",
  in_stock: true,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creando..." : "Crear Producto"}
    </Button>
  )
}

export function ProductCreateForm({ onProductCreated }: ProductCreateFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [currentCategory, setCurrentCategory] = useState(initialFormData.category)
  const [inStock, setInStock] = useState(initialFormData.in_stock)

  const handleCreateAction = async (formData: FormData) => {
    setError(null)
    formData.set("in_stock", inStock ? "true" : "false")
    const productData = {
      name: formData.get("name") as string,
      marca: formData.get("marca") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string,
      in_stock: formData.get("in_stock") === "true",
      image: uploadedImageUrl || "",
    }
    const result = await createProductAction(productData)
    if (result.success && result.data) {
      onProductCreated(result.data)
    } else {
      setError(result.error || "Ocurrió un error al crear el producto.")
    }
  }

  // A temporary product object to pass to ImageUpload
  // The ID is 0, which signals to our upload action that this is a new product
  const tempProductForUpload: Product = {
    id: 0,
    name: "Nuevo Producto",
    image: uploadedImageUrl || "",
    marca: "",
    category: currentCategory,
    subcategory: "",
    price: 0,
    description: "",
    in_stock: true,
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreateAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" required />
            </div>

            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" />
            </div>

            <div>
              <Label htmlFor="price">Precio (ARS)</Label>
              <Input id="price" name="price" type="number" step="0.01" required />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" rows={4} />
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                name="category"
                defaultValue={initialFormData.category}
                onValueChange={setCurrentCategory}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategoría</Label>
              <Select name="subcategory" defaultValue={initialFormData.subcategory} key={currentCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories[currentCategory]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="in_stock" name="in_stock" checked={inStock} onCheckedChange={setInStock} />
              <Label htmlFor="in_stock" className="cursor-pointer">
                Disponible en Stock
              </Label>
            </div>
            
            <SubmitButton />

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Imagen del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            product={tempProductForUpload}
            onImageUpdated={setUploadedImageUrl}
          />
        </CardContent>
      </Card>
    </div>
  )
} 